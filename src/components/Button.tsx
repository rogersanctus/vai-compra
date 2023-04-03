import { ButtonHTMLAttributes } from 'react'
import './button.css'
import { BeatLoader, SyncLoader } from 'react-spinners'

export const Variants = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error',
  'dark'
] as const
export type Variant = (typeof Variants)[number]

export const Sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export type Size = (typeof Sizes)[number]

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  squared?: boolean
  size?: Size
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  squared = false,
  size = 'md',
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${props.className} button button-${variant} button-${size} ${
        squared ? 'rounded-none' : 'rounded-md'
      } min-w-max px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:saturate-50`}
    >
      {isLoading ? (
        <div className="">
          <BeatLoader size={8} color="white" margin={1} speedMultiplier={0.8} />
        </div>
      ) : (
        children
      )}
    </button>
  )
}
