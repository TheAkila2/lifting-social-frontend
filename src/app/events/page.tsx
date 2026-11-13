'use client'

import { useState, useEffect, Suspense } from 'react'
import EventsHeader from '@/components/events/EventsHeader'
import EventsGrid from '@/components/events/EventsGrid'
import { getEvents } from '@/lib/api'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  event_type: 'meet' | 'competition' | 'training' | 'seminar' | 'news' | 'announcement'
  location?: string
  venue?: string
  start_date: string
  end_date?: string
  cover_image?: string
  organizer?: string
  max_participants?: number
  current_participants?: number
  entry_fee?: number
}

function EventsContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const data = await getEvents()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <>
      <EventsHeader />
      <div className="container-custom section-padding">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[12px] overflow-hidden border border-zinc-100 animate-pulse">
                <div className="aspect-[3/2] bg-zinc-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-zinc-200 rounded w-1/4" />
                  <div className="h-5 bg-zinc-200 rounded w-3/4" />
                  <div className="h-4 bg-zinc-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EventsGrid events={events} />
        )}
      </div>
    </>
  )
}

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="container-custom section-padding">
          <div className="animate-pulse">
            <div className="h-32 bg-zinc-200 rounded-lg mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-zinc-200 rounded-lg aspect-[3/2]" />
              ))}
            </div>
          </div>
        </div>
      }>
        <EventsContent />
      </Suspense>
    </div>
  )
}
