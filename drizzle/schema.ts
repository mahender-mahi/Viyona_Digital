import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table for storing captured lead information from chatbot
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  projectType: mysqlEnum("projectType", ["digital_marketing", "web_development", "data_analysis"]).notNull(),
  budget: varchar("budget", { length: 100 }), // e.g., "$5k-$10k"
  timeline: varchar("timeline", { length: 100 }), // e.g., "1-3 months"
  isDecisionMaker: boolean("isDecisionMaker").default(false),
  status: mysqlEnum("status", ["New", "Contacted", "Qualified", "Demo Scheduled", "Demo Completed", "Won", "Lost", "Follow-up", "Junk"]).default("New").notNull(),
  priority: boolean("priority").default(false),
  notes: text("notes"),
  source: varchar("source", { length: 100 }).default("chatbot"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Demo requests table for tracking demo scheduling
 */
export const demoRequests = mysqlTable("demo_requests", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  preferredDate: varchar("preferredDate", { length: 100 }),
  preferredTime: varchar("preferredTime", { length: 100 }),
  platform: mysqlEnum("platform", ["Google Meet", "Zoom", "Teams", "Phone"]).default("Google Meet"),
  status: mysqlEnum("status", ["Pending", "Confirmed", "Completed", "Cancelled"]).default("Pending").notNull(),
  confirmedAt: timestamp("confirmedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DemoRequest = typeof demoRequests.$inferSelect;
export type InsertDemoRequest = typeof demoRequests.$inferInsert;

/**
 * Available demo time slots
 */
export const demoSlots = mysqlTable("demo_slots", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 100 }).notNull(),
  time: varchar("time", { length: 100 }).notNull(),
  isAvailable: boolean("isAvailable").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DemoSlot = typeof demoSlots.$inferSelect;
export type InsertDemoSlot = typeof demoSlots.$inferInsert;

/**
 * Site content for CMS (testimonials, case studies, pages)
 */
export const siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["testimonial", "case_study", "service", "page_section"]).notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  content: text("content"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  author: varchar("author", { length: 255 }),
  authorCompany: varchar("authorCompany", { length: 255 }),
  isPublished: boolean("isPublished").default(false),
  order: int("order").default(0),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;

/**
 * Admin settings for API keys and configuration
 */
export const adminSettings = mysqlTable("admin_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  type: mysqlEnum("type", ["string", "number", "boolean", "json"]).default("string"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = typeof adminSettings.$inferInsert;
