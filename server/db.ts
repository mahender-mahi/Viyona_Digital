import { eq, desc, and, or, like, between, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, Lead, demoRequests, InsertDemoRequest, DemoRequest, demoSlots, InsertDemoSlot, DemoSlot, siteContent, InsertSiteContent, SiteContent, adminSettings, InsertAdminSetting, AdminSetting } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER HELPERS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ LEAD HELPERS ============

export async function createLead(lead: InsertLead): Promise<Lead | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create lead: database not available");
    return null;
  }

  try {
    const result = await db.insert(leads).values(lead);
    const leadId = result[0]?.insertId;
    if (!leadId) return null;

    const created = await db.select().from(leads).where(eq(leads.id, leadId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create lead:", error);
    throw error;
  }
}

export async function getAllLeads(filters?: { status?: string; projectType?: string; searchTerm?: string; startDate?: Date; endDate?: Date }): Promise<Lead[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leads: database not available");
    return [];
  }

  try {
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status as any));
    }

    if (filters?.projectType) {
      conditions.push(eq(leads.projectType, filters.projectType as any));
    }

    if (filters?.searchTerm) {
      const searchPattern = `%${filters.searchTerm}%`;
      conditions.push(
        or(
          like(leads.name, searchPattern),
          like(leads.email, searchPattern),
          like(leads.company, searchPattern)
        )
      );
    }

    if (filters?.startDate && filters?.endDate) {
      conditions.push(between(leads.createdAt, filters.startDate, filters.endDate));
    }

    let query: any = db.select().from(leads);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(desc(leads.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get leads:", error);
    throw error;
  }
}

export async function getLeadById(id: number): Promise<Lead | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get lead: database not available");
    return null;
  }

  try {
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get lead:", error);
    throw error;
  }
}

export async function updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lead: database not available");
    return null;
  }

  try {
    await db.update(leads).set({ ...updates, updatedAt: new Date() }).where(eq(leads.id, id));
    return getLeadById(id);
  } catch (error) {
    console.error("[Database] Failed to update lead:", error);
    throw error;
  }
}

export async function getLeadsByStatus(status: string): Promise<Lead[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leads: database not available");
    return [];
  }

  try {
    const result = await db.select().from(leads).where(eq(leads.status, status as any)).orderBy(desc(leads.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get leads by status:", error);
    throw error;
  }
}

export async function getLeadsCount(): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leads count: database not available");
    return 0;
  }

  try {
    const result = await db.select().from(leads);
    return result.length;
  } catch (error) {
    console.error("[Database] Failed to get leads count:", error);
    throw error;
  }
}

// ============ DEMO REQUEST HELPERS ============

export async function createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create demo request: database not available");
    return null;
  }

  try {
    const result = await db.insert(demoRequests).values(demoRequest);
    const demoId = result[0]?.insertId;
    if (!demoId) return null;

    const created = await db.select().from(demoRequests).where(eq(demoRequests.id, demoId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create demo request:", error);
    throw error;
  }
}

export async function getDemoRequestsByLeadId(leadId: number): Promise<DemoRequest[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get demo requests: database not available");
    return [];
  }

  try {
    const result = await db.select().from(demoRequests).where(eq(demoRequests.leadId, leadId)).orderBy(desc(demoRequests.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get demo requests:", error);
    throw error;
  }
}

export async function updateDemoRequest(id: number, updates: Partial<InsertDemoRequest>): Promise<DemoRequest | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update demo request: database not available");
    return null;
  }

  try {
    await db.update(demoRequests).set({ ...updates, updatedAt: new Date() }).where(eq(demoRequests.id, id));
    const result = await db.select().from(demoRequests).where(eq(demoRequests.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update demo request:", error);
    throw error;
  }
}

// ============ DEMO SLOT HELPERS ============

export async function createDemoSlot(slot: InsertDemoSlot): Promise<DemoSlot | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create demo slot: database not available");
    return null;
  }

  try {
    const result = await db.insert(demoSlots).values(slot);
    const slotId = result[0]?.insertId;
    if (!slotId) return null;

    const created = await db.select().from(demoSlots).where(eq(demoSlots.id, slotId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create demo slot:", error);
    throw error;
  }
}

export async function getAvailableDemoSlots(): Promise<DemoSlot[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get demo slots: database not available");
    return [];
  }

  try {
    const result = await db.select().from(demoSlots).where(eq(demoSlots.isAvailable, true)).orderBy(demoSlots.date, demoSlots.time);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get demo slots:", error);
    throw error;
  }
}

// ============ SITE CONTENT HELPERS ============

export async function createSiteContent(content: InsertSiteContent): Promise<SiteContent | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create site content: database not available");
    return null;
  }

  try {
    const result = await db.insert(siteContent).values(content);
    const contentId = result[0]?.insertId;
    if (!contentId) return null;

    const created = await db.select().from(siteContent).where(eq(siteContent.id, contentId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create site content:", error);
    throw error;
  }
}

export async function getSiteContentByType(type: string): Promise<SiteContent[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get site content: database not available");
    return [];
  }

  try {
    const result = await db.select().from(siteContent).where(and(eq(siteContent.type, type as any), eq(siteContent.isPublished, true))).orderBy(siteContent.order);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get site content:", error);
    throw error;
  }
}

export async function updateSiteContent(id: number, updates: Partial<InsertSiteContent>): Promise<SiteContent | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update site content: database not available");
    return null;
  }

  try {
    await db.update(siteContent).set({ ...updates, updatedAt: new Date() }).where(eq(siteContent.id, id));
    const result = await db.select().from(siteContent).where(eq(siteContent.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update site content:", error);
    throw error;
  }
}

// ============ ADMIN SETTINGS HELPERS ============

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get setting: database not available");
    return null;
  }

  try {
    const result = await db.select().from(adminSettings).where(eq(adminSettings.key, key)).limit(1);
    return result.length > 0 ? result[0]?.value || null : null;
  } catch (error) {
    console.error("[Database] Failed to get setting:", error);
    throw error;
  }
}

export async function setSetting(key: string, value: string, type: string = "string"): Promise<AdminSetting | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot set setting: database not available");
    return null;
  }

  try {
    await db.insert(adminSettings).values({ key, value, type: type as any }).onDuplicateKeyUpdate({
      set: { value, updatedAt: new Date() },
    });

    const result = await db.select().from(adminSettings).where(eq(adminSettings.key, key)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to set setting:", error);
    throw error;
  }
}

export async function getAllSettings(): Promise<AdminSetting[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get settings: database not available");
    return [];
  }

  try {
    const result = await db.select().from(adminSettings);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get settings:", error);
    throw error;
  }
}
