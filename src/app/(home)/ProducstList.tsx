import { Product } from '@/models/product'
import { localFetch } from '../localApi'
import { ProductItem } from './ProductItem'

interface ProductListProps {
  category?: string
  products?: Product[]
}

export const ProductsList = async function ({
  category,
  products
}: ProductListProps) {
  let localProducts: Product[] = []

  if (products) {
    localProducts = products
  } else {
    try {
      const response = await localFetch('/api/products')

      if (!response.ok) {
        throw new Error('Could not get products list')
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        localProducts = data
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
