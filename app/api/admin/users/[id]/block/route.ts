import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isBlocked } = body;

    if (typeof isBlocked !== 'boolean') {
      return NextResponse.json({ error: "isBlocked must be a boolean" }, { status: 400 });
    }

    const usersCollection = await getUsersCollection();
    
    // Prevent blocking yourself
    if (id === (session.user as any).id) {
        return NextResponse.json({ error: "Cannot block your own admin account" }, { status: 400 });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) as any },
      { $set: { isBlocked, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `User successfully ${isBlocked ? 'blocked' : 'unblocked'}` });
  } catch (error) {
    console.error("Failed to update block status:", error);
    return NextResponse.json({ error: "Failed to update block status" }, { status: 500 });
  }
}
