import { type ProviderId } from '@aidigestdesk/content'
import { cliToolManuals, getCliManualBySlug, type CliToolManual } from '@aidigestdesk/content/cliManuals'
import { copyText } from '@aidigestdesk/content/shared'
import {
  BookOpen,
  Check,
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  Lightbulb,
  Sparkles,
  TerminalSquare,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { BrandMark, SearchField, SortChip, type SortDirection } from '@/components/app/CommonUi'

type CmdSort = 'default' | 'command' | 'category'

/** 코드/명령 블록 — 우상단 복사 버튼(복사 시 ✓ 피드백). */
function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    if (await copyText(children)) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1300)
    }
  }
  return (
    <div className="relative">
      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-bg py-2.5 pl-3 pr-10 text-[0.8125rem] leading-6 text-text">
        <code className="font-mono">{children}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? '복사됨' : '코드 복사'}
        title={copied ? '복사됨' : '코드 복사'}
        className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-md border border-border bg-surface text-text-muted transition hover:border-border-strong hover:text-text"
      >
        {copied ? (
          <Check className="size-3.5 text-accent-2" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </button>
    </div>
  )
}

function ManualDetail({ manual }: { manual: CliToolManual }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('전체')
  const [sort, setSort] = useState<CmdSort>('default')
  const [dir, setDir] = useState<SortDirection>('asc')

  const categories = useMemo(() => {
    const seen: string[] = []
    for (const c of manual.commands) if (c.category && !seen.includes(c.category)) seen.push(c.category)
    return ['전체', ...seen]
  }, [manual])

  const commands = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = manual.commands.filter((c) => {
      const okCat = category === '전체' || c.category === category
      const okQ =
        !q ||
        [c.command, c.description, c.example, c.category].filter(Boolean).join(' ').toLowerCase().includes(q)
      return okCat && okQ
    })
    if (sort === 'default') return base
    const mul = dir === 'asc' ? 1 : -1
    return base.toSorted((a, b) => {
      if (sort === 'command') return a.command.localeCompare(b.command) * mul
      // category: 카테고리 → 명령 순
      const c = a.category.localeCompare(b.category) * mul
      return c !== 0 ? c : a.command.localeCompare(b.command)
    })
  }, [manual, query, category, sort, dir])

  const toggleSort = (next: CmdSort) => {
    if (next === sort) setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSort(next)
      setDir('asc')
    }
  }

  return (
    <div className="space-y-5">
      {/* 도구 한 줄 소개(tagline) — 데이터에 있는 부제를 노출 */}
      {manual.tagline ? (
        <p className="text-sm font-semibold text-text">{manual.tagline}</p>
      ) : null}
      {/* 개요 */}
      {manual.overview ? (
        <p className="text-sm leading-6 text-text-muted">{manual.overview}</p>
      ) : null}

      {/* 설치 · 인증 */}
      <div className="grid gap-3 md:grid-cols-2">
        {manual.install ? (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold text-text">
              <Download className="size-4 text-accent" aria-hidden />
              설치
            </h4>
            <CodeBlock>{manual.install}</CodeBlock>
          </div>
        ) : null}
        {manual.auth ? (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold text-text">
              <KeyRound className="size-4 text-accent" aria-hidden />
              인증 · 로그인
            </h4>
            <CodeBlock>{manual.auth}</CodeBlock>
          </div>
        ) : null}
      </div>

      {/* 명령어 표 — 검색 · 카테고리 필터 · 정렬 */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-text">
          <TerminalSquare className="size-4 text-accent" aria-hidden />
          명령어 · 옵션 <span className="text-xs font-normal text-text-subtle">{manual.commands.length}개</span>
        </h4>

        <SearchField label="명령 검색" value={query} onChange={setQuery} placeholder="명령·설명 검색" />

        <div className="touch-scroll -mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1">
          {categories.map((c) => {
            const active = category === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className={
                  active
                    ? 'inline-flex min-h-8 shrink-0 snap-start items-center rounded-full border border-accent bg-accent/12 px-3 py-1 text-xs font-semibold text-accent-text'
                    : 'inline-flex min-h-8 shrink-0 snap-start items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
                }
              >
                {c}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="text-xs font-semibold text-text-subtle">정렬</span>
          <SortChip
            label="기본순"
            active={sort === 'default'}
            direction={dir}
            onToggle={() => toggleSort('default')}
          />
          <SortChip
            label="명령순"
            active={sort === 'command'}
            direction={dir}
            onToggle={() => toggleSort('command')}
          />
          <SortChip
            label="카테고리순"
            active={sort === 'category'}
            direction={dir}
            onToggle={() => toggleSort('category')}
          />
        </div>

        <ul className="space-y-2">
          {commands.map((c, i) => (
            <li
              key={`${c.command}-${i}`}
              className="rounded-xl border border-border bg-surface px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-[0.8125rem] font-semibold text-accent-text">
                  {c.command}
                </code>
                <span className="rounded border border-border bg-bg px-1.5 py-px text-[0.625rem] font-medium text-text-subtle">
                  {c.category}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-text-muted">{c.description}</p>
              {c.example ? (
                <code className="mt-1.5 block overflow-x-auto whitespace-pre-wrap break-words rounded bg-bg px-2 py-1.5 font-mono text-xs text-text-subtle">
                  {c.example}
                </code>
              ) : null}
            </li>
          ))}
          {commands.length === 0 ? (
            <li className="rounded-xl border border-dashed border-border px-3 py-8 text-center text-sm text-text-subtle">
              ‘{query || category}’에 해당하는 명령이 없어요.
            </li>
          ) : null}
        </ul>
      </div>

      {/* 핵심 기능 */}
      {manual.features.length ? (
        <div className="space-y-3">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-text">
            <Sparkles className="size-4 text-accent" aria-hidden />
            핵심 기능
          </h4>
          <div className="grid gap-2.5 md:grid-cols-2">
            {manual.features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-surface p-3">
                <p className="text-sm font-semibold text-text">{f.title}</p>
                <p className="mt-1 text-[0.8125rem] leading-6 text-text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 실전 팁 */}
      {manual.tips.length ? (
        <div className="space-y-2.5">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-text">
            <Lightbulb className="size-4 text-accent" aria-hidden />
            실전 팁
          </h4>
          <ul className="space-y-1.5">
            {manual.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm leading-6 text-text-muted">
                <span className="mt-0.5 shrink-0 font-bold text-accent" aria-hidden>
                  ✓
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* 출처 */}
      {manual.sourceUrls.length ? (
        <div className="flex flex-wrap gap-2 border-t border-border pt-3">
          {manual.sourceUrls.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] text-text-subtle transition hover:border-border-strong hover:text-text"
            >
              <ExternalLink className="size-3" aria-hidden />
              {new URL(url).hostname.replace(/^www\./, '')}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * AI 코딩 CLI 매뉴얼 — 도구를 고르면 설치·인증·명령어(정렬/검색)·기능·팁을 한 화면에서 본다.
 * 모바일 우선 카드 레이아웃, 명령어는 항목별 정렬·카테고리 필터·검색 지원.
 */
export function CliManualSection({ id }: { id?: string }) {
  const [slug, setSlug] = useState(cliToolManuals[0]?.slug ?? '')
  const manual = getCliManualBySlug(slug) ?? cliToolManuals[0]
  if (!manual) return null

  return (
    <section id={id} className="scroll-mt-32 space-y-4 rounded-2xl border border-border bg-surface/60 p-4 sm:p-5">
      <header className="space-y-1">
        <h2 className="flex items-center gap-2 text-lg font-bold text-text">
          <BookOpen className="size-5 text-accent" aria-hidden />
          AI 코딩 CLI 매뉴얼
        </h2>
        <p className="text-sm text-text-muted">
          도구를 고르면 설치·인증·명령어·핵심 기능·실전 팁을 한국어로 정리해 보여드려요.
        </p>
      </header>

      {/* 도구 선택 */}
      <div className="touch-scroll -mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1">
        {cliToolManuals.map((m) => {
          const active = m.slug === slug
          return (
            <button
              key={m.slug}
              type="button"
              onClick={() => setSlug(m.slug)}
              aria-pressed={active}
              className={
                active
                  ? 'inline-flex min-h-9 shrink-0 snap-start items-center gap-1.5 rounded-full border border-accent bg-accent/12 px-3 py-1.5 text-xs font-semibold text-accent-text'
                  : 'inline-flex min-h-9 shrink-0 snap-start items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
              }
            >
              {m.providerId ? (
                <BrandMark providerId={m.providerId as ProviderId} label={m.platform} size="sm" />
              ) : null}
              {m.platform}
            </button>
          )
        })}
      </div>

      <ManualDetail manual={manual} />
    </section>
  )
}
