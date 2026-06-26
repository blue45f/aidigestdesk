/**
 * 데모/베타 커뮤니티의 localStorage 백엔드.
 *
 * 백엔드 없이 브라우저 로컬에만 저장한다. 저장 구조(Channel/Post/BoardPost)를
 * 바꾸면 STORAGE_KEY 의 버전(v2)을 올린다. 모든 함수는 SSR 안전하게
 * `typeof window` 가드를 둔다. 손상된 JSON 은 던지지 않고 시드로 폴백한다.
 *
 * 게시판(BoardPost)과 카페(Cafe)는 채팅방(Channel/Post)과 같은 저장 키를
 * 공유한다. 카페 게시판은 board category 를 `cafe:${cafeId}` 로 사용한다.
 */

const STORAGE_KEY = 'aidigestdesk.community.v2'
const LEGACY_STORAGE_KEY = 'aidigestdesk.community.v1'
const NICKNAME_KEY = 'aidigestdesk.community.nickname.v1'
const CAFE_MEMBERSHIP_KEY = 'aidigestdesk.community.cafeMembership.v1'
const MEMBER_ID_KEY = 'aidigestdesk.community.memberId.v1'
const DEFAULT_NICKNAME = '게스트'

export type Channel = {
  id: string
  name: string
  description: string
  topic: string
}

export type Post = {
  id: string
  channelId: string
  author: string
  body: string
  /** ISO 8601 문자열 */
  createdAt: string
  /** 작성자 멤버 ID(소유권 — 수정/삭제 권한 판정). 구버전 데이터는 없을 수 있다. */
  authorId?: string
  /** 마지막 수정 시각(수정된 경우만). */
  editedAt?: string
}

/** 게시판 카테고리(한국어). 카페 게시판은 `cafe:${id}` 형식을 별도로 쓴다. */
export const boardCategories = ['자유', '질문', '정보공유', '후기'] as const
export type BoardCategory = (typeof boardCategories)[number]

export type BoardPost = {
  id: string
  /** 일반 게시판은 BoardCategory, 카페 게시판은 `cafe:${cafeId}`. */
  category: string
  title: string
  author: string
  body: string
  /** ISO 8601 문자열 */
  createdAt: string
  /** 작성자 멤버 ID(소유권 — 수정/삭제 권한 판정). 구버전 데이터는 없을 수 있다. */
  authorId?: string
  /** 마지막 수정 시각(수정된 경우만). */
  editedAt?: string
}

/** 게시판 글의 댓글. postId 로 BoardPost 와 연결한다. */
export type Comment = {
  id: string
  postId: string
  author: string
  body: string
  /** ISO 8601 문자열 */
  createdAt: string
  authorId?: string
  editedAt?: string
}

export type Cafe = {
  id: string
  name: string
  description: string
  topic: string
  emoji?: string
}

export type CommunityState = {
  channels: Channel[]
  posts: Post[]
  boardPosts: BoardPost[]
  cafes: Cafe[]
  comments: Comment[]
}

const seedChannels: Channel[] = [
  {
    id: 'general',
    name: '자유 토론',
    description: 'AI 소식, 잡담, 자유로운 이야기를 나누는 메인 채널입니다.',
    topic: '무엇이든 편하게 이야기해 주세요',
  },
  {
    id: 'models',
    name: '모델 잡담',
    description: 'GPT, Claude, Gemini 등 모델 사용기와 비교를 공유합니다.',
    topic: '어떤 모델을 어떤 작업에 쓰고 계신가요?',
  },
  {
    id: 'deals',
    name: '할인 정보 공유',
    description: '구독 할인, 크레딧 이벤트, 무료 체험 정보를 모읍니다.',
    topic: '발견한 할인/프로모션을 공유해 주세요',
  },
  {
    id: 'help',
    name: '도움 요청',
    description: '막히는 작업이나 설정, 프롬프트 고민을 함께 풀어봅니다.',
    topic: '질문은 구체적으로 적을수록 답이 빨라요',
  },
]

