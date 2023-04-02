import { bindActionCreators } from '@reduxjs/toolkit'
import { Slices, SlicesKeys, slices, store } from '.'

type Actions = {
  [k in SlicesKeys as `${k}Action`]: Slices[k]['actions']
}

function updateActions<T extends Actions>(a: T, b: T[keyof T], k: keyof T) {
  a[k] = b
}

export const actions = (Object.keys(slices) as SlicesKeys[]).reduce<Actions>(
  (accum, key) => {
    updateActions(
      accum,
      bindActionCreators(slices[key].actions, store.dispatch),
      `${key}Action`
    )
    return accum
  },
  {} as Actions
)
