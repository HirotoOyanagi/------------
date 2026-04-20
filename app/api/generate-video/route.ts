import { NextRequest, NextResponse } from 'next/server'
import { seedanceServer } from '@/lib/mcp-config'

export async function POST(request: NextRequest) {
  if (!seedanceServer.url) {
    return NextResponse.json({ error: 'MCP server not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()

    const payload = {
      prompt: body.prompt ?? '',
      image_urls: body.image_urls ?? [],
      resolution: body.resolution ?? '720p',
      duration: body.duration ?? 'auto',
      aspect_ratio: body.aspect_ratio ?? '9:16',
      generate_audio: body.generate_audio ?? true,
    }

    console.log('[generate-video] MCP server:', seedanceServer.url)
    console.log('[generate-video] Payload:', JSON.stringify(payload, null, 2))

    const response = await fetch(seedanceServer.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...seedanceServer.headers,
      },
      body: JSON.stringify(payload),
    })

    const text = await response.text()
    console.log('[generate-video] Status:', response.status)
    console.log('[generate-video] Response:', text.slice(0, 500))

    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'Invalid API response', raw: text.slice(0, 200) },
        { status: 502 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[generate-video]', err)
    return NextResponse.json({ error: 'Video generation failed' }, { status: 500 })
  }
}
