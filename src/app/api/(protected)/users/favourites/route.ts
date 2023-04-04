import { NextRequest, NextResponse } from 'next/server'
import { getFavourites, updateFavourite } from '@/lib/services/favourites'
import { getAuthUserId } from '@/lib/services/auth'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request.cookies)
    const userProducts = await getFavourites(userId)
    return NextResponse.json(userProducts)
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request.cookies)
    const params = await request.json()

    const productUser = await updateFavourite(userId, params)

    return NextResponse.json(productUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
