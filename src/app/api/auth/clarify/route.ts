import { MissingEnvVariableError } from '@/lib/errors/MissingEnvVariableError'
import { prismaClient } from '@/lib/prisma'
import { importSPKI, jwtVerify } from 'jose'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authSession = request.cookies.get('auth-session')

    if (!authSession) {
      throw new Error('Auth session is missing')
    }

    if (!process.env.JWT_PUB_KEY) {
      throw new MissingEnvVariableError('JWT_PUB_KEY')
    }

    if (!process.env.RSA_ALG) {
      throw new MissingEnvVariableError('RSA_ALG')
    }

    const pkey = await importSPKI(process.env.JWT_PUB_KEY, process.env.RSA_ALG)

    const { payload } = await jwtVerify(authSession.value, pkey)

    const user = await prismaClient.user.findUnique({
      where: {
        id: payload.id as number
      },
      select: {
        name: true,
        email: true
      }
    })

    if (user) {
      return NextResponse.json(user, { status: 200 })
    }

    return NextResponse.json({ error: 'user_not_found' }, { status: 403 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'user_not_authenticated' },
      { status: 403 }
    )
  }
}
