import { fetchOnApi } from '@/lib/externalApi'
import { NextRequest, NextResponse } from 'next/server'
import { getProductsByCategory } from './getProductsByCategory'

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
    const response = await fetchOnApi('/products/categories')

    if (!response.ok) {
      throw new Error('Could not fetch the product Categories from the api')
    }

    const categories = await response.json()

    return NextResponse.json(['all', ...categories])
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return NextResponse.json(error, { status: 500 })
    }

    error = typeof error === 'object' ? error : { error: { message: error } }
    return NextResponse.json({ error }, { status: 500 })
  }
}
