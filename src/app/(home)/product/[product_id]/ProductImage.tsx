import Image from 'next/image'
import { Product } from '@/models/product'

interface ProductImageProps {
  product: Product
}

export function ProductImage({ product }: ProductImageProps) {
  return (
    <div className="relative w-[500px] h-auto min-h-[500px]">
      <Image
        src={product.image}
        fill
        alt={`${product.title} photo`}
        className="object-contain"
      />
    </div>
  )
}
