import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { affiliates, clients, withdrawals } from "@/db/schema";
import { ensureSeed } from "@/lib/data";
import { visaLabel } from "@/lib/ops";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await ensureSeed();
  const body = (await request.json()) as {
    action?: string;
    referralCode?: string;
    amount?: number;
    method?: string;
    account?: string;
  };
  const code = body.referralCode?.trim().toUpperCase() ?? "";
  const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.referralCode, code));
  if (!affiliate) return Response.json({ ok: false, error: "রেফারেল কোড পাওয়া যায়নি।" }, { status: 404 });

  if (body.action === "withdraw") {
    const amount = Math.round(Number(body.amount));
    if (!amount || amount <= 0) return Response.json({ ok: false, error: "উত্তোলনের পরিমাণ দিন।" }, { status: 400 });
    if (amount > affiliate.walletBalance) {
      return Response.json({ ok: false, error: "ওয়ালেট ব্যালেন্সের চেয়ে বেশি চাওয়া হয়েছে।" }, { status: 400 });
    }
    if (!body.method || !body.account) {
      return Response.json({ ok: false, error: "মাধ্যম ও অ্যাকাউন্ট নম্বর দিন।" }, { status: 400 });
    }
    await db.insert(withdrawals).values({
      affiliateId: affiliate.id,
      amount,
      method: body.method,
      account: body.account,
      status: "Pending",
    });
    await db
      .update(affiliates)
      .set({
        walletBalance: affiliate.walletBalance - amount,
        pendingWithdrawal: affiliate.pendingWithdrawal + amount,
      })
      .where(eq(affiliates.id, affiliate.id));
  }

  const [fresh] = await db.select().from(affiliates).where(eq(affiliates.id, affiliate.id));
  const referred = await db.select().from(clients).where(eq(clients.affiliateId, affiliate.id));
  const history = await db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.affiliateId, affiliate.id))
    .orderBy(desc(withdrawals.createdAt));

  return Response.json({
    ok: true,
    affiliate: fresh,
    referrals: referred.map((client) => ({
      code: client.clientCode,
      name: client.fullName,
      country: client.countryCode,
      visa: visaLabel(client.visaCode),
      status: client.status,
      credited: client.commissionCredited,
    })),
    withdrawals: history,
    link: `/apply?ref=${fresh.referralCode}`,
  });
}
