'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Bookmark,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  FolderOpen,
  Globe2,
  Grid3X3,
  Hash,
  Heart,
  Home as HomeIcon,
  Image as ImageIcon,
  Layers,
  Link,
  Lock,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Music,
  Palette,
  Pause,
  PenLine,
  Play,
  Plus,
  Repeat2,
  Search,
  Shapes,
  Smile,
  Sparkles,
  TrendingUp,
  Type,
  Upload,
  User,
  Video,
  Wand2,
} from 'lucide-react'

type View =
  | 'timeline'
  | 'post'
  | 'compose'
  | 'image'
  | 'video'
  | 'analytics'
  | 'profile'
  | 'content'
  | 'publish'

type NavItem = {
  key: string
  label: string
  icon: LucideIcon
  view: View
}

type Post = {
  author: string
  handle: string
  avatar: string
  avatarTone: string
  body: string
  time: string
  creative: 'natural' | 'fashion' | 'travel'
  stats: {
    replies: string
    reposts: string
    likes: string
    saves: string
  }
}

type ContentItem = {
  title: string
  type: '画像' | '動画'
  date: string
  status: '公開済み' | '下書き'
  creative: 'natural' | 'fashion' | 'travel'
}

const navItems: NavItem[] = [
  { key: 'home', label: 'ホーム', icon: HomeIcon, view: 'timeline' },
  { key: 'search', label: '話題を検索', icon: Search, view: 'timeline' },
  { key: 'notice', label: '通知', icon: Bell, view: 'timeline' },
  { key: 'message', label: 'メッセージ', icon: Mail, view: 'timeline' },
  { key: 'bookmark', label: 'ブックマーク', icon: Bookmark, view: 'timeline' },
  { key: 'create', label: '作成ツール', icon: Wand2, view: 'compose' },
  { key: 'content', label: 'コンテンツ一覧', icon: FolderOpen, view: 'content' },
  { key: 'analytics', label: '分析', icon: BarChart3, view: 'analytics' },
  { key: 'profile', label: 'プロフィール', icon: User, view: 'profile' },
]

const activeKeyByView: Record<View, string> = {
  timeline: 'home',
  post: 'home',
  compose: 'create',
  image: 'create',
  video: 'create',
  analytics: 'analytics',
  profile: 'profile',
  content: 'content',
  publish: 'content',
}

const posts: Post[] = [
  {
    author: 'sample_user',
    handle: '@sample_user',
    avatar: 'S',
    avatarTone: 'bg-teal-700',
    body: '今日はいい天気ですね！\nこんな日は外でリフレッシュしたい！',
    time: '1時間',
    creative: 'travel',
    stats: { replies: '12', reposts: '34', likes: '256', saves: '8' },
  },
  {
    author: 'Brand Official',
    handle: '@brand_official',
    avatar: 'brd',
    avatarTone: 'bg-orange-400',
    body: 'あなたの毎日を、もっと特別に。\n新しいライフスタイルを提案します。',
    time: '広告',
    creative: 'natural',
    stats: { replies: '48', reposts: '132', likes: '1,024', saves: '25' },
  },
]

const contentItems: ContentItem[] = [
  { title: '新商品バナー - 春のキャンペーン', type: '画像', date: '2026/04/25', status: '公開済み', creative: 'natural' },
  { title: 'Summer Sale プロモーション', type: '画像', date: '2026/04/18', status: '公開済み', creative: 'fashion' },
  { title: 'ブランド紹介動画', type: '動画', date: '2026/04/15', status: '公開済み', creative: 'natural' },
  { title: '新作コレクション紹介', type: '動画', date: '2026/04/10', status: '下書き', creative: 'fashion' },
  { title: 'GWキャンペーンバナー', type: '画像', date: '2026/04/05', status: '公開済み', creative: 'travel' },
]

const userSuggestions = [
  { name: 'Design Life', handle: '@design_life', tone: 'bg-slate-700' },
  { name: 'Travel Note', handle: '@travel_note', tone: 'bg-sky-700' },
  { name: 'Tech Insights', handle: '@tech_insights', tone: 'bg-blue-500' },
]

const trends = [
  ['#週末の過ごし方', '12,345 posts'],
  ['#新商品', '8,765 posts'],
  ['#写真好きな人と繋がりたい', '6,543 posts'],
]

