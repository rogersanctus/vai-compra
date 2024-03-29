'use client'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAppSelector } from '@/stores'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { actions } from '@/stores/actions'

const { productsAction } = actions

export const SearchProducts = function () {
  const [search, setSearch] = useState('')
  const [mustHaveAllTerms, setMustHaveAllTerms] = useState(false)

  const isSearching = useAppSelector((state) => state.products.isSearching)

  const router = useRouter()

  async function onSearch() {
    if (isSearching) {
      return
    }

    const searchParams = new URLSearchParams()
    searchParams.set('q', search)

    if (mustHaveAllTerms) {
      searchParams.set('at', '1')
    }

    const searchURL = `/search?${searchParams.toString()}`
    router.push(searchURL)
  }

  useEffect(() => {
    setSearch('')
    setMustHaveAllTerms(false)
    productsAction.clearIsLoading()
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
          isLoading={isSearching}
          disabled={isSearching}
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
