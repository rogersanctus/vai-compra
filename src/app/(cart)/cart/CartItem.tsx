'use client'

import { CartProduct } from '@/models/cart'
import { useAppDispatch } from '@/stores'
import { actions } from '@/stores/actions'
import { updateCart } from '@/stores/cart'
import Image from 'next/image'
import { NumberInput } from '@/components/NumberInput'
import { useEffect, useRef } from 'react'
import { formatPrice } from '@/lib/number'

interface CartItemProps {
  product: CartProduct
}

export function CartItem({ product }: CartItemProps) {
  const price = formatPrice(product.price)
  const totalPrice = formatPrice(product.price * product.amount)
  const { cartAction } = actions
  const dispatch = useAppDispatch()
  const updateCartAbortController = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      if (updateCartAbortController.current) {
        updateCartAbortController.current()
        updateCartAbortController.current = null
      }
    }
  }, [])

  useEffect(() => {
    cartAction.clearIsLoading()
  }, [cartAction])

  const onChangeAmount = async function (value: number) {
    const amount = value

    if (!isNaN(amount)) {
      const newProduct = { ...product, amount, isLoading: true }

      try {
        cartAction.updateProduct(newProduct)

        if (updateCartAbortController.current) {
          updateCartAbortController.current()
          updateCartAbortController.current = null
        }

        const promise = dispatch(updateCart(newProduct))
        updateCartAbortController.current = promise.abort
        await promise
      } finally {
        cartAction.updateProduct({ ...newProduct, isLoading: false })
      }
    }
  }

  function onIncreaseOrDecrease(value: number) {
    const payload = { ...product, amount: value }
    cartAction.updateProduct(payload)

    if (updateCartAbortController.current) {
      updateCartAbortController.current()
      updateCartAbortController.current = null
    }

    const promise = dispatch(updateCart(payload))
    updateCartAbortController.current = promise.abort
  }

  async function onDelete() {
    const payload = { ...product, amount: 0, isLoading: true }
    cartAction.updateProduct(payload)

    if (updateCartAbortController.current) {
      updateCartAbortController.current()
      updateCartAbortController.current = null
    }

    const promise = dispatch(updateCart(payload))
    updateCartAbortController.current = promise.abort

    try {
      await promise
    } finally {
      cartAction.updateProduct({ ...payload, isLoading: false })
    }
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
        <div className="flex-grow">
          <div className="flex text-lg text-gray-700 font-semibold">
            <a
              href={`/product/${product.id}`}
              title="Abrir detalhes do produto"
            >
              {product.title}
            </a>
            <button
              className={`text-rose-400 text-sm font-bold uppercase ml-auto ${
                product.isLoading ? 'cursor-not-allowed' : ''
              }`}
              title="Excluir produto"
              onClick={onDelete}
              disabled={product.isLoading}
            >
              Excluir
            </button>
          </div>
          <p className="text-gray-600 mt-4">{product.description}</p>
        </div>
      </div>
      <div className="flex-none">
        <NumberInput
          onChange={onChangeAmount}
          onAdd={onIncreaseOrDecrease}
          onRemove={onIncreaseOrDecrease}
          value={product.amount}
          min={1}
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
