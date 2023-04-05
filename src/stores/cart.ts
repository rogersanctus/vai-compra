import { clientFetch } from '@/lib/clientFetch'
import { CartProduct } from '@/models/cart'

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const SliceName = 'cart'

export interface Cart {
  isLoading?: boolean
  products: CartProduct[]
}

const initialState: Cart = {
  isLoading: true,
  products: []
}

async function fetchCart(): Promise<Cart> {
  const response = await clientFetch('/api/carts')

  if (!response.ok) {
    throw new Error('Could not get the user cart')
  }

  return await response.json()
}

export const updateCart = createAsyncThunk(
  `${SliceName}/updateCart`,
  async function (product: CartProduct): Promise<CartProduct[]> {
    const response = await clientFetch('/api/carts/products', {
      body: JSON.stringify(product),
      method: 'PUT'
    })

    if (!response.ok) {
      throw new Error('Could not update the product cart')
    }

    return await response.json()
  }
)

export const addToCart = createAsyncThunk(
  `${SliceName}/addToCart`,
  async function (product: CartProduct): Promise<CartProduct[]> {
    const response = await clientFetch('/api/carts/products', {
      body: JSON.stringify(product),
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Could not add the product to cart')
    }

    return await response.json()
  }
)

export const removeFromCart = createAsyncThunk(
  `${SliceName}/removeFromCart`,
  async function (product: CartProduct): Promise<CartProduct[]> {
    const response = await clientFetch('/api/carts/products', {
      body: JSON.stringify(product),
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Could not remove the product from the cart')
    }

    return await response.json()
  }
)

export const cart = createSlice({
  name: SliceName,
  initialState,
  reducers: {
    setProductList(state, action: PayloadAction<CartProduct[]>) {
      state.products = action.payload
    },
    resetProducts(state) {
      state.products = []
    },
    reset: () => {
      return { ...initialState, isLoading: false }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateCart.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(updateCart.fulfilled, (state, action) => {
      state.products = action.payload
      state.isLoading = false
    })
    builder.addCase(updateCart.rejected, (state) => {
      state.isLoading = false
    })

    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.products = action.payload
      state.isLoading = false
    })
    builder.addCase(addToCart.rejected, (state) => {
      state.isLoading = false
    })

    builder.addCase(removeFromCart.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.products = action.payload
      state.isLoading = false
    })
    builder.addCase(removeFromCart.rejected, (state) => {
      state.isLoading = false
    })
  }
})
