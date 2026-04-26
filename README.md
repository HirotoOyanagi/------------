# Reelify Social Studio

SNS投稿、AI画像・動画生成、コンテンツ管理、分析画面をまとめたNext.js製のUIプロトタイプです。

## 初回起動

### 1. 前提

- Node.js 20以上を推奨
- npm

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

プロジェクト直下に `.env.local` を作成し、必要な値を設定します。

```bash
FAL_KEY=your_fal_api_key
KAMUI_CODE_PASS_KEY=your_kamui_code_pass_key
```

補足:

- `FAL_KEY` はアップロードAPIでfal.ai storageを使うために必要です。
- KAMUI MCPのURL設定は、`.claude/kamui_fal_mcp.json` が存在する場合はそちらを優先して読み込みます。
- `KAMUI-CODE-PASS` ヘッダーの値は、`.claude/kamui_fal_mcp.json` ではなく `KAMUI_CODE_PASS_KEY` から差し込みます。
- `.claude/kamui_fal_mcp.json` を使わない場合は、以下のURL環境変数も設定してください。

```bash
KAMUI_IMAGE_GENERATION_URL=your_image_generation_mcp_url
KAMUI_IMAGE_EDIT_URL=your_image_edit_mcp_url
KAMUI_VIDEO_GENERATION_URL=your_video_generation_mcp_url
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

起動後、ブラウザで以下にアクセスします。

```text
http://localhost:3000
```

## よく使うコマンド

```bash
npm run dev
```

開発サーバーを起動します。

```bash
npm run build
```

本番用ビルドを作成します。

```bash
npm run start
```

ビルド済みアプリを本番モードで起動します。事前に `npm run build` が必要です。

## 主な構成

```text
app/              Next.js App Router
app/api/          API Routes
components/       UIコンポーネント
lib/              MCP接続・共通ロジック
public/           静的ファイル
docs/             補足ドキュメント
```

## 注意点

- SNS投稿APIは現在デモ実装です。実際に投稿するには各SNSのOAuth連携と投稿API実装が必要です。
- AI画像・動画生成を使うには、fal.aiとKAMUI MCPの接続設定が必要です。
- 環境変数を変更した場合は、開発サーバーを再起動してください。

## Vercelにデプロイする場合

VercelのProject Settings > Environment Variablesに以下を設定します。

```text
FAL_KEY
KAMUI_CODE_PASS_KEY
```

`.claude/kamui_fal_mcp.json` をデプロイに含める場合、MCPのURLはそのJSONから読み込まれます。認証キーはJSON内ではなく、Vercelの `KAMUI_CODE_PASS_KEY` が使われます。

`.claude/kamui_fal_mcp.json` をデプロイに含めない場合は、Vercelに以下も設定してください。

```text
KAMUI_IMAGE_GENERATION_URL
KAMUI_IMAGE_EDIT_URL
KAMUI_VIDEO_GENERATION_URL
```
