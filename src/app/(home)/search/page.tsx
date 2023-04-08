'use client'

import { useAppDispatch, useAppSelector } from '@/stores'
import { ProductItem } from '../ProductItem'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { searchProducts } from '@/stores/products'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { actions } from '@/stores/actions'

const { productsAction } = actions

export default function SearchPage() {
  const params = useSearchParams()
  const searchParam = params?.get('q')
  const mustHaveAllTermsParam = params?.get('at')
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products.products)
  const isSearching = useAppSelector((state) => state.products.isSearching)
  const searchProductAbort = useRef<(() => void) | null>(null)

  useEffect(() => {
    productsAction.setIsSearching(true)

    return () => {
      productsAction.setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    const search = searchParam ?? ''
    const mustHaveAllTerms = mustHaveAllTermsParam === '1'

    if (searchProductAbort.current) {
      searchProductAbort.current()
      searchProductAbort.current = null
    }

    const dispatchPromise = dispatch(
      searchProducts({ search, mustHaveAllTerms })
    )
    searchProductAbort.current = dispatchPromise.abort

    return () => {
      if (searchProductAbort.current) {
        searchProductAbort.current()
        searchProductAbort.current = null
      }
    }
  }, [searchParam, dispatch, mustHaveAllTermsParam])

  if (isSearching) {
    return (
      <div className="flex flex-grow relative">
        <LoadingOverlay isLoading />
      </div>
    )
  }

  return (
    <div className="flex flex-col px-20 pb-20 pt-4">
      {searchParam && (
        <div className="mb-4">
          <p className="text-left text-2xl uppercase ">
            Resultados da busca por: {searchParam}
          </p>
          {mustHaveAllTermsParam ? (
            <p className="text-lg italic">(Incluindo todos os termos)</p>
          ) : null}
        </div>
      )}

      {products.length === 0 ? (
        <span className="text-gray-700 text-lg">
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
