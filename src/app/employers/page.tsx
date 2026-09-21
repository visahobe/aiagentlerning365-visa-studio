import Link from "next/link";
import { getEmployerBoard } from "@/lib/data";
import { countryByCode } from "@/lib/countries";
import { EMPLOYER_STATUS_BN } from "@/lib/ops";
import { ScreenForm } from "./screen-form";

export const dynamic = "force-dynamic";

const tone: Record<string, string> = {
  Verified: "bg-[#e7f4ef] text-[#145c4d]",
  Pending: "bg-[#fff4df] text-[#8a5a12]",
  Blacklisted: "bg-[#fde8e4] text-[#9d2f1d]",
};

export default async function EmployersPage() {
  const board = await getEmployerBoard();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker text-[var(--navy)]">যাচাইকৃত নিয়োগকর্তা তালিকা</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">যে কোম্পানি ফাইল পাবে, তার নাম আগে যাচাই।</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#3d5164]">
        রেজিস্ট্রেশন, ট্যাক্স আইডি, যোগাযোগ, কোটা, বেতন, আবাসন, চিকিৎসা ও খাবারের প্রতিশ্রুতি। কালো তালিকাভুক্ত প্রতিষ্ঠানের ডিমান্ড বন্ধ।
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {board.map((employer) => {
          const country = countryByCode(employer.countryCode);
          return (
            <Link key={employer.id} href={`/employers/${employer.id}`} className="paper-card rounded-[28px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-[#607086]">{country?.flag} {country?.nameBn} · {employer.city}</p>
                  <h2 className="mt-1 text-xl font-semibold">{employer.companyName}</h2>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone[employer.verificationStatus] ?? ""}`}>
                  {EMPLOYER_STATUS_BN[employer.verificationStatus] ?? employer.verificationStatus}
                </span>
              </div>
              <p className="mono mt-3 text-xs">{employer.taxId} · {employer.tradeLicenseNo}</p>
              <p className="mt-2 text-sm text-[#3d5164]">{employer.contactPerson} · {employer.sector}</p>
              {employer.blacklistReason ? <p className="mt-2 text-sm text-[#9d2f1d]">{employer.blacklistReason}</p> : null}
              <ul className="mt-3 space-y-1 text-sm">
                {employer.demands.map((demand) => (
                  <li key={demand.id} className="flex justify-between gap-2">
                    <span>{demand.jobTitleBn || demand.jobTitle}</span>
                    <span>{demand.fulfilledCount}/{demand.requiredWorkers} · {demand.status}</span>
                  </li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
      <div className="mt-8">
        <ScreenForm />
      </div>
    </main>
  );
}
