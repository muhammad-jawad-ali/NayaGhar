import { NextRequest, NextResponse } from "next/server";
import { getBriefsCollection } from "@/lib/db";
import { BriefSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "open";
    const query: any = { status };
    if (city) query.city = city;
    if (category) query.category = category;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collection = await getBriefsCollection();
    
    const [briefs, total] = await Promise.all([
      collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query)
    ]);

    return NextResponse.json({
      briefs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Failed to fetch briefs:", error);
    return NextResponse.json({ error: "Failed to fetch briefs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "buyer") {
      return NextResponse.json({ error: "Only buyers can post requirements" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = BriefSchema.parse(body);

    const collection = await getBriefsCollection();
    
    const newBrief = {
      ...validatedData,
      buyerId: (session.user as any).id,
      buyerName: session?.user?.name || "Anonymous",
      status: "open",
      bidsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newBrief);
    
    return NextResponse.json({ 
      message: "Brief created successfully", 
      id: result.insertedId 
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to create brief:", error);
    return NextResponse.json({ error: "Failed to create brief" }, { status: 500 });
  }
}
