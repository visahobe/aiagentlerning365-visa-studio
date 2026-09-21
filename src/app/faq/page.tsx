import type { Metadata } from "next";
import { FaqList } from "./faq-list";

export const metadata: Metadata = { title: "প্রশ্নোত্তর" };

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="kicker">সরাসরি উত্তর</p>
      <h1 className="mt-2 text-4xl font-semibold">যা বারবার জিজ্ঞেস হয়।</h1>
      <div className="mt-6">
        <FaqList />
      </div>
    </main>
  );
}
