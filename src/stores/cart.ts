import { clientFetch } from '@/lib/clientFetch'
import { Cart as CartModel, CartProduct } from '@/models/cart'

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const SliceName = 'cart'

export interface Cart {
  isLoading?: boolean
  cart: CartModel | null
}

const initialState: Cart = {
  cart: null,
  isLoading: true
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
  async function (product: CartProduct): Promise<CartModel> {
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
  async function (product: CartProduct): Promise<CartModel> {
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
  async function (product: CartProduct): Promise<CartModel> {
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
    updateProduct(state, action: PayloadAction<CartProduct>) {
      const toFound = action.payload

      if (!state.cart) {
        return state
      }

      const foundIndex = state.cart.products.findIndex(
        (product) => product.id === toFound.id
      )

      const previous = state.cart?.products[foundIndex]

      if (foundIndex !== -1) {
        const copy = [...state.cart?.products]
        const newProduct = {
          ...previous,
          ...toFound
        } as CartProduct

        copy.splice(foundIndex, 1, newProduct)

        state.cart.products = copy
      }
    },
    setCart(state, action: PayloadAction<CartModel>) {
      state.cart = action.payload
    },

    resetCart(state) {
      state.cart = null
    },

    clearIsLoading(state) {
      state.isLoading = false
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
      state.cart = action.payload
      state.isLoading = false
    })
    builder.addCase(updateCart.rejected, (state) => {
      state.isLoading = false
    })

    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.cart = action.payload
      state.isLoading = false
    })
    builder.addCase(addToCart.rejected, (state) => {
      state.isLoading = false
    })

    builder.addCase(removeFromCart.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.cart = action.payload
      state.isLoading = false
    })
    builder.addCase(removeFromCart.rejected, (state) => {
      state.isLoading = false
    })
  }
})
