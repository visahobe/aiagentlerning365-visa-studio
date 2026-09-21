import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="kicker">৪০৪</p>
      <h1 className="mt-3 text-4xl font-semibold">এই পাতা নেই।</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">লিংক পুরনো হতে পারে। প্রথম পাতা বা সরঞ্জাম থেকে আবার খুলুন।</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/" className="btn btn-ink">প্রথম পাতা</Link>
        <Link href="/tools" className="btn btn-line">সরঞ্জাম</Link>
      </div>
    </main>
  );
}
