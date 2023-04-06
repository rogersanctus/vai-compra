'use client'

import { Cart } from '@/models/cart'
import { actions } from '@/stores/actions'
import { useEffect, useState } from 'react'
import { CartItem } from './CartItem'
import { useAppSelector } from '@/stores'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Button } from '@/components/Button'
import { formatPrice } from '@/lib/number'

interface CartClientProps {
  cart: Cart
}

export function CartList({ cart }: CartClientProps) {
  const { cartAction } = actions
  const [total, setTotal] = useState('')
  const localCart = useAppSelector((state) => state.cart.cart)

  useEffect(() => {
    cartAction.setCart(cart)
  }, [cart, cartAction])

  useEffect(() => {
    if (!localCart) {
      return
    }

    const totalPrices = localCart.products.reduce((accum, product) => {
      accum += product.price * product.amount
      return accum
    }, 0)

    const totalFmt = formatPrice(totalPrices)
    setTotal(totalFmt)
  }, [localCart])

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
      {localCart.products.length > 0 ? (
        <>
          <div className="flex mt-6 justify-end">
            <span className="text-lg">Total:</span>
            <span className="text-2xl font-bold ml-6">{total}</span>
          </div>
          <div className="flex justify-end my-8">
            <Button>Prosseguir com A compra</Button>
          </div>
        </>
      ) : (
        <div className="text-zinc-500">
          <p className="text-3xl italic mb-4">Seu carrinho está vazio.</p>
          <p className="text-2xl font-semibold">
            Que tal dar uma olhada em nossos produtos?{' '}
            <a
              className="text-lime-500 drop-shadow"
              href="/"
              title="Página dos produtos"
            >
              Confira
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
