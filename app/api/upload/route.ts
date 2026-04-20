import { NextRequest, NextResponse } from 'next/server'

/**
 * 画像を受け取り、Fal.ai が直接アクセスできる公開URLを返す。
 *
 * Fal.ai / Seedance はクラウドから画像URLにアクセスするため
 * localhost や private URLは不可。
 *
 * プロバイダー優先順:
 *   1. fal.ai storage (FAL_KEY があれば最優先)
 *   2. catbox.moe (無料・匿名)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const blob = new Blob([buffer], { type: file.type || 'image/jpeg' })
    const filename = file.name || 'upload.jpg'

    // ── Option 1: fal.ai storage ────────────────────────────────────────────
    const falKey = process.env.FAL_KEY
    if (falKey) {
      const falForm = new FormData()
      falForm.append('file', blob, filename)

      const falRes = await fetch('https://rest.alpha.fal.ai/storage/upload/file', {
        method: 'POST',
        headers: { Authorization: `Key ${falKey}` },
        body: falForm,
      })

      if (falRes.ok) {
        const data = await falRes.json() as { url?: string; access_url?: string }
        const url = data.access_url ?? data.url
        if (url) {
          console.log('[upload] fal.ai URL:', url)
          return NextResponse.json({ url })
        }
      }
      console.warn('[upload] fal.ai upload failed, falling back')
    }

    // ── Option 2: catbox.moe (無料・匿名) ───────────────────────────────────
    const catboxForm = new FormData()
    catboxForm.append('reqtype', 'fileupload')
    catboxForm.append('fileToUpload', blob, filename)

    const catboxRes = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: catboxForm,
    })

    if (catboxRes.ok) {
      const url = (await catboxRes.text()).trim()
      if (url.startsWith('https://')) {
        console.log('[upload] catbox.moe URL:', url)
        return NextResponse.json({ url })
      }
    }

    throw new Error('All upload providers failed')
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
