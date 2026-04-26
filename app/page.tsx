'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Bookmark,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Copy,
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
  RefreshCw,
  Repeat2,
  Save,
  Search,
  Settings,
  Shapes,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  Trash2,
  Type,
  Upload,
  User,
  Video,
  Wand2,
  X,
} from 'lucide-react'

type View =
  | 'timeline'
  | 'search'
  | 'notifications'
  | 'messages'
  | 'bookmarks'
  | 'post'
  | 'compose'
  | 'image'
  | 'video'
  | 'analytics'
  | 'profile'
  | 'content'
  | 'publish'

type CreativeVariant = 'natural' | 'fashion' | 'travel'
type ContentType = '画像' | '動画'
type ContentStatus = '公開済み' | '下書き' | '生成中'
type Notify = (message: string) => void

type NavItem = {
  key: string
  label: string
  icon: LucideIcon
  view: View
}

type Post = {
  id: string
  author: string
  handle: string
  avatar: string
  avatarTone: string
  body: string
  time: string
  creative: CreativeVariant
  stats: {
    replies: number
    reposts: number
    likes: number
    saves: number
  }
}

type ContentItem = {
  id: string
  title: string
  type: ContentType
  date: string
  status: ContentStatus
  creative: CreativeVariant
  source: 'AI画像' | 'AI動画' | 'アップロード' | 'テンプレート'
  prompt?: string
}

type ToastState = {
  id: number
  message: string
} | null

const today = '2026/04/25'

const navItems: NavItem[] = [
  { key: 'home', label: 'ホーム', icon: HomeIcon, view: 'timeline' },
  { key: 'search', label: '話題を検索', icon: Search, view: 'search' },
  { key: 'notice', label: '通知', icon: Bell, view: 'notifications' },
  { key: 'message', label: 'メッセージ', icon: Mail, view: 'messages' },
  { key: 'bookmark', label: 'ブックマーク', icon: Bookmark, view: 'bookmarks' },
  { key: 'create', label: '作成ツール', icon: Wand2, view: 'compose' },
  { key: 'content', label: 'コンテンツ一覧', icon: FolderOpen, view: 'content' },
  { key: 'analytics', label: '分析', icon: BarChart3, view: 'analytics' },
  { key: 'profile', label: 'プロフィール', icon: User, view: 'profile' },
]

const activeKeyByView: Record<View, string> = {
  timeline: 'home',
  search: 'search',
  notifications: 'notice',
  messages: 'message',
  bookmarks: 'bookmark',
  post: 'home',
  compose: 'create',
  image: 'create',
  video: 'create',
  analytics: 'analytics',
  profile: 'profile',
  content: 'content',
  publish: 'content',
}

const initialPosts: Post[] = [
  {
    id: 'post-sample',
    author: 'sample_user',
    handle: '@sample_user',
    avatar: 'S',
    avatarTone: 'bg-teal-700',
    body: '今日はいい天気ですね！\nこんな日は外でリフレッシュしたい！',
    time: '1時間',
    creative: 'travel',
    stats: { replies: 12, reposts: 34, likes: 256, saves: 8 },
  },
  {
    id: 'post-brand',
    author: 'Brand Official',
    handle: '@brand_official',
    avatar: 'brd',
    avatarTone: 'bg-orange-400',
    body: 'あなたの毎日を、もっと特別に。\n新しいライフスタイルを提案します。',
    time: '広告',
    creative: 'natural',
    stats: { replies: 48, reposts: 132, likes: 1024, saves: 25 },
  },
]

const initialContentItems: ContentItem[] = [
  { id: 'asset-1', title: '新商品バナー - 春のキャンペーン', type: '画像', date: today, status: '公開済み', creative: 'natural', source: 'AI画像', prompt: '自然光の中のミニマルな商品バナー' },
  { id: 'asset-2', title: 'Summer Sale プロモーション', type: '画像', date: '2026/04/18', status: '公開済み', creative: 'fashion', source: 'テンプレート' },
  { id: 'asset-3', title: 'ブランド紹介動画', type: '動画', date: '2026/04/15', status: '公開済み', creative: 'natural', source: 'AI動画', prompt: '商品を中心にした15秒のブランド紹介動画' },
  { id: 'asset-4', title: '新作コレクション紹介', type: '動画', date: '2026/04/10', status: '下書き', creative: 'fashion', source: 'AI動画' },
  { id: 'asset-5', title: 'GWキャンペーンバナー', type: '画像', date: '2026/04/05', status: '公開済み', creative: 'travel', source: 'アップロード' },
]

const trends = [
  ['#週末の過ごし方', '12,345 posts'],
  ['#新商品', '8,765 posts'],
  ['#写真好きな人と繋がりたい', '6,543 posts'],
  ['#AI広告制作', '3,120 posts'],
]

const userSuggestions = [
  { name: 'Design Life', handle: '@design_life', tone: 'bg-slate-700' },
  { name: 'Travel Note', handle: '@travel_note', tone: 'bg-sky-700' },
  { name: 'Tech Insights', handle: '@tech_insights', tone: 'bg-blue-500' },
]

