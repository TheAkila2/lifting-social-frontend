'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Camera, Mail, Phone, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface GalleryImage {
  id: string
  title: string
  image_url: string
  alt_text: string
  category: string
}

const OFFERINGS = [
  'Competition photography',
  'Training session documentation',
  'Athlete portraits and profiles',
  'Event highlights and coverage',
  'Team and gym photography',
  'High-resolution digital delivery',
]

const PHOTOGRAPHERS = [
  {
    name: 'Bhanuka Gamachige',
    role: 'Lead Photographer',
    image: '/images/photographers/bhanuka-gamachige.jpg',
    bio: 'Professional photographer at Lifting Social. Bhanuka specialises in capturing the raw intensity of competition lifts and the quieter moments behind the platform, turning training sessions, meets, and athlete portraits into images worth keeping.',
  },
]

export default function PhotographyPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) throw new Error('API URL not configured')
        const response = await fetch(`${apiUrl}/gallery?limit=100`, {
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const json = await response.json()
        const data = json.data || json
        if (Array.isArray(data)) {
          setGalleryImages(data.filter((img: GalleryImage) => img.category === 'Competition'))
        }
      } catch (err) {
        console.warn('Photography gallery fetch failed', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b border-zinc-100">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/sports-media"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sports Media
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-zinc-950 py-10 sm:py-14 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Sports Photography
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400">
              Capturing the power, intensity, and emotion of weightlifting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What we offer */}
      <section className="container mx-auto px-4 max-w-5xl py-10 sm:py-14">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What we offer</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Photography for serious athletes & meets
          </h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {OFFERINGS.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-zinc-100 shadow-soft rounded-[12px] text-sm text-zinc-700"
            >
              <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Gallery */}
      <section className="bg-zinc-50 py-10 sm:py-14 border-t border-zinc-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Our work</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Recent captures
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[12px] bg-zinc-200 animate-pulse"
                />
              ))}
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="bg-white border border-zinc-100 rounded-[12px] py-14 text-center">
              <Camera className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No gallery images yet.</p>
              <p className="text-xs text-zinc-400 mt-1">Images appear here as soon as they're uploaded from the admin.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {galleryImages.map((image, idx) => (
                  <motion.button
                    key={image.id}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: Math.min(idx, 8) * 0.04 }}
                    onClick={() => setSelectedImage(image)}
                    className="group relative aspect-square bg-zinc-200 rounded-[12px] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                    aria-label={`View ${image.title || 'gallery image'}`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || image.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  </motion.button>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-zinc-400">
                Tap any image to view it full size
              </p>
            </>
          )}
        </div>
      </section>

      {/* Photographers */}
      <section className="container mx-auto px-4 max-w-5xl py-10 sm:py-14">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Meet the team</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Our photographers
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {PHOTOGRAPHERS.map((p) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group bg-white border border-zinc-100 rounded-[16px] overflow-hidden shadow-sm hover:shadow transition-shadow max-w-[260px] sm:max-w-none mx-auto w-full"
            >
              <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                <Image
                  src={p.image}
                  alt={`${p.name}, ${p.role}`}
                  fill
                  sizes="(min-width: 640px) 280px, 260px"
                  className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{p.role}</p>
                <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-zinc-900">{p.name}</h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{p.bio}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Book */}
      <section className="container mx-auto px-4 max-w-3xl py-10 sm:py-14">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Book a session</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Let's talk
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <a
            href="tel:+94764829645"
            className="group flex items-center gap-3 p-4 bg-white rounded-[12px] border border-zinc-100 shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center text-zinc-700 transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Phone</p>
              <p className="text-sm font-semibold text-zinc-900 truncate">+94 76 482 9645</p>
            </div>
          </a>
          <a
            href="mailto:theliftingsocial@gmail.com"
            className="group flex items-center gap-3 p-4 bg-white rounded-[12px] border border-zinc-100 shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center text-zinc-700 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email</p>
              <p className="text-sm font-semibold text-zinc-900 truncate">theliftingsocial@gmail.com</p>
            </div>
          </a>
        </div>
      </section>

      {/* Image lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Close image"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || selectedImage.title}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
