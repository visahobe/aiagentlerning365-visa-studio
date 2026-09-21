import { AffiliatePortal } from "./portal";

export const dynamic = "force-dynamic";

export default function AffiliatePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="kicker text-[var(--stamp)]">সহযোগী এজেন্ট পোর্টাল</p>
      <h1 className="mt-2 text-4xl font-semibold">উপজেলার এজেন্ট, খোলা খাতা।</h1>
      <p className="mt-3 text-sm leading-7 text-[#3d5164]">
        রেফারেল লিংক দিয়ে আসা ফাইলের ধাপ দেখা যায়। ভিসা অনুমোদনে ওয়ার্ক ১০,০০০, ভিজিটর ৩,০০০, সেলফ-স্পন্সর ১৫,০০০ টাকা ওয়ালেটে জমে। উত্তোলন বিকাশ, নগদ বা ব্যাংকে — অ্যাডমিন অনুমোদনের পর।
      </p>
      <div className="mt-6">
        <AffiliatePortal />
      </div>
    </main>
  );
}
