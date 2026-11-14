'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'
import Link from 'next/link'

const POLL_INTERVAL_MS = 2000
const MAX_POLLS = 10

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')
  const [orderId, setOrderId] = useState<string>('')

  useEffect(() => {
    const order_id = searchParams.get('order_id')

    if (!order_id) {
      setStatus('failed')
      return
    }

    setOrderId(order_id)

    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    let cancelled = false
    let pollCount = 0

    // The redirect back here proves nothing on its own (the docs are explicit
    // about this) - the order's real payment_status is only trustworthy once
    // our backend's webhook has updated it. Poll briefly for that to land.
    const poll = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error('Failed to fetch order')
        const { order } = await response.json()

        if (cancelled) return

        if (order.payment_status === 'completed') {
          setStatus('success')
          return
        }
        if (order.payment_status === 'failed') {
          setStatus('failed')
          return
        }
      } catch {
        // keep polling; a transient fetch error shouldn't flip the UI to failed
      }

      pollCount += 1
      if (pollCount >= MAX_POLLS) {
        if (!cancelled) setStatus('failed')
        return
      }
      if (!cancelled) setTimeout(poll, POLL_INTERVAL_MS)
    }

    poll()

    return () => {
      cancelled = true
    }
  }, [searchParams])

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12 flex items-center justify-center px-4">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">Processing Payment...</h1>
          <p className="text-sm sm:text-base text-gray-600">Please wait while we verify your payment</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <FaCheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-4 sm:mb-6" />
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Payment Successful!</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Your payment has been processed successfully.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href={`/order-confirmation/${orderId}`}
              className="block w-full py-2.5 sm:py-3 bg-black text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-900 transition-colors"
            >
              View Order Details
            </Link>
            <Link
              href="/shop"
              className="block w-full py-2.5 sm:py-3 bg-white text-black border-2 border-black rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <FaTimesCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto mb-4 sm:mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Payment Failed</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/checkout"
            className="block w-full py-2.5 sm:py-3 bg-black text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-900 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/cart"
            className="block w-full py-2.5 sm:py-3 bg-white text-black border-2 border-black rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12 flex items-center justify-center px-4">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
