import Link from 'next/link'
import { CategoriesTranslated } from './consts'
import { getCategories } from '@/lib/services/products'

export const Categories = async function () {
  let categories: { name: string; link: string; translated: string }[] = []

  try {
    const categoriesRaw = await getCategories()

    categories = categoriesRaw.map((category) => {
      const params = new URLSearchParams()
      params.set('name', category)

      return {
        name: category,
        link: `/categories?${params.toString()}`,
        translated:
          category in CategoriesTranslated
            ? CategoriesTranslated[category]
            : category
      }
    })
  } catch (error) {
    console.info(error)
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
              key={category.name}
              className="[&:not(:last-child)]:border-r border-slate-400 [&:not(:first-child)]:pl-4 [&:not(:last-child)]:pr-4"
            >
              <Link
                href={category.link}
                className="text-lg font-semibold uppercase text-slate-500 hover:text-slate-400"
              >
                {category.translated}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} as unknown as () => JSX.Element
