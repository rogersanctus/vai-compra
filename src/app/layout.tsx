import './globals.css'

export const metadata = {
  title: 'Vai! Compra',
  description: 'Realize suas compras no melhor e-commerce do país! Só vai.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
