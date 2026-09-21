"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";
import { BANK_MINIMUM, bdt, PACKAGES, type VisaCode, VISA } from "@/lib/ops";

type Score = { score: number; ratioOk: boolean; whiteBackground: boolean; width: number; height: number };

async function scorePhoto(file: File): Promise<Score> {
  const bitmap = await createImageBitmap(file);
  const width = 160;
  const height = Math.max(2, Math.round((bitmap.height / bitmap.width) * width));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("canvas");
  context.drawImage(bitmap, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const gray = new Float32Array(width * height);
  for (let index = 0; index < gray.length; index += 1) {
    const offset = index * 4;
    gray[index] = 0.299 * pixels[offset] + 0.587 * pixels[offset + 1] + 0.114 * pixels[offset + 2];
  }
  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      const lap = gray[index - width] + gray[index - 1] + gray[index + 1] + gray[index + width] - 4 * gray[index];
      sum += lap;
      sumSq += lap * lap;
      count += 1;
    }
  }
  const mean = sum / count;
  const variance = Math.max(0, sumSq / count - mean * mean);
  const corners = [0, width - 1, (height - 1) * width, height * width - 1];
  const cornerAvg = corners.reduce((total, index) => total + gray[index], 0) / corners.length;
  const ratio = bitmap.width / bitmap.height;
  return {
    score: Math.round(variance),
    ratioOk: Math.abs(ratio - 35 / 45) < 0.18,
    whiteBackground: cornerAvg > 170,
    width: bitmap.width,
    height: bitmap.height,
  };
}

