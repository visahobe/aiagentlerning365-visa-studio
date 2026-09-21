import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  affiliates,
  applications,
  clients,
  demands,
  deployments,
  emailsLog,
  employers,
  payments,
  sequences,
} from "@/db/schema";
import {
  invoiceNo,
  makeTracking,
  PORTALS,
  STAGE_IDS,
  type StageId,
  type VisaCode,
  VISA,
} from "@/lib/ops";

export class WorkflowError extends Error {}

async function nextSequence(year: number) {
  await db.execute(sql`insert into sequences (year, last_value) values (${year}, 0) on conflict (year) do nothing`);
  const updated = await db.execute(sql`update sequences set last_value = last_value + 1 where year = ${year} returning last_value`);
  const row = updated.rows[0] as { last_value: number | string } | undefined;
  if (!row) {
    const [fallback] = await db.select().from(sequences).where(eq(sequences.year, year));
    return (fallback?.lastValue ?? 0) + 1;
  }
  return Number(row.last_value);
}

export async function allocateClientCode(countryCode: string, visaCode: VisaCode) {
  const year = new Date().getFullYear();
  const sequence = await nextSequence(year);
  return `WVC-${countryCode}-${visaCode}-${year}-${String(sequence).padStart(4, "0")}`;
}

async function logMail(input: {
  clientId?: string | null;
  email: string;
  subject: string;
  trigger: string;
  preview: string;
}) {
  await db.insert(emailsLog).values({
    clientId: input.clientId ?? null,
    recipientEmail: input.email,
    subject: input.subject,
    triggerType: input.trigger,
    bodyPreview: input.preview,
    sentStatus: true,
  });
}

export async function creditCommission(clientId: string) {
  const [client] = await db.select().from(clients).where(eq(clients.id, clientId));
  if (!client || client.commissionCredited || !client.affiliateId) return null;
  if (!(client.visaCode in VISA)) return null;
  const amount = VISA[client.visaCode as VisaCode].commission;
  const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, client.affiliateId));
  if (!affiliate) return null;
  await db
    .update(affiliates)
    .set({
      walletBalance: affiliate.walletBalance + amount,
      totalEarned: affiliate.totalEarned + amount,
    })
    .where(eq(affiliates.id, affiliate.id));
  await db.update(clients).set({ commissionCredited: true }).where(eq(clients.id, client.id));
  await logMail({
    clientId: client.id,
    email: affiliate.email,
    subject: `আপনার রেফার করা ক্লায়েন্ট ${client.fullName} এর ফাইল Approved হয়েছে - কমিশন ${amount.toLocaleString("bn-BD")} টাকা যোগ হয়েছে`,
    trigger: "affiliate_commission",
    preview: `রেফারেল ${affiliate.referralCode} এর ওয়ালেটে ${amount} টাকা ক্রেডিট হয়েছে। উত্তোলন ড্যাশবোর্ড থেকে রিকোয়েস্ট করা যাবে।`,
  });
  return amount;
}

