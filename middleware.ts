import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes protection
    if (path.startsWith("/dashboard/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Buyer routes protection
    if (path.startsWith("/dashboard/buyer") && token?.role !== "buyer") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (path.startsWith("/briefs/new") && token?.role !== "buyer") {
      return NextResponse.redirect(new URL("/marketplace", req.url));
    }

    // Agent routes protection
    if (path.startsWith("/dashboard/agent") && token?.role !== "agent") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (path.startsWith("/bids") && path.includes("/new") && token?.role !== "agent") {
      return NextResponse.redirect(new URL("/marketplace", req.url));
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
    "/dashboard/:path*",
    "/briefs/new",
    "/bids/:path*",
    "/profile/:path*",
  ],
};
