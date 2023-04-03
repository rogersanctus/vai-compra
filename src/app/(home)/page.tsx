import { Categories } from './Categories'
import { ProductsList } from './ProducstList'
import { TopProducts } from './TopProducts'

export default async function Home() {
  return (
    <main className="bg-slate-100 h-full w-full">
      <Categories />
      <TopProducts />
      <ProductsList />
    </main>
  )
}
