import { LoadingOverlay } from '@/components/LoadingOverlay'

export default function Loading() {
  return (
    <div className="flex-grow relative">
      <LoadingOverlay isLoading />
    </div>
  )
}
