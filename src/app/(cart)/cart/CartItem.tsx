'use client'

import { CartProduct } from '@/models/cart'
import { useAppDispatch } from '@/stores'
import { actions } from '@/stores/actions'
import { updateCart } from '@/stores/cart'
import { useEffect, useRef } from 'react'
import { PurchasableProductItem } from '@/components/PurchasableProductItem'

interface CartItemProps {
  product: CartProduct
}

export function CartItem({ product }: CartItemProps) {
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
    <PurchasableProductItem
      product={product}
      onChangeAmount={onChangeAmount}
      onIncreaseAmount={onIncreaseOrDecrease}
      onDecreaseAmount={onIncreaseOrDecrease}
      onDeleteItem={onDelete}
    />
  )
}
