import { type NextRequest, NextResponse } from "next/server";
import { refreshSession } from "@/lib/supabase/middleware";

/**
 * Middleware to refresh Supabase session, protect routes, and capture
 * referral arrivals (?r=CODE or ?ref=CODE) into a 30-day cookie so the
 * referred friend gets 20% off automatically at checkout.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await refreshSession(request);

  // --- Capture referral code from landing URL ---
  const incomingRef =
    request.nextUrl.searchParams.get("r") ||
    request.nextUrl.searchParams.get("ref");
  if (incomingRef && !request.cookies.get("ref_code")?.value) {
    response.cookies.set("ref_code", incomingRef.toUpperCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
  }

  const isAuthRoute = request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup" ||
    request.nextUrl.pathname === "/auth/callback";

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Return the response with refreshed session
  return response;
}

/**
 * Configuration for which routes should run through middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
