export default function Loading() {
  return (
    <div className="relative h-screen w-screen">
      <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-neutral-400/50">
        <span className="text-3xl text-white font-bold drop-shadow-lg">
          Loading...
        </span>
      </div>
    </div>
  )
}
