'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-zinc-900 mb-3 sm:mb-4">
              About Lifting Social
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-500 px-4">
              More than a brand. We're a movement celebrating Sri Lankan weightlifting culture
            </p>
          </motion.div>
        </div>
      </section>

      {/* Banner */}
      <div className="relative w-full aspect-[2658/984]">
        <Image
          src="/images/banner.png"
          alt="LiftingSocial covering Sri Lankan weightlifting"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Story */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-20 md:py-24 px-4">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 text-center mb-8 sm:mb-10">
              The Story Behind LiftingSocial
            </h2>

            <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 text-base sm:text-lg leading-relaxed text-zinc-600">
              <p>
                It all started in 2023, when founder Akila Jayakody recognised something missing in Sri
                Lankan Olympic weightlifting: a genuine connection between the sport, its athletes, and
                the people who support it. Athletes deserved greater recognition, competitions deserved
                wider exposure, and fans deserved a closer connection to the sport.
              </p>
              <p>
                Driven by this vision, Akila began documenting hundreds of athletes and competitions,
                travelling across Sri Lanka to capture weightlifting in action. What started as a passion
                for bringing the sport closer to its people grew into Sri Lanka&rsquo;s first Olympic
                weightlifting brand and sports technology initiative.
              </p>
            </div>

            <p className="mt-8 text-center text-xl sm:text-2xl font-display font-semibold text-zinc-900">
              That vision became LiftingSocial.
            </p>
            <p className="mt-2 text-center text-sm sm:text-base text-zinc-500">
              And the passion that started it all continues to shape everything we do.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14 sm:mt-20 max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-1 ring-zinc-200 shrink-0">
                <Image
                  src="/images/founder-1.jpg"
                  alt="Akila Jayakody – Founder & Director of Lifting Social"
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 tracking-tight">
                Akila Jayakody
              </h3>
            </div>

              <div className="mt-6 space-y-4 text-zinc-700 text-base sm:text-lg leading-relaxed">
                <p>
                  <span className="text-zinc-900 font-semibold">Akila Jayakody is the owner of Lifting Social</span>,
                  as well as its founder and director. He is a{' '}
                  <span className="text-zinc-900 font-semibold">software engineer</span> and
                  a <span className="text-zinc-900 font-semibold">BSc in Computer Science</span> graduate
                  from the <span className="text-zinc-900 font-semibold">University of Colombo</span>.
                  An Olympic weightlifter since 2018, he holds
                  {' '}<span className="text-zinc-900 font-semibold">Sri Lanka University weightlifting meet records</span> and
                  represents Sri Lanka as a <span className="text-zinc-900 font-semibold">national athlete</span>.
                </p>
                <p>
                  In <span className="text-zinc-900 font-semibold">2023</span>, Akila founded and now owns{' '}
                  <span className="text-zinc-900 font-semibold">Lifting Social</span> to bridge two
                  worlds he knows intimately, technology and the iron platform, and to give Sri Lankan
                  lifters the brand, community, and tools they deserve. As the sole owner of Lifting
                  Social, he leads the brand&rsquo;s vision, operations, and growth.
                </p>
              </div>

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="mt-8 border-l-2 border-zinc-900 pl-4 sm:pl-5"
              >
                <p className="text-base sm:text-lg italic text-zinc-800">
                  &ldquo;Every lift in Sri Lanka deserves a stage. Lifting Social is that stage,
                  built by lifters, Built for Champions.&rdquo;
                </p>
                <footer className="mt-2 text-xs sm:text-sm text-zinc-500">
                  Akila Jayakody
                </footer>
              </motion.blockquote>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 sm:py-20 md:py-24 px-4 bg-zinc-50">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 text-center mb-8 sm:mb-10">
              Our Mission
            </h2>

            <blockquote className="border-l-2 border-zinc-900 pl-5 sm:pl-6 mb-8 sm:mb-10">
              <p className="text-lg sm:text-xl italic text-zinc-800 leading-relaxed">
                &ldquo;To elevate Sri Lankan Olympic weightlifting by creating a platform that connects
                athletes, celebrates achievements, provides quality gear, and inspires the next
                generation of champions.&rdquo;
              </p>
            </blockquote>

            <div className="space-y-5 text-base sm:text-lg leading-relaxed text-zinc-600">
              <p>
                Today, we work alongside some of the greatest weightlifters of this generation, creating
                performance-driven clothing and equipment designed to support their pursuit of
                excellence. We bring these products to the fans who share the same passion, building a
                community that stands behind its athletes, celebrates their achievements, and contributes
                to the continued growth and accessibility of the sport.
              </p>
              <p>
                We believe weightlifting is more than a sport. It is a community built on strength,
                dedication, discipline, and passion.
              </p>
            </div>

            <div className="mt-10 text-center space-y-1">
              <p className="text-base sm:text-lg font-bold text-zinc-900">
                When you choose LiftingSocial, you choose Weightlifting.
              </p>
              <p className="text-base sm:text-lg font-bold text-zinc-900">
                LiftingSocial: Built by Champions&trade;.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
