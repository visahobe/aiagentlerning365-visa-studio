import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { demands, employers } from "@/db/schema";
import { ensureSeed } from "@/lib/data";
import { COUNTRIES } from "@/lib/countries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await ensureSeed();
  const body = (await request.json()) as {
    companyName?: string;
    countryCode?: string;
    tradeLicenseNo?: string;
    taxId?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
    requiredWorkers?: number;
    salary?: number;
    currency?: string;
  };

  const companyName = body.companyName?.trim() ?? "";
  const taxId = body.taxId?.trim().toUpperCase() ?? "";
  const tradeLicenseNo = body.tradeLicenseNo?.trim().toUpperCase() ?? "";
  const countryCode = body.countryCode ?? "";
  if (!companyName || !taxId || !tradeLicenseNo || !COUNTRIES.some((country) => country.code === countryCode)) {
    return Response.json({ ok: false, error: "কোম্পানি, দেশ, ট্রেড লাইসেন্স ও ট্যাক্স আইডি দিন।" }, { status: 400 });
  }

  const matches = await db
    .select()
    .from(employers)
    .where(or(eq(employers.taxId, taxId), eq(employers.tradeLicenseNo, tradeLicenseNo)));
  const blocked = matches.find((item) => item.verificationStatus === "Blacklisted");
  if (blocked) {
    return Response.json(
      {
        ok: false,
        blocked: true,
        error: `সিকিউরিটি অ্যালার্ট: ${blocked.companyName} কালো তালিকায়। ডিমান্ড স্থগিত। ${blocked.blacklistReason ?? ""}`,
      },
      { status: 409 },
    );
  }

  const existing = matches[0];
  const employer =
    existing ??
    (
      await db
        .insert(employers)
        .values({
          companyName,
          countryCode,
          tradeLicenseNo,
          taxId,
          contactPerson: body.contactPerson?.trim() || "অজানা",
          email: body.email?.trim() || "pending@employer.example",
          phone: body.phone?.trim() || "n/a",
          verificationStatus: "Pending",
          sector: "Unclassified",
        })
        .returning()
    )[0];

  let demand = null;
  if (body.jobTitle?.trim()) {
    const [created] = await db
      .insert(demands)
      .values({
        employerId: employer.id,
        jobTitle: body.jobTitle.trim(),
        jobTitleBn: body.jobTitle.trim(),
        requiredWorkers: Number(body.requiredWorkers) || 1,
        salary: Number(body.salary) || 0,
        currency: body.currency || "USD",
        status: employer.verificationStatus === "Verified" ? "Open" : "Paused",
        demandLetterRef: `DL-${countryCode}-${Date.now().toString().slice(-6)}`,
        housing: "যাচাই সাপেক্ষে",
        medical: "যাচাই সাপেক্ষে",
        foodAllowance: "যাচাই সাপেক্ষে",
        overtimePolicy: "চুক্তি সাপেক্ষে",
      })
      .returning();
    demand = created;
  }

  return Response.json({
    ok: true,
    status: employer.verificationStatus,
    employerId: employer.id,
    demandId: demand?.id ?? null,
    message:
      employer.verificationStatus === "Verified"
        ? "ট্যাক্স আইডি ভেরিফাইড রেকর্ডের সাথে মিলেছে। ডিমান্ড খোলা হয়েছে।"
        : "নতুন প্রতিষ্ঠান পেন্ডিং তদন্তে আছে। ডিমান্ড পজ করা হয়েছে, ব্ল্যাকলিস্ট স্ক্রিন ক্লিয়ার।",
  });
}
