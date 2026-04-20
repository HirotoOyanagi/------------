'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import StepIndicator from '@/components/StepIndicator'
import UploadZone from '@/components/UploadZone'
import VideoSettings from '@/components/VideoSettings'
import GeneratingView from '@/components/GeneratingView'
import VideoPreview from '@/components/VideoPreview'
import type { VideoConfig } from './types'

type Step = 1 | 2 | 3 | 4

const pageVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

export default function Home() {
  const [step, setStep] = useState<Step>(1)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [previewSrc, setPreviewSrc] = useState('')
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('')
  const [videoConfig, setVideoConfig] = useState<VideoConfig | null>(null)

  const handleUpload = (url: string, preview: string) => {
    setUploadedImageUrl(url)
    setPreviewSrc(preview)
    setStep(2)
  }

  const handleGenerate = async (config: VideoConfig) => {
    setVideoConfig(config)
    setStep(3)

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: config.prompt,
          image_urls: [uploadedImageUrl],
          resolution: config.resolution,
          duration: config.duration,
          aspect_ratio: config.aspectRatio,
          generate_audio: config.generateAudio,
        }),
      })

      const data = await res.json()
      // Fal.ai returns video URL in various paths depending on model
      const url =
        data?.video?.url ??
        data?.url ??
        data?.output?.[0]?.url ??
        data?.videos?.[0]?.url ??
        ''
      setGeneratedVideoUrl(url)
    } catch (err) {
      console.error('Generation error:', err)
      setGeneratedVideoUrl('')
    } finally {
      setStep(4)
    }
  }

  const handleReset = () => {
    setStep(1)
    setUploadedImageUrl('')
    setPreviewSrc('')
    setGeneratedVideoUrl('')
    setVideoConfig(null)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)',
            animation: 'float 14s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-[45%] left-[40%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <Navigation step={step} />

      <main className="relative z-10">
        {/* Step indicator */}
        <div className="pt-28 pb-10 px-4">
          <StepIndicator currentStep={step} />
        </div>

        {/* Step content */}
        <div className="max-w-4xl mx-auto px-4 pb-24">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Hero header */}
                <div className="text-center mb-12 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                  >
                    <h1
                      className="font-display leading-none tracking-wide gradient-text"
                      style={{ fontSize: 'clamp(72px, 14vw, 160px)' }}
                    >
                      REELIFY
                    </h1>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-heading text-base md:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed"
                  >
                    商品写真を
                    <span className="text-white font-semibold"> AIマーケティング動画 </span>
                    に変換して、SNSへ自動投稿
                  </motion.p>

                  {/* Feature tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-2 pt-2"
                  >
                    {['ByteDance Seedance 2.0', 'AI音楽生成', '自動SNS投稿', '最大720p'].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-xs font-heading tracking-widest uppercase text-gray-500 border border-white/8 bg-white/[0.03] px-3 py-1.5 rounded-full"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </motion.div>
                </div>

                <UploadZone onUpload={handleUpload} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <VideoSettings
                  previewSrc={previewSrc}
                  onGenerate={handleGenerate}
                  onBack={() => setStep(1)}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="s3"
                variants={{ enter: { opacity: 0, scale: 0.95 }, center: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.05 } }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <GeneratingView />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="s4"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <VideoPreview
                  videoUrl={generatedVideoUrl}
                  previewSrc={previewSrc}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
