import { ReduxClientProvider } from './ReduxClientProvider'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { registerCleanup } from '@/lib/cleanup'

export const metadata = {
  title: 'Vai! Compra',
  description: 'Realize suas compras no melhor e-commerce do país! Só vai.'
}

interface RootLayoutProps {
  children: React.ReactNode
}

registerCleanup()

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen">
        <ReduxClientProvider>{children}</ReduxClientProvider>
      </body>
    </html>
  )
}
