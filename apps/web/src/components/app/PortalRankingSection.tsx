import {
  benchmarkEntries,
  agentExtensions,
  getExtensionRankGrade,
  getProviderLabel,
  type ProviderId,
} from '@aidigestdesk/content'
import { Medal, Trophy, Puzzle, ArrowRight } from 'lucide-react'
import { useMemo } from 'react'

import type { AppRoute } from '@/components/app/appRoutes'

import { BrandMark, Chip, type ChipTone } from '@/components/app/CommonUi'

const gradeTones = {
  S: 'accent',
  A: 'blue',
  B: 'amber',
  C: 'neutral',
  미분류: 'neutral',
} as const satisfies Record<string, ChipTone>

function parseRankValue(rankLabel: string) {
  const hashMatch = rankLabel.match(/#\s*(\d+(?:\.\d+)?)/)
  if (hashMatch) return Number(hashMatch[1])
  const topMatch = rankLabel.match(/Top\s*(\d+(?:\.\d+)?)/i)
  if (topMatch) return Number(topMatch[1])
  const plainMatch = rankLabel.match(/(\d+(?:\.\d+)?)/)
  return plainMatch ? Number(plainMatch[1]) : null
}

export function PortalRankingSection({
  onNavigate,
}: {
  onNavigate: (route: AppRoute) => void
}) {
  // Top 5 LLM rankings based on overall domain benchmarks
  const topLLMs = useMemo(() => {
    return benchmarkEntries
      .filter((e) => e.domain === 'overall')
      .sort((a, b) => {
        const rankA = parseRankValue(a.rankLabel) ?? 999
        const rankB = parseRankValue(b.rankLabel) ?? 999
        return rankA - rankB
      })
      .slice(0, 5)
  }, [])

  // Top 5 Agent extensions (skills, hooks, etc.) based on editor rank
  const topExtensions = useMemo(() => {
    return agentExtensions
      .filter((e) => typeof e.rank === 'number')
      .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
      .slice(0, 5)
  }, [])

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      {/* LLM Rankings Panel */}
      <article className="flex flex-col rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-accent/10 text-accent">
              <Trophy className="size-4.5" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-text">LLM 종합 지능 랭킹</h2>
              <p className="text-[0.6875rem] text-text-subtle">
                종합 벤치마크 및 지능 테스트 지표 기준 Top 5
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('models')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition hover:text-accent/80"
          >
            전체 보기
            <ArrowRight className="size-3" aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-2">
          {topLLMs.map((llm, idx) => (
            <div
              key={llm.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-bg/50 px-3 py-2.5 hover:bg-bg/85 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 text-sm font-bold text-text-subtle text-center">
                  {idx + 1}
                </span>
                <BrandMark providerId={llm.providerId as ProviderId} label={llm.modelName} size="sm" />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-text truncate">
                    {llm.modelName}
                  </h3>
                  <p className="text-[0.6875rem] text-text-subtle truncate">
                    {getProviderLabel(llm.providerId as ProviderId)} · {llm.metric}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-text">{llm.score}점</span>
                <span className="block text-[0.6875rem] text-text-subtle">{llm.context} 컨텍스트</span>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Agent Extensions Rankings Panel */}
      <article className="flex flex-col rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-blue-500/10 text-blue-500">
              <Puzzle className="size-4.5" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-text">에이전트 확장 (스킬/훅) 랭킹</h2>
              <p className="text-[0.6875rem] text-text-subtle">
                편집자 추천도 및 활용성 기준 Top 5
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onNavigate('tools')
              window.location.hash = '#extensions'
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition hover:text-accent/80"
          >
            전체 보기
            <ArrowRight className="size-3" aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-2">
          {topExtensions.map((ext, idx) => {
            const grade = getExtensionRankGrade(ext)
            return (
              <div
                key={ext.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-bg/50 px-3 py-2.5 hover:bg-bg/85 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 text-sm font-bold text-text-subtle text-center">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-semibold text-text truncate">
                        {ext.name}
                      </h3>
                      <span className="text-[0.6875rem] text-text-subtle font-medium">
                        ({ext.platform})
                      </span>
                    </div>
                    <p className="text-[0.6875rem] text-text-muted truncate mt-0.5">
                      {ext.summary}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Chip tone={gradeTones[grade]} icon={Medal}>
                    {grade} 등급
                  </Chip>
                  <span className="text-[0.6875rem] text-text-subtle">{ext.kind}</span>
                </div>
              </div>
            )
          })}
        </div>
      </article>
    </section>
  )
}
