import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const metadata = {
  title: 'Vai! Compra - Login'
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header isAuthPage />
      <main className="h-full">{children}</main>
      <Footer isAuthPage />
    </div>
  )
}
