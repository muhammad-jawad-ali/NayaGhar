import { NextRequest, NextResponse } from "next/server";
import { getBidsCollection, getBriefsCollection, withRetry } from "@/lib/db";
import { BidSchema } from "@/lib/validations";
import { ObjectId } from "mongodb";
import { createNotification } from "@/lib/notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const briefId = searchParams.get("briefId");
    const agentId = searchParams.get("agentId");

    const query: any = {};
    if (briefId) query.briefId = briefId;
    if (agentId) query.agentId = agentId;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collection = await getBidsCollection();
    
    const [bids, total] = await Promise.all([
      collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query)
    ]);

    return NextResponse.json({
      bids,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Failed to fetch bids:", error);
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "agent") {
      return NextResponse.json({ error: "Only agents can submit bids" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = BidSchema.parse(body);

    const bidsCollection = await getBidsCollection();
    const briefsCollection = await getBriefsCollection();

    const result = await withRetry(async () => {
      // 1. Verify brief exists
      if (!ObjectId.isValid(validatedData.briefId)) {
        throw new Error("INVALID_BRIEF_ID");
      }

      const brief = await briefsCollection.findOne({ 
        _id: new ObjectId(validatedData.briefId) as any 
      });
      
      if (!brief) {
        throw new Error("BRIEF_NOT_FOUND");
      }

      // 1.5 Check for duplicate bids
      const existingBid = await bidsCollection.findOne({
        briefId: validatedData.briefId,
        agentId: (session.user as any).id
      });

      if (existingBid) {
        throw new Error("DUPLICATE_BID");
      }

      // 2. Insert bid
      const newBid = {
        ...validatedData,
        agentId: (session.user as any).id,
        agentName: session.user.name || "Anonymous Agent",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertResult = await bidsCollection.insertOne(newBid);

      // 3. Increment bidsCount on brief
      await briefsCollection.updateOne(
        { _id: new ObjectId(validatedData.briefId) as any },
        { $inc: { bidsCount: 1 }, $set: { updatedAt: new Date() } }
      );

      return { insertResult, brief };
    });

    // 4. Create notification for buyer (outside retry as it's less critical and has its own logging)
    try {
      await createNotification({
        userId: result.brief.buyerId,
        type: "bid_received",
        title: "New Bid Received!",
        message: `An agent has pitched a property for your ${result.brief.category} requirement in ${result.brief.area}.`,
        link: `/briefs/${validatedData.briefId}`,
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }
    
    return NextResponse.json({ 
      message: "Bid submitted successfully", 
      id: result.insertResult.insertedId 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Failed to submit bid ERROR:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    if (error.message === "INVALID_BRIEF_ID") {
      return NextResponse.json({ error: "Invalid Brief ID format" }, { status: 400 });
    }
    
    if (error.message === "BRIEF_NOT_FOUND") {
      return NextResponse.json({ error: "The requirement you are bidding on no longer exists." }, { status: 404 });
    }

    if (error.message === "DUPLICATE_BID") {
      return NextResponse.json({ error: "You have already submitted a bid for this requirement." }, { status: 409 });
    }

    const isConnectionError = error.message?.includes("topology") || error.name === "MongoNetworkError";

    return NextResponse.json({ 
      error: isConnectionError ? "Database connection issue. Please try again in a few moments." : "Failed to submit bid", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
