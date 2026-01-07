import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Define route patterns
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/explorar") ||
    pathname.startsWith("/experiencias/") ||
    pathname.startsWith("/como-funciona") ||
    pathname.startsWith("/para-guias") ||
    pathname.startsWith("/ayuda") ||
    pathname.startsWith("/terminos") ||
    pathname.startsWith("/privacidad") ||
    pathname.startsWith("/auth");

  const isAuthRoute = pathname.startsWith("/auth");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/reservas") ||
    pathname.startsWith("/favoritos") ||
    pathname.startsWith("/mensajes");

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect non-logged-in users to login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check user status for protected routes
  if (isProtectedRoute && isLoggedIn && req.auth?.user) {
    const userStatus = req.auth.user.status;

    if (userStatus === "SUSPENDED") {
      return NextResponse.redirect(new URL("/auth/error?error=AccountSuspended", req.url));
    }

    if (userStatus === "DELETED") {
      return NextResponse.redirect(new URL("/auth/error?error=AccountDeleted", req.url));
    }
  }

  return NextResponse.next();
});

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - except auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
};
