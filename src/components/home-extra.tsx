import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { COMPANY, VISA, bdt } from "@/lib/ops";
import { Reveal } from "@/components/fx";

const TOOLS = [
  ["ফি ক্যালকুলেটর", "অগ্রিম, দ্বিতীয় ধাপ, বকেয়া ও সহযোগী কমিশন একসাথে।", "/fees"],
  ["কাগজপত্র তালিকা", "পাসপোর্ট, ছবি, ক্লিয়ারেন্স, ব্যাংক ও দেশভিত্তিক অতিরিক্ত কাগজ।", "/documents"],
  ["দেশ তুলনা", "দুই দেশের পোর্টাল, সময় ও তিনটি পথ পাশাপাশি।", "/compare"],
  ["শিফট ক্যালেন্ডার", "সকাল নয়, দুপুর দুই, রাত নয় — ঢাকার সময়।", "/calendar"],
  ["শব্দকোষ", "ইউনিফায়েড পারমিট, ওয়াকালা, সিপিআর, এসএলএ।", "/glossary"],
  ["প্রশ্নোত্তর", "প্রত্যাখ্যান, কমিশন, মেডিকেল ও ভিজিটরের সীমা।", "/faq"],
];

export function HomeExtra() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <Reveal>
        <p className="kicker">আরও ডেস্ক</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-5xl">ভিসামোশন৩৬৫ শুধু একটি ফর্ম নয়।</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--muted)] md:text-base">
          {COMPANY.nameBn} এই প্ল্যাটফর্ম চালায়। ঠিকানা তেজগাঁওয়ের মাহবুব প্লাজা, রুম ৪০৩। ফোন {COMPANY.phone}। ইমেইল {COMPANY.email}। পোর্টাল {COMPANY.portal}। নিচের সরঞ্জামগুলো একই নিয়ম দিয়ে হিসাব করে, যা অনবোর্ডিং ফিল্টারে লাগে।
        </p>
      </Reveal>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(([title, copy, href]) => (
          <Link key={href} href={href} className="paper-card rounded-[24px] p-5">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{copy}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {(Object.keys(VISA) as Array<keyof typeof VISA>).map((code) => (
          <article key={code} className="rounded-[24px] border border-[var(--line)] bg-[var(--bg-soft)] p-5">
            <p className="mono text-xs text-[var(--stamp)]">{code}</p>
            <h3 className="mt-2 text-2xl font-semibold">{VISA[code].bn}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">অনুমোদনে সহযোগী কমিশন {bdt(VISA[code].commission)}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 overflow-x-auto rounded-[24px] border border-[var(--line)] bg-[var(--card)]">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="bg-[#122033] text-white">
            <tr>
              {["দেশ", "পোর্টাল", "কেন এই পথ", "গড় সময়"].map((head) => (
                <th key={head} className="px-3 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COUNTRIES.map((country) => (
              <tr key={country.code} className="border-t border-[var(--line)] align-top">
                <td className="px-3 py-3 font-semibold">
                  <Link href={`/countries/${country.code}`}>{country.flag} {country.nameBn}</Link>
                </td>
                <td className="px-3 py-3">{country.portal}</td>
                <td className="px-3 py-3">{country.highlight}</td>
                <td className="px-3 py-3 whitespace-nowrap">{country.processing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