export function ApplyForm({ referral, country }: { referral: string; country: string }) {
  const router = useRouter();
  const [visa, setVisa] = useState<VisaCode>("WRK");
  const [countryCode, setCountryCode] = useState(country || "SRB");
  const [samplePhoto, setSamplePhoto] = useState(false);
  const [photo, setPhoto] = useState<Score | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const fee = PACKAGES[countryCode]?.[visa] ?? 0;
  const advance = Math.round(fee * 0.3);

  const summary = useMemo(
    () => [
      ["প্যাকেজ", bdt(fee)],
      ["প্রস্তাবিত অগ্রিম ৩০%", bdt(advance)],
      ["ব্যাংক ফ্লোর", bdt(BANK_MINIMUM[visa])],
      ["অ্যাফিলিয়েট কমিশন", bdt(VISA[visa].commission)],
    ],
    [advance, fee, visa],
  );

  async function onFile(file: File | null) {
    if (!file) return;
    setSamplePhoto(false);
    const scored = await scorePhoto(file);
    setPhoto(scored);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors([]);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        passportNo: form.get("passportNo"),
        passportExpiry: form.get("passportExpiry"),
        phone: form.get("phone"),
        email: form.get("email"),
        age: Number(form.get("age")),
        skill: form.get("skill"),
        countryCode,
        visaCode: visa,
        policeClearanceDate: form.get("policeClearanceDate"),
        bankBalance: Number(form.get("bankBalance")),
        photoScore: photo?.score ?? 0,
        ratioOk: photo?.ratioOk ?? false,
        whiteBackground: photo?.whiteBackground ?? false,
        referralCode: form.get("referralCode"),
        advanceAmount: Number(form.get("advanceAmount") || 0),
        paymentMethod: form.get("paymentMethod"),
        trxId: form.get("trxId"),
        samplePhoto,
      }),
    });
    const data = (await response.json()) as { ok: boolean; errors?: string[]; clientCode?: string };
    setPending(false);
    if (!data.ok || !data.clientCode) {
      setErrors(data.errors ?? ["আবেদন জমা হয়নি।"]);
      return;
    }
    router.push(`/track?code=${data.clientCode}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="paper-card space-y-4 rounded-[28px] p-5 md:p-7">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">পূর্ণ নাম
            <input name="fullName" className="input mt-1" placeholder="মো. রাহিম উদ্দিন" required />
          </label>
          <label className="text-sm font-semibold">ফোন
            <input name="phone" className="input mt-1" placeholder="017XXXXXXXX" required />
          </label>
          <label className="text-sm font-semibold">পাসপোর্ট নম্বর
            <input name="passportNo" className="input mt-1 uppercase" placeholder="A04551219" required />
          </label>
          <label className="text-sm font-semibold">মেয়াদোত্তীর্ণ
            <input name="passportExpiry" type="date" className="input mt-1" required />
          </label>
          <label className="text-sm font-semibold">বয়স
            <input name="age" type="number" min={18} max={70} className="input mt-1" required />
          </label>
          <label className="text-sm font-semibold">ইমেইল
            <input name="email" type="email" className="input mt-1" placeholder="you@email.com" />
          </label>
        </div>
        <label className="block text-sm font-semibold">দক্ষতা বা উদ্দেশ্য
          <input name="skill" className="input mt-1" placeholder="ওয়েল্ডার / পারিবারিক সফর / কোম্পানি ডিরেক্টর" required />
        </label>
        <div>
          <p className="text-sm font-semibold">গন্তব্য</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {COUNTRIES.map((item) => (
              <button
                type="button"
                key={item.code}
                onClick={() => setCountryCode(item.code)}
                className={`rounded-2xl border px-3 py-3 text-left text-sm ${countryCode === item.code ? "border-[var(--navy)] bg-[var(--navy)] text-white" : "border-[var(--line)] bg-white"}`}
              >
                {item.flag} {item.nameBn}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">ভিসা শ্রেণি</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {(Object.keys(VISA) as VisaCode[]).map((code) => (
              <button
                type="button"
                key={code}
                onClick={() => setVisa(code)}
                className={`rounded-2xl border px-3 py-3 text-sm ${visa === code ? "border-[var(--stamp)] bg-[#fff4ef]" : "border-[var(--line)] bg-white"}`}
              >
                {VISA[code].bn}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">পুলিশ ক্লিয়ারেন্স ইস্যু
            <input name="policeClearanceDate" type="date" className="input mt-1" required />
          </label>
          <label className="text-sm font-semibold">ব্যাংক ব্যালেন্স (টাকা)
            <input name="bankBalance" type="number" className="input mt-1" placeholder={String(BANK_MINIMUM[visa])} required />
          </label>
        </div>
        <div className="rounded-3xl border border-dashed border-[var(--line)] p-4">
          <p className="text-sm font-semibold">ছবি ফিল্টার · ৩৫×৪৫, সাদা ব্যাকগ্রাউন্ড, শার্পনেস ≥ ১০০</p>
          <input
            type="file"
            accept="image/*"
            className="mt-3 block w-full text-sm"
            onChange={(event) => void onFile(event.target.files?.[0] ?? null)}
          />
          <button type="button" className="btn btn-line mt-3" onClick={() => { setSamplePhoto(true); setPhoto(null); }}>
            ডেমো নমুনা ছবি ব্যবহার করুন
          </button>
          {photo ? (
            <p className="mt-3 text-sm">
              স্কোর {photo.score} · অনুপাত {photo.ratioOk ? "ঠিক আছে" : "বন্ধ"} · ব্যাকগ্রাউন্ড {photo.whiteBackground ? "সাদা" : "গাঢ়"} · {photo.width}×{photo.height}
            </p>
          ) : null}
          {samplePhoto ? <p className="mt-2 text-sm text-[var(--teal)]">নমুনা স্কোর ১৪২ ধরে নেওয়া হবে।</p> : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-semibold">রেফারেল
            <input name="referralCode" defaultValue={referral} className="input mt-1" placeholder="WVC-DHK-01" />
          </label>
          <label className="text-sm font-semibold">অগ্রিম
            <input name="advanceAmount" type="number" defaultValue={advance} className="input mt-1" />
          </label>
          <label className="text-sm font-semibold">মাধ্যম
            <select name="paymentMethod" className="input mt-1" defaultValue="bKash">
              <option>bKash</option>
              <option>Nagad</option>
              <option>Bank</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-semibold">ট্রানজ্যাকশন আইডি
          <input name="trxId" className="input mt-1" placeholder="ঐচ্ছিক" />
        </label>
        {errors.length ? (
          <ul className="rounded-2xl bg-[#c4492c] px-4 py-3 text-sm leading-6 text-white">
            {errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        ) : null}
        <button className="btn btn-ink w-full" disabled={pending} type="submit">
          {pending ? "ফিল্টার চলছে..." : "ফাইল জমা দিন"}
        </button>
      </div>
      <aside className="space-y-4">
        <div className="ink-panel rounded-[28px] p-5">
          <p className="kicker">লাইভ কোট</p>
          <h2 className="mt-2 text-3xl font-semibold">{COUNTRIES.find((item) => item.code === countryCode)?.nameBn}</h2>
          <p className="text-white/70">{VISA[visa].bn}</p>
          <dl className="mt-5 space-y-3 text-sm">
            {summary.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                <dt className="text-white/65">{label}</dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-6 text-white/60">
            আইডি ফরম্যাট WVC-{countryCode}-{visa}-{new Date().getFullYear()}-ক্রম। ইমেইল লগ info@worldvisionconsultancy.com পরিচয়ে সংরক্ষিত হয়।
          </p>
        </div>
        <div className="paper-card rounded-[28px] p-5 text-sm leading-7 text-[#3d5164]">
          <p className="font-semibold text-[var(--ink)]">যা জমা হবে না</p>
          <p>১৮০ দিনের কম মেয়াদি পাসপোর্ট, ঘোলা ছবি, ৯০ দিনের বেশি পুরনো ক্লিয়ারেন্স, অপর্যাপ্ত ব্যালেন্স।</p>
        </div>
      </aside>
    </form>
  );
}
