import { NextRequest, NextResponse } from 'next/server'
import { generateImageViaMcp } from '@/lib/mcp-client'

type ImageSizeParams =
  | { image_size: string; image_width?: never; image_height?: never }
  | { image_size?: never; image_width: number; image_height: number }

function imageSizeFromAspect(aspectRatio: string): ImageSizeParams {
  switch (aspectRatio) {
    case '1:1':
      return { image_size: 'square' }
    case '4:5':
      return { image_width: 1024, image_height: 1280 }
    case '3:2':
      return { image_width: 1536, image_height: 1024 }
    case '9:16':
      return { image_size: 'portrait_16_9' }
    case '16:9':
      return { image_size: 'landscape_16_9' }
    default:
      return { image_size: 'landscape_4_3' }
  }
}

function buildPrompt(body: Record<string, unknown>) {
  const parts = [String(body.prompt ?? '').trim()]

  if (body.style && body.style !== 'スタイルを選択してください') {
    parts.push(`Style: ${String(body.style)}`)
  }

  if (body.colorTone && body.colorTone !== '指定なし') {
    parts.push(`Color tone: ${String(body.colorTone)}`)
  }

  if (body.negativePrompt) {
    parts.push(`Avoid: ${String(body.negativePrompt)}`)
  }

  return parts.filter(Boolean).join('\n')
}

function extractImageUrls(data: unknown): string[] {
  const urls: string[] = []

  const visit = (value: unknown) => {
    if (!value) return
    if (typeof value === 'string') {
      if (/^https?:\/\//.test(value) || value.startsWith('data:image/')) urls.push(value)
      return
    }
    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }
    if (typeof value === 'object') {
      Object.values(value as Record<string, unknown>).forEach(visit)
    }
  }

  visit(data)
  return Array.from(new Set(urls))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>
    const prompt = buildPrompt(body)

    if (!prompt.trim()) {
      return NextResponse.json({ success: false, message: 'prompt is required' }, { status: 400 })
    }

    const imageUrls = Array.isArray(body.image_urls)
      ? body.image_urls.filter((url): url is string => typeof url === 'string' && url.length > 0)
      : []

    const sizeParams = imageSizeFromAspect(String(body.aspectRatio ?? '16:9'))

    const result = await generateImageViaMcp({
      prompt,
      image_urls: imageUrls,
      ...sizeParams,
      quality: body.quality === 'low' || body.quality === 'medium' || body.quality === 'high'
        ? body.quality
        : 'high',
      num_images: typeof body.num_images === 'number' ? body.num_images : 3,
      output_format: body.output_format === 'jpeg' || body.output_format === 'webp' ? body.output_format : 'png',
      sync_mode: false,
    })

    return NextResponse.json({
      success: true,
      result,
      imageUrls: extractImageUrls(result),
    })
  } catch (error) {
    console.error('[generate-image]', error)
    const message = error instanceof Error ? error.message : 'Image generation failed'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
