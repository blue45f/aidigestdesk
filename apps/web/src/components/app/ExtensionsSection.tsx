import {
  agentExtensions,
  extensionCategories,
  extensionKinds,
  extensionPlatforms,
  getDomainFromUrl,
  getExtensionSearchText,
  getExtensionStats,
  type AgentExtension,
  type ExtensionCategory,
  type ExtensionKind,
  type ExtensionPlatform,
} from '@aidigestdesk/content'
import {
  Bot,
  ExternalLink,
  FileCode2,
  Puzzle,
  Server,
  Terminal,
  Wand2,
  Webhook,
  Workflow,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import type { ComponentType } from 'react'

import {
  ActiveFilterChips,
  BrandMark,
  Chip,
  EmptyState,
  ResultSummary,
  SearchField,
  SectionHeader,
  SegmentBar,
  SortSelect,
  type ChipTone,
} from '@/components/app/CommonUi'

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

type KindFilter = ExtensionKind | 'all'
type PlatformFilter = ExtensionPlatform | 'all'
type CategoryFilter = ExtensionCategory | 'all'
type SortMode = 'name-asc' | 'name-desc' | 'kind' | 'platform'

/** 종류 → lucide 아이콘. 카드의 시각적 분류 신호. */
const kindIcons: Record<ExtensionKind, IconComponent> = {
  플러그인: Puzzle,
  훅: Webhook,
  스킬: Wand2,
  '슬래시 명령': Terminal,
  서브에이전트: Bot,
  'MCP 서버': Server,
  워크플로우: Workflow,
  '룰셋/지침': FileCode2,
  템플릿: FileCode2,
}

/** 종류 → 칩 톤(종류 계열별 색). 그 외는 neutral. */
const kindTones: Partial<Record<ExtensionKind, ChipTone>> = {
  'MCP 서버': 'blue',
  훅: 'amber',
  스킬: 'accent',
  워크플로우: 'coral',
}

const kindFilterItems: Array<{ id: KindFilter; label: string }> = [
  { id: 'all', label: '전체' },
  ...extensionKinds.map((kind) => ({ id: kind, label: kind })),
]

const platformFilterItems: Array<{ id: PlatformFilter; label: string }> = [
  { id: 'all', label: '전체' },
  ...extensionPlatforms.map((platform) => ({ id: platform, label: platform })),
]

const categoryFilterItems: Array<{ id: CategoryFilter; label: string }> = [
  { id: 'all', label: '전체' },
  ...extensionCategories.map((category) => ({ id: category, label: category })),
]

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: 'name-asc', label: '이름 A→Z' },
  { value: 'name-desc', label: '이름 Z→A' },
  { value: 'kind', label: '유형별' },
  { value: 'platform', label: '플랫폼별' },
]

function compareExtensions(a: AgentExtension, b: AgentExtension, sort: SortMode): number {
  switch (sort) {
    case 'name-desc':
      return b.name.localeCompare(a.name, 'ko-KR')
    case 'kind':
      return a.kind.localeCompare(b.kind, 'ko-KR') || a.name.localeCompare(b.name, 'ko-KR')
    case 'platform':
      return a.platform.localeCompare(b.platform, 'ko-KR') || a.name.localeCompare(b.name, 'ko-KR')
    case 'name-asc':
    default:
      return a.name.localeCompare(b.name, 'ko-KR')
  }
}

function CodeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.6875rem] font-semibold text-text-subtle">{label}</p>
      <code className="block break-words rounded bg-surface-2 px-2 py-1 font-mono text-xs text-text-muted">
        {value}
      </code>
    </div>
  )
}

