import { Product, ProductWithFavourite } from '@/models/product'
import { localFetch } from '../localApi'
import { Favourite } from '@/models/favourite'
import { productsMapper } from '@/lib/productsHelper'
import { ProductsList } from './ProducstList'

interface ProductListProps {
  category?: string
  products?: Product[]
}

// This fetch must always return a list. Do not rethrow anything
async function fetchFavourites(): Promise<Favourite[]> {
  try {
    const response = await localFetch('/api/users/favourites')

    if (!response.ok) {
      throw new Error('Could not get the favourites list')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

async function fetchProducts(): Promise<Product[]> {
  const response = await localFetch('/api/products')

  if (!response.ok) {
    throw new Error('Could not get products list')
  }

  return await response.json()
}

export const ProductsListServer = async function ({
  category,
  products
}: ProductListProps) {
  let localProducts: ProductWithFavourite[] = []

  if (products) {
    localProducts = products
  } else {
    try {
      const [favourites, products] = await Promise.all([
        fetchFavourites(),
        fetchProducts()
      ])

      if (Array.isArray(favourites) && Array.isArray(products)) {
        localProducts = productsMapper(products, favourites)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return <ProductsList products={localProducts} category={category} />
} as unknown as (props: ProductListProps) => JSX.Element