const analyticsRows = [
  ['春のための商品、もっとキャンペーン', '2026/04/20', '30,456', '2,345', '7.2%'],
  ['Natural & Beautiful Life', '2026/04/18', '26,980', '1,908', '6.8%'],
  ['New Collection 2026', '2026/04/10', '18,233', '1,126', '5.4%'],
]

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [view, setView] = useState<View>('timeline')
  const [selectedPost, setSelectedPost] = useState<Post>(posts[1])
  const [publishItem, setPublishItem] = useState<ContentItem>(contentItems[1])

  const openPost = (post: Post) => {
    setSelectedPost(post)
    setView('post')
  }

  const openPublish = (item: ContentItem) => {
    setPublishItem(item)
    setView('publish')
  }

  if (!isSignedIn) {
    return <AuthGate onSignIn={() => setIsSignedIn(true)} />
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <MobileHeader onCompose={() => setView('compose')} />
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] md:grid-cols-[224px_minmax(0,1fr)]">
        <Sidebar currentView={view} onNavigate={setView} />
        <main className="min-w-0 border-x border-slate-200 bg-white/70">
          {view === 'timeline' && <TimelineView onOpenPost={openPost} />}
          {view === 'post' && (
            <PostDetailView post={selectedPost} onBack={() => setView('timeline')} />
          )}
          {view === 'compose' && (
            <ComposeView
              onOpenImageEditor={() => setView('image')}
              onOpenVideoEditor={() => setView('video')}
            />
          )}
          {view === 'image' && <ImageEditorView onBack={() => setView('compose')} />}
          {view === 'video' && <VideoEditorView onBack={() => setView('compose')} />}
          {view === 'analytics' && <AnalyticsView />}
          {view === 'profile' && <ProfileView onOpenPost={openPost} />}
          {view === 'content' && (
            <ContentListView onPublish={openPublish} onCreate={() => setView('compose')} />
          )}
          {view === 'publish' && (
            <PublishView item={publishItem} onBack={() => setView('content')} />
          )}
        </main>
      </div>
    </div>
  )
}

