'use client'

import { useEffect, useRef, useState } from 'react'
import { CarouselItem } from './CaroulselItem'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface CarouselProps {
  items: React.ReactNode[]
}

export function Carousel({ items }: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const screenEl = useRef<HTMLDivElement | null>(null)
  const container = useRef<HTMLDivElement | null>(null)
  const itemEl = useRef<HTMLDivElement | null>(null)
  const showItems = Math.min(items.length, 3)
  const gap = 16

  useEffect(() => {
    setCurrent(0)
  }, [])

  useEffect(() => {
    function onResize() {
      const totalWidth = container.current?.clientWidth ?? 0
      const itemWidth = totalWidth / showItems

      if (container.current) {
        container.current.style.transform = `translatex(calc(${
          -current * itemWidth
        }px))`
      }
    }

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [current, showItems])

  function onItemMount(container: HTMLDivElement) {
    itemEl.current = container
  }

  function onNext() {
    const totalWidth = container.current?.clientWidth ?? 0
    const itemWidth = totalWidth / showItems
    const newpos = current + 1

    if (current >= items.length - showItems) {
      return
    }

    setCurrent(newpos)

    if (container.current) {
      container.current.style.transform = `translatex(calc(${
        -newpos * itemWidth
      }px))`
    }
  }

  function onPrevious() {
    const totalWidth = container.current?.clientWidth ?? 0
    const itemWidth = totalWidth / showItems
    const newpos = current - 1

    if (newpos < 0) {
      return
    }

    setCurrent(current - 1)

    if (container.current) {
      container.current.style.transform = `translatex(calc(${
        -newpos * itemWidth
      }px))`
    }
  }

  return (
    <div
      className={`flex flex-grow relative mr-4`}
      style={{ marginLeft: `-${gap / 2}px` }}
    >
      <div ref={screenEl} className="flex-grow flex overflow-x-hidden py-6">
        <div
          ref={container}
          className={`flex flex-grow transition-transform duration-500 ease-out `}
        >
          {items.map((item, idx) => (
            <CarouselItem
              onMount={onItemMount}
              key={idx}
              showItems={showItems}
              gap={gap}
            >
              {item}
            </CarouselItem>
          ))}
        </div>
      </div>
      {current === 0 ? null : (
        <button
          className="text-gray-300 bg-zinc-50 rounded-full border border-zinc-200 shadow-md absolute hover:drop-shadow-lg left-0 top-1/2 -translate-y-1/2 w-16 h-16 p-4"
          style={{ marginLeft: `calc(-1*(2rem - ${gap / 2}px))` }}
          onClick={onPrevious}
          disabled={current === 0}
        >
          <ChevronLeftIcon />
        </button>
      )}
      {current === items.length - showItems ? null : (
        <button
          className="text-gray-300 bg-zinc-50 rounded-full border border-zinc-200 shadow-md absolute hover:drop-shadow-lg right-0 top-1/2 -translate-y-1/2 w-16 h-16 p-4"
          style={{ marginRight: `calc(-1*(2rem - ${gap / 2}px))` }}
          onClick={onNext}
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  )
}
