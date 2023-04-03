import Link from 'next/link'
import { localFetch } from '../localApi'

export const Categories = async function () {
  let categories: string[] = []

  try {
    const response = await localFetch('/api/products/categories')

    if (response.ok) {
      const categoriesData = await response.json()

      categories = categoriesData
    }
  } catch (error) {
    console.error(error)
  }

  return (
    <div className="bg-slate-200 p-4 border-b border-gray-300">
      <div className="flex items-center px-20">
        <span className="font-bold uppercase drop-shadow-sm mr-10 text-sky-700">
          Categorias
        </span>
        <ul className="flex">
          {categories.map((category) => (
            <li
              key={category}
              className="[&:not(:last-child)]:border-r border-slate-400 [&:not(:first-child)]:pl-4 [&:not(:last-child)]:pr-4"
            >
              <Link
                href={`/product/category/${category}`}
                className="text-lg font-semibold uppercase text-slate-500 hover:text-slate-400"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} as unknown as () => JSX.Element
