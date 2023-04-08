import { clientFetch } from '@/lib/clientFetch'
import { AuthUser } from '@/models/authUser'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const SliceName = 'auth'

export interface Auth {
  isLoading?: boolean
  isLoggedIn: boolean
  user: AuthUser | null
  needToFetchIsLoggedIn?: boolean
  needToFetchUser?: boolean
  pendingRequests: number
}

const initialState: Auth = {
  isLoading: true,
  isLoggedIn: false,
  user: null,
  needToFetchIsLoggedIn: false,
  needToFetchUser: false,
  pendingRequests: 0
}

function clearSession() {
  sessionStorage.removeItem('isLoggedIn')
  sessionStorage.removeItem('user')
}

export const fetchIsLoggedIn = createAsyncThunk(
  `${SliceName}/fetchIsLoggedIn`,
  async (_, thunkApi) => {
    const resHasSession = await clientFetch('/api/auth/has-session', {
      signal: thunkApi.signal
    })

    if (!resHasSession.ok) {
      throw new Error('Could not get information about the auth session')
    }

    const { hasSession } = await resHasSession.json()
    return hasSession
  }
)

export const fetchClarify = createAsyncThunk(
  `${SliceName}/fetchClarify`,
  async (_, thunkApi) => {
    try {
      const res = await clientFetch('/api/auth/clarify', {
        signal: thunkApi.signal
      })

      if (!res.ok) {
        throw new Error('Não autenticado')
      }

      const userData = await res.json()
      sessionStorage.setItem('user', JSON.stringify(userData))

      return userData
    } catch (error) {
      console.error(error)
      throw error
    }
  }
)

export const auth = createSlice({
  name: SliceName,
  initialState,
  reducers: {
    loadIsLoggedIn: (state) => {
      const isLoggedInStored = sessionStorage.getItem('isLoggedIn')

      if (isLoggedInStored) {
        state.isLoggedIn = isLoggedInStored === 'true'

        if (!state.isLoggedIn) {
          state.isLoading = false
          state.pendingRequests = 0
        }
      } else {
        state.needToFetchIsLoggedIn = true
      }
    },
    loadUser: (state) => {
      const userVal = sessionStorage.getItem('user')

      try {
        if (!userVal) {
          throw { info: 'no user info at sessionStorage' }
        }

        const user: AuthUser = JSON.parse(userVal)
        state.user = user
        state.isLoading = false
        state.pendingRequests = 0
      } catch (error) {
        console.info('Could not parse user from the "sessionStorage"')
        sessionStorage.removeItem('user')
        state.needToFetchUser = true
      }
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload
      sessionStorage.setItem('isLoggedIn', String(action.payload))
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
    },
    reset: () => {
      return { ...initialState, isLoading: false }
    },
    clearSession: (state) => {
      clearSession()
    },
    clearIsLoading(state) {
      state.isLoading = false
      state.pendingRequests = 0
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIsLoggedIn.pending, (state) => {
      state.isLoading = true
      state.pendingRequests++
    })
    builder.addCase(fetchIsLoggedIn.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload
      sessionStorage.setItem('isLoggedIn', String(action.payload))
      state.needToFetchIsLoggedIn = false

      if (--state.pendingRequests === 0) {
        state.isLoading = false
      }
    })
    builder.addCase(fetchIsLoggedIn.rejected, (state, action) => {
      if (!action.meta.aborted) {
        state.isLoggedIn = false
        sessionStorage.setItem('isLoggedIn', 'false')
      }

      if (--state.pendingRequests === 0) {
        state.isLoading = false
      }
    })

    builder.addCase(fetchClarify.pending, (state) => {
      state.isLoading = true
      state.pendingRequests++
    })
    builder.addCase(fetchClarify.fulfilled, (state, action) => {
      const user: AuthUser | null = action.payload ?? null

      if (!user) {
        state.isLoggedIn = false
      }

      state.user = user

      if (--state.pendingRequests === 0) {
        state.isLoading = false
      }
    })
    builder.addCase(fetchClarify.rejected, (state, action) => {
      if (!action.meta.aborted) {
        state.isLoggedIn = false
        state.user = null
        clearSession()
      }

      if (--state.pendingRequests === 0) {
        state.isLoading = false
      }
    })
  }
})
