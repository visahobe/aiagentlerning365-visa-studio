"use client";

import { useState } from "react";
import { bdt, bnDateTime, STATUS_BN } from "@/lib/ops";

type Portal = {
  affiliate: {
    agentName: string;
    district: string;
    upazila: string | null;
    phone: string;
    referralCode: string;
    walletBalance: number;
    totalEarned: number;
    pendingWithdrawal: number;
  };
  referrals: { code: string; name: string; country: string; visa: string; status: string; credited: boolean }[];
  withdrawals: { id: string; amount: number; method: string; account: string; status: string; createdAt: string }[];
  link: string;
};

const CODES = ["WVC-DHK-01", "WVC-CTG-04", "WVC-SYL-02", "WVC-RAJ-07"];

export function AffiliatePortal() {
  const [code, setCode] = useState("WVC-DHK-01");
  const [portal, setPortal] = useState<Portal | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function lookup(next = code) {
    setError("");
    const response = await fetch("/api/affiliates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "lookup", referralCode: next }),
    });
    const data = (await response.json()) as Portal & { ok: boolean; error?: string };
    if (!data.ok) {
      setPortal(null);
      setError(data.error ?? "পাওয়া যায়নি।");
      return;
    }
    setPortal(data);
  }

  async function withdraw(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/affiliates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "withdraw",
        referralCode: code,
        amount: Number(form.get("amount")),
        method: form.get("method"),
        account: form.get("account"),
      }),
    });
    const data = (await response.json()) as Portal & { ok: boolean; error?: string };
    if (!data.ok) {
      setNote(data.error ?? "উত্তোলন হয়নি।");
      return;
    }
    setPortal(data);
    setNote("রিকোয়েস্ট অ্যাডমিনের অনুমোদনের অপেক্ষায়।");
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="input mono" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
        <button className="btn btn-ink" type="button" onClick={() => void lookup()}>ড্যাশবোর্ড</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {CODES.map((item) => (
          <button key={item} type="button" className="btn btn-line" onClick={() => { setCode(item); void lookup(item); }}>
            {item}
          </button>
        ))}
      </div>
      {error ? <p className="rounded-2xl bg-[#c4492c] px-4 py-3 text-sm text-white">{error}</p> : null}
      {portal ? (
        <>
          <section className="ink-panel rounded-[28px] p-5">
            <p className="kicker">{portal.affiliate.district} · {portal.affiliate.upazila}</p>
            <h2 className="mt-2 text-3xl font-semibold">{portal.affiliate.agentName}</h2>
            <p className="mono text-[var(--gold)]">{portal.affiliate.referralCode}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div><p className="text-white/60">ওয়ালেট</p><p className="text-lg font-semibold">{bdt(portal.affiliate.walletBalance)}</p></div>
              <div><p className="text-white/60">মোট আয়</p><p className="text-lg font-semibold">{bdt(portal.affiliate.totalEarned)}</p></div>
              <div><p className="text-white/60">অপেক্ষমাণ</p><p className="text-lg font-semibold">{bdt(portal.affiliate.pendingWithdrawal)}</p></div>
            </div>
            <p className="mt-4 text-sm text-white/70">রেফারেল লিংক: {portal.link}</p>
          </section>
          <section className="paper-card rounded-[28px] p-4">
            <h3 className="font-semibold">রেফার করা ফাইল</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {portal.referrals.map((item) => (
                <li key={item.code} className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] py-2">
                  <span>{item.name} · {item.country} · {item.visa}</span>
                  <span>{STATUS_BN[item.status] ?? item.status} {item.credited ? "· কমিশন জমা" : ""}</span>
                </li>
              ))}
              {!portal.referrals.length ? <li>এখনো কোনো রেফারেল নেই।</li> : null}
            </ul>
          </section>
          <form onSubmit={withdraw} className="paper-card grid gap-3 rounded-[28px] p-4 sm:grid-cols-4">
            <input name="amount" type="number" className="input" placeholder="টাকা" required />
            <select name="method" className="input" defaultValue="bKash">
              <option>bKash</option>
              <option>Nagad</option>
              <option>Bank</option>
            </select>
            <input name="account" className="input" placeholder="নম্বর" required />
            <button className="btn btn-gold" type="submit">উত্তোলন</button>
          </form>
          {note ? <p className="text-sm">{note}</p> : null}
          <ul className="space-y-2 text-sm">
            {portal.withdrawals.map((item) => (
              <li key={item.id} className="rounded-2xl bg-white px-3 py-3">
                {bdt(item.amount)} · {item.method} · {item.account} · {item.status} · {bnDateTime(item.createdAt)}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
