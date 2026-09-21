import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const countries = pgTable("countries", {
  id: integer("id").primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(),
  nameBn: varchar("name_bn", { length: 80 }).notNull(),
  nameEn: varchar("name_en", { length: 80 }).notNull(),
  flag: varchar("flag", { length: 8 }).notNull(),
  workPortal: varchar("work_portal", { length: 180 }).notNull(),
  workBasis: text("work_basis").notNull(),
  visitorCategory: text("visitor_category").notNull(),
  selfPath: text("self_path").notNull(),
  processingDays: varchar("processing_days", { length: 40 }).notNull(),
  highlight: text("highlight").notNull(),
  accent: varchar("accent", { length: 20 }).notNull(),
});

export const visaTypes = pgTable("visa_types", {
  id: integer("id").primaryKey(),
  category: varchar("category", { length: 32 }).notNull(),
  code: varchar("code", { length: 3 }).notNull().unique(),
  nameBn: varchar("name_bn", { length: 80 }).notNull(),
  baseFee: integer("base_fee").notNull(),
});

export const affiliates = pgTable("affiliates", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentName: varchar("agent_name", { length: 120 }).notNull(),
  district: varchar("district", { length: 80 }).notNull(),
  upazila: varchar("upazila", { length: 80 }),
  phone: varchar("phone", { length: 32 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  referralCode: varchar("referral_code", { length: 24 }).notNull().unique(),
  walletBalance: integer("wallet_balance").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  pendingWithdrawal: integer("pending_withdrawal").notNull().default(0),
});

export const employers = pgTable("employers", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: varchar("company_name", { length: 180 }).notNull(),
  countryCode: varchar("country_code", { length: 3 }).notNull(),
  tradeLicenseNo: varchar("trade_license_no", { length: 80 }).notNull(),
  taxId: varchar("tax_id", { length: 80 }).notNull(),
  contactPerson: varchar("contact_person", { length: 120 }).notNull(),
  contactTitle: varchar("contact_title", { length: 80 }),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  website: varchar("website", { length: 180 }),
  verificationStatus: varchar("verification_status", { length: 20 }).notNull(),
  city: varchar("city", { length: 80 }),
  sector: varchar("sector", { length: 80 }),
  blacklistReason: text("blacklist_reason"),
});

export const demands = pgTable("demands", {
  id: uuid("id").primaryKey().defaultRandom(),
  employerId: uuid("employer_id")
    .notNull()
    .references(() => employers.id),
  jobTitle: varchar("job_title", { length: 140 }).notNull(),
  jobTitleBn: varchar("job_title_bn", { length: 140 }),
  requiredWorkers: integer("required_workers").notNull(),
  fulfilledCount: integer("fulfilled_count").notNull().default(0),
  salary: integer("salary").notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("USD"),
  hoursPerDay: integer("hours_per_day").notNull().default(8),
  overtimePolicy: varchar("overtime_policy", { length: 180 }),
  housing: varchar("housing", { length: 80 }),
  medical: varchar("medical", { length: 80 }),
  foodAllowance: varchar("food_allowance", { length: 80 }),
  status: varchar("status", { length: 20 }).notNull().default("Open"),
  demandLetterRef: varchar("demand_letter_ref", { length: 80 }),
});

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientCode: varchar("client_code", { length: 32 }).notNull().unique(),
  fullName: varchar("full_name", { length: 140 }).notNull(),
  passportNo: varchar("passport_no", { length: 20 }).notNull(),
  passportExpiry: date("passport_expiry").notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  email: varchar("email", { length: 160 }),
  age: integer("age").notNull(),
  skill: varchar("skill", { length: 120 }).notNull(),
  countryCode: varchar("country_code", { length: 3 }).notNull(),
  visaCode: varchar("visa_code", { length: 3 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  affiliateId: uuid("affiliate_id"),
  demandId: uuid("demand_id"),
  contractValue: integer("contract_value").notNull(),
  photoScore: integer("photo_score"),
  policeClearanceDate: date("police_clearance_date"),
  bankBalance: integer("bank_balance"),
  mrzLine: varchar("mrz_line", { length: 88 }),
  validationNotes: text("validation_notes"),
  commissionCredited: boolean("commission_credited").notNull().default(false),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  stageEnteredAt: timestamp("stage_entered_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id),
  stage: varchar("stage", { length: 32 }).notNull(),
  permitSubmissionDate: timestamp("permit_submission_date", { withTimezone: true }),
  embassyDate: timestamp("embassy_date", { withTimezone: true }),
  govTrackingCode: varchar("gov_tracking_code", { length: 48 }),
  portal: varchar("portal", { length: 120 }),
  portalStatus: varchar("portal_status", { length: 180 }),
  notes: text("notes"),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id),
  amount: integer("amount").notNull(),
  paymentMethod: varchar("payment_method", { length: 20 }).notNull(),
  paymentStage: varchar("payment_stage", { length: 20 }).notNull(),
  invoiceNo: varchar("invoice_no", { length: 40 }).notNull(),
  trxId: varchar("trx_id", { length: 48 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const emailsLog = pgTable("emails_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id"),
  recipientEmail: varchar("recipient_email", { length: 180 }).notNull(),
  subject: varchar("subject", { length: 240 }).notNull(),
  triggerType: varchar("trigger_type", { length: 64 }).notNull(),
  sentStatus: boolean("sent_status").notNull().default(true),
  bodyPreview: text("body_preview"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

export const deployments = pgTable("deployments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id),
  flightDate: timestamp("flight_date", { withTimezone: true }),
  airline: varchar("airline", { length: 80 }),
  pnrNumber: varchar("pnr_number", { length: 20 }),
  airportPickupStatus: boolean("airport_pickup_status").notNull().default(false),
  briefing: text("briefing"),
});

export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  employerId: uuid("employer_id")
    .notNull()
    .references(() => employers.id),
  commissionRate: integer("commission_rate").notNull(),
  agreementRef: varchar("agreement_ref", { length: 40 }).notNull(),
  profitShareBalance: integer("profit_share_balance").notNull().default(0),
  recruitingFee: integer("recruiting_fee").notNull().default(0),
  liabilityNote: text("liability_note"),
});

export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").primaryKey().defaultRandom(),
  affiliateId: uuid("affiliate_id")
    .notNull()
    .references(() => affiliates.id),
  amount: integer("amount").notNull(),
  method: varchar("method", { length: 20 }).notNull(),
  account: varchar("account", { length: 80 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("Pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const agentRuns = pgTable("agent_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  countryCode: varchar("country_code", { length: 3 }).notNull(),
  portal: varchar("portal", { length: 140 }).notNull(),
  runType: varchar("run_type", { length: 40 }).notNull(),
  shift: varchar("shift", { length: 20 }),
  result: text("result").notNull(),
  slotsFound: integer("slots_found").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sequences = pgTable("sequences", {
  year: integer("year").primaryKey(),
  lastValue: integer("last_value").notNull().default(0),
});
