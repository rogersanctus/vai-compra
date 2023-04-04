'use client'

import { Button } from '@/components/Button'
import { ProductWithFavourite } from '@/models/product'
import { useAppSelector } from '@/stores'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { actions } from '@/stores/actions'
import { Favourite } from '@/models/favourite'
import { clientFetch } from '@/lib/clientFetch'

interface ProductProps {
  product: ProductWithFavourite
}

const { productsAction } = actions

export function ProductItem({ product }: ProductProps) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const [showFavourite, setShowFavourite] = useState(false)
  const [canShowFavourite, setCanShowFavourite] = useState(false)
  const formatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'BRL'
  })

  useEffect(() => {
    setShowFavourite(false)
    setCanShowFavourite(false)
    //productsAction.resetProducts()
  }, [])

  useEffect(() => {
    setCanShowFavourite(isLoggedIn)
  }, [isLoggedIn])

  function onHover() {
    setShowFavourite(true)
  }

  function onLeave() {
    if (product.is_favourite) {
      return
    }

    setShowFavourite(false)
  }

  function updateProductState(newState: Partial<ProductWithFavourite>) {
    productsAction.updateProductOnList(newState)
  }

  async function onFavouriteClick() {
    try {
      const is_favourite = !product.is_favourite
      updateProductState({ id: product.id, is_favourite })
      const response = await clientFetch('/api/users/favourites', {
        body: JSON.stringify({
          product_id: product.id,
          is_favourite
        }),
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error('Failed to favourite the product')
      }

      const data = (await response.json()) as Favourite

      updateProductState({
        id: data.product_external_id,
        is_favourite: data.is_favourite
      })
    } catch (error) {
      console.error(error)
      toast('Não foi possível favoritar o produto', {
        type: 'error',
        position: 'bottom-right'
      })
    }
  }

  const price = formatter.format(product.price)
  return (
    <li
      className="cursor-pointer flex flex-col rounded shadow-lg border border-gray-200 p-4 h-[430px] justify-stretch relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex-grow relative overflow-hidden">
        <Image
          src={product.image}
          alt={`${product.title} photo`}
          className="object-contain mix-blend-multiply"
          fill
          sizes="800px"
        />
      </div>
      <div className="flex cursor-pointer h-12 overflow-hidden my-3">
        <span
          className="w-full text-lg leading-tight font-semibold text-center line-clamp-2"
          title={product.title}
        >
          {product.title}
        </span>
      </div>
      <div className="flex justify-center mt-4">
        <span className="text-2xl font-bold text-lime-600 drop-shadow-sm">
          {price}
        </span>
      </div>
      <div className="mt-4">
        <Button className="w-full" variant="warning">
          Comprar
        </Button>
      </div>
      {canShowFavourite && (product.is_favourite || showFavourite) ? (
        <div className="absolute w-8 h-8 z-10">
          <button
            className="w-full h-full "
            onClick={onFavouriteClick}
            title="Favoritar produto"
          >
            {product.is_favourite ? (
              <HeartIconSolid className="text-rose-400" />
            ) : (
              <HeartIconOutline className="text-gray-400" />
            )}
          </button>
        </div>
      ) : null}
    </li>
  )
}
