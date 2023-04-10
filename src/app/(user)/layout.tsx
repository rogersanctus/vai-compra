import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ShoppingCart } from '@/components/ShoppingCart'

import { UserAsideMenu } from './UserAsideMenu'

export const metadata = {
  title: 'Vai! Compra - Usuário'
}

interface HomeLayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header append={<ShoppingCart />} />
      <main className="flex flex-grow">
        <UserAsideMenu />
        <div className="flex-grow p-20">{children}</div>
      </main>
      <Footer />
    </>
  )
}
