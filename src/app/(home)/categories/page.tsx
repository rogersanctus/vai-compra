import { localFetch } from '@/app/localApi'
import { Product } from '@/models/product'
import { redirect } from 'next/navigation'
import { ProductsList } from '../ProducstList'
import { CategoriesTranslated } from '../consts'

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

  const response = await localFetch(`/api/products/categories?name=${name}`)

  if (response.ok) {
    products = await response.json()
  }

  return (
    <div>
      <ProductsList products={products} category={categoryName} />
    </div>
  )
}
