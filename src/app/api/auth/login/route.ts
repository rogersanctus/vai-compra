import { NextResponse, NextRequest } from 'next/server'
import { ZodError, z } from 'zod'
import { doLogin } from '@/lib/services/auth'
import { sessionOptions } from '@/lib/session'
import { checkToken, signJWT } from '@/lib/checkToken'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const signupData = z.object({
      email: z.string().nonempty().email(),
      password: z.string().nonempty().min(4)
    })

    const parsed = signupData.parse(data)

    const loginResult = await doLogin(parsed.email, parsed.password)

    if ('id' in loginResult) {
      const token = await signJWT(loginResult)
      const res = NextResponse.json({ loggedIn: true }, { status: 200 })
      res.cookies.set('auth-session', token, sessionOptions)

      return res
    }

    return NextResponse.json({ error: loginResult.error }, { status: 403 })
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return NextResponse.json({ error }, { status: 400 })
    }

    const theError = error as Error

    return NextResponse.json(
      {
        error: {
          message: theError.message ? theError.message : 'unknown error'
        }
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authSession = request.cookies.get('auth-session')

    await checkToken(authSession?.value)

    const res = new NextResponse(null, { status: 204 })
    res.cookies.delete('auth-session')

    return res
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'user_not_authenticated' },
      { status: 403 }
    )
  }
}
