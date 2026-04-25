# SNS機能メイン化に向けたデータベース設計

前提: PostgreSQL / Supabase / Prisma などのRDBを想定。認証はGoogle OAuthから開始し、Googleの`sub`をユーザーの外部IDとして保持します。パスワードは保存しません。SNS投稿先のInstagram、TikTok、X、YouTubeなどは、ユーザー作成後に別テーブルでOAuth連携します。

## 認証・ユーザー

| テーブル | 主なカラム | 用途 |
| --- | --- | --- |
| `users` | `id`, `google_sub`, `email`, `email_verified`, `display_name`, `avatar_url`, `locale`, `timezone`, `created_at`, `last_login_at`, `deleted_at` | Google認証で作成されるアプリユーザー。`google_sub`はユニーク。 |
| `profiles` | `user_id`, `handle`, `bio`, `location`, `website_url`, `cover_image_url`, `is_private`, `created_at`, `updated_at` | アプリ内SNSプロフィール。`handle`はユニーク。 |
| `sessions` | `id`, `user_id`, `refresh_token_hash`, `user_agent`, `ip_address`, `expires_at`, `revoked_at` | 自前セッションを使う場合の管理。NextAuth/Auth.jsを使う場合は同等テーブルに置換。 |
| `social_accounts` | `id`, `user_id`, `provider`, `provider_user_id`, `display_name`, `access_token_enc`, `refresh_token_enc`, `scopes`, `expires_at`, `connected_at`, `revoked_at` | 外部SNSへの投稿連携。トークンは必ず暗号化して保存。 |

## SNS本体

| テーブル | 主なカラム | 用途 |
| --- | --- | --- |
| `posts` | `id`, `author_id`, `body`, `visibility`, `reply_to_post_id`, `quote_post_id`, `status`, `published_at`, `created_at`, `updated_at`, `deleted_at` | タイムラインと投稿詳細の中心。下書き、公開、削除済みを`status`で管理。 |
| `post_media` | `id`, `post_id`, `asset_id`, `sort_order`, `alt_text`, `link_url`, `cta_label` | 投稿に添付する画像、動画、リンクカード。 |
| `post_reactions` | `id`, `post_id`, `user_id`, `reaction_type`, `created_at` | いいねなど。`post_id + user_id + reaction_type`をユニークにする。 |
| `post_bookmarks` | `id`, `post_id`, `user_id`, `created_at` | ブックマーク。 |
| `reposts` | `id`, `post_id`, `user_id`, `comment`, `created_at`, `deleted_at` | リポスト、引用投稿。 |
| `follows` | `id`, `follower_id`, `followee_id`, `status`, `created_at` | フォロー関係。非公開アカウント承認にも対応。 |
| `notifications` | `id`, `recipient_id`, `actor_id`, `type`, `post_id`, `is_read`, `created_at` | 通知画面用。 |
| `conversations` | `id`, `created_at`, `updated_at` | DMスレッド。 |
| `conversation_members` | `conversation_id`, `user_id`, `last_read_message_id`, `joined_at` | DM参加者と既読管理。 |
| `messages` | `id`, `conversation_id`, `sender_id`, `body`, `media_asset_id`, `created_at`, `deleted_at` | メッセージ本文。 |

## 作成ツール・コンテンツ管理

| テーブル | 主なカラム | 用途 |
| --- | --- | --- |
| `assets` | `id`, `owner_id`, `asset_type`, `storage_path`, `public_url`, `mime_type`, `width`, `height`, `duration_ms`, `file_size`, `checksum`, `created_at` | アップロード画像、生成画像、動画、音声などの共通ファイル管理。 |
| `content_projects` | `id`, `owner_id`, `title`, `project_type`, `status`, `thumbnail_asset_id`, `created_at`, `updated_at` | 画像作成画面、動画作成画面のプロジェクト単位。 |
| `project_versions` | `id`, `project_id`, `version_no`, `editor_state_json`, `rendered_asset_id`, `created_by`, `created_at` | Canva風編集データや動画タイムラインの保存。 |
| `templates` | `id`, `name`, `template_type`, `preview_asset_id`, `editor_state_json`, `is_public`, `created_at` | テンプレート選択用。 |
| `brand_kits` | `id`, `owner_id`, `name`, `logo_asset_id`, `colors_json`, `fonts_json`, `created_at`, `updated_at` | ブランドカラー、フォント、ロゴ。 |
| `generated_assets` | `id`, `owner_id`, `source_asset_id`, `prompt`, `model`, `generation_params_json`, `result_asset_id`, `status`, `error_message`, `created_at` | AI生成や変換ジョブの履歴。既存の画像・動画生成機能はここに集約。 |

## AI生成ジョブ

