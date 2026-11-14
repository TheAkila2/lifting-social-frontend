'use client'

import { motion } from 'framer-motion'

interface ShopCategoryHeaderProps {
  title: string
  subtitle: string
}

export default function ShopCategoryHeader({ title, subtitle }: ShopCategoryHeaderProps) {
  return (
    <section className="bg-zinc-950 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 sm:mb-4">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 px-4">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
