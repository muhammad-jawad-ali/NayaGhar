import { NextRequest, NextResponse } from "next/server";
import { getBriefsCollection } from "@/lib/db";
import { BriefSchema } from "@/lib/validations";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const collection = await getBriefsCollection();
    const brief = await collection.findOne({ _id: new ObjectId(id) as any });

    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }

    return NextResponse.json(brief);
  } catch (error) {
    console.error("Failed to fetch brief:", error);
    return NextResponse.json({ error: "Invalid ID or server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    const validatedData = BriefSchema.partial().parse(body);

    const collection = await getBriefsCollection();
    
    // Ensure user owns the brief
    const brief = await collection.findOne({ _id: new ObjectId(id) as any });
    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }
    
    if (brief.buyerId !== (session.user as any).id && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) as any },
      { 
        $set: { 
          ...validatedData, 
          updatedAt: new Date() 
        } 
      }
    );

    return NextResponse.json({ message: "Brief updated successfully" });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to update brief:", error);
    return NextResponse.json({ error: "Failed to update brief" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const collection = await getBriefsCollection();

    // Ensure user owns the brief
    const brief = await collection.findOne({ _id: new ObjectId(id) as any });
    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }
    
    if (brief.buyerId !== (session.user as any).id && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) as any });

    return NextResponse.json({ message: "Brief deleted successfully" });
  } catch (error) {
    console.error("Failed to delete brief:", error);
    return NextResponse.json({ error: "Failed to delete brief" }, { status: 500 });
  }
}
