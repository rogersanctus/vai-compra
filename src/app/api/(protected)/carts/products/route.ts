import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserId } from '@/lib/services/auth'
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartProduct
} from '@/lib/services/cart'

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

export async function PUT(request: NextRequest) {
  try {
    const product = await request.json()
    const userId = await getAuthUserId(request.cookies)
    const cartProducts = await updateCartProduct(userId, product)

    return NextResponse.json(cartProducts)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()
    const userId = await getAuthUserId(request.cookies)
    const cartProducts = await addToCart(userId, product)

    return NextResponse.json(cartProducts)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const product = await request.json()
    const userId = await getAuthUserId(request.cookies)
    const cartProducts = await removeFromCart(userId, product)

    return NextResponse.json(cartProducts)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
