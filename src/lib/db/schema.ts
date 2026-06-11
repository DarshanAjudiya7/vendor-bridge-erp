import { pgTable, serial, text, timestamp, integer, decimal, pgEnum, jsonb, boolean, index } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["ADMIN", "PROCUREMENT_OFFICER", "MANAGER", "VENDOR"]);
export const vendorStatusEnum = pgEnum("vendor_status", ["PENDING", "APPROVED", "REJECTED", "ACTIVE", "INACTIVE", "BLACKLISTED", "SUSPENDED"]);
export const rfqStatusEnum = pgEnum("rfq_status", ["DRAFT", "OPEN", "CLOSED", "AWARDED", "PENDING_APPROVAL", "APPROVED", "PUBLISHED", "CANCELLED", "AWARD_PENDING_APPROVAL"]);
export const quotationStatusEnum = pgEnum("quotation_status", ["SUBMITTED", "ACCEPTED", "REJECTED"]);
export const approvalStatusEnum = pgEnum("approval_status", ["PENDING", "APPROVED", "REJECTED"]);
export const notificationTypeEnum = pgEnum("notification_type", ["INFO", "WARNING", "SUCCESS", "ERROR"]);
export const poStatusEnum = pgEnum("po_status", ["GENERATED", "ACCEPTED", "DELIVERED"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["GENERATED", "PAID"]);

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("VENDOR").notNull(),
  avatarUrl: text("avatar_url"),
  lastLogin: timestamp("last_login"),
  totalLogins: integer("total_logins").default(0),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  themePreference: text("theme_preference").default('system'),
  language: text("language").default('en'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => ({
  roleIdx: index("users_role_idx").on(t.role),
  emailIdx: index("users_email_idx").on(t.email),
}));

export const verificationStatusEnum = pgEnum("verification_status", ["UNVERIFIED", "PENDING", "VERIFIED"]);

// Vendors Table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  vendorCode: text("vendor_code").unique(),
  category: text("category"),
  companyName: text("company_name").notNull(),
  companyType: text("company_type"),
  verificationStatus: verificationStatusEnum("verification_status").default("UNVERIFIED"),
  gstNumber: text("gst_number").notNull().unique(),
  panNumber: text("pan_number"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  alternatePhone: text("alternate_phone"),
  website: text("website"),
  address: text("address").notNull(),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  postalCode: text("postal_code"),
  status: vendorStatusEnum("status").default("PENDING"),
  attachments: jsonb("attachments").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => ({
  userIdIdx: index("vendors_user_id_idx").on(t.userId),
  statusIdx: index("vendors_status_idx").on(t.status),
  verificationStatusIdx: index("vendors_verif_status_idx").on(t.verificationStatus),
}));

// RFQs Table
export const rfqs = pgTable("rfqs", {
  id: serial("id").primaryKey(),
  rfqNumber: text("rfq_number").unique(),
  title: text("title").notNull(),
  category: text("category"),
  description: text("description"),
  priority: text("priority"),
  department: text("department"),
  requestor: text("requestor"),
  status: rfqStatusEnum("status").default("DRAFT"),
  userId: integer("user_id").references(() => users.id),
  deadline: timestamp("deadline").notNull(),
  attachments: jsonb("attachments").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => ({
  userIdIdx: index("rfqs_user_id_idx").on(t.userId),
  statusIdx: index("rfqs_status_idx").on(t.status),
  deadlineIdx: index("rfqs_deadline_idx").on(t.deadline),
}));

// RFQ Items Table
export const rfqItems = pgTable("rfq_items", {
  id: serial("id").primaryKey(),
  rfqId: integer("rfq_id").references(() => rfqs.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // e.g., kg, pcs
}, (t) => ({
  rfqIdIdx: index("rfq_items_rfq_id_idx").on(t.rfqId),
}));

// Vendor Assignments (Many-to-Many RFQ <-> Vendor)
export const vendorAssignments = pgTable("vendor_assignments", {
  id: serial("id").primaryKey(),
  rfqId: integer("rfq_id").references(() => rfqs.id),
  vendorId: integer("vendor_id").references(() => vendors.id),
  invitedAt: timestamp("invited_at").defaultNow(),
}, (t) => ({
  rfqIdIdx: index("vendor_assign_rfq_id_idx").on(t.rfqId),
  vendorIdIdx: index("vendor_assign_vendor_id_idx").on(t.vendorId),
}));

// Quotations Table
export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  rfqId: integer("rfq_id").references(() => rfqs.id),
  vendorId: integer("vendor_id").references(() => vendors.id),
  userId: integer("user_id").references(() => users.id),
  totalAmount: decimal("total_amount").notNull(),
  deliveryDays: integer("delivery_days").notNull(),
  paymentTerms: text("payment_terms"),
  remarks: text("remarks"),
  attachments: jsonb("attachments").default('[]'),
  status: quotationStatusEnum("status").default("SUBMITTED"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  rfqIdIdx: index("quotations_rfq_id_idx").on(t.rfqId),
  vendorIdIdx: index("quotations_vendor_id_idx").on(t.vendorId),
  userIdIdx: index("quotations_user_id_idx").on(t.userId),
  statusIdx: index("quotations_status_idx").on(t.status),
}));

// Approvals Table
export const approvals = pgTable("approvals", {
  id: serial("id").primaryKey(),
  referenceId: integer("reference_id").notNull(), // can be RFQ or PO ID depending on type
  referenceType: text("reference_type").notNull(), // 'RFQ' or 'PO'
  userId: integer("user_id").references(() => users.id),
  status: approvalStatusEnum("status").default("PENDING"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => ({
  refIdIdx: index("approvals_ref_id_idx").on(t.referenceId),
  refTypeIdx: index("approvals_ref_type_idx").on(t.referenceType),
  userIdIdx: index("approvals_user_id_idx").on(t.userId),
  statusIdx: index("approvals_status_idx").on(t.status),
}));

// Purchase Orders Table
export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  poNumber: text("po_number").notNull().unique(),
  rfqId: integer("rfq_id").references(() => rfqs.id),
  quotationId: integer("quotation_id").references(() => quotations.id),
  userId: integer("user_id").references(() => users.id),
  totalAmount: decimal("total_amount").notNull(),
  status: poStatusEnum("status").default("GENERATED"),
  attachments: jsonb("attachments").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  rfqIdIdx: index("po_rfq_id_idx").on(t.rfqId),
  userIdIdx: index("po_user_id_idx").on(t.userId),
  statusIdx: index("po_status_idx").on(t.status),
}));

