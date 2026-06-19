import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/command-center", "/analytics", "/settings", "/profile"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // If the user tries to access a protected route without a token, redirect to signin
  if (isProtected && !token) {
    const signInUrl = new URL("/signin", request.url);
    // Optional: add a ?redirect= parameter here if you want to redirect back after login
    return NextResponse.redirect(signInUrl);
  }

  // If the user is logged in and tries to access signin/signup, redirect to dashboard
  if ((pathname.startsWith("/signin") || pathname.startsWith("/signup")) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/command-center/:path*", 
    "/analytics/:path*", 
    "/settings/:path*", 
    "/profile/:path*",
    "/signin",
    "/signup"
  ],
};
