import type { Metadata } from "next";
import { COUNTRIES } from "@/lib/countries";

export const metadata: Metadata = { title: "শিফট ক্যালেন্ডার" };

const SHIFTS = [
  ["সকাল ০৯:০০", "ঢাকার সময়। প্রথম স্লট উইন্ডো। রাতের দূতাবাস ক্যালেন্ডার খুললে এই শিফটে ধরা পড়ে।"],
  ["দুপুর ১৪:০০", "দ্বিতীয় স্ক্যান। দুপুরে নতুন অ্যাপয়েন্টমেন্ট ছাড়লে অপেক্ষমাণ ফাইলের নোট ওঠে।"],
  ["রাত ২১:০০", "তৃতীয় স্ক্যান। ইউরোপের বিকেল ও উপসাগরের সন্ধ্যা এই উইন্ডোতে পড়ে।"],
];

export default function CalendarPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker">ঢাকার সময়</p>
      <h1 className="mt-2 text-4xl font-semibold">দিনে তিনবার, আটটি পোর্টাল।</h1>
      <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--muted)]">
        ভিসামোশন৩৬৫ এই সময়সূচি শেখায় ও অভ্যন্তরীণ লগ রাখে। সরকারি সাইটে স্বয়ংক্রিয় লগইন, কুকি চুরি বা অ্যান্টি-বট এড়ানো এই অ্যাপে নেই। স্লট পেলে সুপারভাইজার নিজে বুক করেন।
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {SHIFTS.map(([time, copy]) => (
          <article key={time} className="paper-card rounded-[24px] p-5">
            <h2 className="text-2xl font-semibold">{time}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{copy}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {COUNTRIES.map((country) => (
          <article key={country.code} className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4">
            <h3 className="font-semibold">{country.flag} {country.nameBn}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{country.portal}</p>
            <p className="mt-2 text-sm leading-6">{country.processing} · {country.volume}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
