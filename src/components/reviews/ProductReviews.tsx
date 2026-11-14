'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, Edit2, Trash2 } from 'lucide-react'
import StarRating from '@/components/shop/StarRating'
import ReviewForm from './ReviewForm'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  created_at: string
  updated_at: string
  helpful_count: number
  verified_purchase: boolean
  users: {
    full_name: string
  }
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ProductReviewsProps {
  productId: string
  productName: string
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [sortBy, setSortBy] = useState('recent')
  const [filterRating, setFilterRating] = useState<number | null>(null)

  useEffect(() => {
    fetchReviews()
    fetchStats()
    if (user) {
      checkUserReview()
    }
  }, [productId, sortBy, filterRating, user])

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({ sortBy })
      if (filterRating) params.append('rating', filterRating.toString())

      const res = await api.get(`/reviews/product/${productId}?${params}`)
      setReviews(res.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await api.get(`/reviews/product/${productId}/stats`)
      setStats(res.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const checkUserReview = async () => {
    try {
      const res = await api.get(`/reviews/check/${productId}`)
      if (res.data.hasReviewed) {
        setUserReview(res.data.review)
      }
    } catch (error) {
      console.error('Error checking user review:', error)
    }
  }

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    fetchReviews()
    fetchStats()
    checkUserReview()
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      await api.delete(`/reviews/${reviewId}`)
      setUserReview(null)
      fetchReviews()
      fetchStats()
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingPercentage = (rating: number) => {
    if (!stats || stats.totalReviews === 0) return 0
    return Math.round((stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100)
  }

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Rating Summary */}
      {stats && stats.totalReviews > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-8 pb-8 border-b border-zinc-100">
          {/* Overall Rating */}
          <div className="flex items-center gap-4">
            <span className="text-4xl font-display font-bold text-zinc-900">
              {stats.averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating rating={stats.averageRating} readonly />
              <p className="text-xs text-zinc-500 mt-1">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`w-full flex items-center gap-3 px-1.5 py-1 rounded transition-colors ${
                  filterRating === rating ? 'bg-zinc-50' : 'hover:bg-zinc-50'
                }`}
              >
                <span className="text-xs text-zinc-500 w-3">{rating}</span>
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 transition-all duration-300"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 w-8 text-right">
                  {getRatingPercentage(rating)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 mb-8 border-b border-zinc-100">
          <Star className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <p className="text-sm text-zinc-500">No reviews yet. Be the first to review this product!</p>
        </div>
      )}

      {/* Write Review / Sign in */}
      {user && !userReview && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-lg transition-colors mb-6"
        >
          Write a Review
        </button>
      )}

      {!user && (
        <a
          href={`/login?redirect=${typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : ''}`}
          className="inline-block text-center px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-lg transition-colors mb-6"
        >
          Sign in to write a review
        </a>
      )}

      {/* User's Review */}
      {userReview && (
        <div className="border border-zinc-100 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">Your Review</p>
              <StarRating rating={userReview.rating} readonly />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setShowReviewForm(true)}
                className="p-2 hover:bg-zinc-50 rounded-lg transition-colors"
                aria-label="Edit review"
              >
                <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              <button
                onClick={() => handleDeleteReview(userReview.id)}
                className="p-2 hover:bg-zinc-50 rounded-lg transition-colors"
                aria-label="Delete review"
              >
                <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          </div>
          <h4 className="font-semibold text-sm text-zinc-900 mb-1.5">{userReview.title}</h4>
          <p className="text-zinc-600 text-sm">{userReview.comment}</p>
          <p className="text-xs text-zinc-400 mt-2">
            Posted on {formatDate(userReview.created_at)}
          </p>
        </div>
      )}

      {/* Sort & Filter */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between gap-3 mb-2 pb-4 border-b border-zinc-100">
          <p className="text-xs text-zinc-500">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            {filterRating && ` with ${filterRating} stars`}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs text-zinc-600 border-none bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      <div className="divide-y divide-zinc-100">
        <AnimatePresence mode="popLayout">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="py-5"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-semibold text-sm text-zinc-900">
                      {review.users?.full_name || 'Anonymous'}
                    </p>
                    {review.verified_purchase && (
                      <span className="text-xs text-zinc-400">· Verified purchase</span>
                    )}
                  </div>
                  <StarRating rating={review.rating} readonly size="sm" />
                </div>
                <p className="text-xs text-zinc-400 shrink-0">
                  {formatDate(review.created_at)}
                </p>
              </div>

              <h4 className="font-semibold text-sm text-zinc-900 mt-3 mb-1.5">{review.title}</h4>
              <p className="text-zinc-600 text-sm leading-relaxed mb-3">
                {review.comment}
              </p>

              <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({review.helpful_count})</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Reviews After Filter */}
      {reviews.length === 0 && stats && stats.totalReviews > 0 && (
        <div className="text-center py-10">
          <p className="text-zinc-500 text-sm mb-3">No reviews match your filter</p>
          <button
            onClick={() => setFilterRating(null)}
            className="text-zinc-900 font-medium text-sm underline underline-offset-2"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            productId={productId}
            productName={productName}
            existingReview={userReview}
            onSuccess={handleReviewSuccess}
            onClose={() => setShowReviewForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
