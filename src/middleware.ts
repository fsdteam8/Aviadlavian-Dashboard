import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function will only execute if the user is logged in
    // and passes the `authorized` callback below.
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth/sign-in");

    if (isAuthPage) {
      if (isAuth && token.role === "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/auth/sign-in?from=${encodeURIComponent(from)}`, req.url),
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if token exists and role is admin
        return token?.role === "admin";
      },
    },
  },
);

export const config = {
  // Protect all routes except auth routes, api routes, and static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/.*).*)"],
};
