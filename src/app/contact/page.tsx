import type { Metadata } from "next";
import { COMPANY } from "@/lib/ops";
import { ContactForm } from "./form";

export const metadata: Metadata = { title: "যোগাযোগ" };

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section>
        <p className="kicker">ঢাকার ডেস্ক</p>
        <h1 className="mt-2 text-4xl font-semibold">কথা বলুন, ফাইল নম্বর থাকলে লিখুন।</h1>
        <p className="mt-3 text-sm leading-8 text-[var(--muted)]">{COMPANY.address}</p>
        <p className="mt-3 text-sm leading-7">{COMPANY.phone}<br />{COMPANY.email}<br />{COMPANY.portal}</p>
        <img src="/images/hero-desk.jpg" alt="পরামর্শ ডেস্ক" className="mt-5 h-56 w-full rounded-[24px] object-cover" />
      </section>
      <ContactForm />
    </main>
  );
}
