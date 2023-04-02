import { ButtonHTMLAttributes } from 'react'
import './button.css'

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
}

export function Button({
  children,
  variant = 'primary',
  squared = false,
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${props.className} button button-${variant} button-${size} ${
        squared ? 'rounded-none' : 'rounded-md'
      } px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:saturate-50`}
    >
      {children}{' '}
    </button>
  )
}
