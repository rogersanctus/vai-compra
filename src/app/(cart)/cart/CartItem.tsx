'use client'

import { CartProduct } from '@/models/cart'
import { useAppDispatch, useAppSelector } from '@/stores'
import { actions } from '@/stores/actions'
import { addToCart, removeFromCart, updateCart } from '@/stores/cart'
import Image from 'next/image'
import { NumberInput } from '@/components/NumberInput'
import { useEffect } from 'react'

interface CartItemProps {
  product: CartProduct
}

export function CartItem({ product }: CartItemProps) {
  const { cartAction } = actions
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state) => state.cart.isLoading)

  useEffect(() => {
    cartAction.clearIsLoading()
  }, [cartAction])

  const onChangeAmount = function (value: number) {
    const amount = value

    if (!isNaN(amount)) {
      const newProduct = { ...product, amount }
      cartAction.updateProduct(newProduct)
      dispatch(updateCart(newProduct))
    }
  }

  const onAddToCart = function () {
    cartAction.updateProduct({ ...product, amount: product.amount + 1 })
    dispatch(addToCart(product))
  }

  const onRemoveFromCart = function () {
    cartAction.updateProduct({ ...product, amount: product.amount - 1 })
    dispatch(removeFromCart(product))
  }

  return (
    <div className="flex items-start flex-grow">
      <div className="flex">
        <div className="flex relative mr-4 min-w-[4rem]">
          <Image
            src={product.image}
            width={64}
            height={64}
            alt={`${product.title} photo`}
            className="object-contain"
          />
        </div>
        <div>
          <span className="text-lg text-gray-700 font-semibold">
            <a
              href={`/product/${product.id}`}
              title="Abrir detalhes do produto"
            >
              {product.title}
            </a>
          </span>
          <p className="text-gray-600">{product.description}</p>
        </div>
      </div>
      <NumberInput
        onChange={onChangeAmount}
        onAdd={onAddToCart}
        onRemove={onRemoveFromCart}
        value={product.amount}
        isLoading={isLoading}
      />
    </div>
  )
}
