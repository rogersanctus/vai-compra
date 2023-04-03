import { Favourite } from '@/models/favourite'
import { ProductWithFavourite } from '@/models/product'

export function productsMapper(
  products: ProductWithFavourite[],
  favourites: Favourite[]
) {
  if (favourites.length === 0) {
    return [...products]
  }

  return products.map((product) => {
    const favourite = favourites.find(
      (favourite) => favourite.product_external_id === product.id
    )

    return {
      ...product,
      is_favourite: favourite?.is_favourite
    }
  })
}
