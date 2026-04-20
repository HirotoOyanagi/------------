import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

fal.config({ credentials: process.env.FAL_KEY })

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const blob = new Blob([bytes], { type: file.type || 'image/jpeg' })

    console.log('[upload] Uploading to fal.ai storage:', file.name, file.type)

    const url = await fal.storage.upload(blob)

    console.log('[upload] fal.ai URL:', url)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
