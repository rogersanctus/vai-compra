import { Product } from '@/models/product'
import { fetchOnApi } from '../externalApi'

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

export async function getAllProducts() {
  const response = await fetchOnApi('/products')

  if (!response.ok) {
    throw new Error('Could not fetch the Products from the api')
  }

  const products = await response.json()

  return products as Product[]
}

export async function searchProduct(
  search: string,
  mustIncludeAllTerms: boolean = false
) {
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

  const pureResult = result as Omit<
    typeof result,
    'ponctuation' | 'termsFound'
  > & { ponctuation?: number; termsFound?: number }

  delete pureResult.ponctuation
  delete pureResult.termsFound

  return pureResult.filter((product) => product.ponctuation > 0) as Product[]
}
