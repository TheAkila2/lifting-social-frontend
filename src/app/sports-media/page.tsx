'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, Video } from 'lucide-react'

interface GalleryImage {
  id: string
  title: string
  image_url: string
  alt_text: string
  category: string
}

interface ServiceCardProps {
  href: string
  eyebrow: string
  title: string
  description: string
  image: GalleryImage | null
  icon: React.ReactNode
  delay?: number
}

export default function SportsMediaPage() {
  const [coverImages, setCoverImages] = useState<{
    photography: GalleryImage | null
    events: GalleryImage | null
  }>({ photography: null, events: null })

  useEffect(() => {
    ;(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) return
        const response = await fetch(`${apiUrl}/gallery?limit=100`)
        if (!response.ok) throw new Error('Failed to fetch')
        const json = await response.json()
        const images = json.data || json
        const list: GalleryImage[] = Array.isArray(images) ? images : []
        const photographyImage =
          list.find((img) => ['Competition', 'Training', 'Moments'].includes(img.category)) || null
        const eventsImage = list.find((img) => img.category === 'Events') || null
        setCoverImages({ photography: photographyImage, events: eventsImage })
      } catch (err) {
        console.warn('Sports media covers fetch failed', err)
      }
    })()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Hero — matches events / coaching dark header */}
      <section className="bg-zinc-950 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Booking Media Support
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400">
              Professional photography and live event coverage built for weightlifting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service cards */}
      <section className="container mx-auto px-4 max-w-5xl py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <ServiceCard
            href="/sports-media/photography"
            eyebrow="Sports Photography"
            title="Capture the lift"
            description="High-impact photography of competitions, training and athlete portraits, delivered ready to publish."
            image={coverImages.photography}
            icon={<Camera className="w-14 h-14 text-white/40" />}
          />
          <ServiceCard
            href="/sports-media/live-events"
            eyebrow="Live Events"
            title="Stream every PR"
            description="Multi-camera live streaming, real-time graphics, and a polished highlight reel after the event."
            image={coverImages.events}
            icon={<Video className="w-14 h-14 text-white/40" />}
            delay={0.05}
          />
        </div>
      </section>
    </main>
  )
}

function ServiceCard({
  href,
  eyebrow,
  title,
  description,
  image,
  icon,
  delay = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group h-full"
    >
      <Link
        href={href}
        className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1 h-full flex flex-col"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
          {image ? (
            <>
              <Image
                src={image.image_url}
                alt={image.alt_text || title}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">{icon}</div>
          )}
          <span className="absolute top-4 left-4 px-3 py-1 rounded-badge bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-wider text-zinc-900">
            {eyebrow}
          </span>
        </div>

        {/* Info */}
        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 group-hover:text-brand-accent transition-colors leading-tight">
            {title}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
            {description}
          </p>
          <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-900 group-hover:text-brand-accent transition-colors">
              Explore
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
