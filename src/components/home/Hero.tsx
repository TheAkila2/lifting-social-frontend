'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroSlide {
  id: string
  image_url: string
  link_url?: string | null
}

const AUTOPLAY_MS = 3000

interface StageMetrics {
  tx: number      // peek horizontal offset (% of slide width)
  tz: number      // peek depth recession (px, applied as negative)
  ry: number      // peek tilt angle (deg, applied with sign per side)
  scale: number   // peek scale factor (active is always 1)
  perspective: number
}

const STAGE_DESKTOP: StageMetrics = { tx: 58, tz: 220, ry: 32, scale: 0.85, perspective: 1600 }
const STAGE_TABLET: StageMetrics = { tx: 52, tz: 200, ry: 28, scale: 0.82, perspective: 1500 }
const STAGE_MOBILE: StageMetrics = { tx: 38, tz: 140, ry: 22, scale: 0.72, perspective: 1200 }

/**
 * Normalize an admin-provided link string into a `{url, external}` pair so
 * the hero carousel can route correctly regardless of how the admin typed it.
 *
 *   "https://eventbrite.com/x"  → external https URL, new tab
 *   "//cdn.example.com/foo"     → external, new tab
 *   "mailto:a@b.com" / "tel:..." → external (browser handles it)
 *   "www.example.com"           → treated as external, prefixed https://
 *   "example.com/foo"           → treated as external, prefixed https://
 *   "/events/foo"               → internal, same tab via router
 *   "events/foo"                → internal, normalized to /events/foo
 */
function parseSlideLink(raw: string): { url: string; external: boolean } {
  if (raw.startsWith('//')) return { url: raw, external: true }
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return { url: raw, external: true }
  if (raw.startsWith('/')) return { url: raw, external: false }
  // Looks like a bare hostname (contains a dot, no whitespace) — treat as external.
  if (raw.includes('.') && !/\s/.test(raw)) {
    return { url: `https://${raw}`, external: true }
  }
  // Plain word — treat as an internal app path.
  return { url: `/${raw}`, external: false }
}

