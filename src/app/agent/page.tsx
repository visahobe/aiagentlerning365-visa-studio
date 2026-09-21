import { AgentConsole } from "./console";

export const dynamic = "force-dynamic";

export default function AgentPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="kicker text-[var(--gold)]">তত্ত্বাবধানকৃত এজেন্ট কনসোল</p>
      <h1 className="mt-2 text-4xl font-semibold">স্লট উইন্ডো দেখা যায়, দরজা ভাঙা হয় না।</h1>
      <p className="mt-3 text-sm leading-7 text-[#3d5164]">
        হেডলেস ব্রাউজার দিয়ে সরকারি সাইটের অ্যান্টি-বট ফিল্টার এড়ানো এই প্ল্যাটফর্মের অংশ নয়। কনসোল শিফট, স্লট নোট ও পারমিট প্যাকেটের অভ্যন্তরীণ কিউ শেখায় — যাতে টিম জানে কোন ফাইল কোন পোর্টাল চেকলিস্টে আছে।
      </p>
      <div className="mt-6">
        <AgentConsole />
      </div>
    </main>
  );
}
