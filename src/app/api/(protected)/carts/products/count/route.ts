import { getAuthUserId } from '@/lib/services/auth'
import { getCartProductsCount } from '@/lib/services/cart'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookiesList = cookies()
    const userId = await getAuthUserId(cookiesList)
    const count = await getCartProductsCount(userId)

    return NextResponse.json({ count })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error
      },
      {
        status: 500
      }
    )
  }
}
