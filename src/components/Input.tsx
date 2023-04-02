import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isAccent?: boolean
  hasError?: boolean
}

function computedClassName({ isAccent, hasError }: InputProps) {
  let className = 'border-neutral-400 focus:ring-sky-500'

  if (hasError) {
    className = 'border-rose-500 focus:ring-rose-500/80'
  } else if (isAccent) {
    className = 'border-orange-600 focus:ring-orange-500/80'
  }

  return className
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isAccent = false, hasError = false, ...props }, ref) => {
    const classes = computedClassName({ isAccent, hasError })

    return (
      <input
        ref={ref}
        {...props}
        className={`w-full outline-none rounded-md px-5 py-2 text-gray-700 border focus:ring
        ${classes}
        ${props.className}
        `}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
