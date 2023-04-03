'use client'

import { Button } from '@/components/Button'
import { Product } from '@/models/product'
import Image from 'next/image'

interface ProductProps {
  product: Product
}
export function ProductItem({ product }: ProductProps) {
  const formatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'BRL'
  })

  const price = formatter.format(product.price)
  return (
    <li className="cursor-pointer flex flex-col rounded shadow-lg border border-gray-200 p-4 h-[430px] justify-stretch">
      <div className="flex-grow relative overflow-hidden">
        <Image
          src={product.image}
          alt={`${product.title} photo`}
          className="object-contain mix-blend-multiply"
          fill
        />
      </div>
      <div className="flex cursor-pointer h-12 overflow-hidden my-3">
        <span
          className="w-full text-lg leading-tight font-semibold text-center line-clamp-2"
          title={product.title}
        >
          {product.title}
        </span>
      </div>
      <div className="flex justify-center mt-4">
        <span className="text-2xl font-bold text-lime-600 drop-shadow-sm">
          {price}
        </span>
      </div>
      <div className="mt-4">
        <Button className="w-full" variant="warning">
          Comprar
        </Button>
      </div>
    </li>
  )
}
