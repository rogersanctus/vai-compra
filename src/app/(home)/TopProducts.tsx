import { Product } from '@/models/product'

export const TopProducts = async function () {
  const topProducts: Product[] = []

  if (topProducts.length === 0) {
    return null
  }

  return (
    <div className="px-20">
      <span className="text-2xl uppercase">Todo mundo tá comprando</span>
    </div>
  )
} as unknown as () => JSX.Element
