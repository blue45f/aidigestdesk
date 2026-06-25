import {
  aiCodingTools,
  getExtensionStats,
  learningResources,
  llmCliManuals,
  manualGuides,
  modelProfiles,
  personaGuides,
  providerCatalog,
  searchCatalog,
  SNAPSHOT_DATE,
  sources,
  taskRecommendations,
  vibeCodingCommands,
  type ProviderId,
} from '@aidigestdesk/content'
import {
  BadgePercent,
  BarChart3,
  BookOpen,
  Boxes,
  ChevronRight,
  Code2,
  Cpu,
  FileText,
  MessagesSquare,
  RotateCcw,
  Share2,
  Sparkles,
  Table2,
  Trophy,
  Workflow,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { CSSProperties } from 'react'

import { AboutRoute } from '@/components/app/AboutRoute'
import { AccountRoute } from '@/components/app/AccountRoute'
import { AdminRoute } from '@/components/app/AdminRoute'
import {
  getInitialAdminSession,
  saveAdminSession,
  type AdminSession,
} from '@/components/app/adminSession'
import {
  CodingToolDirectorySection,
  TaskRecommendationSection,
  VibeCodingSection,
} from '@/components/app/AiCodingSections'
import { getCurrentRoute, routePath, routeTitles, type AppRoute } from '@/components/app/appRoutes'
import { Header, Sidebar } from '@/components/app/AppShell'
import { BookmarksRail } from '@/components/app/BookmarksRail'
import { CliComparisonSection, LlmCliManualSection } from '@/components/app/CliComparisonSection'
import { CliManualSection } from '@/components/app/CliManualSection'
import { ActiveFilterChips, MultiSegmentBar } from '@/components/app/CommonUi'
import { CommunityRoute } from '@/components/app/CommunityRoute'
import { EventCostComparisonSection, ModelCostCalculator } from '@/components/app/CostSections'
import { DealsSection } from '@/components/app/DealsSection'
import { DesignRoute } from '@/components/app/DesignRoute'
import { ExtensionsSection } from '@/components/app/ExtensionsSection'
import { FreshRail } from '@/components/app/FreshRail'
import { GlossarySection } from '@/components/app/GlossarySection'
import {
  DesignWorkflowSection,
  ManualGuides,
  PersonaPlaybooks,
} from '@/components/app/LearningWorkflowSections'
import { getInitialMemberSession, logOut, type MemberSession } from '@/components/app/memberAuth'
import {
  BenchmarkBoard,
  ComparisonMatrix,
  LocalModelComparison,
  ModelCards,
  ModelDetail,
} from '@/components/app/ModelBenchmarkSections'
import { Reveal } from '@/components/app/Motion'
import { PortalHero } from '@/components/app/PortalHero'
import {
  Briefing,
  EventPromotionsSection,
  WebzineSection,
} from '@/components/app/PortalNewsSections'
import { RankingBoard } from '@/components/app/RankingBoard'
import { ResourceLibrary } from '@/components/app/ResourceLibrary'
import { SitemapRoute } from '@/components/app/SitemapRoute'
import { SourcesSection } from '@/components/app/SourcesSection'
import { SupportRoute } from '@/components/app/SupportRoute'
import { TermsRoute } from '@/components/app/TermsRoute'
import { TranslatedNewsSection } from '@/components/app/TranslatedNewsSection'
import { IntroSplashScreen } from '@/components/layout/IntroSplashScreen'
import { RouteAnnouncer } from '@/components/layout/RouteAnnouncer'
import { SkipLink } from '@/components/layout/SkipLink'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useSearchHotkey } from '@/hooks/useSearchHotkey'
import { shareOrCopy } from '@/lib/share'
import { useToast } from '@/lib/toast'

const providerFilters: Array<{ id: ProviderId | 'all'; label: string }> = [
  { id: 'all', label: '전체' },
  ...providerCatalog.map((provider) => ({
    id: provider.id,
    label: provider.shortLabel,
  })),
]

