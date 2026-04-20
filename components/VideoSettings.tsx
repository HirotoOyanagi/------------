'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Wand2, Clock, Monitor, Volume2, VolumeX, ChevronRight } from 'lucide-react'
import type { VideoConfig } from '@/app/types'

interface VideoSettingsProps {
  previewSrc: string
  onGenerate: (config: VideoConfig) => void
  onBack: () => void
}

const ASPECT_RATIOS = [
  { value: '9:16', label: '9:16', desc: 'Reels / TikTok', emoji: '📱' },
  { value: '16:9', label: '16:9', desc: 'YouTube / X', emoji: '🖥️' },
  { value: '1:1', label: '1:1', desc: 'Instagram', emoji: '⬜' },
  { value: '4:3', label: '4:3', desc: 'Facebook', emoji: '📺' },
]

const DURATIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 4, label: '4s' },
  { value: 8, label: '8s' },
  { value: 12, label: '12s' },
  { value: 15, label: '15s' },
]

const PROMPT_PRESETS = [
  { label: 'Luxury', text: ', luxury lifestyle aesthetic, golden hour lighting' },
  { label: 'Minimal', text: ', minimalist clean aesthetic, white studio background, soft diffused light' },
  { label: 'Dynamic', text: ', dynamic camera movement, energetic cuts, vibrant colors' },
  { label: 'Cinematic', text: ', cinematic depth of field, dramatic shadows, film grain' },
]

const DEFAULT_PROMPT =
  'Cinematic marketing video, elegant product close-up shots, smooth camera movement, professional studio lighting, premium quality'

const cardClass =
  'glass rounded-2xl p-5 space-y-4 border border-white/[0.06] hover:border-white/[0.1] transition-colors duration-300'

export default function VideoSettings({ previewSrc, onGenerate, onBack }: VideoSettingsProps) {
  const [config, setConfig] = useState<VideoConfig>({
    prompt: DEFAULT_PROMPT,
    aspectRatio: '9:16',
    duration: 'auto',
    resolution: '720p',
    generateAudio: true,
  })

  const addPreset = (text: string) =>
    setConfig((c) => ({ ...c, prompt: c.prompt + text }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
      {/* Left: image preview */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden md:block"
      >
        <div className="sticky top-24 space-y-3">
          <div className="gradient-border-card">
            <div className="relative p-3 rounded-2xl overflow-hidden" style={{ background: '#16161E' }}>
              <img
                src={previewSrc}
                alt="Your product"
                className="w-full rounded-xl object-contain max-h-72"
              />
              {/* Glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.15) 0%, transparent 70%)' }}
              />
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 font-body">あなたの商品写真</p>

          <div className="glass rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-heading text-gray-500 uppercase tracking-wider">Tips</p>
            <p className="text-xs font-body text-gray-600 leading-relaxed">
              正面・白背景の写真が最も効果的です。複数アングルの合成も可能。
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right: settings */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <div className="mb-2">
          <h2 className="font-heading font-bold text-white text-xl">動画設定</h2>
          <p className="font-body text-gray-500 text-sm mt-0.5">生成する動画のスタイルと形式を設定</p>
        </div>

        {/* Prompt */}
        <div className={cardClass}>
          <label className="flex items-center gap-2 text-sm font-heading font-semibold text-gray-300">
            <Wand2 className="w-4 h-4 text-purple-400" />
            AIプロンプト
          </label>
          <textarea
            value={config.prompt}
            onChange={(e) => setConfig((c) => ({ ...c, prompt: e.target.value }))}
            rows={4}
            className="input-base w-full px-4 py-3 text-sm resize-none"
            placeholder="動画の雰囲気や内容を入力..."
          />
          <div className="flex flex-wrap gap-2">
            {PROMPT_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => addPreset(p.text)}
                className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-gray-500 hover:text-gray-200 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-200 font-heading"
              >
                + {p.label}
              </button>
            ))}
            <button
              onClick={() => setConfig((c) => ({ ...c, prompt: DEFAULT_PROMPT }))}
              className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-gray-600 hover:text-gray-400 transition-all font-body"
            >
              リセット
            </button>
          </div>
        </div>

        {/* Aspect ratio */}
        <div className={cardClass}>
          <label className="flex items-center gap-2 text-sm font-heading font-semibold text-gray-300">
            <Monitor className="w-4 h-4 text-pink-400" />
            アスペクト比
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ASPECT_RATIOS.map((ar) => {
              const active = config.aspectRatio === ar.value
              return (
                <button
                  key={ar.value}
                  onClick={() => setConfig((c) => ({ ...c, aspectRatio: ar.value }))}
                  className="p-3 rounded-xl text-center transition-all duration-200 border"
                  style={{
                    border: active
                      ? '1px solid rgba(124,58,237,0.5)'
                      : '1px solid rgba(255,255,255,0.06)',
                    background: active ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)',
                    boxShadow: active ? '0 0 16px rgba(124,58,237,0.15)' : 'none',
                  }}
                >
                  <div className="text-xl mb-1">{ar.emoji}</div>
                  <div className="text-xs font-heading font-bold text-white">{ar.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-body leading-tight">{ar.desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Duration + Resolution */}
        <div className="grid grid-cols-2 gap-4">
          <div className={cardClass}>
            <label className="flex items-center gap-2 text-sm font-heading font-semibold text-gray-300">
              <Clock className="w-4 h-4 text-orange-400" />
              尺
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DURATIONS.map((d) => {
                const active = config.duration === d.value
                return (
                  <button
                    key={String(d.value)}
                    onClick={() => setConfig((c) => ({ ...c, duration: d.value }))}
                    className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all duration-200"
                    style={
                      active
                        ? {
                            background: 'linear-gradient(135deg, #F97316, #EC4899)',
                            color: 'white',
                          }
                        : {
                            background: 'rgba(255,255,255,0.04)',
                            color: 'rgba(255,255,255,0.4)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }
                    }
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={cardClass}>
            <label className="text-sm font-heading font-semibold text-gray-300">解像度 & 音声</label>
            <div className="flex gap-2">
              {(['480p', '720p'] as const).map((res) => {
                const active = config.resolution === res
                return (
                  <button
                    key={res}
                    onClick={() => setConfig((c) => ({ ...c, resolution: res }))}
                    className="flex-1 py-2 rounded-lg text-sm font-heading font-bold transition-all duration-200"
                    style={
                      active
                        ? { background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: 'white' }
                        : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }
                    }
                  >
                    {res}
                  </button>
                )
              })}
            </div>

            {/* Audio toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-body text-gray-500">
                {config.generateAudio ? (
                  <Volume2 className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-gray-600" />
                )}
                AI音楽生成
              </span>
              <button
                onClick={() => setConfig((c) => ({ ...c, generateAudio: !c.generateAudio }))}
                className="relative w-10 h-[22px] rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  background: config.generateAudio
                    ? 'linear-gradient(135deg, #7C3AED, #EC4899)'
                    : 'rgba(255,255,255,0.08)',
                }}
                aria-label="Toggle audio"
              >
                <span
                  className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                  style={{ left: config.generateAudio ? '22px' : '3px' }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-gray-200 transition-all font-heading text-sm border border-white/[0.06]"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
          <button
            onClick={() => onGenerate(config)}
            className="btn-primary flex-1 py-3.5 px-6 text-base flex items-center justify-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            <span>動画を生成する</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
