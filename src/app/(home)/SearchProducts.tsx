'use client'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAppDispatch, useAppSelector } from '@/stores'
import { searchProducts } from '@/stores/products'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { actions } from '@/stores/actions'

const { productsAction } = actions

export const SearchProducts = function () {
  const [search, setSearch] = useState('')
  const [mustHaveAllTerms, setMustHaveAllTerms] = useState(false)
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state) => state.products.isLoading)

  const router = useRouter()

  async function onSearch() {
    productsAction.setSearchingTerms(search)
    await dispatch(searchProducts({ search, mustHaveAllTerms }))
    router.push('/search')
  }

  useEffect(() => {
    setSearch('')
    setMustHaveAllTerms(false)
    productsAction.reset()
  }, [])

  return (
    <div className="flex flex-col w-full mx-14">
      <div className="flex">
        <Input
          name="serch-product"
          placeholder="Produto ou descrição"
          className="flex-grow w-full"
          isAccent
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button
          className="ml-2"
          variant="secondary"
          size="md"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={onSearch}
        >
          Buscar
        </Button>
      </div>
      <div className="flex items-center mt-4 gap-2">
        <input
          type="checkbox"
          name="must-have-all-terms"
          checked={mustHaveAllTerms}
          className="bg-amber-500 text-amber-500 w-6 h-6 rounded cursor-pointer"
          onChange={() => setMustHaveAllTerms(!mustHaveAllTerms)}
        />
        <label htmlFor="must-have-all-terms" className="text-white">
          Incluir apenas resultados com todos os termos?
        </label>
      </div>
    </div>
  )
} as unknown as () => JSX.Element
