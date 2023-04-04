import { checkToken } from '@/lib/checkToken'
import { prismaClient } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authSession = request.cookies.get('auth-session')

    if (!authSession) {
      throw new Error('Missing the auth-session cookie')
    }

    const { payload } = await checkToken(authSession?.value)

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
