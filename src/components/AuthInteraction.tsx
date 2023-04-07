'use client'

import { useCallback, useEffect, useRef } from 'react'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { useAppDispatch, useAppSelector } from '@/stores'
import { actions } from '@/stores/actions'
import { fetchClarify, fetchIsLoggedIn } from '@/stores/auth'
import { useRouter } from 'next/navigation'
import { clientFetch } from '@/lib/clientFetch'

const { authAction } = actions

export function AuthInteraction() {
  const auth = useAppSelector((state) => state.auth)
  const router = useRouter()
  const fetchIsLoggedInAbort = useRef<(() => void) | null>(null)
  const fetchClarifyAbort = useRef<(() => void) | null>(null)

  const dispatch = useAppDispatch()

  useEffect(() => {
    authAction.loadIsLoggedIn()
  }, [])

  useEffect(() => {
    if (auth.needToFetchIsLoggedIn) {
      if (fetchIsLoggedInAbort.current) {
        fetchIsLoggedInAbort.current()
        fetchIsLoggedInAbort.current = null
      }

      const dispatchPromise = dispatch(fetchIsLoggedIn())
      fetchIsLoggedInAbort.current = dispatchPromise.abort
    }

    return () => {
      if (fetchIsLoggedInAbort.current) {
        fetchIsLoggedInAbort.current()
        fetchIsLoggedInAbort.current = null
      }
    }
  }, [auth.needToFetchIsLoggedIn, dispatch])

  useEffect(() => {
    if (auth.isLoggedIn && !auth.user) {
      authAction.loadUser()
    }
  }, [auth.isLoggedIn, auth.user])

  useEffect(() => {
    if (auth.needToFetchUser) {
      if (fetchClarifyAbort.current) {
        fetchClarifyAbort.current()
        fetchClarifyAbort.current = null
      }

      const dispatchPromise = dispatch(fetchClarify())
      fetchClarifyAbort.current = dispatchPromise.abort
    }

    return () => {
      if (fetchClarifyAbort.current) {
        fetchClarifyAbort.current()
        fetchClarifyAbort.current = null
      }
    }
  }, [auth.needToFetchUser, dispatch])

  const UserInfo = useCallback(() => {
    async function onLogout() {
      try {
        await clientFetch('/api/auth/login', { method: 'DELETE' })

        authAction.reset()
        authAction.clearSession()
        router.push('/')
      } catch (error) {
        console.error(error)
      }
    }

    if (auth.isLoggedIn) {
      return (
        <>
          <span className="text-white text-sm">{auth.user?.email}</span>
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
      )
    }

    return (
      <div className="whitespace-nowrap text-purple-100 font-semibold text-xs">
        <a href="/login" title="Fazer Login" className="mr-1">
          Login
        </a>
        /
        <a href="/signup" title="Cadastrar" className="ml-1">
          Cadastrar
        </a>
      </div>
    )
  }, [auth.isLoggedIn, auth.user, router])

  return (
    <div
      title={auth.isLoggedIn ? '' : 'Fazer login ou cadastrar'}
      className="flex flex-col items-center drop-shadow"
    >
      {auth.isLoading ? (
        <>
          <div className="bg-white/70 rounded-full w-8 h-8"></div>
          <div className="mt-2 bg-white/70 rounded w-20 h-4"></div>
        </>
      ) : (
        <>
          <UserCircleIcon
            className="text-white w-8 h-8"
            title={auth.isLoggedIn ? auth.user?.name : ''}
          />
          <UserInfo />
        </>
      )}
    </div>
  )
}
