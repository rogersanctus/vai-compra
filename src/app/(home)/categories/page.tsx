import { Product } from '@/models/product'
import { redirect } from 'next/navigation'
import { CategoriesTranslated } from '../consts'
import { ProductsListServer } from '../ProductsListServer'
import { getProductsByCategory } from '@/lib/services/products'

export default async function Categories({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const name = searchParams['name']
  const categoryName =
    name && name in CategoriesTranslated ? CategoriesTranslated[name] : name

  if (!name || name === 'all') {
    return redirect('/')
  }

  let products: Product[] = []

  try {
    products = await getProductsByCategory(name)
  } catch (error) {
    console.info(error)
  }

  return (
    <div>
      <ProductsListServer products={products} category={categoryName} />
    </div>
  )
}
