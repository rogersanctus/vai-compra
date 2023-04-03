import { NextRequest, NextResponse } from 'next/server'
import { fetchOnApi } from '../../externalApi'
import { Product } from '@/models/product'

/*
 * The weights are empirical and were choosen
 * to benefit matchings with the product title.
 */
function calcPonctuationOrder(searching: string[], target: string) {
  let lastIndex = -1
  let ponctuation = 0
  let terms = 0

  for (const term of searching) {
    const matchIndex = target.toLowerCase().indexOf(term)

    if (matchIndex !== -1) {
      // The next found term was found in ascending order in the target text
      if (lastIndex !== -1 && matchIndex > lastIndex) {
        ponctuation += 10
      } else {
        ponctuation++
      }
      lastIndex = matchIndex
      terms++
    }
  }

  return { ponctuation, terms }
}

async function searchProduct(
  search: string,
  mustIncludeAllTerms: boolean = false
) {
  try {
    const products = await getAllProducts()
    const keywords = search
      .split(/[\s_\-,;\.\(\)]+/g)
      .filter((result) => result.length > 0)
      .map((term) => term.toLowerCase())

    const productPonctuations = products
      .map((product) => {
        const { ponctuation: titlePonctuation, terms: titleTerms } =
          calcPonctuationOrder(keywords, product.title)
        const { ponctuation: descPonctuation, terms: descTerms } =
          calcPonctuationOrder(keywords, product.description)

        return {
          ...product,
          ponctuation:
            titleTerms * 0.5 +
            titlePonctuation +
            (descTerms * 0.2 + descPonctuation * 0.1),
          termsFound: titleTerms > descTerms ? titleTerms : descTerms
        }
      })
      .sort((pa, pb) => pb.ponctuation - pa.ponctuation)

    let result = productPonctuations

    if (mustIncludeAllTerms) {
      const withAllTerms = productPonctuations.filter(
        (product) => product.termsFound === keywords.length
      )

      result = withAllTerms
    }

    return NextResponse.json(
      result.filter((product) => product.ponctuation > 0)
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error, { status: 500 })
    }

    return new NextResponse('Unknown error: ' + JSON.stringify(error), {
      status: 500
    })
  }
}

async function getAllProducts() {
  const response = await fetchOnApi('/products')

  if (!response.ok) {
    throw new Error('Could not fetch the Products from the api')
  }

  const products = await response.json()

  return products as Product[]
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const search = url.searchParams.get('search')
  const mustHaveAllTerms =
    (url.searchParams.get('all-terms') ?? false) === 'true'

  if (search) {
    return searchProduct(search, mustHaveAllTerms)
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
