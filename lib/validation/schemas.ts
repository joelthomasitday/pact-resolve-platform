import { z } from "zod";

const contactPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  role: z.string().optional(),
});

export const globalSettingsSchema = z.object({
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  contactPersons: z.array(contactPersonSchema).optional().default([]),
  address: z.string().optional(),
  companyName: z.string().optional(),
});


export const contentSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string(),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const auditLogSchema = z.object({
  userId: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  details: z.record(z.any()).optional(),
  timestamp: z.date().default(() => new Date()),
});
