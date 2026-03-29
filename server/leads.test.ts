import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@viyonadigital.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Leads Management", () => {
  let createdLeadId: number | null = null;

  it("should create a new lead", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    const lead = await caller.leads.create({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      company: "Acme Corp",
      projectType: "web_development",
      budget: "$5k-$10k",
      timeline: "1-3 months",
      isDecisionMaker: true,
    });

    expect(lead).toBeDefined();
    expect(lead?.name).toBe("John Doe");
    expect(lead?.email).toBe("john@example.com");
    expect(lead?.status).toBe("New");
    expect(lead?.source).toBe("chatbot");

    if (lead?.id) {
      createdLeadId = lead.id;
    }
  });

  it("should retrieve all leads", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const leads = await caller.leads.getAll({});

    expect(Array.isArray(leads)).toBe(true);
    if (createdLeadId) {
      const foundLead = leads.find(l => l.id === createdLeadId);
      expect(foundLead).toBeDefined();
    }
  });

  it("should update a lead status", async () => {
    if (!createdLeadId) {
      expect.fail("No lead created for update test");
    }

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const updatedLead = await caller.leads.update({
      id: createdLeadId,
      status: "Contacted",
      notes: "Initial contact made",
    });

    expect(updatedLead?.status).toBe("Contacted");
    expect(updatedLead?.notes).toBe("Initial contact made");
  });

  it("should filter leads by status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const leads = await caller.leads.getByStatus("Contacted");

    expect(Array.isArray(leads)).toBe(true);
    leads.forEach(lead => {
      expect(lead.status).toBe("Contacted");
    });
  });

  it("should create a demo request for a lead", async () => {
    if (!createdLeadId) {
      expect.fail("No lead created for demo request test");
    }

    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    const demoRequest = await caller.demoRequests.create({
      leadId: createdLeadId,
      preferredDate: "2026-04-15",
      preferredTime: "2:00 PM",
      platform: "Google Meet",
    });

    expect(demoRequest).toBeDefined();
    expect(demoRequest?.leadId).toBe(createdLeadId);
    expect(demoRequest?.status).toBe("Pending");
    expect(demoRequest?.platform).toBe("Google Meet");
  });

  it("should retrieve demo requests for a lead", async () => {
    if (!createdLeadId) {
      expect.fail("No lead created for demo request retrieval test");
    }

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const demoRequests = await caller.demoRequests.getByLeadId(createdLeadId);

    expect(Array.isArray(demoRequests)).toBe(true);
    expect(demoRequests.length).toBeGreaterThan(0);
  });

  it("should update demo request status", async () => {
    if (!createdLeadId) {
      expect.fail("No lead created for demo request update test");
    }

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const demoRequests = await caller.demoRequests.getByLeadId(createdLeadId);
    if (demoRequests.length === 0) {
      expect.fail("No demo requests found");
    }

    const demoRequestId = demoRequests[0]?.id;
    const updated = await caller.demoRequests.update({
      id: demoRequestId!,
      status: "Confirmed",
      confirmedAt: new Date(),
    });

    expect(updated?.status).toBe("Confirmed");
    expect(updated?.confirmedAt).toBeDefined();
  });

  it("should handle invalid email gracefully", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    try {
      await caller.leads.create({
        name: "Invalid Lead",
        email: "not-an-email",
        projectType: "digital_marketing",
      });
      expect.fail("Should have thrown an error for invalid email");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("Site Content Management", () => {
  it("should create a testimonial", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const testimonial = await caller.siteContent.create({
      type: "testimonial",
      title: "Great Service",
      description: "ViyonaDigital provided excellent service",
      author: "Jane Smith",
      authorCompany: "Tech Company",
      isPublished: true,
    });

    expect(testimonial).toBeDefined();
    expect(testimonial?.type).toBe("testimonial");
    expect(testimonial?.isPublished).toBe(true);
  });

  it("should retrieve published testimonials", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    const testimonials = await caller.siteContent.getByType("testimonial");

    expect(Array.isArray(testimonials)).toBe(true);
    testimonials.forEach(t => {
      expect(t.isPublished).toBe(true);
    });
  });
});

describe("Settings Management", () => {
  it("should set and retrieve a setting", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await caller.settings.set({
      key: "test_setting",
      value: "test_value",
      type: "string",
    });

    const value = await caller.settings.get("test_setting");

    expect(value).toBe("test_value");
  });

  it("should retrieve all settings", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const settings = await caller.settings.getAll();

    expect(Array.isArray(settings)).toBe(true);
  });
});
