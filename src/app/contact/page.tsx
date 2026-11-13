'use client'

import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'

const CONTACT_METHODS = [
  { icon: FaMapMarkerAlt, label: 'Address', value: 'Colombo, Sri Lanka' },
  { icon: FaPhone, label: 'Phone', value: '+94 76 482 9645' },
  { icon: FaEnvelope, label: 'Email', value: 'theliftingsocial@gmail.com' },
]

const SOCIAL_LINKS = [
  { icon: FaFacebook, href: 'https://web.facebook.com/profile.php?id=61568217705957', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://www.instagram.com/theliftingsocial/', label: 'Instagram' },
  { icon: FaWhatsapp, href: 'https://wa.me/94764829645', label: 'WhatsApp' },
]

export default function ContactPage() {
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 sm:mb-4">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400">
              Have questions? Reach out through any of the channels below and we&apos;ll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact info */}
      <section className="py-14 sm:py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center">
            {CONTACT_METHODS.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-zinc-700 text-lg" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">
                  {label}
                </h3>
                <p className="text-zinc-900 font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Follow Us
            </h3>
            <div className="flex items-center justify-center gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
