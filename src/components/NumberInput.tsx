import { Button } from './Button'
import { Input } from './Input'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { MoonLoader } from 'react-spinners'

interface NumberInputProps {
  onAdd: (value: number) => void
  onRemove: (value: number) => void
  onChange: (value: number) => void
  value: number
  isLoading?: boolean
  min?: number
  max?: number
}

type Timeout = ReturnType<typeof setTimeout>

const ONCHANGE_DEBOUNCE_TIME = 1000

export function NumberInput({
  value,
  isLoading = false,
  min = 0,
  max,
  onAdd,
  onRemove,
  onChange
}: NumberInputProps) {
  const [localValue, setValue] = useState('')
  const lastTimeout = useRef<Timeout | null>(null)
  const lastTime = useRef<number | null>(null)

  useEffect(() => {
    setValue(value.toString())
  }, [value])

  function onIncrease() {
    const numValue = Number(localValue)

    if (max && numValue >= max) {
      return
    }

    const newValue = numValue + 1
    setValue(newValue.toString())
    onAdd(newValue)
  }

  function onDecrease() {
    const numValue = Number(localValue)

    if (numValue <= min) {
      return
    }

    const newValue = numValue - 1
    setValue(newValue.toString())
    onRemove(newValue)
  }

  function onChangeInput(event: ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value
    const numValue = Number(newValue)

    const minNum = Math.max(numValue, min)
    const adjusted = max ? Math.min(minNum, max) : minNum

    setValue(adjusted.toString())

    lastTime.current = new Date().getTime()

    if (lastTimeout.current) {
      clearTimeout(lastTimeout.current)
    }

    lastTimeout.current = setTimeout(() => {
      const currentTime = new Date().getTime()

      if (currentTime - lastTime.current! >= ONCHANGE_DEBOUNCE_TIME) {
        onChange(adjusted)
      }
    }, ONCHANGE_DEBOUNCE_TIME)
  }

  return (
    <div className="flex flex-none ml-auto w-[200px] relative">
      <Button
        variant="secondary"
        title="Decrease"
        onClick={onDecrease}
        className="w-12"
        disabled={isLoading || Number(localValue) === min}
      >
        -
      </Button>
      <Input
        type="text"
        value={localValue}
        onChange={onChangeInput}
        className="mx-1 text-center max-w-[100px]"
        disabled={isLoading}
      />
      <Button
        variant="secondary"
        title="Increase"
        onClick={onIncrease}
        className="w-12"
        disabled={isLoading || Number(localValue) === max}
      >
        +
      </Button>
      {isLoading ? (
        <div className="absolute flex left-0 w-full top-0 h-full bg-black/10 cursor-not-allowed">
          <div className="relative flex-grow flex items-center justify-center">
            <MoonLoader color="black" size={22} speedMultiplier={0.8} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
