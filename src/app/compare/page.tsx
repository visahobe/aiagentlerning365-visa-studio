import type { Metadata } from "next";
import { CompareView } from "./compare-view";

export const metadata: Metadata = { title: "দেশ তুলনা" };

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker">পাশাপাশি নিয়ম</p>
      <h1 className="mt-2 text-4xl font-semibold">কোন দেশে কোন দরজা খোলে।</h1>
      <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--muted)]">
        সার্বিয়া দ্রুত ইউনিফায়েড পথ, সৌদি আরব সবচেয়ে বড় ভলিউম, মাল্টায় নিয়োগকর্তার অ্যাকাউন্ট বাধ্যতামূলক, মলদোভায় আমন্ত্রণ ছাড়া ভিজিট দুর্বল। দুই দেশ বেছে নিয়ে পার্থক্য দেখুন।
      </p>
      <div className="mt-6">
        <CompareView />
      </div>
    </main>
  );
}
