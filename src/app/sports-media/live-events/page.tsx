'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Mail, Phone, Radio, Users, Wifi } from 'lucide-react'

const SERVICES = [
  {
    icon: Wifi,
    title: 'Live Streaming',
    description:
      'Multi-camera live streams to YouTube, Facebook, or a custom platform, with professional commentary support.',
  },
  {
    icon: Camera,
    title: 'Event Documentation',
    description:
      'Full video capture of every lift, ceremony, and key moment, edited into a highlight reel delivered post-event.',
  },
  {
    icon: Radio,
    title: 'Real-time Updates',
    description:
      'Live scoring graphics, result overlays, and social media integration to keep audiences engaged throughout.',
  },
  {
    icon: Users,
    title: 'On-site Team',
    description:
      'A professional crew managing cameras, audio, graphics and streaming so you can focus on running the meet.',
  },
]

const INCLUDED = [
  'Multi-camera setup and switching',
  'Professional audio mixing',
  'Live graphics and overlays',
  'Instant replay capabilities',
  'High-definition recording',
  'Post-event highlight videos',
  'Social media coverage',
  'On-site technical support',
]

export default function LiveEventsPage() {
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
              Live Sports Events
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400">
              Professional live streaming and event coverage for weightlifting competitions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service cards */}
      <section className="container mx-auto px-4 max-w-5xl py-10 sm:py-14">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Coverage</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Complete event coverage
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
            From local meets to national championships, we handle the technical side so you can run a great event.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {SERVICES.map(({ icon: Icon, title, description }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="bg-white rounded-[12px] border border-zinc-100 shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-4 sm:p-5"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3 text-zinc-700">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-zinc-900">{title}</h3>
              <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="bg-zinc-50 border-t border-zinc-100 py-10 sm:py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Included</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              What you get
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-zinc-100 shadow-soft rounded-[12px] text-sm text-zinc-700"
              >
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-3xl py-10 sm:py-14">
        <div className="bg-zinc-950 rounded-[12px] p-6 sm:p-9 text-center text-white">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
            Planning an event?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 mb-5 sm:mb-6 max-w-xl mx-auto">
            Get a custom quote tailored to your event size and platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
            <a
              href="tel:+94764829645"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call now
            </a>
            <a
              href="mailto:theliftingsocial@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
