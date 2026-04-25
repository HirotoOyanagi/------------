import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const prompt = String(body.prompt ?? '')

    if (!prompt.trim()) {
      return NextResponse.json({ success: false, message: 'prompt is required' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      jobId: `vid_${Date.now()}`,
      model: body.model ?? 'video-generation-v1',
      status: 'completed',
      timeline: [
        { startMs: 0, endMs: 3000, label: '商品クローズアップ' },
        { startMs: 3000, endMs: 9000, label: '利用シーン' },
        { startMs: 9000, endMs: 15000, label: 'CTA表示' },
      ],
      render: {
        aspectRatio: body.aspectRatio ?? '16:9',
        duration: body.duration ?? '15秒',
        audio: body.audio ?? true,
      },
    })
  } catch (error) {
    console.error('[generate-creative-video]', error)
    return NextResponse.json({ success: false, message: 'Video creative generation failed' }, { status: 500 })
  }
}
