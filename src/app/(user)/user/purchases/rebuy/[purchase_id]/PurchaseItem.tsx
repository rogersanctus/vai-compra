'use client'

import { CartProduct } from '@/models/cart'
import { PurchaseProductItem } from './PurchaseProductItem'
import { useEffect, useState } from 'react'

interface PurchaseProps {
  purchase?: { products: CartProduct[] } | null
}

export function PurchaseItem({ purchase }: PurchaseProps) {
  const [products, setProducts] = useState<CartProduct[]>([])

  useEffect(() => {
    if (purchase) {
      setProducts([...purchase.products])
    }
  }, [purchase])

  function onDelete(idx: number) {
    const copy = [...products]
    copy.splice(idx, 1)

    setProducts(copy)
  }

  function onUpdate(newProduct: CartProduct, index: number) {
    const copy = [...products]
    copy.splice(index, 1, newProduct)

    setProducts(copy)
  }

  if (!purchase) {
    return (
      <section>
        <h1>Compra não encontrada</h1>
      </section>
    )
  }

  return (
    <ul>
      {products.map((product, index) => (
        <PurchaseProductItem
          key={product.id}
          product={product}
          onUpdate={(newProduct) => onUpdate(newProduct, index)}
          onDelete={() => onDelete(index)}
        />
      ))}
    </ul>
  )
}
