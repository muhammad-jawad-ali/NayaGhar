import { z } from "zod";

export const UserRoleSchema = z.enum(["buyer", "agent", "admin"]);

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: UserRoleSchema.default("buyer"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const BriefPurposeSchema = z.enum(["buy", "rent", "short-term-lease", "other"]);
export const PropertyCategorySchema = z.enum(["house", "flat", "plot", "commercial", "farmhouse", "other"]);
export const PropertyStatusSchema = z.enum(["ready-to-move", "under-construction", "off-plan"]);
export const BoundaryPrefSchema = z.enum(["corner-plot", "park-facing", "main-road", "cul-de-sac", "other", "none"]);
export const PaymentPlanSchema = z.enum(["lump-sum", "installments", "bank-financing", "other"]);
export const UrgencySchema = z.enum(["immediate", "within-3-months", "just-browsing"]);
export const AreaUnitSchema = z.enum(["marla", "kanal", "sq-yards", "sq-feet"]);

export const BriefSchema = z.object({
  purpose: BriefPurposeSchema,
  category: PropertyCategorySchema,
  propertyStatus: PropertyStatusSchema,
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  boundaryPref: BoundaryPrefSchema.default("none"),
  areaSize: z.number().positive("Area size must be positive"),
  areaUnit: AreaUnitSchema,
  bedrooms: z.number().int().nonnegative().default(0),
  bathrooms: z.number().int().nonnegative().default(0),
  amenities: z.array(z.string()).default([]),
  description: z.string().optional(),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  budgetNotSpecified: z.boolean().default(false),
  paymentPlan: PaymentPlanSchema.default("lump-sum"),
  urgency: UrgencySchema.default("immediate"),
  // Server-side added fields (optional in schema to allow frontend submission)
  buyerId: z.string().optional(),
  buyerName: z.string().optional(),
  status: z.enum(["open", "closed", "fulfilled"]).optional(),
  bidsCount: z.number().int().nonnegative().optional(),
});

export const BidSchema = z.object({
  briefId: z.string().min(1, "Brief ID is required"),
  propertyTitle: z.string().min(3, "Title must be at least 3 characters"),
  propertyAddress: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  areaSize: z.number().positive("Area size must be positive"),
  areaUnit: AreaUnitSchema,
  category: PropertyCategorySchema,
  propertyStatus: PropertyStatusSchema,
  price: z.number().positive("Price must be positive"),
  paymentPlan: PaymentPlanSchema.default("lump-sum"),
  bedrooms: z.number().int().nonnegative().default(0),
  bathrooms: z.number().int().nonnegative().default(0),
  amenities: z.array(z.string()).default([]),
  description: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  // Server-side added fields
  agentId: z.string().optional(),
  agentName: z.string().optional(),
  status: z.enum(["pending", "accepted", "rejected", "withdrawn"]).optional(),
});
