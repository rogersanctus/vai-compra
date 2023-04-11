import { PurchasableProductItem } from '@/components/PurchasableProductItem'
import { CartProduct } from '@/models/cart'

interface PurchaseProductItemProps {
  product: CartProduct
  onUpdate: (newProduct: CartProduct) => void
  onDelete: () => void
}

export function PurchaseProductItem({
  product,
  onUpdate,
  onDelete
}: PurchaseProductItemProps) {
  function onChangeAmount(value: number) {
    product.amount = value
    onUpdate(product)
  }

  function onIncreaseOrDecreaseAmount(value: number) {
    product.amount = value
    onUpdate(product)
  }

  return (
    <li key={product.id} className="flex border-b border-gray-200 py-4">
      <PurchasableProductItem
        product={product}
        onDeleteItem={onDelete}
        onChangeAmount={onChangeAmount}
        onIncreaseAmount={onIncreaseOrDecreaseAmount}
        onDecreaseAmount={onIncreaseOrDecreaseAmount}
      />
    </li>
  )
}
