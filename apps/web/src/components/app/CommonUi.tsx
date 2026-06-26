import {
  getBrandIconUrl,
  getProviderIconUrl,
  type ProviderId,
  type SourceKind,
} from '@aidigestdesk/content'
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Play, Sparkles, X } from 'lucide-react'
import { useState } from 'react'

import type { ComponentType, ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

/**
 * 도표/리스트 헤더용 정렬 토글 버튼. 같은 컬럼을 다시 누르면 방향이 뒤집힌다.
 * 비활성: 양방향 화살표(흐림) · 활성: 현재 방향 화살표(강조).
 * 모든 정렬 가능한 컬럼에서 동일하게 쓰여 "이 열은 정렬된다"는 어휘를 통일한다.
 */
export function SortButton({
  label,
  active,
  direction,
  onToggle,
  align = 'left',
  className,
}: {
  label: ReactNode
  active: boolean
  direction: SortDirection
  onToggle: () => void
  align?: 'left' | 'right' | 'center'
  className?: string
}) {
  const Icon = !active ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown
  const justify =
    align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
  const directionLabel = active
    ? direction === 'asc'
      ? ', 현재 오름차순 — 누르면 내림차순'
      : ', 현재 내림차순 — 누르면 오름차순'
    : ', 누르면 정렬'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={`${typeof label === 'string' ? label : '항목'} 기준 정렬${directionLabel}`}
      className={`group inline-flex items-center gap-1 ${justify} rounded-md px-1.5 py-1 text-xs font-semibold transition-colors ${
        active ? 'text-accent' : 'text-text-subtle hover:text-text'
      } ${className ?? ''}`}
    >
      <span className="truncate">{label}</span>
      <Icon
        className={`size-3.5 shrink-0 transition-opacity ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}
        aria-hidden
      />
    </button>
  )
}

/**
 * 카드 리스트(모바일 우선) 위에 두는 정렬 칩. 표가 아닌 곳에서 컬럼 정렬 어휘를
 * 그대로 제공한다. 활성 칩은 채워지고 방향 화살표를 단다.
 */
export function SortChip({
  label,
  active,
  direction,
  onToggle,
}: {
  label: ReactNode
  active: boolean
  direction: SortDirection
  onToggle: () => void
}) {
  const Icon = !active ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={`${typeof label === 'string' ? label : '항목'} 기준 정렬${
        active ? (direction === 'asc' ? ', 현재 오름차순' : ', 현재 내림차순') : ''
      }`}
      className={
        active
          ? 'inline-flex min-h-9 shrink-0 snap-start items-center gap-1 rounded-full border border-accent bg-accent/12 px-3 py-1.5 text-xs font-semibold text-accent'
          : 'inline-flex min-h-9 shrink-0 snap-start items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
      }
    >
      {label}
      <Icon className="size-3.5" aria-hidden />
    </button>
  )
}

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-md border border-border bg-surface text-text-muted transition hover:border-border-strong hover:text-text"
    >
      {children}
    </button>
  )
}

export function SegmentBar<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string
  items: Array<{ id: T; label: string }>
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs font-semibold text-text-subtle">{label}</p>
      <div className="touch-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={
              item.id === value
                ? 'min-h-9 shrink-0 rounded-md border border-ink bg-ink px-3 py-1.5 text-xs font-semibold text-ink-fg'
                : 'min-h-9 shrink-0 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
            }
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function MultiSegmentBar<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string
  items: Array<{ id: T | 'all'; label: string }>
  value: readonly T[]
  onChange: (value: T[]) => void
}) {
  const toggleValue = (nextValue: T) => {
    onChange(
      value.includes(nextValue)
        ? value.filter((selected) => selected !== nextValue)
        : [...value, nextValue]
    )
  }

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs font-semibold text-text-subtle">{label}</p>
      <div className="touch-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
        {items.map((item) => {
          const selected = item.id === 'all' ? value.length === 0 : value.includes(item.id)

          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                if (item.id === 'all') {
                  onChange([])
                  return
                }
                toggleValue(item.id)
              }}
              className={
                selected
                  ? 'min-h-9 shrink-0 rounded-md border border-ink bg-ink px-3 py-1.5 text-xs font-semibold text-ink-fg'
                  : 'min-h-9 shrink-0 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
              }
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** 라벨이 달린 표준 셀렉트. 흩어져 있던 raw <select> 블록을 통일한다. */
export function Select<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-text-subtle">{label}</span>
      <select
        value={value}
        onChange={(event) => {
          const raw = event.target.value
          const next = (typeof value === 'number' ? Number(raw) : raw) as T
          onChange(next)
        }}
        className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

/**
 * 정렬 필드 + 방향을 하나의 의미 있는 셀렉트로 합친다.
 * "정렬"과 "정렬 방향" 두 드롭다운을 쓰던 패턴을 대체한다.
 */
export function SortSelect<T extends string>({
  label = '정렬',
  value,
  onChange,
  options,
}: {
  label?: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return <Select label={label} value={value} onChange={onChange} options={options} />
}

export function SearchField({
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
      <span className="text-xs font-semibold text-text-subtle">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
      />
    </label>
  )
}

/** 결과 수 + 초기화를 묶은 요약 패널. 모든 필터 블록 끝에 둔다. */
export function ResultSummary({
  shown,
  total,
  unit = '개',
  onReset,
  resetDisabled,
}: {
  shown: number
  total: number
  unit?: string
  onReset?: () => void
  resetDisabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-bg px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-text-subtle">필터 결과</p>
        <p className="mt-0.5 text-sm font-semibold text-text">
          <span className="text-accent">{shown}</span>
          {unit} / 전체 {total}
          {unit}
        </p>
      </div>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          disabled={resetDisabled}
          className="min-h-9 shrink-0 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
        >
          초기화
        </button>
      ) : null}
    </div>
  )
}

/** 활성 필터를 칩으로 보여주고 개별 제거를 허용한다. */
export function ActiveFilterChips({
  chips,
}: {
  chips: Array<{ key: string; label: string; onRemove: () => void }>
}) {
  if (!chips.length) return null
  return (
    <div className="touch-scroll -mx-1 flex max-w-full items-center gap-1.5 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
      <span className="shrink-0 text-xs font-semibold text-text-subtle">활성 필터</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full border border-accent/30 bg-accent/10 py-1 pr-1.5 pl-2.5 text-xs font-semibold text-accent transition hover:bg-accent/20"
        >
          {chip.label}
          <X className="size-3" aria-hidden />
        </button>
      ))}
    </div>
  )
}

const sourceKindStyles: Record<SourceKind, { label: string; className: string }> = {
  official: { label: '공식', className: 'border-accent-2/30 bg-accent-2/10 text-accent-2' },
  benchmark: { label: '벤치마크', className: 'border-accent-3/40 bg-accent-3/10 text-accent-3' },
  publisher: { label: '출판/교육', className: 'border-accent/30 bg-accent/10 text-accent' },
  community: { label: '커뮤니티', className: 'border-accent-4/30 bg-accent-4/10 text-accent-4' },
}

export function SourceKindBadge({ kind }: { kind: SourceKind }) {
  const style = sourceKindStyles[kind]
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.6875rem] font-semibold ${style.className}`}
    >
      {style.label}
    </span>
  )
}

