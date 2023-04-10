import { PurchaseProduct } from '@/models/product'
import Image from 'next/image'

interface PurchaseProductProps {
  product: PurchaseProduct
}
export function PurchaseProduct({ product }: PurchaseProductProps) {
  return (
    <div className="flex gap-2">
      <div className="w-14 h-14 border border-slate-300 rounded bg-white p-2">
        <Image
          src={product.image}
          width={60}
          height={60}
          alt="Product photo"
          className="object-contain w-full h-full"
        />
      </div>
      <div className="w-[1px] flex flex-none py-2">
        <div className="bg-zinc-200 w-full"></div>
      </div>
      <div className="px-2">
        <h2 className="text-sm text-zinc-500">{product.title}</h2>
        <span className="text-xs text-zinc-500">
          {product.amount} {product.amount === 1 ? 'unidade' : 'unidades'}
        </span>
      </div>
    </div>
  )
}
