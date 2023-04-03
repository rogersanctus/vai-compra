import { productsMapper } from '@/lib/productsHelper'
import { Favourite } from '@/models/favourite'
import { Product, ProductWithFavourite } from '@/models/product'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const SliceName = 'products'

export interface Products {
  isLoading?: boolean
  products: ProductWithFavourite[]
  product: ProductWithFavourite | null
  searchingTerms: string | null
}

const initialState: Products = {
  isLoading: true,
  products: [],
  product: null,
  searchingTerms: null
}

// This fetch must always return a list. Do not rethrow anything
async function fetchFavourites(): Promise<Favourite[]> {
  try {
    const response = await fetch('/api/users/favourites')

    if (!response.ok) {
      throw new Error('Could not get the favourites list')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')

  if (!response.ok) {
    throw new Error('Could not get product list')
  }

  const products = await response.json()
  return products
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
  fetchAllProducts
)

export const searchProducts = createAsyncThunk(
  `${SliceName}/searchProducts`,
  async ({
    search,
    mustHaveAllTerms
  }: {
    search: string
    mustHaveAllTerms: boolean
  }): Promise<ProductWithFavourite[]> => {
    if (!search || search.trim().length === 0) {
      return fetchAllProducts()
    }

    async function fetchProducts(): Promise<Product[]> {
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

    const [favourites, products] = await Promise.all([
      fetchFavourites(),
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
