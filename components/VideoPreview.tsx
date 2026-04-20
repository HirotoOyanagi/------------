'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, Share2, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import SocialPost from './SocialPost'

interface VideoPreviewProps {
  videoUrl: string
  previewSrc: string
  onReset: () => void
}

export default function VideoPreview({ videoUrl, previewSrc, onReset }: VideoPreviewProps) {
  const [tab, setTab] = useState<'preview' | 'post'>('preview')
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  const handleDownload = () => {
    if (!videoUrl) return
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `reelify-${Date.now()}.mp4`
    a.target = '_blank'
    a.click()
  }

  return (
    <div className="space-y-8">
      {/* Success header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-3"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-heading text-green-400 tracking-wider uppercase">動画生成完了</span>
        </motion.div>
        <h2 className="font-display gradient-text" style={{ fontSize: 'clamp(48px, 8vw, 80px)', lineHeight: 1 }}>
          動画完成！
        </h2>
        <p className="font-body text-gray-500 text-sm">
          マーケティング動画が準備できました。ダウンロードまたはSNSに投稿できます。
        </p>
      </motion.div>

      {/* Tab switcher */}
      <div className="flex justify-center">
        <div className="flex glass rounded-2xl p-1 gap-1 border border-white/[0.06]">
          {(
            [
              { id: 'preview', icon: '🎬', label: 'プレビュー' },
              { id: 'post', icon: '📱', label: 'SNS投稿' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-sm transition-all duration-200"
              style={
                tab === t.id
                  ? { background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: 'white', boxShadow: '0 0 20px rgba(236,72,153,0.25)' }
                  : { color: 'rgba(255,255,255,0.4)' }
              }
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'preview' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Video player */}
          <div className="relative max-w-xs w-full mx-auto">
            {/* Phone-like frame */}
            <div
              className="relative rounded-[32px] p-2.5"
              style={{
                background: 'linear-gradient(145deg, #1e1e2a, #111118)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.12)',
              }}
            >
              {/* Speaker dot */}
              <div className="flex justify-center mb-2">
                <div className="w-16 h-1 rounded-full bg-white/10" />
              </div>

              <div className="relative rounded-[22px] overflow-hidden bg-black aspect-[9/16]">
                {videoUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                    />
                    {/* Video controls overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/20">
                      <button
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        {playing ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-1" />
                        )}
                      </button>
                    </div>
                    {/* Mute button */}
                    <button
                      onClick={toggleMute}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      {muted ? (
                        <VolumeX className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                    {/* REELIFY watermark */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
                      <span className="text-[9px] font-display text-white/60 tracking-widest">REELIFY</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <img src={previewSrc} alt="" className="max-h-40 object-contain opacity-40" />
                    <p className="text-gray-600 text-xs font-body leading-relaxed">
                      動画URLが取得できませんでした。APIレスポンスをご確認ください。
                    </p>
                  </div>
                )}
              </div>

              {/* Home indicator */}
              <div className="flex justify-center mt-2">
                <div className="w-24 h-1 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Reflection glow */}
            <div
              className="absolute -bottom-8 inset-x-4 h-16 rounded-full blur-2xl opacity-30 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {videoUrl && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleDownload}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-sm"
              >
                <Download className="w-4 h-4" />
                ダウンロード
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setTab('post')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-white text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #EC4899, #F97316)', boxShadow: '0 0 24px rgba(249,115,22,0.25)' }}
            >
              <Share2 className="w-4 h-4" />
              SNSに投稿
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onReset}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-gray-200 transition-all font-heading text-sm border border-white/[0.06]"
            >
              <RefreshCw className="w-4 h-4" />
              新しい動画
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <SocialPost videoUrl={videoUrl} onBack={() => setTab('preview')} />
        </motion.div>
      )}
    </div>
  )
}
