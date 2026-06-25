import {
  agentExtensions,
  benchmarkEntries,
  getBenchmarkDomainLabel,
  getExtensionRankGrade,
  getProviderLabel,
  modelProfiles,
  type AgentExtension,
  type BenchmarkDomain,
  type BenchmarkEntry,
  type ExtensionKind,
  type ExtensionPlatform,
  type ProviderId,
} from '@aidigestdesk/content'
import { looksPrice, looksSpeed, parseNum, parseRank } from '@aidigestdesk/content/shared'
import {
  ArrowRight,
  ChevronRight,
  Bot,
  Code2,
  Coins,
  FileText,
  FlaskConical,
  Image,
  Layers,
  Puzzle,
  Server,
  Sparkles,
  TerminalSquare,
  Trophy,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { BrandMark, Chip, SortChip, type ChipTone, type SortDirection } from '@/components/app/CommonUi'

/* 벤치마크 모델명 → 상세 프로필 id 매칭(모델명/별칭, 공백·대소문자 무시). */
const normalizeName = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim()
const profileIdByName = new Map<string, string>()
for (const profile of modelProfiles) {
  profileIdByName.set(normalizeName(profile.modelName), profile.id)
  for (const alias of profile.aliases ?? []) profileIdByName.set(normalizeName(alias), profile.id)
}
function resolveProfileId(modelName: string): string | undefined {
  const direct = profileIdByName.get(normalizeName(modelName))
  if (direct) return direct
  // 괄호 변형(예: "GPT-5.5 (xhigh)") → 괄호 제거 후 재시도
  const stripped = normalizeName(modelName.replace(/\s*\([^)]*\)\s*/g, ' '))
  return profileIdByName.get(stripped)
}

/* ── 분야(도메인) 카테고리 ──────────────────────────────────────── */
const modelDomains: Array<{ id: BenchmarkDomain; label: string; icon: LucideIcon }> = [
  { id: 'overall', label: '종합', icon: Trophy },
  { id: 'coding', label: '코딩', icon: Code2 },
  { id: 'ppt', label: 'PPT·문서', icon: FileText },
  { id: 'research', label: '리서치', icon: FlaskConical },
  { id: 'multimodal', label: '멀티모달', icon: Image },
  { id: 'agent', label: '에이전트', icon: Bot },
  { id: 'cost', label: '가성비', icon: Coins },
]

/* ── 확장 종류 카테고리 ─────────────────────────────────────────── */
const extensionKinds: Array<{ id: ExtensionKind | 'all'; label: string; icon: LucideIcon }> = [
  { id: 'all', label: '전체', icon: Layers },
  { id: '스킬', label: '스킬', icon: Sparkles },
  { id: '훅', label: '훅', icon: Zap },
  { id: '플러그인', label: '플러그인', icon: Puzzle },
  { id: 'MCP 서버', label: 'MCP', icon: Server },
  { id: '슬래시 명령', label: '슬래시', icon: TerminalSquare },
  { id: '서브에이전트', label: '서브에이전트', icon: Bot },
  { id: '워크플로우', label: '워크플로우', icon: Workflow },
]

/* LLM/플랫폼별 추천 — 확장 랭킹의 1차 축. */
const extensionPlatforms: Array<{ id: ExtensionPlatform | 'all'; label: string }> = [
  { id: 'all', label: '전체 LLM' },
  { id: 'Claude Code', label: 'Claude Code' },
  { id: 'Codex CLI', label: 'Codex CLI' },
  { id: 'Gemini CLI', label: 'Gemini CLI' },
  { id: 'Cursor', label: 'Cursor' },
  { id: 'GitHub Copilot', label: 'Copilot' },
  { id: '범용', label: '범용' },
]

type Scope = 'models' | 'extensions'
type ModelSort = 'rank' | 'score' | 'price' | 'speed'
type ExtensionSort = 'rank' | 'name'

const modelSortChips: Array<{ id: ModelSort; label: string }> = [
  { id: 'rank', label: '순위' },
  { id: 'score', label: '점수' },
  { id: 'price', label: '가격' },
  { id: 'speed', label: '속도' },
]
const extensionSortChips: Array<{ id: ExtensionSort; label: string }> = [
  { id: 'rank', label: '추천순위' },
  { id: 'name', label: '이름' },
]

