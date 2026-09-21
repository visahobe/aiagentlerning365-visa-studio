"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { COMPANY } from "@/lib/ops";
import { ScrollProgress } from "@/components/fx";

const PRIMARY = [
  { href: "/countries", label: "দেশ" },
  { href: "/apply", label: "আবেদন" },
  { href: "/track", label: "ট্র্যাক" },
  { href: "/employers", label: "নিয়োগকর্তা" },
  { href: "/tools", label: "সরঞ্জাম" },
  { href: "/admin", label: "কনসোল" },
];

const MORE = [
  { href: "/fees", label: "ফি ক্যালকুলেটর" },
  { href: "/documents", label: "কাগজপত্র" },
  { href: "/compare", label: "দেশ তুলনা" },
  { href: "/calendar", label: "শিফট ক্যালেন্ডার" },
  { href: "/glossary", label: "শব্দকোষ" },
  { href: "/faq", label: "প্রশ্নোত্তর" },
  { href: "/affiliate", label: "সহযোগী এজেন্ট" },
  { href: "/partners", label: "বিদেশি অংশীদার" },
  { href: "/agent", label: "এজেন্ট কনসোল" },
  { href: "/learn", label: "শিখন" },
  { href: "/about", label: "পরিচিতি" },
  { href: "/contact", label: "যোগাযোগ" },
];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [glow, setGlow] = useState({ x: -400, y: -400, on: false });

  useEffect(() => {
    const saved = document.documentElement.dataset.theme || "light";
    setTheme(saved);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("vm365-theme", next);
  }

  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <ScrollProgress />
      <div
        className="cursor-glow no-print hidden md:block"
        style={{ left: glow.x, top: glow.y, opacity: glow.on ? 1 : 0 }}
      />
      <div
        onMouseMove={(event) => setGlow({ x: event.clientX, y: event.clientY, on: true })}
        onMouseLeave={() => setGlow((value) => ({ ...value, on: false }))}
      >
        <header className="site-header no-print">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#122033] text-[#e2bc6a]">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <circle cx="13" cy="13" r="10" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M4 16c2.2-3 5-4.5 9-4.5S20 13 22 16" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="13" cy="11" r="2.2" fill="currentColor" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold leading-tight">{COMPANY.product}</span>
                <span className="block truncate text-xs text-[var(--muted)]">{COMPANY.productBn} · {COMPANY.nameBn}</span>
              </span>
            </Link>
            <nav className="desktop-nav hidden items-center gap-4 lg:flex">
              {PRIMARY.map((item) => (
                <Link key={item.href} href={item.href} data-active={active(item.href)} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" className="btn btn-line px-3" onClick={toggleTheme} aria-label="থিম বদলান">
                {theme === "dark" ? "আলো" : "অন্ধকার"}
              </button>
              <Link href="/apply" className="btn btn-gold hidden sm:inline-flex">ফাইল খুলুন</Link>
              <button type="button" className="btn btn-line lg:hidden" onClick={() => setOpen(true)}>মেনু</button>
            </div>
          </div>
          <div className="hidden border-t border-[var(--line)] lg:block">
            <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 py-2 text-sm text-[var(--muted)]">
              {MORE.map((item) => (
                <Link key={item.href} href={item.href} className={active(item.href) ? "font-semibold text-[var(--ink)]" : ""}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </header>
        {open ? (
          <div className="menu-sheet no-print lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-semibold">{COMPANY.product}</p>
              <button type="button" className="btn btn-line" onClick={() => setOpen(false)}>বন্ধ</button>
            </div>
            <div className="grid gap-2">
              {[...PRIMARY, ...MORE].map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 font-semibold">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <div key={pathname} className="page-enter min-w-0">
          {children}
        </div>
        <footer className="no-print mt-16 border-t border-[var(--line)] bg-[var(--footer)] text-[var(--footer-ink)]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="kicker">ঢাকার ডেস্ক</p>
              <h2 className="mt-3 text-2xl font-semibold">{COMPANY.productBn}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{COMPANY.nameBn}</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">{COMPANY.address}</p>
            </div>
            <div className="text-sm leading-7 text-[var(--muted)]">
              <p>ফোন: {COMPANY.phone}</p>
              <p>ইমেইল: {COMPANY.email}</p>
              <p>পোর্টাল: {COMPANY.portal}</p>
              <p className="mt-3">সরকারি পোর্টালে সরাসরি বট চলে না। এটি পরিচালন ও শিখন স্টুডিও।</p>
            </div>
            <div className="text-sm leading-7">
              <Link href="/about" className="block">প্রতিষ্ঠানের পরিচিতি</Link>
              <Link href="/tools" className="block">সব সরঞ্জাম</Link>
              <Link href="/faq" className="block">প্রশ্নোত্তর</Link>
              <Link href="/contact" className="block">যোগাযোগ</Link>
              <p className="mt-4 text-xs text-[var(--muted)]">ছবি: পেক্সেলস — ওডিনতসভ, এফরে, ওজমেন, বোরোভস্কি, কাদামানি, চোলাক্কাল, আলিম।</p>
            </div>
          </div>
        </footer>
      </div>
      <div className="mobile-dock no-print">
        <Link href="/apply" className="rounded-2xl bg-[var(--gold)] px-2 py-3 text-center text-xs font-bold text-[#1d1408]">আবেদন</Link>
        <Link href="/track" className="rounded-2xl px-2 py-3 text-center text-xs">ট্র্যাক</Link>
        <Link href="/tools" className="rounded-2xl px-2 py-3 text-center text-xs">সরঞ্জাম</Link>
        <button type="button" className="rounded-2xl px-2 py-3 text-center text-xs" onClick={() => setOpen(true)}>মেনু</button>
      </div>
    </>
  );
}
