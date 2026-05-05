import clientPromise from "./mongodb";
import type { 
  User, UserRole, 
  Brief, BriefPurpose, PropertyCategory, PropertyStatus, BoundaryPref, AreaUnit, PaymentPlan, Urgency, BriefStatus,
  Bid, BidStatus, 
  Property 
} from "./types";

export { PAKISTANI_CITIES, AREA_UNITS, AMENITIES_LIST, PLACEHOLDER_IMAGES } from "./types";

export async function getDb() {
  const client = await clientPromise;
  return client.db("nayaghar");
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}

export async function getBriefsCollection() {
  const db = await getDb();
  return db.collection("briefs");
}

export async function getBidsCollection() {
  const db = await getDb();
  return db.collection("bids");
}

export async function getPropertiesCollection() {
  const db = await getDb();
  return db.collection("properties");
}
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) throw error;
    
    // Check if it's a transient connection error
    const isTransient = 
      error.message?.includes("topology is closed") || 
      error.message?.includes("connection pool") ||
      error.message?.includes("timed out") ||
      error.name === "MongoNetworkError";

    if (isTransient) {
      console.warn(`Database connection error, retrying... (${retries} left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    
    throw error;
  }
}
