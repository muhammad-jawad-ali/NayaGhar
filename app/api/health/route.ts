import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    // Simple ping to verify connection
    await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      status: "ok", 
      message: "Database connection healthy",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Database connection failed" 
    }, { status: 500 });
  }
}
