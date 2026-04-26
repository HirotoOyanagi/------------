import { readFileSync } from 'fs'
import path from 'path'

interface McpServerConfig {
  type: string
  url: string
  description?: string
  headers?: Record<string, string>
}

interface McpConfig {
  mcpServers: Record<string, McpServerConfig>
}

function getKamuiCodePass() {
  return process.env.KAMUI_CODE_PASS_KEY ?? process.env.KAMUI_CODE_PASS ?? ''
}

function applyKamuiCodePass(server: McpServerConfig, serverKey: string): McpServerConfig {
  const { headers = {}, ...rest } = server
  const otherHeaders = { ...headers }
  delete otherHeaders['KAMUI-CODE-PASS']
  const pass = getKamuiCodePass()

  if (!pass) {
    console.warn(`[mcp-config] Missing KAMUI_CODE_PASS_KEY. MCP requests for ${serverKey} may fail.`)
  }

  return {
    ...rest,
    headers: pass ? { ...otherHeaders, 'KAMUI-CODE-PASS': pass } : otherHeaders,
  }
}

/**
 * MCPサーバー設定を .claude/ 以下のJSONから読み込む。
 * 認証ヘッダーはJSONではなく .env.local / Vercel環境変数の KAMUI_CODE_PASS_KEY から差し込む。
 */
function loadMcpServer(serverKey: string, urlEnvName: string): McpServerConfig {
  const configPath = path.join(process.cwd(), '.claude', 'kamui_fal_mcp.json')

  try {
    const raw = readFileSync(configPath, 'utf-8')
    const config: McpConfig = JSON.parse(raw)
    const server = config.mcpServers[serverKey]
    if (!server) throw new Error(`MCP server "${serverKey}" not found in config`)
    return applyKamuiCodePass(server, serverKey)
  } catch (err) {
    // フォールバック: 環境変数から読む
    console.warn('[mcp-config] Failed to read MCP config file, falling back to env vars:', err)
    const pass = getKamuiCodePass()
    const url = process.env[urlEnvName] ?? process.env.KAMUI_CODE_URL ?? ''

    if (!url) {
      console.warn(`[mcp-config] Missing ${urlEnvName}. MCP requests for ${serverKey} will fail.`)
    }

    return {
      type: 'http',
      url,
      headers: pass ? { 'KAMUI-CODE-PASS': pass } : {},
    }
  }
}

export const seedanceServer = loadMcpServer(
  'r2v-kamui-bytedance-seedance-v20-reference',
  'KAMUI_VIDEO_GENERATION_URL'
)

export const imageGenerationServer = loadMcpServer(
  't2i-kamui-fal-openai-gpt-image-2',
  'KAMUI_IMAGE_GENERATION_URL'
)

export const imageEditServer = loadMcpServer(
  'i2i-kamui-fal-openai-gpt-image-2-edit',
  'KAMUI_IMAGE_EDIT_URL'
)
