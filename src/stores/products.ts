import { Product } from '@/models/product'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const SliceName = 'products'

export interface Products {
  isLoading?: boolean
  products: Product[]
  product: Product | null
  searchingTerms: string | null
}

const initialState: Products = {
  isLoading: true,
  products: [],
  product: null,
  searchingTerms: null
}

export const fetchProduct = createAsyncThunk(
  `${SliceName}/fetchProduct`,
  async (productId: number) => {
    const response = await fetch(`/api/products/${productId}`)

    if (!response.ok) {
      throw new Error('Could not get product list')
    }

    const product = await response.json()
    return product
  }
)

export const fetchProducts = createAsyncThunk(
  `${SliceName}/fetchProducts`,
  async () => {
    const response = await fetch('/api/products')

    if (!response.ok) {
      throw new Error('Could not get product list')
    }

    const products = await response.json()
    return products
  }
)

export const searchProducts = createAsyncThunk(
  `${SliceName}/searchProducts`,
  async ({
    search,
    mustHaveAllTerms
  }: {
    search: string
    mustHaveAllTerms: boolean
  }) => {
    const queryStr = encodeURI(
      `/api/products?search=${search}&all-terms=${mustHaveAllTerms}`
    )
    const response = await fetch(queryStr)

    if (!response.ok) {
      throw new Error('Could not search for products')
    }

    const result = await response.json()
    return result
  }
)

export const products = createSlice({
  name: SliceName,
  initialState,
  reducers: {
    setSearchingTerms: (state, action: PayloadAction<string | null>) => {
      state.searchingTerms = action.payload
    },
    reset: () => {
      return { ...initialState, isLoading: false }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.product = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchProduct.rejected, (state) => {
      state.isLoading = false
    })

    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchProducts.rejected, (state) => {
      state.isLoading = false
    })

    builder.addCase(searchProducts.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.products = action.payload
      state.isLoading = false
    })
    builder.addCase(searchProducts.rejected, (state) => {
      state.isLoading = false
    })
  }
})
