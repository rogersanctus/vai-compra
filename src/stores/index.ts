import { configureStore } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux'
import { auth } from './auth'
import { products } from './products'

export const slices = {
  auth,
  products
}

export type Slices = typeof slices
export type SlicesKeys = keyof Slices
type Reducers = {
  [k in SlicesKeys]: Slices[k]['reducer']
}

function updateReducers<T extends Reducers>(a: T, b: T[keyof T], k: keyof T) {
  a[k] = b
}

function slicesToReducer(inSlices: Slices) {
  const reducers = (Object.keys(inSlices) as SlicesKeys[]).reduce<Reducers>(
    (accum, key) => {
      const reducer = inSlices[key].reducer

      updateReducers(accum, reducer, key)
      return accum
    },
    {} as Reducers
  )

  return reducers
}

export const store = configureStore({
  reducer: slicesToReducer(slices)
})

type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
