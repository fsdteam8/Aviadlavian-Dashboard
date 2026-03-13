import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/about",
  "/contact",
  "/pricing",
  "/terms",
  "/privacy",
];

const adminRoutes = [
  "/admin",
  "/admin/dashboard",
  "/admin/users",
  "/admin/settings",
];

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const userRole = (token?.role as string)?.toUpperCase();
  const isAdmin = userRole === "ADMIN";
  const isAuthenticated = !!token;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = pathname.startsWith("/auth/");

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a non-public route
  if (!isAuthenticated && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/sign-in?callbackUrl=${callbackUrl}`, request.url),
    );
  }

  // If authenticated user is not admin, block all non-auth routes
  if (isAuthenticated && !isAdmin && !isAuthRoute) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=forbidden-role", request.url),
    );
  }

  // If user is authenticated but trying to access auth routes (login/signup etc)
  if (isAuthenticated && isAdmin && isPublicRoute && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not admin and trying to access admin routes
  if (!isAdmin && isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
