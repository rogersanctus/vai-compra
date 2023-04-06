'use client'

import { CartProduct } from '@/models/cart'
import { useAppDispatch, useAppSelector } from '@/stores'
import { actions } from '@/stores/actions'
import { addToCart, removeFromCart, updateCart } from '@/stores/cart'
import Image from 'next/image'
import { NumberInput } from '@/components/NumberInput'
import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/number'

interface CartItemProps {
  product: CartProduct
}

export function CartItem({ product }: CartItemProps) {
  const [price, setPrice] = useState('')
  const [totalPrice, setTotalPrice] = useState('')
  const { cartAction } = actions
  const dispatch = useAppDispatch()

  useEffect(() => {
    setPrice('')
    setTotalPrice('')
  }, [])

  useEffect(() => {
    setPrice(formatPrice(product.price))
    setTotalPrice(formatPrice(product.price * product.amount))
  }, [product])

  useEffect(() => {
    cartAction.clearIsLoading()
  }, [cartAction])

  const onChangeAmount = async function (value: number) {
    const amount = value

    if (!isNaN(amount)) {
      const newProduct = { ...product, amount, isLoading: true }

      try {
        cartAction.updateProduct(newProduct)
        await dispatch(updateCart(newProduct))
      } finally {
        cartAction.updateProduct({ ...newProduct, isLoading: false })
      }
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
      <div className="flex flex-grow mr-8">
        <div className="flex relative mr-8 min-w-[4rem]">
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
          <p className="text-gray-600 mt-4">{product.description}</p>
        </div>
      </div>
      <div className="flex-none">
        <NumberInput
          onChange={onChangeAmount}
          onAdd={onAddToCart}
          onRemove={onRemoveFromCart}
          value={product.amount}
          isLoading={product.isLoading}
        />
      </div>
      <div className="flex flex-col flex-shrink justify-start min-w-[220px] h-full ml-6">
        <div className="flex whitespace-nowrap text-base text-gray-600">
          <span>{product.amount}x</span>
          <span className="ml-auto">{price}</span>
        </div>
        <div className="flex whitespace-nowrap text-xl text-lime-600 font-semibold mt-2">
          <span>=</span>
          <span className="ml-auto">{totalPrice}</span>
        </div>
      </div>
    </div>
  )
}
