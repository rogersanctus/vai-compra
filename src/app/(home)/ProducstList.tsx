'use client'

import { ProductWithFavourite } from '@/models/product'
import { ProductItem } from './ProductItem'
import { useEffect } from 'react'
import { actions } from '@/stores/actions'
import { useAppSelector } from '@/stores'

interface ProductListProps {
  category?: string
  products: ProductWithFavourite[]
}

const { productsAction } = actions

export function ProductsList({ category, products }: ProductListProps) {
  const localProducts = useAppSelector((state) => state.products.products)

  useEffect(() => {
    productsAction.setProductList(products)
  }, [products])

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
}
