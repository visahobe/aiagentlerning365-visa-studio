import { AdminDashboard } from "./dashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker text-[var(--stamp)]">সুপার ড্যাশবোর্ড</p>
      <h1 className="mt-2 text-4xl font-semibold">কানবান, লেজার, এসএলএ।</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#3d5164]">
        সাত কার্যদিবস এক কলামে থাকলে লাল ব্যাজ। দেশ ও ভিসা দিয়ে ফিল্টার। পেমেন্ট, উত্তোলন ও নিয়োগকর্তার স্ট্যাটাস এখান থেকেই বদলায়। এটি ডেমো অপারেশনস কনসোল।
      </p>
      <div className="mt-6">
        <AdminDashboard />
      </div>
    </main>
  );
}
