"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { BANK_MINIMUM, bdt, COMPANY, PACKAGES, VISA } from "@/lib/ops";
import { CountUp, MouseField, Reveal, StickyPipeline, TiltCard } from "@/components/fx";

type HomeStats = {
  clients: number;
  verifiedEmployers: number;
  openDemands: number;
  approved: number;
  sla: number;
  pipeline: { stage: string; count: number }[];
  recent: { code: string; name: string; country: string; visa: string; status: string }[];
  countryLoad: { code: string; nameBn: string; flag: string; clients: number; demands: number }[];
};

const TRIGGERS = [
  ["অনবোর্ডিং", "ফাইল জমা ও আইডি ইমেইল", "আপনার ফাইল সফলভাবে জমা হয়েছে - আইডি: WVC-..."],
  ["ক্যান্ডিডেট ম্যাচ", "নিয়োগকর্তার ইনবক্সে সিভি নোট", "We have a new candidate for your demand"],
  ["পারমিট", "ক্লায়েন্ট ও নিয়োগকর্তা উভয়কে", "Work Permit Application Submitted"],
  ["এম্বাসি", "কনস্যুলার জমার মুহূর্তে", "আপনার ফাইল এম্বাসিতে জমা হয়েছে"],
  ["কমিশন", "অ্যাফিলিয়েট লেজার ক্রেডিট", "কমিশন যোগ হয়েছে"],
  ["সাপ্তাহিক", "পার্টনার ডিপ্লয়মেন্ট সারাংশ", "Weekly Deployment Report"],
  ["সিদ্ধান্ত", "অনুমোদন বা প্রত্যাখ্যান", "অভিনন্দন / আপিল নোটিশ"],
  ["ফ্লাইট", "পিএনআর ও পিকআপ ব্রিফ", "চূড়ান্ত ডিপ্লয়মেন্ট ব্রিফিং"],
];

