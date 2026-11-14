'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { FaTrash, FaShoppingBag, FaMinus, FaPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, totalShipping } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-white pt-10 sm:pt-14 pb-12 sm:pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 text-zinc-900">Shopping Cart</h1>
          <p className="text-zinc-500 text-sm">
            {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16 sm:py-20">
            <FaShoppingBag className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2 text-zinc-900">Your cart is empty</h2>
            <p className="text-zinc-500 text-sm mb-6">Add some products to get started!</p>
            <Link href="/shop" className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold text-sm hover:bg-zinc-800 transition-colors">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 divide-y divide-zinc-100">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color || ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="py-5 first:pt-0"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-zinc-50 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-zinc-900 mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-zinc-500">
                          Size: {item.size}{item.color ? ` · Color: ${item.color}` : ''}
                        </p>
                        <p className="text-zinc-900 font-semibold mt-1.5 sm:hidden">LKR {item.price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <div className="flex items-center border border-zinc-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1, item.color)}
                            className="p-2 text-zinc-900 hover:bg-zinc-50 transition-colors rounded-l-lg"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <FaMinus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-semibold w-8 text-center text-sm text-zinc-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.color)}
                            className="p-2 text-zinc-900 hover:bg-zinc-50 transition-colors rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            <FaPlus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <p className="hidden sm:block font-semibold text-zinc-900 min-w-[90px] text-right">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </p>

                        <button
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <button
                onClick={clearCart}
                className="mt-5 text-sm text-zinc-400 hover:text-red-600 transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 rounded-2xl p-6 sticky top-24">
                <h2 className="font-display text-lg font-bold mb-4 text-zinc-900">Order Summary</h2>

                <div className="space-y-2.5 mb-6 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span>{totalShipping === 0 ? 'FREE' : `LKR ${totalShipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-zinc-900 pt-2.5 border-t border-zinc-200">
                    <span>Total</span>
                    <span>LKR {(totalPrice + totalShipping).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 text-sm bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/shop"
                    className="block w-full text-center py-3.5 text-sm border border-zinc-200 text-zinc-900 hover:bg-white rounded-lg font-semibold transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
