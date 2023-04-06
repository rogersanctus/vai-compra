import { getAuthUserId } from '@/lib/services/auth'
import { getCart } from '@/lib/services/cart'
import { cookies } from 'next/headers'
import { CartList } from './CartList'

export default async function CartPage() {
  try {
    const cookiesList = cookies()
    const userId = await getAuthUserId(cookiesList)
    const cart = await getCart(userId)

    return (
      <div className="flex flex-col flex-grow px-20 py-10 relative">
        <span className="text-3xl text-gray-600 font-bold mb-8">Carrinho</span>
        {cart ? (
          <CartList cart={cart} />
        ) : (
          <div>
            <span className="text-3xl text-gray-600 font-bold flex items-center justify-center">
              Carrinho Vazio
            </span>
          </div>
        )}
      </div>
    )
  } catch (error) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-3xl text-gray-600 font-bold">
          Não foi possível obter seu carrinho
        </span>
      </div>
    )
  }
}
