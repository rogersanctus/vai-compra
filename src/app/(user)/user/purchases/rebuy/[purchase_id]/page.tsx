import { getPurchase } from '@/lib/services/purchases'

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

  return <div>Aha!</div>
}
