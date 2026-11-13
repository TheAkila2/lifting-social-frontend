'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown, Search } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '@/components/layout/Logo'
import api from '@/lib/api'

const mainNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Live', href: '/live' },
  { name: 'Shop', href: '/shop' },
  { name: 'Coaching', href: '/coaching' },
  { name: 'Media', href: '/sports-media' },
  { name: 'Events', href: '/events' },
]

const secondaryNavLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [hasLiveEvents, setHasLiveEvents] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Ensure component is hydrated before rendering user-dependent content
  useEffect(() => {
    setIsHydrated(true)
    console.log('🔵 Navbar hydrated. User from useAuth():', user?.email || 'NULL')
  }, [])
  
  // Debug: Log whenever user changes
  useEffect(() => {
    console.log('🔵 Navbar user changed:', user?.email || 'NULL', '| isHydrated:', isHydrated)
  }, [user, isHydrated])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if any event is currently live to show navbar indicator
  useEffect(() => {
    let isMounted = true

    const hasOngoingSessions = (event: any) => event?.has_ongoing_sessions === true

    const fetchLiveStatus = async () => {
      try {
        let hasLive = false

        try {
          const liveResponse = await api.get('/wl-system/live/events', {
            headers: { 'X-Suppress-Global-Error': '1' }
          })
          const liveNow = Array.isArray(liveResponse.data?.live_now) ? liveResponse.data.live_now : []
          hasLive = liveNow.some(hasOngoingSessions)
        } catch {
          const response = await api.get('/events')
          const events = Array.isArray(response.data) ? response.data : []
          hasLive = events.some(hasOngoingSessions)
        }

        if (isMounted) setHasLiveEvents(hasLive)
      } catch {
        if (isMounted) setHasLiveEvents(false)
      }
    }

    fetchLiveStatus()
    const intervalId = setInterval(fetchLiveStatus, 30000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      setSearchLoading(true)
      api
        .get(`/products/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => {
          setSearchResults(res.data)
          setSearchLoading(false)
        })
        .catch((err) => {
          console.error('Search error:', err)
          setSearchLoading(false)
        })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    // Clean up on unmount
    return () => document.body.classList.remove('overflow-hidden')
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Main Navigation - Single Clean Bar */}
      <nav
        className={`fixed top-[32px] left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-soft border-b border-zinc-100'
            : 'bg-white border-b border-zinc-100'
        }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
            {/* Logo - Left Corner */}
            <Link href="/" className="flex items-center group mr-3 sm:mr-4 shrink-0">
              <Logo />
            </Link>

            {/* Main Navigation - Desktop - Centered */}
            <div className="hidden md:flex items-center space-x-1 sm:space-x-3 md:space-x-6 lg:space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-sans py-2 text-sm md:text-[15px] font-medium tracking-normal transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {link.name}
                    {link.name === 'Live' && hasLiveEvents && (
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1">
              {/* Search - Mobile Hidden */}
              <div className="relative hidden sm:block" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 sm:p-2.5 text-zinc-700 hover:text-zinc-900 transition-colors duration-200"
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2.25} />
                </button>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-zinc-200 z-50 overflow-hidden"
                    >
                      {/* Search Input */}
                      <div className="p-4 border-b border-zinc-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-[8px] focus:outline-none focus:border-zinc-400 transition-colors"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Search Results */}
                      <div className="max-h-[400px] overflow-y-auto">
                        {searchLoading ? (
                          <div className="p-8 text-center text-zinc-500 text-sm">
                            Searching...
                          </div>
                        ) : searchQuery.length < 2 ? (
                          <div className="p-8 text-center text-zinc-500 text-sm">
                            Type at least 2 characters to search
                          </div>
                        ) : searchResults.length === 0 ? (
                          <div className="p-8 text-center text-zinc-500 text-sm">
                            No products found for "{searchQuery}"
                          </div>
                        ) : (
                          <div className="py-2">
                            {searchResults.map((product) => (
                              <Link
                                key={product._id || product.id}
                                href={`/shop/product/${product._id || product.id}`}
                                onClick={() => {
                                  setSearchOpen(false)
                                  setSearchQuery('')
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors"
                              >
                                <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-zinc-100 flex-shrink-0">
                                  {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-zinc-900 truncate">{product.name}</h4>
                                  <p className="text-xs text-zinc-500">{product.category}</p>
                                </div>
                                <div className="text-sm font-bold text-zinc-900">
                                  LKR {product.price?.toLocaleString()}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* View All Link */}
                      {searchResults.length > 0 && (
                        <div className="p-3 border-t border-zinc-100">
                          <Link
                            href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            View all results
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 sm:p-2.5 text-zinc-700 hover:text-zinc-900 transition-colors duration-200"
              >
                <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2.25} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-brand-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Mobile Menu Toggle - Always visible on mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-zinc-800 hover:text-zinc-900 hover:bg-zinc-100 rounded-[10px] transition-all duration-200 flex-shrink-0"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={2.25} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={2.25} />
                )}
              </button>

              {/* User Actions */}
              {isHydrated && user ? (
                <div className="hidden md:block relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors duration-200"
                  >
                    <span className="hidden lg:inline text-sm">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-zinc-100 py-2 z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-zinc-100">
                          <p className="text-sm font-medium text-zinc-900">{user.name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            href={user.role === 'admin' ? '/admin' : '/dashboard'}
                            onClick={() => {
                              console.log('🔗 Dashboard link clicked!')
                              console.log('  User role:', user.role)
                              console.log('  Target href:', user.role === 'admin' ? '/admin' : '/dashboard')
                              setIsUserMenuOpen(false)
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                          >
                            <span>Dashboard</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-zinc-100 py-1">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false)
                              handleLogout()
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : isHydrated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-[8px] sm:rounded-[10px] transition-all duration-200"
                  >
                    Login
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 sm:w-96 bg-white z-50 md:hidden shadow-2xl h-full overflow-y-auto"
            >
              <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                  <Logo />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-[8px] sm:rounded-[10px] transition-all duration-200 flex-shrink-0"
                    title="Close menu"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <div className="space-y-6">
                  {/* Main Links */}
                  <div className="space-y-1">
                    {mainNavLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 text-base font-medium rounded-[10px] transition-all duration-200 ${
                          isActive(link.href)
                            ? 'text-zinc-900 bg-zinc-100'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          {link.name}
                          {link.name === 'Live' && hasLiveEvents && (
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-100" />

                  {/* Secondary Links */}
                  <div className="space-y-1">
                    {secondaryNavLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-base text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  {/* Account Section */}
                  <div className="pt-4 border-t border-zinc-100">
                    {user ? (
                      <div className="space-y-1">
                        <div className="px-4 py-2 mb-2">
                          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Account</p>
                          <p className="text-sm font-medium text-zinc-900 mt-1 truncate">{user.name}</p>
                        </div>
                        <Link
                          href={user.role === 'admin' ? '/admin' : '/dashboard'}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-base text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                        >
                          <User className="w-4 h-4 mr-3 flex-shrink-0" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-base text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-[10px] transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 px-4">
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full py-3 text-center text-base font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-[10px] transition-all duration-200"
                        >
                          Login
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Spacer for fixed navigation */}
      <div className="h-14 sm:h-16 md:h-18" />
    </>
  )
}