// Invoices Table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  poId: integer("po_id").references(() => purchaseOrders.id),
  userId: integer("user_id").references(() => users.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  taxAmount: decimal("tax_amount").notNull(),
  totalAmount: decimal("total_amount").notNull(),
  status: invoiceStatusEnum("status").default("GENERATED"),
  attachments: jsonb("attachments").default('[]'),
  generatedAt: timestamp("generated_at").defaultNow(),
}, (t) => ({
  poIdIdx: index("invoices_po_id_idx").on(t.poId),
  userIdIdx: index("invoices_user_id_idx").on(t.userId),
  statusIdx: index("invoices_status_idx").on(t.status),
}));

// Activity Logs Table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // e.g., 'CREATED', 'UPDATED', 'APPROVED'
  entityType: text("entity_type").notNull(), // e.g., 'RFQ', 'VENDOR', 'PO'
  entityId: integer("entity_id").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  userIdIdx: index("logs_user_id_idx").on(t.userId),
  entityIdx: index("logs_entity_idx").on(t.entityType, t.entityId),
}));

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("INFO"),
  isRead: boolean("is_read").default(false),
  link: text("link"), // URL to navigate when clicked
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  userIdIdx: index("notif_user_id_idx").on(t.userId),
  isReadIdx: index("notif_is_read_idx").on(t.isRead),
}));

// Password Reset Tokens Table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  userIdIdx: index("reset_tokens_user_id_idx").on(t.userId),
  tokenIdx: index("reset_tokens_token_idx").on(t.token),
}));
