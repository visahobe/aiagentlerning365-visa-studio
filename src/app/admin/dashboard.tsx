"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { bdt, bnDateTime, STAGES, STATUS_BN, visaLabel } from "@/lib/ops";

type Dossier = {
  id: string;
  clientCode: string;
  fullName: string;
  passportNo: string;
  skill: string;
  countryCode: string;
  visaCode: string;
  status: string;
  contractValue: number;
  paid: number;
  due: number;
  sla: number;
  alert: boolean;
  rejectionReason: string | null;
  stageEnteredAt: string;
  demand: { title: string; ref: string | null } | null;
  employer: { name: string } | null;
  affiliate: { name: string; code: string } | null;
  application: { govTrackingCode: string | null; portalStatus: string | null } | null;
};

type Payload = {
  dossiers: Dossier[];
  employers: { id: string; companyName: string; verificationStatus: string; countryCode: string }[];
  affiliates: { agentName: string; referralCode: string; walletBalance: number; district: string }[];
  withdrawals: { id: string; amount: number; method: string; account: string; status: string; affiliateId: string }[];
  emails: { id: string; subject: string; triggerType: string; timestamp: string; recipientEmail: string }[];
  finance: {
    collected: number;
    contracted: number;
    outstanding: number;
    affiliatePayable: number;
    profitShare: number;
    netOperating: number;
  };
};

