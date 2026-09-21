"use client";

import { useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { PACKAGES, bdt } from "@/lib/ops";

export function CompareView() {
  const [left, setLeft] = useState("SRB");
  const [right, setRight] = useState("SAU");
  const a = COUNTRIES.find((item) => item.code === left) ?? COUNTRIES[0];
  const b = COUNTRIES.find((item) => item.code === right) ?? COUNTRIES[1];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[left, right].map((value, index) => (
          <select key={index} className="input" value={value} onChange={(event) => (index === 0 ? setLeft(event.target.value) : setRight(event.target.value))}>
            {COUNTRIES.map((item) => <option key={item.code} value={item.code}>{item.nameBn}</option>)}
          </select>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[a, b].map((country) => (
          <article key={country.code} className="paper-card overflow-hidden rounded-[28px]">
            <img src={country.image} alt="" className="h-44 w-full object-cover" />
            <div className="p-5">
              <h2 className="text-2xl font-semibold">{country.flag} {country.nameBn}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{country.why}</p>
              <ul className="mt-4 space-y-2 text-sm leading-7">
                <li>পোর্টাল: {country.portal}</li>
                <li>ওয়ার্ক: {country.workBasis}</li>
                <li>ভিজিটর: {country.visitor}</li>
                <li>সেলফ: {country.selfPath}</li>
                <li>সময়: {country.processing}</li>
                <li>ওয়ার্ক প্যাকেজ: {bdt(PACKAGES[country.code].WRK)}</li>
                <li>ভিজিটর প্যাকেজ: {bdt(PACKAGES[country.code].VIS)}</li>
                <li>সেলফ প্যাকেজ: {bdt(PACKAGES[country.code].SLF)}</li>
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
