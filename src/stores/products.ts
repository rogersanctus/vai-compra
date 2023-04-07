import { clientFetch } from '@/lib/clientFetch'
import { productsMapper } from '@/lib/productsHelper'
import { Favourite } from '@/models/favourite'
import { Product, ProductWithFavourite } from '@/models/product'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const SliceName = 'products'

export interface Products {
  isLoading?: boolean
  isSearching?: boolean
  products: ProductWithFavourite[]
  product: ProductWithFavourite | null
  searchingTerms: string | null
}

const initialState: Products = {
  isLoading: true,
  isSearching: false,
  products: [],
  product: null,
  searchingTerms: null
}

// This fetch must always return a list. Do not rethrow anything
async function fetchFavourites(abortSignal: AbortSignal): Promise<Favourite[]> {
  try {
    const response = await clientFetch('/api/users/favourites', {
      signal: abortSignal
    })

    if (!response.ok) {
      throw new Error('Could not get the favourites list')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

async function fetchAllProducts(abortSignal: AbortSignal): Promise<Product[]> {
  const response = await clientFetch('/api/products', {
    signal: abortSignal
  })

  if (!response.ok) {
    throw new Error('Could not get product list')
  }

  try {
    const products = await response.json()
    return products
  } catch (error) {
    console.error(error)
  }

  return []
}

export const fetchProduct = createAsyncThunk(
  `${SliceName}/fetchProduct`,
  async (productId: number, thunkApi) => {
    const response = await clientFetch(`/api/products/${productId}`, {
      signal: thunkApi.signal
    })

    if (!response.ok) {
      throw new Error('Could not get product list')
    }

    const product = await response.json()
    return product
  }
)

export const fetchProducts = createAsyncThunk(
  `${SliceName}/fetchProducts`,
  (_, thunkApi) => fetchAllProducts(thunkApi.signal)
)

export const searchProducts = createAsyncThunk(
  `${SliceName}/searchProducts`,
  async (
    {
      search,
      mustHaveAllTerms
    }: {
      search: string
      mustHaveAllTerms: boolean
    },
    thunkApi
  ): Promise<ProductWithFavourite[]> => {
    if (!search || search.trim().length === 0) {
      return fetchAllProducts(thunkApi.signal)
    }

    async function fetchProducts(): Promise<Product[]> {
      const searchParams = new URLSearchParams()
      searchParams.set('search', search)
      searchParams.set('all-terms', String(mustHaveAllTerms))

      const queryStr = `/api/products?${searchParams.toString()}`
      const response = await clientFetch(queryStr, {
        signal: thunkApi.signal
      })

      if (!response.ok) {
        throw new Error('Could not search for products')
      }

      const result = await response.json()
      return result
    }

    const [favourites, products] = await Promise.all([
      fetchFavourites(thunkApi.signal),
      fetchProducts()
    ])

    return productsMapper(products, favourites)
  }
)

export const products = createSlice({
  name: SliceName,
  initialState,
  reducers: {
    setSearchingTerms: (state, action: PayloadAction<string | null>) => {
      state.searchingTerms = action.payload
    },
    updateProductOnList: (
      state,
      action: PayloadAction<Partial<ProductWithFavourite>>
    ) => {
      const toFound = action.payload
      const foundIndex = state.products.findIndex(
        (product) => product.id === toFound.id
      )

      const previous = state.products[foundIndex]

      if (foundIndex !== -1) {
        const copy = [...state.products]
        const newProduct = {
          ...previous,
          ...toFound
        } as ProductWithFavourite

        copy.splice(foundIndex, 1, newProduct)

        return {
          ...state,
          products: copy
        }
      }
    },
    setProductList(state, action: PayloadAction<ProductWithFavourite[]>) {
      state.products = action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    clearIsLoading(state) {
      state.isLoading = false
    },
    resetProducts(state) {
      state.products = []
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
      state.isSearching = true
    })
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.products = action.payload
      state.isSearching = false
    })
    builder.addCase(searchProducts.rejected, (state) => {
      state.isSearching = false
    })
  }
})
