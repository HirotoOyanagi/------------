import { NextRequest, NextResponse } from 'next/server'

/**
 * Social media posting endpoint.
 *
 * Current state: demo/stub — logs the request and returns success.
 *
 * To wire up real posting, implement OAuth flows for each platform:
 *   - Instagram: Meta Graph API v18+ /me/media + /me/media_publish
 *   - TikTok:    TikTok for Developers v2 /video/upload
 *   - X (Twitter): Twitter API v2 /tweets (media upload first)
 *   - YouTube:  YouTube Data API v3 /videos insert
 *
 * Store OAuth tokens in environment variables or a secrets manager.
 */
export async function POST(request: NextRequest) {
  try {
    const { platforms, videoUrl, caption, scheduleAt } = await request.json()

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ success: false, message: 'プラットフォームを選択してください' }, { status: 400 })
    }

    console.log('[post-social] Request:', { platforms, videoUrl: videoUrl?.slice(0, 80), caption: caption?.slice(0, 80), scheduleAt })

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 1200))

    return NextResponse.json({
      success: true,
      message: `${platforms.join(', ')} への投稿リクエストを受付けました`,
      platforms,
      scheduledAt: scheduleAt ?? null,
      note: 'デモ版: OAuth連携後に実際の投稿が可能になります',
    })
  } catch (err) {
    console.error('[post-social]', err)
    return NextResponse.json({ success: false, message: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
