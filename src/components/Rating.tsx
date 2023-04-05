import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface RatingProps {
  rate: number
  className?: string
}

const MAX_STARS = 5

export function Rating({ rate, className }: RatingProps) {
  const stars = Math.ceil(rate)
  const starsArray = Array.from(Array(stars).keys())
  const allStarsArray = Array.from(Array(MAX_STARS).keys())

  return (
    <div className={className}>
      <div className="relative">
        <div className="flex">
          {allStarsArray.map((key) => (
            <div key={key} className="w-6 h-6">
              <StarIcon className="  text-gray-400" />
            </div>
          ))}
        </div>
        <div className="flex absolute top-0">
          {starsArray.map((key) => (
            <div key={key} className="w-6 h-6">
              <StarIconSolid className="  text-yellow-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
