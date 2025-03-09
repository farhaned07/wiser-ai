import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/(auth)/auth';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'experimental-edge',
};

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Get language preference from cookie or default to English
  const languagePreference = request.cookies.get('language-preference')?.value || 'english';

  // Clone the request headers to modify them
  const requestHeaders = new Headers(request.headers);
  
  // Add language preference to headers for server components
  requestHeaders.set('x-language-preference', languagePreference);

  // Add user information if authenticated
  if (session?.user) {
    requestHeaders.set('x-user-id', session.user.id);
    if (session.user.email) {
      requestHeaders.set('x-user-email', session.user.email);
    }
  }

  // Protect premium routes
  if (pathname.startsWith('/premium') && !session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Return the response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
