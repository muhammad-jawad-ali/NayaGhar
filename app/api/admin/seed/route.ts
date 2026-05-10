import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  // Basic security to prevent accidental seeding
  if (key !== "seed123") {
    return NextResponse.json({ error: "Invalid secret key" }, { status: 401 });
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({ error: "MONGODB_URI not configured in Vercel" }, { status: 500 });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(); // Uses the DB name from the URI
    
    const users = db.collection("users");
    const briefs = db.collection("briefs");
    const bids = db.collection("bids");
    const notifications = db.collection("notifications");

    const seedTag = "codex-demo-seed";
    const password = await bcrypt.hash("DemoPass123!", 12);

    // Clean old seed data
    await Promise.all([
      users.deleteMany({ seedTag }),
      briefs.deleteMany({ seedTag }),
      bids.deleteMany({ seedTag }),
      notifications.deleteMany({ seedTag }),
    ]);

    const buyerAId = new ObjectId();
    const buyerBId = new ObjectId();
    const agentAId = new ObjectId();
    const agentBId = new ObjectId();
    const adminId = new ObjectId();

    const daysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    };

    // 1. Users
    await users.insertMany([
      { _id: buyerAId, name: "Ayesha Khan", email: "buyer@demo.com", password, role: "buyer", seedTag, createdAt: daysAgo(16), updatedAt: new Date() },
      { _id: buyerBId, name: "Hamza Malik", email: "buyer2@demo.com", password, role: "buyer", seedTag, createdAt: daysAgo(12), updatedAt: new Date() },
      { _id: agentAId, name: "Sara Properties", email: "agent@demo.com", password, role: "agent", seedTag, createdAt: daysAgo(20), updatedAt: new Date() },
      { _id: agentBId, name: "Bilal Estates", email: "agent2@demo.com", password, role: "agent", seedTag, createdAt: daysAgo(8), updatedAt: new Date() },
      { _id: adminId, name: "Demo Admin", email: "admin@demo.com", password, role: "admin", seedTag, createdAt: daysAgo(30), updatedAt: new Date() },
    ]);

    // 2. Briefs
    const briefIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
    await briefs.insertMany([
      {
        _id: briefIds[0],
        buyerId: buyerAId.toString(),
        buyerName: "Ayesha Khan",
        purpose: "buy",
        category: "house",
        propertyStatus: "ready-to-move",
        city: "Lahore",
        area: "DHA Phase 6",
        boundaryPref: "park-facing",
        areaSize: 10,
        areaUnit: "marla",
        bedrooms: 4,
        bathrooms: 5,
        amenities: ["Gas Connection", "Dedicated Parking", "Servant Quarter", "Gated Security"],
        description: "Looking for a modern family house near schools with clean paperwork and possession available within 45 days.",
        budgetMin: 65000000,
        budgetMax: 85000000,
        budgetNotSpecified: false,
        paymentPlan: "lump-sum",
        urgency: "immediate",
        status: "open",
        bidsCount: 2,
        seedTag,
        createdAt: daysAgo(3),
        updatedAt: daysAgo(1),
      },
      {
        _id: briefIds[1],
        buyerId: buyerAId.toString(),
        buyerName: "Ayesha Khan",
        purpose: "rent",
        category: "flat",
        propertyStatus: "ready-to-move",
        city: "Karachi",
        area: "Clifton Block 8",
        boundaryPref: "main-road",
        areaSize: 1600,
        areaUnit: "sq-feet",
        bedrooms: 3,
        bathrooms: 3,
        amenities: ["Elevator/Lift", "Dedicated Parking", "Backup Generator", "CCTV"],
        description: "Need a secure apartment for a small family, preferably with sea-facing or open-view balcony.",
        budgetMin: 180000,
        budgetMax: 260000,
        budgetNotSpecified: false,
        paymentPlan: "lump-sum",
        urgency: "within-3-months",
        status: "open",
        bidsCount: 1,
        seedTag,
        createdAt: daysAgo(6),
        updatedAt: daysAgo(2),
      },
      {
        _id: briefIds[2],
        buyerId: buyerBId.toString(),
        buyerName: "Hamza Malik",
        purpose: "buy",
        category: "plot",
        propertyStatus: "off-plan",
        city: "Islamabad",
        area: "Gulberg Greens",
        boundaryPref: "corner-plot",
        areaSize: 1,
        areaUnit: "kanal",
        bedrooms: 0,
        bathrooms: 0,
        amenities: ["Gated Security"],
        description: "Investment plot preferred in a developed block with transfer-ready file.",
        budgetMin: 45000000,
        budgetMax: 60000000,
        budgetNotSpecified: false,
        paymentPlan: "installments",
        urgency: "just-browsing",
        status: "open",
        bidsCount: 1,
        seedTag,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(4),
      },
    ]);

    // 3. Bids
    await bids.insertMany([
      {
        briefId: briefIds[0].toString(),
        agentId: agentAId.toString(),
        agentName: "Sara Properties",
        propertyTitle: "Brand New 10 Marla Park-Facing House",
        propertyAddress: "Street 12, DHA Phase 6, Lahore",
        city: "Lahore",
        area: "DHA Phase 6",
        areaSize: 10,
        areaUnit: "marla",
        category: "house",
        propertyStatus: "ready-to-move",
        price: 78500000,
        paymentPlan: "lump-sum",
        bedrooms: 4,
        bathrooms: 5,
        amenities: ["Gas Connection", "Dedicated Parking", "Servant Quarter", "Gated Security"],
        description: "Freshly completed house with imported fittings, near park and mosque. Possession is available immediately.",
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
        status: "pending",
        seedTag,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
      },
    ]);

    return NextResponse.json({ message: "Seed successful! You can now login with buyer@demo.com / DemoPass123!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
