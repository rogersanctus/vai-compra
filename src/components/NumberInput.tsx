import debounce from 'lodash/debounce'
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
}

type Timeout = ReturnType<typeof setTimeout>

const DEBOUNCE_TIME = 500
const ONCHANGE_DEBOUNCE_TIME = 1000

export function NumberInput({
  value,
  isLoading = false,
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

  const onAddDebounced = debounce(() => {
    onAdd(Number(value))
  }, DEBOUNCE_TIME)

  const onRemoveDebounced = debounce(() => {
    onRemove(Number(value))
  }, DEBOUNCE_TIME)

  function onChangeInput(event: ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value
    setValue(newValue)

    lastTime.current = new Date().getTime()

    if (lastTimeout.current) {
      clearTimeout(lastTimeout.current)
    }

    lastTimeout.current = setTimeout(() => {
      const currentTime = new Date().getTime()

      if (currentTime - lastTime.current! >= ONCHANGE_DEBOUNCE_TIME) {
        onChange(Number(newValue))
      }
    }, ONCHANGE_DEBOUNCE_TIME)
  }

  return (
    <div className="flex flex-none ml-auto w-[200px] relative">
      <Button
        variant="secondary"
        title="Remover um produto"
        onClick={onRemoveDebounced}
        className="w-12"
        disabled={isLoading}
      >
        -
      </Button>
      <Input
        type="text"
        value={localValue}
        onChange={onChangeInput}
        className="mx-1 text-center"
        disabled={isLoading}
      />
      <Button
        variant="secondary"
        title="Adicionar um produto"
        onClick={onAddDebounced}
        className="w-12"
        disabled={isLoading}
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