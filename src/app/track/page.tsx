import { Tracker } from "./tracker";

export const dynamic = "force-dynamic";

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const params = await searchParams;
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker text-[var(--navy)]">ফাইল ট্র্যাকার</p>
      <h1 className="mt-2 text-4xl font-semibold">আপনার আইডি বলুন, পাইপলাইন খুলবে।</h1>
      <div className="mt-6">
        <Tracker initialCode={params.code ?? ""} />
      </div>
    </main>
  );
}
