import { Product } from './product'

export interface CartProduct extends Product {
  amount: number
  isLoading?: boolean
}

export interface Cart {
  id: number
  user_id?: number
  products: CartProduct[]
  open: boolean
}
