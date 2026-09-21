"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { countryByCode } from "@/lib/countries";
import { bdt, bnDate, bnDateTime, STAGE_IDS, STATUS_BN, visaLabel } from "@/lib/ops";

type Dossier = {
  client: {
    clientCode: string;
    fullName: string;
    passportNo: string;
    passportExpiry: string;
    phone: string;
    email: string | null;
    skill: string;
    countryCode: string;
    visaCode: string;
    status: string;
    contractValue: number;
    photoScore: number | null;
    mrzLine: string | null;
    rejectionReason: string | null;
    stageEnteredAt: string;
  };
  application: {
    govTrackingCode: string | null;
    portal: string | null;
    portalStatus: string | null;
    notes: string | null;
  } | null;
  payments: { invoiceNo: string; amount: number; paymentMethod: string; paymentStage: string; trxId: string | null; createdAt: string }[];
  emails: { subject: string; triggerType: string; bodyPreview: string | null; timestamp: string }[];
  deployment: { airline: string | null; pnrNumber: string | null; flightDate: string | null; airportPickupStatus: boolean; briefing: string | null } | null;
  affiliate: { name: string; code: string; district: string } | null;
  employer: { name: string; status: string; city: string | null } | null;
  demand: { jobTitleBn: string | null; jobTitle: string; salary: number; currency: string } | null;
  paid: number;
  due: number;
};

export function Tracker({ initialCode }: { initialCode: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(nextCode: string) {
    if (!nextCode.trim()) return;
    setLoading(true);
    setError("");
    const response = await fetch(`/api/track?code=${encodeURIComponent(nextCode.trim())}`);
    const data = (await response.json()) as { ok: boolean; error?: string; dossier?: Dossier };
    setLoading(false);
    if (!data.ok || !data.dossier) {
      setDossier(null);
      setError(data.error ?? "ফাইল নেই।");
      return;
    }
    setDossier(data.dossier);
    router.replace(`/track?code=${data.dossier.client.clientCode}`);
  }

  useEffect(() => {
    if (initialCode) void load(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const country = dossier ? countryByCode(dossier.client.countryCode) : null;
  const active = dossier ? STAGE_IDS.indexOf(dossier.client.status as (typeof STAGE_IDS)[number]) : -1;

  return (
    <div>
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void load(code);
        }}
      >
        <input className="input mono" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="WVC-SRB-WRK-2026-0001" />
        <button className="btn btn-ink" type="submit">{loading ? "খোঁজা হচ্ছে" : "ট্র্যাক"}</button>
      </form>
      {error ? <p className="mt-4 rounded-2xl bg-[#c4492c] px-4 py-3 text-sm text-white">{error}</p> : null}
      {dossier ? (
        <div className="mt-6 space-y-4">
          <section className="ink-panel rounded-[28px] p-5 md:p-7">
            <p className="kicker">{country?.flag} {country?.nameBn} · {visaLabel(dossier.client.visaCode)}</p>
            <h2 className="mt-2 text-3xl font-semibold">{dossier.client.fullName}</h2>
            <p className="mono mt-2 text-[var(--gold)]">{dossier.client.clientCode}</p>
            <p className="mt-2 text-sm text-white/70">স্ট্যাটাস: {STATUS_BN[dossier.client.status] ?? dossier.client.status}</p>
            <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
              {STAGE_IDS.map((stage, index) => (
                <div key={stage} className={`rounded-2xl px-3 py-3 text-xs ${index <= active && dossier.client.status !== "rejected" ? "bg-[var(--gold)] text-[#1d1408]" : "bg-white/10"}`}>
                  {STATUS_BN[stage]}
                </div>
              ))}
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="paper-card rounded-3xl p-4 text-sm leading-7">
              <h3 className="font-semibold">পাসপোর্ট</h3>
              <p className="mono">{dossier.client.passportNo}</p>
              <p>মেয়াদ {bnDate(dossier.client.passportExpiry)}</p>
              <p>ছবির স্কোর {dossier.client.photoScore ?? "—"}</p>
              <p className="mono text-xs break-all">{dossier.client.mrzLine}</p>
            </article>
            <article className="paper-card rounded-3xl p-4 text-sm leading-7">
              <h3 className="font-semibold">লেজার</h3>
              <p>চুক্তি {bdt(dossier.client.contractValue)}</p>
              <p>জমা {bdt(dossier.paid)}</p>
              <p>বকেয়া {bdt(dossier.due)}</p>
              <p className="text-xs text-[#607086]">Due = চুক্তি − জমা</p>
            </article>
            <article className="paper-card rounded-3xl p-4 text-sm leading-7">
              <h3 className="font-semibold">ম্যাচ</h3>
              <p>{dossier.employer?.name ?? "এখনো নিয়োগকর্তা নেই"}</p>
              <p>{dossier.demand ? dossier.demand.jobTitleBn || dossier.demand.jobTitle : dossier.client.skill}</p>
              <p>{dossier.affiliate ? `${dossier.affiliate.name} · ${dossier.affiliate.code}` : "সরাসরি আবেদন"}</p>
              <p>{dossier.application?.govTrackingCode ? `পোর্টাল রেফ ${dossier.application.govTrackingCode}` : "পোর্টাল রেফ এখনো নেই"}</p>
            </article>
          </section>
          {dossier.client.rejectionReason ? (
            <p className="rounded-3xl bg-[#c4492c] px-4 py-4 text-sm leading-7 text-white">{dossier.client.rejectionReason}</p>
          ) : null}
          {dossier.deployment ? (
            <article className="rounded-3xl bg-[#1c7c6b] px-5 py-4 text-sm leading-7 text-white">
              ফ্লাইট {dossier.deployment.airline} · পিএনআর {dossier.deployment.pnrNumber} · {bnDateTime(dossier.deployment.flightDate)} · পিকআপ {dossier.deployment.airportPickupStatus ? "নিশ্চিত" : "অপেক্ষমাণ"}
              <span className="mt-1 block">{dossier.deployment.briefing}</span>
            </article>
          ) : null}
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="paper-card rounded-[28px] p-4">
              <h3 className="font-semibold">ইনভয়েস</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {dossier.payments.map((payment) => (
                  <li key={payment.invoiceNo} className="flex items-center justify-between gap-2 border-b border-[var(--line)] py-2">
                    <span>{payment.paymentStage} · {payment.paymentMethod}<span className="mono block text-xs">{payment.invoiceNo}</span></span>
                    <span className="font-semibold">{bdt(payment.amount)}</span>
                  </li>
                ))}
                {!dossier.payments.length ? <li>এখনো কোনো জমা নেই।</li> : null}
              </ul>
            </div>
            <div className="paper-card rounded-[28px] p-4">
              <h3 className="font-semibold">ইমেইল লগ</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {dossier.emails.map((email) => (
                  <li key={`${email.timestamp}-${email.subject}`}>
                    <p className="font-semibold">{email.subject}</p>
                    <p className="text-xs text-[#607086]">{email.triggerType} · {bnDateTime(email.timestamp)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      ) : (
        <p className="mt-6 text-sm text-[#607086]">নমুনা আইডি: WVC-SAU-WRK-2026-0002 বা WVC-BHR-WRK-2026-0005</p>
      )}
    </div>
  );
}
