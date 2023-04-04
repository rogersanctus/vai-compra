'use client'

import { useAppDispatch, useAppSelector } from '@/stores'
import { ProductItem } from '../ProductItem'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { searchProducts } from '@/stores/products'

export default function SearchPage() {
  const params = useSearchParams()
  const searchParam = params?.get('q')
  const mustHaveAllTermsParam = params?.get('at')
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products.products)

  useEffect(() => {
    const search = searchParam ?? ''
    const mustHaveAllTerms = mustHaveAllTermsParam === '1'

    dispatch(searchProducts({ search, mustHaveAllTerms }))
  }, [searchParam, dispatch, mustHaveAllTermsParam])

  return (
    <div className="flex flex-col px-20 pb-20 pt-4">
      {searchParam && (
        <span className="text-left text-2xl uppercase mb-4">
          Resultados da busca por: {searchParam}
        </span>
      )}
      {products.length === 0 ? (
        <span className="text-gray-700 text-lg mt-auto py-20">
          Nenhum resultado encontrado :(
        </span>
      ) : (
        <ul className="grid grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductItem product={product} key={product.id} />
          ))}
        </ul>
      )}
    </div>
  )
}
