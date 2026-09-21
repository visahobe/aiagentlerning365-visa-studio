"use client";

import { useState, type FormEvent } from "react";
import { COMPANY } from "@/lib/ops";

export function ContactForm() {
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        topic: form.get("topic"),
        message: form.get("message"),
      }),
    });
    const data = (await response.json()) as { ok: boolean; error?: string; message?: string };
    setPending(false);
    setNote(data.error || data.message || "জমা হয়নি।");
    if (data.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="paper-card space-y-3 rounded-[28px] p-5">
      <input name="name" className="input" placeholder="নাম" required />
      <input name="phone" className="input" placeholder="ফোন" required />
      <input name="email" type="email" className="input" placeholder="ইমেইল, থাকলে" />
      <select name="topic" className="input" defaultValue="নতুন ফাইল">
        <option>নতুন ফাইল</option>
        <option>চলমান ফাইল</option>
        <option>নিয়োগকর্তা যাচাই</option>
        <option>সহযোগী কমিশন</option>
        <option>অভিযোগ</option>
      </select>
      <textarea name="message" className="input" placeholder="বার্তা" required />
      <button className="btn btn-ink w-full" disabled={pending} type="submit">{pending ? "পাঠানো হচ্ছে" : "ডেস্কে পাঠান"}</button>
      {note ? <p className="text-sm leading-7">{note}</p> : null}
      <p className="text-xs leading-6 text-[var(--muted)]">সরাসরি কল {COMPANY.phone}। ইমেইল {COMPANY.email}।</p>
    </form>
  );
}
