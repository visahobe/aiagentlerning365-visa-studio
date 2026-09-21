import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { ensureSeed } from "@/lib/data";
import { Reveal } from "@/components/fx";

export const dynamic = "force-dynamic";

export default async function CountriesPage() {
  await ensureSeed();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Reveal>
        <p className="kicker text-[var(--navy)]">দেশের কাঠামো</p>
        <h1 className="mt-2 text-4xl font-semibold md:text-5xl">আটটি কৌশলগত দেশের ভিসা ডেস্ক</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#3d5164] md:text-base">
          প্রতিটি দেশে ওয়ার্ক, ভিজিটর ও সেলফ-স্পন্সরশিপ আলাদা আইনি দরজা। নিচের তুলনা সারণি অপারেশনস টিমের দৈনিক রেফারেন্স।
        </p>
      </Reveal>
      <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--line)] bg-white">
        <table className="min-w-[860px] w-full text-left text-sm">
          <thead className="bg-[var(--ink)] text-[#f6efe4]">
            <tr>
              {["দেশ", "পোর্টাল", "ওয়ার্ক ভিত্তি", "ভিজিটর", "সেলফ-স্পন্সর", "সময়"].map((head) => (
                <th key={head} className="px-3 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COUNTRIES.map((country) => (
              <tr key={country.code} className="border-t border-[var(--line)]">
                <td className="px-3 py-3 font-semibold">
                  <Link href={`/countries/${country.code}`}>{country.flag} {country.nameBn}</Link>
                </td>
                <td className="px-3 py-3">{country.portal}</td>
                <td className="px-3 py-3">{country.workBasis}</td>
                <td className="px-3 py-3">{country.visitor}</td>
                <td className="px-3 py-3">{country.selfPath}</td>
                <td className="px-3 py-3 whitespace-nowrap">{country.processing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {COUNTRIES.map((country) => (
          <Link key={country.code} href={`/countries/${country.code}`} className="paper-card grid grid-cols-[140px_1fr] overflow-hidden rounded-[24px] sm:grid-cols-[180px_1fr]">
            <img src={country.image} alt="" className="h-full min-h-36 w-full object-cover" />
            <div className="p-4">
              <p className="text-xs text-[#607086]">{country.nameEn}</p>
              <h2 className="text-2xl font-semibold">{country.nameBn}</h2>
              <p className="mt-2 text-sm leading-6 text-[#3d5164]">{country.why}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
