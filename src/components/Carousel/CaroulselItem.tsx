import { useEffect, useRef } from 'react'

interface CarouselItemProps {
  children: React.ReactNode
  onMount: (element: HTMLDivElement) => void
  showItems?: number
  gap: number
}

export function CarouselItem({
  children,
  showItems = 3,
  gap,
  onMount
}: CarouselItemProps) {
  const container = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    onMount(container.current!)
  }, [container, onMount])

  return (
    <>
      <div
        className={`flex flex-col flex-none min-h-[300px] p-2 border border-slate-300 rounded shadow cursor-pointer hover:shadow-lg`}
        ref={container}
        style={{
          marginLeft: `${gap / 2}px`,
          marginRight: `${gap / 2}px`,
          width: `calc(100%/${showItems} - ${1 * gap}px)`
        }}
      >
        {children}
      </div>
    </>
  )
}
