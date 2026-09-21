"use client";

import { useEffect, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

const BASE = [
  "পাসপোর্টের অবশিষ্ট মেয়াদ কমপক্ষে ১৮০ দিন",
  "পাসপোর্টের তথ্যপাতা ও সব ভিসা পাতার স্ক্যান",
  "৩৫×৪৫ মিলিমিটার সাদা ব্যাকগ্রাউন্ডের স্পষ্ট ছবি, শার্পনেস ১০০ বা বেশি",
  "পুলিশ ক্লিয়ারেন্স, ইস্যুর ৯০ দিনের মধ্যে",
  "সাম্প্রতিক ছয় মাসের ব্যাংক স্টেটমেন্ট",
  "জাতীয় পরিচয়পত্রের অনুলিপি",
  "ফোন নম্বর ও জরুরি যোগাযোগ",
];

const EXTRA: Record<string, string[]> = {
  WRK: ["নিয়োগকর্তার ডিমান্ড লেটার", "দক্ষতার সনদ বা অভিজ্ঞতার চিঠি", "মেডিকেল কেন্দ্রের ফিটনেস, যেখানে প্রযোজ্য"],
  VIS: ["ভ্রমণ পরিকল্পনা ও ফেরত যাত্রা", "থাকার ঠিকানা বা আমন্ত্রণ", "ভিজিটর ভিসায় কাজ করা যাবে না — স্বীকারোক্তি"],
  SLF: ["কোম্পানি গঠনের চেকলিস্ট", "মূলধন বা ব্যাংক প্রমাণ", "ট্যাক্স নম্বরের আবেদন নোট"],
};

const COUNTRY_EXTRA: Record<string, string> = {
  TUR: "তুরস্ক: ১৬ ডিজিটের কনস্যুলার রেফারেন্স নিয়োগকর্তার ফাইলের সাথে মিলবে।",
  MLT: "মাল্টা: আবেদন শুধু নিয়োগকর্তার পোর্টাল অ্যাকাউন্ট থেকে।",
  SRB: "সার্বিয়া: এনইএসের পিপিজেড আইডি ছাড়া ইউনিফায়েড আবেদন দুর্বল।",
  MDA: "মলদোভা: ভিজিটরে সত্যায়িত আমন্ত্রণ বাধ্যতামূলক।",
  BLR: "বেলারুশ: স্পেশাল পারমিটের মূল কপি ও চুক্তি।",
  SAU: "সৌদি আরব: কিওয়া চুক্তি, ওয়াকালা, ওয়াফিদ ও বিএমইটি আলাদা ধাপ।",
  BHR: "বাহরাইন: সাত দিনের স্থানীয় শূন্যপদ বিজ্ঞপ্তি।",
  MYS: "মালয়েশিয়া: ব্লু-কলার ও পেশাদার পাস আলাদা পোর্টাল।",
};

export function Checklist() {
  const [visa, setVisa] = useState("WRK");
  const [country, setCountry] = useState("SAU");
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vm365-docs");
      if (saved) setDone(JSON.parse(saved) as string[]);
    } catch {
      setDone([]);
    }
  }, []);

  function toggle(item: string) {
    const next = done.includes(item) ? done.filter((value) => value !== item) : [...done, item];
    setDone(next);
    localStorage.setItem("vm365-docs", JSON.stringify(next));
  }

  const items = [...BASE, ...EXTRA[visa], COUNTRY_EXTRA[country]];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="input" value={country} onChange={(event) => setCountry(event.target.value)}>
          {COUNTRIES.map((item) => <option key={item.code} value={item.code}>{item.nameBn}</option>)}
        </select>
        <select className="input" value={visa} onChange={(event) => setVisa(event.target.value)}>
          <option value="WRK">ওয়ার্ক ভিসা</option>
          <option value="VIS">ভিজিটর ভিসা</option>
          <option value="SLF">সেলফ-স্পন্সরশিপ</option>
        </select>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <label className="paper-card flex items-start gap-3 rounded-2xl px-4 py-3 text-sm leading-7">
              <input type="checkbox" className="mt-1 h-5 w-5" checked={done.includes(item)} onChange={() => toggle(item)} />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="text-sm text-[var(--muted)]">সম্পন্ন {done.filter((item) => items.includes(item)).length} / {items.length}। টিক এই ফোনে সংরক্ষিত থাকে।</p>
    </div>
  );
}
