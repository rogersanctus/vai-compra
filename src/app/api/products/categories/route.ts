import { getCategories, getProductsByCategory } from '@/lib/services/products'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  if (name) {
    try {
      const products = await getProductsByCategory(name)

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

  try {
    const categories = await getCategories()

    return NextResponse.json(categories)
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return NextResponse.json(error, { status: 500 })
    }

    error = typeof error === 'object' ? error : { error: { message: error } }
    return NextResponse.json({ error }, { status: 500 })
  }
}