const idFrom = (prefix: string) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 999)}`

const formatCount = (value: number) => value.toLocaleString('ja-JP')

function chooseVariantFromPrompt(prompt: string, fallback: CreativeVariant): CreativeVariant {
  const text = prompt.toLowerCase()
  if (text.includes('fashion') || text.includes('collection') || text.includes('新作') || text.includes('モデル')) {
    return 'fashion'
  }
  if (text.includes('travel') || text.includes('gw') || text.includes('自然') || text.includes('山') || text.includes('湖')) {
    return 'travel'
  }
  return fallback
}

function startMockAiJob(
  setProgress: (value: number) => void,
  setRunning: (value: boolean) => void,
  onComplete: () => void
) {
  setRunning(true)
  setProgress(6)
  let next = 6
  const timer = window.setInterval(() => {
    next = Math.min(next + 13, 100)
    setProgress(next)
    if (next >= 100) {
      window.clearInterval(timer)
      window.setTimeout(() => {
        setRunning(false)
        onComplete()
      }, 240)
    }
  }, 220)
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [view, setView] = useState<View>('timeline')
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems)
  const [selectedPost, setSelectedPost] = useState<Post>(initialPosts[1])
  const [publishItem, setPublishItem] = useState<ContentItem>(initialContentItems[1])
  const [toast, setToast] = useState<ToastState>(null)

  const notify: Notify = (message) => setToast({ id: Date.now(), message })

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const openPost = (post: Post) => {
    setSelectedPost(post)
    setView('post')
  }

  const createPost = (body: string, creative: CreativeVariant = 'natural') => {
    const post: Post = {
      id: idFrom('post'),
      author: 'sample_user',
      handle: '@sample_user',
      avatar: 'S',
      avatarTone: 'bg-teal-700',
      body,
      time: 'たった今',
      creative,
      stats: { replies: 0, reposts: 0, likes: 0, saves: 0 },
    }
    setPosts((current) => [post, ...current])
    setSelectedPost(post)
    notify('投稿を作成しました')
    setView('timeline')
  }

  const saveContent = (item: ContentItem, next: 'stay' | 'content' | 'publish' = 'stay') => {
    setContentItems((current) => {
      const exists = current.some((content) => content.id === item.id)
      return exists
        ? current.map((content) => (content.id === item.id ? item : content))
        : [item, ...current]
    })
    setPublishItem(item)
    notify(`${item.title}を保存しました`)
    if (next === 'content') setView('content')
    if (next === 'publish') setView('publish')
  }

  const openPublish = (item: ContentItem) => {
    setPublishItem(item)
    setView('publish')
  }

  if (!isSignedIn) {
    return (
      <>
        <AuthGate
          onSignIn={() => {
            setIsSignedIn(true)
            notify('Google認証でログインしました')
          }}
          notify={notify}
        />
        <Toast toast={toast} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <MobileHeader currentView={view} onNavigate={setView} />
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] md:grid-cols-[224px_minmax(0,1fr)]">
        <Sidebar currentView={view} onNavigate={setView} notify={notify} />
        <main className="min-w-0 border-x border-slate-200 bg-white/70">
          {view === 'timeline' && (
            <TimelineView
              posts={posts}
              onOpenPost={openPost}
              onCreatePost={createPost}
              onOpenImageEditor={() => setView('image')}
              onOpenVideoEditor={() => setView('video')}
              notify={notify}
            />
          )}
          {view === 'search' && <SearchView notify={notify} />}
          {view === 'notifications' && <NotificationsView notify={notify} />}
          {view === 'messages' && <MessagesView notify={notify} />}
          {view === 'bookmarks' && <BookmarksView posts={posts} onOpenPost={openPost} notify={notify} />}
          {view === 'post' && (
            <PostDetailView post={selectedPost} onBack={() => setView('timeline')} notify={notify} />
          )}
          {view === 'compose' && (
            <ComposeView
              onCreatePost={createPost}
              onOpenImageEditor={() => setView('image')}
              onOpenVideoEditor={() => setView('video')}
              notify={notify}
            />
          )}
          {view === 'image' && (
            <ImageEditorView
              onBack={() => setView('compose')}
              onSave={(item, next) => saveContent(item, next)}
              notify={notify}
            />
          )}
          {view === 'video' && (
            <VideoEditorView
              onBack={() => setView('compose')}
              onSave={(item, next) => saveContent(item, next)}
              notify={notify}
            />
          )}
          {view === 'analytics' && <AnalyticsView notify={notify} />}
          {view === 'profile' && <ProfileView posts={posts} onOpenPost={openPost} notify={notify} />}
          {view === 'content' && (
            <ContentListView
              items={contentItems}
              onPublish={openPublish}
              onCreate={() => setView('compose')}
              onEdit={(item) => setView(item.type === '動画' ? 'video' : 'image')}
              notify={notify}
            />
          )}
          {view === 'publish' && (
            <PublishView
              item={publishItem}
              items={contentItems}
              onBack={() => setView('content')}
              onChangeItem={setPublishItem}
              notify={notify}
            />
          )}
        </main>
      </div>
      <Toast toast={toast} />
    </div>
  )
}

function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-xl">
      <CheckCircle2 className="h-4 w-4 text-blue-300" />
      {toast.message}
    </div>
  )
}

function AuthGate({ onSignIn, notify }: { onSignIn: () => void; notify: Notify }) {
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
              タイムライン、投稿作成、AIコンテンツ生成、分析を同じワークスペースで扱います。
            </p>
          </div>
          <button
            type="button"
            onClick={onSignIn}
            className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 text-sm font-bold text-blue-600">
              G
            </span>
            Googleで始める
          </button>
          <button
            type="button"
            onClick={() => notify('利用規約とプライバシーポリシーを確認しました')}
            className="mt-3 text-xs font-medium text-blue-700 hover:underline"
          >
            利用規約とプライバシーポリシーを確認
          </button>
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
              <PostCard post={initialPosts[1]} onOpen={() => notify('ログイン後に投稿詳細を開けます')} notify={notify} compact />
            </div>
            <RightRail notify={notify} />
          </div>
        </section>
      </div>
    </div>
  )
}

function MobileHeader({
  currentView,
  onNavigate,
}: {
  currentView: View
  onNavigate: (view: View) => void
}) {
  const [open, setOpen] = useState(false)
  const activeKey = activeKeyByView[currentView]

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600"
          aria-label="メニュー"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <BrandLogo compact />
        <button
          type="button"
          onClick={() => onNavigate('compose')}
          className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white"
          aria-label="投稿する"
        >
          <PenLine className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-slate-200 px-3 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onNavigate(item.view)
                  setOpen(false)
                }}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-left text-sm ${
                  item.key === activeKey ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
      )}
    </header>
  )
}

function Sidebar({
  currentView,
  onNavigate,
  notify,
}: {
  currentView: View
  onNavigate: (view: View) => void
  notify: Notify
}) {
  const activeKey = activeKeyByView[currentView]

  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-slate-200 bg-white px-4 py-5 md:flex">
      <button type="button" onClick={() => onNavigate('timeline')} className="text-left">
        <BrandLogo />
      </button>
      <nav className="mt-7 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.key === activeKey
          return (
            <button
              key={item.key}
              type="button"
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
        type="button"
        onClick={() => onNavigate('compose')}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        <PenLine className="h-4 w-4" />
        投稿する
      </button>
      <div className="mt-auto flex items-center gap-3 rounded-lg px-2 py-3">
        <button type="button" onClick={() => onNavigate('profile')} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <Avatar label="S" tone="bg-stone-700" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">sample_user</p>
            <p className="truncate text-xs text-slate-500">@sample_user</p>
          </div>
        </button>
        <button type="button" onClick={() => notify('アカウント設定を開きました')} className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}

function TimelineView({
  posts,
  onOpenPost,
  onCreatePost,
  onOpenImageEditor,
  onOpenVideoEditor,
  notify,
}: {
  posts: Post[]
  onOpenPost: (post: Post) => void
  onCreatePost: (body: string, creative?: CreativeVariant) => void
  onOpenImageEditor: () => void
  onOpenVideoEditor: () => void
  notify: Notify
}) {
  const [tab, setTab] = useState('おすすめ')
  const visiblePosts = tab === 'フォロー中' ? posts.filter((post) => post.handle === '@sample_user') : posts

  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="min-w-0 border-r border-slate-200">
        <HeaderBlock title="ホーム" />
        <Tabs labels={['おすすめ', 'フォロー中', 'トレンド', 'ニュース']} active={tab} onChange={setTab} />
        <QuickComposer
          onCreatePost={onCreatePost}
          onOpenImageEditor={onOpenImageEditor}
          onOpenVideoEditor={onOpenVideoEditor}
          notify={notify}
        />
        {tab === 'トレンド' || tab === 'ニュース' ? (
          <TopicFeed tab={tab} notify={notify} />
        ) : (
          <div className="divide-y divide-slate-200">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} onOpen={() => onOpenPost(post)} notify={notify} />
            ))}
          </div>
        )}
      </section>
      <RightRail notify={notify} />
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
  onChange,
}: {
  labels: string[]
  active: string
  onChange: (label: string) => void
}) {
  return (
    <div className="flex h-12 items-end gap-5 overflow-x-auto border-b border-slate-200 bg-white px-5">
      {labels.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className={`relative h-12 shrink-0 text-sm ${
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

function QuickComposer({
  onCreatePost,
  onOpenImageEditor,
  onOpenVideoEditor,
  notify,
}: {
  onCreatePost: (body: string, creative?: CreativeVariant) => void
  onOpenImageEditor: () => void
  onOpenVideoEditor: () => void
  notify: Notify
}) {
  const [text, setText] = useState('')
  const [scheduled, setScheduled] = useState(false)

  const append = (value: string) => setText((current) => `${current}${current ? ' ' : ''}${value}`)

  return (
    <div className="border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex gap-3">
        <Avatar label="S" tone="bg-stone-700" />
        <div className="min-w-0 flex-1">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="h-16 w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="いまどうしてる？"
          />
          {scheduled && (
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Calendar className="h-3.5 w-3.5" />
              本日19:00に予約
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-blue-600">
              <IconButton icon={ImageIcon} label="AI画像を作成" onClick={onOpenImageEditor} />
              <IconButton icon={Video} label="AI動画を作成" onClick={onOpenVideoEditor} />
              <IconButton icon={Smile} label="絵文字を追加" onClick={() => append('気分を添えて投稿')} />
              <IconButton icon={Calendar} label="投稿予約" onClick={() => setScheduled((value) => !value)} />
              <IconButton icon={Hash} label="ハッシュタグを追加" onClick={() => append('#新商品')} />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!text.trim()) {
                  notify('投稿本文を入力してください')
                  return
                }
                onCreatePost(text.trim(), 'travel')
                setText('')
                setScheduled(false)
              }}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
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
  notify,
  compact = false,
}: {
  post: Post
  onOpen: () => void
  notify: Notify
  compact?: boolean
}) {
  const [liked, setLiked] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <article className="bg-white px-5 py-4 transition hover:bg-slate-50/70">
      <div className="flex gap-3">
        <Avatar label={post.avatar} tone={post.avatarTone} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <button type="button" onClick={onOpen} className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-slate-950">{post.author}</p>
              <p className="text-xs text-slate-500">
                {post.handle} · {post.time}
              </p>
            </button>
            <button
              type="button"
              onClick={() => notify('投稿メニューを開きました')}
              className="ml-auto grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onOpen()
            }}
            className="mt-2 block cursor-pointer text-left"
          >
            <p className="whitespace-pre-line text-sm leading-6 text-slate-800">{post.body}</p>
            {!compact && (
              <CreativeCard
                variant={post.creative}
                className="mt-3"
                onCta={() => notify('リンクカードのCTAを開きました')}
              />
            )}
          </div>
          {compact && <CreativeCard variant={post.creative} className="mt-3" small />}
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-slate-500 sm:flex sm:items-center sm:gap-8">
            <MetricButton icon={MessageCircle} value={formatCount(post.stats.replies)} active={false} onClick={onOpen} />
            <MetricButton
              icon={Repeat2}
              value={formatCount(post.stats.reposts + (reposted ? 1 : 0))}
              active={reposted}
              onClick={() => {
                setReposted((value) => !value)
                notify(reposted ? 'リポストを取り消しました' : 'リポストしました')
              }}
            />
            <MetricButton
              icon={Heart}
              value={formatCount(post.stats.likes + (liked ? 1 : 0))}
              active={liked}
              onClick={() => {
                setLiked((value) => !value)
                notify(liked ? 'いいねを取り消しました' : 'いいねしました')
              }}
            />
            <MetricButton
              icon={Bookmark}
              value={formatCount(post.stats.saves + (bookmarked ? 1 : 0))}
              active={bookmarked}
              onClick={() => {
                setBookmarked((value) => !value)
                notify(bookmarked ? 'ブックマークを解除しました' : 'ブックマークしました')
              }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function PostDetailView({ post, onBack, notify }: { post: Post; onBack: () => void; notify: Notify }) {
  const [reply, setReply] = useState('')
  const [comments, setComments] = useState([
    { name: 'yuki', text: '素敵な商品ですね！気になっています！' },
    { name: 'market_jp', text: 'ビジュアルが上品で、広告としても使いやすそうです。' },
  ])

  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="min-w-0 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <button type="button" onClick={onBack} className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-100">
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
            <button type="button" onClick={() => notify('ポストの詳細メニューを開きました')} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100">
              <MoreHorizontal className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-900">{post.body}</p>
          <CreativeCard variant={post.creative} className="mt-4" large onCta={() => notify('広告リンクを開きました')} />
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
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              placeholder="返信をポスト"
            />
            <button
              type="button"
              onClick={() => {
                if (!reply.trim()) {
                  notify('返信内容を入力してください')
                  return
                }
                setComments((current) => [{ name: 'sample_user', text: reply.trim() }, ...current])
                setReply('')
                notify('返信を投稿しました')
              }}
              className="rounded-full bg-blue-500 px-5 text-sm font-semibold text-white"
            >
              返信
            </button>
          </div>
        </article>

        <div className="divide-y divide-slate-200">
          {comments.map((comment, index) => (
            <CommentRow key={`${comment.name}-${index}`} name={comment.name} text={comment.text} />
          ))}
        </div>
      </section>
      <aside className="hidden bg-[#f8fafc] p-4 xl:block">
        <Panel title="関連するポスト">
          <MiniRelatedPost notify={notify} />
        </Panel>
        <Panel title="いまどうしてる？" className="mt-4">
          <TrendList notify={notify} />
        </Panel>
      </aside>
    </div>
  )
}

