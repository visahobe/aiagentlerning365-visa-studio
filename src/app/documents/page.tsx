import type { Metadata } from "next";
import { Checklist } from "./checklist";

export const metadata: Metadata = { title: "কাগজপত্র" };

export default function DocumentsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="kicker">যাচাই তালিকা</p>
      <h1 className="mt-2 text-4xl font-semibold">জমার আগে কাগজ গুনে নিন।</h1>
      <p className="mt-3 text-sm leading-8 text-[var(--muted)]">
        পাসপোর্টের মেয়াদ কম হলে, ছবি ঘোলা হলে বা ক্লিয়ারেন্স পুরনো হলে ভিসামোশন৩৬৫ ফাইল আইডি দেয় না। দেশ বদলালে অতিরিক্ত শর্তও বদলায়।
      </p>
      <div className="mt-6">
        <Checklist />
      </div>
    </main>
  );
}
