import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession } from '@/lib/checkToken'
import { getFavourites, updateFavourite } from '@/lib/services/favourites'

export async function GET(request: NextRequest) {
  try {
    const authSession = request.cookies.get('auth-session')
    const userId = await getUserIdFromSession(authSession?.value)
    const userProducts = await getFavourites(userId)
    return NextResponse.json(userProducts)
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authSession = request.cookies.get('auth-session')
    const userId = await getUserIdFromSession(authSession?.value)
    const params = await request.json()

    const productUser = await updateFavourite(userId, params)

    return NextResponse.json(productUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
