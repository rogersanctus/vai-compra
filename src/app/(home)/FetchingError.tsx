interface FetchingErrorProps {
  categoryName?: string
}

export function FetchingError({
  categoryName = undefined
}: FetchingErrorProps) {
  return (
    <div className="p-20 h-full">
      <p className="text-2xl text-zinc-700">
        <span>
          Ocorreu um erro enquanto tentavamos trazer os produtos
          {categoryName ? ' da categoria' : ''}
        </span>
        {categoryName ? (
          <span className="font-bold">{' ' + categoryName}.</span>
        ) : null}
      </p>
      <p className="text-lg text-sky-800">
        Por favor, recarregue a página e tente novamente.
      </p>
    </div>
  )
}
