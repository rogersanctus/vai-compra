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
