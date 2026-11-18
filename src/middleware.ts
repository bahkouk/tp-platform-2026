// Middleware for route protection
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes
const protectedRoutes = ['/dashboard', '/profile', '/documents'];
const adminRoutes = ['/admin', '/admin/dashboard', '/admin/upload'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for session token
  const sessionToken = request.cookies.get('__session')?.value;

  // Protect routes
  const requiresAuth = [...protectedRoutes, ...adminRoutes].some(route =>
    pathname.startsWith(route)
  );

  if (requiresAuth && !sessionToken) {
    const signInUrl = new URL('/login', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};