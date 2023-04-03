import { fetchOnApi } from '@/app/api/externalApi'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetchOnApi('/products/categories')

    if (!response.ok) {
      throw new Error('Could not fetch the product Categories from the api')
    }

    const categories = (await response.json()) as string[]

    return NextResponse.json(['all', ...categories])
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error, { status: 500 })
    }

    return new NextResponse('Unknown error: ' + JSON.stringify(error), {
      status: 500
    })
  }
}
