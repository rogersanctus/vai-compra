import { NextRequest, NextResponse } from 'next/server'
import { checkToken } from './lib/checkToken'
import { InvalidTokenError } from './lib/errors/InvalidTokenError'

const AuthSessionKey = 'auth-session'
const authPaths = ['/login', '/signup']
const protectedAPI = ['/api/carts', '/api/purchases', '/api/users']

function sessionResponse(response: NextResponse, isInvalidToken: boolean) {
  if (isInvalidToken) {
    response.cookies.delete(AuthSessionKey)
  }

  return response
}

const UnauthorizedResponse = (isInvalidToken: boolean = false) => {
  const res = NextResponse.json(
    { error: { message: 'unauthorized' } },
    { status: 401 }
  )

  return sessionResponse(res, isInvalidToken)
}

/**
 * Check if a given `url` starts with one of the paths in the `paths` list.
 */
function urlStartsWithSome(url: string, paths: string[]) {
  return paths.some((path) => url.startsWith(path))
}

function redirectIfNeeded(
  request: NextRequest,
  to: string,
  isInvalidToken: boolean = false
) {
  // already in the to path
  if (request.nextUrl.pathname.startsWith(to)) {
    return
  }

  const res = NextResponse.redirect(new URL(to, request.url))

  return sessionResponse(res, isInvalidToken)
}

function isAPIRoute(request: NextRequest) {
  return request.nextUrl.pathname.startsWith('/api')
}

async function middlewareForAuthSession(
  request: NextRequest,
  authSession: string
) {
  try {
    await checkToken(authSession)

    if (
      !isAPIRoute(request) &&
      urlStartsWithSome(request.nextUrl.pathname, authPaths)
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    let isInvalidToken = error instanceof InvalidTokenError

    console.error(error)

    if (urlStartsWithSome(request.nextUrl.pathname, protectedAPI)) {
      return UnauthorizedResponse(isInvalidToken)
    }

    if (
      !isAPIRoute(request) &&
      !urlStartsWithSome(request.nextUrl.pathname, authPaths)
    ) {
      return redirectIfNeeded(request, '/login', isInvalidToken)
    }

    const res = NextResponse.next()

    return sessionResponse(res, isInvalidToken)
  }
}

export async function middleware(request: NextRequest) {
  const authSession = request.cookies.get(AuthSessionKey)

  // There is an auth session, must validate the token
  if (authSession) {
    return middlewareForAuthSession(request, authSession.value)
  }

  // protected API path
  if (urlStartsWithSome(request.nextUrl.pathname, protectedAPI)) {
    return UnauthorizedResponse()
  }

  // Will not redirect if the next url is an Auth route
  if (urlStartsWithSome(request.nextUrl.pathname, authPaths)) {
    return NextResponse.next()
  }

  // No auth session and going to a not allowed route, redirect to login
  if (!isAPIRoute(request)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/cart/:path*', '/login/:path*', '/signup/:path*', '/api/:path*']
}
