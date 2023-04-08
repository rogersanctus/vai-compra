import { ProductsListServer } from './ProductsListServer'
import { TopProducts } from './TopProducts'

export default async function Home() {
  return (
    <div className="bg-slate-100 flex-grow w-full">
      <TopProducts />
      <ProductsListServer />
    </div>
  )
}
