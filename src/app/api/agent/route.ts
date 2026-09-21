import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { agentRuns, applications, clients } from "@/db/schema";
import { ensureSeed } from "@/lib/data";
import { COUNTRIES } from "@/lib/countries";
import { STAGE_IDS, type StageId } from "@/lib/ops";
import { moveClient, WorkflowError } from "@/lib/workflow";

export const dynamic = "force-dynamic";

function shiftNow() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone: "Asia/Dhaka" }).format(new Date()),
  );
  if (hour < 11) return "09:00";
  if (hour < 18) return "14:00";
  return "21:00";
}

export async function GET() {
  await ensureSeed();
  const runs = await db.select().from(agentRuns).orderBy(desc(agentRuns.createdAt)).limit(24);
  return Response.json({ ok: true, runs, shift: shiftNow() });
}

export async function POST(request: Request) {
  await ensureSeed();
  const body = (await request.json()) as { action?: string; clientId?: string; countryCode?: string };
  try {
    if (body.action === "scan") {
      const targets = body.countryCode ? COUNTRIES.filter((country) => country.code === body.countryCode) : COUNTRIES;
      const created = [];
      for (const country of targets) {
        const slots = country.code === "SRB" || country.code === "SAU" ? 1 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2);
        const [run] = await db
          .insert(agentRuns)
          .values({
            countryCode: country.code,
            portal: country.portal,
            runType: "slot_scan",
            shift: shiftNow(),
            slotsFound: slots,
            result:
              slots > 0
                ? `${country.nameBn}: সিমুলেটেড ক্যালেন্ডারে ${slots}টি খালি স্লট চিহ্নিত। অপেক্ষমাণ ফাইলের জন্য ম্যানুয়াল লক সুপারিশ।`
                : `${country.nameBn}: এই শিফটে নতুন স্লট দেখা যায়নি। পরের উইন্ডো ০৯:০০ / ১৪:০০ / ২১:০০ BST।`,
          })
          .returning();
        created.push(run);
      }
      return Response.json({ ok: true, runs: created, note: "কোনো বাহ্যিক পোর্টালে সংযোগ করা হয়নি।" });
    }

    if (body.action === "status" || body.action === "submit") {
      if (!body.clientId) throw new WorkflowError("ক্লায়েন্ট বেছে নিন।");
      const [client] = await db.select().from(clients).where(eq(clients.id, body.clientId));
      if (!client) throw new WorkflowError("ক্লায়েন্ট নেই।");
      if (body.action === "submit") {
        const index = STAGE_IDS.indexOf(client.status as StageId);
        if (client.status !== "employer_selected" && client.status !== "docs_verified") {
          throw new WorkflowError("সাবমিশন প্যাকেট শুধু ডকুমেন্ট বা নিয়োগকর্তা ধাপ থেকে প্রস্তুত করা যায়।");
        }
        if (client.status === "docs_verified") await moveClient(client.id, "employer_selected");
        await moveClient(client.id, "permit_submitted");
        await db.insert(agentRuns).values({
          countryCode: client.countryCode,
          portal: client.countryCode,
          runType: "permit_packet",
          shift: shiftNow(),
          slotsFound: 0,
          result: `${client.clientCode} এর পারমিট প্যাকেট অভ্যন্তরীণ কিউতে চিহ্নিত। ইনডেক্স ${index}। বাইরের পোর্টালে ডেটা পুশ হয়নি।`,
        });
      } else {
        await db
          .update(applications)
          .set({ portalStatus: `Status scrape simulation · ${new Date().toISOString()}` })
          .where(eq(applications.clientId, client.id));
        await db.insert(agentRuns).values({
          countryCode: client.countryCode,
          portal: client.countryCode,
          runType: "status_scrape",
          shift: shiftNow(),
          slotsFound: 0,
          result: `${client.passportNo} দিয়ে স্ট্যাটাস নোট সিআরএমে সিঙ্ক হয়েছে। এটি লোকাল সিমুলেশন।`,
        });
      }
      return Response.json({ ok: true });
    }

    throw new WorkflowError("অজানা এজেন্ট অ্যাকশন।");
  } catch (error) {
    const message = error instanceof WorkflowError ? error.message : "এজেন্ট রান ব্যর্থ।";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
