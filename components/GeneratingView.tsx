'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  { text: '商品を解析中...', sub: 'Analyzing product features' },
  { text: 'シーンを構築中...', sub: 'Building cinematic scene' },
  { text: 'カメラモーションを設計中...', sub: 'Designing camera movement' },
  { text: 'AIが映像を生成中...', sub: 'Generating video frames' },
  { text: 'ライティングを調整中...', sub: 'Adjusting lighting & shadows' },
  { text: '音楽を生成中...', sub: 'Composing background music' },
  { text: 'レンダリング中...', sub: 'Final render in progress' },
  { text: 'もうすぐ完成...', sub: 'Almost there...' },
]

const FILM_FRAMES = Array.from({ length: 20 })

export default function GeneratingView() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 3500)

    let p = 0
    const progTimer = setInterval(() => {
      p = Math.min(p + (p < 60 ? 1.2 : p < 85 ? 0.5 : 0.15), 95)
      setProgress(p)
    }, 500)

    return () => {
      clearInterval(msgTimer)
      clearInterval(progTimer)
    }
  }, [])

  const circleR = 72
  const circumference = 2 * Math.PI * circleR

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] gap-12">
      {/* Main progress ring */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Outer ambient glow */}
        <div
          className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(236,72,153,0.06) 50%, transparent 70%)',
          }}
        />

        {/* Track ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx="90" cy="90" r={circleR}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <motion.circle
            cx="90" cy="90" r={circleR}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Spinning decoration ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-5 rounded-full"
          style={{ border: '1px dashed rgba(124,58,237,0.2)' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-8 rounded-full"
          style={{ border: '1px dashed rgba(236,72,153,0.12)' }}
        />

        {/* Center content */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-4xl gradient-text">
            {Math.round(progress)}%
          </span>
          <span className="font-body text-[10px] text-gray-600 uppercase tracking-widest">Processing</span>
        </div>
      </div>

      {/* Status message */}
      <div className="text-center space-y-2 min-h-[60px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <p className="font-heading font-semibold text-xl text-white">{MESSAGES[msgIndex].text}</p>
            <p className="font-body text-sm text-gray-600 mt-1">{MESSAGES[msgIndex].sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ETA info */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
        <span className="text-xs font-body text-gray-500">通常30秒〜2分かかります</span>
      </div>

      {/* Film strip rolling animation */}
      <div className="w-full max-w-2xl overflow-hidden rounded-xl opacity-20 relative" style={{ height: 72 }}>
        {/* Sprocket holes top */}
        <div className="absolute top-2 left-0 right-0 h-3 flex items-center pointer-events-none z-10">
          <div className="flex gap-6" style={{ animation: 'film-roll 8s linear infinite', width: '200%' }}>
            {FILM_FRAMES.concat(FILM_FRAMES).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-sm bg-[#0A0A0F] flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Frames */}
        <div
          className="flex items-center gap-3 absolute top-6 left-0"
          style={{ animation: 'film-roll 8s linear infinite', width: '200%' }}
        >
          {FILM_FRAMES.concat(FILM_FRAMES).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-20 h-12 rounded bg-white/8 border border-white/5 flex items-center justify-center overflow-hidden"
            >
              <div className="w-14 h-8 rounded bg-white/5" />
            </div>
          ))}
        </div>

        {/* Sprocket holes bottom */}
        <div className="absolute bottom-2 left-0 right-0 h-3 flex items-center pointer-events-none z-10">
          <div className="flex gap-6" style={{ animation: 'film-roll 8s linear infinite', width: '200%' }}>
            {FILM_FRAMES.concat(FILM_FRAMES).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-sm bg-[#0A0A0F] flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
