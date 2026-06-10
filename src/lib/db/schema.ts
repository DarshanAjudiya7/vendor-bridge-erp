import { pgTable, serial, text, timestamp, boolean, integer, decimal, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["ADMIN", "PROCUREMENT_OFFICER", "MANAGER", "VENDOR"]);
export const vendorStatusEnum = pgEnum("vendor_status", ["PENDING", "APPROVED", "REJECTED"]);
export const rfqStatusEnum = pgEnum("rfq_status", ["DRAFT", "OPEN", "CLOSED", "AWARDED"]);
export const quotationStatusEnum = pgEnum("quotation_status", ["SUBMITTED", "ACCEPTED", "REJECTED"]);
export const approvalStatusEnum = pgEnum("approval_status", ["PENDING", "APPROVED", "REJECTED"]);

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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RFQs Table
export const rfqs = pgTable("rfqs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: rfqStatusEnum("status").default("DRAFT"),
  createdBy: integer("created_by").references(() => users.id),
  deadline: timestamp("deadline").notNull(),
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
  quotationId: integer("quotation_id").references(() => quotations.id),
  generatedBy: integer("generated_by").references(() => users.id),
  totalAmount: decimal("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invoices Table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  poId: integer("po_id").references(() => purchaseOrders.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  taxAmount: decimal("tax_amount").notNull(),
  totalAmount: decimal("total_amount").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});
