'use client'

import { SyncLoader } from 'react-spinners'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig)

const color = fullConfig.theme?.colors?.sky as Record<string, string>

interface LoadingOverlayProps {
  isLoading?: boolean
}

export function LoadingOverlay({ isLoading = false }: LoadingOverlayProps) {
  if (!isLoading) {
    return null
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/10">
      <SyncLoader color={color ? color['500'] : 'blue'} />
    </div>
  )
}