export function HomeView({ stats }: { stats: HomeStats }) {
  const [days, setDays] = useState(420);
  const [sharp, setSharp] = useState(128);
  const blocked = days < 180 || sharp < 100;
  const portals = useMemo(() => [...COUNTRIES, ...COUNTRIES], []);

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pt-6 md:pt-10">
        <MouseField className="paper-card relative overflow-hidden rounded-[32px] px-5 py-8 md:px-10 md:py-12">
          <div className="pointer-events-none absolute -top-16 right-8 h-48 w-48 rounded-full bg-[var(--gold)]/20 blur-3xl parallax-b" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-40 w-40 rounded-full bg-[var(--teal)]/20 blur-3xl parallax-c" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="kicker">ভিসামোশন৩৬৫ · গভীর স্বয়ংক্রিয় ডেস্ক</p>
              <h1 className="mt-4 text-4xl leading-[1.15] font-semibold md:text-6xl">
                আটটি দেশ। তিনটি পথ।
                <span className="display mt-2 block text-[var(--navy)]">VisaMOTion365</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
                ওয়ার্ল্ড ভিশন কনসালটেন্সির ব্যাক-অফিস এখন একটি দৃশ্যমান পাইপলাইন: ক্লায়েন্ট অনবোর্ডিং, পাসপোর্ট ফিল্টার,
                ভেরিফাইড নিয়োগকর্তা, বিটুবি অ্যাফিলিয়েট, পেমেন্ট লেজার, ইমেইল ট্রিগার ও কানবান — তুরস্ক থেকে মালয়েশিয়া।
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/apply" className="btn btn-gold">নতুন ফাইল খুলুন</Link>
                <Link href="/learn" className="btn btn-line">পুরো নকশা পড়ুন</Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [stats.clients, "লাইভ ফাইল"],
                  [stats.verifiedEmployers, "ভেরিফাইড নিয়োগকর্তা"],
                  [stats.openDemands, "খোলা ডিমান্ড"],
                  [stats.sla, "এসএলএ অ্যালার্ট"],
                ].map(([value, label]) => (
                  <div key={String(label)} className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-3">
                    <p className="text-2xl font-semibold text-[var(--navy)]">
                      <CountUp value={Number(value)} />
                    </p>
                    <p className="text-xs text-[var(--muted)]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/hero-desk.jpg"
                alt="প্যাসপোর্ট, সিল ও ডসিয়ারসহ কনসালটেন্সি ডেস্ক"
                className="parallax-a h-[340px] w-full rounded-[28px] object-cover md:h-[460px]"
              />
              <div className="absolute -left-3 top-6 stamp text-center text-[11px] leading-tight md:left-[-18px]">
                ভিসা
                <span className="block text-[9px]">ঢাকা</span>
                ২০২৬
              </div>
              <div className="absolute right-4 bottom-4 max-w-[220px] rounded-2xl bg-[#07131f]/80 p-3 text-xs leading-5 backdrop-blur">
                আইডি নমুনা
                <span className="mono mt-1 block text-sm text-[var(--gold)]">WVC-SRB-WRK-2026-0001</span>
              </div>
            </div>
          </div>
        </MouseField>
      </section>

      <section className="mt-8 marquee-mask">
        <div className="marquee-track px-4">
          {portals.map((country, index) => (
            <span key={`${country.code}-${index}`} className="chip">
              {country.flag} {country.portal}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <Reveal>
          <p className="kicker text-[var(--stamp)]">কেন ম্যানুয়াল ডেস্ক আটকে যায়</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold md:text-5xl">আইন বদলায়, ফাইল দেরি করে, একটি ভুল পাসপোর্ট পুরো ব্যাচ থামায়।</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["০১", "মানবীয় ত্রুটি", "হাতের ডেটা এন্ট্রিতে মেয়াদ, নামের বানান ও রেফারেন্স কোড গুলিয়ে যায়। ফিল্টার সেটা জমার আগেই ধরে।"],
            ["০২", "নিয়মের স্রোত", "e-İzin, Identità, eUprava, Qiwa, LMRA, FWCMS — আটটি দেশের পোর্টাল এক চেকলিস্টে নয়।"],
            ["০৩", "অস্বচ্ছ কমিশন", "সাব-এজেন্ট ও বিদেশি পার্টনার একই খাতায় না থাকলে টাকা ও প্রতিশ্রুতি দুটোই ঝুলে থাকে।"],
          ].map(([no, title, copy], index) => (
            <Reveal key={no} delay={index * 90}>
              <article className="paper-card h-full rounded-[28px] p-6">
                <p className="mono text-xs text-[var(--stamp)]">{no}</p>
                <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#3d5164]">{copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <img src="/images/agent-map.jpg" alt="আটটি পিনযুক্ত মানচিত্র" className="h-80 w-full rounded-[28px] object-cover" />
          </Reveal>
          <Reveal delay={80}>
            <p className="kicker text-[var(--teal)]">সমন্বিত পাইপলাইন</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">ছয়টি ডেস্ক, একটি ফাইল আইডি।</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["ব্রাউজার এজেন্ট কনসোল", "সিআরএম কানবান", "ভেরিফাইড এমপ্লয়ার", "বিটুবি অ্যাফিলিয়েট", "ইমেইল ইঞ্জিন", "পেমেন্ট লেজার"].map((item) => (
                <div key={item} className="rounded-2xl border border-[var(--line)] bg-white/70 px-3 py-4 text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
            <svg viewBox="0 0 360 70" className="mt-4 w-full" aria-hidden="true">
              <path d="M10 35 H350" stroke="#0b3c5d" strokeWidth="1.4" fill="none" className="route-dash" />
              {[20, 90, 160, 230, 300, 345].map((x) => (
                <circle key={x} cx={x} cy="35" r="5" fill="#d7b16a" />
              ))}
            </svg>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker text-[var(--navy)]">আট দেশের ফ্রেমওয়ার্ক</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-5xl">ওয়ার্ক, ভিজিট, সেলফ-স্পন্সর।</h2>
            </div>
            <Link href="/countries" className="btn btn-line">সব দেশের নিয়ম</Link>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTRIES.map((country, index) => {
            const load = stats.countryLoad.find((item) => item.code === country.code);
            return (
              <Reveal key={country.code} delay={index * 40}>
                <TiltCard>
                  <Link href={`/countries/${country.code}`} className="paper-card block h-full overflow-hidden rounded-[26px]">
                    <div className="relative h-36">
                      <img src={country.image} alt={`${country.nameBn} দৃশ্য`} className="h-full w-full object-cover" />
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold">{country.flag} {country.code}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold">{country.nameBn}</h3>
                      <p className="text-xs text-[#607086]">{country.nameEn} · {country.processing}</p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#3d5164]">{country.highlight}</p>
                      <p className="mt-3 text-xs font-semibold text-[var(--navy)]">
                        {load?.clients ?? 0} ফাইল · {load?.demands ?? 0} খোলা ডিমান্ড
                      </p>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <Reveal>
          <p className="kicker text-[var(--stamp)]">তিনটি পাথওয়ে</p>
          <h2 className="mt-2 text-3xl font-semibold">একই প্রার্থী, আলাদা আইনি দরজা।</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            ["WRK", "ওয়ার্ক ভিসা", "নিয়োগকর্তার পোর্টাল, লেবার মার্কেট টেস্ট ও কোটা। কমিশন ১০,০০০ টাকা।", "১০,০০০"],
            ["VIS", "ভিজিটর ভিসা", "ই-ভিসা, স্টিকার বা আমন্ত্রণ। কাজের অধিকার নেই। কমিশন ৩,০০০ টাকা।", "৩,০০০"],
            ["SLF", "সেলফ-স্পন্সর", "কোম্পানি, আইটি পার্ক বা ইনভেস্টর লাইসেন্স। কমিশন ১৫,০০০ টাকা।", "১৫,০০০"],
          ].map(([code, title, copy]) => (
            <article key={code} className="ticket rounded-[28px] p-6">
              <p className="mono text-xs text-[var(--navy)]">{code}</p>
              <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#3d5164]">{copy}</p>
              <p className="mt-4 text-sm font-semibold">সার্বিয়া প্যাকেজ {bdt(PACKAGES.SRB[code as "WRK"])}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-4 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="paper-card rounded-[28px] p-6 md:p-8">
            <p className="kicker text-[var(--teal)]">ভ্যালিডেশন ল্যাব</p>
            <h2 className="mt-2 text-3xl font-semibold">জমার আগে ফাইল নিজেই না বলে।</h2>
            <label className="mt-6 block text-sm font-semibold">পাসপোর্টের অবশিষ্ট দিন: {days.toLocaleString("bn-BD")}</label>
            <input className="mt-2 w-full accent-[var(--navy)]" type="range" min={30} max={700} value={days} onChange={(event) => setDays(Number(event.target.value))} />
            <label className="mt-4 block text-sm font-semibold">ল্যাপ্লাসিয়ান শার্পনেস: {sharp}</label>
            <input className="mt-2 w-full accent-[var(--stamp)]" type="range" min={20} max={220} value={sharp} onChange={(event) => setSharp(Number(event.target.value))} />
            <div className={`mt-5 rounded-2xl px-4 py-4 text-sm leading-7 ${blocked ? "bg-[#c4492c] text-white" : "bg-[#1c7c6b] text-white"}`}>
              {blocked
                ? "রিজেকশন। মেয়াদ ১৮০ দিনের কম অথবা শার্পনেস ১০০-এর নিচে। পোর্টাল এই ফাইল নেবে না।"
                : "গ্রহণযোগ্য। এমআরজেড মেয়াদ, ৩৫×৪৫ অনুপাত ও সাদা ব্যাকগ্রাউন্ডের নিয়ম পাস।"}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-[#3d5164] sm:grid-cols-2">
              <p>পুলিশ ক্লিয়ারেন্স: ইস্যুর ৯০ দিনের মধ্যে।</p>
              <p>ভিজিটর ব্যাংক ফ্লোর: {bdt(BANK_MINIMUM.VIS)}</p>
              <p>ওয়ার্ক ব্যাংক ফ্লোর: {bdt(BANK_MINIMUM.WRK)}</p>
              <p>সেলফ-স্পন্সর ফ্লোর: {bdt(BANK_MINIMUM.SLF)}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="ink-panel h-full rounded-[28px] p-6 md:p-8">
            <p className="kicker">ইউনিক আইডি</p>
            <h2 className="mt-2 text-3xl font-semibold">WVC-দেশ-ভিসা-বছর-ক্রম</h2>
            <p className="mono mt-6 rounded-2xl bg-black/20 px-4 py-4 text-lg text-[var(--gold)]">WVC-SRB-WRK-2026-0001</p>
            <ul className="mt-5 space-y-2 text-sm leading-7 text-white/75">
              <li>WVC — প্রতিষ্ঠানের স্থায়ী প্রিফিক্স।</li>
              <li>SRB — আইএসও দেশকোড। TUR, MLT, MDA, BLR, SAU, BHR, MYS।</li>
              <li>WRK / VIS / SLF — ভিসা শ্রেণি।</li>
              <li>২০২৬ — আবেদনের বছর। 0001 — বার্ষিক চার অঙ্কের ক্রম।</li>
            </ul>
            <p className="mt-6 text-sm text-white/60">Due = মোট চুক্তি − (অগ্রিম + অন্তর্বর্তী)। বিকাশ, নগদ ও ব্যাংক একই লেজারে।</p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <article className="paper-card h-full rounded-[28px] p-6">
              <p className="kicker text-[var(--navy)]">নিয়োগকর্তা কমপ্লায়েন্স</p>
              <h2 className="mt-2 text-3xl font-semibold">ট্যাক্স আইডি মিললেই ডিমান্ড খোলে না।</h2>
              <p className="mt-3 text-sm leading-7 text-[#3d5164]">
                প্রতিটি কোম্পানিতে রেজিস্ট্রেশন, ভ্যাট, যোগাযোগ, ডোমেইন ইমেইল ও তিনটি স্ট্যাটাস: যাচাইকৃত, তদন্তাধীন, কালো তালিকা।
                কালো তালিকার ট্যাক্স আইডি নতুন ডিমান্ড আনলে সিকিউরিটি অ্যালার্ট ওঠে এবং চুক্তি তৈরি হয় না।
              </p>
              <Link href="/employers" className="btn btn-ink mt-5">ডিরেক্টরি খুলুন</Link>
            </article>
          </Reveal>
          <Reveal delay={70}>
            <article className="paper-card h-full rounded-[28px] p-6">
              <p className="kicker text-[var(--stamp)]">দ্বিমুখী পার্টনারশিপ</p>
              <h2 className="mt-2 text-3xl font-semibold">উপজেলার এজেন্ট ও বিদেশি ডেস্ক।</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)]">
                <table className="w-full text-left text-sm">
                  <tbody>
                    <tr className="border-b border-[var(--line)]">
                      <td className="px-3 py-3">ওয়ার্ক</td>
                      <td className="px-3 py-3 font-semibold">{bdt(VISA.WRK.commission)}</td>
                    </tr>
                    <tr className="border-b border-[var(--line)]">
                      <td className="px-3 py-3">ভিজিটর</td>
                      <td className="px-3 py-3 font-semibold">{bdt(VISA.VIS.commission)}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3">সেলফ-স্পন্সর</td>
                      <td className="px-3 py-3 font-semibold">{bdt(VISA.SLF.commission)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/affiliate" className="btn btn-line">অ্যাফিলিয়েট ওয়ালেট</Link>
                <Link href="/partners" className="btn btn-line">প্রফিট শেয়ার</Link>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <Reveal>
          <p className="kicker text-[var(--navy)]">ইমেইল ইঞ্জিন</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">প্রতিটি ঘটনা info@worldvisionconsultancy.com থেকে একটি চিঠি।</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {TRIGGERS.map(([title, copy, subject], index) => (
            <Reveal key={title} delay={index * 40}>
              <article className="flex gap-4 rounded-3xl bg-white/80 p-4">
                <span className="mono grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--ink)] text-xs text-[var(--gold)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-[#3d5164]">{copy}</p>
                  <p className="mono mt-1 text-xs text-[var(--navy)]">{subject}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="ink-panel grid gap-6 overflow-hidden rounded-[32px] p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
          <div>
            <p className="kicker">এজেন্ট শিফট · BST</p>
            <h2 className="mt-2 text-3xl font-semibold">সকাল ৯, দুপুর ২, রাত ৯।</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              কনসোল এই তিন উইন্ডোতে স্লট স্ক্যান ও স্ট্যাটাস নোট সিমুলেট করে। ক্লাউডফ্লেয়ার এড়ানো বা সরকারি পোর্টালে অটো-লগইন এই স্টুডিওতে নেই — কাজটি সুপারভাইজড কিউ।
            </p>
            <Link href="/agent" className="btn btn-gold mt-5">এজেন্ট কনসোল</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["09:00", "14:00", "21:00"].map((slot) => (
              <div key={slot} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border border-[var(--gold)]/50">
                  <span className="clock-hand block h-6 w-0.5 bg-[var(--gold)]" />
                </div>
                <p className="mono text-lg">{slot}</p>
                <p className="text-xs text-white/60">ঢাকার স্ক্যান</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <StickyPipeline />
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-4">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <img src="/images/office-dhaka.jpg" alt="তেজগাঁও অফিসের মিটিং রুম" className="h-72 w-full rounded-[28px] object-cover md:h-full" />
          </Reveal>
          <Reveal>
            <div className="paper-card h-full rounded-[28px] p-6 md:p-8">
              <p className="kicker text-[var(--stamp)]">ঢাকা ডেস্ক</p>
              <h2 className="mt-2 text-3xl font-semibold">{COMPANY.nameBn}</h2>
              <p className="mt-3 text-sm leading-7 text-[#3d5164]">{COMPANY.address}</p>
              <p className="mt-3 text-sm">{COMPANY.phone}</p>
              <p className="text-sm">{COMPANY.email}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={COMPANY.phoneHref} className="btn btn-ink">কল করুন</a>
                <Link href="/track" className="btn btn-line">ফাইল ট্র্যাক</Link>
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold text-[#607086]">সাম্প্রতিক ফাইল</p>
                <ul className="mt-2 space-y-2">
                  {stats.recent.map((item) => (
                    <li key={item.code} className="flex items-center justify-between gap-3 text-sm">
                      <span>{item.name}</span>
                      <span className="mono text-xs text-[var(--navy)]">{item.code}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
