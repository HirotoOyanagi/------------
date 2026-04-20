'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, AlertCircle } from 'lucide-react'

interface UploadZoneProps {
  onUpload: (url: string, preview: string) => void
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0]
      if (!file) return

      const localPreview = URL.createObjectURL(file)
      setPreview(localPreview)
      setIsUploading(true)
      setError(null)
      setProgress(0)

      // Animate progress while uploading
      const timer = setInterval(() => {
        setProgress((p) => Math.min(p + 12, 85))
      }, 100)

      try {
        const fd = new FormData()
        fd.append('file', file)

        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()

        clearInterval(timer)
        setProgress(100)

        if (data.url) {
          await new Promise((r) => setTimeout(r, 400))
          onUpload(data.url, localPreview)
        } else {
          setError('アップロードに失敗しました')
          setPreview(null)
        }
      } catch {
        clearInterval(timer)
        setError('ネットワークエラーが発生しました')
        setPreview(null)
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    disabled: isUploading,
  })

  const circumference = 2 * Math.PI * 40

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center gap-5"
    >
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className="relative w-full max-w-2xl cursor-pointer group"
        style={{ height: 340 }}
      >
        <input {...getInputProps()} />

        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            padding: 1,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899, #F97316, #7C3AED)',
            backgroundSize: '300% 300%',
            animation: 'gradient-shift 3s ease infinite',
            opacity: isDragActive ? 1 : 0.45,
            borderRadius: 18,
          }}
        >
          <div className="absolute inset-0 rounded-[17px]" style={{ background: '#16161E' }} />
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: isDragActive
              ? 'radial-gradient(ellipse at center, rgba(236,72,153,0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(124,58,237,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isUploading && preview ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <motion.circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke="url(#uploadGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - progress / 100)}
                      transition={{ duration: 0.1 }}
                    />
                    <defs>
                      <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={preview}
                      alt=""
                      className="w-14 h-14 rounded-full object-cover opacity-70"
                    />
                  </div>
                </div>
                <p className="font-heading text-gray-400 text-sm tracking-wider">
                  アップロード中 {progress}%
                </p>
              </motion.div>
            ) : preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-52 max-w-full rounded-xl object-contain shadow-2xl"
                />
                <p className="font-heading text-xs text-gray-600">クリックして別の画像を選択</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-5 px-8 text-center"
              >
                <motion.div
                  animate={isDragActive ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-20 h-20"
                >
                  <div
                    className="absolute inset-0 rounded-2xl transition-all duration-300"
                    style={{
                      background: isDragActive
                        ? 'linear-gradient(135deg, #7C3AED, #EC4899)'
                        : 'rgba(255,255,255,0.05)',
                      boxShadow: isDragActive ? '0 0 40px rgba(236,72,153,0.4)' : 'none',
                    }}
                  />
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {isDragActive ? (
                      <Sparkles className="w-9 h-9 text-white" />
                    ) : (
                      <Upload className="w-9 h-9 text-gray-400 group-hover:text-gray-200 transition-colors" />
                    )}
                  </div>
                </motion.div>

                <div className="space-y-1.5">
                  <p className="font-heading font-bold text-white text-xl md:text-2xl">
                    {isDragActive ? '✨ ここにドロップ！' : '商品写真をここにドラッグ'}
                  </p>
                  <p className="font-body text-gray-500 text-sm">
                    または
                    <span className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                      {' '}クリックしてファイルを選択
                    </span>
                  </p>
                  <p className="font-body text-gray-700 text-xs mt-1">
                    JPG · PNG · WEBP · 最大20MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-red-400 font-body px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Decorative use-cases */}
      <div className="flex flex-wrap justify-center gap-6 mt-2">
        {[
          { emoji: '👗', label: 'ファッション' },
          { emoji: '💄', label: 'コスメ' },
          { emoji: '🍜', label: 'フード' },
          { emoji: '📦', label: 'ECサイト' },
          { emoji: '🏠', label: 'インテリア' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-gray-600 text-sm font-body">
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
