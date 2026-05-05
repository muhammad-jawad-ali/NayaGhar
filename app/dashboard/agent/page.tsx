import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBidsCollection, getBriefsCollection } from "@/lib/db";
import AgentDashboardClient from "./AgentDashboardClient";

export default async function AgentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if ((session.user as any).role !== "agent") {
    redirect("/");
  }

  const bidsCollection = await getBidsCollection();
  const briefsCollection = await getBriefsCollection();

  const [bids, hotLeads] = await Promise.all([
    bidsCollection
      .find({ agentId: (session.user as any).id })
      .sort({ createdAt: -1 })
      .toArray(),
    briefsCollection
      .find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()
  ]);

  const { getNotifications } = await import("@/lib/notifications");
  const notifications = await getNotifications((session.user as any).id);

  return (
    <AgentDashboardClient 
      initialBids={JSON.parse(JSON.stringify(bids))} 
      initialBriefs={JSON.parse(JSON.stringify(hotLeads))} 
      initialNotifications={JSON.parse(JSON.stringify(notifications))}
    />
  );
}
