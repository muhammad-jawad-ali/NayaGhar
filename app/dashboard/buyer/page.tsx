import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getBriefsCollection } from "@/lib/db";
import BuyerDashboardClient from "./BuyerDashboardClient";
import type { Brief } from "@/lib/types";

export default async function BuyerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if ((session.user as any).role !== "buyer") {
    redirect("/"); // Or an unauthorized page
  }

  const collection = await getBriefsCollection();
  const briefs = await collection
    .find({ buyerId: (session.user as any).id })
    .sort({ createdAt: -1 })
    .toArray();

  const { getNotifications } = await import("@/lib/notifications");
  const notifications = await getNotifications((session.user as any).id);

  // Convert MongoDB documents to plain objects for the client
  const plainBriefs = JSON.parse(JSON.stringify(briefs));
  const plainNotifications = JSON.parse(JSON.stringify(notifications));

  return <BuyerDashboardClient initialBriefs={plainBriefs} initialNotifications={plainNotifications} />;
}
