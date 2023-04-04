import { getProduct, getProductImages } from '@/lib/services/products'
import { GetServerSidePropsContext } from 'next'
import { NextRequest, NextResponse } from 'next/server'

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

    const product = await getProduct(productId)
    const images = await getProductImages(product)
    return NextResponse.json(images)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error, { status: 400 })
    }

    return new NextResponse('Unknown error: ' + JSON.stringify(error), {
      status: 500
    })
  }
}