export async function moveClient(clientId: string, nextStatus: StageId | "rejected", reason?: string) {
  const [client] = await db.select().from(clients).where(eq(clients.id, clientId));
  if (!client) throw new WorkflowError("ক্লায়েন্ট পাওয়া যায়নি।");
  const now = new Date();
  const email = client.email || "info@worldvisionconsultancy.com";

  if (nextStatus === "rejected") {
    await db
      .update(clients)
      .set({
        status: "rejected",
        rejectionReason: reason || "কারণ উল্লেখ করা হয়নি।",
        updatedAt: now,
        stageEnteredAt: now,
      })
      .where(eq(clients.id, client.id));
    await db
      .update(applications)
      .set({ portalStatus: "Rejected", notes: reason || "Rejected by operations." })
      .where(eq(applications.clientId, client.id));
    await logMail({
      clientId: client.id,
      email,
      subject: `ফাইল প্রত্যাখ্যান নোটিশ — ${client.clientCode}`,
      trigger: "rejection",
      preview: reason || "ফাইল প্রত্যাখ্যাত হয়েছে। আপিলের ধাপ অফিস থেকে জানানো হবে।",
    });
    return nextStatus;
  }

  const currentIndex = STAGE_IDS.indexOf(client.status as StageId);
  const nextIndex = STAGE_IDS.indexOf(nextStatus);
  if (client.status === "rejected") throw new WorkflowError("প্রত্যাখ্যাত ফাইল সরাসরি এগোানো যাবে না।");
  if (nextIndex !== currentIndex + 1) throw new WorkflowError("ফাইল শুধু পরের কলামে সরানো যাবে।");

  await db
    .update(clients)
    .set({ status: nextStatus, updatedAt: now, stageEnteredAt: now })
    .where(eq(clients.id, client.id));

  const patch: {
    stage: string;
    permitSubmissionDate?: Date;
    embassyDate?: Date;
    govTrackingCode?: string;
    portal?: string;
    portalStatus?: string;
    notes?: string;
  } = { stage: nextStatus };

  if (nextStatus === "permit_submitted") {
    const tracking = makeTracking(client.countryCode);
    patch.permitSubmissionDate = now;
    patch.govTrackingCode = tracking;
    patch.portal = PORTALS[client.countryCode] ?? "Consular portal";
    patch.portalStatus = "Supervised submission packet marked ready";
    await logMail({
      clientId: client.id,
      email,
      subject: `Work Permit Application Submitted for ${client.fullName}`,
      trigger: "permit_submission",
      preview: `ট্র্যাকিং রেফারেন্স ${tracking}। পোর্টাল: ${patch.portal}। এটি অভ্যন্তরীণ অপারেশনস লগ — বাইরের সরকারি সাইটে অটো-সাবমিট হয়নি।`,
    });
    if (client.demandId) {
      const [demand] = await db.select().from(demands).where(eq(demands.id, client.demandId));
      if (demand) {
        const [employer] = await db.select().from(employers).where(eq(employers.id, demand.employerId));
        if (employer) {
          await logMail({
            clientId: client.id,
            email: employer.email,
            subject: `Work Permit Application Submitted for ${client.fullName}`,
            trigger: "permit_submission_employer",
            preview: `${employer.companyName} এর ডিমান্ড ${demand.demandLetterRef} এর বিপরীতে ফাইল প্রস্তুত। রেফারেন্স ${tracking}।`,
          });
        }
      }
    }
  }

  if (nextStatus === "embassy_review") {
    patch.embassyDate = now;
    patch.portalStatus = "Consular packet handed to embassy desk";
    await logMail({
      clientId: client.id,
      email,
      subject: "আপনার ফাইল এম্বাসিতে জমা হয়েছে",
      trigger: "embassy_submission",
      preview: `${client.fullName}, আপনার পাসপোর্ট ভিসা স্ট্যাম্পিংয়ের জন্য কনস্যুলার পর্যালোচনায় আছে। আইডি ${client.clientCode}।`,
    });
  }

  if (nextStatus === "visa_approved") {
    patch.portalStatus = "Visa granted";
    await creditCommission(client.id);
    await logMail({
      clientId: client.id,
      email,
      subject: `অভিনন্দন — ভিসা অনুমোদিত ${client.clientCode}`,
      trigger: "approval",
      preview: "অনুমোদনের সফটকপি অপারেশনস ডসিয়ারে সংরক্ষিত। পাসপোর্ট ডেলিভারির সময় জানানো হবে।",
    });
  }

  if (nextStatus === "deployed") {
    patch.portalStatus = "Deployed";
    const pnr = `WV${client.clientCode.slice(-4)}`;
    await db.insert(deployments).values({
      clientId: client.id,
      flightDate: new Date(Date.now() + 10 * 86400000),
      airline: "Biman Bangladesh",
      pnrNumber: pnr,
      airportPickupStatus: false,
      briefing: "নিয়োগকর্তার পিকআপ ডেস্ক, সিম কার্ড ও জরুরি নম্বর ব্রিফিংয়ে থাকবে।",
    });
    await logMail({
      clientId: client.id,
      email,
      subject: `চূড়ান্ত ফ্লাইট ও ডিপ্লয়মেন্ট ব্রিফিং — ${client.clientCode}`,
      trigger: "flight_briefing",
      preview: `পিএনআর ${pnr}। এয়ারলাইন Biman Bangladesh। গন্তব্য নিয়োগকর্তার যোগাযোগ ডসিয়ারে আছে।`,
    });
  }

  if (nextStatus === "docs_verified") {
    await logMail({
      clientId: client.id,
      email,
      subject: `ডকুমেন্ট যাচাই সম্পন্ন — ${client.clientCode}`,
      trigger: "docs_verified",
      preview: "পাসপোর্ট মেয়াদ, ছবি ও ক্লিয়ারেন্স ফিল্টার উত্তীর্ণ। পরের ধাপ নিয়োগকর্তা ম্যাচ।",
    });
  }

  if (nextStatus === "employer_selected") {
    await logMail({
      clientId: client.id,
      email,
      subject: `We have a new candidate for your demand - ${client.skill} - CV Attached`,
      trigger: "candidate_match",
      preview: `${client.fullName} এর স্কিল ${client.skill} একটি খোলা ডিমান্ডের সাথে মিলেছে। পাসপোর্ট ডেটা শিট ডসিয়ারে আছে।`,
    });
  }

  await db.update(applications).set(patch).where(eq(applications.clientId, client.id));
  return nextStatus;
}

export async function recordPayment(input: {
  clientId: string;
  amount: number;
  method: string;
  stage: string;
  trxId?: string;
}) {
  const [client] = await db.select().from(clients).where(eq(clients.id, input.clientId));
  if (!client) throw new WorkflowError("ক্লায়েন্ট পাওয়া যায়নি।");
  if (input.amount <= 0) throw new WorkflowError("পরিমাণ শূন্যের বেশি হতে হবে।");
  const invoice = invoiceNo();
  await db.insert(payments).values({
    clientId: client.id,
    amount: Math.round(input.amount),
    paymentMethod: input.method,
    paymentStage: input.stage,
    invoiceNo: invoice,
    trxId: input.trxId || null,
  });
  await logMail({
    clientId: client.id,
    email: client.email || "info@worldvisionconsultancy.com",
    subject: `ইনভয়েস ${invoice} — ${input.amount.toLocaleString("bn-BD")} টাকা`,
    trigger: "invoice",
    preview: `${input.stage} পেমেন্ট ${input.method} এর মাধ্যমে লেজারে যুক্ত হয়েছে। ট্রানজ্যাকশন ${input.trxId || "ম্যানুয়াল"}।`,
  });
  return invoice;
}
