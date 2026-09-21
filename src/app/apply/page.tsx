import { ApplyForm } from "./apply-form";

export const dynamic = "force-dynamic";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; country?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker text-[var(--navy)]">ক্লায়েন্ট অনবোর্ডিং</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">ফাইল খুলুন, ফিল্টার আগে কথা বলুক।</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#3d5164]">
        নাম, পাসপোর্ট, বয়স, দক্ষতা, দেশ ও ভিসা শ্রেণি। সিস্টেম মেয়াদ, ছবি ও ব্যালেন্স না মিললে আইডি দেবে না।
      </p>
      <div className="mt-6">
        <ApplyForm referral={(params.ref ?? "").toUpperCase()} country={(params.country ?? "SRB").toUpperCase()} />
      </div>
    </main>
  );
}
