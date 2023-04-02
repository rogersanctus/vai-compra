import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Input } from '@/components/Input'
import { ShoppingCartIcon } from '@heroicons/react/20/solid'

export const metadata = {
  title: 'Vai! Compra - Home'
}

interface HomeLayoutProps {
  children: React.ReactNode
}

function PrependHeader() {
  return (
    <div className="flex w-full mx-14">
      <Input
        name="serch-product"
        placeholder="Produto ou descrição"
        className="flex-grow w-full"
        isAccent
      />
      <Button className="ml-2" variant="secondary" size="md">
        Buscar
      </Button>
    </div>
  )
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
      <Header prepend={<PrependHeader />} append={<AppendHeader />} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
