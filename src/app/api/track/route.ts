import { getTrack } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code") ?? "";
  if (!code.trim()) return Response.json({ ok: false, error: "ট্র্যাকিং আইডি দিন।" }, { status: 400 });
  const dossier = await getTrack(code);
  if (!dossier) return Response.json({ ok: false, error: "এই আইডির কোনো ফাইল নেই।" }, { status: 404 });
  return Response.json({ ok: true, dossier });
}
