import { Product } from '@/models/product'
import { localFetch } from '../localApi'
import { ProductItem } from './ProductItem'

export const ProductsList = async function () {
  let products: Product[] = []

  try {
    const response = await localFetch('/api/products')

    if (!response.ok) {
      throw new Error('Could not get products list')
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      products = data
    }
  } catch (error) {
    console.error(error)
  }

  return (
    <div className="flex flex-col px-20 pb-20">
      <span className="text-left text-2xl uppercase my-4">
        Todos os produtos
      </span>
      <ul className="grid grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </ul>
    </div>
  )
} as unknown as () => JSX.Element
