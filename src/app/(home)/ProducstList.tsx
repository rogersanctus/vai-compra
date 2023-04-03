import { Product, ProductWithFavourite } from '@/models/product'
import { localFetch } from '../localApi'
import { ProductItem } from './ProductItem'
import { Favourite } from '@/models/favourite'
import { productsMapper } from '@/lib/productsHelper'

interface ProductListProps {
  category?: string
  products?: Product[]
}

async function fetchFavourites(): Promise<Favourite[]> {
  const response = await localFetch('/api/users/favourites')

  if (!response.ok) {
    throw new Error('Could not get the favourites list')
  }

  return await response.json()
}

async function fetchProducts(): Promise<Product[]> {
  const response = await localFetch('/api/products')

  if (!response.ok) {
    throw new Error('Could not get products list')
  }

  return await response.json()
}

export const ProductsList = async function ({
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

  return (
    <div className="flex flex-col px-20 pb-20">
      <span className="text-left text-2xl uppercase my-4">
        {category ? category : 'Todos os produtos'}
      </span>
      <ul className="grid grid-cols-4 gap-5">
        {localProducts.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </ul>
    </div>
  )
} as unknown as (props: ProductListProps) => JSX.Element
