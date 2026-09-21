"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${on ? "reveal-on" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function MouseField({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--mx", x.toFixed(3));
    node.style.setProperty("--my", y.toFixed(3));
  }

  return (
    <div ref={ref} onMouseMove={move} className={className}>
      {children}
    </div>
  );
}

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-6px)`;
  }

  return (
    <div className="tilt-wrap h-full" onMouseMove={move} onMouseLeave={() => ref.current && (ref.current.style.transform = "")}>
      <div ref={ref} className={`tilt-card h-full ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - progress, 3);
        setShown(Math.round(value * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {shown.toLocaleString("bn-BD")}
      {suffix}
    </span>
  );
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />;
}

export function StickyPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [compact, setCompact] = useState(false);
  const stages = [
    ["০১", "নতুন লিড", "নাম, পাসপোর্ট, ফোন, দক্ষতা ও দেশ নির্বাচন। ইউনিক আইডি জন্ম নেয়।"],
    ["০২", "ডকুমেন্ট যাচাই", "১৮০ দিনের মেয়াদ, ৩৫×৪৫ ছবি, ল্যাপ্লাসিয়ান স্কোর ও ৯০ দিনের ক্লিয়ারেন্স।"],
    ["০৩", "নিয়োগকর্তা ম্যাচ", "ভেরিফাইড ডিমান্ডের বিপরীতে সিভি। ব্ল্যাকলিস্ট হলে ফাইল থামে।"],
    ["০৪", "পারমিট প্যাকেট", "দেশের পোর্টাল চেকলিস্ট, ট্র্যাকিং কোড ও নিয়োগকর্তাকে নোটিশ।"],
    ["০৫", "কনস্যুলার ডেস্ক", "দূতাবাস বা ভিএফএস জমা। স্লট লক হলে ব্রিফিং ইমেইল।"],
    ["০৬", "ভিসা অনুমোদন", "সফটকপি আর্কাইভ, অ্যাফিলিয়েট কমিশন ক্রেডিট।"],
    ["০৭", "ফ্লাইট", "পিএনআর, পিকআপ স্ট্যাটাস ও জরুরি নির্দেশিকা।"],
  ];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 860px)");
    const apply = () => setCompact(media.matches);
    apply();
    media.addEventListener("change", apply);
    const onScroll = () => {
      const node = ref.current;
      if (!node || media.matches) return;
      const total = node.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-node.getBoundingClientRect().top, 0), total);
      const ratio = total > 0 ? scrolled / total : 0;
      setStep(Math.min(stages.length - 1, Math.floor(ratio * stages.length)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      media.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
    };
  }, [stages.length]);

  if (compact) {
    return (
      <div className="stage-rail">
        {stages.map(([no, title, copy]) => (
          <article key={no} className="paper-card min-w-[78vw] rounded-3xl p-5">
            <p className="mono text-xs text-[var(--stamp)]">{no}</p>
            <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#3d5164]">{copy}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[240vh]">
      <div className="sticky top-20 flex h-[calc(100vh-6rem)] items-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="kicker">ফাইল স্ক্রল করুন</p>
            <h2 className="mt-3 text-4xl leading-tight font-semibold md:text-5xl">সাতটি কলাম, একটি ফাইল।</h2>
            <p className="mt-4 max-w-md text-[#3d5164]">
              স্ক্রল করলে ফাইলটি কানবানের পরের ডেস্কে যায়। সাত কার্যদিবস নড়লে লাল এসএলএ অ্যালার্ম জ্বলে।
            </p>
          </div>
          <div className="ink-panel relative overflow-hidden rounded-[32px] p-6 md:p-8">
            <div className="mb-6 flex gap-2">
              {stages.map((_, index) => (
                <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-[var(--gold)]" : "bg-white/15"}`} />
              ))}
            </div>
            <p className="mono text-sm text-[var(--gold)]">{stages[step][0]} / 07</p>
            <h3 className="mt-3 text-4xl font-semibold">{stages[step][1]}</h3>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/80">{stages[step][2]}</p>
            <div className="mt-8 grid grid-cols-7 gap-2">
              {stages.map((stage, index) => (
                <button
                  key={stage[0]}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`rounded-2xl border px-2 py-3 text-center text-[11px] ${index === step ? "border-[var(--gold)] bg-white/10" : "border-white/10 text-white/60"}`}
                >
                  {stage[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