const seedPosts: Post[] = [
  {
    id: 'seed-welcome-general',
    channelId: 'general',
    author: 'AIDigestDesk',
    body: '커뮤니티에 오신 것을 환영합니다! 글은 서버에 저장되어 다른 기기·웹에서도 함께 보여요.',
    createdAt: '2026-06-18T00:00:00.000Z',
  },
  {
    id: 'seed-welcome-models',
    channelId: 'models',
    author: 'AIDigestDesk',
    body: '요즘 가장 만족스러운 모델과 그 이유를 한 줄로 남겨 주세요. 다른 분들의 선택 기준에 큰 도움이 됩니다.',
    createdAt: '2026-06-18T00:05:00.000Z',
  },
]

const seedBoardPosts: BoardPost[] = [
  {
    id: 'seed-board-notice',
    category: '정보공유',
    title: '게시판 베타 오픈 — 카테고리별로 글을 정리해요',
    author: 'AIDigestDesk',
    body: '자유/질문/정보공유/후기 네 카테고리로 글을 나눠 올릴 수 있습니다. 글은 서버에 저장되어 기기·웹과 공유됩니다.',
    createdAt: '2026-06-18T01:00:00.000Z',
  },
  {
    id: 'seed-board-question',
    category: '질문',
    title: '긴 문서 요약에는 어떤 모델이 가장 정확한가요?',
    author: '리서처민지',
    body: '50페이지 분량 PDF를 한국어로 요약하려는데, 컨텍스트 길이와 비용을 함께 고려하면 어떤 모델 조합이 좋을지 의견 부탁드립니다.',
    createdAt: '2026-06-18T02:30:00.000Z',
  },
  {
    id: 'seed-board-review',
    category: '후기',
    title: '코딩 보조로 한 달 써본 후기 — 체감 생산성 정리',
    author: '바이브코더',
    body: '리팩터링과 테스트 작성에서 특히 도움이 됐고, 긴 컨텍스트가 필요한 작업은 여전히 사람이 쪼개주는 게 빠릅니다.',
    createdAt: '2026-06-18T03:15:00.000Z',
  },
]

const seedCafes: Cafe[] = [
  {
    id: 'prompt-engineering',
    name: '프롬프트 엔지니어링',
    description: '잘 먹히는 프롬프트 패턴과 실패 사례를 함께 모읍니다.',
    topic: '재사용 가능한 프롬프트 템플릿을 공유해요',
    emoji: '✍️',
  },
  {
    id: 'vibe-coding',
    name: '바이브코딩 라운지',
    description: 'AI와 짝코딩하며 만든 결과물과 워크플로를 자랑하는 곳.',
    topic: '오늘 AI로 만든 걸 자랑해 주세요',
    emoji: '🎧',
  },
  {
    id: 'llm-cost',
    name: 'LLM 비용 최적화',
    description: '토큰 절약, 캐싱, 모델 라우팅으로 비용을 줄이는 노하우.',
    topic: '한 달 청구서를 어떻게 줄이셨나요?',
    emoji: '💸',
  },
  {
    id: 'ai-coding-tools',
    name: 'AI 코딩 도구 모임',
    description: 'Cursor, Copilot, Claude Code 등 도구 비교와 설정 팁.',
    topic: '지금 쓰는 도구 스택을 알려주세요',
    emoji: '🛠️',
  },
  {
    id: 'kr-ai-news',
    name: '국내 AI 뉴스',
    description: '국내 AI 업계 소식, 정책, 행사 정보를 빠르게 공유합니다.',
    topic: '오늘 본 국내 AI 소식을 나눠요',
    emoji: '📰',
  },
]

/** 카페별 기본 멤버 수(가입 시 +1). 실제 수치가 아닌 데모용 시드. */
const cafeBaseMemberCounts: Record<string, number> = {
  'prompt-engineering': 1284,
  'vibe-coding': 873,
  'llm-cost': 512,
  'ai-coding-tools': 1047,
  'kr-ai-news': 398,
}

const seedCafeBoardPosts: BoardPost[] = [
  {
    id: 'seed-cafe-prompt-welcome',
    category: 'cafe:prompt-engineering',
    title: '카페 게시판 사용법 — 가입하면 글을 쓸 수 있어요',
    author: 'AIDigestDesk',
    body: '가입한 카페에는 전용 미니 게시판이 열립니다. 카페 게시판 글도 서버에 저장되어 공유됩니다.',
    createdAt: '2026-06-18T04:00:00.000Z',
  },
]

