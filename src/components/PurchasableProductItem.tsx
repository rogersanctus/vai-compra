import { formatPrice } from '@/lib/number'
import Image from 'next/image'
import { NumberInput } from './NumberInput'
import { CartProduct } from '@/models/cart'

interface PurchasableProductItemProps {
  product: CartProduct
  onDeleteItem: () => void
  onChangeAmount: (value: number) => void
  onIncreaseAmount: (value: number) => void
  onDecreaseAmount: (value: number) => void
}

export function PurchasableProductItem({
  product,
  onDeleteItem,
  onChangeAmount,
  onIncreaseAmount,
  onDecreaseAmount
}: PurchasableProductItemProps) {
  const price = formatPrice(product.price)
  const totalPrice = formatPrice(product.price * product.amount)

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
              onClick={onDeleteItem}
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
          onAdd={onIncreaseAmount}
          onRemove={onDecreaseAmount}
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
