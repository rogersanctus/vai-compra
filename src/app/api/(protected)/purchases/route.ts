import { getAuthUserId } from '@/lib/services/auth'
import { createPurchase, getPurchases } from '@/lib/services/purchases'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookiesList = cookies()
    const userId = await getAuthUserId(cookiesList)
    const purchases = await getPurchases(userId)

    return NextResponse.json(purchases)
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function POST() {
  try {
    const cookiesList = cookies()
    const userId = await getAuthUserId(cookiesList)

    await createPurchase(userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: error }, { status: 500 })
  }
}