function ExtensionCard({ extension }: { extension: AgentExtension }) {
  const KindIcon = kindIcons[extension.kind]
  const domain = getDomainFromUrl(extension.url)
  const kindTone = kindTones[extension.kind] ?? 'neutral'

  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        {domain ? (
          <BrandMark domain={domain} label={extension.name} size="sm" />
        ) : (
          <span
            className="grid size-6 shrink-0 place-items-center rounded-md border border-border bg-surface-2 text-text-muted"
            aria-hidden
          >
            <KindIcon className="size-3.5" aria-hidden />
          </span>
        )}
        <h3 className="min-w-0 text-sm font-semibold text-text">{extension.name}</h3>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip tone={kindTone} icon={KindIcon}>
          {extension.kind}
        </Chip>
        <Chip tone="neutral">{extension.platform}</Chip>
        <Chip tone="neutral">{extension.category}</Chip>
        <Chip tone={extension.maturity === '공식' ? 'accent' : 'neutral'}>{extension.maturity}</Chip>
      </div>

      <p className="mt-3 text-xs leading-5 text-text-muted">{extension.summary}</p>

      {extension.whatItDoes.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {extension.whatItDoes.slice(0, 3).map((item) => (
            <li key={item} className="flex gap-2 text-xs leading-5 text-text-muted">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 space-y-2">
        <CodeRow label="설치" value={extension.install} />
        <CodeRow label="사용" value={extension.usage} />
      </div>

      {extension.koreanNote ? (
        <div className="mt-3 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-xs leading-5 text-accent">
          <span className="font-semibold">국내 팁 · </span>
          {extension.koreanNote}
        </div>
      ) : null}

      <a
        href={extension.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 self-start text-xs font-semibold text-text-muted transition hover:text-text"
      >
        <ExternalLink className="size-3.5" aria-hidden />
        문서 열기
      </a>
    </article>
  )
}

export function ExtensionsSection() {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindFilter>('all')
  const [platform, setPlatform] = useState<PlatformFilter>('all')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [sort, setSort] = useState<SortMode>('name-asc')

  const stats = getExtensionStats()

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ko-KR')
    return agentExtensions
      .filter((extension) => {
        if (kind !== 'all' && extension.kind !== kind) return false
        if (platform !== 'all' && extension.platform !== platform) return false
        if (category !== 'all' && extension.category !== category) return false
        if (needle && !getExtensionSearchText(extension).toLocaleLowerCase('ko-KR').includes(needle))
          return false
        return true
      })
      .sort((a, b) => compareExtensions(a, b, sort))
  }, [query, kind, platform, category, sort])

  const hasActiveFilter =
    query.trim() !== '' || kind !== 'all' || platform !== 'all' || category !== 'all'

  const resetAll = () => {
    setQuery('')
    setKind('all')
    setPlatform('all')
    setCategory('all')
  }

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = []
  if (kind !== 'all') chips.push({ key: 'kind', label: `종류 · ${kind}`, onRemove: () => setKind('all') })
  if (platform !== 'all')
    chips.push({ key: 'platform', label: `플랫폼 · ${platform}`, onRemove: () => setPlatform('all') })
  if (category !== 'all')
    chips.push({ key: 'category', label: `카테고리 · ${category}`, onRemove: () => setCategory('all') })
  if (query.trim() !== '')
    chips.push({ key: 'query', label: `검색 · ${query.trim()}`, onRemove: () => setQuery('') })

  return (
    <section id="extensions" className="space-y-4">
      <SectionHeader
        icon={Puzzle}
        title="AI 코딩 에이전트 확장 디렉터리"
        description="플러그인·훅·스킬·슬래시 명령·서브에이전트·MCP 서버·워크플로우·룰셋을 플랫폼과 도메인 카테고리로 세분화해 검색합니다. 설치/사용 한 줄과 국내 팁을 함께 제공합니다."
        badge={
          <Chip tone="blue">
            {stats.total}개 · {stats.categories}개 카테고리
          </Chip>
        }
      />

      <div className="space-y-4 rounded-lg border border-border bg-surface p-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <SearchField
            label="검색"
            value={query}
            onChange={setQuery}
            placeholder="이름, 요약, 태그, 설치/사용 명령으로 검색"
          />
          <SortSelect label="정렬" value={sort} onChange={setSort} options={sortOptions} />
        </div>

        <SegmentBar label="종류" items={kindFilterItems} value={kind} onChange={setKind} />
        <SegmentBar
          label="플랫폼"
          items={platformFilterItems}
          value={platform}
          onChange={setPlatform}
        />
        <SegmentBar
          label="카테고리"
          items={categoryFilterItems}
          value={category}
          onChange={setCategory}
        />

        <ResultSummary
          shown={filtered.length}
          total={stats.total}
          onReset={resetAll}
          resetDisabled={!hasActiveFilter}
        />
      </div>

      {chips.length > 0 ? <ActiveFilterChips chips={chips} /> : null}

      {filtered.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((extension) => (
            <ExtensionCard key={extension.id} extension={extension} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 확장이 없습니다"
          body="필터를 줄이거나 검색어를 지우세요."
        />
      )}
    </section>
  )
}
