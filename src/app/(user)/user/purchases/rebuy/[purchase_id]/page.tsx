import { getPurchase } from '@/lib/services/purchases'
import { PurchaseItem } from './PurchaseItem'

interface RebuyPurchasePageProps {
  params: { purchase_id: string }
}

export default async function RebuyPurchasePage({
  params: { purchase_id }
}: RebuyPurchasePageProps) {
  const purchaseId = Number(purchase_id)

  if (isNaN(purchaseId)) {
    return <div>Is NAN</div>
  }

  const purchase = await getPurchase(purchaseId)

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-500 mb-2 border-b-2 border-zinc-300 pb-2">
        Recomprar Produtos
      </h1>
      <PurchaseItem purchase={purchase} />
    </section>
  )
}
