'use client'

import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/stores'
import { actions } from '@/stores/actions'
import { fetchClarify, fetchIsLoggedIn } from '@/stores/auth'
import { useRouter } from 'next/navigation'
import { AuthUserInfo } from './AuthUserInfo'

const { authAction } = actions

export function AuthInteraction() {
  const auth = useAppSelector((state) => state.auth)
  const router = useRouter()
  const fetchIsLoggedInAbort = useRef<(() => void) | null>(null)
  const fetchClarifyAbort = useRef<(() => void) | null>(null)

  const dispatch = useAppDispatch()

  useEffect(() => {
    authAction.loadIsLoggedIn()

    return () => {
      authAction.clearIsLoading()
    }
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

  return (
    <div
      title={auth.isLoggedIn ? '' : 'Fazer login ou cadastrar'}
      className="flex flex-col items-center drop-shadow"
    >
      {auth.isLoading ? (
        <>
          <div className="bg-white/70 rounded-full w-8 h-8 blur"></div>
          <div className="mt-2 bg-white/70 rounded w-20 h-4 blur"></div>
        </>
      ) : (
        <AuthUserInfo />
      )}
    </div>
  )
}
