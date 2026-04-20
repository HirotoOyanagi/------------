import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const ext = path.extname(file.name).toLowerCase() || '.jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    await writeFile(path.join(uploadsDir, filename), buffer)

    const host = request.headers.get('host') ?? 'localhost:3000'
    const protocol = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
    const url = `${protocol}://${host}/uploads/${filename}`

    return NextResponse.json({ url, filename })
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
