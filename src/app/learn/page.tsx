import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { Reveal } from "@/components/fx";

export const dynamic = "force-dynamic";

const chapters = [
  {
    id: "why",
    title: "কেন এই ডেস্ক",
    body: "আন্তর্জাতিক ভিসা ব্যাক-অফিস আইন, ডেটা এন্ট্রি ও বহুস্তর যাচাইয়ের ওপর দাঁড়িয়ে। ম্যানুয়াল পদ্ধতিতে পাসপোর্টের মেয়াদ ফসকে যায়, দূতাবাসের নিয়ম বদলালে পুরনো চেকলিস্ট থেকে যায়, আর সাব-এজেন্টের কমিশন মুখে মুখে ঠিক হয়। ওয়ার্ল্ড ভিশন কনসালটেন্সির এই স্টুডিও সেই ছয়টি কাজকে এক ফাইল আইডিতে বেঁধেছে: অনবোর্ডিং, নিয়োগকর্তা, অ্যাফিলিয়েট, পেমেন্ট, ইমেইল ও কানবান।",
  },
  {
    id: "countries",
    title: "আট দেশ, তিন দরজা",
    body: "তুরস্কে আইন ৬৭৩৫ ও ১৬ ডিজিট কনস্যুলার কোড e-İzin ফাইলের সাথে মিলতে হয়। মাল্টায় সিঙ্গেল পারমিট শুধু নিয়োগকর্তার Identità অ্যাকাউন্ট থেকে। সার্বিয়ায় NES-এর PPZ আইডির পর MUP ইউনিফায়েড কার্ড — এই পথকে প্ল্যাটফর্ম হাইলাইট করে, কারণ সময়সীমা তুলনামূলক ছোট। মলদোভায় ANOFM-এর ইতিবাচক মতামত ছাড়া টাইপ-ডি এগোয় না, আর ভিজিটরে আমন্ত্রণ বাধ্যতামূলক। বেলারুশে স্পেশাল পারমিটের মূল কপি লাগে, হাই-টেক পার্ক বাদে। সৌদি আরব সবচেয়ে ঘন স্তর: কিওয়া, মু সানেদ, ইনজাজ, ওয়াকালা, ওয়াফিদ, বিএমইটি। বাহরাইনে এলএমআরএ-র সাত দিনের শূন্যপদ, তারপর এনপিআরএ ও সিপিআর। মালয়েশিয়ায় ব্লু-কলার FWCMS, প্রফেশনাল ESD — গুলিয়ে ফেললে ফাইল ভুল দরজায় যায়।",
  },
  {
    id: "id",
    title: "আইডি ও ফিল্টার",
    body: "ফরম্যাট WVC-[ISO]-[WRK|VIS|SLF]-[বছর]-[০০০১]। সার্বিয়ার প্রথম ওয়ার্ক ফাইল তাই WVC-SRB-WRK-2026-0001। পাসপোর্টের অবশিষ্ট মেয়াদ ১৮০ দিনের কম হলে জমা বন্ধ। ছবি ৩৫×৪৫ অনুপাত, সাদা কোণা ও ল্যাপ্লাসিয়ান ভ্যারিয়েন্স ১০০-এর উপরে। পুলিশ ক্লিয়ারেন্স ৯০ দিনের মধ্যে। ব্যাংক ফ্লোর ভিসা শ্রেণি অনুযায়ী আলাদা। এই নিয়মগুলো আবেদন ফর্মে লাইভ, শুধু বর্ণনায় নয়।",
  },
  {
    id: "money",
    title: "লেজার",
    body: "Due Balance = Total Contract Value − (Advance + Interim Stage Payments)। তিন ধাপ: বুকিং অগ্রিম, পারমিট বা দূতাবাস ফি, স্ট্যাম্পের পর বাকি। বিকাশ, নগদ ও ব্যাংক একই খাতায়। প্রতিটি জমায় ইনভয়েস নম্বর ও ইমেইল লগ। অ্যাফিলিয়েট কমিশন অনুমোদনের মুহূর্তে একবারই ক্রেডিট হয়, যাতে ডবল পেমেন্ট না হয়।",
  },
  {
    id: "trust",
    title: "নিয়োগকর্তা ও চুক্তি",
    body: "কোম্পানির নাম, লাইসেন্স, ট্যাক্স আইডি, যোগাযোগ, ডোমেইন ইমেইল, ফোন, ওয়েবসাইট বাধ্যতামূলক মেটাডেটা। স্ট্যাটাস তিনটি। নতুন ডিমান্ডের ট্যাক্স আইডি ব্ল্যাকলিস্টে মিললে সিকিউরিটি অ্যালার্ট, ডিমান্ড স্থগিত। ভেরিফাইড হলে এনডিএ ও রিক্রুটমেন্ট চুক্তির প্রিন্টযোগ্য খসড়া — স্বাক্ষরের জায়গাসহ। প্রতিটি দেশের ডিরেক্টরি প্রার্থীকে খোলা কোটা দেখায়।",
  },
  {
    id: "b2b",
    title: "দুই দিকের নেটওয়ার্ক",
    body: "স্থানীয় অ্যাফিলিয়েট পান রেফারেল কোড, পাইপলাইন ও ওয়ালেট। ওয়ার্ক ১০,০০০, ভিজিটর ৩,০০০, সেলফ-স্পন্সর ১৫,০০০ টাকা। উত্তোলন বিকাশ, নগদ বা ব্যাংকে — অ্যাডমিন অনুমোদন ছাড়া পরিশোধ হয় না। বিদেশি পার্টনার দেখেন মেডিকেল, পারমিট ও ফ্লাইটের অগ্রগতি, রিক্রুটিং ফি ও প্রফিট শেয়ার।",
  },
  {
    id: "mail",
    title: "আটটি ইমেইল ট্রিগার",
    body: "অনবোর্ডিং, ক্যান্ডিডেট ম্যাচ, পারমিট সাবমিশন, এম্বাসি জমা, কমিশন ক্রেডিট, সাপ্তাহিক সারাংশের কাঠামো, অনুমোদন বা প্রত্যাখ্যান, ফ্লাইট ব্রিফিং। প্রেরক পরিচয় info@worldvisionconsultancy.com। এই স্টুডিও চিঠি লগে রাখে, লাইভ এসএমটিপি ছাড়াই টেমপ্লেট ও ট্রিগার শেখায়। ইনলাইন সিএসএস টেবিল লেআউট মোবাইল ইনবক্সেও ভাঙে না — শিখন পাতার নিচে কাঠামো আছে।",
  },
  {
    id: "agent",
    title: "এজেন্ট, সিমুলেশন হিসেবে",
    body: "ব্লুপ্রিন্টে হেডলেস ক্রোমিয়াম, সমান্তরাল সেশন ও অ্যান্টি-বট এড়ানোর কথা আছে। শিক্ষামূলক প্ল্যাটফর্ম সেই আক্রমণাত্মক অংশ বাস্তবায়ন করে না। কনসোল দেখায় দিনে তিনবার — ০৯:০০, ১৪:০০, ২১:০০ বিএসটি — স্লট উইন্ডো কীভাবে লগ হবে, পাসপোর্ট নম্বর দিয়ে স্ট্যাটাস নোট কীভাবে সিআরএমে বসবে, আর apply_work_permit ধারণাটি কীভাবে অভ্যন্তরীণ প্যাকেট কিউতে নামে। সুপারভাইজার বাটন না চাপলে কিছু এগোয় না।",
  },
  {
    id: "schema",
    title: "রিলেশন",
    body: "এক নিয়োগকর্তার অনেক ডিমান্ড, এক ডিমান্ডে অনেক ক্লায়েন্ট, এক ক্লায়েন্টের এক অ্যাফিলিয়েট। Applications সরকারি ট্র্যাকিং রাখে, Payments ইনভয়েস, EmailsLog আইনি চিঠির ছায়া, Deployments ফ্লাইট, Partners প্রফিট শেয়ার, Withdrawals উত্তোলন, AgentRuns শিফট লগ। ক্লায়েন্ট কোড ইউনিক, সিকোয়েন্স বছরভিত্তিক।",
  },
  {
    id: "sla",
    title: "কানবান ও এসএলএ",
    body: "সাত কলাম: নতুন লিড, ডকুমেন্ট যাচাই, নিয়োগকর্তা, পারমিট, কনস্যুলার, অনুমোদন, ফ্লাইট। সাত কার্যদিবস নড়লে লাল অ্যালার্ম। ফিল্টার: দেশ, ভিসা, আর কার্ড খুললে নিয়োগকর্তা ও এজেন্ট। ফিন্যান্স প্যানেলে আয়, বকেয়া, অ্যাফিলিয়েট প্রদেয় ও পার্টনার মার্জিন।",
  },
];

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="no-print hidden lg:block">
          <div className="sticky top-24 space-y-2 text-sm">
            {chapters.map((chapter) => (
              <a key={chapter.id} href={`#${chapter.id}`} className="block rounded-xl px-3 py-2 text-[#3d5164] hover:bg-white">
                {chapter.title}
              </a>
            ))}
          </div>
        </aside>
        <div>
          <p className="kicker text-[var(--navy)]">প্রযুক্তিগত নকশা · শিখন সংস্করণ</p>
          <h1 className="mt-3 text-4xl leading-tight font-semibold md:text-6xl">সুপার এজেন্ট প্ল্যাটফর্মের পুরো মানচিত্র।</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#3d5164]">
            এটি সংক্ষিপ্ত ল্যান্ডিং নয়। নিচে ওয়ার্ল্ড ভিশন কনসালটেন্সির আট দেশ, তিন ভিসা, অনবোর্ডিং অ্যালগরিদম, লেজার, কমপ্লায়েন্স, বিটুবি নেটওয়ার্ক, ইমেইল, এজেন্ট শিফট, ডেটাবেজ ও বাস্তবায়নের তিন পর্যায় একসঙ্গে আছে। পাশের পাতাগুলোতে একই নিয়ম কাজ করে।
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/apply" className="btn btn-gold">নিয়ম পরীক্ষা করুন</Link>
            <Link href="/admin" className="btn btn-line">কানবান দেখুন</Link>
          </div>
          <div className="mt-10 space-y-8">
            {chapters.map((chapter, index) => (
              <Reveal key={chapter.id}>
                <article id={chapter.id} className="paper-card scroll-mt-24 rounded-[28px] p-6 md:p-8">
                  <p className="mono text-xs text-[var(--stamp)]">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 text-3xl font-semibold">{chapter.title}</h2>
                  <p className="mt-4 text-base leading-8 text-[#243646]">{chapter.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <section className="mt-8 overflow-x-auto rounded-[24px] border border-[var(--line)] bg-white">
            <table className="min-w-[880px] w-full text-left text-sm">
              <thead className="bg-[var(--ink)] text-white">
                <tr>
                  {["দেশ", "পোর্টাল", "ওয়ার্ক", "ভিজিটর", "সেলফ", "গড় সময়"].map((head) => (
                    <th key={head} className="px-3 py-3 font-medium">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COUNTRIES.map((country) => (
                  <tr key={country.code} className="border-t border-[var(--line)] align-top">
                    <td className="px-3 py-3 font-semibold">{country.flag} {country.nameBn}</td>
                    <td className="px-3 py-3">{country.portal}</td>
                    <td className="px-3 py-3">{country.workBasis}</td>
                    <td className="px-3 py-3">{country.visitor}</td>
                    <td className="px-3 py-3">{country.selfPath}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{country.processing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["প্রথম পর্যায়", "স্কিমা, আইডি সিকোয়েন্স ও ফ্রন্টএন্ড ফিল্টার। ভুল পাসপোর্ট ও ঘোলা ছবি দরজায়ই আটকে।"],
              ["দ্বিতীয় পর্যায়", "আট দেশের কোম্পানি ট্যাক্স আইডিসহ ডিরেক্টরিতে। ডিজিটাল চুক্তির খসড়া ও ব্ল্যাকলিস্ট স্ক্রিন চালু।"],
              ["তৃতীয় পর্যায়", "তিন শিফটের মনিটরিং লজিক, ইমেইল ট্রিগার ও কানবান এসএলএ লাইভ অপারেশনে। বাইরের পোর্টাল অটোমেশন আলাদা কমপ্লায়েন্স পর্যালোচনার বিষয়।"],
            ].map(([title, copy], index) => (
              <article key={title} className="rounded-[28px] bg-[var(--ink)] p-5 text-[#f6efe4]">
                <p className="mono text-xs text-[var(--gold)]">০{index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/75">{copy}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 paper-card rounded-[28px] p-5 text-sm leading-7">
            <h2 className="text-2xl font-semibold">ইমেইল ফ্রেমের নীতি</h2>
            <p className="mt-3 text-[#3d5164]">
              ৬০০ পিক্সেল টেবিল, ইনলাইন সিএসএস, গাঢ় নীল হেডার #0b3c5d, ট্র্যাকিং আইডি মনোস্পেস ব্লকে, ফুটারে তেজগাঁওয়ের ঠিকানা, +880 1867-936601 এবং worldvisionconsultancy365.com। বাংলা ও ইংরেজি বিষয়লাইন ট্রিগার অনুযায়ী বদলায়। ডাইনামিক ভ্যারিয়েবল: client_id, নাম, দেশ, কমিশন।
            </p>
            <pre className="mono mt-4 overflow-x-auto rounded-2xl bg-[#07131f] p-4 text-xs leading-6 text-[#f0d7a2]">{`WVC-[COUNTRY]-[VISA]-[YEAR]-[SEQUENCE]
Due = Contract − (Advance + Interim)
SLA = stage age ≥ 7 working days`}</pre>
          </section>
        </div>
      </div>
    </main>
  );
}