type ContentRoute = 'portal' | 'models' | 'tools' | 'deals' | 'resources'

const routeMeta: Record<ContentRoute, { eyebrow: string; title: string; description: string }> = {
  portal: {
    eyebrow: '홈 · /',
    title: '오늘의 AI 다이제스트',
    description: '최신 브리핑과 새로 등록된 정보를 먼저 확인하고, 필요한 섹션으로 이동하세요.',
  },
  models: {
    eyebrow: '모델 · /models',
    title: '모델·벤치마크·비용',
    description: '제공사별 모델 스펙, 분야별 벤치마크, 비교표, 토큰 비용을 한 화면에서 비교합니다.',
  },
  tools: {
    eyebrow: '도구 · /tools',
    title: 'AI 도구·확장·CLI',
    description:
      '작업별 추천, IDE·CLI 도구, 플러그인·훅·스킬·MCP 확장, LLM CLI 매뉴얼을 영역별로 전환해 필요한 정보만 확인합니다.',
  },
  deals: {
    eyebrow: '할인 · /deals',
    title: 'LLM 할인·혜택과 일정',
    description:
      '학생/교육, 무료 크레딧, API 가격 인하, 국내 혜택과 해커톤·컨퍼런스 일정을 추적합니다.',
  },
  resources: {
    eyebrow: '자료 · /resources',
    title: '강좌·자료·용어·해외 소식',
    description:
      '한국어 강좌·도서·블로그·사용법, AI/LLM 용어 사전, 해외 소식 번역, 직군별 플레이북과 출처를 세밀하게 탐색합니다.',
  },
}

const exploreCards: Array<{
  route: AppRoute
  title: string
  description: string
  icon: typeof Table2
}> = [
  {
    route: 'models',
    title: '모델·벤치마크·비용',
    description: '제공사별 스펙·점수·토큰 단가 비교',
    icon: Table2,
  },
  {
    route: 'tools',
    title: 'AI 도구·확장',
    description: 'IDE·CLI·플러그인·훅·스킬·MCP 디렉터리',
    icon: Boxes,
  },
  {
    route: 'deals',
    title: 'LLM 할인·혜택',
    description: '학생·크레딧·가격 인하·국내 우선',
    icon: BadgePercent,
  },
  {
    route: 'resources',
    title: '강좌·자료',
    description: '한국어 강좌·도서·블로그·사용법',
    icon: BookOpen,
  },
  {
    route: 'community',
    title: '커뮤니티',
    description: '토론 채팅방 · 닉네임 참여',
    icon: MessagesSquare,
  },
]

function PageHeader({ route }: { route: ContentRoute }) {
  const meta = routeMeta[route]
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs font-semibold text-accent">{meta.eyebrow}</p>
      <h1 className="mt-1 text-2xl font-semibold text-text">{meta.title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">{meta.description}</p>
    </section>
  )
}