const gradeTones: Record<string, ChipTone> = {
  S: 'accent',
  A: 'blue',
  B: 'amber',
  C: 'neutral',
  미분류: 'neutral',
}

/* 메달: 1·2·3위 시각 신호. 색만으로 전달하지 않도록 숫자를 항상 병기한다.
   medal=false(가격·속도·이름 등 비순위 정렬)일 땐 중립색 — 표시 순서를 순위로 오인하지 않도록. */
function RankBadge({ position, medal = true }: { position: number; medal?: boolean }) {
  const tone =
    !medal
      ? 'border-border bg-bg text-text-subtle'
      : position === 1
        ? 'border-amber-400/50 bg-amber-400/15 text-amber-600 dark:text-amber-300'
        : position === 2
          ? 'border-slate-400/50 bg-slate-400/15 text-slate-600 dark:text-slate-300'
          : position === 3
            ? 'border-orange-400/50 bg-orange-400/15 text-orange-600 dark:text-orange-300'
            : 'border-border bg-bg text-text-subtle'
  return (
    <span
      className={`grid size-8 shrink-0 place-items-center rounded-full border text-sm font-bold tabular-nums ${tone}`}
      aria-hidden
    >
      {position}
    </span>
  )
}

function ModelRow({
  entry,
  position,
  onOpen,
  medal = true,
}: {
  entry: BenchmarkEntry
  position: number
  onOpen?: () => void
  medal?: boolean
}) {
  const provider =
    entry.providerId === 'other'
      ? '기타'
      : (getProviderLabel(entry.providerId) ?? entry.providerId)
  const score = parseNum(entry.score)
  // ≈(추정) 접두는 보존, 숫자엔 천단위 구분
  const isEstimate = entry.score.trim().startsWith('≈')
  const scoreDisplay = score != null ? (isEstimate ? '≈' : '') + score.toLocaleString('ko-KR') : entry.score
  // 단위가 맞는 값만 칩으로 — 일부 데이터의 price/speed 필드엔 설명 문구가 들어있어 거른다.
  const showPrice = Boolean(entry.price) && /[$₩]|원|무료|free|\/\s*1m/i.test(entry.price)
  const showSpeed = Boolean(entry.speed) && /tok|\/s|초당|ms/i.test(entry.speed)
  // 컨텍스트 윈도우 형식(1M, 922k, 128K, 토큰)만 — 일부 데이터엔 설명 문구가 들어있다.
  const showContext =
    Boolean(entry.context) && /^[\d.,]+\s*[kKmM]?\s*(토큰|tokens?)?$/.test(entry.context.trim())
  const metaChips = [
    showPrice ? { label: '가격', value: entry.price } : null,
    showSpeed ? { label: '속도', value: entry.speed } : null,
    showContext ? { label: '컨텍스트', value: entry.context } : null,
  ].filter((value): value is { label: string; value: string } => value !== null)

  const inner = (
    <>
      <RankBadge position={position} medal={medal} />
      {entry.providerId !== 'other' ? (
        <BrandMark providerId={entry.providerId as ProviderId} label={entry.modelName} size="sm" />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">{entry.modelName}</p>
        <p className="mt-0.5 truncate text-xs text-text-subtle">
          {provider} · {entry.metric}
        </p>
        {metaChips.length ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {metaChips.map((chip) => (
              <span
                key={chip.label}
                className="rounded-md border border-border bg-bg px-1.5 py-0.5 text-[0.6875rem] text-text-muted"
              >
                <span className="text-text-subtle">{chip.label}</span>{' '}
                <span className="font-semibold">{chip.value}</span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-base font-bold tabular-nums text-text">{scoreDisplay}</p>
        <p className="text-[0.6875rem] text-text-subtle">점수</p>
      </div>
      {onOpen ? <ChevronRight className="size-4 shrink-0 text-text-subtle" aria-hidden /> : null}
    </>
  )

  return (
    <li>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${entry.modelName} 상세 보기`}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 text-left transition-colors hover:border-border-strong"
        >
          {inner}
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 transition-colors hover:border-border-strong">
          {inner}
        </div>
      )}
    </li>
  )
}

function ExtensionRow({
  entry,
  position,
  onOpen,
  medal = true,
}: {
  entry: AgentExtension
  position: number
  onOpen?: () => void
  medal?: boolean
}) {
  const grade = getExtensionRankGrade(entry)
  const inner = (
    <>
      <RankBadge position={position} medal={medal} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <p className="truncate text-sm font-semibold text-text">{entry.name}</p>
          <span className="rounded border border-border bg-bg px-1.5 py-px text-[0.625rem] font-medium text-text-subtle">
            {entry.kind}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-text-subtle">
          {entry.platform} · {entry.summary}
        </p>
      </div>
      <Chip tone={gradeTones[grade]}>{grade}등급</Chip>
      {onOpen ? <ChevronRight className="size-4 shrink-0 text-text-subtle" aria-hidden /> : null}
    </>
  )

  return (
    <li>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${entry.name} 상세 보기`}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 text-left transition-colors hover:border-border-strong"
        >
          {inner}
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 transition-colors hover:border-border-strong">
          {inner}
        </div>
      )}
    </li>
  )
}

/**
 * 분야별 AI 랭킹 — "원하는 분야를 고르면 1위부터" 라는 한 문장으로 이해되는 보드.
 * AI 모델(분야별)과 확장 도구(스킬·훅·플러그인 등) 두 갈래를 토글하고,
 * 정렬 칩으로 항목별 오름/내림을 바꾼다. 모바일 우선 카드 리스트.
 */
export function RankingBoard({
  id,
  limit,
  onSeeAll,
  onSelectModel,
  onSelectExtension,
  defaultScope = 'models',
}: {
  id?: string
  limit?: number
  onSeeAll?: (scope: Scope) => void
  /** 모델 행 클릭 → 상세(프로필 매칭 시에만 활성). */
  onSelectModel?: (profileId: string) => void
  /** 확장 행 클릭 → 상세/목록. */
  onSelectExtension?: (extensionId: string) => void
  defaultScope?: Scope
}) {
  const [scope, setScope] = useState<Scope>(defaultScope)
  const [domain, setDomain] = useState<BenchmarkDomain>('overall')
  const [kind, setKind] = useState<ExtensionKind | 'all'>('all')
  const [extPlatform, setExtPlatform] = useState<ExtensionPlatform | 'all'>('all')
  const [modelSort, setModelSort] = useState<ModelSort>('rank')
  const [modelDir, setModelDir] = useState<SortDirection>('asc')
  const [extSort, setExtSort] = useState<ExtensionSort>('rank')
  const [extDir, setExtDir] = useState<SortDirection>('asc')

  // 해당 분야의 leaderboard 모델(reference 제외) — 정렬 전 원천.
  const domainModels = useMemo(
    () => benchmarkEntries.filter((entry) => entry.domain === domain && entry.tier !== 'reference'),
    [domain],
  )
  // 데이터가 있는 정렬 축만 칩으로 노출(없으면 '먹통 칩'이 되므로 숨김 — 토스와 동일).
  const availableModelSortChips = useMemo(() => {
    // looksPrice/looksSpeed 마커로 먼저 게이트(토스 생성기와 동일 규칙) — 마커 없는
    // '맨 숫자'가 들어와도 웹/토스 정렬칩 노출이 갈리지 않게 한다.
    const hasPrice = domainModels.some((entry) => looksPrice(entry.price) && parseNum(entry.price) != null)
    const hasSpeed = domainModels.some((entry) => looksSpeed(entry.speed) && parseNum(entry.speed) != null)
    return modelSortChips.filter(
      (chip) =>
        chip.id === 'rank' ||
        chip.id === 'score' ||
        (chip.id === 'price' && hasPrice) ||
        (chip.id === 'speed' && hasSpeed),
    )
  }, [domainModels])
  // 활성 정렬 축이 현재 분야에 없으면 'rank'로 폴백(setState-in-effect 없이 렌더 시 보정).
  const effectiveModelSort = availableModelSortChips.some((chip) => chip.id === modelSort)
    ? modelSort
    : 'rank'

  const rankedModels = useMemo(() => {
    const dirMul = modelDir === 'asc' ? 1 : -1
    // 빈 값(null)은 정렬 방향과 무관하게 항상 끝으로 보낸다(토스 RankingListPage 와 동일 규칙).
    // ?? ±Infinity 를 dirMul 로 곱하면 내림차순에서 빈 값이 위로 튀어 양쪽 결과가 갈리므로 사용하지 않는다.
    const nullsLast = (a: number | null, b: number | null) => {
      if (a == null && b == null) return 0
      if (a == null) return 1
      if (b == null) return -1
      return (a - b) * dirMul
    }
    return domainModels
      .toSorted((a, b) => {
        switch (effectiveModelSort) {
          case 'score':
            return nullsLast(parseNum(a.score), parseNum(b.score))
          case 'price':
            return nullsLast(parseNum(a.price), parseNum(b.price))
          case 'speed':
            return nullsLast(parseNum(a.speed), parseNum(b.speed))
          case 'rank':
          default: {
            const ra = parseRank(a.rankLabel) ?? 999
            const rb = parseRank(b.rankLabel) ?? 999
            if (ra !== rb) return (ra - rb) * dirMul
            const sa = parseNum(a.score) ?? -Infinity
            const sb = parseNum(b.score) ?? -Infinity
            return (sb - sa) * dirMul
          }
        }
      })
  }, [domainModels, effectiveModelSort, modelDir])

  const rankedExtensions = useMemo(() => {
    const dirMul = extDir === 'asc' ? 1 : -1
    return agentExtensions
      .filter(
        (entry) =>
          typeof entry.rank === 'number' &&
          (kind === 'all' || entry.kind === kind) &&
          (extPlatform === 'all' || entry.platform === extPlatform),
      )
      .toSorted((a, b) => {
        if (extSort === 'name') return a.name.localeCompare(b.name) * dirMul
        return ((a.rank ?? 999) - (b.rank ?? 999)) * dirMul
      })
  }, [kind, extPlatform, extSort, extDir])

  const visibleModels = limit ? rankedModels.slice(0, limit) : rankedModels
  const visibleExtensions = limit ? rankedExtensions.slice(0, limit) : rankedExtensions
  const totalCount = scope === 'models' ? rankedModels.length : rankedExtensions.length
  const shownCount = scope === 'models' ? visibleModels.length : visibleExtensions.length

  const toggleModelSort = (next: ModelSort) => {
    if (modelSort === next) setModelDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setModelSort(next)
      setModelDir(next === 'rank' || next === 'price' ? 'asc' : 'desc')
    }
  }
  const toggleExtSort = (next: ExtensionSort) => {
    if (extSort === next) setExtDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setExtSort(next)
      setExtDir('asc')
    }
  }

  const scopeButton = (value: Scope, icon: LucideIcon, label: string) => {
    const Icon = icon
    const active = scope === value
    return (
      <button
        type="button"
        onClick={() => setScope(value)}
        aria-pressed={active}
        className={
          active
            ? 'flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-3 py-2.5 text-sm font-semibold text-ink-fg'
            : 'flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
        }
      >
        <Icon className="size-4" aria-hidden />
        {label}
      </button>
    )
  }

  return (
    <section
      id={id}
      className="scroll-mt-32 space-y-4 rounded-2xl border border-border bg-surface/60 p-4 sm:p-5"
    >
      <header className="space-y-1">
        <h2 className="flex items-center gap-2 text-lg font-bold text-text">
          <Trophy className="size-5 text-accent" aria-hidden />
          분야별 AI 랭킹
        </h2>
        <p className="text-sm text-text-muted">
          원하는 분야를 고르면 1위부터 보여드려요. 정렬 버튼으로 기준을 바꿀 수 있어요.
        </p>
      </header>

      {/* 갈래 토글 */}
      <div className="flex gap-2">
        {scopeButton('models', Sparkles, 'AI 모델')}
        {scopeButton('extensions', Puzzle, '확장 도구')}
      </div>

      {/* LLM/플랫폼 칩 — 확장 스코프 전용(어떤 도구에서 쓰는 확장인지) */}
      {scope === 'extensions' ? (
        <div className="touch-scroll -mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1">
          {extensionPlatforms.map((item) => {
            const active = extPlatform === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setExtPlatform(item.id)}
                aria-pressed={active}
                className={
                  active
                    ? 'inline-flex min-h-9 shrink-0 snap-start items-center rounded-full border border-ink bg-ink px-3 py-1.5 text-xs font-semibold text-ink-fg'
                    : 'inline-flex min-h-9 shrink-0 snap-start items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
                }
              >
                {item.label}
              </button>
            )
          })}
        </div>
      ) : null}

      {/* 카테고리 칩 */}
      <div className="touch-scroll -mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1">
        {scope === 'models'
          ? modelDomains.map((item) => {
              const Icon = item.icon
              const active = domain === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    // 분야 전환 시 정렬을 초기화한다(토스 RankingListPage 와 동일).
                    // effectiveModelSort 만 'rank'로 폴백하면 modelDir('desc')가 잔존해
                    // 순위가 역정렬되고 1위에 금메달이 잘못 칠해지는 회귀가 생긴다.
                    setDomain(item.id)
                    setModelSort('rank')
                    setModelDir('asc')
                  }}
                  aria-pressed={active}
                  className={
                    active
                      ? 'inline-flex min-h-9 shrink-0 snap-start items-center gap-1.5 rounded-full border border-accent bg-accent/12 px-3 py-1.5 text-xs font-semibold text-accent'
                      : 'inline-flex min-h-9 shrink-0 snap-start items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
                  }
                >
                  <Icon className="size-3.5" aria-hidden />
                  {item.label}
                </button>
              )
            })
          : extensionKinds.map((item) => {
              const Icon = item.icon
              const active = kind === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setKind(item.id)}
                  aria-pressed={active}
                  className={
                    active
                      ? 'inline-flex min-h-9 shrink-0 snap-start items-center gap-1.5 rounded-full border border-accent bg-accent/12 px-3 py-1.5 text-xs font-semibold text-accent'
                      : 'inline-flex min-h-9 shrink-0 snap-start items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
                  }
                >
                  <Icon className="size-3.5" aria-hidden />
                  {item.label}
                </button>
              )
            })}
      </div>

      {/* 정렬 칩 — 항목별 오름/내림 */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="text-xs font-semibold text-text-subtle">정렬</span>
        {scope === 'models'
          ? availableModelSortChips.map((chip) => (
              <SortChip
                key={chip.id}
                label={chip.label}
                active={effectiveModelSort === chip.id}
                direction={modelDir}
                onToggle={() => toggleModelSort(chip.id)}
              />
            ))
          : extensionSortChips.map((chip) => (
              <SortChip
                key={chip.id}
                label={chip.label}
                active={extSort === chip.id}
                direction={extDir}
                onToggle={() => toggleExtSort(chip.id)}
              />
            ))}
      </div>

      {/* 랭킹 리스트 */}
      <ol className="space-y-2">
        {scope === 'models'
          ? visibleModels.map((entry, index) => {
              const profileId = onSelectModel ? resolveProfileId(entry.modelName) : undefined
              return (
                <ModelRow
                  key={entry.id}
                  entry={entry}
                  position={index + 1}
                  medal={effectiveModelSort === 'rank'}
                  onOpen={profileId ? () => onSelectModel?.(profileId) : undefined}
                />
              )
            })
          : visibleExtensions.map((entry, index) => (
              <ExtensionRow
                key={entry.id}
                entry={entry}
                position={index + 1}
                medal={extSort === 'rank'}
                onOpen={onSelectExtension ? () => onSelectExtension(entry.id) : undefined}
              />
            ))}
      </ol>

      {onSeeAll && totalCount > shownCount ? (
        <button
          type="button"
          onClick={() => onSeeAll?.(scope)}
          className="group inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-surface py-2.5 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text"
        >
          {scope === 'models'
            ? `${getBenchmarkDomainLabel(domain)} 분야 전체 ${totalCount}개 보기`
            : `전체 ${totalCount}개 보기`}
          <ArrowRight
            className="size-4 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5"
            aria-hidden
          />
        </button>
      ) : null}
    </section>
  )
}
