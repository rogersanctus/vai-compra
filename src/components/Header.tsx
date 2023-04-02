import Image from 'next/image'
import { AuthInteraction } from './AuthInteraction'

interface HeaderProps {
  prepend?: React.ReactNode
  append?: React.ReactNode
  isAuthPage?: boolean
}

export function Header({ prepend, append, isAuthPage = false }: HeaderProps) {
  return (
    <header className="relative flex items-center w-full bg-gradient-to-r from-indigo-700 to-blue-500 px-10 py-8 border-b-[2px] border-blue-300">
      <a href="/" title="Vai Compra" className="flex ml-10 mr-20 items-center">
        <Image
          src="/vai-compra-logo.svg"
          alt="Vai Compra Logo"
          width="120"
          height="120"
          className="drop-shadow-lg"
          priority
        />
        <span className="text-white text-4xl font-bold ml-2 drop-shadow-md">
          Compra
        </span>
      </a>
      {prepend}
      <div className="flex ml-auto">
        {isAuthPage ? null : <AuthInteraction />}
        {append}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-800"></div>
    </header>
  )
}
