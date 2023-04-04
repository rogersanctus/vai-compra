import { Product, ProductWithFavourite } from '@/models/product'
import { Favourite } from '@/models/favourite'
import { productsMapper } from '@/lib/productsHelper'
import { ProductsList } from './ProducstList'
import { getFavourites } from '@/lib/services/favourites'
import { getAllProducts } from '@/lib/services/products'
import { cookies } from 'next/headers'
import { getAuthUserId } from '@/lib/services/auth'
import { ReadonlyRequestCookies } from 'next/dist/server/app-render'
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'

interface ProductListProps {
  category?: string
  products?: Product[]
}

// This fetch must always return a list. Do not rethrow anything
async function fetchFavourites(
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

async function fetchProducts(): Promise<Product[]> {
  return await getAllProducts()
}

export const ProductsListServer = async function ({
  category,
  products
}: ProductListProps) {
  let localProducts: ProductWithFavourite[] = []

  if (products) {
    localProducts = products
  } else {
    const cookiesList = cookies()

    try {
      const [favourites, products] = await Promise.all([
        fetchFavourites(cookiesList),
        fetchProducts()
      ])

      if (Array.isArray(favourites) && Array.isArray(products)) {
        localProducts = productsMapper(products, favourites)
      }
    } catch (error) {
      console.info(error)
    }
  }

  return <ProductsList products={localProducts} category={category} />
} as unknown as (props: ProductListProps) => JSX.Element
