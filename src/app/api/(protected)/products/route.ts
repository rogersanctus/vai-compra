import { NextRequest, NextResponse } from 'next/server'
import { fetchOnApi } from '../../externalApi'

export async function GET(request: NextRequest) {
  try {
    const response = await fetchOnApi('/products')

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