function ComposeView({
  onCreatePost,
  onOpenImageEditor,
  onOpenVideoEditor,
  notify,
}: {
  onCreatePost: (body: string, creative?: CreativeVariant) => void
  onOpenImageEditor: () => void
  onOpenVideoEditor: () => void
  notify: Notify
}) {
  const [body, setBody] = useState('')
  const [visibility, setVisibility] = useState('公開')
  const [menuOpen, setMenuOpen] = useState(false)
  const [pollEnabled, setPollEnabled] = useState(false)
  const [scheduled, setScheduled] = useState(false)

  const append = (value: string) => setBody((current) => `${current}${current ? ' ' : ''}${value}`)

  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="min-w-0 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <h1 className="text-xl font-semibold">新しい投稿</h1>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-9 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700"
            >
              {visibility}
              <ChevronDown className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 z-10 w-40 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                {['公開', 'フォロワーのみ', '下書き'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setVisibility(item)
                      setMenuOpen(false)
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="p-5">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-h-[260px] w-full resize-none rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 outline-none focus:border-blue-500"
            placeholder="いまどうしてる？"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionPill icon={ImageIcon} label="AI画像を作成" onClick={onOpenImageEditor} />
            <ActionPill icon={Video} label="AI動画を作成" onClick={onOpenVideoEditor} />
            <ActionPill icon={FileText} label="GIFを追加" onClick={() => append('[GIF]')} />
            <ActionPill icon={Smile} label="絵文字候補" onClick={() => append('やわらかい雰囲気')} />
            <ActionPill icon={BarChart3} label="投票" onClick={() => setPollEnabled((value) => !value)} />
          </div>
          {pollEnabled && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold">投票</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <input className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none" placeholder="選択肢 1" />
                <input className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none" placeholder="選択肢 2" />
              </div>
            </div>
          )}
          {scheduled && (
            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              投稿予約: 2026年4月25日 19:00
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex items-center gap-1 text-blue-600">
              <IconButton icon={ImageIcon} label="AI画像" onClick={onOpenImageEditor} />
              <IconButton icon={Video} label="AI動画" onClick={onOpenVideoEditor} />
              <IconButton icon={Smile} label="文言追加" onClick={() => append('毎日に、やさしさを。')} />
              <IconButton icon={Calendar} label="予約" onClick={() => setScheduled((value) => !value)} />
              <IconButton icon={Link} label="リンク" onClick={() => append('https://example.com')} />
              <IconButton icon={Hash} label="タグ" onClick={() => append('#AI広告制作')} />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!body.trim()) {
                  notify('投稿本文を入力してください')
                  return
                }
                onCreatePost(body.trim(), 'natural')
                setBody('')
                setPollEnabled(false)
                setScheduled(false)
              }}
              className="rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              投稿する
            </button>
          </div>
        </div>
      </section>
      <aside className="hidden bg-[#f8fafc] p-4 xl:block">
        <Panel title="投稿のヒント">
          <HintItem icon={Sparkles} title="AIで素材を作成できます" body="画像または動画ボタンから、投稿に合うクリエイティブを生成できます。" />
          <HintItem icon={Hash} title="ハッシュタグを活用しましょう" body="投稿に関連するタグを追加すると、より多くの人に届きます。" />
          <HintItem icon={Lock} title="広告として投稿しよう" body="作ったコンテンツはコンテンツ一覧から広告投稿に進めます。" />
        </Panel>
      </aside>
    </div>
  )
}

