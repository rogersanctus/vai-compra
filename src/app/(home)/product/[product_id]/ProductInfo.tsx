import { formatPrice } from '@/lib/number'
import { Product } from '@/models/product'
import Image from 'next/image'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const price = formatPrice(product.price)

  return (
    <div className="flex flex-col flex-grow p-2">
      <div className="flex-grow relative">
        <Image
          src={product.image}
          alt={`${product.image} photo`}
          fill
          className="object-contain"
        />
      </div>
      <div className="text-center mt-4">
        <span className="text-2xl text-lime-600 drop-shadow-sm font-bold">
          {price}
        </span>
      </div>
      <div className="text-center line-clamp-2">
        <a href={`/product/${product.id}`}>
          <span className="text-sky-700 font-semibold hover:drop-shadow-sm hover:text-sky-600">
            {product.title}
          </span>
        </a>
      </div>
    </div>
  )
}
