import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { seedAll } from "@/db/seed";
import {
  affiliates,
  agentRuns,
  applications,
  clients,
  countries,
  demands,
  deployments,
  emailsLog,
  employers,
  partners,
  payments,
  withdrawals,
} from "@/db/schema";
import { COUNTRIES } from "@/lib/countries";
import { dueBalance, isSlaAlert, slaDays, STAGE_IDS } from "@/lib/ops";

let seeding: Promise<void> | null = null;

export function ensureSeed() {
  if (!seeding) {
    seeding = (async () => {
      const [row] = await db.select({ value: count() }).from(countries);
      if (row.value > 0) return;
      await seedAll();
    })().catch((error: unknown) => {
      seeding = null;
      throw error;
    });
  }
  return seeding;
}

export async function getHomeStats() {
  await ensureSeed();
  const clientRows = await db.select().from(clients);
  const employerRows = await db.select().from(employers);
  const demandRows = await db.select().from(demands);
  const pipeline = STAGE_IDS.map((stage) => ({
    stage,
    count: clientRows.filter((client) => client.status === stage).length,
  }));
  return {
    clients: clientRows.length,
    verifiedEmployers: employerRows.filter((item) => item.verificationStatus === "Verified").length,
    openDemands: demandRows.filter((item) => item.status === "Open").length,
    approved: clientRows.filter((item) => item.status === "visa_approved" || item.status === "deployed").length,
    sla: clientRows.filter((item) => isSlaAlert(item.stageEnteredAt, item.status)).length,
    pipeline,
    recent: clientRows
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((item) => ({
        code: item.clientCode,
        name: item.fullName,
        country: item.countryCode,
        visa: item.visaCode,
        status: item.status,
      })),
    countryLoad: COUNTRIES.map((country) => ({
      code: country.code,
      nameBn: country.nameBn,
      flag: country.flag,
      clients: clientRows.filter((item) => item.countryCode === country.code).length,
      demands: demandRows.filter((item) => {
        const employer = employerRows.find((row) => row.id === item.employerId);
        return employer?.countryCode === country.code && item.status === "Open";
      }).length,
    })),
  };
}

export async function getCountryLive(code: string) {
  await ensureSeed();
  const employerRows = await db.select().from(employers).where(eq(employers.countryCode, code));
  const employerIds = new Set(employerRows.map((item) => item.id));
  const demandRows = (await db.select().from(demands)).filter((item) => employerIds.has(item.employerId));
  const clientRows = await db.select().from(clients).where(eq(clients.countryCode, code));
  return { employers: employerRows, demands: demandRows, clients: clientRows.length };
}

export async function getEmployerBoard() {
  await ensureSeed();
  const employerRows = await db.select().from(employers);
  const demandRows = await db.select().from(demands);
  const partnerRows = await db.select().from(partners);
  return employerRows
    .map((employer) => ({
      ...serializeEmployer(employer),
      demands: demandRows
        .filter((demand) => demand.employerId === employer.id)
        .map((demand) => ({
          ...demand,
          id: demand.id,
        })),
      partner: partnerRows.find((partner) => partner.employerId === employer.id) ?? null,
    }))
    .sort((a, b) => a.companyName.localeCompare(b.companyName));
}

function serializeEmployer(employer: typeof employers.$inferSelect) {
  return employer;
}

export async function getEmployer(id: string) {
  await ensureSeed();
  const [employer] = await db.select().from(employers).where(eq(employers.id, id));
  if (!employer) return null;
  const demandRows = await db.select().from(demands).where(eq(demands.employerId, id));
  const [partner] = await db.select().from(partners).where(eq(partners.employerId, id));
  const linked = await db.select().from(clients).where(eq(clients.countryCode, employer.countryCode));
  const onDemands = linked.filter((client) => client.demandId && demandRows.some((demand) => demand.id === client.demandId));
  return { employer, demands: demandRows, partner: partner ?? null, clients: onDemands };
}

