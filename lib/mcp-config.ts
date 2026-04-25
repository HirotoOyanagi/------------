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

/**
 * MCPサーバー設定を .claude/ 以下のJSONから読み込む。
 * 起動時に一度だけ読むのでファイルI/Oコストは無視できる。
 */
function loadMcpServer(serverKey: string): McpServerConfig {
  const configPath = path.join(process.cwd(), '.claude', 'kamui_fal_mcp.json')

  try {
    const raw = readFileSync(configPath, 'utf-8')
    const config: McpConfig = JSON.parse(raw)
    const server = config.mcpServers[serverKey]
    if (!server) throw new Error(`MCP server "${serverKey}" not found in config`)
    return server
  } catch (err) {
    // フォールバック: 環境変数から読む
    console.warn('[mcp-config] Failed to read MCP config file, falling back to env vars:', err)
    return {
      type: 'http',
      url: process.env.KAMUI_CODE_URL ?? '',
      headers: { 'KAMUI-CODE-PASS': process.env.KAMUI_CODE_PASS ?? '' },
    }
  }
}

export const seedanceServer = loadMcpServer(
  'r2v-kamui-bytedance-seedance-v20-reference'
)
