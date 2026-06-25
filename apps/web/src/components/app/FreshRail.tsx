import {
  eventScheduleItems,
  getEffectiveDate,
  getEventScheduleMetadata,
  getLearningResourceMetadata,
  isRecent,
  learningResources,
  resolveResourceImage,
  SNAPSHOT_DATE,
} from '@aidigestdesk/content'
import { BookOpen, CalendarDays, Flame, PlayCircle, FileText, ExternalLink } from 'lucide-react'

import type { ComponentType, CSSProperties } from 'react'

import { Chip, NewBadge, SectionHeader, Thumbnail } from '@/components/app/CommonUi'

/** 종류별 커버 색조 — 이미지가 없는 항목(주로 일정/세미나)도 의도적으로 보이게 한다. */
const KIND_COVER: Record<FreshItem['kind'], string> = {
  도서: 'from-accent/15 to-accent/5 text-accent',
  '강좌/영상': 'from-accent-4/15 to-accent-4/5 text-accent-4',
  '문서/글': 'from-accent-2/15 to-accent-2/5 text-accent-2',
  '일정/세미나': 'from-accent-3/15 to-accent-3/5 text-accent-3',
}

function FreshCover({ item }: { item: FreshItem }) {
  if (item.imageSrc) {
    return (
      <Thumbnail
        src={item.imageSrc}
        alt={item.title}
        ratio={item.ratio === 'cover' ? 'video' : item.ratio}
        icon={item.icon}
        caption={item.kind}
      />
    )
  }
  const Icon = item.icon
  return (
    <div
      className={`flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-md border border-border bg-gradient-to-br ${KIND_COVER[item.kind]}`}
    >
      <Icon className="size-7" aria-hidden />
      <span className="text-[0.6875rem] font-semibold tracking-wide">{item.kind}</span>
    </div>
  )
}

type FreshItem = {
  key: string
  kind: '도서' | '강좌/영상' | '문서/글' | '일정/세미나'
  title: string
  meta: string
  date: string
  url: string
  imageSrc?: string
  ratio: 'video' | 'cover' | 'square'
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  isNew: boolean
}

const RESOURCE_ICON: Record<string, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> =
  {
    도서: BookOpen,
    '강좌/영상': PlayCircle,
    '공식 문서': FileText,
    '블로그/글': FileText,
    커뮤니티: FileText,
  }

function buildItems(): FreshItem[] {
  const resourceItems: FreshItem[] = learningResources.map((resource) => {
    const date = getEffectiveDate(getLearningResourceMetadata(resource)) ?? resource.id
    const image = resolveResourceImage(resource)
    const kind =
      resource.type === '도서'
        ? '도서'
        : resource.type === '강좌/영상'
          ? '강좌/영상'
          : '문서/글'
    return {
      key: `r-${resource.id}`,
      kind,
      title: resource.title,
      meta: resource.author,
      date,
      url: resource.url,
      imageSrc: image?.src,
      ratio: image?.ratio ?? (kind === '도서' ? 'cover' : kind === '강좌/영상' ? 'video' : 'square'),
      icon: RESOURCE_ICON[resource.type] ?? FileText,
      isNew: isRecent(getEffectiveDate(getLearningResourceMetadata(resource)), 30),
    }
  })

  const eventItems: FreshItem[] = eventScheduleItems.map((event) => {
    const date = getEffectiveDate(getEventScheduleMetadata(event)) ?? event.startDate
    return {
      key: `e-${event.id}`,
      kind: '일정/세미나',
      title: event.title,
      meta: `${event.organizer} · ${event.type}`,
      date,
      url: event.url,
      ratio: 'video',
      icon: CalendarDays,
      isNew: isRecent(date, 30),
    }
  })

  return [...resourceItems, ...eventItems]
    .filter((item) => /^\d{4}-\d{2}-\d{2}/.test(item.date))
    .toSorted((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)
}

export function FreshRail() {
  const items = buildItems()
  if (!items.length) return null
  const newCount = items.filter((item) => item.isNew).length

  return (
    <section id="fresh" className="space-y-4">
      <SectionHeader
        icon={Flame}
        title="따끈따끈 · 신규 등록"
        description={`최근 등록·갱신된 신간, 동영상 강좌, 세미나를 최신순으로 모았습니다. (${SNAPSHOT_DATE} 기준)`}
        badge={newCount ? <Chip tone="coral">신규 {newCount}건</Chip> : undefined}
      />
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {items.map((item, index) => (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            style={{ '--reveal-delay': Math.min(index, 8) * 55 } as CSSProperties}
            className="reveal is-revealed group relative w-60 shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-surface transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-quart)] hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_14px_30px_-20px_color-mix(in_oklch,var(--color-ink),transparent_50%)]"
          >
            <div className="relative overflow-hidden">
              <div className="transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.06]">
                <FreshCover item={item} />
              </div>
              {item.isNew ? (
                <span className="absolute left-2 top-2">
                  <NewBadge />
                </span>
              ) : null}
            </div>
            <div className="p-3">
              <div className="flex items-center gap-1.5">
                <Chip tone="neutral" icon={item.icon}>
                  {item.kind}
                </Chip>
                <span className="ml-auto text-[0.6875rem] font-semibold text-text-subtle">
                  {item.date}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-text">{item.title}</p>
              <p className="mt-1 flex items-center gap-1 truncate text-xs text-text-muted">
                {item.meta}
                <ExternalLink
                  className="size-3 shrink-0 text-text-subtle opacity-0 transition group-hover:opacity-100"
                  aria-hidden
                />
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
