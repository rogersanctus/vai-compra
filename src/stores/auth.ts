import { AuthUser } from '@/models/authUser'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const SliceName = 'auth'

export interface Auth {
  isLoading?: boolean
  isLoggedIn: boolean
  user: AuthUser | null
  needToFetchIsLoggedIn?: boolean
  needToFetchUser?: boolean
}

const initialState: Auth = {
  isLoading: true,
  isLoggedIn: false,
  user: null,
  needToFetchIsLoggedIn: false,
  needToFetchUser: false
}

export const fetchIsLoggedIn = createAsyncThunk(
  `${SliceName}/fetchIsLoggedIn`,
  async () => {
    const resHasSession = await fetch('/api/auth/has-session')

    if (!resHasSession.ok) {
      throw new Error('Could not get information about the auth session')
    }

    const { hasSession } = await resHasSession.json()
    return hasSession
  }
)

export const fetchClarify = createAsyncThunk(
  `${SliceName}/fetchClarify`,
  async () => {
    const res = await fetch('/api/auth/clarify')

    if (!res.ok) {
      throw new Error('Não autenticado')
    }

    const userData = await res.json()
    sessionStorage.setItem('user', JSON.stringify(userData))

    return userData
  }
)

export const auth = createSlice({
  name: SliceName,
  initialState,
  reducers: {
    loadIsLoggedIn: (state) => {
      if (sessionStorage.getItem('isLoggedIn') === 'true') {
        state.isLoggedIn = true
      } else {
        state.needToFetchIsLoggedIn = true
      }
    },
    loadUser: (state) => {
      const userVal = sessionStorage.getItem('user')

      if (userVal) {
        try {
          const user: AuthUser = JSON.parse(userVal)
          state.user = user
        } catch (error) {
          console.error('Could not parse user from the "sessionStorage"')
          sessionStorage.removeItem('user')
          state.needToFetchUser = true
        }
      } else {
        state.needToFetchUser = true
      }
      state.isLoading = false
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload
      sessionStorage.setItem('isLoggedIn', String(action.payload))
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
    },
    reset: () => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIsLoggedIn.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchIsLoggedIn.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload
      sessionStorage.setItem('isLoggedIn', String(action.payload))
      state.isLoading = false
      state.needToFetchIsLoggedIn = false
    })
    builder.addCase(fetchIsLoggedIn.rejected, (state) => {
      state.isLoggedIn = false
      state.isLoading = false
    })

    builder.addCase(fetchClarify.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchClarify.fulfilled, (state, action) => {
      const user: AuthUser | null = action.payload ?? null

      if (!user) {
        state.isLoggedIn = false
      }

      state.user = user

      state.isLoading = false
    })
    builder.addCase(fetchClarify.rejected, (state) => {
      state.isLoggedIn = false
      state.user = null
      state.isLoading = false
    })
  }
})
