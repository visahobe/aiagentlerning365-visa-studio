import Link from "next/link";
import { notFound } from "next/navigation";
import { countryByCode } from "@/lib/countries";
import { getCountryLive } from "@/lib/data";
import { bdt, PACKAGES } from "@/lib/ops";

export const dynamic = "force-dynamic";

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const country = countryByCode(code.toUpperCase());
  if (!country) notFound();
  const live = await getCountryLive(country.code);
  const fees = PACKAGES[country.code];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="relative overflow-hidden rounded-[32px]">
        <img src={country.image} alt={`${country.nameBn} এর দৃশ্য`} className="h-72 w-full object-cover md:h-96" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07131f] via-[#07131f]/30 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-6 text-white md:p-8">
          <p className="kicker">{country.flag} {country.code} · {country.processing}</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-6xl">{country.nameBn}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/80">{country.why}</p>
        </div>
      </section>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["ওয়ার্ক প্যাকেজ", bdt(fees.WRK)],
          ["ভিজিটর প্যাকেজ", bdt(fees.VIS)],
          ["সেলফ-স্পন্সর", bdt(fees.SLF)],
        ].map(([label, value]) => (
          <div key={label} className="paper-card rounded-3xl p-4">
            <p className="text-xs text-[#607086]">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {(["work", "visitor", "self"] as const).map((key) => {
          const path = country.pathways[key];
          return (
            <article key={key} className="paper-card rounded-[28px] p-5">
              <p className="mono text-xs text-[var(--stamp)]">{path.law}</p>
              <h2 className="mt-2 text-2xl font-semibold">{path.title}</h2>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-[#3d5164]">
                {path.steps.map((step, index) => (
                  <li key={step} className="flex gap-2">
                    <span className="mono text-[var(--navy)]">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-2xl bg-[#f6efe4] p-3 text-sm leading-6">{path.note}</p>
            </article>
          );
        })}
      </div>
      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold">এই দেশের নিয়োগকর্তা</h2>
          <Link href={`/apply?country=${country.code}`} className="btn btn-gold">এই দেশে আবেদন</Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {live.employers.map((employer) => (
            <Link key={employer.id} href={`/employers/${employer.id}`} className="rounded-3xl border border-[var(--line)] bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{employer.companyName}</h3>
                <span className="rounded-full bg-[#f6efe4] px-2 py-1 text-xs">{employer.verificationStatus}</span>
              </div>
              <p className="mt-1 text-sm text-[#607086]">{employer.city} · {employer.sector}</p>
              <p className="mono mt-2 text-xs">{employer.taxId}</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-[#607086]">
          খোলা বা পজ ডিমান্ড {live.demands.length}টি · মোট ফাইল {live.clients}। ছবি: {country.photographer}।
        </p>
      </section>
    </main>
  );
}
