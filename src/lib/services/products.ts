import { Product } from '@/models/product'
import { fetchOnApi } from '../externalApi'
import { readdir } from 'fs/promises'
import { join } from 'path'

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

export async function getProduct(productId: number) {
  const response = await fetchOnApi(`/products/${productId}`)

  if (!response.ok) {
    throw new Error('Could not fetch the Products from the api')
  }

  return await response.json()
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

export async function getCategories() {
  const response = await fetchOnApi('/products/categories')

  if (!response.ok) {
    throw new Error('Could not fetch the product Categories from the api')
  }

  const categories = await response.json()

  return ['all', ...categories]
}

export async function getProductsByCategory(name?: string) {
  if (!name) {
    throw new Error('The name argument is required')
  }
  const response = await fetchOnApi('/products/category/' + encodeURI(name))

  if (!response.ok) {
    throw new Error('Could not fetch the products of category from the api')
  }

  const products = await response.json()
  return products as Product[]
}

export async function getProductImages(product: Product) {
  const category = product.category

  const imagesURL: string[] = []

  const files = await readdir(join(process.cwd(), 'public/random-images'), {
    withFileTypes: true
  })

  for (const file of files) {
    if (!file.isDirectory() && file.name.startsWith(category)) {
      imagesURL.push('random-images/' + file.name)
    }
  }

  return imagesURL
}
