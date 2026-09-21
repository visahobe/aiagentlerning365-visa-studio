export const COMPANY = {
  product: "VisaMOTion365",
  productBn: "ভিসামোশন৩৬৫",
  nameBn: "ওয়ার্ল্ড ভিশন কনসালটেন্সি",
  nameEn: "World Vision Consultancy",
  address:
    "৪/এ, ইন্দিরা রোড, মাহবুব প্লাজা শপিং কমপ্লেক্স, রুম নং-৪০৩ (লিফট-৩), তেজগাঁও, ঢাকা-১২১৫, বাংলাদেশ",
  phone: "+880 1867-936601",
  phoneHref: "tel:+8801867936601",
  email: "info@worldvisionconsultancy.com",
  portal: "worldvisionconsultancy365.com",
  portalUrl: "https://worldvisionconsultancy365.com",
};

export const EMPLOYER_STATUS_BN: Record<string, string> = {
  Verified: "যাচাইকৃত",
  Pending: "তদন্তাধীন",
  Blacklisted: "কালো তালিকা",
};

export const STAGES = [
  {
    id: "new_lead",
    bn: "নতুন লিড ও আবেদন",
    en: "New lead",
    hint: "প্রাথমিক তথ্য, পাসপোর্ট ও ফি গ্রহণ।",
  },
  {
    id: "docs_verified",
    bn: "ডকুমেন্ট যাচাইকৃত",
    en: "Documents verified",
    hint: "মেয়াদ, ছবির শার্পনেস ও ক্লিয়ারেন্স উত্তীর্ণ।",
  },
  {
    id: "employer_selected",
    bn: "নিয়োগকর্তা নির্বাচন",
    en: "Employer match",
    hint: "ভেরিফাইড ডিমান্ডের বিপরীতে সিভি ম্যাচ।",
  },
  {
    id: "permit_submitted",
    bn: "ওয়ার্ক পারমিট সাবমিশন",
    en: "Permit submitted",
    hint: "সরকারি পোর্টালে রেফারেন্স তৈরি।",
  },
  {
    id: "embassy_review",
    bn: "কনস্যুলার পর্যালোচনা",
    en: "Embassy review",
    hint: "দূতাবাস বা ভিএফএস-এ ফাইল জমা।",
  },
  {
    id: "visa_approved",
    bn: "ভিসা অনুমোদিত",
    en: "Visa approved",
    hint: "অনুমোদন ও কমিশন ক্রেডিট।",
  },
  {
    id: "deployed",
    bn: "ফ্লাইট ও ডিপ্লয়মেন্ট",
    en: "Flight & deployment",
    hint: "টিকিট, পিকআপ ও ব্রিফিং।",
  },
] as const;

export type StageId = (typeof STAGES)[number]["id"];

export const STAGE_IDS = STAGES.map((stage) => stage.id);

export const VISA = {
  WRK: { code: "WRK", category: "Work", bn: "ওয়ার্ক ভিসা", commission: 10000 },
  VIS: { code: "VIS", category: "Visitor", bn: "ভিজিটর ভিসা", commission: 3000 },
  SLF: { code: "SLF", category: "Self_Sponsorship", bn: "সেলফ-স্পন্সরশিপ", commission: 15000 },
} as const;

export type VisaCode = keyof typeof VISA;

export const PACKAGES: Record<string, Record<VisaCode, number>> = {
  TUR: { WRK: 280000, VIS: 45000, SLF: 420000 },
  MLT: { WRK: 350000, VIS: 65000, SLF: 900000 },
  SRB: { WRK: 220000, VIS: 40000, SLF: 260000 },
  MDA: { WRK: 180000, VIS: 35000, SLF: 240000 },
  BLR: { WRK: 190000, VIS: 38000, SLF: 250000 },
  SAU: { WRK: 160000, VIS: 55000, SLF: 750000 },
  BHR: { WRK: 170000, VIS: 42000, SLF: 480000 },
  MYS: { WRK: 210000, VIS: 36000, SLF: 520000 },
};

export const BANK_MINIMUM: Record<VisaCode, number> = {
  WRK: 50000,
  VIS: 150000,
  SLF: 500000,
};

export const PORTALS: Record<string, string> = {
  TUR: "e-İzin / e-Devlet",
  MLT: "Identità / Jobsplus",
  SRB: "eUprava Foreigners Portal",
  MDA: "ANOFM / IGM",
  BLR: "Citizenship & Migration",
  SAU: "Qiwa / Musaned / Enjaz",
  BHR: "LMRA EMS",
  MYS: "FWCMS / ESD",
};

export const STATUS_BN: Record<string, string> = {
  new_lead: "নতুন লিড",
  docs_verified: "ডকুমেন্ট যাচাই",
  employer_selected: "নিয়োগকর্তা ম্যাচ",
  permit_submitted: "পারমিট জমা",
  embassy_review: "এম্বাসি পর্যালোচনা",
  visa_approved: "ভিসা অনুমোদিত",
  deployed: "ফ্লাইট ও ডিপ্লয়মেন্ট",
  rejected: "প্রত্যাখ্যাত",
};

export function visaLabel(code: string) {
  if (code in VISA) return VISA[code as VisaCode].bn;
  return code;
}

export function stageMeta(id: string) {
  return STAGES.find((stage) => stage.id === id);
}

export function bdt(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export function bnDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export function bnDateTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export function daysBetween(from: Date, to: Date) {
  return Math.ceil((to.getTime() - from.getTime()) / 86400000);
}

export function daysUntil(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export function dueBalance(contract: number, paid: number) {
  return Math.max(contract - paid, 0);
}

export function buildMrz(passport: string, expiry: string, name: string) {
  const surname = name
    .normalize("NFKD")
    .replace(/[^A-Za-z ]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "<") || "CLIENT";
  const exp = expiry.replaceAll("-", "").slice(2);
  return `P<BGD${surname.slice(0, 28).padEnd(28, "<")}${passport.toUpperCase().padEnd(9, "<")}BGD${exp}`.slice(0, 44);
}

export function makeTracking(countryCode: string) {
  const digits = (len: number) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");
  switch (countryCode) {
    case "TUR":
      return digits(16);
    case "MLT":
      return `IDM-${digits(8)}`;
    case "SRB":
      return `PPZ-${digits(6)}`;
    case "MDA":
      return `IGM-${digits(7)}`;
    case "BLR":
      return `CMD-${digits(7)}`;
    case "SAU":
      return `QIWA-${digits(8)}`;
    case "BHR":
      return `EMS-${digits(7)}`;
    case "MYS":
      return `ESD-${digits(8)}`;
    default:
      return `REF-${digits(8)}`;
  }
}

export function invoiceNo() {
  return `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
}

export function slaDays(stageEnteredAt: string | Date, status: string) {
  if (status === "deployed" || status === "rejected" || status === "visa_approved") return 0;
  const entered = typeof stageEnteredAt === "string" ? new Date(stageEnteredAt) : stageEnteredAt;
  return Math.max(0, Math.floor((Date.now() - entered.getTime()) / 86400000));
}

export function isSlaAlert(stageEnteredAt: string | Date, status: string) {
  return slaDays(stageEnteredAt, status) >= 7;
}
