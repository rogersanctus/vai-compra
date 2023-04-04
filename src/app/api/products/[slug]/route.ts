import { NextRequest, NextResponse } from 'next/server'

import { GetServerSidePropsContext } from 'next'
import { getProduct } from '@/lib/services/products'

export async function GET(
  _: NextRequest,
  { params }: GetServerSidePropsContext<{ slug: string }>
) {
  const productIdParam = params?.slug

  try {
    if (!productIdParam) {
      throw new Error('missing_product_id')
    }

    const productId = Number(productIdParam)

    if (isNaN(productId)) {
      throw new Error('wrong_product_id_type')
    }

    const products = getProduct(productId)

    return NextResponse.json(products)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error, { status: 400 })
    }

    return new NextResponse('Unknown error: ' + JSON.stringify(error), {
      status: 500
    })
  }
}
