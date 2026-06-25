import { getCatalogStats, SNAPSHOT_DATE } from '@aidigestdesk/content'
import { ArrowRight, BadgePercent, Sparkles, Table2 } from 'lucide-react'

import type { AppRoute } from '@/components/app/appRoutes'

import { AnimatedTitle } from '@/components/app/AnimatedTitle'
import { CountUp } from '@/components/app/Motion'

const stats = getCatalogStats()

const inlineStats: Array<{ label: string; value: number }> = [
  { label: '제공사', value: stats.providers },
  { label: '업데이트', value: stats.updates },
  { label: '벤치마크', value: stats.benchmarkRows },
  { label: '출처', value: stats.sources },
]

/**
 * 포털 홈 인사 영역. 마케팅 히어로가 아니라 "오늘 무엇을 보면 되나"를
 * 한 문장으로 안내하는 친근한 머리글이다. 숫자는 한 줄로 모아 노이즈를 줄였다.
 */
export function PortalHero({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  return (
    <section
      aria-labelledby="portal-hero-title"
      className="reveal is-revealed relative overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2),var(--color-accent-3))]"
      />

      <div className="relative space-y-4 p-5 sm:p-7">
        <p className="flex items-center gap-2 text-xs font-semibold text-text-muted">
          <span className="live-dot" aria-hidden />
          {SNAPSHOT_DATE} 기준 · 실시간 큐레이션
        </p>

        <div className="space-y-2.5">
          <h1
            id="portal-hero-title"
            className="text-[1.75rem] font-bold leading-tight tracking-tight text-text text-balance sm:text-[2.5rem]"
          >
            <AnimatedTitle>오늘의 AI, 한눈에</AnimatedTitle>
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-text-muted text-pretty sm:text-base">
            GPT·Claude·Gemini·Grok·Manus의 최신 소식과 분야별 순위를 한국어로 쉽게 정리했어요. 모든
            항목은 날짜와 출처로 확인됩니다.
          </p>
        </div>

        <div className="grid gap-2.5 sm:flex sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => onNavigate('models')}
            className="group/cta inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-ink bg-ink px-5 text-sm font-semibold text-ink-fg transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_color-mix(in_oklch,var(--color-accent),transparent_45%)] active:translate-y-0"
          >
            <Table2 className="size-4" aria-hidden />
            분야별 랭킹 보기
            <ArrowRight
              className="size-4 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover/cta:translate-x-0.5"
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-bg px-4 text-sm font-semibold text-text-muted transition-colors duration-200 hover:border-border-strong hover:text-text"
          >
            <Sparkles className="size-4 text-accent" aria-hidden />
            처음이신가요? 사용 가이드
          </button>
        </div>

        {/* 규모 신호 — 한 줄로 모아 노이즈를 줄인다. (dl은 dt/dd만 — 버튼은 형제로 분리) */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {inlineStats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <dt className="text-xs text-text-subtle">{stat.label}</dt>
                <dd className="text-base font-bold tabular-nums text-text">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={() => onNavigate('deals')}
            className="group ml-auto inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            <BadgePercent className="size-3.5" aria-hidden />
            할인·혜택 {stats.deals}건
            <ArrowRight
              className="size-3.5 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5"
              aria-hidden
            />
          </button>
        </div>
      </div>
    </section>
  )
}
