"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";

export function ScreenForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/employers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.get("companyName"),
        countryCode: form.get("countryCode"),
        tradeLicenseNo: form.get("tradeLicenseNo"),
        taxId: form.get("taxId"),
        contactPerson: form.get("contactPerson"),
        email: form.get("email"),
        phone: form.get("phone"),
        jobTitle: form.get("jobTitle"),
        requiredWorkers: Number(form.get("requiredWorkers") || 1),
        salary: Number(form.get("salary") || 0),
        currency: form.get("currency"),
      }),
    });
    const data = (await response.json()) as { ok: boolean; error?: string; message?: string; blocked?: boolean };
    setPending(false);
    setBlocked(Boolean(data.blocked));
    setMessage(data.error || data.message || "সম্পন্ন।");
    if (data.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="paper-card rounded-[28px] p-5">
      <p className="kicker text-[var(--stamp)]">কালো তালিকা স্ক্রিন</p>
      <h2 className="mt-2 text-2xl font-semibold">নতুন ডিমান্ড আনলে আগে ট্যাক্স আইডি মিলবে।</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="companyName" className="input" placeholder="কোম্পানির নাম" required />
        <select name="countryCode" className="input" defaultValue="SAU">
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>{country.nameBn}</option>
          ))}
        </select>
        <input name="tradeLicenseNo" className="input" placeholder="ট্রেড লাইসেন্স" required />
        <input name="taxId" className="input" placeholder="ট্যাক্স আইডি — চেষ্টা করুন TAX-SAU-BLACK-19" required />
        <input name="contactPerson" className="input" placeholder="যোগাযোগকারী" />
        <input name="email" className="input" placeholder="অফিসিয়াল ইমেইল" />
        <input name="jobTitle" className="input" placeholder="পদের নাম" />
        <input name="requiredWorkers" type="number" className="input" placeholder="কোটা" />
        <input name="salary" type="number" className="input" placeholder="মাসিক বেতন" />
        <input name="currency" className="input" placeholder="মুদ্রা" defaultValue="USD" />
      </div>
      <button className="btn btn-ink mt-4" disabled={pending} type="submit">{pending ? "স্ক্রিন হচ্ছে" : "স্ক্রিন ও খসড়া ডিমান্ড"}</button>
      {message ? <p className={`mt-3 rounded-2xl px-3 py-3 text-sm ${blocked ? "bg-[#c4492c] text-white" : "bg-[#e7f4ef] text-[#145c4d]"}`}>{message}</p> : null}
    </form>
  );
}