export function AdminDashboard() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("ALL");
  const [visa, setVisa] = useState("ALL");
  const [selected, setSelected] = useState<string | null>(null);
  const [reason, setReason] = useState("দক্ষতার প্রমাণ অপর্যাপ্ত।");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/admin");
    setData((await response.json()) as Payload);
  }

  useEffect(() => {
    void load();
  }, []);

  async function act(body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as { ok: boolean; error?: string; payload?: Payload };
    setBusy(false);
    if (!payload.ok || !payload.payload) {
      setError(payload.error ?? "অ্যাকশন ব্যর্থ।");
      return;
    }
    setData(payload.payload);
  }

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.dossiers.filter((item) => (country === "ALL" || item.countryCode === country) && (visa === "ALL" || item.visaCode === visa));
  }, [country, data, visa]);

  const active = data?.dossiers.find((item) => item.id === selected) ?? null;

  if (!data) return <p className="text-sm text-[#607086]">কনসোল লোড হচ্ছে...</p>;

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["সংগৃহীত", data.finance.collected],
          ["চুক্তির যোগফল", data.finance.contracted],
          ["ক্লায়েন্ট বকেয়া", data.finance.outstanding],
          ["অ্যাফিলিয়েট প্রদেয়", data.finance.affiliatePayable],
          ["প্রফিট শেয়ার", data.finance.profitShare],
          ["নেট অপারেটিং", data.finance.netOperating],
        ].map(([label, value]) => (
          <article key={String(label)} className="paper-card rounded-3xl p-4">
            <p className="text-xs text-[#607086]">{label}</p>
            <p className="mt-1 text-xl font-semibold">{bdt(Number(value))}</p>
          </article>
        ))}
      </section>
      <div className="flex flex-wrap gap-2">
        <select className="input max-w-[180px]" value={country} onChange={(event) => setCountry(event.target.value)}>
          <option value="ALL">সব দেশ</option>
          {COUNTRIES.map((item) => <option key={item.code} value={item.code}>{item.nameBn}</option>)}
        </select>
        <select className="input max-w-[180px]" value={visa} onChange={(event) => setVisa(event.target.value)}>
          <option value="ALL">সব ভিসা</option>
          <option value="WRK">ওয়ার্ক</option>
          <option value="VIS">ভিজিটর</option>
          <option value="SLF">সেলফ</option>
        </select>
      </div>
      {error ? <p className="rounded-2xl bg-[#c4492c] px-3 py-3 text-sm text-white">{error}</p> : null}
      <div className="kanban">
        {STAGES.map((stage) => (
          <section key={stage.id} className="rounded-[24px] bg-white/70 p-3">
            <header className="mb-3">
              <h2 className="text-sm font-semibold">{stage.bn}</h2>
              <p className="text-xs text-[#607086]">{filtered.filter((item) => item.status === stage.id).length} ফাইল</p>
            </header>
            <div className="space-y-2">
              {filtered.filter((item) => item.status === stage.id).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left ${item.alert ? "pulse-alert border-[#c4492c] bg-[#fff5f3]" : "border-[var(--line)] bg-white"}`}
                >
                  <p className="text-sm font-semibold">{item.fullName}</p>
                  <p className="mono text-[11px] text-[var(--navy)]">{item.clientCode}</p>
                  <p className="mt-1 text-xs text-[#607086]">{item.countryCode} · {visaLabel(item.visaCode)}</p>
                  {item.alert ? <p className="mt-1 text-xs font-semibold text-[#c4492c]">{item.sla} দিন স্থবির</p> : null}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="paper-card rounded-[24px] p-4">
        <h2 className="font-semibold">প্রত্যাখ্যাত ট্রে</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {filtered.filter((item) => item.status === "rejected").map((item) => (
            <li key={item.id}>
              <button type="button" className="text-left" onClick={() => setSelected(item.id)}>
                {item.fullName} · {item.clientCode} · {item.rejectionReason}
              </button>
            </li>
          ))}
        </ul>
      </section>
      {active ? (
        <section className="ink-panel rounded-[28px] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mono text-[var(--gold)]">{active.clientCode}</p>
              <h2 className="text-2xl font-semibold">{active.fullName}</h2>
              <p className="text-sm text-white/70">{STATUS_BN[active.status]} · {active.skill} · পাসপোর্ট {active.passportNo}</p>
            </div>
            <Link href={`/track?code=${active.clientCode}`} className="btn btn-ghost">পাবলিক ট্র্যাক</Link>
          </div>
          <p className="mt-3 text-sm text-white/75">
            চুক্তি {bdt(active.contractValue)} · জমা {bdt(active.paid)} · বকেয়া {bdt(active.due)} · ধাপে ঢুকেছে {bnDateTime(active.stageEnteredAt)}
          </p>
          <p className="mt-2 text-sm text-white/70">{active.employer?.name ?? "নিয়োগকর্তা নেই"} · {active.affiliate?.code ?? "সরাসরি"} · {active.application?.govTrackingCode ?? "ট্র্যাকিং নেই"}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-gold" disabled={busy} onClick={() => void act({ action: "advance", clientId: active.id })}>পরের কলাম</button>
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => void act({ action: "reject", clientId: active.id, reason })}>প্রত্যাখ্যান</button>
          </div>
          <input className="input mt-3" value={reason} onChange={(event) => setReason(event.target.value)} />
          <form
            className="mt-3 grid gap-2 sm:grid-cols-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void act({
                action: "payment",
                clientId: active.id,
                amount: Number(form.get("amount")),
                method: form.get("method"),
                stage: form.get("stage"),
                trxId: form.get("trxId"),
              });
            }}
          >
            <input name="amount" type="number" className="input" placeholder="টাকা" required />
            <select name="method" className="input" defaultValue="bKash"><option>bKash</option><option>Nagad</option><option>Bank</option></select>
            <select name="stage" className="input" defaultValue="Stage_2"><option>Advance</option><option>Stage_2</option><option>Final</option></select>
            <button className="btn btn-gold" disabled={busy}>পেমেন্ট লগ</button>
          </form>
        </section>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="paper-card rounded-[24px] p-4">
          <h2 className="font-semibold">উত্তোলন অনুমোদন</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.withdrawals.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] py-2">
                <span>{bdt(item.amount)} · {item.method} · {item.account} · {item.status}</span>
                {item.status === "Pending" ? (
                  <span className="flex gap-2">
                    <button type="button" className="btn btn-ink" onClick={() => void act({ action: "withdrawal", withdrawalId: item.id, decision: "Paid" })}>পরিশোধ</button>
                    <button type="button" className="btn btn-line" onClick={() => void act({ action: "withdrawal", withdrawalId: item.id, decision: "Rejected" })}>বাতিল</button>
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </article>
        <article className="paper-card rounded-[24px] p-4">
          <h2 className="font-semibold">সাম্প্রতিক ইমেইল</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.emails.slice(0, 8).map((email) => (
              <li key={email.id}>
                <p className="font-semibold">{email.subject}</p>
                <p className="text-xs text-[#607086]">{email.triggerType} · {bnDateTime(email.timestamp)}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="paper-card rounded-[24px] p-4">
        <h2 className="font-semibold">নিয়োগকর্তা স্ট্যাটাস</h2>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {data.employers.map((employer) => (
            <li key={employer.id} className="flex items-center justify-between gap-2 rounded-2xl bg-[#f7f1e7] px-3 py-2 text-sm">
              <span>{employer.companyName}</span>
              <select
                className="rounded-xl border border-[var(--line)] bg-white px-2 py-2"
                value={employer.verificationStatus}
                onChange={(event) => void act({ action: "employer", employerId: employer.id, status: event.target.value })}
              >
                <option value="Verified">যাচাইকৃত</option>
                <option value="Pending">তদন্তাধীন</option>
                <option value="Blacklisted">কালো তালিকা</option>
              </select>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
