import { Product, ProductWithFavourite } from '@/models/product'
import { ProductsList } from './ProducstList'
import { getAllProducts } from '@/lib/services/products'
import { cookies } from 'next/headers'
import { mapProductsWithFavourites } from './favourites'
import { FetchingError } from './FetchingError'

interface ProductListProps {
  category?: string
  products?: Product[]
}

async function fetchProducts(): Promise<Product[]> {
  return await getAllProducts()
}

export const ProductsListServer = async function ({
  category,
  products
}: ProductListProps) {
  if (products) {
    return <ProductsList products={products} category={category} />
  } else {
    const cookiesList = cookies()

    try {
      const localProducts: ProductWithFavourite[] =
        await mapProductsWithFavourites(cookiesList, fetchProducts)

      return <ProductsList products={localProducts} category={category} />
    } catch (error) {
      console.info(error)
      return <FetchingError />
    }
  }
} as unknown as (props: ProductListProps) => JSX.Element
