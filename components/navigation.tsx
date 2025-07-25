'use client'

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubscribeHovered, setIsSubscribeHovered] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Toggle blur on main content when Subscribe is hovered
  useEffect(() => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      if (isSubscribeHovered) {
        mainContent.classList.add('blur-active')
      } else {
        mainContent.classList.remove('blur-active')
      }
    }
  }, [isSubscribeHovered])

  return (
    <nav className={`sticky top-0 z-50 bg-black text-white border-b border-gray-800 ${isSubscribeHovered ? 'blur-nav' : ''}`}>
      <div className="max-w-[1360px] mx-auto px-4 py-3 overflow-visible">
        <div className="flex items-center justify-between overflow-visible">
            <Link
              href="/"
              className="flex items-center group py-2 -my-2 px-2 -mx-2 overflow-visible"
            >
            <svg className="h-[26px] overflow-visible" viewBox="0 0 771.22 178.45" xmlns="http://www.w3.org/2000/svg">
              <style>
                {`
                  .logo-red-path {
                    filter: brightness(1) drop-shadow(0 0 0px #d61f1f);
                    transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  }
                  .group:hover .logo-red-path {
                    filter: brightness(1.3) drop-shadow(0 0 8px #d61f1f) drop-shadow(0 0 4px #ff4444);
                  }
                `}
              </style>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path 
                fill="#d61f1f" 
                d="M94.46,14.32C85.2,4.82,73.72,0,60.32,0h-11.86c-13.31,0-24.88,4.82-34.39,14.32C4.74,23.66,0,35.15,0,48.46v81.52c0,13.22,4.73,24.78,14.1,34.41,9.58,9.32,21.14,14.05,34.36,14.05h11.86c13.31,0,24.8-4.74,34.14-14.08,9.5-9.5,14.32-21.07,14.32-34.39V48.46c0-13.39-4.82-24.88-14.32-34.14ZM80.04,83.91v46.07c0,10.69-9.03,19.72-19.72,19.72h-11.86c-9.17,0-17.23-6.44-19.26-15.18l50.84-50.61ZM28.74,48.46c0-10.69,9.03-19.72,19.72-19.72h11.86c9.12,0,17.02,6.22,19.24,14.96l-50.81,51.04v-46.28Z"
                className="logo-red-path"
              />
              <polygon points="681.37 80.1 680.05 80.5 681.09 79.15 681.37 80.1"/>
              <g>
                <g>
                  <path fill="#fff" d="M191.37,55.07h-2.7c-8.53,0-16.36,2.34-23.36,6.98v-4.96h-26.18v119.34h26.18v-77.22c0-9.74,8.22-17.96,17.96-17.96h8.1c9.9,0,17.96,8.06,17.96,17.96v77.22h26.18v-77.22c0-12.2-4.39-22.66-13.05-31.1-8.43-8.66-18.9-13.05-31.1-13.05Z"/>
                  <path fill="#fff" d="M348.91,126.47v-27.26c0-12.22-4.4-22.69-13.02-31.07-8.44-8.68-18.91-13.07-31.12-13.07h-8.09c-12.13,0-22.67,4.39-31.32,13.05-8.51,8.5-12.82,18.96-12.82,31.09v35.1c0,12.12,4.39,22.66,13.06,31.34,8.85,8.6,19.02,12.79,31.08,12.79h8.77c20.05,0,37.62-13.56,42.71-32.98l.56-2.15-25.07-7.36-.62,2.26c-2.32,8.41-9.39,14.06-17.59,14.06h-8.77c-9.91,0-17.97-8.06-17.97-17.96v-7.84h70.21ZM278.71,99.21c0-9.91,8.06-17.96,17.97-17.96h8.09c9.91,0,17.96,8.05,17.96,17.96v3.11h-44.02v-3.11Z"/>
                  <path fill="#fff" d="M424.25,81.25h8.55c8.51,0,15.73,5.83,17.56,14.18l.53,2.4,25.15-7.38-.52-2.12c-2.32-9.53-7.51-17.52-15.4-23.73-7.72-6.32-16.91-9.52-27.33-9.52h-8.55c-12.13,0-22.66,4.39-31.32,13.05-8.51,8.51-12.82,18.97-12.82,31.1v51.04h-22.95v26.18h99.08v-26.18h-49.95v-51.04c0-9.74,8.23-17.96,17.96-17.96Z"/>
                  <path fill="#fff" d="M547.51,17.94v44.11c-7-4.64-14.84-6.99-23.37-6.99h-2.69c-12.13,0-22.67,4.39-31.32,13.05-8.51,8.5-12.82,18.96-12.82,31.09v35.1c0,12.04,4.3,22.56,12.84,31.34,8.73,8.49,19.25,12.79,31.3,12.79h2.69c8.53,0,16.37-2.34,23.37-6.97v4.96h26.18V17.94h-26.18ZM547.51,134.31c0,9.73-8.23,17.96-17.97,17.96h-8.09c-9.74,0-17.97-8.23-17.97-17.96v-35.1c0-9.74,8.23-17.96,17.97-17.96h8.09c9.74,0,17.97,8.22,17.97,17.96v35.1Z"/>
                  <path fill="#fff" d="M627.43,152.27h20.46c-.16,1.86-.24,3.73-.24,5.6v20.58h-20.22c-16.32,0-30.4-10.69-35.05-26.61l-.64-2.18,25.11-7.64.63,2.26c1.38,4.94,5.19,8.01,9.95,8.01Z"/>
                  <path fill="#fff" d="M620.49,91.34c0,6.53,5.92,10.04,11.42,10.54l23.03,2.93c4.52.66,8.71,1.91,12.49,3.69l-5.82,7.63-.41.56-.17.26c-3.15,4.68-5.76,9.43-7.8,14.23-.72-.19-1.48-.33-2.28-.45l-22.26-2.92c-9.8-.96-17.84-4.79-24.53-11.7-6.56-7.05-9.87-15.37-9.87-24.77,0-10.04,3.55-18.69,10.57-25.7,7.27-7.03,15.97-10.58,25.93-10.58h20.92c16.03,0,30.44,10.85,35.05,26.39l.36,1.18.29.99-1.38.42-23.92,7.29-.49-2.48c-.92-4.54-4.9-7.6-9.91-7.6h-20.92c-5.78,0-10.32,4.43-10.32,10.09Z"/>
                </g>
                <path 
                  fill="#d61f1f" 
                  d="M740.87,19.68v18.27l-.21,2.74c-.15,2.57-2.36,9.6-6.26,14.47l-56.6,74.3-.13.18c-6.76,10.03-10.19,20.31-10.19,30.58v18.23h30.35v-18.23c0-6.33,4.04-12.11,4.17-12.3l56.68-74.41c8.32-10.93,12.53-22.83,12.53-35.38v-18.45h-30.35Z"
                  className="logo-red-path"
                />
              </g>
            </svg>
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <div className="w-px h-6 bg-gray-700" />
            <Link 
              href="/" 
              className="nav-item relative text-lg font-sf-pro-display font-medium text-white hover:text-[#d61f1f] transition-colors group"
            >
              Posts
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#d61f1f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link 
              href="/about" 
              className="nav-item relative text-lg font-sf-pro-display font-medium text-white hover:text-[#d61f1f] transition-colors group"
            >
              About
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#d61f1f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <button 
              className="bg-[#d61f1f] text-white px-4 py-2 rounded font-mono font-bold text-sm uppercase tracking-wide hover:bg-[#b51a1a] transition-colors ml-4"
              onMouseEnter={() => setIsSubscribeHovered(true)}
              onMouseLeave={() => setIsSubscribeHovered(false)}
            >
              Subscribe
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="nav-item md:hidden p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col justify-center items-center w-6 h-6 relative">
              <span 
                className={`block w-5 h-[1px] bg-white transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 translate-y-[3.5px]' : ''
                }`}
              ></span>
              <span 
                className={`block w-5 h-[1px] bg-white mt-[6px] transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
        
        {/* Mobile Menu - Full Screen */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-black z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.05 } }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header with Close Button */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <Link
                  href="/"
                  className="flex items-center group py-2 -my-2 px-2 -mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="h-[26px]" viewBox="0 0 771.22 178.45" xmlns="http://www.w3.org/2000/svg">
                    <style>
                      {`
                        .logo-red-path {
                          filter: brightness(1) drop-shadow(0 0 0px #d61f1f);
                          transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .group:hover .logo-red-path {
                          filter: brightness(1.3) drop-shadow(0 0 8px #d61f1f) drop-shadow(0 0 4px #ff4444);
                        }
                      `}
                    </style>
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <path 
                      fill="#d61f1f" 
                      d="M94.46,14.32C85.2,4.82,73.72,0,60.32,0h-11.86c-13.31,0-24.88,4.82-34.39,14.32C4.74,23.66,0,35.15,0,48.46v81.52c0,13.22,4.73,24.78,14.1,34.41,9.58,9.32,21.14,14.05,34.36,14.05h11.86c13.31,0,24.8-4.74,34.14-14.08,9.5-9.5,14.32-21.07,14.32-34.39V48.46c0-13.39-4.82-24.88-14.32-34.14ZM80.04,83.91v46.07c0,10.69-9.03,19.72-19.72,19.72h-11.86c-9.17,0-17.23-6.44-19.26-15.18l50.84-50.61ZM28.74,48.46c0-10.69,9.03-19.72,19.72-19.72h11.86c9.12,0,17.02,6.22,19.24,14.96l-50.81,51.04v-46.28Z"
                      className="logo-red-path"
                    />
                    <polygon points="681.37 80.1 680.05 80.5 681.09 79.15 681.37 80.1"/>
                    <g>
                      <g>
                        <path fill="#fff" d="M191.37,55.07h-2.7c-8.53,0-16.36,2.34-23.36,6.98v-4.96h-26.18v119.34h26.18v-77.22c0-9.74,8.22-17.96,17.96-17.96h8.1c9.9,0,17.96,8.06,17.96,17.96v77.22h26.18v-77.22c0-12.2-4.39-22.66-13.05-31.1-8.43-8.66-18.9-13.05-31.1-13.05Z"/>
                        <path fill="#fff" d="M348.91,126.47v-27.26c0-12.22-4.4-22.69-13.02-31.07-8.44-8.68-18.91-13.07-31.12-13.07h-8.09c-12.13,0-22.67,4.39-31.32,13.05-8.51,8.5-12.82,18.96-12.82,31.09v35.1c0,12.12,4.39,22.66,13.06,31.34,8.85,8.6,19.02,12.79,31.08,12.79h8.77c20.05,0,37.62-13.56,42.71-32.98l.56-2.15-25.07-7.36-.62,2.26c-2.32,8.41-9.39,14.06-17.59,14.06h-8.77c-9.91,0-17.97-8.06-17.97-17.96v-7.84h70.21ZM278.71,99.21c0-9.91,8.06-17.96,17.97-17.96h8.09c9.91,0,17.96,8.05,17.96,17.96v3.11h-44.02v-3.11Z"/>
                        <path fill="#fff" d="M424.25,81.25h8.55c8.51,0,15.73,5.83,17.56,14.18l.53,2.4,25.15-7.38-.52-2.12c-2.32-9.53-7.51-17.52-15.4-23.73-7.72-6.32-16.91-9.52-27.33-9.52h-8.55c-12.13,0-22.66,4.39-31.32,13.05-8.51,8.51-12.82,18.97-12.82,31.1v51.04h-22.95v26.18h99.08v-26.18h-49.95v-51.04c0-9.74,8.23-17.96,17.96-17.96Z"/>
                        <path fill="#fff" d="M547.51,17.94v44.11c-7-4.64-14.84-6.99-23.37-6.99h-2.69c-12.13,0-22.67,4.39-31.32,13.05-8.51,8.5-12.82,18.96-12.82,31.09v35.1c0,12.04,4.3,22.56,12.84,31.34,8.73,8.49,19.25,12.79,31.3,12.79h2.69c8.53,0,16.37-2.34,23.37-6.97v4.96h26.18V17.94h-26.18ZM547.51,134.31c0,9.73-8.23,17.96-17.97,17.96h-8.09c-9.74,0-17.97-8.23-17.97-17.96v-35.1c0-9.74,8.23-17.96,17.97-17.96h8.09c9.74,0,17.97,8.22,17.97,17.96v35.1Z"/>
                        <path fill="#fff" d="M627.43,152.27h20.46c-.16,1.86-.24,3.73-.24,5.6v20.58h-20.22c-16.32,0-30.4-10.69-35.05-26.61l-.64-2.18,25.11-7.64.63,2.26c1.38,4.94,5.19,8.01,9.95,8.01Z"/>
                        <path fill="#fff" d="M620.49,91.34c0,6.53,5.92,10.04,11.42,10.54l23.03,2.93c4.52.66,8.71,1.91,12.49,3.69l-5.82,7.63-.41.56-.17.26c-3.15,4.68-5.76,9.43-7.8,14.23-.72-.19-1.48-.33-2.28-.45l-22.26-2.92c-9.8-.96-17.84-4.79-24.53-11.7-6.56-7.05-9.87-15.37-9.87-24.77,0-10.04,3.55-18.69,10.57-25.7,7.27-7.03,15.97-10.58,25.93-10.58h20.92c16.03,0,30.44,10.85,35.05,26.39l.36,1.18.29.99-1.38.42-23.92,7.29-.49-2.48c-.92-4.54-4.9-7.6-9.91-7.6h-20.92c-5.78,0-10.32,4.43-10.32,10.09Z"/>
                      </g>
                      <path 
                        fill="#d61f1f" 
                        d="M740.87,19.68v18.27l-.21,2.74c-.15,2.57-2.36,9.6-6.26,14.47l-56.6,74.3-.13.18c-6.76,10.03-10.19,20.31-10.19,30.58v18.23h30.35v-18.23c0-6.33,4.04-12.11,4.17-12.3l56.68-74.41c8.32-10.93,12.53-22.83,12.53-35.38v-18.45h-30.35Z"
                        className="logo-red-path"
                      />
                    </g>
                  </svg>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded transition-colors"
                  aria-label="Close menu"
                >
                  <div className="flex flex-col justify-center items-center w-6 h-6 relative">
                    <span className="block w-5 h-[1px] bg-white rotate-45 translate-y-[3.5px]"></span>
                    <span className="block w-5 h-[1px] bg-white -rotate-45 -translate-y-[3.5px] mt-[6px]"></span>
                  </div>
                </button>
              </div>

              {/* Theme Toggle - Top Right */}
              <div className="absolute top-3 right-16 md:hidden">
                <ThemeToggle />
              </div>

              {/* Menu Items - Centered */}
              <motion.div 
                className="flex-1 flex flex-col justify-center items-center px-8"
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%", transition: { duration: 0.3, ease: "easeInOut" } }}
                transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="flex flex-col space-y-8 text-center"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { 
                      opacity: 0,
                      transition: { duration: 0.2 }
                    },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.3
                      }
                    }
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }
                    }}
                  >
                    <Link 
                      href="/" 
                      className="text-3xl font-sf-pro-display font-medium text-white hover:text-[#d61f1f] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Posts
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }
                    }}
                  >
                    <Link 
                      href="/about" 
                      className="text-3xl font-sf-pro-display font-medium text-white hover:text-[#d61f1f] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }
                    }}
                  >
                    <button 
                      className="bg-[#d61f1f] text-white px-8 py-3 rounded font-mono font-bold text-sm uppercase tracking-wide hover:bg-[#b51a1a] transition-colors mt-4"
                      onMouseEnter={() => setIsSubscribeHovered(true)}
                      onMouseLeave={() => setIsSubscribeHovered(false)}
                    >
                      Subscribe
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
