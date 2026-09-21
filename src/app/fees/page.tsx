import type { Metadata } from "next";
import { FeeCalculator } from "./calculator";

export const metadata: Metadata = { title: "ফি ক্যালকুলেটর" };

export default function FeesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker">অর্থের সরঞ্জাম</p>
      <h1 className="mt-2 text-4xl font-semibold">তিন ধাপের ফি, এক নজরে।</h1>
      <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--muted)]">
        ওয়ার্ক ভিসায় সহযোগী পান দশ হাজার, ভিজিটরে তিন হাজার, সেলফ-স্পন্সরে পনেরো হাজার টাকা — অনুমোদনের পর, একবার। বিকাশ, নগদ ও ব্যাংক একই খাতায় বসে।
      </p>
      <div className="mt-6">
        <FeeCalculator />
      </div>
    </main>
  );
}