function ExploreGrid({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-text">둘러보기</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {exploreCards.map((card, index) => (
          <button
            key={card.route}
            type="button"
            onClick={() => onNavigate(card.route)}
            style={{ '--reveal-delay': index * 60 } as CSSProperties}
            className="reveal is-revealed group relative flex items-start gap-3 overflow-hidden rounded-lg border border-border bg-surface p-4 text-left transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_12px_28px_-18px_color-mix(in_oklch,var(--color-ink),transparent_55%)]"
          >
            <span className="sheen" aria-hidden />
            <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-bg text-accent transition-colors duration-200 group-hover:border-accent/40 group-hover:bg-accent/10">
              <card.icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-sm font-semibold text-text">
                {card.title}
                <ChevronRight
                  className="size-3.5 -translate-x-1 text-text-subtle opacity-0 transition-all duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100"
                  aria-hidden
                />
              </span>
              <span className="mt-1 block text-xs leading-5 text-text-muted">
                {card.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export type ModelsTabId = 'rankings' | 'compare' | 'local' | 'benchmarks' | 'matrix' | 'cost'

const modelsTabMeta: Array<{
  id: ModelsTabId
  title: string
  description: string
  icon: typeof Boxes
}> = [
  {
    id: 'rankings',
    title: '분야별 랭킹',
    description: '분야별 1위부터 한눈에',
    icon: Trophy,
  },
  {
    id: 'compare',
    title: '주요 모델 비교',
    description: '상용 모델 스펙 및 요약',
    icon: Boxes,
  },
  {
    id: 'local',
    title: '설치형 로컬 모델',
    description: '오픈소스 서빙 및 프론트엔드',
    icon: Cpu,
  },
  {
    id: 'benchmarks',
    title: '벤치마크 보드',
    description: 'Leaderboard 및 분야별 지표',
    icon: BarChart3,
  },
  {
    id: 'matrix',
    title: '기능 비교표',
    description: '상용 모델 기능 축 비교',
    icon: Table2,
  },
  {
    id: 'cost',
    title: '비용 계산기',
    description: '토큰 비용 계산 및 할인 일정',
    icon: BadgePercent,
  },
]

function ModelsTabSwitcher({
  activeTab,
  onSelect,
}: {
  activeTab: ModelsTabId
  onSelect: (tabId: ModelsTabId) => void
}) {
  return (
    <section className="scroll-mt-32 space-y-3">
      <div className="touch-scroll -mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-6">
        {modelsTabMeta.map((tab) => {
          const Icon = tab.icon
          const active = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              aria-pressed={active}
              className={
                active
                  ? 'flex min-h-20 w-[14.5rem] shrink-0 snap-start items-start gap-3 rounded-lg border border-ink bg-ink p-3 text-left text-ink-fg sm:w-auto'
                  : 'flex min-h-20 w-[14.5rem] shrink-0 snap-start items-start gap-3 rounded-lg border border-border bg-surface p-3 text-left text-text-muted transition hover:border-border-strong hover:text-text sm:w-auto'
              }
            >
              <span
                className={
                  active
                    ? 'grid size-9 shrink-0 place-items-center rounded-md border border-white/20 bg-white/10'
                    : 'grid size-9 shrink-0 place-items-center rounded-md border border-border bg-bg text-accent'
                }
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{tab.title}</span>
                <span
                  className={
                    active
                      ? 'mt-1 block text-xs text-white/70'
                      : 'mt-1 block text-xs text-text-subtle'
                  }
                >
                  {tab.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

const toolsPaneIds = [
  'task-recommendations',
  'ai-tools',
  'extensions',
  'cli-manual',
  'vibe-coding',
  'cli-comparison',
  'design',
] as const

type ToolsPaneId = (typeof toolsPaneIds)[number]

const defaultToolsPane: ToolsPaneId = 'task-recommendations'

const toolsPaneMeta: Array<{
  id: ToolsPaneId
  title: string
  description: string
  icon: typeof Table2
}> = [
  {
    id: 'task-recommendations',
    title: '작업 추천',
    description: '업무별 모델·명령 조합',
    icon: Sparkles,
  },
  {
    id: 'ai-tools',
    title: 'AI 도구',
    description: 'IDE·CLI·PR 리뷰·에이전트',
    icon: Boxes,
  },
  {
    id: 'extensions',
    title: '확장 디렉터리',
    description: '플러그인·하네스·위젯·스킬',
    icon: Workflow,
  },
  {
    id: 'cli-manual',
    title: 'CLI 매뉴얼',
    description: '설치·운영·보안 절차',
    icon: FileText,
  },
  {
    id: 'vibe-coding',
    title: 'CLI 명령어',
    description: '실행 명령과 사용 조건',
    icon: Code2,
  },
  {
    id: 'cli-comparison',
    title: 'CLI 비교표',
    description: '표면·강점·주의점 비교',
    icon: Table2,
  },
  {
    id: 'design',
    title: '디자인 워크플로',
    description: '프롬프트·산출물 제작 흐름',
    icon: Workflow,
  },
]

function getToolsPaneFromHash(): ToolsPaneId {
  if (typeof window === 'undefined') return defaultToolsPane
  const hashId = window.location.hash.replace(/^#/, '')
  return toolsPaneIds.includes(hashId as ToolsPaneId) ? (hashId as ToolsPaneId) : defaultToolsPane
}

function getModelsTabFromHash(): ModelsTabId {
  if (typeof window === 'undefined') return 'rankings'
  const hash = window.location.hash.replace(/^#/, '')
  if (hash === 'rankings') return 'rankings'
  if (hash === 'local-models') return 'local'
  if (hash === 'benchmarks') return 'benchmarks'
  if (hash === 'matrix') return 'matrix'
  if (hash === 'cost-calculator' || hash === 'calculator') return 'cost'
  if (hash === 'comparison') return 'compare'
  return 'rankings'
}

function ToolsPaneSwitcher({
  activePane,
  counts,
  onSelect,
  onShare,
}: {
  activePane: ToolsPaneId
  counts: Record<ToolsPaneId, number>
  onSelect: (paneId: ToolsPaneId) => void
  onShare: () => void
}) {
  const activeMeta = toolsPaneMeta.find((pane) => pane.id === activePane)
  return (
    <section id="tools-workbench" className="scroll-mt-32 space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
            도구 워크벤치
          </p>
          <h2 className="mt-1 text-lg font-semibold text-text">필요한 영역만 열어 보기</h2>
        </div>
        <button
          type="button"
          onClick={onShare}
          title={`${activeMeta?.title ?? '현재 도구'} 링크 공유`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text"
        >
          <Share2 className="size-3.5" aria-hidden />이 도구 공유
        </button>
      </div>
      <div className="touch-scroll -mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
        {toolsPaneMeta.map((pane) => {
          const Icon = pane.icon
          const active = pane.id === activePane

          return (
            <button
              key={pane.id}
              type="button"
              onClick={() => onSelect(pane.id)}
              aria-pressed={active}
              className={
                active
                  ? 'flex min-h-24 w-[16.5rem] shrink-0 snap-start items-start gap-3 rounded-lg border border-ink bg-ink p-3 text-left text-ink-fg sm:w-auto'
                  : 'flex min-h-24 w-[16.5rem] shrink-0 snap-start items-start gap-3 rounded-lg border border-border bg-surface p-3 text-left text-text-muted transition hover:border-border-strong hover:text-text sm:w-auto'
              }
            >
              <span
                className={
                  active
                    ? 'grid size-9 shrink-0 place-items-center rounded-md border border-white/20 bg-white/10'
                    : 'grid size-9 shrink-0 place-items-center rounded-md border border-border bg-bg text-accent'
                }
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                  {pane.title}
                  <span
                    className={
                      active
                        ? 'rounded border border-white/20 px-1.5 py-px text-[0.6875rem] text-white/80'
                        : 'rounded border border-border bg-bg px-1.5 py-px text-[0.6875rem] text-text-subtle'
                    }
                  >
                    {counts[pane.id]}개
                  </span>
                </span>
                <span
                  className={active ? 'mt-1 block text-xs text-white/70' : 'mt-1 block text-xs'}
                >
                  {pane.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [providers, setProviders] = useState<ProviderId[]>([])
  const [selectedModelId, setSelectedModelId] = useState(modelProfiles[0]?.id ?? '')
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute)
  const [adminSession, setAdminSession] = useState<AdminSession | null>(getInitialAdminSession)
  const [memberSession, setMemberSession] = useState<MemberSession | null>(getInitialMemberSession)
  const { dark, toggle: toggleDark } = useColorScheme()
  const [toolsPane, setToolsPane] = useState<ToolsPaneId>(getToolsPaneFromHash)
  const [modelsTab, setModelsTab] = useState<ModelsTabId>(getModelsTabFromHash)
  const toast = useToast()

  useDocumentTitle(routeTitles[route])

  const clearSearch = useCallback(() => setQuery(''), [])
  useSearchHotkey(clearSearch)

  useEffect(() => {
    const syncRoute = () => {
      const nextRoute = getCurrentRoute()
      setRoute(nextRoute)
      if (nextRoute === 'tools') setToolsPane(getToolsPaneFromHash())
      if (nextRoute === 'models') setModelsTab(getModelsTabFromHash())
    }
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  useEffect(() => {
    const syncHash = () => {
      const r = getCurrentRoute()
      if (r === 'tools') setToolsPane(getToolsPaneFromHash())
      if (r === 'models') setModelsTab(getModelsTabFromHash())
    }
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useEffect(() => {
    if (route === 'tools') {
      if (window.location.hash !== `#${toolsPane}`) return
      window.requestAnimationFrame(() => {
        document.getElementById(toolsPane)?.scrollIntoView({ block: 'start' })
      })
    } else if (route === 'models') {
      let hash = ''
      if (modelsTab === 'rankings') hash = 'rankings'
      else if (modelsTab === 'compare') hash = 'comparison'
      else if (modelsTab === 'local') hash = 'local-models'
      else if (modelsTab === 'benchmarks') hash = 'benchmarks'
      else if (modelsTab === 'matrix') hash = 'matrix'
      else if (modelsTab === 'cost') hash = 'cost-calculator'

      if (window.location.hash !== `#${hash}`) return
      window.requestAnimationFrame(() => {
        document
          .getElementById(modelsTab === 'cost' ? 'cost-calculator' : hash)
          ?.scrollIntoView({ block: 'start' })
      })
    }
  }, [route, toolsPane, modelsTab])

  const navigateToRoute = (nextRoute: AppRoute) => {
    const nextPath = routePath[nextRoute]
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath)
    }
    if (nextRoute === 'tools') setToolsPane(getToolsPaneFromHash())
    if (nextRoute === 'models') setModelsTab(getModelsTabFromHash())
    setRoute(nextRoute)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAdminLogin = (session: AdminSession) => {
    saveAdminSession(session)
    setAdminSession(session)
  }
  const handleAdminLogout = () => {
    saveAdminSession(null)
    setAdminSession(null)
  }
  const handleMemberLogout = () => {
    logOut()
    setMemberSession(null)
  }

  const results = useMemo(() => searchCatalog(query, providers, []), [query, providers])
  const hasActiveFilter = query.trim() !== '' || providers.length > 0

  const visibleModels =
    results.models.length > 0 ? results.models : hasActiveFilter ? [] : modelProfiles
  const selectedModel =
    visibleModels.find((model) => model.id === selectedModelId) ?? visibleModels[0] ?? null
  const visibleGuides =
    results.manuals.length > 0 ? results.manuals : hasActiveFilter ? [] : manualGuides
  const visiblePersonaGuides =
    results.personaGuides.length > 0 ? results.personaGuides : hasActiveFilter ? [] : personaGuides
  const visibleResources =
    results.resources.length > 0 ? results.resources : hasActiveFilter ? [] : learningResources
  const visibleVibeCommands =
    results.vibeCodingCommands.length > 0
      ? results.vibeCodingCommands
      : hasActiveFilter
        ? []
        : vibeCodingCommands
  const visibleLlmCliManuals =
    results.llmCliManuals.length > 0 ? results.llmCliManuals : hasActiveFilter ? [] : llmCliManuals
  const visibleAiCodingTools =
    results.aiCodingTools.length > 0 ? results.aiCodingTools : hasActiveFilter ? [] : aiCodingTools
  const visibleTaskRecommendations =
    results.taskRecommendations.length > 0
      ? results.taskRecommendations
      : hasActiveFilter
        ? []
        : taskRecommendations
  const visibleSources =
    results.sources.length > 0 ? results.sources : hasActiveFilter ? [] : sources

  const activeChips = [
    ...(query.trim()
      ? [{ key: 'q', label: `검색: ${query.trim()}`, onRemove: () => setQuery('') }]
      : []),
    ...providers.map((providerId) => ({
      key: `p-${providerId}`,
      label: providerFilters.find((filter) => filter.id === providerId)?.label ?? providerId,
      onRemove: () => setProviders((prev) => prev.filter((value) => value !== providerId)),
    })),
  ]
  const clearFilters = () => {
    setQuery('')
    setProviders([])
  }

  const selectToolsPane = (paneId: ToolsPaneId) => {
    setToolsPane(paneId)
    const nextUrl = `${routePath.tools}#${paneId}`
    if (window.location.pathname !== routePath.tools || window.location.hash !== `#${paneId}`) {
      window.history.pushState(null, '', nextUrl)
    }
    window.requestAnimationFrame(() => {
      document.getElementById('tools-workbench')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const selectModelsTab = (tabId: ModelsTabId) => {
    setModelsTab(tabId)
    let hash = ''
    if (tabId === 'rankings') hash = 'rankings'
    else if (tabId === 'compare') hash = 'comparison'
    else if (tabId === 'local') hash = 'local-models'
    else if (tabId === 'benchmarks') hash = 'benchmarks'
    else if (tabId === 'matrix') hash = 'matrix'
    else if (tabId === 'cost') hash = 'cost-calculator'

    const nextUrl = `${routePath.models}#${hash}`
    if (window.location.pathname !== routePath.models || window.location.hash !== `#${hash}`) {
      window.history.pushState(null, '', nextUrl)
    }
    window.requestAnimationFrame(() => {
      document.getElementById('models-workbench')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  // 랭킹에서 모델 클릭 → 비교 탭의 상세 프로필로 이동·선택
  const handleSelectRankingModel = (profileId: string) => {
    setSelectedModelId(profileId)
    navigateToRoute('models')
    selectModelsTab('compare')
  }
  // 랭킹에서 확장 클릭 → 도구 워크벤치 확장 목록으로 이동
  const handleSelectRankingExtension = (_extensionId: string) => {
    navigateToRoute('tools')
    if (window.location.hash !== '#extensions') {
      window.history.pushState(null, '', `${routePath.tools}#extensions`)
    }
    window.requestAnimationFrame(() => {
      document.getElementById('extensions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleShareTools = async () => {
    const paneTitle = toolsPaneMeta.find((pane) => pane.id === toolsPane)?.title ?? '도구'
    const url = `${window.location.origin}${routePath.tools}#${toolsPane}`
    const result = await shareOrCopy({
      title: `AIDigestDesk · ${paneTitle}`,
      text: `AIDigestDesk 도구 워크벤치 — ${paneTitle}`,
      url,
    })
    if (result === 'shared') {
      toast.show({ message: '공유를 시작했습니다', tone: 'success' })
    } else if (result === 'copied') {
      toast.show({ message: '링크를 클립보드에 복사했습니다', tone: 'success' })
    } else if (result === 'unsupported') {
      toast.show({ message: '이 브라우저에서는 공유를 지원하지 않습니다', tone: 'error' })
    }
  }

  const toolPaneCounts: Record<ToolsPaneId, number> = {
    'task-recommendations': visibleTaskRecommendations.length,
    'ai-tools': visibleAiCodingTools.length,
    extensions: getExtensionStats().total,
    'cli-manual': visibleLlmCliManuals.length,
    'vibe-coding': visibleVibeCommands.length,
    'cli-comparison': visibleVibeCommands.length,
    design: 1,
  }

  const renderToolsPane = () => {
    switch (toolsPane) {
      case 'ai-tools':
        return <CodingToolDirectorySection tools={visibleAiCodingTools} />
      case 'extensions':
        return <ExtensionsSection />
      case 'cli-manual':
        return <LlmCliManualSection manuals={visibleLlmCliManuals} />
      case 'vibe-coding':
        return <VibeCodingSection commands={visibleVibeCommands} />
      case 'cli-comparison':
        return <CliComparisonSection commands={visibleVibeCommands} />
      case 'design':
        return <DesignWorkflowSection />
      case 'task-recommendations':
      default:
        return <TaskRecommendationSection recommendations={visibleTaskRecommendations} />
    }
  }

  const renderFilterBar = () => (
    <div className="z-30 -mx-3 border-b border-border bg-bg/85 px-3 py-3 backdrop-blur md:sticky md:top-[7.25rem] md:-mx-4 md:px-4 lg:-mx-6 lg:px-6">
      <div className="mx-auto flex max-w-[96rem] flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-x-4 md:gap-y-2">
        <MultiSegmentBar
          label="제공사"
          items={providerFilters}
          value={providers}
          onChange={setProviders}
        />
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 md:ml-auto">
          {hasActiveFilter ? <ActiveFilterChips chips={activeChips} /> : null}
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilter}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            필터 초기화
          </button>
        </div>
      </div>
    </div>
  )

  const renderSections = (contentRoute: ContentRoute) => {
    switch (contentRoute) {
      case 'models':
        return (
          <>
            {renderFilterBar()}
            <PageHeader route="models" />
            <div id="models-workbench" className="scroll-mt-32 space-y-5">
              <ModelsTabSwitcher activeTab={modelsTab} onSelect={selectModelsTab} />
              {modelsTab === 'rankings' && (
                <RankingBoard
                  id="rankings"
                  onSelectModel={handleSelectRankingModel}
                  onSelectExtension={handleSelectRankingExtension}
                />
              )}
              {modelsTab === 'compare' && (
                <>
                  <ModelCards
                    models={visibleModels}
                    selectedModelId={selectedModel?.id ?? ''}
                    onSelectModel={setSelectedModelId}
                  />
                  {selectedModel ? <ModelDetail profile={selectedModel} /> : null}
                </>
              )}
              {modelsTab === 'local' && <LocalModelComparison />}
              {modelsTab === 'benchmarks' && <BenchmarkBoard />}
              {modelsTab === 'matrix' && <ComparisonMatrix />}
              {modelsTab === 'cost' && (
                <>
                  <ModelCostCalculator />
                  <EventCostComparisonSection />
                </>
              )}
            </div>
          </>
        )
      case 'tools':
        return (
          <>
            {renderFilterBar()}
            <PageHeader route="tools" />
            <ToolsPaneSwitcher
              activePane={toolsPane}
              counts={toolPaneCounts}
              onSelect={selectToolsPane}
              onShare={() => void handleShareTools()}
            />
            {renderToolsPane()}
          </>
        )
      case 'deals':
        return (
          <>
            <PageHeader route="deals" />
            <DealsSection />
            <EventPromotionsSection />
          </>
        )
      case 'resources':
        return (
          <>
            {renderFilterBar()}
            <PageHeader route="resources" />
            <Briefing results={results} useFallback={!hasActiveFilter} />
            <ResourceLibrary resources={visibleResources} />
            <CliManualSection id="cli-manuals" />
            <GlossarySection />
            <ManualGuides guides={visibleGuides} />
            <PersonaPlaybooks guides={visiblePersonaGuides} />
            <WebzineSection results={results} useFallback={!hasActiveFilter} />
            <TranslatedNewsSection />
            <SourcesSection sourceItems={visibleSources} />
          </>
        )
      case 'portal':
      default:
        return (
          <>
            <PortalHero onNavigate={navigateToRoute} />
            <Reveal>
              <RankingBoard
                limit={5}
                onSelectModel={handleSelectRankingModel}
                onSelectExtension={handleSelectRankingExtension}
                onSeeAll={(scope) => {
                  if (scope === 'models') {
                    navigateToRoute('models')
                    window.location.hash = '#rankings'
                  } else {
                    navigateToRoute('tools')
                    window.location.hash = '#extensions'
                  }
                }}
              />
            </Reveal>
            <Reveal variant="soft">
              <Briefing
                results={results}
                useFallback={!hasActiveFilter}
                compact
                onSeeAll={() => navigateToRoute('resources')}
              />
            </Reveal>
            <Reveal>
              <FreshRail />
            </Reveal>
            <BookmarksRail onNavigate={navigateToRoute} />
            <Reveal>
              <ExploreGrid onNavigate={navigateToRoute} />
            </Reveal>
          </>
        )
    }
  }

  const contentRoutes: ContentRoute[] = ['portal', 'models', 'tools', 'deals', 'resources']
  const isContentRoute = (contentRoutes as AppRoute[]).includes(route)

  return (
    <div className="min-h-screen bg-bg text-text">
      <IntroSplashScreen />
      <SkipLink />
      <RouteAnnouncer routeKey={route} />
      <Header
        query={query}
        onQueryChange={setQuery}
        route={route}
        onNavigate={navigateToRoute}
        adminSession={adminSession}
        memberSession={memberSession}
        dark={dark}
        onToggleDark={toggleDark}
      />
      {route === 'admin' ? (
        <AdminRoute
          session={adminSession}
          onLogin={handleAdminLogin}
          onLogout={handleAdminLogout}
          onNavigate={navigateToRoute}
        />
      ) : route === 'account' ? (
        <AccountRoute
          session={memberSession}
          onAuthed={(session) => setMemberSession(session)}
          onLogout={handleMemberLogout}
          onWithdraw={() => setMemberSession(null)}
          onNavigate={navigateToRoute}
        />
      ) : route === 'community' ? (
        <CommunityRoute
          onNavigate={navigateToRoute}
          memberName={memberSession?.displayName ?? null}
        />
      ) : route === 'support' ? (
        <SupportRoute onNavigate={navigateToRoute} />
      ) : route === 'terms' ? (
        <TermsRoute onNavigate={navigateToRoute} />
      ) : route === 'about' ? (
        <AboutRoute onNavigate={navigateToRoute} />
      ) : route === 'design' ? (
        <DesignRoute onNavigate={navigateToRoute} />
      ) : route === 'sitemap' ? (
        <SitemapRoute onNavigate={navigateToRoute} />
      ) : (
        <div className="grid lg:grid-cols-[15rem_1fr]">
          <Sidebar route={route} onNavigate={navigateToRoute} />
          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 px-3 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] outline-none sm:px-4 sm:py-5 lg:px-6"
          >
            <div className="mx-auto max-w-[96rem] space-y-5 sm:space-y-6">
              {renderSections(isContentRoute ? (route as ContentRoute) : 'portal')}

              <footer className="flex flex-col gap-3 border-t border-border py-6 text-xs text-text-subtle sm:flex-row sm:items-center sm:justify-between">
                <span>
                  © {new Date().getFullYear()} AIDigestDesk (Beta). All rights reserved. ·{' '}
                  {SNAPSHOT_DATE} 스냅샷
                </span>
                <nav className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <button
                    type="button"
                    onClick={() => navigateToRoute('about')}
                    className="inline-flex min-h-9 min-w-9 items-center justify-center font-semibold text-text-muted transition hover:text-text"
                  >
                    소개·가이드
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToRoute('community')}
                    className="inline-flex min-h-9 min-w-9 items-center justify-center font-semibold text-text-muted transition hover:text-text"
                  >
                    커뮤니티
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToRoute('support')}
                    className="inline-flex min-h-9 min-w-9 items-center justify-center font-semibold text-text-muted transition hover:text-text"
                  >
                    문의
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToRoute('terms')}
                    className="inline-flex min-h-9 min-w-9 items-center justify-center font-semibold text-text-muted transition hover:text-text"
                  >
                    약관·정책
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToRoute('sitemap')}
                    className="inline-flex min-h-9 min-w-9 items-center justify-center font-semibold text-text-muted transition hover:text-text"
                  >
                    사이트맵
                  </button>
                  <a
                    href="#main-content"
                    className="group inline-flex min-h-9 items-center gap-1 font-semibold text-text-muted transition-colors duration-200 hover:text-text"
                  >
                    맨 위로{' '}
                    <ChevronRight
                      className="size-3.5 -rotate-90 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </a>
                </nav>
              </footer>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
