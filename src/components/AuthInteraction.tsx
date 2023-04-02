'use client'

import { useEffect } from 'react'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { useAppDispatch, useAppSelector } from '@/stores'
import { actions } from '@/stores/actions'
import { fetchClarify, fetchIsLoggedIn } from '@/stores/auth'
import { useRouter } from 'next/navigation'

const { authAction } = actions

export function AuthInteraction() {
  const auth = useAppSelector((state) => state.auth)
  const router = useRouter()

  const dispatch = useAppDispatch()

  function reset() {
    authAction.reset()
  }

  useEffect(() => {
    authAction.loadIsLoggedIn()
  }, [])

  useEffect(() => {
    if (auth.needToFetchIsLoggedIn) {
      dispatch(fetchIsLoggedIn())
    }
  }, [auth.needToFetchIsLoggedIn, dispatch])

  useEffect(() => {
    if (auth.isLoggedIn && !auth.user) {
      authAction.loadUser()
    }
  }, [auth.isLoggedIn, auth.user])

  useEffect(() => {
    if (auth.needToFetchUser) {
      dispatch(fetchClarify())
    }
  }, [auth.needToFetchUser, dispatch])

  async function onLogout() {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })

      reset()
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      title={auth.isLoggedIn ? '' : 'Fazer login ou cadastrar'}
      className="flex flex-col items-center drop-shadow"
    >
      <UserCircleIcon
        className="text-white w-8 h-8"
        title={auth.isLoggedIn ? auth.user?.name : ''}
      />
      {auth.isLoggedIn ? (
        <>
          <span className="text-white">{auth.user?.email}</span>
          <div className="whitespace-nowrap text-purple-100 font-semibold text-xs">
            <button
              onClick={onLogout}
              aria-label="Fazer logout (sair)"
              title="Fazer logout (sair)"
            >
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
