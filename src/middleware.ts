import { type NextRequest, NextResponse } from 'next/server'
import { importSPKI, jwtVerify } from 'jose'
import { MissingEnvVariableError } from './lib/errors/MissingEnvVariableError'

const authPaths = ['/login', '/signup']
const protectedAPI = ['/api/products']

const UnauthorizedResponse = NextResponse.json(
  { error: { message: 'unauthorized' } },
  { status: 401 }
)

/**
 * Check if a given `url` starts with one of the paths in the `paths` list.
 */
function urlStartsWithSome(url: string, paths: string[]) {
  return paths.some((path) => url.startsWith(path))
}

function redirectIfNeeded(request: NextRequest, to: string) {
  // already in the to path
  if (request.nextUrl.pathname.startsWith(to)) {
    return
  }

  return NextResponse.redirect(new URL(to, request.url))
}

function isAPIRoute(request: NextRequest) {
  return request.nextUrl.pathname.startsWith('/api')
}

async function middlewareForAuthSession(
  request: NextRequest,
  authSession: string
) {
  try {
    if (!process.env.JWT_PUB_KEY) {
      throw new MissingEnvVariableError('JWT_PUB_KEY')
    }

    if (!process.env.RSA_ALG) {
      throw new MissingEnvVariableError('RSA_ALG')
    }

    const alg = process.env.RSA_ALG
    const pubKey = await importSPKI(process.env.JWT_PUB_KEY, alg)

    await jwtVerify(authSession, pubKey)

    if (
      !isAPIRoute(request) &&
      urlStartsWithSome(request.nextUrl.pathname, authPaths)
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    let retError = 'The session token is invalid'

    if (error instanceof MissingEnvVariableError) {
      retError = error.message
    }

    console.error(retError)

    if (urlStartsWithSome(request.nextUrl.pathname, protectedAPI)) {
      return UnauthorizedResponse
    }

    if (
      !isAPIRoute(request) &&
      !urlStartsWithSome(request.nextUrl.pathname, authPaths)
    ) {
      return redirectIfNeeded(request, '/login')
    }
  }
}

export async function middleware(request: NextRequest) {
  const authSession = request.cookies.get('auth-session')

  // There is an auth session, must validate the token
  if (authSession) {
    return middlewareForAuthSession(request, authSession.value)
  }

  // protected API path
  if (urlStartsWithSome(request.nextUrl.pathname, protectedAPI)) {
    //return NextResponse.redirect(new URL('/api/unauthorized', request.url))
    return UnauthorizedResponse
  }

  // Will not redirect if the next url is an Auth route
  if (urlStartsWithSome(request.nextUrl.pathname, authPaths)) {
    return
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
