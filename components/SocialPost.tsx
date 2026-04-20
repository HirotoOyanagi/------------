'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, AlertCircle, Calendar, Sparkles } from 'lucide-react'

interface Platform {
  id: string
  name: string
  gradient: string
  emoji: string
  desc: string
  formats: string
}

const PLATFORMS: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    gradient: 'from-yellow-400 via-pink-500 to-purple-600',
    emoji: '📸',
    desc: 'Reels & Stories',
    formats: '9:16, 1:1',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    gradient: 'from-cyan-400 to-pink-500',
    emoji: '🎵',
    desc: 'Short Videos',
    formats: '9:16',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    gradient: 'from-sky-400 to-blue-600',
    emoji: '🐦',
    desc: 'Video Posts',
    formats: '16:9, 1:1',
  },
  {
    id: 'youtube',
    name: 'YouTube Shorts',
    gradient: 'from-red-500 to-rose-700',
    emoji: '▶️',
    desc: 'Shorts',
    formats: '9:16',
  },
]

const CAPTION_TEMPLATES = [
  '✨ 新商品入荷！\n限定数量なのでお早めに🔥\n\n#新商品 #限定 #おすすめ',
  '🎯 これが探してた商品かも...\nリンクはプロフィールから👆\n\n#おすすめ商品 #新作',
  '💫 毎日使いたくなる一品\nあなたの生活を変えます✨\n\n#ライフスタイル #新発売',
]

interface SocialPostProps {
  videoUrl: string
  onBack: () => void
}

export default function SocialPost({ videoUrl, onBack }: SocialPostProps) {
  const [selected, setSelected] = useState<string[]>(['instagram'])
  const [caption, setCaption] = useState(CAPTION_TEMPLATES[0])
  const [scheduleAt, setScheduleAt] = useState('')
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )

  const handlePost = async () => {
    if (selected.length === 0) return
    setPosting(true)
    setError(null)

    try {
      const res = await fetch('/api/post-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms: selected, videoUrl, caption, scheduleAt: scheduleAt || null }),
      })
      const data = await res.json()
      if (data.success) {
        setPosted(true)
      } else {
        setError(data.message || '投稿に失敗しました')
      }
    } catch {
      setError('ネットワークエラーが発生しました')
    } finally {
      setPosting(false)
    }
  }

  if (posted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <div className="space-y-1">
          <h3 className="font-display text-5xl gradient-text">投稿完了！</h3>
          <p className="font-heading text-gray-400">
            {selected.map((s) => PLATFORMS.find((p) => p.id === s)?.name).join(' · ')} に投稿されました
          </p>
          {scheduleAt && (
            <p className="font-body text-sm text-gray-600 mt-1">
              📅 スケジュール: {new Date(scheduleAt).toLocaleString('ja-JP')}
            </p>
          )}
        </div>

        <p className="text-xs font-body text-gray-700 max-w-xs">
          ※ デモ版のため実際の投稿は行われていません。本番環境では各プラットフォームのOAuth認証が必要です。
        </p>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-gray-200 hover:bg-white/[0.08] transition-all font-heading text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          プレビューに戻る
        </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Platform grid */}
      <div className="glass rounded-2xl p-5 space-y-4 border border-white/[0.06]">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-white">投稿先を選択</h3>
          <span className="text-xs font-body text-gray-600">{selected.length}件選択中</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PLATFORMS.map((platform) => {
            const isSelected = selected.includes(platform.id)
            return (
              <button
                key={platform.id}
                onClick={() => toggle(platform.id)}
                className="relative overflow-hidden p-4 rounded-xl border text-left transition-all duration-200 group"
                style={{
                  border: isSelected ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                  background: isSelected ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Gradient background when selected */}
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-[0.08]`} />
                )}

                <div className="relative z-10 flex items-start gap-3">
                  <span className="text-2xl leading-none">{platform.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-sm text-white">{platform.name}</p>
                    <p className="text-xs text-gray-500 font-body">{platform.desc}</p>
                    <p className="text-[10px] text-gray-700 font-body mt-0.5">{platform.formats}</p>
                  </div>
                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Caption */}
      <div className="glass rounded-2xl p-5 space-y-3 border border-white/[0.06]">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-white">キャプション</h3>
          <div className="flex gap-1.5">
            {CAPTION_TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => setCaption(t)}
                className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-600 hover:text-gray-300 hover:bg-white/[0.08] transition-all font-heading"
              >
                例{i + 1}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          className="input-base w-full px-4 py-3 text-sm resize-none"
          placeholder="キャプションを入力..."
        />
        <div className="flex items-center justify-between text-xs text-gray-700 font-body">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            ハッシュタグを含めると効果的
          </span>
          <span>{caption.length} 文字</span>
        </div>
      </div>

      {/* Schedule */}
      <div className="glass rounded-2xl p-5 space-y-3 border border-white/[0.06]">
        <h3 className="font-heading font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-400" />
          スケジュール投稿
          <span className="text-gray-600 font-normal text-xs">(任意)</span>
        </h3>
        <input
          type="datetime-local"
          value={scheduleAt}
          onChange={(e) => setScheduleAt(e.target.value)}
          className="input-base w-full px-4 py-2.5 text-sm text-gray-300 [color-scheme:dark]"
        />
        <p className="text-xs text-gray-700 font-body">
          空欄の場合は今すぐ投稿されます
        </p>
      </div>

      {/* OAuth notice */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs font-body text-gray-600 leading-relaxed">
          実際のSNS投稿にはOAuth認証が必要です。Instagram Graph API / TikTok for Business / Twitter API v2 を設定してください。
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-gray-200 transition-all font-heading text-sm border border-white/[0.06]"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </button>
        <button
          onClick={handlePost}
          disabled={selected.length === 0 || posting}
          className="flex-1 py-3.5 px-6 rounded-xl font-heading font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: selected.length > 0 ? 'linear-gradient(135deg, #EC4899, #F97316)' : 'rgba(255,255,255,0.06)',
            boxShadow: selected.length > 0 && !posting ? '0 0 30px rgba(249,115,22,0.25)' : 'none',
            transform: posting ? 'scale(0.99)' : 'scale(1)',
          }}
        >
          {posting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              投稿中...
            </>
          ) : scheduleAt ? (
            <>📅 スケジュール投稿</>
          ) : (
            <>🚀 今すぐ投稿</>
          )}
        </button>
      </div>
    </div>
  )
}
