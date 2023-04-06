'use client'

import { Button } from '@/components/Button'
import { formatPrice } from '@/lib/number'
import { CartProduct } from '@/models/cart'
import { RootState, useAppDispatch, useAppSelector } from '@/stores'
import { fetchCart } from '@/stores/cart'
import { createSelector } from '@reduxjs/toolkit'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const productsSummarySelector = createSelector(
  (state: RootState) => state.cart.cart?.products ?? [],
  (products: CartProduct[]) => {
    return products.map((product) => {
      const fmtPrice = formatPrice(product.price)
      const totalPrice = product.amount * product.price
      const fmtTotalPrice = formatPrice(totalPrice)

      return {
        ...product,
        fmtPrice,
        totalPrice,
        fmtTotalPrice
      }
    })
  }
)

const allTotalPriceSelector = createSelector(
  (state: RootState) => productsSummarySelector(state),
  (products) => {
    const total = products.reduce((accum, product) => {
      accum += product.totalPrice
      return accum
    }, 0)

    return formatPrice(total)
  }
)

export default function CartSummary() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isGoingToDetails = useAppSelector(
    (state) => state.cart.isGoingToDetails
  )
  const products = useAppSelector(productsSummarySelector)
  const fmtTotalPrice = useAppSelector(allTotalPriceSelector)
  const abortController = useRef<(() => void) | null>(null)

  useEffect(() => {
    function abortFetchCart() {
      if (abortController.current) {
        abortController.current()
      }
    }

    if (isGoingToDetails) {
      abortFetchCart()
      const fetchCartPromise = dispatch(fetchCart())
      abortController.current = fetchCartPromise.abort
    }

    return () => {
      abortFetchCart()
    }
  }, [isGoingToDetails, dispatch])

  if (!isGoingToDetails) {
    router.push('/')
    return
  }

  return (
    <div className="px-20 py-10">
      <span className="text-2xl font-semibold uppercase">Resumo</span>
      <div className="flex justify-between mt-6">
        <ul className="flex flex-col gap-3">
          {products.map((cartProduct) => (
            <li
              key={cartProduct.id}
              className="flex [&:not(:last-child)]:border-b border-gray-200 pb-4"
            >
              <div className="flex items-start flex-grow">
                <div className="flex flex-grow mr-4">
                  <div className="flex relative mr-2 min-w-[4rem]">
                    <Image
                      src={cartProduct.image}
                      width={42}
                      height={42}
                      alt={`${cartProduct.title} photo`}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex text-base text-gray-700 font-semibold">
                      <a
                        href={`/product/${cartProduct.id}`}
                        title="Abrir detalhes do produto"
                      >
                        {cartProduct.title}
                      </a>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {cartProduct.description}
                    </p>
                  </div>
                </div>
                <div className="ml-auto">
                  <span className="flex whitespace-nowrap text-base text-gray-600">
                    {cartProduct.amount}x
                  </span>
                </div>
                <div className="flex flex-col flex-shrink justify-start min-w-[150px] h-full ml-6">
                  <div className="flex whitespace-nowrap text-sm text-gray-600">
                    <span className="ml-auto">{cartProduct.fmtPrice}</span>
                  </div>
                  <div className="flex whitespace-nowrap text-lg text-zinc-600 font-semibold mt-2">
                    <span className="ml-auto">{cartProduct.fmtTotalPrice}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col min-w-[300px] ml-10 border-l border-gray-200 pl-8">
          <p className="text-xl text-zinc-600 ml-auto">Total do Pedido</p>
          <p className="text-lg text-zinc-400 font-semibold ml-auto mt-4">
            {fmtTotalPrice}
          </p>
          <Button variant="primary" size="md" className="mt-8">
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  )
}
