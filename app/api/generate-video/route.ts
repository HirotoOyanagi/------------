import { NextRequest, NextResponse } from 'next/server'
import { generateVideoViaMcp } from '@/lib/mcp-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const data = await generateVideoViaMcp({
      prompt: body.prompt ?? '',
      image_urls: body.image_urls ?? [],
      resolution: body.resolution ?? '720p',
      duration: body.duration ?? 'auto',
      aspect_ratio: body.aspect_ratio ?? '9:16',
      generate_audio: body.generate_audio ?? true,
    })

    if (!data) {
      return NextResponse.json({ error: 'Empty response from MCP server' }, { status: 502 })
    }

    // MCP wraps the result in data.result.content[].text (JSON string) or directly in data.result
    const mcpContent = data?.result?.content
    if (Array.isArray(mcpContent)) {
      for (const item of mcpContent) {
        if (item.type === 'text' && item.text) {
          try {
            return NextResponse.json(JSON.parse(item.text))
          } catch {
            return NextResponse.json({ raw: item.text })
          }
        }
      }
    }

    return NextResponse.json(data?.result ?? data)
  } catch (err) {
    console.error('[generate-video]', err)
    const message = err instanceof Error ? err.message : 'Video generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
