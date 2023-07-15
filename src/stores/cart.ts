import { clientFetch } from '@/lib/clientFetch'
import { Cart as CartModel, CartProduct } from '@/models/cart'

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const SliceName = 'cart'
const LocalCart = -1

export interface Cart {
  isLoading?: boolean
  cart: CartModel | null
  productsCount: number
  isGoingToCheckout: boolean
}

const initialState: Cart = {
  cart: null,
  productsCount: 0,
  isLoading: true,
  isGoingToCheckout: false
}

function createLocalCart(): CartModel {
  return {
    id: LocalCart,
    open: true,
    products: [],
    user_id: undefined
  }
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
  async function (
    isUserLoggedIn: boolean,
    thunkApi
  ): Promise<{ count: number }> {
    if (!isUserLoggedIn) {
      const cartItem = localStorage.getItem('cart')

      if (cartItem === null) {
        return { count: 0 }
      }

      const cart: CartModel = JSON.parse(cartItem)

      return {
        count: cart.products.reduce((accum, curr) => {
          return accum + curr.amount
        }, 0)
      }
    }

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
  async function (
    {
      product,
      isUserLoggedIn
    }: { product: CartProduct; isUserLoggedIn: boolean },
    thunkApi
  ): Promise<CartModel | undefined> {
    if (!isUserLoggedIn) {
      const cartItem = localStorage.getItem('cart')

      if (cartItem !== null) {
        const cart: CartModel = JSON.parse(cartItem)
        const newAmount = product.amount
        const localCartProductIdx = cart.products.findIndex(
          (cartProduct) => cartProduct.id === product.id
        )

        if (localCartProductIdx !== -1) {
          if (newAmount === 0) {
            cart.products.splice(localCartProductIdx, 1)
          } else {
            cart.products[localCartProductIdx].amount = newAmount
          }
        }

        localStorage.setItem('cart', JSON.stringify(cart))

        return cart
      }

      return
    }

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
  async function (
    {
      product,
      isUserLoggedIn
    }: { product: CartProduct; isUserLoggedIn: boolean },
    thunkApi
  ): Promise<CartModel> {
    if (!isUserLoggedIn) {
      const cartItem = localStorage.getItem('cart')
      let cart: CartModel =
        cartItem === null ? createLocalCart() : JSON.parse(cartItem)

      const productOnCartIndex = cart.products.findIndex(
        (cartProduct) => cartProduct.id === product.id
      )
      let productOnCart: CartProduct | null = null

      if (productOnCartIndex !== -1) {
        productOnCart = cart.products[productOnCartIndex]
        productOnCart.amount++
        cart.products.splice(productOnCartIndex, 1, productOnCart)
      } else {
        productOnCart = {
          ...product,
          amount: 1
        }
        cart.products.push(productOnCart)
      }

      localStorage.setItem('cart', JSON.stringify(cart))

      return cart
    }

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
  async function (
    {
      product,
      isUserLoggedIn
    }: { product: CartProduct; isUserLoggedIn: boolean },
    thunkApi
  ): Promise<CartModel | undefined> {
    if (!isUserLoggedIn) {
      const cartItem = localStorage.getItem('cart')

      if (cartItem) {
        const cart: CartModel = JSON.parse(cartItem)
        const cartProductIdx = cart.products.findIndex(
          (cartProduct) => cartProduct.id === product.id
        )

        if (cartProductIdx !== -1) {
          cart.products.splice(cartProductIdx, 1)
          localStorage.setItem('cart', JSON.stringify(cart))

          return cart
        }
      }

      return
    }

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
    deleteProduct(state, action: PayloadAction<CartProduct>) {
      const toFound = action.payload

      if (!state.cart) {
        return state
      }

      const foundIndex = state.cart.products.findIndex(
        (product) => product.id === toFound.id
      )

      if (foundIndex !== -1) {
        const copy = [...state.cart?.products]
        copy.splice(foundIndex, 1)

        state.cart.products = copy
      }
    },
    setCart(state, action: PayloadAction<CartModel | null>) {
      state.cart = action.payload
    },

    resetCart(state) {
      state.cart = null
    },

    setIsGoingToDetails(state, action: PayloadAction<boolean>) {
      state.isGoingToCheckout = action.payload
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
      if (action.payload !== undefined) {
        state.cart = action.payload
      }
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
      if (action.payload !== undefined) {
        state.cart = action.payload
      }
      state.isLoading = false
    })
    builder.addCase(removeFromCart.rejected, (state) => {
      state.isLoading = false
    })
  }
})
