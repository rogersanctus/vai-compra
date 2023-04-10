export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
  isLoading?: boolean
}

export interface ProductWithFavourite extends Product {
  is_favourite?: boolean
}

export interface PurchaseProduct extends Product {
  is_billed: boolean
  is_missing: boolean
  amount: number
}
