import { eq } from "drizzle-orm";
import { db } from "@/db";
import { affiliates, employers, withdrawals } from "@/db/schema";
import { getAdminPayload } from "@/lib/data";
import { STAGE_IDS, type StageId } from "@/lib/ops";
import { moveClient, recordPayment, WorkflowError } from "@/lib/workflow";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getAdminPayload();
  return Response.json(payload);
}

type AdminBody = {
  action?: string;
  clientId?: string;
  reason?: string;
  amount?: number;
  method?: string;
  stage?: string;
  trxId?: string;
  withdrawalId?: string;
  decision?: string;
  employerId?: string;
  status?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AdminBody;
  try {
    if (body.action === "advance") {
      if (!body.clientId) throw new WorkflowError("ক্লায়েন্ট নেই।");
      const payload = await getAdminPayload();
      const dossier = payload.dossiers.find((item) => item.id === body.clientId);
      if (!dossier) throw new WorkflowError("ক্লায়েন্ট নেই।");
      const index = STAGE_IDS.indexOf(dossier.status as StageId);
      if (index < 0 || index >= STAGE_IDS.length - 1) throw new WorkflowError("এই ফাইলের পরের ধাপ নেই।");
      await moveClient(body.clientId, STAGE_IDS[index + 1]);
    } else if (body.action === "reject") {
      if (!body.clientId) throw new WorkflowError("ক্লায়েন্ট নেই।");
      await moveClient(body.clientId, "rejected", body.reason);
    } else if (body.action === "payment") {
      if (!body.clientId || !body.method || !body.stage) throw new WorkflowError("পেমেন্ট তথ্য অসম্পূর্ণ।");
      await recordPayment({
        clientId: body.clientId,
        amount: Number(body.amount),
        method: body.method,
        stage: body.stage,
        trxId: body.trxId,
      });
    } else if (body.action === "withdrawal") {
      if (!body.withdrawalId || !body.decision) throw new WorkflowError("উত্তোলন সিদ্ধান্ত অসম্পূর্ণ।");
      const [row] = await db.select().from(withdrawals).where(eq(withdrawals.id, body.withdrawalId));
      if (!row) throw new WorkflowError("রিকোয়েস্ট পাওয়া যায়নি।");
      if (row.status !== "Pending") throw new WorkflowError("এই রিকোয়েস্ট ইতিমধ্যে নিষ্পন্ন।");
      const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, row.affiliateId));
      if (!affiliate) throw new WorkflowError("অ্যাফিলিয়েট নেই।");
      if (body.decision === "Paid") {
        await db
          .update(affiliates)
          .set({ pendingWithdrawal: Math.max(affiliate.pendingWithdrawal - row.amount, 0) })
          .where(eq(affiliates.id, affiliate.id));
        await db.update(withdrawals).set({ status: "Paid" }).where(eq(withdrawals.id, row.id));
      } else {
        await db
          .update(affiliates)
          .set({
            walletBalance: affiliate.walletBalance + row.amount,
            pendingWithdrawal: Math.max(affiliate.pendingWithdrawal - row.amount, 0),
          })
          .where(eq(affiliates.id, affiliate.id));
        await db.update(withdrawals).set({ status: "Rejected" }).where(eq(withdrawals.id, row.id));
      }
    } else if (body.action === "employer") {
      if (!body.employerId || !body.status) throw new WorkflowError("নিয়োগকর্তা স্ট্যাটাস অসম্পূর্ণ।");
      await db
        .update(employers)
        .set({
          verificationStatus: body.status,
          blacklistReason: body.status === "Blacklisted" ? body.reason || "অ্যাডমিন কর্তৃক কালো তালিকাভুক্ত।" : null,
        })
        .where(eq(employers.id, body.employerId));
    } else {
      throw new WorkflowError("অজানা অ্যাকশন।");
    }
    return Response.json({ ok: true, payload: await getAdminPayload() });
  } catch (error) {
    const message = error instanceof WorkflowError ? error.message : "অপারেশন সম্পন্ন হয়নি।";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
