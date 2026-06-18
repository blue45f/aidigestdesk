import {
  getProviderLabel,
  getSources,
  vibeCodingCommands,
  type VibeCodingCommand,
} from '@aidigestdesk/content'
import { ChevronDown, Copy, ExternalLink, Terminal } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
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

type SurfaceFilter = VibeCodingCommand['surface'] | 'all'
type SortMode = 'fit' | 'model' | 'provider'

/** 적합도 칩 톤 매핑 — CommonUi.Chip 톤 어휘에 맞춘다. */
const fitToneMap: Record<VibeCodingCommand['vibeCodingFit'], ChipTone> = {
  '매우 높음': 'accent',
  높음: 'blue',
  보통: 'neutral',
  제한적: 'amber',
}

/** 적합도 정렬용 가중치(높을수록 앞). */
const fitOrderMap: Record<VibeCodingCommand['vibeCodingFit'], number> = {
  '매우 높음': 3,
  높음: 2,
  보통: 1,
  제한적: 0,
}

const surfaceFilters: Array<{ id: SurfaceFilter; label: string }> = [
  { id: 'all', label: '전체' },
  { id: '전용 CLI', label: '전용 CLI' },
  { id: 'IDE/에이전트', label: 'IDE/에이전트' },
  { id: 'OpenAI 호환 API', label: '호환 API' },
  { id: '공식 SDK', label: '공식 SDK' },
  { id: '서드파티 CLI', label: '서드파티 CLI' },
  { id: '웹/에이전트', label: '웹/에이전트' },
]

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: 'fit', label: '적합도순' },
  { value: 'model', label: '모델명 A→Z' },
  { value: 'provider', label: '제공사' },
]

/** 클립보드 복사. navigator.clipboard 부재 환경에서도 조용히 무시한다. */
async function copyCommand(text: string) {
  try {
    await navigator.clipboard?.writeText(text)
  } catch {
    // 클립보드 권한/지원이 없으면 무시한다.
  }
}

/** 라벨이 달린 모노스페이스 명령어 행. 카드 간 비교를 위해 일관된 형태를 유지한다. */
function CommandRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-text-subtle">{label}</span>
        <button
          type="button"
          onClick={() => void copyCommand(value)}
          title={`${label} 명령어 복사`}
          aria-label={`${label} 명령어 복사`}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[0.6875rem] font-semibold text-text-muted transition hover:border-border-strong hover:text-text"
        >
          <Copy className="size-3" aria-hidden />
          복사
        </button>
      </div>
      <code className="block overflow-x-auto rounded bg-surface-2 px-2 py-1 font-mono text-xs text-text">
        {value}
      </code>
    </div>
  )
}

