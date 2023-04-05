import { Products } from '@/stores/products'
import { Product } from './product'

export interface CartProduct extends Product {
  amount: number
}

export interface Cart {
  id: number
  user_id?: number
  products: Products[]
  open: boolean
}
