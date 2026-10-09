'use client'

import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  MapPin,
  Mail,
  Phone,
  Heart,
  ArrowUp,
  ArrowRight,
} from 'lucide-react'


export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-zinc-950 text-white relative">
      {/* Top Gradient Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 col-span-full">
               {/* Social SVG Illustration */}
              <div className="mb-6 sm:mb-8">
                <img 
                  src="/social.svg" 
                  alt="Social Media Connect" 
                  className="w-32 h-32 sm:w-40 sm:h-40 opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-sm">
                Fusing Olympic weightlifting culture,
                and modern fitness fashion into one inspiring community.
              </p>
              
             
              
              {/* Social Links */}
              <div className="flex space-x-3 mb-8">
                <a
                  href="https://web.facebook.com/profile.php?id=61568217705957"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-800 hover:bg-brand-accent rounded-[10px] flex items-center justify-center transition-all duration-250 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </a>
                <a
                  href="https://www.instagram.com/theliftingsocial?igsh=MXBoenJvdzlzZTBsZQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-800 hover:bg-brand-accent rounded-[10px] flex items-center justify-center transition-all duration-250 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-800 hover:bg-brand-accent rounded-[10px] flex items-center justify-center transition-all duration-250 group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </a>
                <a
                  href="https://wa.me/94764829645"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-800 hover:bg-brand-accent rounded-[10px] flex items-center justify-center transition-all duration-250 group"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </a>
              </div>


            </div>

            {/* Shop Links */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-sm sm:text-base mb-3 sm:mb-5 text-white">Shop</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { name: 'All Products', href: '/shop' },
                  { name: 'Apparel', href: '/shop/apparel' },
                  { name: 'Accessories', href: '/shop/accessories' },
                  { name: 'Supplements', href: '/shop/supplements' },
                 
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>



            {/* Company Links */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-sm sm:text-base mb-3 sm:mb-5 text-white">Company</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Privacy Policy', href: '/privacy-policy' },
                  { name: 'Terms & Conditions', href: '/terms' },
                  { name: 'Refund Policy', href: '/refund-policy' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://admin.theliftingsocial.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                  >
                    <span>WL System Admin Login</span>
                    <ArrowRight className="w-3 h-3 ml-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-sm sm:text-base mb-3 sm:mb-5 text-white">Contact</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Colombo, Sri Lanka</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">theliftingsocial@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">+94 76 482 9645</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-zinc-500 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Lifting Social. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-zinc-500 text-xs sm:text-sm hidden md:inline">
                Strength • Community • Excellence
              </span>
              
              <button
                onClick={scrollToTop}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-zinc-800 hover:bg-blue-600 rounded-[8px] flex items-center justify-center transition-all duration-250 group"
                title="Scroll to top"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
