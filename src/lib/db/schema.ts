import { pgTable, serial, text, timestamp, integer, decimal, pgEnum, jsonb, boolean } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["ADMIN", "PROCUREMENT_OFFICER", "MANAGER", "VENDOR"]);
export const vendorStatusEnum = pgEnum("vendor_status", ["PENDING", "APPROVED", "REJECTED"]);
export const rfqStatusEnum = pgEnum("rfq_status", ["DRAFT", "OPEN", "CLOSED", "AWARDED"]);
export const quotationStatusEnum = pgEnum("quotation_status", ["SUBMITTED", "ACCEPTED", "REJECTED"]);
export const approvalStatusEnum = pgEnum("approval_status", ["PENDING", "APPROVED", "REJECTED"]);
export const notificationTypeEnum = pgEnum("notification_type", ["INFO", "WARNING", "SUCCESS", "ERROR"]);

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("VENDOR").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendors Table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  companyName: text("company_name").notNull(),
  gstNumber: text("gst_number").notNull().unique(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  address: text("address").notNull(),
  status: vendorStatusEnum("status").default("PENDING"),
  attachments: jsonb("attachments").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RFQs Table
export const rfqs = pgTable("rfqs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category"),
  description: text("description"),
  status: rfqStatusEnum("status").default("DRAFT"),
  createdBy: integer("created_by").references(() => users.id),
  deadline: timestamp("deadline").notNull(),
  attachments: jsonb("attachments").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RFQ Items Table
export const rfqItems = pgTable("rfq_items", {
  id: serial("id").primaryKey(),
  rfqId: integer("rfq_id").references(() => rfqs.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // e.g., kg, pcs
});

// Vendor Assignments (Many-to-Many RFQ <-> Vendor)
export const vendorAssignments = pgTable("vendor_assignments", {
  id: serial("id").primaryKey(),
  rfqId: integer("rfq_id").references(() => rfqs.id),
  vendorId: integer("vendor_id").references(() => vendors.id),
  invitedAt: timestamp("invited_at").defaultNow(),
});

// Quotations Table
export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  rfqId: integer("rfq_id").references(() => rfqs.id),
  vendorId: integer("vendor_id").references(() => vendors.id),
  totalAmount: decimal("total_amount").notNull(),
  deliveryDays: integer("delivery_days").notNull(),
  paymentTerms: text("payment_terms"),
  remarks: text("remarks"),
  attachments: jsonb("attachments").default('[]'),
  status: quotationStatusEnum("status").default("SUBMITTED"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Approvals Table
export const approvals = pgTable("approvals", {
  id: serial("id").primaryKey(),
  referenceId: integer("reference_id").notNull(), // can be RFQ or PO ID depending on type
  referenceType: text("reference_type").notNull(), // 'RFQ' or 'PO'
  managerId: integer("manager_id").references(() => users.id),
  status: approvalStatusEnum("status").default("PENDING"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchase Orders Table
export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  poNumber: text("po_number").notNull().unique(),
  rfqId: integer("rfq_id").references(() => rfqs.id),
  quotationId: integer("quotation_id").references(() => quotations.id),
  generatedBy: integer("generated_by").references(() => users.id),
  totalAmount: decimal("total_amount").notNull(),
  attachments: jsonb("attachments").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invoices Table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  poId: integer("po_id").references(() => purchaseOrders.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  taxAmount: decimal("tax_amount").notNull(),
  totalAmount: decimal("total_amount").notNull(),
  attachments: jsonb("attachments").default('[]'),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Activity Logs Table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // e.g., 'CREATED', 'UPDATED', 'APPROVED'
  entityType: text("entity_type").notNull(), // e.g., 'RFQ', 'VENDOR', 'PO'
  entityId: integer("entity_id").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
});
