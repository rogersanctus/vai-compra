'use client'

import { useAppSelector } from '@/stores'
import { ProductItem } from '../ProductItem'

export default function SearchPage() {
  const products = useAppSelector((state) => state.products.products)
  const searchingTerms = useAppSelector(
    (state) => state.products.searchingTerms
  )

  return (
    <div className="flex flex-col px-20 pb-20 pt-4">
      {searchingTerms && (
        <span className="text-left text-2xl uppercase mb-4">
          Resultados da busca por: {searchingTerms}
        </span>
      )}
      <ul className="grid grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </ul>
    </div>
  )
}
