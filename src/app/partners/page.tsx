import Link from "next/link";
import { getAdminPayload } from "@/lib/data";
import { bdt, STATUS_BN } from "@/lib/ops";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const data = await getAdminPayload();
  const deployed = data.dossiers.filter((item) => ["permit_submitted", "embassy_review", "visa_approved", "deployed"].includes(item.status));
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker text-[var(--teal)]">বিদেশি নিয়োগকর্তা ইকোসিস্টেম</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">পার্টনার দেখেন কারা মেডিকেল পেরিয়েছেন, কারা উড়েছেন।</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#3d5164]">
        যৌথ নিয়োগে রিক্রুটিং ফি, দায় ও প্রফিট শেয়ার এক ড্যাশবোর্ডে। চুক্তির প্রিন্টযোগ্য খসড়া নিয়োগকর্তার পাতায়।
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {data.partners.map((partner) => (
          <article key={partner.id} className="paper-card rounded-[28px] p-5">
            <p className="mono text-xs text-[var(--navy)]">{partner.agreementRef}</p>
            <h2 className="mt-2 text-2xl font-semibold">{partner.employerName}</h2>
            <p className="mt-2 text-sm">রেট {partner.commissionRate}% · ফি {bdt(partner.recruitingFee)}</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--teal)]">{bdt(partner.profitShareBalance)}</p>
            <p className="mt-2 text-sm leading-6 text-[#3d5164]">{partner.liabilityNote}</p>
            <Link href={`/employers/${partner.employerId}`} className="mt-3 inline-block text-sm font-semibold text-[var(--navy)]">চুক্তি খসড়া</Link>
          </article>
        ))}
      </div>
      <section className="mt-8 overflow-x-auto rounded-[24px] bg-white">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="bg-[var(--ink)] text-white">
            <tr>
              {["ফাইল", "দেশ", "ধাপ", "নিয়োগকর্তা", "বকেয়া"].map((head) => (
                <th key={head} className="px-3 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deployed.map((item) => (
              <tr key={item.id} className="border-t border-[var(--line)]">
                <td className="px-3 py-3">
                  <Link href={`/track?code=${item.clientCode}`}>{item.fullName}</Link>
                  <span className="mono block text-xs">{item.clientCode}</span>
                </td>
                <td className="px-3 py-3">{item.countryCode}</td>
                <td className="px-3 py-3">{STATUS_BN[item.status]}</td>
                <td className="px-3 py-3">{item.employer?.name ?? "—"}</td>
                <td className="px-3 py-3">{bdt(item.due)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
