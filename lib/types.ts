import type { ObjectId } from "mongodb";

export type UserRole = "buyer" | "agent" | "admin";

export interface User {
  _id?: string | ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type BriefPurpose = "buy" | "rent" | "short-term-lease" | "other";
export type PropertyCategory = "house" | "flat" | "plot" | "commercial" | "farmhouse" | "other";
export type PropertyStatus = "ready-to-move" | "under-construction" | "off-plan";
export type BoundaryPref = "corner-plot" | "park-facing" | "main-road" | "cul-de-sac" | "other" | "none";
export type PaymentPlan = "lump-sum" | "installments" | "bank-financing" | "other";
export type Urgency = "immediate" | "within-3-months" | "just-browsing";
export type BriefStatus = "open" | "closed" | "fulfilled";
export type AreaUnit = "marla" | "kanal" | "sq-yards" | "sq-feet";

export interface Brief {
  _id?: string | ObjectId;
  buyerId: string;
  buyerName: string;
  purpose: BriefPurpose;
  category: PropertyCategory;
  propertyStatus: PropertyStatus;
  city: string;
  area: string;
  boundaryPref: BoundaryPref;
  areaSize: number;
  areaUnit: AreaUnit;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
  budgetMin: number;
  budgetMax: number;
  budgetNotSpecified: boolean;
  paymentPlan: PaymentPlan;
  urgency: Urgency;
  status: BriefStatus;
  bidsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Bid {
  _id?: string | ObjectId;
  briefId: string;
  agentId: string;
  agentName: string;
  propertyId?: string;
  propertyTitle: string;
  propertyAddress: string;
  city: string;
  area: string;
  areaSize: number;
  areaUnit: AreaUnit;
  category: PropertyCategory;
  propertyStatus: PropertyStatus;
  price: number;
  paymentPlan: PaymentPlan;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
  images: string[];
  status: BidStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  _id?: string | ObjectId;
  agentId: string;
  agentName: string;
  title: string;
  address: string;
  city: string;
  area: string;
  areaSize: number;
  areaUnit: AreaUnit;
  category: PropertyCategory;
  propertyStatus: PropertyStatus;
  price: number;
  paymentPlan: PaymentPlan;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Pakistani Cities ─────────────────────────────────────────────────────────
export const PAKISTANI_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Other",
] as const;

export const AREA_UNITS: { value: AreaUnit; label: string }[] = [
  { value: "marla", label: "Marla" },
  { value: "kanal", label: "Kanal" },
  { value: "sq-yards", label: "Sq. Yards" },
  { value: "sq-feet", label: "Sq. Feet" },
];

export const AMENITIES_LIST = [
  "Gas Connection",
  "Dedicated Parking",
  "Servant Quarter",
  "Gated Security",
  "Elevator/Lift",
  "Backup Generator",
  "Solar Panels",
  "Swimming Pool",
  "CCTV",
  "Drawing Room",
  "Store Room",
  "Lawn/Garden",
];

export const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?w=800&q=80",
];

export type NotificationType = "match" | "bid_received" | "bid_accepted" | "message";

export interface Notification {
  _id?: string | ObjectId;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
}
