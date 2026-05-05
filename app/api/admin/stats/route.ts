import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    
    const [userCount, briefCount, bidCount, latestUsers] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("briefs").countDocuments(),
      db.collection("bids").countDocuments(),
      db.collection("users").find().sort({ createdAt: -1 }).limit(5).toArray()
    ]);

    return NextResponse.json({
      stats: {
        users: userCount,
        briefs: briefCount,
        bids: bidCount
      },
      latestUsers
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
