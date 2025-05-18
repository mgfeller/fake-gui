import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')
  const userInfo = request.cookies.get('user_info')
  const isAuthCallback = request.nextUrl.pathname === '/auth/callback'

  // Allow access to auth callback route
  if (isAuthCallback) {
    return NextResponse.next()
  }

  // Add authentication status to response headers
  const response = NextResponse.next()
  response.headers.set('x-auth-status', accessToken ? 'authenticated' : 'unauthenticated')
  
  if (userInfo) {
    response.headers.set('x-user-info', userInfo.value)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 