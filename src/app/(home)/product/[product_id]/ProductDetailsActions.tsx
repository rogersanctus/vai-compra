'use client'

import { Button } from '@/components/Button'
import { Product } from '@/models/product'
import { useAppDispatch } from '@/stores'
import { addToCart, fetchCartProductsCount } from '@/stores/cart'
import { ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface ProductDetailsActionsProps {
  product: Product
}

export function ProductDetailsActions({ product }: ProductDetailsActionsProps) {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  async function onAddToCart() {
    setIsLoading(true)
    const addToCartResult = await dispatch(addToCart({ ...product, amount: 1 }))

    if (addToCart.fulfilled.match(addToCartResult)) {
      toast('Produto adicionado ao carrinho :D', {
        type: 'success',
        position: 'bottom-right'
      })
    } else {
      toast(
        'Não foi possível adicionar ao carrinho. Tente novamente mais tarde',
        {
          type: 'error',
          position: 'bottom-right'
        }
      )
    }

    dispatch(fetchCartProductsCount())
    setIsLoading(false)
  }

  return (
    <div className="flex mt-auto gap-4 justify-end">
      <Button
        variant="dark"
        className="flex uppercase gap-1"
        size="lg"
        onClick={onAddToCart}
        isLoading={isLoading}
        disabled={isLoading}
      >
        <ShoppingCartIcon className="w-6 h-6" />
        <span>Adicionar</span>
      </Button>
      <Button variant="secondary" className="flex uppercase gap-1" size="lg">
        <ShoppingBagIcon className="w-6 h-6" />
        <span>Comprar</span>
      </Button>
    </div>
  )
}
