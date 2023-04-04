import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, searchProduct } from '@/lib/services/products'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')
  const mustHaveAllTerms =
    (url.searchParams.get('all-terms') ?? false) === 'true'

  if (search) {
    try {
      const result = await searchProduct(search, mustHaveAllTerms)
      return NextResponse.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(error, { status: 500 })
      }

      return new NextResponse('Unknown error: ' + JSON.stringify(error), {
        status: 500
      })
    }
  }

  try {
    const products = await getAllProducts()
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
