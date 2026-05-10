import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const briefs = await db.collection("briefs").find().sort({ createdAt: -1 }).toArray();

    // Generate CSV
    const headers = ["ID", "Title", "City", "Category", "Budget", "Buyer Name", "Status", "Created At"];
    const rows = briefs.map(b => [
      b._id.toString(),
      b.title,
      b.city,
      b.category,
      b.budget,
      b.buyerName,
      b.status,
      new Date(b.createdAt).toISOString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=nayaghar_leads_export_${new Date().toISOString().split('T')[0]}.csv`
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
