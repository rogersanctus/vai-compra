import { NextRequest, NextResponse } from 'next/server'

import { GetServerSidePropsContext } from 'next'
import { fetchOnApi } from '@/app/api/externalApi'

export async function GET(
  request: NextRequest,
  { params }: GetServerSidePropsContext<{ slug: string }>
) {
  const productId = params?.slug

  if (!productId) {
    return NextResponse.json(
      { error: { message: 'missing_product_id' } },
      { status: 400 }
    )
  }

  try {
    const response = await fetchOnApi(`/products/${productId}`)

    if (!response.ok) {
      throw new Error('Could not fetch the Products from the api')
    }

    const products = await response.json()

    return NextResponse.json(products)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error, { status: 500 })
    }

    return new NextResponse('Unknown error: ' + JSON.stringify(error), {
      status: 500
    })
  }
}
