'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'md',
  showLabel = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const displayRating = readonly ? rating : (hoverRating || rating)

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
    }
  }

  const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
            className={`transition-all duration-150 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                star <= displayRating
                  ? 'fill-zinc-900 text-zinc-900'
                  : 'text-zinc-300'
              }`}
            />
          </button>
        ))}
      </div>
      
      {showLabel && !readonly && hoverRating > 0 && (
        <span className="text-sm font-medium text-zinc-700">
          {ratingLabels[hoverRating - 1]}
        </span>
      )}

      {readonly && rating > 0 && (
        <span className="text-sm font-medium text-zinc-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
