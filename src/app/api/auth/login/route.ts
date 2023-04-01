import { NextResponse, type NextRequest } from 'next/server'
import { ZodError, z } from 'zod'
import { doLogin } from '../service'
import { sessionOptions } from '@/lib/session'
import { importPKCS8, SignJWT } from 'jose'
import { MissingEnvVariableError } from '@/lib/MissingEnvVariableError'

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
      if (!process.env.JWT_PRIV_KEY) {
        throw new MissingEnvVariableError('JWT_PRIV_KEY')
      }

      if (!process.env.RSA_ALG) {
        throw new MissingEnvVariableError('RSA_ALG')
      }

      const alg = process.env.RSA_ALG
      const privKeyEncoded = process.env.JWT_PRIV_KEY
      const privKey = await importPKCS8(privKeyEncoded, alg)
      const token = await new SignJWT(loginResult)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXP_TIME ?? '24h')
        .setIssuer('vai-compra')
        .setAudience('vai-compra')
        .sign(privKey)

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
