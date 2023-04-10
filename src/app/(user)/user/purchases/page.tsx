import { getAuthUserId } from '@/lib/services/auth'
import { getPurchases } from '@/lib/services/purchases'
import { cookies } from 'next/headers'
import { PurchaseProduct } from './PurchaseProduct'
import { Button } from '@/components/Button'

export default async function UserPurchasesPage() {
  try {
    const cookiesList = cookies()
    const userId = await getAuthUserId(cookiesList)
    const purchases = await getPurchases(userId)

    return (
      <div>
        <section>
          <h1 className="text-lg text-zinc-700 mb-6 inline-block font-bold">
            {purchases.length} {purchases.length === 1 ? 'compra' : 'compras'}{' '}
            realizadas
          </h1>
          <ul className="flex flex-col gap-6">
            {purchases.map((purchase) => (
              <li
                key={purchase.id}
                className="border border-slate-200 rounded shadow-md bg-zinc-50"
              >
                <div className="p-4 text-zinc-600 font-semibold">
                  Compra realizada em {purchase.created_at.toLocaleString()}
                </div>
                <div className="flex">
                  <ul className="flex flex-col flex-grow gap-1">
                    {purchase.products.map((product) => (
                      <li key={product.id} className="p-4">
                        <PurchaseProduct product={product} />
                      </li>
                    ))}
                  </ul>
                  <div className="flex-none px-6">
                    <a
                      href={`/user/purchases/rebuy/${purchase.id}`}
                      rel="nofollow"
                      title="Comprar novamente"
                      role="button"
                      className="block mb-4 border border-sky-600 bg-sky-100 font-semibold text-zinc-500 rounded-md text-center hover:shadow-md hover:bg-sky-300 hover:text-white px-5 py-3"
                    >
                      Comprar novamente
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  } catch (error) {
    return <div>Error</div>
  }
}
