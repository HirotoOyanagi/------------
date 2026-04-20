import type { Metadata } from 'next'
import { Bebas_Neue, Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'REELIFY — AI マーケティング動画生成',
  description: '商品写真をAIマーケティング動画に変換し、SNSへ自動投稿',
  keywords: ['AI動画', 'マーケティング', 'SNS投稿', 'Seedance', '自動化'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${bebasNeue.variable} ${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
