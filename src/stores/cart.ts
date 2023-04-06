import { clientFetch } from '@/lib/clientFetch'
import { Cart as CartModel, CartProduct } from '@/models/cart'

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const SliceName = 'cart'

export interface Cart {
  isLoading?: boolean
  cart: CartModel | null
  productsCount: number
}

const initialState: Cart = {
  cart: null,
  productsCount: 0,
  isLoading: true
}

export const fetchCart = createAsyncThunk(
  `${SliceName}/fetchCart`,
  async function (_, thunkApi): Promise<CartModel> {
    const response = await clientFetch('/api/carts', {
      signal: thunkApi.signal
    })

    if (!response.ok) {
      throw new Error('Could not get the user cart')
    }

    return await response.json()
  }
)

export const fetchCartProductsCount = createAsyncThunk(
  `${SliceName}/fetchCartProductsCount`,
  async function (_, thunkApi): Promise<{ count: number }> {
    const response = await clientFetch('/api/carts/products/count', {
      signal: thunkApi.signal
    })

    if (!response.ok) {
      throw new Error('Could not get the quantity of products on the cart')
    }

    return await response.json()
  }
)

export const updateCart = createAsyncThunk(
  `${SliceName}/updateCart`,
  async function (product: CartProduct, thunkApi): Promise<CartModel> {
    const response = await clientFetch('/api/carts/products', {
      body: JSON.stringify(product),
      method: 'PUT',
      signal: thunkApi.signal
    })

    if (!response.ok) {
      throw new Error('Could not update the product cart')
    }

    return await response.json()
  }
)

export const addToCart = createAsyncThunk(
  `${SliceName}/addToCart`,
  async function (product: CartProduct, thunkApi): Promise<CartModel> {
    const response = await clientFetch('/api/carts/products', {
      body: JSON.stringify(product),
      method: 'POST',
      signal: thunkApi.signal
    })

    if (!response.ok) {
      throw new Error('Could not add the product to cart')
    }

    return await response.json()
  }
)

export const removeFromCart = createAsyncThunk(
  `${SliceName}/removeFromCart`,
  async function (product: CartProduct, thunkApi): Promise<CartModel> {
    const response = await clientFetch('/api/carts/products', {
      body: JSON.stringify(product),
      method: 'DELETE',
      signal: thunkApi.signal
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
    builder.addCase(fetchCart.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cart = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchCart.rejected, (state) => {
      state.isLoading = false
    })

    builder.addCase(fetchCartProductsCount.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchCartProductsCount.fulfilled, (state, action) => {
      state.productsCount = action.payload.count
      state.isLoading = false
    })
    builder.addCase(fetchCartProductsCount.rejected, (state) => {
      state.isLoading = false
    })

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
