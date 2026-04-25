import { NextRequest, NextResponse } from 'next/server'

const variants = ['natural', 'fashion', 'travel'] as const

function pickVariant(prompt: string) {
  const text = prompt.toLowerCase()
  if (text.includes('fashion') || text.includes('collection') || text.includes('新作') || text.includes('モデル')) {
    return 'fashion'
  }
  if (text.includes('travel') || text.includes('gw') || text.includes('自然') || text.includes('山') || text.includes('湖')) {
    return 'travel'
  }
  return 'natural'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const prompt = String(body.prompt ?? '')

    if (!prompt.trim()) {
      return NextResponse.json({ success: false, message: 'prompt is required' }, { status: 400 })
    }

    const primary = pickVariant(prompt)
    const ordered = [primary, ...variants.filter((variant) => variant !== primary)]

    return NextResponse.json({
      success: true,
      jobId: `img_${Date.now()}`,
      model: body.model ?? 'image-generation-v1',
      status: 'completed',
      candidates: ordered.map((variant, index) => ({
        id: `candidate_${index + 1}`,
        variant,
        prompt,
        aspectRatio: body.aspectRatio ?? '1.62:1',
      })),
    })
  } catch (error) {
    console.error('[generate-image]', error)
    return NextResponse.json({ success: false, message: 'Image generation failed' }, { status: 500 })
  }
}
