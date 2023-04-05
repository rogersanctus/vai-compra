import { getAuthUserId } from '@/lib/services/auth'
import { getCart } from '@/lib/services/cart'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request.cookies)
    const cartProducts = await getCart(userId)

    return NextResponse.json(cartProducts)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
