import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/ops";

export const metadata: Metadata = { title: "পরিচিতি" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="kicker">প্রকৃত প্রতিষ্ঠান</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{COMPANY.product}</h1>
      <p className="mt-2 text-lg text-[var(--muted)]">{COMPANY.productBn} · {COMPANY.nameBn}</p>
      <img src="/images/office-dhaka.jpg" alt="ঢাকার পরামর্শ কক্ষ" className="mt-6 h-64 w-full rounded-[28px] object-cover md:h-80" />
      <div className="mt-6 space-y-4 text-sm leading-8 text-[var(--muted)] md:text-base">
        <p>
          ভিসামোশন৩৬৫ ওয়ার্ল্ড ভিশন কনসালটেন্সির অভিবাসন ডেস্ক। বাংলাদেশি পাসপোর্টধারীদের জন্য আটটি দেশ নির্ধারিত: তুরস্ক, মাল্টা, সার্বিয়া, মলদোভা, বেলারুশ, সৌদি আরব, বাহরাইন ও মালয়েশিয়া। প্রতিটি দেশে তিনটি পথ — কাজ, ভিজিট ও সেলফ-স্পন্সরশিপ।
        </p>
        <p>
          অফিস {COMPANY.address}। ফোন {COMPANY.phone}। ইমেইল {COMPANY.email}। সেবা পোর্টাল {COMPANY.portal}। এই ঠিকানা ও নম্বর প্রাতিষ্ঠানিক পরিচিতির অংশ, বদলানো হয়নি।
        </p>
        <p>
          প্ল্যাটফর্ম ফাইল আইডি তৈরি করে, পাসপোর্টের মেয়াদ ও ছবি ফিল্টার করে, নিয়োগকর্তার ট্যাক্স আইডি কালো তালিকার সাথে মেলায়, সহযোগী কমিশন একবার ক্রেডিট করে এবং সাত দিন স্থবির ফাইলে অ্যালার্ট দেয়। সরকারি ওয়েবসাইটে গোপন বট চালানো এই সংস্করণের কাজ নয়।
        </p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["ফোন", COMPANY.phone],
          ["ইমেইল", COMPANY.email],
          ["পোর্টাল", COMPANY.portal],
          ["রুম", "৪০৩, লিফট-৩, মাহবুব প্লাজা"],
        ].map(([label, value]) => (
          <div key={label} className="paper-card rounded-3xl p-4">
            <p className="text-xs text-[var(--muted)]">{label}</p>
            <p className="mt-1 font-semibold break-all">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <a className="btn btn-ink" href={COMPANY.phoneHref}>কল করুন</a>
        <Link className="btn btn-line" href="/contact">বার্তা পাঠান</Link>
        <Link className="btn btn-line" href="/learn">পূর্ণ নকশা</Link>
      </div>
    </main>
  );
}