function CommandCard({ command }: { command: VibeCodingCommand }) {
  const [notesOpen, setNotesOpen] = useState(false)
  const sourceUrl = getSources(command.sourceIds)[0]?.url ?? null
  const visibleNotes = notesOpen ? command.setupNotes : command.setupNotes.slice(0, 3)
  const hasMoreNotes = command.setupNotes.length > 3

  return (
    <article className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <BrandMark providerId={command.providerId} label={command.modelName} size="sm" />
        <h3 className="min-w-0 flex-1 text-sm font-bold text-text">{command.modelName}</h3>
        <Chip tone="neutral">{command.surface}</Chip>
        <Chip tone={fitToneMap[command.vibeCodingFit]}>{command.vibeCodingFit}</Chip>
      </div>

      <p className="text-sm leading-6 text-text-muted">{command.useCase}</p>

      <div className="space-y-2.5">
        <CommandRow label="설치" value={command.installCommand} />
        <CommandRow label="실행" value={command.command} />
      </div>

      {command.goal ? (
        <p className="text-xs leading-5 text-text-muted">
          <span className="font-semibold text-text-subtle">목표</span> · {command.goal}
        </p>
      ) : null}
      {command.loop ? (
        <p className="text-xs leading-5 text-text-muted">
          <span className="font-semibold text-text-subtle">작업 루프</span> · {command.loop}
        </p>
      ) : null}

      {command.setupNotes.length ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-text-subtle">셋업 포인트</p>
          <ul className="space-y-1">
            {visibleNotes.map((note) => (
              <li key={note} className="flex gap-1.5 text-xs leading-5 text-text-muted">
                <span className="mt-0.5 shrink-0 text-accent" aria-hidden>
                  ·
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
          {hasMoreNotes ? (
            <button
              type="button"
              onClick={() => setNotesOpen((open) => !open)}
              aria-expanded={notesOpen}
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition hover:text-text"
            >
              {notesOpen ? '접기' : `${command.setupNotes.length - 3}개 더 보기`}
              <ChevronDown
                className={`size-3 transition ${notesOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
          ) : null}
        </div>
      ) : null}

      {command.caveats.length ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-text-subtle">주의점</p>
          <ul className="space-y-1">
            {command.caveats.map((caveat) => (
              <li
                key={caveat}
                className="rounded border border-accent-3/30 bg-accent-3/10 px-2 py-1 text-xs leading-5 text-accent-3"
              >
                {caveat}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
        >
          출처
          <ExternalLink className="size-3" aria-hidden />
        </a>
      ) : null}
    </article>
  )
}

export function CliComparisonSection({
  commands = vibeCodingCommands,
}: {
  commands?: VibeCodingCommand[]
}) {
  const [surface, setSurface] = useState<SurfaceFilter>('all')
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('fit')

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase('ko-KR').trim()

    return commands
      .filter((command) => {
        if (surface !== 'all' && command.surface !== surface) return false
        if (!normalizedQuery) return true
        const searchable = [
          command.modelName,
          command.command,
          command.installCommand,
          command.useCase,
          ...command.setupNotes,
          ...command.caveats,
        ]
          .join(' ')
          .toLocaleLowerCase('ko-KR')
        return searchable.includes(normalizedQuery)
      })
      .toSorted((left, right) => {
        switch (sortMode) {
          case 'fit': {
            const byFit = fitOrderMap[right.vibeCodingFit] - fitOrderMap[left.vibeCodingFit]
            if (byFit !== 0) return byFit
            return left.modelName.localeCompare(right.modelName)
          }
          case 'model':
            return left.modelName.localeCompare(right.modelName)
          case 'provider':
            return (getProviderLabel(left.providerId) ?? '').localeCompare(
              getProviderLabel(right.providerId) ?? ''
            )
          default:
            return 0
        }
      })
  }, [commands, surface, sortMode, query])

  const hasActiveFilter = surface !== 'all' || query.trim() !== ''
  const resetFilters = () => {
    setSurface('all')
    setQuery('')
    setSortMode('fit')
  }

  return (
    <section id="cli-manual" className="space-y-4">
      <SectionHeader
        icon={Terminal}
        title="LLM CLI 명령어 비교·매뉴얼"
        description="모델별 CLI·에이전트의 설치·실행 명령어와 바이브 코딩 적합도를 나란히 비교하고, 셋업·운영 주의점을 함께 확인합니다."
        badge={<Chip tone="accent">{commands.length}개</Chip>}
      />

      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1.6fr_1fr_10rem]">
        <SegmentBar label="실행 표면" items={surfaceFilters} value={surface} onChange={setSurface} />
        <SearchField
          label="명령어 검색"
          value={query}
          onChange={setQuery}
          placeholder="claude, codex, 설치, 리뷰"
        />
        <SortSelect label="정렬" value={sortMode} onChange={setSortMode} options={sortOptions} />
      </div>

      <ResultSummary
        shown={filteredCommands.length}
        total={commands.length}
        onReset={resetFilters}
        resetDisabled={!hasActiveFilter && sortMode === 'fit'}
      />

      {filteredCommands.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCommands.map((command) => (
            <CommandCard key={command.id} command={command} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 CLI 명령어가 없습니다"
          body="실행 표면을 전체로 바꾸거나 검색어를 줄이면 명령어가 다시 표시됩니다."
        />
      )}
    </section>
  )
}
