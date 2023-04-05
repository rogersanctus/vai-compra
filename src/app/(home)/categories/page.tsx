import { Product } from '@/models/product'
import { redirect } from 'next/navigation'
import { CategoriesTranslated } from '../consts'
import { ProductsListServer } from '../ProductsListServer'
import { getProductsByCategory } from '@/lib/services/products'
import { cookies } from 'next/headers'
import { mapProductsWithFavourites } from '../favourites'

export const dynamic = 'force-dynamic'

export default async function Categories({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const name = Array.isArray(searchParams['name'])
    ? searchParams['name'][0]
    : searchParams['name']

  const categoryName =
    name && name in CategoriesTranslated ? CategoriesTranslated[name] : name

  if (!name || name === 'all') {
    return redirect('/')
  }

  let products: Product[] = []

  try {
    const cookiesList = cookies()
    products = await mapProductsWithFavourites<string>(
      cookiesList,
      getProductsByCategory,
      name
    )
  } catch (error) {
    console.info(error)
  }

  return (
    <div>
      <ProductsListServer products={products} category={categoryName} />
    </div>
  )
}
