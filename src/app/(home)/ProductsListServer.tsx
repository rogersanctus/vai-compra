import { Product, ProductWithFavourite } from '@/models/product'
import { ProductsList } from './ProducstList'
import { getAllProducts } from '@/lib/services/products'
import { cookies } from 'next/headers'
import { mapProductsWithFavourites } from './favourites'

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
  let localProducts: ProductWithFavourite[] = []

  if (products) {
    localProducts = products
  } else {
    const cookiesList = cookies()

    try {
      localProducts = await mapProductsWithFavourites(
        cookiesList,
        fetchProducts
      )
    } catch (error) {
      console.info(error)
    }
  }

  return <ProductsList products={localProducts} category={category} />
} as unknown as (props: ProductListProps) => JSX.Element
