import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isAccent?: boolean
}

export function Input({ isAccent = false, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`${
        props.className
      } outline-none rounded-md px-5 py-2 text-gray-700 border ${
        isAccent ? 'border-orange-600' : 'border-neutral-400'
      } focus:ring ${
        isAccent ? 'focus:ring-orange-500/90' : 'focus:ring-sky-500'
      }`}
    />
  )
}
