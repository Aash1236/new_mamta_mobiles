import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define protected routes (Any path starting with /admin)
  const isProtectedRoute = path.startsWith("/admin");
  
  // 2. Define public routes inside admin (The login page itself)
  const isPublicAdminRoute = path === "/admin/login";

  // 3. Check for the cookie
  const cookie = request.cookies.get("admin_token");

  // 4. Redirect Logic
  // If trying to access a protected admin route without a cookie -> Go to Login
  if (isProtectedRoute && !isPublicAdminRoute && !cookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // If already logged in and trying to access login page -> Go to Dashboard
  if (isPublicAdminRoute && cookie) {
    return NextResponse.redirect(new URL("/admin/orders", request.url));
  }

  return NextResponse.next();
}

// Only run middleware on admin routes to save performance
export const config = {
  matcher: "/admin/:path*",
};