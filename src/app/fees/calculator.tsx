"use client";

import { useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { BANK_MINIMUM, PACKAGES, VISA, bdt, type VisaCode } from "@/lib/ops";

export function FeeCalculator() {
  const [country, setCountry] = useState("SRB");
  const [visa, setVisa] = useState<VisaCode>("WRK");
  const [paid, setPaid] = useState(0);
  const fee = PACKAGES[country][visa];
  const advance = Math.round(fee * 0.3);
  const stage = Math.round(fee * 0.4);
  const final = fee - advance - stage;
  const due = Math.max(fee - paid, 0);
  const profile = useMemo(() => COUNTRIES.find((item) => item.code === country), [country]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="paper-card space-y-4 rounded-[28px] p-5">
        <label className="block text-sm font-semibold">দেশ
          <select className="input mt-1" value={country} onChange={(event) => setCountry(event.target.value)}>
            {COUNTRIES.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.nameBn}</option>)}
          </select>
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.keys(VISA) as VisaCode[]).map((code) => (
            <button key={code} type="button" className={`rounded-2xl border px-3 py-3 text-sm ${visa === code ? "border-[var(--stamp)] bg-[var(--bg-soft)]" : "border-[var(--line)]"}`} onClick={() => setVisa(code)}>
              {VISA[code].bn}
            </button>
          ))}
        </div>
        <label className="block text-sm font-semibold">ইতিমধ্যে জমা (টাকা)
          <input className="input mt-1" type="number" min={0} value={paid} onChange={(event) => setPaid(Number(event.target.value) || 0)} />
        </label>
        <p className="text-sm leading-7 text-[var(--muted)]">{profile?.highlight}</p>
      </div>
      <aside className="ink-panel rounded-[28px] p-5">
        <p className="kicker">লাইভ হিসাব</p>
        <h2 className="mt-2 text-3xl font-semibold">{bdt(fee)}</h2>
        <ul className="mt-4 space-y-2 text-sm leading-7">
          <li>অগ্রিম ৩০% · {bdt(advance)}</li>
          <li>পারমিট বা দূতাবাস ধাপ ৪০% · {bdt(stage)}</li>
          <li>স্ট্যাম্পের পর বাকি · {bdt(final)}</li>
          <li>বকেয়া · {bdt(due)}</li>
          <li>সহযোগী কমিশন · {bdt(VISA[visa].commission)}</li>
          <li>ব্যাংক ফ্লোর · {bdt(BANK_MINIMUM[visa])}</li>
          <li>গড় সময় · {profile?.processing}</li>
        </ul>
        <p className="mt-4 text-xs leading-6 text-white/70">বকেয়া = মোট চুক্তি − জমা। এটি প্যাকেজের অভ্যন্তরীণ সারণি, দূতাবাসের সরকারি ফি আলাদা হতে পারে।</p>
      </aside>
    </div>
  );
}