export async function getAdminPayload() {
  await ensureSeed();
  const clientRows = await db.select().from(clients).orderBy(desc(clients.updatedAt));
  const applicationRows = await db.select().from(applications);
  const paymentRows = await db.select().from(payments).orderBy(desc(payments.createdAt));
  const emailRows = await db.select().from(emailsLog).orderBy(desc(emailsLog.timestamp));
  const employerRows = await db.select().from(employers);
  const demandRows = await db.select().from(demands);
  const affiliateRows = await db.select().from(affiliates);
  const deploymentRows = await db.select().from(deployments);
  const withdrawalRows = await db.select().from(withdrawals).orderBy(desc(withdrawals.createdAt));
  const partnerRows = await db.select().from(partners);
  const runs = await db.select().from(agentRuns).orderBy(desc(agentRuns.createdAt));

  const dossiers = clientRows.map((client) => {
    const paid = paymentRows.filter((payment) => payment.clientId === client.id).reduce((sum, payment) => sum + payment.amount, 0);
    const demand = demandRows.find((item) => item.id === client.demandId) ?? null;
    const employer = demand ? employerRows.find((item) => item.id === demand.employerId) ?? null : null;
    const affiliate = affiliateRows.find((item) => item.id === client.affiliateId) ?? null;
    return {
      id: client.id,
      clientCode: client.clientCode,
      fullName: client.fullName,
      passportNo: client.passportNo,
      phone: client.phone,
      email: client.email,
      age: client.age,
      skill: client.skill,
      countryCode: client.countryCode,
      visaCode: client.visaCode,
      status: client.status,
      contractValue: client.contractValue,
      paid,
      due: dueBalance(client.contractValue, paid),
      photoScore: client.photoScore,
      commissionCredited: client.commissionCredited,
      rejectionReason: client.rejectionReason,
      createdAt: client.createdAt.toISOString(),
      stageEnteredAt: client.stageEnteredAt.toISOString(),
      sla: slaDays(client.stageEnteredAt, client.status),
      alert: isSlaAlert(client.stageEnteredAt, client.status),
      application: applicationRows.find((item) => item.clientId === client.id) ?? null,
      payments: paymentRows.filter((item) => item.clientId === client.id),
      emails: emailRows.filter((item) => item.clientId === client.id).slice(0, 6),
      deployment: deploymentRows.find((item) => item.clientId === client.id) ?? null,
      demand: demand ? { id: demand.id, title: demand.jobTitleBn || demand.jobTitle, ref: demand.demandLetterRef } : null,
      employer: employer ? { id: employer.id, name: employer.companyName, status: employer.verificationStatus } : null,
      affiliate: affiliate ? { id: affiliate.id, name: affiliate.agentName, code: affiliate.referralCode } : null,
    };
  });

  const collected = paymentRows.reduce((sum, payment) => sum + payment.amount, 0);
  const contracted = clientRows.reduce((sum, client) => sum + client.contractValue, 0);
  const outstanding = dossiers.reduce((sum, client) => sum + client.due, 0);
  const affiliatePayable = affiliateRows.reduce((sum, item) => sum + item.walletBalance, 0);
  const profitShare = partnerRows.reduce((sum, item) => sum + item.profitShareBalance, 0);

  return {
    dossiers,
    employers: employerRows,
    demands: demandRows,
    affiliates: affiliateRows,
    withdrawals: withdrawalRows,
    partners: partnerRows.map((partner) => ({
      ...partner,
      employerName: employerRows.find((item) => item.id === partner.employerId)?.companyName ?? "—",
    })),
    emails: emailRows.slice(0, 18),
    runs: runs.slice(0, 16),
    finance: {
      collected,
      contracted,
      outstanding,
      affiliatePayable,
      profitShare,
      netOperating: collected - affiliatePayable,
    },
  };
}

export async function getTrack(code: string) {
  await ensureSeed();
  const [client] = await db.select().from(clients).where(eq(clients.clientCode, code.trim().toUpperCase()));
  if (!client) return null;
  const [application] = await db.select().from(applications).where(eq(applications.clientId, client.id));
  const paymentRows = await db.select().from(payments).where(eq(payments.clientId, client.id));
  const emailRows = await db.select().from(emailsLog).where(eq(emailsLog.clientId, client.id)).orderBy(desc(emailsLog.timestamp));
  const deploymentRows = await db.select().from(deployments).where(eq(deployments.clientId, client.id));
  const affiliate = client.affiliateId
    ? (await db.select().from(affiliates).where(eq(affiliates.id, client.affiliateId)))[0] ?? null
    : null;
  const demand = client.demandId ? (await db.select().from(demands).where(eq(demands.id, client.demandId)))[0] ?? null : null;
  const employer = demand ? (await db.select().from(employers).where(eq(employers.id, demand.employerId)))[0] ?? null : null;
  const paid = paymentRows.reduce((sum, payment) => sum + payment.amount, 0);
  return {
    client: {
      ...client,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      stageEnteredAt: client.stageEnteredAt.toISOString(),
    },
    application,
    payments: paymentRows,
    emails: emailRows,
    deployment: deploymentRows[0] ?? null,
    affiliate: affiliate ? { name: affiliate.agentName, code: affiliate.referralCode, district: affiliate.district } : null,
    demand,
    employer: employer ? { name: employer.companyName, status: employer.verificationStatus, city: employer.city } : null,
    paid,
    due: dueBalance(client.contractValue, paid),
  };
}
