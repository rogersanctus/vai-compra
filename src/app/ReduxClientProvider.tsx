'use client'

import { Provider } from 'react-redux'
import { store } from '@/stores'
import { ToastContainer } from 'react-toastify'

interface ReduxClientProviderProps {
  children: React.ReactNode
}

export function ReduxClientProvider({ children }: ReduxClientProviderProps) {
  return (
    <Provider store={store}>
      {children}
      <ToastContainer />
    </Provider>
  )
}
