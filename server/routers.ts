import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createLead, getAllLeads, getLeadById, updateLead, getLeadsByStatus, createDemoRequest, getDemoRequestsByLeadId, updateDemoRequest, getSiteContentByType, createSiteContent, updateSiteContent, getSetting, setSetting, getAllSettings, getAvailableDemoSlots } from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ LEADS ROUTER ============
  leads: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          company: z.string().optional(),
          projectType: z.enum(["digital_marketing", "web_development", "data_analysis"]),
          budget: z.string().optional(),
          timeline: z.string().optional(),
          isDecisionMaker: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const lead = await createLead({
            ...input,
            status: "New",
            source: "chatbot",
          });
          return lead;
        } catch (error) {
          console.error("Failed to create lead:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create lead",
          });
        }
      }),

    getAll: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          projectType: z.string().optional(),
          searchTerm: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        try {
          const leads = await getAllLeads(input);
          return leads;
        } catch (error) {
          console.error("Failed to get leads:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get leads",
          });
        }
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        try {
          const lead = await getLeadById(input);
          if (!lead) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Lead not found",
            });
          }
          return lead;
        } catch (error) {
          console.error("Failed to get lead:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get lead",
          });
        }
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          company: z.string().optional(),
          projectType: z.enum(["digital_marketing", "web_development", "data_analysis"]).optional(),
          budget: z.string().optional(),
          timeline: z.string().optional(),
          isDecisionMaker: z.boolean().optional(),
          status: z.enum(["New", "Contacted", "Qualified", "Demo Scheduled", "Demo Completed", "Won", "Lost", "Follow-up", "Junk"]).optional(),
          priority: z.boolean().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { id, ...updates } = input;
          const lead = await updateLead(id, updates);
          return lead;
        } catch (error) {
          console.error("Failed to update lead:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update lead",
          });
        }
      }),

    getByStatus: protectedProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          const leads = await getLeadsByStatus(input);
          return leads;
        } catch (error) {
          console.error("Failed to get leads by status:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get leads by status",
          });
        }
      }),
  }),

  // ============ DEMO REQUESTS ROUTER ============
  demoRequests: router({
    create: publicProcedure
      .input(
        z.object({
          leadId: z.number(),
          preferredDate: z.string().optional(),
          preferredTime: z.string().optional(),
          platform: z.enum(["Google Meet", "Zoom", "Teams", "Phone"]).default("Google Meet"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const demoRequest = await createDemoRequest({
            ...input,
            status: "Pending",
          });
          return demoRequest;
        } catch (error) {
          console.error("Failed to create demo request:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create demo request",
          });
        }
      }),

    getByLeadId: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        try {
          const demoRequests = await getDemoRequestsByLeadId(input);
          return demoRequests;
        } catch (error) {
          console.error("Failed to get demo requests:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get demo requests",
          });
        }
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          preferredDate: z.string().optional(),
          preferredTime: z.string().optional(),
          platform: z.enum(["Google Meet", "Zoom", "Teams", "Phone"]).optional(),
          status: z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]).optional(),
          confirmedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { id, ...updates } = input;
          const demoRequest = await updateDemoRequest(id, updates);
          return demoRequest;
        } catch (error) {
          console.error("Failed to update demo request:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update demo request",
          });
        }
      }),
  }),

  // ============ SITE CONTENT ROUTER ============
  siteContent: router({
    getByType: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          const content = await getSiteContentByType(input);
          return content;
        } catch (error) {
          console.error("Failed to get site content:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get site content",
          });
        }
      }),

    create: protectedProcedure
      .input(
        z.object({
          type: z.enum(["testimonial", "case_study", "service", "page_section"]),
          title: z.string().optional(),
          description: z.string().optional(),
          content: z.string().optional(),
          imageUrl: z.string().optional(),
          author: z.string().optional(),
          authorCompany: z.string().optional(),
          isPublished: z.boolean().default(false),
          order: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const content = await createSiteContent(input);
          return content;
        } catch (error) {
          console.error("Failed to create site content:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create site content",
          });
        }
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          content: z.string().optional(),
          imageUrl: z.string().optional(),
          author: z.string().optional(),
          authorCompany: z.string().optional(),
          isPublished: z.boolean().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { id, ...updates } = input;
          const content = await updateSiteContent(id, updates);
          return content;
        } catch (error) {
          console.error("Failed to update site content:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update site content",
          });
        }
      }),
  }),

  // ============ SETTINGS ROUTER ============
  settings: router({
    get: protectedProcedure
      .input(z.string())
      .query(async ({ input }) => {
        try {
          const value = await getSetting(input);
          return value;
        } catch (error) {
          console.error("Failed to get setting:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get setting",
          });
        }
      }),

    set: protectedProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
          type: z.enum(["string", "number", "boolean", "json"]).default("string"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const setting = await setSetting(input.key, input.value, input.type);
          return setting;
        } catch (error) {
          console.error("Failed to set setting:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to set setting",
          });
        }
      }),

    getAll: protectedProcedure
      .query(async () => {
        try {
          const settings = await getAllSettings();
          return settings;
        } catch (error) {
          console.error("Failed to get settings:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get settings",
          });
        }
      }),
  }),

  // ============ DEMO SLOTS ROUTER ============
  demoSlots: router({
    getAvailable: publicProcedure
      .query(async () => {
        try {
          const slots = await getAvailableDemoSlots();
          return slots;
        } catch (error) {
          console.error("Failed to get demo slots:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get demo slots",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
