'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart, CartItem } from '@/contexts/CartContext'
import Link from 'next/link'
import { FaArrowLeft, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'

export const dynamic = 'force-dynamic'

function CheckoutContent() {
  const { items: cartItems, totalPrice: cartTotalPrice, totalShipping: cartTotalShipping } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isBuyNow = searchParams.get('buyNow') === '1'

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    saveInfo: false,
    shippingMethod: 'standard',
    paymentMethod: 'card',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isBuyNow) {
      const stored = sessionStorage.getItem('buyNowItem')
      if (stored) setBuyNowItem(JSON.parse(stored))
    }
    setMounted(true)
  }, [isBuyNow])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        window.dispatchEvent(new Event('cartUpdate'))
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const items = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cartItems

  const subtotal = isBuyNow
    ? (buyNowItem ? buyNowItem.price * buyNowItem.quantity : 0)
    : cartTotalPrice
  const shipping = isBuyNow
    ? (buyNowItem?.shippingType === 'paid' ? buyNowItem.shippingAmount || 0 : 0)
    : cartTotalShipping
  const total = subtotal + shipping

  // Redirect if there's nothing to check out
  useEffect(() => {
    if (!mounted) return
    if (isBuyNow && !buyNowItem) {
      router.push('/shop')
    } else if (!isBuyNow && cartItems.length === 0) {
      router.push('/cart')
    }
  }, [mounted, isBuyNow, buyNowItem, cartItems.length, router])

  if (!mounted || items.length === 0) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
      if (!token) {
        alert('Please login to complete your order')
        router.push('/login?redirect=/checkout')
        return
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode || '',
          phone: formData.phone,
        },
        billingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode || '',
          phone: formData.phone,
        },
        shippingMethod: formData.shippingMethod,
        shippingCost: shipping,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create order')
      }

      const { order } = await response.json()

      if (isBuyNow) {
        sessionStorage.removeItem('buyNowItem')
      }

      // Create a Payments.lk hosted checkout and send the customer there.
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order.id }),
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to initiate payment')
      }

      const { checkoutUrl } = await paymentResponse.json()
      window.location.href = checkoutUrl
    } catch (error: any) {
      console.error('Checkout error:', error)
      const errorMessage = error.message || 'Failed to complete order. Please try again.'
      alert(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-10 sm:pt-14 pb-12 sm:pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <Link
            href={isBuyNow ? '/shop' : '/cart'}
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 mb-3 transition-colors"
          >
            <FaArrowLeft className="mr-2 text-xs" /> {isBuyNow ? 'Back to Shop' : 'Back to Cart'}
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-zinc-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-display text-lg font-bold mb-4 text-zinc-900">Delivery Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-zinc-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.firstName ? 'border-red-400' : 'border-zinc-200'} rounded-lg focus:outline-none focus:border-zinc-900 transition-colors`}
                        placeholder="Karlos"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-zinc-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.lastName ? 'border-red-400' : 'border-zinc-200'} rounded-lg focus:outline-none focus:border-zinc-900 transition-colors`}
                        placeholder="Nazar"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-zinc-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.phone ? 'border-red-400' : 'border-zinc-200'} rounded-lg focus:outline-none focus:border-zinc-900 transition-colors`}
                      placeholder="+94 77 123 4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-zinc-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.address ? 'border-red-400' : 'border-zinc-200'} rounded-lg focus:outline-none focus:border-zinc-900 transition-colors`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-zinc-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.city ? 'border-red-400' : 'border-zinc-200'} rounded-lg focus:outline-none focus:border-zinc-900 transition-colors`}
                        placeholder="Colombo"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-zinc-700">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors"
                        placeholder="10100"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                      className="w-4 h-4 accent-zinc-900"
                    />
                    <span className="text-sm text-zinc-600">
                      Save this information for next time
                    </span>
                  </label>
                </div>
              </motion.div>

              {/* Shipping Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="pt-8 border-t border-zinc-100"
              >
                <h2 className="font-display text-lg font-bold mb-4 text-zinc-900">Shipping Method</h2>

                <label className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleChange}
                      className="accent-zinc-900"
                    />
                    <div>
                      <span className="text-sm font-medium text-zinc-900">Standard Delivery</span>
                      <p className="text-xs text-zinc-500">3-5 business days</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">{shipping === 0 ? 'FREE' : `LKR ${shipping.toLocaleString()}`}</span>
                </label>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-8 border-t border-zinc-100"
              >
                <h2 className="font-display text-lg font-bold mb-4 text-zinc-900">Payment Method</h2>

                <label className="flex items-center p-4 border border-zinc-200 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="mr-3 accent-zinc-900"
                  />
                  <div>
                    <span className="text-sm font-medium text-zinc-900">Credit / Debit Card</span>
                    <p className="text-xs text-zinc-500 mt-0.5">Secure payment processing via Payments.lk</p>
                  </div>
                </label>
              </motion.div>

              {/* Order Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-8 border-t border-zinc-100"
              >
                <h2 className="font-display text-lg font-bold mb-4 text-zinc-900">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 transition-colors"
                  placeholder="Any special instructions for your order..."
                />
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-50 rounded-2xl p-6 lg:sticky lg:top-24"
              >
                <h2 className="font-display text-lg font-bold mb-4 text-zinc-900">Order Summary</h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-zinc-200">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color || ''}`} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500">Size: {item.size} · Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 shrink-0">LKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 mb-6 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span>LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `LKR ${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-zinc-900 pt-2.5 border-t border-zinc-200">
                    <span>Total</span>
                    <span>LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-sm bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <FaLock className="text-xs" />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-xs text-zinc-400 text-center mt-4">
                  By placing an order, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-zinc-600">Terms</Link>,{' '}
                  <Link href="/privacy-policy" className="underline hover:text-zinc-600">Privacy Policy</Link>, and{' '}
                  <Link href="/refund-policy" className="underline hover:text-zinc-600">Refund Policy</Link>
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  )
}
