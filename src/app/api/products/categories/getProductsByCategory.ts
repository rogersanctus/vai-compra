import { fetchOnApi } from '@/lib/externalApi'
import { Product } from '@/models/product'

export async function getProductsByCategory(name: string) {
  const response = await fetchOnApi('/products/category/' + encodeURI(name))

  if (!response.ok) {
    throw new Error('Could not fetch the products of category from the api')
  }

  const products = await response.json()
  return products as Product[]
}
