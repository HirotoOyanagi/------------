import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reelify Social Studio',
  description: 'Google認証で始めるSNS投稿、作成、分析、コンテンツ管理のUIプロトタイプ',
  keywords: ['SNS運用', '投稿管理', 'Google認証', 'コンテンツ作成', '分析'],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
