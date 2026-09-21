import { emailsLog } from "@/db/schema";
import { db } from "@/db";
import { ensureSeed } from "@/lib/data";
import { COMPANY } from "@/lib/ops";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await ensureSeed();
  const body = (await request.json()) as { name?: string; phone?: string; email?: string; topic?: string; message?: string };
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() || COMPANY.email;
  const topic = body.topic?.trim() || "সাধারণ জিজ্ঞাসা";
  const message = body.message?.trim() ?? "";
  if (name.length < 2 || phone.length < 6 || message.length < 8) {
    return Response.json({ ok: false, error: "নাম, ফোন ও কমপক্ষে এক লাইন বার্তা দিন।" }, { status: 400 });
  }
  await db.insert(emailsLog).values({
    recipientEmail: COMPANY.email,
    subject: `যোগাযোগ: ${topic} — ${name}`,
    triggerType: "contact_desk",
    bodyPreview: `${name} · ${phone} · ${email} · ${message.slice(0, 500)}`,
    sentStatus: true,
  });
  return Response.json({ ok: true, message: "বার্তা ঢাকার ডেস্কে জমা হয়েছে। কর্মঘণ্টায় ফোন বা ইমেইলে উত্তর যাবে।" });
}
