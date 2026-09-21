import Link from "next/link";
import { notFound } from "next/navigation";
import { countryByCode } from "@/lib/countries";
import { getEmployer } from "@/lib/data";
import { bdt, EMPLOYER_STATUS_BN, STATUS_BN } from "@/lib/ops";

export const dynamic = "force-dynamic";

export default async function EmployerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getEmployer(id);
  if (!data) notFound();
  const { employer, demands, partner, clients } = data;
  const country = countryByCode(employer.countryCode);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/employers" className="text-sm text-[var(--navy)]">← ডিরেক্টরি</Link>
      <header className="mt-3">
        <p className="kicker text-[var(--navy)]">{country?.flag} {EMPLOYER_STATUS_BN[employer.verificationStatus] ?? employer.verificationStatus}</p>
        <h1 className="mt-2 text-4xl font-semibold">{employer.companyName}</h1>
        <p className="mt-2 text-sm text-[#3d5164]">{employer.city} · {employer.sector} · {employer.contactPerson}, {employer.contactTitle}</p>
      </header>
      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["ট্যাক্স আইডি", employer.taxId],
          ["ট্রেড লাইসেন্স", employer.tradeLicenseNo],
          ["ইমেইল", employer.email],
          ["ফোন", employer.phone],
        ].map(([label, value]) => (
          <div key={label} className="paper-card rounded-3xl p-4">
            <p className="text-xs text-[#607086]">{label}</p>
            <p className="mt-1 font-semibold break-all">{value}</p>
          </div>
        ))}
      </section>
      {employer.blacklistReason ? <p className="mt-4 rounded-3xl bg-[#c4492c] px-4 py-4 text-sm text-white">{employer.blacklistReason}</p> : null}
      <section className="mt-6 space-y-3">
        {demands.map((demand) => (
          <article key={demand.id} className="paper-card rounded-[24px] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">{demand.jobTitleBn || demand.jobTitle}</h2>
              <span className="text-sm">{demand.status}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-[#3d5164]">
              কোটা {demand.fulfilledCount}/{demand.requiredWorkers} · বেতন {demand.salary} {demand.currency} · ঘণ্টা {demand.hoursPerDay} · আবাসন {demand.housing} · চিকিৎসা {demand.medical} · খাবার {demand.foodAllowance}
            </p>
            <p className="mono mt-1 text-xs">{demand.demandLetterRef} · {demand.overtimePolicy}</p>
          </article>
        ))}
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">যুক্ত ফাইল</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {clients.map((client) => (
            <li key={client.id}>
              <Link href={`/track?code=${client.clientCode}`} className="underline">
                {client.fullName} · {client.clientCode} · {STATUS_BN[client.status]}
              </Link>
            </li>
          ))}
          {!clients.length ? <li className="text-[#607086]">এই ডিমান্ডে এখনো কোনো ফাইল বাঁধা নেই।</li> : null}
        </ul>
      </section>
      <article className="print-sheet mt-8 rounded-[28px] border border-[var(--line)] bg-white p-6">
        <p className="text-xs tracking-[0.16em] uppercase text-[#607086]">অংশীদারিত্ব ও গোপনীয়তা চুক্তির খসড়া</p>
        <h2 className="mt-2 text-2xl font-semibold">নিয়োগ সেবা চুক্তির খসড়া</h2>
        <p className="mt-3 text-sm leading-7">
          ওয়ার্ল্ড ভিশন কনসালটেন্সি এবং {employer.companyName} সম্মত হন যে প্রার্থীর ব্যক্তিগত তথ্য কেবল এই ডিমান্ডের জন্য ব্যবহৃত হবে।
          রিক্রুটিং ফি {partner ? bdt(partner.recruitingFee) : "চুক্তি সাপেক্ষে"} এবং প্রফিট শেয়ার রেট {partner ? `${partner.commissionRate}%` : "নির্ধারিত নয়"}।
          রেফারেন্স {partner?.agreementRef ?? "খসড়া"}। দায়: {partner?.liabilityNote ?? "যাচাই শেষে যুক্ত হবে।"}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="border-t border-[var(--ink)] pt-2">ওয়ার্ল্ড ভিশন কনসালটেন্সি</p>
            <p className="text-xs text-[#607086]">ডিজিটাল স্বাক্ষর স্থান</p>
          </div>
          <div>
            <p className="border-t border-[var(--ink)] pt-2">{employer.contactPerson}</p>
            <p className="text-xs text-[#607086]">{employer.companyName}</p>
          </div>
        </div>
        <p className="no-print mt-4 text-xs text-[#607086]">ব্রাউজারের প্রিন্ট দিয়ে পিডিএফ সংরক্ষণ করা যাবে।</p>
      </article>
    </main>
  );
}
