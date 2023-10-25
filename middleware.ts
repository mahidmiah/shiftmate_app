import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value || '';
  const isLoggedIn = token !== '';

  if (path.startsWith('/dashboard/') && !isLoggedIn) {
    // If the user is not logged in and trying to access a /dashboard path, redirect to /auth/login
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
  } else if (path.startsWith('/auth/') && isLoggedIn) {
    // If the user is logged in and trying to access an /auth path, redirect to /dashboard/home
    return NextResponse.redirect(new URL('/dashboard/home', request.nextUrl));
  }

  // For all other paths, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};
