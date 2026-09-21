import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "সরঞ্জাম" };

const GROUPS = [
  {
    title: "হিসাব ও কাগজ",
    items: [
      ["/fees", "ফি ক্যালকুলেটর", "চুক্তিমূল্য, তিন ধাপের জমা, বকেয়া ও সহযোগী কমিশন।"],
      ["/documents", "কাগজপত্র তালিকা", "পাসপোর্ট, ছবি, ক্লিয়ারেন্স, ব্যাংক ও দেশভিত্তিক অতিরিক্ত কাগজ।"],
      ["/compare", "দেশ তুলনা", "দুই দেশের পোর্টাল, সময় ও তিনটি আইনি পথ।"],
    ],
  },
  {
    title: "পরিচালন",
    items: [
      ["/apply", "নতুন ফাইল", "মেয়াদ, ছবির স্কোর ও ব্যালেন্স ফিল্টার।"],
      ["/track", "ট্র্যাকার", "সাত কলাম, ইনভয়েস ও ইমেইল লগ।"],
      ["/admin", "কানবান কনসোল", "এসএলএ, পেমেন্ট ও উত্তোলন অনুমোদন।"],
      ["/agent", "এজেন্ট শিফট", "সকাল, দুপুর, রাতের স্লট নোট। বাইরের সাইটে বট নয়।"],
      ["/calendar", "শিফট ক্যালেন্ডার", "ঢাকার সময় অনুযায়ী তিন উইন্ডো।"],
    ],
  },
  {
    title: "নেটওয়ার্ক",
    items: [
      ["/employers", "নিয়োগকর্তা তালিকা", "যাচাই, তদন্ত ও কালো তালিকা।"],
      ["/affiliate", "সহযোগী এজেন্ট", "রেফারেল, ওয়ালেট ও উত্তোলন।"],
      ["/partners", "বিদেশি অংশীদার", "রিক্রুটিং ফি ও প্রফিট শেয়ার।"],
    ],
  },
  {
    title: "জ্ঞান",
    items: [
      ["/learn", "পূর্ণ নকশা", "আট দেশের আইন, স্কিমা ও ইমেইল ট্রিগার।"],
      ["/glossary", "শব্দকোষ", "পোর্টাল ও আইনি শব্দের বাংলা অর্থ।"],
      ["/faq", "প্রশ্নোত্তর", "প্রত্যাখ্যান, ভিজিটরের সীমা, মেডিকেল।"],
      ["/about", "পরিচিতি", "ওয়ার্ল্ড ভিশন কনসালটেন্সির প্রকৃত ঠিকানা।"],
      ["/contact", "যোগাযোগ", "বার্তা সরাসরি ডেস্ক লগে জমা হয়।"],
    ],
  },
];

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker">VisaMOTion365</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">সব সরঞ্জাম এক ডেস্কে।</h1>
      <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--muted)]">
        প্রতিটি সরঞ্জাম একই দেশতালিকা, একই ফি টেবিল ও একই ফাইল আইডি ব্যবহার করে। মোবাইলে কার্ডগুলো এক কলামে থাকে, টেবিল আলাদা করে স্ক্রল হয়।
      </p>
      <div className="mt-8 space-y-8">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-2xl font-semibold">{group.title}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map(([href, title, copy]) => (
                <Link key={href} href={href} className="paper-card rounded-[24px] p-5">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{copy}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
