const fs = require("fs");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const raw = fs.readFileSync(envPath, "utf8");

  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    process.env[key] = process.env[key] || value;
  }
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  loadEnv();

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env.local");
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  const db = client.db("nayaghar");
  const users = db.collection("users");
  const briefs = db.collection("briefs");
  const bids = db.collection("bids");
  const notifications = db.collection("notifications");

  const seedTag = "codex-demo-seed";
  const password = await bcrypt.hash("DemoPass123!", 12);

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

  const demoUsers = [
    {
      _id: buyerAId,
      name: "Ayesha Khan",
      email: "buyer@demo.com",
      password,
      role: "buyer",
      seedTag,
      createdAt: daysAgo(16),
      updatedAt: new Date(),
    },
    {
      _id: buyerBId,
      name: "Hamza Malik",
      email: "buyer2@demo.com",
      password,
      role: "buyer",
      seedTag,
      createdAt: daysAgo(12),
      updatedAt: new Date(),
    },
    {
      _id: agentAId,
      name: "Sara Properties",
      email: "agent@demo.com",
      password,
      role: "agent",
      seedTag,
      createdAt: daysAgo(20),
      updatedAt: new Date(),
    },
    {
      _id: agentBId,
      name: "Bilal Estates",
      email: "agent2@demo.com",
      password,
      role: "agent",
      seedTag,
      createdAt: daysAgo(8),
      updatedAt: new Date(),
    },
    {
      _id: adminId,
      name: "Demo Admin",
      email: "admin@demo.com",
      password,
      role: "admin",
      seedTag,
      createdAt: daysAgo(30),
      updatedAt: new Date(),
    },
  ];

  await users.insertMany(demoUsers);

  const briefIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];
  const demoBriefs = [
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
    {
      _id: briefIds[3],
      buyerId: buyerBId.toString(),
      buyerName: "Hamza Malik",
      purpose: "buy",
      category: "commercial",
      propertyStatus: "ready-to-move",
      city: "Rawalpindi",
      area: "Bahria Town Phase 7",
      boundaryPref: "main-road",
      areaSize: 900,
      areaUnit: "sq-feet",
      bedrooms: 0,
      bathrooms: 1,
      amenities: ["Dedicated Parking", "CCTV", "Backup Generator"],
      description: "Shop or small office space with good footfall for a retail concept.",
      budgetMin: 25000000,
      budgetMax: 36000000,
      budgetNotSpecified: false,
      paymentPlan: "bank-financing",
      urgency: "immediate",
      status: "open",
      bidsCount: 0,
      seedTag,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
    {
      _id: briefIds[4],
      buyerId: buyerAId.toString(),
      buyerName: "Ayesha Khan",
      purpose: "buy",
      category: "house",
      propertyStatus: "ready-to-move",
      city: "Islamabad",
      area: "F-11",
      boundaryPref: "none",
      areaSize: 12,
      areaUnit: "marla",
      bedrooms: 5,
      bathrooms: 5,
      amenities: ["Gas Connection", "Dedicated Parking", "Lawn/Garden", "Drawing Room"],
      description: "Accepted demo bid closes this brief so dashboards show a completed match.",
      budgetMin: 110000000,
      budgetMax: 140000000,
      budgetNotSpecified: false,
      paymentPlan: "lump-sum",
      urgency: "within-3-months",
      status: "fulfilled",
      bidsCount: 1,
      seedTag,
      createdAt: daysAgo(15),
      updatedAt: daysAgo(7),
    },
  ];

  await briefs.insertMany(demoBriefs);

  const demoBids = [
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
    {
      briefId: briefIds[0].toString(),
      agentId: agentBId.toString(),
      agentName: "Bilal Estates",
      propertyTitle: "Designer 10 Marla House Near Raya",
      propertyAddress: "Sector C, DHA Phase 6, Lahore",
      city: "Lahore",
      area: "DHA Phase 6",
      areaSize: 10,
      areaUnit: "marla",
      category: "house",
      propertyStatus: "ready-to-move",
      price: 82500000,
      paymentPlan: "bank-financing",
      bedrooms: 5,
      bathrooms: 5,
      amenities: ["Dedicated Parking", "Servant Quarter", "Solar Panels", "CCTV"],
      description: "Slightly above midpoint but has solar, premium kitchen, and a wider approach road.",
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
      status: "pending",
      seedTag,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
    {
      briefId: briefIds[1].toString(),
      agentId: agentAId.toString(),
      agentName: "Sara Properties",
      propertyTitle: "Clifton 3-Bed Apartment With Parking",
      propertyAddress: "Block 8, Clifton, Karachi",
      city: "Karachi",
      area: "Clifton Block 8",
      areaSize: 1650,
      areaUnit: "sq-feet",
      category: "flat",
      propertyStatus: "ready-to-move",
      price: 225000,
      paymentPlan: "lump-sum",
      bedrooms: 3,
      bathrooms: 3,
      amenities: ["Elevator/Lift", "Dedicated Parking", "Backup Generator", "CCTV"],
      description: "Family building, west-open lounge, one reserved parking spot, and generator backup.",
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
      status: "pending",
      seedTag,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
    },
    {
      briefId: briefIds[2].toString(),
      agentId: agentBId.toString(),
      agentName: "Bilal Estates",
      propertyTitle: "1 Kanal Corner Plot File",
      propertyAddress: "Executive Block, Gulberg Greens, Islamabad",
      city: "Islamabad",
      area: "Gulberg Greens",
      areaSize: 1,
      areaUnit: "kanal",
      category: "plot",
      propertyStatus: "off-plan",
      price: 54500000,
      paymentPlan: "installments",
      bedrooms: 0,
      bathrooms: 0,
      amenities: ["Gated Security"],
      description: "Corner plot file with clear transfer route and installment schedule available for review.",
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
      status: "pending",
      seedTag,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
    {
      briefId: briefIds[4].toString(),
      agentId: agentAId.toString(),
      agentName: "Sara Properties",
      propertyTitle: "F-11 Renovated Family House",
      propertyAddress: "F-11/2, Islamabad",
      city: "Islamabad",
      area: "F-11",
      areaSize: 12,
      areaUnit: "marla",
      category: "house",
      propertyStatus: "ready-to-move",
      price: 128000000,
      paymentPlan: "lump-sum",
      bedrooms: 5,
      bathrooms: 5,
      amenities: ["Gas Connection", "Dedicated Parking", "Lawn/Garden", "Drawing Room"],
      description: "Accepted demo match with renovated interiors and clean CDA transfer documents.",
      images: ["https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?w=800&q=80"],
      status: "accepted",
      seedTag,
      createdAt: daysAgo(10),
      updatedAt: daysAgo(7),
    },
  ];

  await bids.insertMany(demoBids);

  await notifications.insertMany([
    {
      userId: buyerAId.toString(),
      type: "bid_received",
      title: "New Bid Received!",
      message: "Sara Properties pitched a house for your DHA Phase 6 requirement.",
      link: `/briefs/${briefIds[0].toString()}`,
      isRead: false,
      seedTag,
      createdAt: daysAgo(1),
    },
    {
      userId: buyerAId.toString(),
      type: "bid_received",
      title: "Another Bid Received",
      message: "Bilal Estates added a second option for your Lahore brief.",
      link: `/briefs/${briefIds[0].toString()}`,
      isRead: false,
      seedTag,
      createdAt: daysAgo(1),
    },
    {
      userId: agentAId.toString(),
      type: "bid_accepted",
      title: "Bid Accepted",
      message: "Your F-11 house bid was accepted by Ayesha Khan.",
      link: "/dashboard/agent",
      isRead: false,
      seedTag,
      createdAt: daysAgo(7),
    },
    {
      userId: adminId.toString(),
      type: "message",
      title: "Demo Data Ready",
      message: "The demo marketplace has buyers, agents, briefs, bids, and notifications.",
      link: "/dashboard/admin",
      isRead: false,
      seedTag,
      createdAt: new Date(),
    },
  ]);

  console.log("Seed complete.");
  console.log("Demo password: DemoPass123!");
  console.log("Accounts:");
  console.log("buyer@demo.com / agent@demo.com / admin@demo.com");

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