function createSeedState(): CommunityState {
  return {
    channels: seedChannels.map((channel) => ({ ...channel })),
    posts: seedPosts.map((post) => ({ ...post })),
    boardPosts: [...seedBoardPosts, ...seedCafeBoardPosts].map((post) => ({ ...post })),
    cafes: seedCafes.map((cafe) => ({ ...cafe })),
    comments: [],
  }
}

function isChannel(value: unknown): value is Channel {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.topic === 'string'
  )
}

function isPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.channelId === 'string' &&
    typeof candidate.author === 'string' &&
    typeof candidate.body === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

function isBoardPost(value: unknown): value is BoardPost {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.category === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.author === 'string' &&
    typeof candidate.body === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

function isComment(value: unknown): value is Comment {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.postId === 'string' &&
    typeof candidate.author === 'string' &&
    typeof candidate.body === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

function isCafe(value: unknown): value is Cafe {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.topic === 'string' &&
    (candidate.emoji === undefined || typeof candidate.emoji === 'string')
  )
}

/**
 * 저장된 원본(JSON)을 읽는다. v2 가 없으면 v1(레거시 채팅 전용)을 마이그레이션
 * 대상으로 시도한다. 없거나 손상되면 null.
 */
function readRawState(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

/** 저장된 상태를 읽는다. 없거나 손상되면 시드 상태를 돌려준다. */
export function loadState(): CommunityState {
  if (typeof window === 'undefined') return createSeedState()

  const candidate = readRawState()
  if (!candidate) return createSeedState()

  const channels = Array.isArray(candidate.channels)
    ? candidate.channels.filter(isChannel)
    : []
  const posts = Array.isArray(candidate.posts) ? candidate.posts.filter(isPost) : []
  const boardPosts = Array.isArray(candidate.boardPosts)
    ? candidate.boardPosts.filter(isBoardPost)
    : []
  const cafes = Array.isArray(candidate.cafes) ? candidate.cafes.filter(isCafe) : []
  const comments = Array.isArray(candidate.comments) ? candidate.comments.filter(isComment) : []

  const seed = createSeedState()

  return {
    // 채널/카페가 비어 있으면(손상/구버전) 시드로 복구하되 살아남은 글은 유지한다.
    channels: channels.length > 0 ? channels : seed.channels,
    posts,
    boardPosts: boardPosts.length > 0 ? boardPosts : seed.boardPosts,
    cafes: cafes.length > 0 ? cafes : seed.cafes,
    comments,
  }
}

/** 상태를 저장한다. 저장이 불가능한 환경(SSR/프라이빗 모드)에서는 조용히 무시한다. */
export function saveState(state: CommunityState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 저장 공간 초과나 프라이빗 모드 등은 데모에서 치명적이지 않으므로 무시한다.
  }
  notifyCommunity()
}

/* ── 외부 store 구독(useSyncExternalStore) ──────────────────────────────
 * 쓰기(saveState·카페 멤버십)마다 스냅샷을 무효화하고 구독자에게 알린다.
 * 컴포넌트는 getCommunitySnapshot() 으로 안정 참조를 읽고 select*() 로 파생한다.
 * (수동 refreshToken·setState-in-effect 없이 React Compiler·lint 안전.) */
const communityListeners = new Set<() => void>()
let stateSnapshot: CommunityState | null = null

/** useSyncExternalStore용 안정 스냅샷 — 다음 쓰기 전까지 동일 참조. */
export function getCommunitySnapshot(): CommunityState {
  if (!stateSnapshot) stateSnapshot = loadState()
  return stateSnapshot
}

function notifyCommunity(): void {
  stateSnapshot = null // 다음 스냅샷은 새 참조로 재생성 → 구독자 리렌더
  for (const listener of communityListeners) listener()
}

export function subscribeCommunity(listener: () => void): () => void {
  communityListeners.add(listener)
  return () => {
    communityListeners.delete(listener)
  }
}

/* ── 스냅샷 기반 selector(컴포넌트 useMemo에서 state를 실제로 사용) ── */
/** 채널 글 — 오래된 순. */
export function selectChannelPosts(state: CommunityState, channelId: string): Post[] {
  return state.posts
    .filter((post) => post.channelId === channelId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}
/** 게시판 글 — 최신순. category 미지정 시 일반 게시판(카페 제외). */
export function selectBoardPosts(state: CommunityState, category?: string): BoardPost[] {
  const filtered = category
    ? state.boardPosts.filter((post) => post.category === category)
    : state.boardPosts.filter((post) => !post.category.startsWith('cafe:'))
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
/** 글의 댓글 — 작성순. */
export function selectComments(state: CommunityState, postId: string): Comment[] {
  return state.comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}
/** 글의 댓글 수. */
export function selectCommentCount(state: CommunityState, postId: string): number {
  return state.comments.filter((comment) => comment.postId === postId).length
}

/** 채널 목록(읽기 전용 사본). */
export function listChannels(): Channel[] {
  return loadState().channels
}

/** 특정 채널의 글을 오래된 순(작성 시간 오름차순)으로 돌려준다. */
export function listPosts(channelId: string): Post[] {
  return loadState()
    .posts.filter((post) => post.channelId === channelId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

function createId(prefix = 'post'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}`
}

/** crypto.randomUUID 폴백용 단조 증가 카운터(같은 ms 내 충돌 방지). */
let idCounter = 0

/* ── 실 DB 연동(desk-platform 공개 REST) — 오프라인 퍼스트 ──────────────
 * configureCommunityRemote()를 앱 시작 시 호출하면 채팅·게시판·댓글이 서버(DB)와 동기화된다.
 * 미설정(SSR/오프라인)이면 localStorage 단독으로 그대로 동작한다. 채널·카페는 시드 설정 유지.
 * 쓰기는 낙관적(즉시 로컬 반영) + write-through(서버 POST/DELETE), 임시 id는 서버 id로 치환한다. */
type CommunityRemoteCfg = { baseUrl: string; appId: string }
let communityRemote: CommunityRemoteCfg | null = null

type ServerPost = {
  id: string
  kind: 'chat' | 'board' | 'comment'
  channel: string | null
  parentId: string | null
  title: string | null
  author: string
  authorId: string
  body: string
  createdAt: string
}

function communityPostsUrl(suffix = ''): string {
  const base = communityRemote!.baseUrl.replace(/\/$/, '')
  return `${base}/api/v1/apps/${communityRemote!.appId}/community/posts${suffix}`
}

/** 커뮤니티를 desk-platform 실 DB와 동기화. 앱 1회 호출(웹=main, 토스=main). */
export function configureCommunityRemote(cfg: CommunityRemoteCfg): void {
  communityRemote = cfg
  void syncCommunityFromServer()
}

/** 서버(DB)를 권위 소스로 채팅/게시판/댓글을 받아 로컬 상태에 반영(채널·카페 시드 유지). */
export async function syncCommunityFromServer(): Promise<void> {
  if (!communityRemote || typeof fetch === 'undefined') return
  try {
    const res = await fetch(communityPostsUrl())
    if (!res.ok) return
    const data = (await res.json()) as { posts: ServerPost[] }
    const posts: Post[] = []
    const boardPosts: BoardPost[] = []
    const comments: Comment[] = []
    for (const p of data.posts) {
      if (p.kind === 'chat') {
        posts.push({ id: p.id, channelId: p.channel ?? 'general', author: p.author, body: p.body, createdAt: p.createdAt, authorId: p.authorId })
      } else if (p.kind === 'board') {
        boardPosts.push({ id: p.id, category: p.channel ?? '자유', title: p.title ?? '', author: p.author, body: p.body, createdAt: p.createdAt, authorId: p.authorId })
      } else {
        comments.push({ id: p.id, postId: p.parentId ?? '', author: p.author, body: p.body, createdAt: p.createdAt, authorId: p.authorId })
      }
    }
    posts.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    boardPosts.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const state = loadState()
    saveState({ ...state, posts, boardPosts, comments })
  } catch {
    /* 오프라인 — localStorage 캐시로 계속 동작 */
  }
}

type ServerKind = ServerPost['kind']
async function createOnServer(
  kind: ServerKind,
  fields: { channel?: string; parentId?: string; title?: string; author: string; body: string }
): Promise<string | null> {
  if (!communityRemote || typeof fetch === 'undefined') return null
  try {
    const res = await fetch(communityPostsUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, authorKey: getMemberId(), ...fields }),
    })
    if (!res.ok) return null
    const p = (await res.json()) as ServerPost
    return p.id
  } catch {
    return null
  }
}

function deleteOnServer(id: string): void {
  if (!communityRemote || typeof fetch === 'undefined') return
  void fetch(`${communityPostsUrl(`/${encodeURIComponent(id)}`)}?authorKey=${encodeURIComponent(getMemberId())}`, {
    method: 'DELETE',
  }).catch(() => {})
}

/** 낙관적 추가분의 임시 id를 서버 id로 치환(다음 동기화 시 중복 방지). */
function reconcileCommunityId(
  collection: 'posts' | 'boardPosts' | 'comments',
  tempId: string,
  serverId: string
): void {
  const state = loadState()
  if (collection === 'posts') {
    saveState({ ...state, posts: state.posts.map((x) => (x.id === tempId ? { ...x, id: serverId } : x)) })
  } else if (collection === 'boardPosts') {
    saveState({ ...state, boardPosts: state.boardPosts.map((x) => (x.id === tempId ? { ...x, id: serverId } : x)) })
  } else {
    saveState({ ...state, comments: state.comments.map((x) => (x.id === tempId ? { ...x, id: serverId } : x)) })
  }
}

/** 글을 추가하고 새로 만든 Post 를 돌려준다. body 가 비면 던진다. */
export function addPost(input: { channelId: string; author: string; body: string }): Post {
  const body = input.body.trim()
  if (!body) {
    throw new Error('빈 메시지는 등록할 수 없습니다.')
  }

  const author = input.author.trim() || DEFAULT_NICKNAME
  const post: Post = {
    id: createId('post'),
    channelId: input.channelId,
    author,
    body,
    createdAt: new Date().toISOString(),
    authorId: getMemberId(),
  }

  const state = loadState()
  saveState({ ...state, posts: [...state.posts, post] })
  void createOnServer('chat', { channel: post.channelId, author: post.author, body: post.body }).then(
    (serverId) => serverId && reconcileCommunityId('posts', post.id, serverId)
  )
  return post
}

/** 채널 글 본문을 수정한다(작성자 본인만). 권한 없음/빈 본문이면 던진다. */
export function editPost(id: string, body: string): Post {
  const trimmed = body.trim()
  if (!trimmed) throw new Error('빈 메시지로 수정할 수 없습니다.')
  const state = loadState()
  const target = state.posts.find((post) => post.id === id)
  if (!target) throw new Error('메시지를 찾을 수 없습니다.')
  if (!isOwner(target.authorId)) throw new Error('본인 글만 수정할 수 있습니다.')
  const updated: Post = { ...target, body: trimmed, editedAt: new Date().toISOString() }
  saveState({ ...state, posts: state.posts.map((post) => (post.id === id ? updated : post)) })
  return updated
}

/** 채널 글을 삭제한다(작성자 본인만). 딸린 댓글도 함께 삭제(deleteBoardPost 와 대칭). */
export function deletePost(id: string): void {
  const state = loadState()
  const target = state.posts.find((post) => post.id === id)
  if (!target || !isOwner(target.authorId)) return
  saveState({
    ...state,
    posts: state.posts.filter((post) => post.id !== id),
    comments: state.comments.filter((comment) => comment.postId !== id),
  })
  deleteOnServer(id)
}

/**
 * 게시판 글을 최신순(작성 시간 내림차순)으로 돌려준다.
 * category 를 주면 해당 카테고리만, 없으면 일반 게시판 카테고리 전체를 돌려준다.
 * (카페 게시판 `cafe:${id}` 글은 category 미지정 시 제외한다.)
 */
export function listBoardPosts(category?: string): BoardPost[] {
  const posts = loadState().boardPosts
  const filtered = category
    ? posts.filter((post) => post.category === category)
    : posts.filter((post) => !post.category.startsWith('cafe:'))

  return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** 게시판 글을 추가하고 새로 만든 BoardPost 를 돌려준다. title/body 가 비면 던진다. */
export function addBoardPost(input: {
  category: string
  title: string
  author: string
  body: string
}): BoardPost {
  const title = input.title.trim()
  const body = input.body.trim()
  if (!title) {
    throw new Error('제목을 입력해 주세요.')
  }
  if (!body) {
    throw new Error('내용을 입력해 주세요.')
  }

  const author = input.author.trim() || DEFAULT_NICKNAME
  const post: BoardPost = {
    id: createId('board'),
    category: input.category,
    title,
    author,
    body,
    createdAt: new Date().toISOString(),
    authorId: getMemberId(),
  }

  const state = loadState()
  saveState({ ...state, boardPosts: [post, ...state.boardPosts] })
  void createOnServer('board', { channel: post.category, title: post.title, author: post.author, body: post.body }).then(
    (serverId) => serverId && reconcileCommunityId('boardPosts', post.id, serverId)
  )
  return post
}

/** 게시판 글의 제목/본문을 수정한다(작성자 본인만). 빈 값/권한 없음이면 던진다. */
export function editBoardPost(id: string, input: { title: string; body: string }): BoardPost {
  const title = input.title.trim()
  const body = input.body.trim()
  if (!title) throw new Error('제목을 입력해 주세요.')
  if (!body) throw new Error('내용을 입력해 주세요.')
  const state = loadState()
  const target = state.boardPosts.find((post) => post.id === id)
  if (!target) throw new Error('글을 찾을 수 없습니다.')
  if (!isOwner(target.authorId)) throw new Error('본인 글만 수정할 수 있습니다.')
  const updated: BoardPost = { ...target, title, body, editedAt: new Date().toISOString() }
  saveState({
    ...state,
    boardPosts: state.boardPosts.map((post) => (post.id === id ? updated : post)),
  })
  return updated
}

/** 게시판 글을 삭제한다(작성자 본인만). 딸린 댓글도 함께 삭제. */
export function deleteBoardPost(id: string): void {
  const state = loadState()
  const target = state.boardPosts.find((post) => post.id === id)
  if (!target || !isOwner(target.authorId)) return
  saveState({
    ...state,
    boardPosts: state.boardPosts.filter((post) => post.id !== id),
    comments: state.comments.filter((comment) => comment.postId !== id),
  })
  deleteOnServer(id)
}

/* ── 댓글(Comment) ─────────────────────────────────────────────── */

/** 글의 댓글을 작성순(오름차순)으로 돌려준다. */
export function listComments(postId: string): Comment[] {
  return loadState()
    .comments.filter((comment) => comment.postId === postId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

/** 글의 댓글 수. */
export function countComments(postId: string): number {
  return loadState().comments.filter((comment) => comment.postId === postId).length
}

/** 댓글을 등록한다. 빈 본문이면 던진다. */
export function addComment(input: { postId: string; author: string; body: string }): Comment {
  const body = input.body.trim()
  if (!body) throw new Error('댓글 내용을 입력해 주세요.')
  const author = input.author.trim() || DEFAULT_NICKNAME
  const comment: Comment = {
    id: createId('comment'),
    postId: input.postId,
    author,
    body,
    createdAt: new Date().toISOString(),
    authorId: getMemberId(),
  }
  const state = loadState()
  saveState({ ...state, comments: [...state.comments, comment] })
  void createOnServer('comment', { parentId: comment.postId, author: comment.author, body: comment.body }).then(
    (serverId) => serverId && reconcileCommunityId('comments', comment.id, serverId)
  )
  return comment
}

/** 댓글을 수정한다(작성자 본인만). */
export function editComment(id: string, body: string): Comment {
  const trimmed = body.trim()
  if (!trimmed) throw new Error('빈 댓글로 수정할 수 없습니다.')
  const state = loadState()
  const target = state.comments.find((comment) => comment.id === id)
  if (!target) throw new Error('댓글을 찾을 수 없습니다.')
  if (!isOwner(target.authorId)) throw new Error('본인 댓글만 수정할 수 있습니다.')
  const updated: Comment = { ...target, body: trimmed, editedAt: new Date().toISOString() }
  saveState({
    ...state,
    comments: state.comments.map((comment) => (comment.id === id ? updated : comment)),
  })
  return updated
}

/** 댓글을 삭제한다(작성자 본인만). */
export function deleteComment(id: string): void {
  const state = loadState()
  const target = state.comments.find((comment) => comment.id === id)
  if (!target || !isOwner(target.authorId)) return
  saveState({ ...state, comments: state.comments.filter((comment) => comment.id !== id) })
  deleteOnServer(id)
}

/** 현재 브라우저 멤버가 해당 authorId 의 소유자인지. (구버전 데이터는 authorId 없음 → false) */
export function isOwner(authorId: string | undefined): boolean {
  if (!authorId) return false
  return authorId === getMemberId()
}

/** 카페 목록(읽기 전용 사본). */
export function listCafes(): Cafe[] {
  return loadState().cafes
}

/** 가입한 카페 ID 집합을 읽는다. 없거나 손상되면 빈 배열. */
function readCafeMembership(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CAFE_MEMBERSHIP_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

function writeCafeMembership(ids: string[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CAFE_MEMBERSHIP_KEY, JSON.stringify([...new Set(ids)]))
  } catch {
    // 멤버십 저장 실패는 데모에서 치명적이지 않으므로 무시한다.
  }
  notifyCommunity()
}

/** 해당 카페에 가입했는지 여부. */
export function isCafeMember(cafeId: string): boolean {
  return readCafeMembership().includes(cafeId)
}

/** 카페에 가입한다(이미 가입했으면 변화 없음). */
export function joinCafe(cafeId: string): void {
  const ids = readCafeMembership()
  if (!ids.includes(cafeId)) {
    writeCafeMembership([...ids, cafeId])
  }
}

/** 카페에서 탈퇴한다. */
export function leaveCafe(cafeId: string): void {
  writeCafeMembership(readCafeMembership().filter((id) => id !== cafeId))
}

/** 카페 멤버 수(데모용 기본값 + 가입 시 +1). */
export function getCafeMemberCount(cafeId: string): number {
  const base = cafeBaseMemberCounts[cafeId] ?? 0
  return base + (isCafeMember(cafeId) ? 1 : 0)
}

/** 저장된 닉네임을 읽는다. 없으면 기본값('게스트'). */
export function getNickname(): string {
  if (typeof window === 'undefined') return DEFAULT_NICKNAME
  try {
    const raw = window.localStorage.getItem(NICKNAME_KEY)
    const trimmed = raw?.trim()
    return trimmed ? trimmed : DEFAULT_NICKNAME
  } catch {
    return DEFAULT_NICKNAME
  }
}

/** 닉네임을 저장한다. 빈 값이면 기본값으로 되돌린다. */
export function setNickname(name: string): void {
  if (typeof window === 'undefined') return
  try {
    const trimmed = name.trim()
    if (trimmed) {
      window.localStorage.setItem(NICKNAME_KEY, trimmed)
    } else {
      window.localStorage.removeItem(NICKNAME_KEY)
    }
  } catch {
    // 닉네임 저장 실패는 데모에서 치명적이지 않으므로 무시한다.
  }
}

/**
 * 이 브라우저의 안정적인 익명 멤버 ID(`anon:...`)를 읽거나 생성한다.
 *
 * 로컬 데모에서는 쓰이지 않지만, DeskCloud CommunityDesk 연동 시 글/댓글 작성에
 * 필요한 `authorMemberId`(호스트 앱이 공급하는 최종 사용자 식별자)로 사용한다.
 * 백엔드가 없거나 로컬 폴백일 때는 호출되지 않으므로 기존 동작에 영향이 없다.
 * SSR 안전하며, 저장이 불가능한 환경에서는 매번 새 ID를 만들어 돌려준다.
 */
export function getMemberId(): string {
  if (typeof window === 'undefined') return `anon:${createId('member')}`
  try {
    const existing = window.localStorage.getItem(MEMBER_ID_KEY)?.trim()
    if (existing) return existing
    const generated = `anon:${createId('member')}`
    window.localStorage.setItem(MEMBER_ID_KEY, generated)
    return generated
  } catch {
    return `anon:${createId('member')}`
  }
}
