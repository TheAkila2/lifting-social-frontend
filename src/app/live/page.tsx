'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Radio, Trophy } from 'lucide-react'
import api from '@/lib/api'

interface EventItem {
  id: string
  title?: string
  name?: string
  slug?: string
  location?: string
  venue?: string
  start_date?: string
  date?: string
  end_date?: string
  competition_status?: string
  event_status?: string
  status?: string
  cover_image?: string
}

function getEventStatus(event: EventItem) {
  return (event.competition_status || event.event_status || event.status || '').toLowerCase()
}

function getEventTitle(event: EventItem) {
  return event.title || event.name || 'Untitled Event'
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

function getEventPath(event: EventItem, preferLive: boolean) {
  const identifier = event.slug || (isUuid(event.id) ? event.id : event.id)
  if (preferLive) return `/events/${identifier}/live`
  return `/events/${identifier}`
}

export default function LivePage() {
  const [liveNow, setLiveNow] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const liveResponse = await api.get('/wl-system/live/events', {
          headers: { 'X-Suppress-Global-Error': '1' }
        })

        if (isMounted) {
          setLiveNow(Array.isArray(liveResponse.data?.live_now) ? liveResponse.data.live_now : [])
        }
      } catch {
        if (isMounted) {
          setLiveNow([])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    const intervalId = setInterval(load, 30000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-zinc-950 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Live Competitions
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400">
              Real-time competition tracking and quick access to active sessions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events */}
      <section className="container mx-auto px-4 max-w-5xl py-10 sm:py-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-zinc-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : liveNow.length === 0 ? (
          <div className="text-center py-16">
            <Radio className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500">No active competition at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {liveNow.map((event) => (
                <Link
                  key={event.id}
                  href={getEventPath(event, true)}
                  className="group bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                    {event.cover_image ? (
                      <Image
                        src={event.cover_image}
                        alt={getEventTitle(event)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-badge text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Live
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-zinc-900 group-hover:text-brand-accent transition-colors line-clamp-2 leading-tight mb-3">
                      {getEventTitle(event)}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-widest text-red-600 group-hover:text-red-700">
                      Watch live scoreboard →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
