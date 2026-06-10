import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect portal routes
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = (req.auth?.user as any)?.role;

    // Role-based routing
    if (pathname.startsWith("/portal/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }
    if (pathname.startsWith("/portal/procurement") && role !== "PROCUREMENT_OFFICER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }
    if (pathname.startsWith("/portal/manager") && role !== "MANAGER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }
    if (pathname.startsWith("/portal/vendor") && role !== "VENDOR") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }
  }

  // Redirect authenticated users away from login
  if (pathname === "/login" && isLoggedIn) {
    const role = (req.auth?.user as any)?.role;
    if (role === "ADMIN") return NextResponse.redirect(new URL("/portal/admin/dashboard", req.url));
    if (role === "PROCUREMENT_OFFICER") return NextResponse.redirect(new URL("/portal/procurement/dashboard", req.url));
    if (role === "MANAGER") return NextResponse.redirect(new URL("/portal/manager/dashboard", req.url));
    if (role === "VENDOR") return NextResponse.redirect(new URL("/portal/vendor/dashboard", req.url));
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  // Auto redirect from /portal to respective dashboard
  if (pathname === "/portal" && isLoggedIn) {
    const role = (req.auth?.user as any)?.role;
    if (role === "ADMIN") return NextResponse.redirect(new URL("/portal/admin/dashboard", req.url));
    if (role === "PROCUREMENT_OFFICER") return NextResponse.redirect(new URL("/portal/procurement/dashboard", req.url));
    if (role === "MANAGER") return NextResponse.redirect(new URL("/portal/manager/dashboard", req.url));
    if (role === "VENDOR") return NextResponse.redirect(new URL("/portal/vendor/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
