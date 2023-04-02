import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const metadata = {
  title: 'Vai! Compra - Home'
}

interface CartLayoutProps {
  children: React.ReactNode
}

export default function CartLayout({ children }: CartLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
