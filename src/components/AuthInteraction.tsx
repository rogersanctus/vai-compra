'use client'

import { useEffect, useState } from 'react'
import { UserCircleIcon } from '@heroicons/react/20/solid'

export function AuthInteraction() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState('')

  useEffect(() => {
    setIsLoggedIn(false)
    setUser('')
  }, [])

  return (
    <div
      title={isLoggedIn ? user : 'Fazer login ou cadastrar'}
      className="flex flex-col items-center drop-shadow"
    >
      <UserCircleIcon className="text-white w-8 h-8" />
      {isLoggedIn ? (
        <div className="whitespace-nowrap text-purple-100 font-semibold text-xs">
          <a href="/logout" title="Fazer logout (sair)">
            Sair
          </a>
        </div>
      ) : (
        <div className="whitespace-nowrap text-purple-100 font-semibold text-xs">
          <a href="/login" title="Fazer Login" className="mr-1">
            Login
          </a>
          /
          <a href="/signup" title="Cadastrar" className="ml-1">
            Cadastrar
          </a>
        </div>
      )}
    </div>
  )
}