function AuthGate({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <BrandLogo />
          <div className="mt-10 space-y-4">
            <p className="text-sm font-semibold text-blue-600">SNS運用プラットフォーム</p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
              Googleアカウントで運用を開始
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              タイムライン、投稿作成、コンテンツ管理、分析を同じワークスペースで扱う想定のUIです。
            </p>
          </div>
          <button
            onClick={onSignIn}
            className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 text-sm font-bold text-blue-600">
              G
            </span>
            Googleで始める
          </button>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            本番実装ではGoogle OAuthのsubをユーザー識別子として保存し、各SNS連携は別途OAuthで接続します。
          </p>
        </section>

        <section className="hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <div className="grid grid-cols-[120px_minmax(0,1fr)_220px] gap-4">
            <div className="space-y-2 border-r border-slate-200 pr-3">
              {['ホーム', '通知', '作成ツール', '分析', 'プロフィール'].map((item, index) => (
                <div
                  key={item}
                  className={`h-9 rounded-md px-3 py-2 text-xs ${
                    index === 0 ? 'bg-blue-50 text-blue-700' : 'text-slate-500'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-10 border-b border-slate-200 text-lg font-semibold">ホーム</div>
              <PostCard post={posts[1]} onOpen={() => undefined} compact />
            </div>
            <RightRail />
          </div>
        </section>
      </div>
    </div>
  )
}

function MobileHeader({ onCompose }: { onCompose: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
      <button className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600">
        <Menu className="h-5 w-5" />
      </button>
      <BrandLogo compact />
      <button
        onClick={onCompose}
        className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white"
        aria-label="投稿する"
      >
        <PenLine className="h-4 w-4" />
      </button>
    </header>
  )
}

function Sidebar({
  currentView,
  onNavigate,
}: {
  currentView: View
  onNavigate: (view: View) => void
}) {
  const activeKey = activeKeyByView[currentView]

  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-slate-200 bg-white px-4 py-5 md:flex">
      <BrandLogo />
      <nav className="mt-7 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.key === activeKey
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.view)}
              className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                active
                  ? 'bg-blue-50 font-semibold text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <button
        onClick={() => onNavigate('compose')}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        <PenLine className="h-4 w-4" />
        投稿する
      </button>
      <div className="mt-auto flex items-center gap-3 rounded-lg px-2 py-3">
        <Avatar label="S" tone="bg-stone-700" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">sample_user</p>
          <p className="truncate text-xs text-slate-500">@sample_user</p>
        </div>
        <MoreHorizontal className="ml-auto h-4 w-4 text-slate-500" />
      </div>
    </aside>
  )
}

function TimelineView({ onOpenPost }: { onOpenPost: (post: Post) => void }) {
  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="min-w-0 border-r border-slate-200">
        <HeaderBlock title="ホーム" />
        <Tabs labels={['おすすめ', 'フォロー中', 'トレンド', 'ニュース']} active="おすすめ" />
        <QuickComposer />
        <div className="divide-y divide-slate-200">
          {posts.map((post) => (
            <PostCard key={`${post.handle}-${post.time}`} post={post} onOpen={() => onOpenPost(post)} />
          ))}
        </div>
      </section>
      <RightRail />
    </div>
  )
}

function HeaderBlock({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
      <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
      {action}
    </div>
  )
}

function Tabs({
  labels,
  active,
}: {
  labels: string[]
  active: string
}) {
  return (
    <div className="flex h-12 items-end gap-5 border-b border-slate-200 bg-white px-5">
      {labels.map((label) => (
        <button
          key={label}
          className={`relative h-12 text-sm ${
            label === active ? 'font-semibold text-blue-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {label}
          {label === active && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600" />
          )}
        </button>
      ))}
    </div>
  )
}

function QuickComposer() {
  return (
    <div className="border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex gap-3">
        <Avatar label="S" tone="bg-stone-700" />
        <div className="min-w-0 flex-1">
          <textarea
            className="h-16 w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="いまどうしてる？"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-blue-600">
              {[ImageIcon, Video, Smile, Calendar, Hash].map((Icon, index) => (
                <button key={index} className="grid h-8 w-8 place-items-center rounded-md hover:bg-blue-50">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              投稿する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({
  post,
  onOpen,
  compact = false,
}: {
  post: Post
  onOpen: () => void
  compact?: boolean
}) {
  return (
    <article className="bg-white px-5 py-4 transition hover:bg-slate-50/70">
      <div className="flex gap-3">
        <Avatar label={post.avatar} tone={post.avatarTone} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{post.author}</p>
              <p className="text-xs text-slate-500">
                {post.handle} · {post.time}
              </p>
            </div>
            <button className="ml-auto grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <button onClick={onOpen} className="mt-2 block w-full text-left">
            <p className="whitespace-pre-line text-sm leading-6 text-slate-800">{post.body}</p>
            {!compact && <CreativeCard variant={post.creative} className="mt-3" />}
          </button>
          {compact && <CreativeCard variant={post.creative} className="mt-3" small />}
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-slate-500 sm:flex sm:items-center sm:gap-8">
            <Metric icon={MessageCircle} value={post.stats.replies} />
            <Metric icon={Repeat2} value={post.stats.reposts} />
            <Metric icon={Heart} value={post.stats.likes} />
            <Metric icon={Bookmark} value={post.stats.saves} />
          </div>
        </div>
      </div>
    </article>
  )
}

function PostDetailView({ post, onBack }: { post: Post; onBack: () => void }) {
  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="min-w-0 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">ポスト</h1>
        </div>

        <article className="px-5 py-5">
          <div className="flex items-start gap-3">
            <Avatar label={post.avatar} tone={post.avatarTone} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{post.author}</p>
              <p className="text-sm text-slate-500">{post.handle}</p>
            </div>
            <MoreHorizontal className="h-5 w-5 text-slate-500" />
          </div>
          <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-900">{post.body}</p>
          <CreativeCard variant={post.creative} className="mt-4" large />
          <p className="mt-4 border-b border-slate-200 pb-4 text-sm text-slate-500">
            2026年4月25日 10:30 · 10.2万件の表示
          </p>
          <div className="grid grid-cols-4 gap-4 border-b border-slate-200 py-4 text-sm">
            <strong>48 <span className="font-normal text-slate-500">リポスト</span></strong>
            <strong>132 <span className="font-normal text-slate-500">件の引用</span></strong>
            <strong>1,024 <span className="font-normal text-slate-500">いいね</span></strong>
            <strong>25 <span className="font-normal text-slate-500">ブックマーク</span></strong>
          </div>
          <div className="flex gap-3 border-b border-slate-200 py-4">
            <Avatar label="S" tone="bg-stone-700" />
            <input
              className="h-11 min-w-0 flex-1 rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              placeholder="返信をポスト"
            />
            <button className="rounded-full bg-blue-500 px-5 text-sm font-semibold text-white">返信</button>
          </div>
        </article>

        <div className="divide-y divide-slate-200">
          <CommentRow name="yuki" text="素敵な商品ですね！気になっています！" />
          <CommentRow name="market_jp" text="ビジュアルが上品で、広告としても使いやすそうです。" />
        </div>
      </section>
      <aside className="hidden bg-[#f8fafc] p-4 xl:block">
        <Panel title="関連するポスト">
          <MiniRelatedPost />
        </Panel>
        <Panel title="いまどうしてる？" className="mt-4">
          <TrendList />
        </Panel>
      </aside>
    </div>
  )
}

function ComposeView({
  onOpenImageEditor,
  onOpenVideoEditor,
}: {
  onOpenImageEditor: () => void
  onOpenVideoEditor: () => void
}) {
  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="min-w-0 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <h1 className="text-xl font-semibold">新しい投稿</h1>
          <button className="flex h-9 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700">
            公開
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <textarea
            className="min-h-[300px] w-full resize-none rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 outline-none focus:border-blue-500"
            placeholder="いまどうしてる？"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionPill icon={ImageIcon} label="画像" onClick={onOpenImageEditor} />
            <ActionPill icon={Video} label="動画" onClick={onOpenVideoEditor} />
            <ActionPill icon={FileText} label="GIF" />
            <ActionPill icon={Smile} label="絵文字" />
            <ActionPill icon={BarChart3} label="投票" />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex items-center gap-1 text-blue-600">
              {[ImageIcon, Video, Smile, Calendar, Link, Hash].map((Icon, index) => (
                <button key={index} className="grid h-9 w-9 place-items-center rounded-md hover:bg-blue-50">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <button className="rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600">
              投稿する
            </button>
          </div>
        </div>
      </section>
      <aside className="hidden bg-[#f8fafc] p-4 xl:block">
        <Panel title="投稿のヒント">
          <HintItem icon={ImageIcon} title="魅力的な視覚素材を添えましょう" body="写真や動画を選択すると、注目を集めやすくなります。" />
          <HintItem icon={Hash} title="ハッシュタグを活用しましょう" body="投稿に関連するハッシュタグで、より多くの人に届きます。" />
          <HintItem icon={Lock} title="広告として投稿しよう" body="作成ツールを使って、効果的な広告配信を準備できます。" />
        </Panel>
      </aside>
    </div>
  )
}

function ImageEditorView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button className="rounded-md px-3 py-2 text-sm hover:bg-slate-100">ファイル</button>
          <button className="rounded-md px-3 py-2 text-sm hover:bg-slate-100">サイズ変更</button>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm">66%</button>
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            <Download className="h-4 w-4" />
            ダウンロード
          </button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-56px)] grid-cols-[172px_minmax(0,1fr)_252px]">
        <aside className="border-r border-slate-200 bg-white p-3">
          {[
            [Grid3X3, 'テンプレート'],
            [ImageIcon, '写真'],
            [Type, 'テキスト'],
            [Shapes, '図形'],
            [Sparkles, 'アイコン'],
            [Upload, 'アップロード'],
            [Palette, '背景'],
            [Layers, 'ブランドキット'],
          ].map(([Icon, label]) => {
            const ToolIcon = Icon as LucideIcon
            return (
              <button key={label as string} className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-slate-700 hover:bg-slate-50">
                <ToolIcon className="h-4 w-4" />
                {label as string}
              </button>
            )
          })}
        </aside>

        <section className="flex flex-col bg-[#f3f5f8] p-6">
          <div className="mx-auto grid w-full max-w-[760px] flex-1 place-items-center">
            <div className="relative aspect-[1.62/1] w-full max-w-[640px] border border-slate-300 bg-white shadow-sm">
              <CreativeCard variant="fashion" className="h-full rounded-none border-0" editor />
              <div className="absolute left-[7%] top-[11%] w-[38%] border border-blue-500 bg-white/10 p-3">
                <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-white ring-2 ring-blue-500" />
                <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-white ring-2 ring-blue-500" />
                <div className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-white ring-2 ring-blue-500" />
                <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-white ring-2 ring-blue-500" />
                <p className="text-4xl font-semibold leading-tight text-slate-950">New<br />Collection<br />2026</p>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-5 flex w-full max-w-[640px] items-center justify-center gap-3">
            {(['fashion', 'natural', 'travel', 'natural'] as const).map((variant, index) => (
              <button key={`${variant}-${index}`} className="h-14 w-20 overflow-hidden rounded-md border border-slate-200 bg-white p-1">
                <CreativeCard variant={variant} small className="h-full border-0" />
              </button>
            ))}
            <button className="grid h-14 w-14 place-items-center rounded-md border border-slate-200 bg-white">
              <Plus className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </section>

        <aside className="border-l border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">編集</h2>
            <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-5 space-y-5">
            <Field label="フォント" value="Noto Sans JP" />
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">スタイル</p>
              <div className="flex gap-2">
                {['B', 'I', 'U'].map((item) => (
                  <button key={item} className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-sm font-semibold">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <Field label="色" value="#232322" />
            <Field label="サイズ" value="48" />
            <Field label="透明度" value="100%" />
            <button className="h-10 w-full rounded-md border border-slate-200 text-sm font-semibold">はずす</button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function VideoEditorView({ onBack }: { onBack: () => void }) {
  const clips = ['00:00', '00:03', '00:06', '00:09', '00:12']

  return (
    <div className="min-h-screen bg-[#181a20] text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold">プロジェクト名：新商品PR動画</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-white/10 px-4 py-2 text-sm">自動保存</button>
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold">
            <Upload className="h-4 w-4" />
            エクスポート
          </button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-56px)] grid-cols-[72px_minmax(0,1fr)_260px]">
        <aside className="border-r border-white/10 p-2">
          {[
            [Video, 'メディア'],
            [Type, 'テキスト'],
            [Sparkles, 'エフェクト'],
            [Shapes, '図形'],
            [Layers, '素材'],
            [Music, '音楽'],
            [Mic, '録音'],
          ].map(([Icon, label]) => {
            const ToolIcon = Icon as LucideIcon
            return (
              <button key={label as string} className="mb-2 grid h-14 w-full place-items-center rounded-md text-xs text-slate-300 hover:bg-white/10">
                <ToolIcon className="h-4 w-4" />
                <span>{label as string}</span>
              </button>
            )
          })}
        </aside>

        <section className="flex flex-col p-5">
          <div className="grid flex-1 place-items-center">
            <div className="relative aspect-video w-full max-w-[760px] overflow-hidden rounded-lg bg-slate-900 shadow-2xl">
              <CreativeCard variant="natural" className="h-full rounded-none border-0" editor />
              <div className="absolute right-[16%] top-[18%] w-[28%] border border-blue-400 p-3">
                <p className="text-5xl font-light leading-tight text-white">New<br />Lifestyle</p>
                <p className="mt-3 text-sm text-white/80">毎日に、やさしさを。</p>
              </div>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-black/40 px-5 py-2">
                <button><Pause className="h-4 w-4" /></button>
                <button><Play className="h-4 w-4" /></button>
                <span className="text-xs">00:05 / 00:15</span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>タイムライン</span>
              <span>15秒</span>
            </div>
            <div className="relative h-28">
              <div className="grid h-20 grid-cols-5 gap-2">
                {clips.map((clip, index) => (
                  <div key={clip} className="overflow-hidden rounded-md border border-white/10 bg-white/5">
                    <CreativeCard variant={index % 2 === 0 ? 'natural' : 'fashion'} small className="h-full border-0" />
                    <span className="absolute mt-1 text-[10px] text-slate-400">{clip}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-4 rounded-full bg-violet-500/70" />
              <div className="absolute left-[50%] top-0 h-full w-0.5 bg-blue-400" />
            </div>
          </div>
        </section>

        <aside className="border-l border-white/10 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">テキスト</h2>
            <MoreHorizontal className="h-4 w-4 text-slate-400" />
          </div>
          <textarea className="mt-4 h-24 w-full resize-none rounded-md border border-white/10 bg-white/5 p-3 text-sm outline-none" defaultValue="New Lifestyle" />
          <Field label="フォント" value="Noto Sans JP" dark />
          <div className="mt-5">
            <p className="mb-2 text-xs text-slate-400">カラー</p>
            <div className="flex gap-2">
              {['#ffffff', '#111827', '#d8c7ae', '#0a7cff'].map((color) => (
                <button key={color} className="h-7 w-7 rounded-full border border-white/20" style={{ background: color }} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function AnalyticsView() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderBlock
        title="投稿分析"
        action={
          <div className="flex items-center gap-2">
            <button className="hidden rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 sm:block">
              2026/04/01 - 2026/04/25
            </button>
            <button className="flex items-center gap-2 rounded-md border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700">
              <Download className="h-4 w-4" />
              エクスポート
            </button>
          </div>
        }
      />
      <Tabs labels={['概要', 'リーチ', 'エンゲージメント', 'オーディエンス']} active="概要" />
      <div className="space-y-5 p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <KpiCard label="インプレッション" value="128,543" change="+22.5%" />
          <KpiCard label="リーチ" value="89,456" change="+18.3%" />
          <KpiCard label="エンゲージメント" value="9,875" change="+25.7%" />
          <KpiCard label="クリック数" value="4,321" change="+18.8%" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Panel title="インプレッションの推移">
            <LineChart />
          </Panel>
          <Panel title="エンゲージメントの内訳">
            <DonutChart />
          </Panel>
        </div>
        <Panel title="人気の投稿">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs text-slate-500">
                <tr>
                  <th className="py-3 font-medium">サムネイル</th>
                  <th className="font-medium">投稿</th>
                  <th className="font-medium">インプレッション</th>
                  <th className="font-medium">エンゲージメント</th>
                  <th className="font-medium">率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyticsRows.map((row, index) => (
                  <tr key={row[0]}>
                    <td className="py-3"><CreativeCard variant={index === 2 ? 'fashion' : 'natural'} small className="h-12 w-16" /></td>
                    <td className="font-medium text-slate-800">{row[0]}<br /><span className="text-xs font-normal text-slate-500">{row[1]}</span></td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  )
}

function ProfileView({ onOpenPost }: { onOpenPost: (post: Post) => void }) {
  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="min-w-0 border-r border-slate-200 bg-white">
        <div className="relative h-52 overflow-hidden border-b border-slate-200 bg-slate-200">
          <div className="profile-cover absolute inset-0" />
        </div>
        <div className="px-5 pb-4">
          <div className="-mt-12 flex items-end justify-between">
            <Avatar label="S" tone="bg-teal-700" size="xl" />
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">プロフィールを編集</button>
          </div>
          <div className="mt-4">
            <h1 className="text-xl font-semibold">sample_user</h1>
            <p className="text-sm text-slate-500">@sample_user</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-700">
              シンプルで暮らしに、やさしさを届けたい投稿をしています。社員だけどいまはSNSで運用練習中。
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Tokyo, Japan</span>
              <span>2025年1月から利用しています</span>
            </div>
            <div className="mt-3 flex gap-5 text-sm">
              <span><strong>128</strong> フォロー中</span>
              <span><strong>1,234</strong> フォロワー</span>
            </div>
          </div>
        </div>
        <Tabs labels={['ポスト', '返信', 'メディア', 'いいね']} active="ポスト" />
        <PostCard post={posts[0]} onOpen={() => onOpenPost(posts[0])} />
      </section>
      <RightRail />
    </div>
  )
}

function ContentListView({
  onPublish,
  onCreate,
}: {
  onPublish: (item: ContentItem) => void
  onCreate: () => void
}) {
  return (
    <div className="min-h-screen bg-white">
      <HeaderBlock
        title="コンテンツ一覧"
        action={
          <button onClick={onCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            新しく作成
          </button>
        }
      />
      <Tabs labels={['すべて', '画像', '動画', '下書き']} active="すべて" />
      <div className="p-5">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">サムネイル</th>
                <th className="font-medium">タイトル</th>
                <th className="font-medium">種類</th>
                <th className="font-medium">作成日</th>
                <th className="font-medium">ステータス</th>
                <th className="font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contentItems.map((item) => (
                <tr key={item.title} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <CreativeCard variant={item.creative} small className="h-14 w-20" />
                  </td>
                  <td className="font-medium text-slate-800">{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    <button onClick={() => onPublish(item)} className="rounded-md px-3 py-2 text-blue-700 hover:bg-blue-50">
                      投稿設定
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PublishView({ item, onBack }: { item: ContentItem; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">投稿する</h1>
      </div>
      <Tabs labels={['通常投稿', '広告として投稿']} active="広告として投稿" />
      <div className="grid gap-6 p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Panel title="選択したコンテンツ">
          <CreativeCard variant={item.creative} className="mb-3" />
          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
          <p className="text-xs text-slate-500">{item.date}</p>
          <button className="mt-4 h-9 w-full rounded-md bg-slate-100 text-sm font-semibold text-blue-700">
            変更
          </button>
        </Panel>
        <section className="space-y-4">
          <Field label="テキスト" value="キャプションを入力してください..." area />
          <Field label="リンク" value="https://example.com" />
          <Field label="CTAボタン（任意）" value="詳しくはこちら" select />
          <Field label="ターゲティング（既定）" value="すべてのユーザー" select />
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex gap-1 text-blue-600">
              {[ImageIcon, Video, Smile, Calendar, Link, Hash].map((Icon, index) => (
                <button key={index} className="grid h-9 w-9 place-items-center rounded-md hover:bg-blue-50">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white">投稿する</button>
          </div>
        </section>
      </div>
    </div>
  )
}

function RightRail() {
  return (
    <aside className="hidden bg-[#f8fafc] p-4 xl:block">
      <Panel title="おすすめユーザー">
        <div className="space-y-3">
          {userSuggestions.map((user) => (
            <div key={user.handle} className="flex items-center gap-3">
              <Avatar label={user.name[0]} tone={user.tone} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.handle}</p>
              </div>
              <button className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold">
                フォロー
              </button>
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm font-semibold text-blue-700">さらに見る</button>
      </Panel>
      <Panel title="トレンド" className="mt-4">
        <TrendList />
      </Panel>
    </aside>
  )
}

function TrendList() {
  return (
    <div className="space-y-4">
      {trends.map(([name, count]) => (
        <button key={name} className="block w-full text-left">
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{count}</p>
        </button>
      ))}
      <button className="text-sm font-semibold text-blue-700">さらに見る</button>
    </div>
  )
}

function Panel({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-4 ${className}`}>
      <h2 className="mb-4 text-sm font-semibold text-slate-950">{title}</h2>
      {children}
    </section>
  )
}

function CreativeCard({
  variant,
  className = '',
  small = false,
  large = false,
  editor = false,
}: {
  variant: 'natural' | 'fashion' | 'travel'
  className?: string
  small?: boolean
  large?: boolean
  editor?: boolean
}) {
  const size = small ? 'h-full min-h-0' : large ? 'aspect-[1.92/1]' : 'aspect-[1.9/1]'

  if (variant === 'fashion') {
    return (
      <div className={`creative-fashion relative overflow-hidden rounded-lg border border-slate-200 ${size} ${className}`}>
        <div className="absolute left-[8%] top-[14%] z-10">
          {!small && !editor && <p className="text-3xl font-semibold leading-tight text-slate-950">New<br />Collection<br />2026</p>}
          {!small && !editor && <p className="mt-4 text-sm text-slate-700">あなたらしさを、もっと自由に。</p>}
          {small && <span className="text-[10px] font-semibold text-slate-700">New</span>}
        </div>
        <div className="fashion-person" />
        {!small && !editor && (
          <button className="absolute bottom-[12%] left-[8%] rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
            Shop Now
          </button>
        )}
      </div>
    )
  }

  if (variant === 'travel') {
    return (
      <div className={`creative-travel relative overflow-hidden rounded-lg border border-slate-200 ${size} ${className}`}>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/45 to-transparent p-4 text-white">
          {!small && <p className="text-xl font-semibold">Weekend Refresh</p>}
          {!small && <p className="text-sm opacity-90">brand-official.com</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={`creative-natural relative overflow-hidden rounded-lg border border-slate-200 ${size} ${className}`}>
      <div className="absolute left-[8%] top-[22%] z-10 text-white">
        {!small && <p className="text-3xl font-light leading-tight md:text-4xl">Natural &<br />Beautiful Life</p>}
        {!small && <p className="mt-3 text-sm opacity-90">あなたらしさを、もっと。</p>}
        {small && <span className="text-[10px] font-semibold">Natural</span>}
      </div>
      <div className="plant-stems" />
      <div className="mock-bottle">
        <span />
      </div>
      {!small && !editor && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-white/92 px-4 py-2 text-xs text-slate-600">
          <span>brand-official.com</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">詳しくはこちら</span>
        </div>
      )}
    </div>
  )
}

function Avatar({
  label,
  tone,
  size = 'md',
}: {
  label: string
  tone: string
  size?: 'md' | 'xl'
}) {
  const sizeClass = size === 'xl' ? 'h-24 w-24 text-4xl ring-4 ring-white' : 'h-10 w-10 text-sm'
  return (
    <div className={`grid shrink-0 place-items-center rounded-full ${tone} ${sizeClass} font-semibold text-white`}>
      {label}
    </div>
  )
}

function Metric({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="h-4 w-4" />
      {value}
    </span>
  )
}

function ActionPill({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function HintItem({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="mb-5 flex gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{body}</p>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  area = false,
  select = false,
  dark = false,
}: {
  label: string
  value: string
  area?: boolean
  select?: boolean
  dark?: boolean
}) {
  const base = dark
    ? 'border-white/10 bg-white/5 text-white'
    : 'border-slate-200 bg-white text-slate-800'

  return (
    <label className="block">
      <span className={`mb-2 block text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
      {area ? (
        <textarea className={`h-28 w-full resize-none rounded-md border p-3 text-sm outline-none ${base}`} defaultValue={value} />
      ) : (
        <div className={`flex h-10 items-center justify-between rounded-md border px-3 text-sm ${base}`}>
          <span>{value}</span>
          {select && <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      )}
    </label>
  )
}

function KpiCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <TrendingUp className="h-4 w-4" />
      </div>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-emerald-600">{change}</p>
    </div>
  )
}

function LineChart() {
  return (
    <div className="h-64 w-full">
      <svg viewBox="0 0 720 260" className="h-full w-full" role="img" aria-label="インプレッション推移">
        {[40, 90, 140, 190, 240].map((y) => (
          <line key={y} x1="0" x2="720" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {['5/1', '5/6', '5/11', '5/16', '5/21', '5/26', '5/31'].map((day, index) => (
          <text key={day} x={index * 112 + 8} y="252" fill="#64748b" fontSize="12">{day}</text>
        ))}
        <polyline
          fill="none"
          stroke="#0a7cff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          points="0,210 36,185 72,178 108,132 144,146 180,92 216,116 252,78 288,142 324,118 360,105 396,134 432,88 468,111 504,96 540,168 576,82 612,70 648,130 684,90 720,118"
        />
      </svg>
    </div>
  )
}

function DonutChart() {
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        <circle cx="70" cy="70" r="46" fill="none" stroke="#e2e8f0" strokeWidth="20" />
        <circle cx="70" cy="70" r="46" fill="none" stroke="#0a7cff" strokeDasharray="195 289" strokeWidth="20" />
        <circle cx="70" cy="70" r="46" fill="none" stroke="#6aa5ff" strokeDasharray="74 289" strokeDashoffset="-198" strokeWidth="20" />
        <circle cx="70" cy="70" r="46" fill="none" stroke="#111827" strokeDasharray="32 289" strokeDashoffset="-274" strokeWidth="20" />
      </svg>
      <div className="space-y-3 text-sm">
        <Legend color="bg-blue-600" label="いいね" value="6,543" />
        <Legend color="bg-blue-300" label="リポスト" value="2,345" />
        <Legend color="bg-slate-900" label="クリック" value="1,188" />
      </div>
    </div>
  )
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="min-w-20 text-slate-600">{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function StatusBadge({ status }: { status: ContentItem['status'] }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        status === '公開済み' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {status}
    </span>
  )
}

function CommentRow({ name, text }: { name: string; text: string }) {
  return (
    <div className="flex gap-3 px-5 py-4">
      <Avatar label={name[0].toUpperCase()} tone="bg-slate-600" />
      <div>
        <p className="text-sm font-semibold">{name}<span className="ml-2 font-normal text-slate-500">20時間</span></p>
        <p className="mt-1 text-sm text-slate-700">{text}</p>
      </div>
    </div>
  )
}

function MiniRelatedPost() {
  return (
    <div className="flex gap-3">
      <Avatar label="B" tone="bg-orange-400" />
      <div>
        <p className="text-sm font-semibold">Brand Official</p>
        <p className="text-xs leading-5 text-slate-600">暮らしを自然にするマインドと商品について。</p>
        <button className="mt-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">フォロー</button>
      </div>
    </div>
  )
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white">
        <Globe2 className="h-4 w-4" />
      </div>
      {!compact && <span className="text-base font-semibold text-slate-950">Reelify</span>}
    </div>
  )
}
