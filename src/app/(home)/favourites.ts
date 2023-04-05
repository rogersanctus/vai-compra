import { productsMapper } from '@/lib/productsHelper'
import { getAuthUserId } from '@/lib/services/auth'
import { getFavourites } from '@/lib/services/favourites'
import { Favourite } from '@/models/favourite'
import { Product } from '@/models/product'
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { ReadonlyRequestCookies } from 'next/dist/server/app-render'

// This fetch must always return a list. Do not rethrow anything
export async function fetchFavourites(
  cookies: RequestCookies | ReadonlyRequestCookies
): Promise<Favourite[]> {
  try {
    const userId = await getAuthUserId(cookies)
    return await getFavourites(userId)
  } catch (error) {
    console.info(error)
    return []
  }
}

type ProductFetcher<T> = (arg: T | undefined) => Promise<Product[]>

export async function mapProductsWithFavourites<T>(
  cookies: RequestCookies | ReadonlyRequestCookies,
  productsFetcher: ProductFetcher<T>,
  fetcherParams?: T
) {
  const [favourites, products] = await Promise.all([
    fetchFavourites(cookies),
    productsFetcher(fetcherParams)
  ])

  if (Array.isArray(favourites) && Array.isArray(products)) {
    return productsMapper(products, favourites)
  }

  return []
}
