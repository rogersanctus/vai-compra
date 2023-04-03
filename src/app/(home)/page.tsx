import { ProductsList } from './ProducstList'
import { TopProducts } from './TopProducts'

export default async function Home() {
  return (
    <div className="bg-slate-100 h-full w-full">
      <TopProducts />
      <ProductsList />
    </div>
  )
}
