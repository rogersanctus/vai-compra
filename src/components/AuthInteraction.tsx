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
        <span>{user}</span>
      ) : (
        <div className="whitespace-nowrap text-purple-100 font-semibold text-xs">
          <a href="#login" title="Fazer Login">
            Login
          </a>
          /
          <a href="#logout" title="Fazer Logout">
            Logout
          </a>
        </div>
      )}
    </div>
  )
}