export default function Hero() {
  const router = useRouter()
  const [slides, setSlides] = React.useState<HeroSlide[]>([])
  const [loaded, setLoaded] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [stage, setStage] = React.useState<StageMetrics>(STAGE_DESKTOP)
  const count = slides.length

  React.useEffect(() => {
    const compute = () => {
      if (window.matchMedia('(max-width: 639px)').matches) setStage(STAGE_MOBILE)
      else if (window.matchMedia('(max-width: 1023px)').matches) setStage(STAGE_TABLET)
      else setStage(STAGE_DESKTOP)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  React.useEffect(() => {
    let cancelled = false
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero-carousel`)
        if (!res.ok) throw new Error('Failed to load hero slides')
        const json = await res.json()
        const items: HeroSlide[] = Array.isArray(json?.data) ? json.data : []
        if (!cancelled) setSlides(items)
      } catch (err) {
        console.warn('Hero carousel fetch failed', err)
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }
    fetchSlides()
    return () => {
      cancelled = true
    }
  }, [])

  const go = React.useCallback(
    (next: number) => {
      if (count === 0) return
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  React.useEffect(() => {
    if (paused || count <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, count])

  React.useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Shortest-path circular offset — keeps the slide direction intuitive when
  // wrapping (last → first should slide forward, not spin all the way back).
  const offsetOf = React.useCallback(
    (i: number) => {
      const raw = i - index
      const half = count / 2
      if (raw > half) return raw - count
      if (raw < -half) return raw + count
      return raw
    },
    [index, count]
  )

  const handleSlideClick = (slide: HeroSlide, i: number) => {
    const raw = slide.link_url?.trim()

    if (raw) {
      const { url, external } = parseSlideLink(raw)
      // Lightweight debug log so you can see in the browser console why a
      // click did or didn't navigate. Remove once everything's verified.
      console.log('[hero-carousel] click →', { raw, url, external })
      if (external) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        router.push(url)
      }
      return
    }

    console.log('[hero-carousel] click: slide has no link_url, advancing carousel', slide)
    if (i !== index) {
      go(i)
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100 h-[100svh] flex flex-col items-center justify-between sm:justify-start pt-4 pb-4 sm:pt-8 sm:pb-6 px-4 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured slides"
    >
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      {loaded && count === 0 ? (
        <div className="text-center max-w-xl px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
            Hero carousel is empty
          </h2>
          <p className="text-zinc-600">
            Upload slides from the admin panel to see them appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Premium minimal header — centered, compact. Sits right under the navbar with
              minimal breathing space so the carousel can fit in the viewport below it. */}
          <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 text-center mb-3 sm:mb-4">
            <h1 className="font-display text-[28px] sm:text-3xl lg:text-4xl xl:text-5xl leading-[1.05] font-bold tracking-tight text-zinc-900">
              Built for Champions
            </h1>
            <p className="mt-1.5 text-zinc-500 text-xs sm:text-sm font-medium">
              Engineered for Performance
            </p>
            <p className="mt-2 mx-auto max-w-[280px] sm:max-w-md text-zinc-500 text-[11px] sm:text-[13px] leading-relaxed">
              Sri Lanka&apos;s home for weightlifting: premium gear, elite coaching, and live competition coverage in one place.
            </p>
            <nav className="mt-3 sm:mt-4 flex items-center justify-center gap-6 sm:gap-8 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-zinc-700">
              <Link href="/shop" className="hover:text-accent active:text-accent transition-colors">Shop</Link>
              <Link href="/coaching" className="hover:text-accent active:text-accent transition-colors">Coaching</Link>
              <Link href="/events" className="hover:text-accent active:text-accent transition-colors">Events</Link>
              <Link href="/sports-media" className="hover:text-accent active:text-accent transition-colors">Media</Link>
            </nav>
          </div>

          {/* 3D stage — heights sized to consume the remaining viewport below the intro.
              flex-1 grows to fill all available space within the section. */}
          <div
            className="relative mx-auto w-full max-w-7xl flex-1 min-h-0 h-[70vw] max-h-[380px] sm:h-auto sm:max-h-none"
            style={{ perspective: `${stage.perspective}px` }}
          >
            <div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {slides.map((slide, i) => (
                <Slide
                  key={slide.id}
                  slide={slide}
                  offset={offsetOf(i)}
                  stage={stage}
                  onClick={() => handleSlideClick(slide, i)}
                />
              ))}
            </div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous slide"
                  className="absolute left-1 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-sm transition hover:bg-white sm:left-6 sm:h-11 sm:w-11"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next slide"
                  className="absolute right-1 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-sm transition hover:bg-white sm:right-6 sm:h-11 sm:w-11"
                >
                  <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === index
                      ? 'w-8 bg-zinc-900'
                      : 'w-2 bg-zinc-300 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Mobile-only scroll cue — anchors the layout, signals more content below */}
          <div className="sm:hidden flex flex-col items-center gap-1.5 text-zinc-400">
            <span className="text-[9px] font-semibold uppercase tracking-[0.32em]">Scroll</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" strokeWidth={2.5} />
          </div>
        </>
      )}
    </section>
  )
}

function Slide({
  slide,
  offset,
  stage,
  onClick,
}: {
  slide: HeroSlide
  offset: number
  stage: StageMetrics
  onClick: () => void
}) {
  const abs = Math.abs(offset)
  const isActive = offset === 0
  const isAdjacent = abs === 1
  const visible = abs <= 1

  const translateX = offset === 0 ? 0 : offset * stage.tx
  const translateZ = isActive ? 0 : -stage.tz
  const rotateY = offset === 0 ? 0 : offset > 0 ? -stage.ry : stage.ry
  const scale = isActive ? 1 : stage.scale
  const opacity = isActive ? 1 : isAdjacent ? 0.6 : 0
  const zIndex = isActive ? 30 : isAdjacent ? 20 : 0

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? 'Featured slide' : 'Go to slide'}
      tabIndex={isActive ? 0 : -1}
      className="absolute left-1/2 top-1/2 aspect-square h-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 transition-all duration-700 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-zinc-900"
      style={{
        transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        opacity,
        zIndex,
        pointerEvents: visible ? 'auto' : 'none',
        filter: isActive ? 'none' : 'brightness(0.5)',
        willChange: 'transform, opacity, filter',
      }}
    >
      <Image
        src={slide.image_url}
        alt=""
        fill
        aria-hidden
        sizes="(min-width: 1280px) 55vh, (min-width: 1024px) 48vh, (min-width: 640px) 42vh, 70vw"
        className="object-cover scale-110 blur-2xl opacity-60 pointer-events-none"
        draggable={false}
      />
      <Image
        src={slide.image_url}
        alt="Hero slide"
        fill
        priority={isActive}
        sizes="(min-width: 1280px) 55vh, (min-width: 1024px) 48vh, (min-width: 640px) 42vh, 70vw"
        className="object-contain pointer-events-none"
        draggable={false}
      />
    </button>
  )
}
