'use client'

import { Cart } from '@/models/cart'
import { actions } from '@/stores/actions'
import { useEffect } from 'react'
import { CartItem } from './CartItem'
import { useAppSelector } from '@/stores'
import { LoadingOverlay } from '@/components/LoadingOverlay'

interface CartClientProps {
  cart: Cart
}

export function CartList({ cart }: CartClientProps) {
  const { cartAction } = actions
  const localCart = useAppSelector((state) => state.cart.cart)

  useEffect(() => {
    cartAction.setCart(cart)
  }, [cart, cartAction])

  if (!localCart) {
    return (
      <div className="flex-grow">
        <LoadingOverlay isLoading />
      </div>
    )
  }

  return (
    <div className="mt-6">
      <ul className="flex flex-col gap-4">
        {localCart.products.map((cartProduct) => (
          <li
            key={cartProduct.id}
            className="flex border-b border-gray-200 py-4"
          >
            <CartItem product={cartProduct} />
          </li>
        ))}
      </ul>
    </div>
  )
}
