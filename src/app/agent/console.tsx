"use client";

import { useEffect, useState } from "react";
import { COUNTRIES } from "@/lib/countries";
import { bnDateTime } from "@/lib/ops";

type Run = {
  id: string;
  countryCode: string;
  portal: string;
  runType: string;
  shift: string | null;
  result: string;
  slotsFound: number;
  createdAt: string;
};

type ClientOption = { id: string; clientCode: string; fullName: string; countryCode: string; status: string };

export function AgentConsole() {
  const [now, setNow] = useState("");
  const [runs, setRuns] = useState<Run[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientId, setClientId] = useState("");
  const [note, setNote] = useState("বাহ্যিক পোর্টালে কোনো সেশন খোলা হয় না।");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const tick = () => {
      setNow(new Intl.DateTimeFormat("bn-BD", { timeStyle: "medium", timeZone: "Asia/Dhaka" }).format(new Date()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    void fetch("/api/agent").then(async (response) => {
      const data = (await response.json()) as { runs: Run[] };
      setRuns(data.runs);
    });
    void fetch("/api/admin").then(async (response) => {
      const data = (await response.json()) as { dossiers: ClientOption[] };
      setClients(data.dossiers);
      setClientId(data.dossiers[0]?.id ?? "");
    });
    return () => window.clearInterval(id);
  }, []);

  async function run(action: string, countryCode?: string) {
    setBusy(true);
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, clientId, countryCode }),
    });
    const data = (await response.json()) as { ok: boolean; error?: string; note?: string; runs?: Run[] };
    setBusy(false);
    setNote(data.error || data.note || "রান লগে যুক্ত হয়েছে।");
    if (data.runs) setRuns((current) => [...data.runs!, ...current].slice(0, 24));
    else {
      const fresh = await fetch("/api/agent");
      const payload = (await fresh.json()) as { runs: Run[] };
      setRuns(payload.runs);
    }
  }

  return (
    <div className="space-y-5">
      <section className="ink-panel rounded-[28px] p-5">
        <p className="kicker">ঢাকার সময়</p>
        <p className="mono mt-2 text-4xl">{now || "--:--:--"}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          {["09:00", "14:00", "21:00"].map((slot) => (
            <div key={slot} className="rounded-2xl border border-white/10 py-3">{slot} ঢাকা</div>
          ))}
        </div>
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        {COUNTRIES.map((country) => (
          <article key={country.code} className="paper-card rounded-3xl p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{country.flag} {country.nameBn}</h2>
              <button type="button" className="btn btn-line" disabled={busy} onClick={() => void run("scan", country.code)}>স্ক্যান</button>
            </div>
            <p className="mt-2 text-sm text-[#3d5164]">{country.portal}</p>
          </article>
        ))}
      </div>
      <section className="paper-card grid gap-3 rounded-[28px] p-4 md:grid-cols-[1fr_auto_auto]">
        <select className="input" value={clientId} onChange={(event) => setClientId(event.target.value)}>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.clientCode} · {client.fullName}</option>
          ))}
        </select>
        <button type="button" className="btn btn-line" disabled={busy} onClick={() => void run("status")}>স্ট্যাটাস নোট</button>
        <button type="button" className="btn btn-ink" disabled={busy} onClick={() => void run("submit")}>পারমিট প্যাকেট</button>
      </section>
      <p className="text-sm text-[#3d5164]">{note}</p>
      <button type="button" className="btn btn-gold" disabled={busy} onClick={() => void run("scan")}>আট দেশ একসাথে স্ক্যান</button>
      <ul className="space-y-2">
        {runs.map((runItem) => (
          <li key={runItem.id} className="rounded-2xl bg-white px-4 py-3 text-sm">
            <p className="font-semibold">{runItem.countryCode} · {runItem.runType} · স্লট {runItem.slotsFound}</p>
            <p className="text-[#3d5164]">{runItem.result}</p>
            <p className="text-xs text-[#607086]">{runItem.shift} · {bnDateTime(runItem.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
