'use client'

import { useAppDispatch, useAppSelector } from '@/stores'
import { fetchCartProductsCount } from '@/stores/cart'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import { useEffect } from 'react'

export function ShoppingCart() {
  const dispatch = useAppDispatch()
  const itemsOnCart = useAppSelector((state) => state.cart.productsCount)

  useEffect(() => {
    dispatch(fetchCartProductsCount())
  }, [dispatch])

  return (
    <div className="ml-10 flex flex-col items-center relative">
      <div className="absolute flex items-center justify-center bg-gray-800 text-white text-xs rounded-full -top-3 -right-1 w-6 h-6 overflow-hidden">
        <span>{itemsOnCart}</span>
      </div>
      <a href="/cart" title="Carrinho">
        <ShoppingCartIcon className="h-8 w-8 text-purple-50" />
        <span className="text-purple-100 font-semibold text-xs">Carrinho</span>
      </a>
    </div>
  )
}
