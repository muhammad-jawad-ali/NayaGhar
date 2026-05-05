import { getBriefsCollection } from "../lib/db";
import { MongoClient } from "mongodb";

async function test() {
  try {
    const collection = await getBriefsCollection();
    const briefs = await collection.find({}).toArray();
    console.log("Briefs count:", briefs.length);
    if (briefs.length > 0) {
      console.log("First brief ID:", briefs[0]._id);
    } else {
      console.log("No briefs found. Seeding one...");
      const result = await collection.insertOne({
        purpose: "buy",
        category: "house",
        propertyStatus: "ready-to-move",
        city: "Islamabad",
        area: "DHA Phase 2",
        areaSize: 10,
        areaUnit: "marla",
        bedrooms: 4,
        bathrooms: 4,
        amenities: ["Gas Connection", "CCTV"],
        description: "Test brief",
        budgetMin: 50000000,
        budgetMax: 70000000,
        budgetNotSpecified: false,
        paymentPlan: "lump-sum",
        urgency: "immediate",
        buyerId: "temp-buyer-id",
        buyerName: "Temp Buyer",
        status: "open",
        bidsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("Seeded brief ID:", result.insertedId);
    }
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    process.exit();
  }
}

test();
