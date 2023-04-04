import { prismaClient } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession } from '@/lib/checkToken'

const resultSelect = {
  product_external_id: true,
  is_favourite: true
}

export async function GET(request: NextRequest) {
  try {
    const authSession = request.cookies.get('auth-session')
    const user_id = await getUserIdFromSession(authSession?.value)

    const userProducts = await prismaClient.productUser.findMany({
      where: {
        user_id
      },
      select: resultSelect
    })

    return NextResponse.json(userProducts)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authSession = request.cookies.get('auth-session')
    const user_id = await getUserIdFromSession(authSession?.value)
    const params: { product_id: number; is_favourite: boolean } =
      await request.json()

    const existingProductUser = await prismaClient.productUser.findFirst({
      where: {
        product_external_id: params.product_id,
        user_id
      }
    })

    if (existingProductUser) {
      const result = await prismaClient.productUser.update({
        data: {
          is_favourite: params.is_favourite
        },
        where: {
          id: existingProductUser.id
        },
        select: resultSelect
      })

      return NextResponse.json(result)
    }

    const productUser = await prismaClient.productUser.create({
      data: {
        is_favourite: params.is_favourite,
        user_id,
        product_external_id: params.product_id
      },
      select: resultSelect
    })

    return NextResponse.json(productUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
