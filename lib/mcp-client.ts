import { seedanceServer } from './mcp-config'

type JsonRpcRequest = {
  jsonrpc: '2.0'
  id?: number
  method: string
  params?: unknown
}

async function rpc(
  url: string,
  baseHeaders: Record<string, string>,
  body: JsonRpcRequest,
  sessionId?: string
): Promise<{ data: unknown; sessionId?: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...baseHeaders,
  }
  if (sessionId) headers['Mcp-Session-Id'] = sessionId

  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })

  const returnedSession =
    res.headers.get('Mcp-Session-Id') ?? res.headers.get('mcp-session-id') ?? undefined

  const contentType = res.headers.get('content-type') ?? ''

  if (contentType.includes('text/event-stream')) {
    const text = await res.text()
    const lines = text.split('\n').filter((l) => l.startsWith('data:'))
    for (const line of lines.reverse()) {
      try {
        const parsed = JSON.parse(line.replace(/^data:\s*/, ''))
        if (parsed?.result !== undefined || parsed?.error !== undefined) {
          return { data: parsed, sessionId: returnedSession }
        }
      } catch { /* skip */ }
    }
    return { data: null, sessionId: returnedSession }
  }

  const data = await res.json().catch(() => null)
  return { data, sessionId: returnedSession }
}

function extractText(data: unknown): string | null {
  const d = data as Record<string, unknown>
  const content = (d?.result as Record<string, unknown>)?.content
  if (Array.isArray(content)) {
    for (const item of content as Array<{ type: string; text?: string }>) {
      if (item.type === 'text' && item.text) return item.text
    }
  }
  return null
}

export interface SeedanceParams {
  prompt: string
  image_urls: string[]
  resolution?: string
  duration?: string | number
  aspect_ratio?: string
  generate_audio?: boolean
}

/**
 * Seedance 2.0 の3ステップ非同期フロー:
 *   submit → status polling → result
 */
export async function generateVideoViaMcp(params: SeedanceParams) {
  const { url, headers: serverHeaders = {} } = seedanceServer

  // ─── 1. Initialize session ───────────────────────────────────────────────
  const init = await rpc(url, serverHeaders, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'reelify', version: '1.0.0' },
    },
  })

  const sessionId = init.sessionId
  console.log('[mcp] session:', sessionId)

  // notifications/initialized (fire-and-forget)
  rpc(url, serverHeaders, { jsonrpc: '2.0', method: 'notifications/initialized' }, sessionId)
    .catch(() => {})

  // ─── 2. Submit job ───────────────────────────────────────────────────────
  console.log('[mcp] submitting job...')
  const submitResult = await rpc(
    url,
    serverHeaders,
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'bytedance_seedance_v20_reference_to_video_submit',
        arguments: params,
      },
    },
    sessionId
  )

  const submitText = extractText(submitResult.data)
  console.log('[mcp] submit response:', submitText?.slice(0, 200))

  let requestId: string | undefined

  // Submit returns either JSON with request_id or plain string
  if (submitText) {
    try {
      const parsed = JSON.parse(submitText) as Record<string, unknown>
      requestId = (parsed.request_id ?? parsed.id) as string | undefined
    } catch {
      // Maybe it's a plain request_id string
      requestId = submitText.trim()
    }
  }

  if (!requestId) {
    throw new Error(`Submit did not return a request_id. Response: ${submitText}`)
  }

  console.log('[mcp] request_id:', requestId)

  // ─── 3. Poll status via Fal.ai queue API ────────────────────────────────
  const statusUrl = `https://queue.fal.run/fal-ai/bytedance/requests/${requestId}/status`
  const resultUrl = `https://queue.fal.run/fal-ai/bytedance/requests/${requestId}`

  const MAX_POLLS = 60
  const POLL_MS   = 5000

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, POLL_MS))

    const statusRes = await fetch(statusUrl, {
      headers: { 'KAMUI-CODE-PASS': serverHeaders['KAMUI-CODE-PASS'] ?? '' },
    })
    const statusData = await statusRes.json() as Record<string, unknown>
    const status = statusData.status as string | undefined

    console.log(`[mcp] poll ${i + 1}:`, status)

    if (status === 'COMPLETED') break
    if (status === 'FAILED' || status === 'ERROR') {
      throw new Error(`Job failed: ${JSON.stringify(statusData)}`)
    }
  }

  // ─── 4. Fetch result via Fal.ai queue API ────────────────────────────────
  const resultRes = await fetch(resultUrl, {
    headers: { 'KAMUI-CODE-PASS': serverHeaders['KAMUI-CODE-PASS'] ?? '' },
  })
  const result = await resultRes.json()

  console.log('[mcp] final result:', JSON.stringify(result)?.slice(0, 300))
  return result
}
