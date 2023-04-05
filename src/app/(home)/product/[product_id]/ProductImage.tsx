'use client'

import Image from 'next/image'
import { Product } from '@/models/product'
import { useEffect, useState } from 'react'
import { clientFetch } from '@/lib/clientFetch'

interface ProductImageProps {
  product: Product
}

export function ProductImage({ product }: ProductImageProps) {
  const [current, setCurrent] = useState(0)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  let [productImages, setProductImages] = useState<
    { key: number; src: string }[]
  >([])

  useEffect(() => {
    setCurrent(0)
    setProductImages([])
  }, [])

  useEffect(() => {
    if (current >= 0 && current < productImages.length) {
      setCurrentImage(productImages[current].src)
    } else {
      setCurrentImage(product.image)
    }
  }, [current, productImages, product])

  useEffect(() => {
    async function fetch() {
      try {
        const response = await clientFetch(`/api/products/${product.id}/images`)

        if (!response.ok) {
          throw new Error('Could not get the product image')
        }

        const productImagesList: string[] = await response.json()
        const productImagesMapped = productImagesList.map((image, index) => ({
          key: index + 1,
          src: `/${image}`
        }))
        setProductImages([
          { key: 0, src: product.image },
          ...productImagesMapped
        ])
      } catch (error) {
        console.info(error)
      }
    }

    setProductImages([{ key: 0, src: product.image }])
    fetch()
  }, [product])

  if (productImages.length === 0) {
    return <div className="w-[500px] h-auto min-h-[500px]"></div>
  }

  return (
    <div className="relative w-[500px] h-auto min-h-[500px]">
      {currentImage ? (
        <Image
          src={currentImage}
          fill
          alt={`${product.title} photo`}
          className="object-contain"
        />
      ) : null}
      <div className="absolute ml-2">
        {productImages.map((productImage) => (
          <div
            key={productImage.key}
            className={`mb-2 p-2 rounded border-2 cursor-pointer w-12 h-12 ${
              current === productImage.key
                ? 'border-blue-500'
                : 'border-gray-300'
            }`}
            onClick={() => setCurrent(productImage.key)}
          >
            <Image
              src={productImage.src}
              alt={`${productImage.src} photo`}
              width={48}
              height={48}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
