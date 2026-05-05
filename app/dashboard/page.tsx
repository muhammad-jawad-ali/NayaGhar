import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const role = session.user.role;

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "agent") {
    redirect("/dashboard/agent");
  } else {
    redirect("/dashboard/buyer");
  }
}
