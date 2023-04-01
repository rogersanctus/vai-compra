'use client'

import { useEffect, useState } from 'react'
import { UserCircleIcon } from '@heroicons/react/20/solid'

interface User {
  name: string
  email: string
}

export function AuthInteraction() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  function reset() {
    setIsLoggedIn(false)
    setUser(null)
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const resHasSession = await fetch('/api/auth/has-session')

        if (!resHasSession.ok) {
          throw new Error('Could not get information about the auth session')
        }

        const { hasSession } = await resHasSession.json()

        if (hasSession) {
          const res = await fetch('/api/auth/clarify')

          if (!res.ok) {
            throw new Error('Não autenticado')
          }

          const userData = await res.json()

          if (userData) {
            setUser(userData as User)
            setIsLoggedIn(true)
          }
        } else {
          reset()
        }
      } catch (error) {
        console.error(error)
        reset()
      }
    }

    loadUser()

    return reset
  }, [])

  async function onLogout() {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })

      reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      title={isLoggedIn ? '' : 'Fazer login ou cadastrar'}
      className="flex flex-col items-center drop-shadow"
    >
      <UserCircleIcon
        className="text-white w-8 h-8"
        title={isLoggedIn ? user?.name : ''}
      />
      {isLoggedIn ? (
        <>
          <span className="text-white">{user?.email}</span>
          <div className="whitespace-nowrap text-purple-100 font-semibold text-xs">
            <button onClick={onLogout} aria-label="Fazer logout (sair)">
              Sair
            </button>
          </div>
        </>
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
