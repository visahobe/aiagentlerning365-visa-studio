import { eq } from "drizzle-orm";
import { db } from "@/db";
import { affiliates, applications, clients, emailsLog, payments } from "@/db/schema";
import { ensureSeed } from "@/lib/data";
import {
  BANK_MINIMUM,
  buildMrz,
  daysUntil,
  invoiceNo,
  PACKAGES,
  type VisaCode,
  VISA,
} from "@/lib/ops";
import { allocateClientCode } from "@/lib/workflow";

export const dynamic = "force-dynamic";

type ApplyBody = {
  fullName?: string;
  passportNo?: string;
  passportExpiry?: string;
  phone?: string;
  email?: string;
  age?: number;
  skill?: string;
  countryCode?: string;
  visaCode?: string;
  policeClearanceDate?: string;
  bankBalance?: number;
  photoScore?: number;
  ratioOk?: boolean;
  whiteBackground?: boolean;
  referralCode?: string;
  advanceAmount?: number;
  paymentMethod?: string;
  trxId?: string;
  samplePhoto?: boolean;
};

export async function POST(request: Request) {
  await ensureSeed();
  const body = (await request.json()) as ApplyBody;
  const errors: string[] = [];
  const name = body.fullName?.trim() ?? "";
  const passport = body.passportNo?.trim().toUpperCase() ?? "";
  const expiry = body.passportExpiry ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() || null;
  const skill = body.skill?.trim() ?? "";
  const countryCode = body.countryCode ?? "";
  const visaCode = body.visaCode ?? "";
  const age = Number(body.age);
  const bankBalance = Number(body.bankBalance ?? 0);
  const photoScore = body.samplePhoto ? 142 : Number(body.photoScore ?? 0);
  const ratioOk = body.samplePhoto ? true : Boolean(body.ratioOk);
  const whiteBackground = body.samplePhoto ? true : Boolean(body.whiteBackground);

  if (name.length < 3) errors.push("পূর্ণ নাম কমপক্ষে ৩ অক্ষরের হতে হবে।");
  if (!/^[A-Z]{1,2}\d{6,8}$/.test(passport)) errors.push("পাসপোর্ট নম্বর A1234567 বা EA1234567 ফরম্যাটে দিন।");
  if (!expiry) errors.push("পাসপোর্টের মেয়াদোত্তীর্ণের তারিখ দিন।");
  else if (daysUntil(expiry) < 180) errors.push("পাসপোর্টের অবশিষ্ট মেয়াদ ১৮০ দিনের কম। আবেদন ব্লক করা হয়েছে।");
  if (!/^(\+?880|0)1[3-9]\d{8}$/.test(phone)) errors.push("বাংলাদেশি মোবাইল নম্বর দিন, যেমন 017XXXXXXXX।");
  if (!skill) errors.push("দক্ষতা বা ভ্রমণের উদ্দেশ্য লিখুন।");
  if (!PACKAGES[countryCode]) errors.push("আটটি কৌশলগত দেশের একটি বেছে নিন।");
  if (!(visaCode in VISA)) errors.push("ভিসা শ্রেণি নির্বাচন করুন।");
  if (!Number.isFinite(age)) errors.push("বয়স সংখ্যায় দিন।");
  else if (visaCode === "WRK" && (age < 18 || age > 55)) errors.push("ওয়ার্ক ভিসায় বয়স ১৮ থেকে ৫৫ হতে হবে।");
  else if (visaCode === "VIS" && (age < 18 || age > 70)) errors.push("ভিজিটর ভিসায় বয়স ১৮ থেকে ৭০ হতে হবে।");
  else if (visaCode === "SLF" && (age < 21 || age > 65)) errors.push("সেলফ-স্পন্সরশিপে বয়স ২১ থেকে ৬৫ হতে হবে।");

  if (!body.policeClearanceDate) errors.push("পুলিশ ক্লিয়ারেন্সের ইস্যু তারিখ দিন।");
  else {
    const ageDays = daysUntil(body.policeClearanceDate);
    if (ageDays > 0) errors.push("ক্লিয়ারেন্সের তারিখ ভবিষ্যতের হতে পারে না।");
    if (ageDays < -90) errors.push("পুলিশ ক্লিয়ারেন্স ৯০ দিনের বেশি পুরনো। হালনাগাদ করুন।");
  }

  if (visaCode in VISA && bankBalance < BANK_MINIMUM[visaCode as VisaCode]) {
    errors.push(`ব্যাংক ব্যালেন্স ন্যূনতম ${BANK_MINIMUM[visaCode as VisaCode].toLocaleString("bn-BD")} টাকা হতে হবে।`);
  }
  if (!body.samplePhoto && photoScore < 100) errors.push("ছবির শার্পনেস স্কোর ১০০-এর নিচে। ঘোলা ছবি প্রত্যাখ্যাত।");
  if (!ratioOk) errors.push("ছবির অনুপাত ৩৫×৪৫ মিমি-এর কাছাকাছি নয়।");
  if (!whiteBackground) errors.push("ছবির কোণার ব্যাকগ্রাউন্ড যথেষ্ট সাদা নয়।");

  const advance = Number(body.advanceAmount ?? 0);
  if (advance < 0) errors.push("অগ্রিম ফি ঋণাত্মক হতে পারে না।");
  if (advance > 0 && !body.paymentMethod) errors.push("পেমেন্ট মাধ্যম বেছে নিন।");

  let affiliateId: string | null = null;
  const referral = body.referralCode?.trim().toUpperCase();
  if (referral) {
    const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.referralCode, referral));
    if (!affiliate) errors.push("রেফারেল কোড পাওয়া যায়নি।");
    else affiliateId = affiliate.id;
  }

  if (errors.length) return Response.json({ ok: false, errors }, { status: 400 });

  const visa = visaCode as VisaCode;
  const contractValue = PACKAGES[countryCode][visa];
  const clientCode = await allocateClientCode(countryCode, visa);
  const [client] = await db
    .insert(clients)
    .values({
      clientCode,
      fullName: name,
      passportNo: passport,
      passportExpiry: expiry,
      phone,
      email,
      age,
      skill,
      countryCode,
      visaCode: visa,
      status: "new_lead",
      affiliateId,
      contractValue,
      photoScore,
      policeClearanceDate: body.policeClearanceDate,
      bankBalance,
      mrzLine: buildMrz(passport, expiry, name),
      validationNotes: body.samplePhoto
        ? "ডেমো নমুনা ছবি ব্যবহার করা হয়েছে। প্রোডাকশনে লাইভ ক্যামেরা ফিল্টার চলবে।"
        : "ক্লায়েন্ট-সাইড ল্যাপ্লাসিয়ান স্কোর ও মেয়াদ ফিল্টার উত্তীর্ণ।",
    })
    .returning();

  await db.insert(applications).values({
    clientId: client.id,
    stage: "new_lead",
    portal: countryCode,
    portalStatus: "Onboarding received",
    notes: "Waiting for document desk review.",
  });

  if (advance > 0) {
    await db.insert(payments).values({
      clientId: client.id,
      amount: Math.round(advance),
      paymentMethod: body.paymentMethod || "bKash",
      paymentStage: "Advance",
      invoiceNo: invoiceNo(),
      trxId: body.trxId || null,
    });
  }

  await db.insert(emailsLog).values({
    clientId: client.id,
    recipientEmail: email || "info@worldvisionconsultancy.com",
    subject: `আপনার ফাইল সফলভাবে জমা হয়েছে - আইডি: ${clientCode}`,
    triggerType: "onboarding",
    bodyPreview: `প্রিয় ${name}, আপনার ইউনিক আইডি ${clientCode}। লগইন এই ট্র্যাকিং কোড। প্রেরক পরিচয় info@worldvisionconsultancy.com।`,
  });

  return Response.json({
    ok: true,
    clientCode,
    contractValue,
    due: Math.max(contractValue - Math.max(advance, 0), 0),
  });
}