const chipTones = {
  neutral: 'border-border bg-bg text-text-subtle',
  accent: 'border-accent/30 bg-accent/10 text-accent',
  blue: 'border-accent-2/30 bg-accent-2/10 text-accent-2',
  amber: 'border-accent-3/40 bg-accent-3/10 text-accent-3',
  coral: 'border-accent-4/30 bg-accent-4/10 text-accent-4',
  ink: 'border-ink bg-ink text-ink-fg',
} as const

export type ChipTone = keyof typeof chipTones

export function Chip({
  children,
  tone = 'neutral',
  icon: Icon,
}: {
  children: ReactNode
  tone?: ChipTone
  icon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.6875rem] font-semibold ${chipTones[tone]}`}
    >
      {Icon ? <Icon className="size-3" aria-hidden /> : null}
      {children}
    </span>
  )
}

/** 신규 등록/발행 항목 강조 배지. */
export function NewBadge({ label = '신규' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-accent-4/40 bg-accent-4/12 px-2 py-0.5 text-[0.6875rem] font-bold text-accent-4">
      <Sparkles className="size-3" aria-hidden />
      {label}
    </span>
  )
}

/** 도메인/제공사 브랜드 파비콘. 실패 시 머리글자 글리프로 폴백. */
export function BrandMark({
  domain,
  providerId,
  label,
  size = 'md',
}: {
  domain?: string | null
  providerId?: ProviderId
  label: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [failed, setFailed] = useState(false)
  const px = size === 'sm' ? 32 : size === 'lg' ? 128 : 64
  const box = size === 'sm' ? 'size-6' : size === 'lg' ? 'size-12' : 'size-9'
  const src = providerId ? getProviderIconUrl(providerId, px) : getBrandIconUrl(domain ?? null, px)
  const initial = label.trim().charAt(0).toUpperCase() || '?'

  if (!src || failed) {
    return (
      <span
        className={`grid ${box} shrink-0 place-items-center rounded-md border border-border bg-surface-2 text-xs font-bold text-text-muted`}
        aria-hidden
      >
        {initial}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt=""
      width={px}
      height={px}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`${box} shrink-0 rounded-md border border-border bg-surface object-contain p-1`}
    />
  )
}

const thumbnailRatios = {
  video: 'aspect-video',
  cover: 'aspect-[3/4]',
  square: 'aspect-square',
} as const

/** 썸네일/표지 이미지. 실패하거나 src가 없으면 타입별 플레이스홀더. */
export function Thumbnail({
  src,
  alt,
  ratio = 'video',
  icon: Icon,
  caption,
  fit = 'cover',
}: {
  src?: string | null
  alt: string
  ratio?: keyof typeof thumbnailRatios
  icon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  caption?: string
  fit?: 'cover' | 'contain'
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const showImage = src && !failed
  const imageFitClass = fit === 'contain' ? 'object-contain p-5' : 'object-cover'

  return (
    <div
      className={`relative ${thumbnailRatios[ratio]} w-full overflow-hidden rounded-md border border-border bg-surface-2 shadow-sm transition-all duration-300 ease-out`}
    >
      {/* Background radial dot pattern for visual depth */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(100,100,100,0.08)_1px,transparent_1px)] [background-size:12px_12px] opacity-60 pointer-events-none" />

      {/* Hover Sheen line effect */}
      <span className="sheen" aria-hidden />

      {showImage ? (
        <>
          {/* Pulsing skeleton loaded state */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-surface-2 via-surface-3 to-surface-2" />
          )}

          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`size-full ${imageFitClass} transition-all duration-500 ease-out ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
            }`}
          />

          {/* Premium Glass Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Central Play button indicator overlay for video ratio */}
          {ratio === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="grid size-10 place-items-center rounded-full bg-black/40 border border-white/20 text-white backdrop-blur-sm opacity-80 shadow-md transform scale-90 group-hover:scale-100 group-hover:bg-accent group-hover:border-accent/30 group-hover:opacity-100 transition-all duration-300 ease-out">
                <Play className="size-4 fill-current ml-0.5" aria-hidden />
              </span>
            </div>
          )}

          {/* Clean Glassmorphic icon tag for transparent icons (e.g. MCP logo) */}
          {fit === 'contain' && Icon ? (
            <span
              className="absolute right-2 bottom-2 grid size-6 place-items-center rounded-md border border-white/10 bg-black/40 text-white backdrop-blur-md shadow-md ring-1 ring-white/5"
              aria-hidden
            >
              <Icon className="size-3.5" aria-hidden />
            </span>
          ) : null}
        </>
      ) : (
        /* Elevated placeholder using modern tech design guidelines */
        <div className="relative size-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-surface-2 to-surface-3 text-text-subtle transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-surface-2 group-hover:to-surface">
          {/* Ambient Glow spotlight behind the icon */}
          <div className="absolute size-24 rounded-full bg-accent/5 filter blur-xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10 flex flex-col items-center gap-2 px-3 text-center">
            {Icon ? (
              <span className="grid size-11 place-items-center rounded-full border border-border bg-surface text-text-muted shadow-sm ring-4 ring-surface-2 group-hover:border-accent/30 group-hover:bg-accent/5 group-hover:text-accent group-hover:shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.12)] transition-all duration-300">
                <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" aria-hidden />
              </span>
            ) : null}
            {caption ? (
              <span className="text-[0.6875rem] font-semibold tracking-wide uppercase text-text-subtle group-hover:text-text transition-colors duration-200">
                {caption}
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export function MetadataChips({
  items,
  limit = 8,
}: {
  items: Array<{ label: string; value?: string | null }>
  limit?: number
}) {
  const visibleItems = items
    .filter((item) => Boolean(item.value && item.value.trim()))
    .slice(0, limit)

  if (!visibleItems.length) return null

  return (
    <dl className="mt-3 flex flex-wrap gap-1.5">
      {visibleItems.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-medium text-text-subtle"
        >
          <dt className="sr-only">{item.label}</dt>
          <dd>
            <span className="text-text-muted/70">{item.label}</span>{' '}
            <span className="font-semibold text-text-muted">{item.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function TextList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-text">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-5 text-text-muted">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border-strong bg-surface p-5">
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="mt-1 text-sm text-text-muted">{body}</p>
    </div>
  )
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  title: string
  description: string
  badge?: ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-surface text-accent">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-text">{title}</h2>
          {badge}
        </div>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-text-muted">{description}</p>
      </div>
    </div>
  )
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-subtle">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-bg text-accent">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-text-muted">{detail}</p>
    </article>
  )
}
