import './globals.css'

export const metadata = {
  title: 'Vai! Compra',
  description: 'Realize suas compras no melhor e-commerce do país! Só vai.'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
