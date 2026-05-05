import { NextRequest, NextResponse } from "next/server";
import { getBidsCollection, getBriefsCollection } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const collection = await getBidsCollection();
    const bid = await collection.findOne({ _id: new ObjectId(id) as any });

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Authorization: 
    // - Agent who created it
    // - Admin
    // - Buyer who owns the brief
    let authorized = userRole === 'admin' || bid.agentId === userId;

    if (!authorized && userRole === 'buyer') {
      const briefsCollection = await getBriefsCollection();
      const brief = await briefsCollection.findOne({ 
        _id: new ObjectId(bid.briefId) as any,
        buyerId: userId 
      });
      if (brief) authorized = true;
    }

    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(bid);
  } catch (error) {
    console.error("Failed to fetch bid:", error);
    return NextResponse.json({ error: "Invalid ID or server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const bidsCollection = await getBidsCollection();
    const bid = await bidsCollection.findOne({ _id: new ObjectId(id) as any });

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Authorization for PUT (Update Status):
    // Only the Buyer who owns the brief or an Admin can update a bid status (accept/reject)
    let authorized = userRole === 'admin';

    if (!authorized && userRole === 'buyer') {
      const briefsCollection = await getBriefsCollection();
      const brief = await briefsCollection.findOne({ 
        _id: new ObjectId(bid.briefId) as any,
        buyerId: userId 
      });
      if (brief) authorized = true;
    }

    if (!authorized) {
      return NextResponse.json({ error: "Only the requirement owner can update bid status" }, { status: 403 });
    }

    // Update bid status
    await bidsCollection.updateOne(
      { _id: new ObjectId(id) as any },
      { $set: { status, updatedAt: new Date() } }
    );

    // Notify agent about status change
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: bid.agentId,
      type: status === "accepted" ? "bid_accepted" : "message",
      title: `Bid ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your bid for the brief in ${bid.area} has been ${status}.`,
      link: `/dashboard/agent`,
    });

    // If accepted, maybe close the brief?
    if (status === "accepted") {
      const briefsCollection = await getBriefsCollection();
      await briefsCollection.updateOne(
        { _id: new ObjectId(bid.briefId) as any },
        { $set: { status: "fulfilled", updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ message: "Bid status updated successfully" });
  } catch (error) {
    console.error("Failed to update bid:", error);
    return NextResponse.json({ error: "Failed to update bid" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const bidsCollection = await getBidsCollection();
    
    const bid = await bidsCollection.findOne({ _id: new ObjectId(id) as any });
    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    // Ensure user owns the bid
    if (bid.agentId !== (session.user as any).id && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete bid
    await bidsCollection.deleteOne({ _id: new ObjectId(id) as any });

    // Decrement bidsCount on brief
    const briefsCollection = await getBriefsCollection();
    await briefsCollection.updateOne(
      { _id: new ObjectId(bid.briefId) as any },
      { $inc: { bidsCount: -1 }, $set: { updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Bid deleted successfully" });
  } catch (error) {
    console.error("Failed to delete bid:", error);
    return NextResponse.json({ error: "Failed to delete bid" }, { status: 500 });
  }
}
