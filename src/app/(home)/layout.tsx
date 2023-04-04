import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ShoppingCartIcon } from '@heroicons/react/20/solid'
import { SearchProducts } from './SearchProducts'
import { Categories } from './Categories'

export const metadata = {
  title: 'Vai! Compra - Home'
}

interface HomeLayoutProps {
  children: React.ReactNode
}

function AppendHeader() {
  return (
    <a
      href="/cart"
      title="Carrinho"
      className="ml-10 flex flex-col items-center"
    >
      <ShoppingCartIcon className="h-8 w-8 text-purple-50" />
      <span className="text-purple-100 font-semibold text-xs">Carrinho</span>
    </a>
  )
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header prepend={<SearchProducts />} append={<AppendHeader />} />
      <main className="flex flex-col flex-grow">
        <Categories />
        {children}
      </main>
      <Footer />
    </>
  )
}
