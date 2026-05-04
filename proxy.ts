import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // RBAC Logic
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard/buyer") && token?.role !== "buyer") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard/agent") && token?.role !== "agent") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/briefs/new",
    "/bids/:path*",
  ],
};
