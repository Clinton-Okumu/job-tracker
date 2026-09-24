import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isSignInPage = pathname.startsWith("/sign-in");
  const isSignUpPage = pathname.startsWith("/sign-up");

  if (isSignInPage || isSignUpPage) {
    try {
      const { getSession } = await import("./lib/auth/auth");
      const session = await getSession();
      if (session?.user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // Allow through if auth check fails in middleware
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
