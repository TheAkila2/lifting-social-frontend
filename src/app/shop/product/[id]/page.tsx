'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaShoppingCart,
  FaChevronRight,
  FaChevronDown,
  FaCheckCircle,
  FaMinus,
  FaPlus,
  FaTruck,
} from 'react-icons/fa'
import api from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import ProductReviews from '@/components/reviews/ProductReviews'
import RatingSummary from '@/components/reviews/RatingSummary'
import RelatedProducts from '@/components/shop/RelatedProducts'
import { addToRecentlyViewed } from '@/components/shop/RecentlyViewed'

interface Product {
  _id: string
  id?: string
  name: string
  description: string
  price: number
  comparePrice?: number
  category: string
  image: string
  images?: string[]
  inStock: boolean
  sizes?: string[]
  colors?: string[]
  material?: string
  care?: string
  features?: string[]
  servings?: string
  shippingType?: 'free' | 'paid'
  shippingAmount?: number
}

function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-zinc-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 sm:py-5 text-left"
      >
        <span className="font-semibold text-sm sm:text-base text-zinc-900">{title}</span>
        <FaChevronDown className={`text-zinc-400 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-5 sm:pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [openSection, setOpenSection] = useState<'description' | 'details' | 'reviews' | null>('description')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/products/${params.id}`)
        const productData = response.data
        setProduct(productData)

        addToRecentlyViewed(params.id as string)

        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0])
        }
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0])
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product._id || product.id || '',
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.image,
      shippingType: product.shippingType || 'free',
      shippingAmount: product.shippingAmount || 0,
    })

    alert(`Added ${quantity} ${product.name} to cart!`)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const toggleSection = (section: 'description' | 'details' | 'reviews') => {
    setOpenSection(prev => (prev === section ? null : section))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-10 sm:pt-14 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64 sm:h-96">
            <p className="text-zinc-500">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-10 sm:pt-14 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4">Product not found</h2>
            <Link href="/shop" className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 font-semibold">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image]

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white pt-10 sm:pt-14 lg:pt-16 pb-12 lg:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 mb-6 lg:mb-8">
          <Link href="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="capitalize">{product.category}</span>
          <FaChevronRight className="text-[8px]" />
          <span className="text-zinc-900 font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 lg:mb-20">
          {/* Images */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`relative bg-zinc-50 rounded-2xl overflow-hidden flex items-center justify-center ${
                product.category === 'supplements'
                  ? 'h-72 sm:h-80 md:h-96'
                  : 'aspect-square'
              }`}
            >
              {images[selectedImage] ? (
                <div
                  className={`absolute inset-0 ${
                    product.category === 'supplements'
                      ? 'bg-contain bg-no-repeat bg-center'
                      : 'bg-cover bg-center'
                  }`}
                  style={{ backgroundImage: `url(${images[selectedImage]})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                  <span className="text-zinc-400 font-bold text-lg sm:text-xl">
                    {product.name}
                  </span>
                </div>
              )}

              {!product.inStock && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-zinc-900 font-semibold text-sm uppercase tracking-widest">Out of stock</span>
                </div>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all border ${
                      selectedImage === index
                        ? 'border-zinc-900'
                        : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {img ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-100" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {product.category}
            </span>

            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-zinc-900 leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 pb-5 border-b border-zinc-100">
              <RatingSummary productId={product._id || product.id || params.id as string} />
            </div>

            <div className="mt-5 flex items-baseline flex-wrap gap-3">
              <span className="text-3xl sm:text-4xl font-display font-bold text-zinc-900">
                LKR {product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-zinc-400 line-through">
                  LKR {product.comparePrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-semibold text-red-600">
                  Save {discount}%
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              {product.inStock ? (
                <>
                  <FaCheckCircle className="text-green-600 text-xs" />
                  <span className="text-zinc-600">In stock</span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Out of stock</span>
              )}
            </div>

            {product.shippingType === 'free' ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
                <FaTruck className="text-zinc-400 text-xs" />
                <span>Free delivery on this product</span>
              </div>
            ) : product.shippingType === 'paid' ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
                <FaTruck className="text-zinc-400 text-xs" />
                <span>Shipping: LKR {product.shippingAmount?.toLocaleString()}</span>
              </div>
            ) : null}

            {/* Size/Flavour Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6 space-y-3">
                <label className="block text-zinc-900 font-semibold text-sm">
                  {product.category === 'supplements' ? 'Flavour' : 'Size'}: <span className="font-normal text-zinc-500">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                        selectedSize === size
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6 space-y-3">
                <label className="block text-zinc-900 font-semibold text-sm capitalize">
                  Color: <span className="font-normal text-zinc-500">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border capitalize ${
                        selectedColor === color
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex items-center border border-zinc-200 rounded-lg shrink-0">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 hover:bg-zinc-50 transition-colors rounded-l-lg"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FaMinus className="text-zinc-900 text-xs" />
                </button>
                <span className="px-4 text-zinc-900 font-semibold min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 hover:bg-zinc-50 transition-colors rounded-r-lg"
                  aria-label="Increase quantity"
                >
                  <FaPlus className="text-zinc-900 text-xs" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white py-3.5 rounded-lg hover:bg-zinc-800 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaShoppingCart className="text-base" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Accordion sections */}
        <div className="max-w-3xl">
          <AccordionSection
            title="Description"
            isOpen={openSection === 'description'}
            onToggle={() => toggleSection('description')}
          >
            <p className="text-zinc-600 leading-relaxed">{product.description}</p>
            {product.features && product.features.length > 0 && (
              <ul className="mt-5 space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <FaCheckCircle className="text-zinc-400 mt-1 shrink-0 text-xs" />
                    <span className="whitespace-pre-wrap text-zinc-600 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </AccordionSection>

          <AccordionSection
            title="Details"
            isOpen={openSection === 'details'}
            onToggle={() => toggleSection('details')}
          >
            <div className="space-y-3 text-sm">
              {product.category === 'supplements' && product.servings && (
                <div className="flex gap-2">
                  <span className="text-zinc-400 min-w-[120px]">Servings</span>
                  <span className="text-zinc-700">{product.servings}</span>
                </div>
              )}
              {product.category !== 'supplements' && product.material && (
                <div className="flex gap-2">
                  <span className="text-zinc-400 min-w-[120px]">Material</span>
                  <span className="text-zinc-700">{product.material}</span>
                </div>
              )}
              {product.category !== 'supplements' && product.care && (
                <div className="flex gap-2">
                  <span className="text-zinc-400 min-w-[120px]">Care</span>
                  <span className="text-zinc-700">{product.care}</span>
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-zinc-400 min-w-[120px]">
                    {product.category === 'supplements' ? 'Flavours' : 'Sizes'}
                  </span>
                  <span className="text-zinc-700">{product.sizes.join(', ')}</span>
                </div>
              )}
              {product.category !== 'supplements' && product.colors && product.colors.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-zinc-400 min-w-[120px]">Colors</span>
                  <span className="text-zinc-700 capitalize">{product.colors.join(', ')}</span>
                </div>
              )}
            </div>
          </AccordionSection>

          <AccordionSection
            title="Reviews"
            isOpen={openSection === 'reviews'}
            onToggle={() => toggleSection('reviews')}
          >
            <ProductReviews
              productId={product._id || product.id || params.id as string}
              productName={product.name}
            />
          </AccordionSection>
        </div>

        {/* Related Products */}
        <div className="mt-14 lg:mt-20">
          <RelatedProducts productId={params.id as string} limit={6} />
        </div>
      </div>
    </div>
  )
}
