'use client'

import { Suspense } from 'react'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopCategoryNav from '@/components/shop/ShopCategoryNav'
import ShopCategoryHeader from '@/components/shop/ShopCategoryHeader'

function BeltsContent() {
  return (
    <>
      <ShopCategoryHeader title="Belts" subtitle="Weightlifting and powerlifting belts. Core support and stability for heavy lifts." />

      <ShopCategoryNav />

      <div className="bg-zinc-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <ProductGrid filters={{ category: 'accessories', subcategory: 'Belts', sizes: [], priceRange: null, inStockOnly: false }} />
        </div>
      </div>
    </>
  )
}

export default function BeltsPage() {
  return <div className="min-h-screen"><Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="animate-pulse"><div className="h-32 bg-zinc-200 rounded-lg mb-8" /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="bg-zinc-200 rounded-lg aspect-square" />))}</div></div></div>}><BeltsContent /></Suspense></div>
}
