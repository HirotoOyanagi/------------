'use client'

import { motion } from 'framer-motion'

interface NavigationProps {
  step: number
}

export default function Navigation({ step }: NavigationProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50 px-5 py-4"
    >
      <div
        className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-5 py-3"
        style={{
          background: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                boxShadow: '0 0 16px rgba(124,58,237,0.5)',
              }}
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="relative z-10 w-8 h-8 p-1.5"
            >
              <path
                d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-heading font-bold text-white text-lg tracking-[0.15em]">
            REELIFY
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {step > 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
              </span>
              <span className="text-xs font-heading text-gray-500">
                Step {step} / 4
              </span>
            </motion.div>
          )}
          <span
            className="text-[11px] font-heading tracking-widest uppercase text-gray-600 px-3 py-1.5 rounded-full hidden sm:block"
            style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
          >
            Seedance v2.0
          </span>
        </div>
      </div>
    </motion.header>
  )
}
