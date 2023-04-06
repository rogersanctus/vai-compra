import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SearchProducts } from './SearchProducts'
import { Categories } from './Categories'
import { ShoppingCart } from '@/components/ShoppingCart'

export const metadata = {
  title: 'Vai! Compra - Home'
}

interface HomeLayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header prepend={<SearchProducts />} append={<ShoppingCart />} />
      <main className="flex flex-col flex-grow">
        <Categories />
        {children}
      </main>
      <Footer />
    </>
  )
}