| テーブル | 主なカラム | 用途 |
| --- | --- | --- |
| `ai_model_configs` | `id`, `model_key`, `provider`, `modality`, `default_params_json`, `is_active`, `created_at` | 画像生成、動画生成、音声生成などのモデル設定。 |
| `ai_generation_jobs` | `id`, `owner_id`, `project_id`, `job_type`, `prompt`, `negative_prompt`, `model_config_id`, `input_asset_ids`, `params_json`, `status`, `progress`, `error_message`, `started_at`, `completed_at`, `created_at` | AI生成リクエストの実行単位。UI上の「AIで生成」ボタンはここにジョブを作成します。 |
| `ai_generation_outputs` | `id`, `job_id`, `asset_id`, `variant_no`, `score`, `metadata_json`, `selected_at`, `created_at` | 生成候補。画像の複数案、動画の複数レンダーを保存。 |
| `ai_video_timelines` | `id`, `job_id`, `project_version_id`, `timeline_json`, `duration_ms`, `aspect_ratio`, `audio_asset_id`, `created_at` | AI動画の絵コンテ、シーン、字幕、BGM、タイムライン情報。 |
| `prompt_presets` | `id`, `owner_id`, `name`, `modality`, `prompt`, `params_json`, `is_shared`, `created_at`, `updated_at` | よく使う画像・動画生成プロンプトのテンプレート。 |
| `render_exports` | `id`, `project_id`, `project_version_id`, `asset_id`, `export_type`, `status`, `requested_by`, `created_at`, `completed_at` | 編集後の画像・動画を書き出すジョブ。 |

## 投稿・広告配信

| テーブル | 主なカラム | 用途 |
| --- | --- | --- |
| `publish_campaigns` | `id`, `owner_id`, `content_project_id`, `post_id`, `mode`, `caption`, `link_url`, `cta_label`, `targeting_json`, `status`, `created_at` | 「通常投稿」「広告として投稿」の設定単位。 |
| `publish_targets` | `id`, `campaign_id`, `provider`, `social_account_id`, `scheduled_at`, `status`, `external_post_id`, `error_message`, `created_at`, `updated_at` | SNSごとの投稿予約と結果。 |
| `publish_jobs` | `id`, `target_id`, `run_at`, `attempt_count`, `locked_at`, `finished_at`, `status`, `last_error` | スケジュール投稿のワーカー管理。 |
| `hashtags` | `id`, `name`, `normalized_name`, `created_at` | ハッシュタグマスタ。 |
| `post_hashtags` | `post_id`, `hashtag_id` | 投稿とハッシュタグの関連。 |

## 分析

| テーブル | 主なカラム | 用途 |
| --- | --- | --- |
| `post_metric_snapshots` | `id`, `post_id`, `provider`, `impressions`, `reach`, `engagements`, `likes`, `reposts`, `replies`, `saves`, `clicks`, `recorded_at` | 分析画面のKPIと折れ線グラフ。 |
| `asset_metric_snapshots` | `id`, `asset_id`, `views`, `watch_time_ms`, `completion_rate`, `clicks`, `recorded_at` | 動画、画像単位のパフォーマンス。 |
| `analytics_events` | `id`, `user_id`, `post_id`, `event_type`, `metadata_json`, `created_at` | アプリ内イベント収集。大量になる場合はDWHへ分離。 |

## 推奨インデックス

- `users.google_sub` unique
- `profiles.handle` unique
- `posts(author_id, published_at desc)`、`posts(reply_to_post_id, published_at)`
- `post_reactions(post_id, user_id, reaction_type)` unique
- `follows(follower_id, followee_id)` unique
- `assets(owner_id, created_at desc)`
- `content_projects(owner_id, updated_at desc)`
- `ai_generation_jobs(owner_id, created_at desc)`
- `ai_generation_jobs(status, created_at)`
- `ai_generation_outputs(job_id, variant_no)`
- `publish_targets(status, scheduled_at)`
- `post_metric_snapshots(post_id, recorded_at)`

## 実装メモ

- Google認証は最初の入口に限定し、外部SNSへの投稿権限は`social_accounts`で別管理します。
- OAuthトークン、投稿ジョブのエラー、分析イベントは個人情報を含みやすいため、暗号化、監査ログ、削除処理を先に設計します。
- タイムラインは`posts`と`follows`から生成できますが、規模が大きくなったら`timeline_items`のような配信用テーブルや検索基盤を追加します。
- 編集画面の状態は`project_versions.editor_state_json`に保存し、最終レンダー済みの画像・動画は`assets`に保存します。
- AI画像生成は`/api/generate-image`、AI動画のクリエイティブ生成は`/api/generate-creative-video`のようなジョブ作成APIから開始し、完了後に`ai_generation_outputs`と`assets`へ結果を保存します。
