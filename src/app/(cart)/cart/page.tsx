import { getAuthUserId } from '@/lib/services/auth'
import { getCart } from '@/lib/services/cart'
import { cookies } from 'next/headers'
import { CartList } from './CartList'
import { Cart } from '@/models/cart'
import { UserNotAuthenticatedError } from '@/lib/errors/UserLoginError'

function RenderCart(cart: Cart | null = null) {
  return (
    <div className="flex flex-col flex-grow px-20 py-10 relative">
      <span className="text-3xl text-gray-600 font-bold mb-8">
        Seu carrinho
      </span>
      <CartList cart={cart} />
      {/*cart ? (
        <CartList cart={cart} />
      ) : (
        <div>
          <span className="text-3xl text-gray-600 font-bold flex items-center justify-center">
            Carrinho Vazio
          </span>
        </div>
      )*/}
    </div>
  )
}

export default async function CartPage() {
  try {
    const cookiesList = cookies()
    const userId = await getAuthUserId(cookiesList)
    const cart = await getCart(userId)

    return RenderCart(cart ?? null)
  } catch (error) {
    if (error instanceof UserNotAuthenticatedError) {
      return RenderCart()
    }

    return (
      <div className="flex flex-col items-center justify-center p-20">
        <p className="text-3xl text-gray-600 font-bold">
          Não foi possível obter seu carrinho
        </p>
        <p>
          <a href="/" className="text-amber-500 text-2xl font-bold">
            Voltar a comprar
          </a>
        </p>
      </div>
    )
  }
}
