import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`${props.className} rounded-md px-5 py-2 text-gray-700 border border-orange-600 focus:outline focus:outline-[3px] focus:outline-orange-500/90`}
    />
  )
}