function ImageEditorView({
  onBack,
  onSave,
  notify,
}: {
  onBack: () => void
  onSave: (item: ContentItem, next?: 'stay' | 'content' | 'publish') => void
  notify: Notify
}) {
  const [activeTool, setActiveTool] = useState('AI生成')
  const [title, setTitle] = useState('AI生成画像')
  const [uploadedName, setUploadedName] = useState('')
  const [referenceImageDataUrl, setReferenceImageDataUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [imageStyle, setImageStyle] = useState('スタイルを選択してください')
  const [model, setModel] = useState('Image generation v1')
  const [colorTone, setColorTone] = useState('指定なし')
  const [customColor, setCustomColor] = useState('#0a7cff')
  const [variant, setVariant] = useState<CreativeVariant>('natural')
  const [variants, setVariants] = useState<CreativeVariant[]>([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generated, setGenerated] = useState(false)
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([])

  const aspectToCss: Record<string, string> = {
    '16:9': '16 / 9',
    '4:5': '4 / 5',
    '1:1': '1 / 1',
    '3:2': '3 / 2',
    '9:16': '9 / 16',
    カスタム: '16 / 9',
  }

  const generatedItem: ContentItem = {
    id: `asset-image-${title.replace(/\s/g, '-')}`,
    title,
    type: '画像',
    date: today,
    status: generated ? '下書き' : '生成中',
    creative: variant,
    source: 'AI画像',
    prompt,
  }

  const runGenerate = () => {
    if (!prompt.trim()) {
      notify('プロンプトを入力してください')
      return
    }
    setGenerated(false)
    setGeneratedImageUrls([])
    startMockAiJob(setProgress, setGenerating, async () => {
      let nextVariant = chooseVariantFromPrompt(prompt, variant)
      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            negativePrompt,
            aspectRatio,
            style: imageStyle,
            model,
            colorTone: colorTone === 'カスタム' ? customColor : colorTone,
            image_urls: referenceImageDataUrl ? [referenceImageDataUrl] : [],
          }),
        })
        const data = await response.json()
        nextVariant = data?.candidates?.[0]?.variant ?? nextVariant
        if (Array.isArray(data?.imageUrls)) {
          setGeneratedImageUrls(data.imageUrls.filter((url: unknown): url is string => typeof url === 'string'))
        }
      } catch {
        notify('API応答がないため、ローカルプレビューで生成しました')
      }
      setVariant(nextVariant)
      setVariants([nextVariant, ...(['fashion', 'natural', 'travel'] as CreativeVariant[]).filter((item) => item !== nextVariant)])
      setGenerated(true)
      notify('AI画像を生成しました')
    })
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-100" aria-label="戻る">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-slate-950">AI画像生成</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSave(generatedItem, 'content')}
            className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Save className="h-4 w-4" />
            保存
          </button>
          <button
            type="button"
            onClick={() => {
              downloadTextFile(`${title}.txt`, `AI image prompt:\n${prompt}\n\nnegative:\n${negativePrompt}\n\naspect: ${aspectRatio}\nstyle: ${imageStyle}\nmodel: ${model}\ncolor: ${colorTone}`)
              notify('画像生成データをダウンロードしました')
            }}
            className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            ダウンロード
          </button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[172px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white p-3">
          {[
            [Sparkles, 'AI生成'],
            [Grid3X3, 'テンプレート'],
            [ImageIcon, '写真'],
            [Type, 'テキスト'],
            [Shapes, '図形'],
            [Upload, 'アップロード'],
            [Palette, '背景'],
            [Layers, 'ブランドキット'],
          ].map(([Icon, label]) => {
            const ToolIcon = Icon as LucideIcon
            const active = activeTool === label
            return (
              <button
                key={label as string}
                type="button"
                onClick={() => {
                  setActiveTool(label as string)
                  if (label !== 'AI生成') notify(`${label as string}パネルを開きました。AI生成フォームは保持されています`)
                }}
                className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm ${
                  active ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ToolIcon className="h-4 w-4" />
                {label as string}
              </button>
            )
          })}
        </aside>

        <section className="bg-[#f6f8fb] p-4 md:p-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">AI画像生成</h2>
              <p className="mt-1 text-sm text-slate-500">プロンプトを入力し、画像の生成に必要な設定を行ってください。</p>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="block text-sm font-semibold text-slate-900">画像の入力（任意）</span>
                  {referenceImageDataUrl && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      参照画像あり
                    </span>
                  )}
                </div>
                <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-5 text-center transition hover:border-blue-300 hover:bg-blue-50/20">
                  <input
                    id="ai-image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      setUploadedName(file.name)
                      const reader = new FileReader()
                      reader.onload = () => {
                        setReferenceImageDataUrl(typeof reader.result === 'string' ? reader.result : '')
                        notify(`${file.name}を参照画像として設定しました`)
                      }
                      reader.readAsDataURL(file)
                    }}
                  />
                  <label htmlFor="ai-image-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                    <Upload className="h-4 w-4" />
                    {referenceImageDataUrl ? '別の画像を選択' : '画像をアップロード'}
                  </label>
                  {referenceImageDataUrl && (
                    <div className="mx-auto mt-4 grid max-w-2xl gap-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-left sm:grid-cols-[160px_minmax(0,1fr)]">
                      <div className="overflow-hidden rounded-md border border-slate-200 bg-white" style={{ aspectRatio: '16 / 10' }}>
                        <img src={referenceImageDataUrl} alt="参照画像プレビュー" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-col justify-center">
                        <p className="text-xs font-semibold text-slate-500">MCPへ渡す参照画像</p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-900">{uploadedName}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          生成時はこの画像を `image_urls` として画像編集MCPに渡します。
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedName('')
                            setReferenceImageDataUrl('')
                            notify('参照画像を削除しました')
                          }}
                          className="mt-3 inline-flex h-8 w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          参照画像を削除
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="mt-3 text-sm font-medium text-slate-500">
                    {uploadedName || '画像をドラッグ＆ドロップ、またはクリックして選択'}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">対応形式：JPG / PNG / WEBP（最大10MB）</p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="ai-image-prompt" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    プロンプト
                    <span className="grid h-4 w-4 place-items-center rounded-full border border-slate-300 text-[10px] text-slate-500">i</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPrompt('自然光が入る明るい部屋で、茶色いガラスボトルの商品を上品に見せるSNS広告用バナー。余白を広く取り、柔らかい植物を背景に入れる')}
                    className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    プロンプト例を使う
                  </button>
                </div>
                <textarea
                  id="ai-image-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  className="h-24 w-full resize-none rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
                  placeholder="生成したい画像の内容を詳しく入力してください"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">アスペクト比（横:縦）</p>
                <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
                  {[
                    ['16:9', '横長'],
                    ['4:5', '縦長'],
                    ['1:1', '正方形'],
                    ['3:2', '写真'],
                    ['9:16', 'ショート'],
                    ['カスタム', '自由'],
                  ].map(([ratio, label]) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-semibold ${
                        aspectRatio === ratio
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      title={label}
                    >
                      <span className="h-4 w-4 rounded-sm border border-current" style={{ aspectRatio: ratio.includes(':') ? ratio.replace(':', ' / ') : '1 / 1' }} />
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <SelectLike
                  label="画像スタイル"
                  value={imageStyle}
                  options={['スタイルを選択してください', 'ナチュラル', 'ミニマル', '高級感', 'ファッション', 'シネマティック']}
                  onChange={setImageStyle}
                />
                <SelectLike
                  label="モデル"
                  value={model}
                  options={['Image generation v1', 'Image generation v1 fast', 'Image generation v1 high fidelity']}
                  onChange={setModel}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">カラートーン（任意）</p>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    ['指定なし', '#ffffff'],
                    ['ブルー', '#194f93'],
                    ['ブラウン', '#955321'],
                    ['モノクロ', '#f1f5f9'],
                  ].map(([label, color]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setColorTone(label)}
                      className={`flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold ${
                        colorTone === label ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="h-6 w-6 rounded-full border border-slate-200" style={{ background: color }} />
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setColorTone('カスタム')}
                    className={`flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold ${
                      colorTone === 'カスタム' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="color"
                      value={customColor}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        setCustomColor(event.target.value)
                        setColorTone('カスタム')
                      }}
                      className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                      aria-label="カスタムカラー"
                    />
                    カスタムカラー
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="negative-prompt" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  ネガティブプロンプト（任意）
                  <span className="grid h-4 w-4 place-items-center rounded-full border border-slate-300 text-[10px] text-slate-500">i</span>
                </label>
                <textarea
                  id="negative-prompt"
                  value={negativePrompt}
                  onChange={(event) => setNegativePrompt(event.target.value)}
                  className="h-16 w-full resize-none rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
                  placeholder="含めたくない要素を入力してください（例：ぼやけ、文字、ロゴなど）"
                />
              </div>

              {generating && (
                <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-blue-700">
                    <span>生成中</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
              )}

              {generated && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">生成結果</p>
                      <p className="text-xs text-slate-500">候補を選択して保存または投稿設定へ進めます。</p>
                    </div>
                    <button type="button" onClick={runGenerate} className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                      <RefreshCw className="h-4 w-4" />
                      再生成
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {(generatedImageUrls.length > 0 ? generatedImageUrls : variants).map((item, index) => (
                      <button
                        key={typeof item === 'string' ? item : index}
                        type="button"
                        onClick={() => {
                          if (generatedImageUrls.length > 0) {
                            notify(`生成画像 ${index + 1} を選択しました`)
                            return
                          }
                          setVariant(item as CreativeVariant)
                          notify(`${item}案を選択しました`)
                        }}
                        className={`rounded-md border bg-white p-2 text-left ${
                          generatedImageUrls.length === 0 && variant === item ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                        }`}
                      >
                        <div className="w-full overflow-hidden rounded-md" style={{ aspectRatio: aspectToCss[aspectRatio] }}>
                          {generatedImageUrls.length > 0 ? (
                            <img src={item as string} alt={`生成画像 ${index + 1}`} className="h-full w-full object-cover" />
                          ) : (
                            <CreativeCard variant={item as CreativeVariant} className="h-full border-0" small={false} />
                          )}
                        </div>
                        <span className="mt-2 block text-xs font-semibold text-slate-600">
                          {generatedImageUrls.length > 0 ? `生成画像 ${index + 1}` : `候補: ${item}`}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button type="button" onClick={() => onSave(generatedItem, 'content')} className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
                      <Save className="h-4 w-4" />
                      コンテンツ一覧へ保存
                    </button>
                    <button type="button" onClick={() => onSave(generatedItem, 'publish')} className="h-10 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white">
                      投稿設定へ
                    </button>
                  </div>
                </div>
              )}

              <TextInput label="保存名" value={title} onChange={setTitle} />

              <button
                type="button"
                onClick={runGenerate}
                disabled={generating}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                {generating ? '生成中...' : '生成する'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function VideoEditorView({
  onBack,
  onSave,
  notify,
}: {
  onBack: () => void
  onSave: (item: ContentItem, next?: 'stay' | 'content' | 'publish') => void
  notify: Notify
}) {
  const [prompt, setPrompt] = useState('商品ボトルを自然光で見せる15秒のSNS広告動画。ゆっくりズームし、最後にCTAを表示')
  const [title, setTitle] = useState('AI生成PR動画')
  const [variant, setVariant] = useState<CreativeVariant>('natural')
  const [activeTool, setActiveTool] = useState('AI生成')
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState('15秒')
  const [aspect, setAspect] = useState('16:9')
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const clips = ['00:00', '00:03', '00:06', '00:09', '00:12']

  const generatedItem: ContentItem = {
    id: `asset-video-${title.replace(/\s/g, '-')}`,
    title,
    type: '動画',
    date: today,
    status: '下書き',
    creative: variant,
    source: 'AI動画',
    prompt,
  }

  const runGenerate = () => {
    startMockAiJob(setProgress, setGenerating, async () => {
      try {
        await fetch('/api/generate-creative-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            aspectRatio: aspect,
            duration,
            audio: audioEnabled,
            model: 'video-generation-v1',
          }),
        })
      } catch {
        notify('API応答がないため、ローカルプレビューで生成しました')
      }
      setVariant(chooseVariantFromPrompt(prompt, variant))
      notify('AI動画の絵コンテとプレビューを生成しました')
    })
  }

  return (
    <div className="min-h-screen bg-[#181a20] text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm font-semibold outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSave(generatedItem, 'content')}
            className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm"
          >
            <Save className="h-4 w-4" />
            自動保存
          </button>
          <button
            type="button"
            onClick={() => {
              downloadTextFile(`${title}.txt`, `AI video prompt:\n${prompt}\n\n${aspect} / ${duration} / audio: ${audioEnabled}`)
              notify('動画生成データをエクスポートしました')
            }}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold"
          >
            <Upload className="h-4 w-4" />
            エクスポート
          </button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-56px)] grid-cols-1 lg:grid-cols-[86px_minmax(0,1fr)_300px]">
        <aside className="border-r border-white/10 p-2">
          {[
            [Sparkles, 'AI生成'],
            [Video, 'メディア'],
            [Type, 'テキスト'],
            [SlidersHorizontal, 'エフェクト'],
            [Shapes, '図形'],
            [Layers, '素材'],
            [Music, '音楽'],
            [Mic, '録音'],
          ].map(([Icon, label]) => {
            const ToolIcon = Icon as LucideIcon
            return (
              <button
                key={label as string}
                type="button"
                onClick={() => {
                  setActiveTool(label as string)
                  if (label !== 'AI生成') notify(`${label as string}パネルを開きました`)
                }}
                className={`mb-2 grid h-14 w-full place-items-center rounded-md text-xs ${
                  activeTool === label ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <ToolIcon className="h-4 w-4" />
                <span>{label as string}</span>
              </button>
            )
          })}
        </aside>

        <section className="flex flex-col p-5">
          <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="h-24 resize-none rounded-md border border-white/10 bg-black/20 p-3 text-sm outline-none"
              />
              <div className="grid gap-2">
                <SegmentedControl value={aspect} options={['16:9', '9:16', '1:1']} onChange={setAspect} dark />
                <SegmentedControl value={duration} options={['8秒', '15秒', '30秒']} onChange={setDuration} dark />
                <button
                  type="button"
                  onClick={() => setAudioEnabled((value) => !value)}
                  className={`h-9 rounded-md text-sm font-semibold ${audioEnabled ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'}`}
                >
                  AI音楽 {audioEnabled ? 'あり' : 'なし'}
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={runGenerate}
                disabled={generating}
                className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                {generating ? '生成中' : 'AIで動画生成'}
              </button>
              <button type="button" onClick={() => setPrompt('3シーン構成。商品クローズアップ、利用シーン、CTAの順に自然光で表現')} className="h-10 rounded-md border border-white/10 px-3 text-sm">
                プロンプト例
              </button>
              {generating && <ProgressBar value={progress} dark />}
            </div>
          </div>

          <div className="grid flex-1 place-items-center">
            <div className="relative w-full max-w-[760px] overflow-hidden rounded-lg bg-slate-900 shadow-2xl" style={{ aspectRatio: aspect === '9:16' ? '9 / 16' : aspect === '1:1' ? '1 / 1' : '16 / 9' }}>
              <CreativeCard variant={variant} className="h-full rounded-none border-0" editor />
              <div className="absolute right-[16%] top-[18%] w-[30%] border border-blue-400 p-3">
                <p className="text-5xl font-light leading-tight" style={{ color: selectedColor }}>New<br />Lifestyle</p>
                <p className="mt-3 text-sm text-white/80">毎日に、やさしさを。</p>
              </div>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-black/40 px-5 py-2">
                <button type="button" onClick={() => setPlaying(false)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10">
                  <Pause className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setPlaying(true)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10">
                  <Play className="h-4 w-4" />
                </button>
                <span className="text-xs">{playing ? '再生中' : '停止中'} / {duration}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>AI生成タイムライン</span>
              <span>{duration}</span>
            </div>
            <div className="relative h-28">
              <div className="grid h-20 grid-cols-5 gap-2">
                {clips.map((clip, index) => (
                  <button
                    key={clip}
                    type="button"
                    onClick={() => {
                      setVariant(index % 2 === 0 ? 'natural' : 'fashion')
                      notify(`${clip} のクリップを選択しました`)
                    }}
                    className="overflow-hidden rounded-md border border-white/10 bg-white/5 text-left"
                  >
                    <CreativeCard variant={index % 2 === 0 ? 'natural' : 'fashion'} small className="h-full border-0" />
                    <span className="absolute mt-1 text-[10px] text-slate-400">{clip}</span>
                  </button>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-4 rounded-full bg-violet-500/70" />
              <div className="absolute left-[50%] top-0 h-full w-0.5 bg-blue-400" />
            </div>
          </div>
        </section>

        <aside className="border-l border-white/10 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">AI動画設定</h2>
            <button type="button" onClick={() => notify('動画設定メニューを開きました')} className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/10">
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          <ReadOnlyField label="モデル" value="Video generation v1" dark />
          <ReadOnlyField label="構成" value="3シーン + CTA" dark />
          <div className="mt-5">
            <p className="mb-2 text-xs text-slate-400">テキストカラー</p>
            <div className="flex gap-2">
              {['#ffffff', '#111827', '#d8c7ae', '#0a7cff'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-7 w-7 rounded-full border border-white/20 ${selectedColor === color ? 'ring-2 ring-blue-400' : ''}`}
                  style={{ background: color }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSave(generatedItem, 'publish')}
            className="mt-6 h-10 w-full rounded-md bg-blue-600 text-sm font-semibold text-white"
          >
            投稿設定へ
          </button>
        </aside>
      </div>
    </div>
  )
}

function AnalyticsView({ notify }: { notify: Notify }) {
  const [tab, setTab] = useState('概要')
  const [range, setRange] = useState('2026/04/01 - 2026/04/25')
  const rows = [
    ['春のための商品、もっとキャンペーン', today, '30,456', '2,345', '7.2%'],
    ['Natural & Beautiful Life', '2026/04/18', '26,980', '1,908', '6.8%'],
    ['New Collection 2026', '2026/04/10', '18,233', '1,126', '5.4%'],
  ]

  return (
    <div className="min-h-screen bg-white">
      <HeaderBlock
        title="投稿分析"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRange((value) => (value.startsWith('2026/04') ? '2026/03/01 - 2026/03/31' : '2026/04/01 - 2026/04/25'))}
              className="hidden rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 sm:block"
            >
              {range}
            </button>
            <button
              type="button"
              onClick={() => {
                downloadTextFile('analytics-report.csv', 'title,impressions,engagements\nNatural & Beautiful Life,26980,1908')
                notify('分析レポートをエクスポートしました')
              }}
              className="flex items-center gap-2 rounded-md border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700"
            >
              <Download className="h-4 w-4" />
              エクスポート
            </button>
          </div>
        }
      />
      <Tabs labels={['概要', 'リーチ', 'エンゲージメント', 'オーディエンス']} active={tab} onChange={setTab} />
      <div className="space-y-5 p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <KpiCard label="インプレッション" value={tab === 'リーチ' ? '98,220' : '128,543'} change="+22.5%" />
          <KpiCard label="リーチ" value="89,456" change="+18.3%" />
          <KpiCard label="エンゲージメント" value={tab === 'エンゲージメント' ? '12,408' : '9,875'} change="+25.7%" />
          <KpiCard label="クリック数" value="4,321" change="+18.8%" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Panel title={`${tab}の推移`}>
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
                  <th className="font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, index) => (
                  <tr key={row[0]}>
                    <td className="py-3"><CreativeCard variant={index === 2 ? 'fashion' : 'natural'} small className="h-12 w-16" /></td>
                    <td className="font-medium text-slate-800">{row[0]}<br /><span className="text-xs font-normal text-slate-500">{row[1]}</span></td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                    <td>
                      <button type="button" onClick={() => notify(`${row[0]}の詳細分析を開きました`)} className="rounded-md px-3 py-2 text-blue-700 hover:bg-blue-50">
                        詳細
                      </button>
                    </td>
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

function ProfileView({ posts, onOpenPost, notify }: { posts: Post[]; onOpenPost: (post: Post) => void; notify: Notify }) {
  const [tab, setTab] = useState('ポスト')
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('シンプルで暮らしに、やさしさを届けたい投稿をしています。社員だけどいまはSNSで運用練習中。')

  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="min-w-0 border-r border-slate-200 bg-white">
        <div className="relative h-52 overflow-hidden border-b border-slate-200 bg-slate-200">
          <div className="profile-cover absolute inset-0" />
        </div>
        <div className="px-5 pb-4">
          <div className="-mt-12 flex items-end justify-between">
            <Avatar label="S" tone="bg-teal-700" size="xl" />
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold"
            >
              {editing ? '閉じる' : 'プロフィールを編集'}
            </button>
          </div>
          <div className="mt-4">
            <h1 className="text-xl font-semibold">sample_user</h1>
            <p className="text-sm text-slate-500">@sample_user</p>
            {editing ? (
              <div className="mt-3 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <textarea value={bio} onChange={(event) => setBio(event.target.value)} className="h-24 w-full resize-none rounded-md border border-slate-200 p-3 text-sm outline-none" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditing(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">キャンセル</button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      notify('プロフィールを保存しました')
                    }}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    保存
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-700">{bio}</p>
            )}
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
        <Tabs labels={['ポスト', '返信', 'メディア', 'いいね']} active={tab} onChange={setTab} />
        <div className="divide-y divide-slate-200">
          {(tab === 'ポスト' ? posts.filter((post) => post.handle === '@sample_user') : posts.slice(0, 1)).map((post) => (
            <PostCard key={post.id} post={post} onOpen={() => onOpenPost(post)} notify={notify} />
          ))}
        </div>
      </section>
      <RightRail notify={notify} />
    </div>
  )
}

function ContentListView({
  items,
  onPublish,
  onCreate,
  onEdit,
  notify,
}: {
  items: ContentItem[]
  onPublish: (item: ContentItem) => void
  onCreate: () => void
  onEdit: (item: ContentItem) => void
  notify: Notify
}) {
  const [tab, setTab] = useState('すべて')
  const [query, setQuery] = useState('')
  const filtered = items.filter((item) => {
    const matchesTab = tab === 'すべて' || item.type === tab || item.status === tab
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase())
    return matchesTab && matchesQuery
  })

  return (
    <div className="min-h-screen bg-white">
      <HeaderBlock
        title="コンテンツ一覧"
        action={
          <button type="button" onClick={onCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            新しく作成
          </button>
        }
      />
      <Tabs labels={['すべて', '画像', '動画', '下書き']} active={tab} onChange={setTab} />
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500" placeholder="タイトルで検索" />
          </div>
          <button type="button" onClick={() => notify('表示条件を更新しました')} className="flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700">
            <SlidersHorizontal className="h-4 w-4" />
            フィルター
          </button>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">サムネイル</th>
                <th className="font-medium">タイトル</th>
                <th className="font-medium">種類</th>
                <th className="font-medium">作成日</th>
                <th className="font-medium">生成元</th>
                <th className="font-medium">ステータス</th>
                <th className="font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <CreativeCard variant={item.creative} small className="h-14 w-20" />
                  </td>
                  <td className="font-medium text-slate-800">{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>{item.source}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => onEdit(item)} className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">
                        編集
                      </button>
                      <button type="button" onClick={() => onPublish(item)} className="rounded-md px-3 py-2 text-blue-700 hover:bg-blue-50">
                        投稿設定
                      </button>
                      <button type="button" onClick={() => notify(`${item.title}を複製しました`)} className="grid h-9 w-9 place-items-center rounded-md text-slate-600 hover:bg-slate-100">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
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

function PublishView({
  item,
  items,
  onBack,
  onChangeItem,
  notify,
}: {
  item: ContentItem
  items: ContentItem[]
  onBack: () => void
  onChangeItem: (item: ContentItem) => void
  notify: Notify
}) {
  const [mode, setMode] = useState('広告として投稿')
  const [caption, setCaption] = useState('キャプションを入力してください。')
  const [linkUrl, setLinkUrl] = useState('https://example.com')
  const [cta, setCta] = useState('詳しくはこちら')
  const [targeting, setTargeting] = useState('すべてのユーザー')
  const [schedule, setSchedule] = useState('')
  const [platforms, setPlatforms] = useState(['Instagram', 'X'])
  const [posted, setPosted] = useState(false)

  const togglePlatform = (platform: string) =>
    setPlatforms((current) => current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform])

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <button type="button" onClick={onBack} className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">投稿する</h1>
      </div>
      <Tabs labels={['通常投稿', '広告として投稿']} active={mode} onChange={setMode} />
      <div className="grid gap-6 p-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Panel title="選択したコンテンツ">
          <CreativeCard variant={item.creative} className="mb-3" />
          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
          <p className="text-xs text-slate-500">{item.date} · {item.source}</p>
          <div className="mt-4 space-y-2">
            {items.slice(0, 4).map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => onChangeItem(candidate)}
                className={`flex w-full items-center gap-2 rounded-md border p-2 text-left text-xs ${
                  candidate.id === item.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CreativeCard variant={candidate.creative} small className="h-9 w-12" />
                <span className="min-w-0 truncate">{candidate.title}</span>
              </button>
            ))}
          </div>
        </Panel>
        <section className="space-y-4">
          {posted && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              投稿リクエストを受け付けました
            </div>
          )}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold">投稿先</p>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'X', 'TikTok', 'YouTube'].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    platforms.includes(platform) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
          <TextAreaInput label="テキスト" value={caption} onChange={setCaption} />
          <TextInput label="リンク" value={linkUrl} onChange={setLinkUrl} />
          <SelectLike label="CTAボタン（任意）" value={cta} options={['詳しくはこちら', '購入する', '予約する', '登録する']} onChange={setCta} />
          <SelectLike label="ターゲティング（既定）" value={targeting} options={['すべてのユーザー', '20-34歳の関心層', '既存フォロワー類似', 'リマーケティング']} onChange={setTargeting} />
          <TextInput label="予約日時（任意）" value={schedule} onChange={setSchedule} placeholder="2026/04/25 19:00" />
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex gap-1 text-blue-600">
              <IconButton icon={ImageIcon} label="画像差し替え" onClick={() => notify('画像差し替えパネルを開きました')} />
              <IconButton icon={Video} label="動画差し替え" onClick={() => notify('動画差し替えパネルを開きました')} />
              <IconButton icon={Smile} label="絵文字候補" onClick={() => setCaption((value) => `${value} やさしい暮らし`)} />
              <IconButton icon={Calendar} label="予約" onClick={() => setSchedule('2026/04/25 19:00')} />
              <IconButton icon={Link} label="リンク確認" onClick={() => notify(`${linkUrl} を確認しました`)} />
              <IconButton icon={Hash} label="タグ追加" onClick={() => setCaption((value) => `${value} #新商品 #ライフスタイル`)} />
            </div>
            <button
              type="button"
              onClick={() => {
                if (platforms.length === 0) {
                  notify('投稿先を1つ以上選択してください')
                  return
                }
                setPosted(true)
                notify(schedule ? '予約投稿を設定しました' : '投稿リクエストを送信しました')
              }}
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white"
            >
              {schedule ? '予約する' : '投稿する'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function SearchView({ notify }: { notify: Notify }) {
  const [query, setQuery] = useState('')
  const results = trends.filter(([name]) => name.includes(query || '#'))

  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="border-r border-slate-200 bg-white">
        <HeaderBlock title="話題を検索" />
        <div className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500" placeholder="キーワードを入力" />
          </div>
          <div className="mt-5 divide-y divide-slate-100 rounded-lg border border-slate-200">
            {results.map(([name, count]) => (
              <button key={name} type="button" onClick={() => notify(`${name}の検索結果を表示しました`)} className="block w-full px-4 py-4 text-left hover:bg-slate-50">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-slate-500">{count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
      <RightRail notify={notify} />
    </div>
  )
}

function NotificationsView({ notify }: { notify: Notify }) {
  const [tab, setTab] = useState('すべて')
  const notifications = [
    ['Brand Officialがあなたの投稿をいいねしました', '2分前'],
    ['Design Lifeがあなたをフォローしました', '18分前'],
    ['AI動画の生成が完了しました', '1時間前'],
  ]

  return (
    <section className="min-h-screen bg-white">
      <HeaderBlock title="通知" action={<button type="button" onClick={() => notify('通知をすべて既読にしました')} className="text-sm font-semibold text-blue-700">すべて既読</button>} />
      <Tabs labels={['すべて', '認証済み', 'メンション']} active={tab} onChange={setTab} />
      <div className="divide-y divide-slate-200">
        {notifications.map(([title, time]) => (
          <button key={title} type="button" onClick={() => notify(title)} className="flex w-full gap-3 px-5 py-4 text-left hover:bg-slate-50">
            <Bell className="mt-1 h-4 w-4 text-blue-600" />
            <span><strong className="block text-sm">{title}</strong><span className="text-xs text-slate-500">{time} · {tab}</span></span>
          </button>
        ))}
      </div>
    </section>
  )
}

function MessagesView({ notify }: { notify: Notify }) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(['AI生成のクリエイティブ案を確認しました。'])

  return (
    <section className="grid min-h-screen bg-white lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-r border-slate-200">
        <HeaderBlock title="メッセージ" />
        {userSuggestions.map((user) => (
          <button key={user.handle} type="button" onClick={() => notify(`${user.name}とのスレッドを開きました`)} className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left hover:bg-slate-50">
            <Avatar label={user.name[0]} tone={user.tone} />
            <span><strong className="block text-sm">{user.name}</strong><span className="text-xs text-slate-500">{user.handle}</span></span>
          </button>
        ))}
      </aside>
      <div className="flex min-h-screen flex-col">
        <HeaderBlock title="Design Life" />
        <div className="flex-1 space-y-3 p-5">
          {sent.map((item, index) => (
            <div key={`${item}-${index}`} className="ml-auto max-w-md rounded-lg bg-blue-600 px-4 py-3 text-sm text-white">{item}</div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-slate-200 p-4">
          <input value={message} onChange={(event) => setMessage(event.target.value)} className="h-11 flex-1 rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" placeholder="メッセージを入力" />
          <button
            type="button"
            onClick={() => {
              if (!message.trim()) {
                notify('メッセージを入力してください')
                return
              }
              setSent((current) => [...current, message.trim()])
              setMessage('')
            }}
            className="rounded-full bg-blue-600 px-5 text-sm font-semibold text-white"
          >
            送信
          </button>
        </div>
      </div>
    </section>
  )
}

function BookmarksView({ posts, onOpenPost, notify }: { posts: Post[]; onOpenPost: (post: Post) => void; notify: Notify }) {
  return (
    <div className="grid min-h-screen xl:grid-cols-[minmax(0,760px)_300px]">
      <section className="border-r border-slate-200 bg-white">
        <HeaderBlock title="ブックマーク" action={<button type="button" onClick={() => notify('ブックマークを整理しました')} className="text-sm font-semibold text-blue-700">整理</button>} />
        <div className="divide-y divide-slate-200">
          {posts.slice(0, 2).map((post) => (
            <PostCard key={post.id} post={post} onOpen={() => onOpenPost(post)} notify={notify} />
          ))}
        </div>
      </section>
      <RightRail notify={notify} />
    </div>
  )
}

function TopicFeed({ tab, notify }: { tab: string; notify: Notify }) {
  return (
    <div className="divide-y divide-slate-200 bg-white">
      {trends.map(([name, count], index) => (
        <button key={name} type="button" onClick={() => notify(`${name}を開きました`)} className="block w-full px-5 py-4 text-left hover:bg-slate-50">
          <p className="text-xs font-semibold text-blue-600">{tab}</p>
          <p className="mt-1 text-base font-semibold text-slate-950">{name}</p>
          <p className="mt-1 text-sm text-slate-500">{count} · 関連投稿 {index + 8}件</p>
        </button>
      ))}
    </div>
  )
}

function RightRail({ notify }: { notify: Notify }) {
  const [expanded, setExpanded] = useState(false)
  const shownUsers = expanded ? userSuggestions : userSuggestions.slice(0, 3)

  return (
    <aside className="hidden bg-[#f8fafc] p-4 xl:block">
      <Panel title="おすすめユーザー">
        <div className="space-y-3">
          {shownUsers.map((user) => (
            <FollowRow key={user.handle} user={user} notify={notify} />
          ))}
        </div>
        <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-4 text-sm font-semibold text-blue-700">
          {expanded ? '閉じる' : 'さらに見る'}
        </button>
      </Panel>
      <Panel title="トレンド" className="mt-4">
        <TrendList notify={notify} />
      </Panel>
    </aside>
  )
}

function FollowRow({ user, notify }: { user: { name: string; handle: string; tone: string }; notify: Notify }) {
  const [following, setFollowing] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <Avatar label={user.name[0]} tone={user.tone} />
      <button type="button" onClick={() => notify(`${user.name}のプロフィールを開きました`)} className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <p className="truncate text-xs text-slate-500">{user.handle}</p>
      </button>
      <button
        type="button"
        onClick={() => {
          setFollowing((value) => !value)
          notify(following ? `${user.name}のフォローを解除しました` : `${user.name}をフォローしました`)
        }}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${following ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-300'}`}
      >
        {following ? 'フォロー中' : 'フォロー'}
      </button>
    </div>
  )
}

function TrendList({ notify }: { notify: Notify }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? trends : trends.slice(0, 3)

  return (
    <div className="space-y-4">
      {shown.map(([name, count]) => (
        <button key={name} type="button" onClick={() => notify(`${name}を表示しました`)} className="block w-full text-left">
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{count}</p>
        </button>
      ))}
      <button type="button" onClick={() => setExpanded((value) => !value)} className="text-sm font-semibold text-blue-700">
        {expanded ? '閉じる' : 'さらに見る'}
      </button>
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
  onCta,
}: {
  variant: CreativeVariant
  className?: string
  small?: boolean
  large?: boolean
  editor?: boolean
  onCta?: () => void
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
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onCta?.()
            }}
            className="absolute bottom-[12%] left-[8%] rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          >
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
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onCta?.()
            }}
            className="rounded-full bg-white px-3 py-1 shadow-sm"
          >
            詳しくはこちら
          </button>
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

function MetricButton({
  icon: Icon,
  value,
  active,
  onClick,
}: {
  icon: LucideIcon
  value: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md py-1 text-left hover:text-blue-700 ${active ? 'font-semibold text-blue-700' : ''}`}
    >
      <Icon className="h-4 w-4" />
      {value}
    </button>
  )
}

function IconButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="grid h-9 w-9 place-items-center rounded-md hover:bg-blue-50" aria-label={label} title={label}>
      <Icon className="h-4 w-4" />
    </button>
  )
}

function ActionPill({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
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

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500"
      />
    </label>
  )
}

function TextAreaInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-600">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-28 w-full resize-none rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-500"
      />
    </label>
  )
}

function ReadOnlyField({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  const base = dark
    ? 'border-white/10 bg-white/5 text-white'
    : 'border-slate-200 bg-white text-slate-800'

  return (
    <label className="mt-5 block">
      <span className={`mb-2 block text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
      <div className={`flex h-10 items-center justify-between rounded-md border px-3 text-sm ${base}`}>
        <span>{value}</span>
      </div>
    </label>
  )
}

function SelectLike({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="block w-full text-left"
      >
        <span className="mb-2 block text-xs font-semibold text-slate-600">{label}</span>
        <span className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800">
          {value}
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </span>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SegmentedControl({
  value,
  options,
  onChange,
  dark = false,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
  dark?: boolean
}) {
  return (
    <div className={`grid grid-cols-3 gap-1 rounded-md p-1 ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`h-8 rounded text-xs font-semibold ${
            value === option
              ? dark ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 shadow-sm'
              : dark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function ProgressBar({ value, dark = false }: { value: number; dark?: boolean }) {
  return (
    <div className="flex min-w-[180px] items-center gap-2">
      <div className={`h-2 flex-1 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-slate-200'}`}>
        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${value}%` }} />
      </div>
      <span className={`w-9 text-xs ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{Math.round(value)}%</span>
    </div>
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

function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        status === '公開済み'
          ? 'bg-emerald-50 text-emerald-700'
          : status === '生成中'
            ? 'bg-blue-50 text-blue-700'
            : 'bg-amber-50 text-amber-700'
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

function MiniRelatedPost({ notify }: { notify: Notify }) {
  return (
    <div className="flex gap-3">
      <Avatar label="B" tone="bg-orange-400" />
      <div>
        <p className="text-sm font-semibold">Brand Official</p>
        <p className="text-xs leading-5 text-slate-600">暮らしを自然にするマインドと商品について。</p>
        <button type="button" onClick={() => notify('Brand Officialをフォローしました')} className="mt-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">
          フォロー
        </button>
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
