import {
  aiCodingTools,
  learningResources,
  manualGuides,
  modelProfiles,
  personaGuides,
  providerCatalog,
  searchCatalog,
  SNAPSHOT_DATE,
  sources,
  taskRecommendations,
  vibeCodingCommands,
  type AiCodingToolProfile,
  type ContentCategory,
  type LearningResource,
  type ProviderId,
  type SourceRef,
  type TaskRecommendation,
  type VibeCodingCommand,
} from '@aidigestdesk/content'
import { BookOpen, Boxes, ChevronRight, ExternalLink, FileText, Home, Library } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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
import { MetricCard, MultiSegmentBar } from '@/components/app/CommonUi'
import { EventCostComparisonSection, ModelCostCalculator } from '@/components/app/CostSections'
import {
  DesignWorkflowSection,
  ManualGuides,
  PersonaPlaybooks,
} from '@/components/app/LearningWorkflowSections'
import {
  BenchmarkBoard,
  ComparisonMatrix,
  ModelCards,
  ModelDetail,
} from '@/components/app/ModelBenchmarkSections'
import {
  Briefing,
  EventPromotionsSection,
  WebzineSection,
} from '@/components/app/PortalNewsSections'
import { ResourceLibrary } from '@/components/app/ResourceLibrary'
import { SitemapRoute } from '@/components/app/SitemapRoute'
import { SourcesSection } from '@/components/app/SourcesSection'
import { RouteAnnouncer } from '@/components/layout/RouteAnnouncer'
import { SkipLink } from '@/components/layout/SkipLink'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const providerFilters: Array<{ id: ProviderId | 'all'; label: string }> = [
  { id: 'all', label: '전체' },
  ...providerCatalog.map((provider) => ({
    id: provider.id,
    label: provider.shortLabel,
  })),
]

const categoryFilters: Array<{ id: ContentCategory | 'all'; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'news', label: '뉴스' },
  { id: 'events', label: '일정/이벤트' },
  { id: 'recommendations', label: '작업 추천' },
  { id: 'tools', label: 'AI 도구' },
  { id: 'vibe', label: 'CLI/코딩' },
  { id: 'comparison', label: '모델 비교' },
  { id: 'benchmarks', label: '벤치마크' },
  { id: 'learning', label: '강좌/자료' },
]

function ResourcesRoute({
  resources,
  recommendations,
  toolProfiles,
  vibeCommands,
  sourceItems,
  onNavigate,
}: {
  resources: LearningResource[]
  recommendations: TaskRecommendation[]
  toolProfiles: AiCodingToolProfile[]
  vibeCommands: VibeCodingCommand[]
  sourceItems: SourceRef[]
  onNavigate: (route: AppRoute) => void
}) {
  const koreanResourceCount = resources.filter((resource) => resource.language === '한국어').length
  const bookCount = resources.filter((resource) => resource.type === '도서').length

  return (
    <main id="main-content" tabIndex={-1} className="px-4 py-5 outline-none lg:px-6">
      <div className="mx-auto max-w-[96rem] space-y-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-accent">자료 라우트 · /resources</p>
              <h1 className="mt-1 text-2xl font-semibold text-text">AI 바이브 코딩 자료실</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
                한국어 유튜브, 교육기관, 원격 강좌, 신간 도서, 블로그, CLI 자료를 한 화면에서
                세밀하게 필터링합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('portal')}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-muted transition hover:text-text"
            >
              <Home className="size-3.5" aria-hidden />
              포털로
            </button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="자료"
              value={`${resources.length}`}
              detail="현재 검색/필터 조건"
              icon={Library}
            />
            <MetricCard
              label="한국어"
              value={`${koreanResourceCount}`}
              detail="문서, 영상, 블로그, 도서"
              icon={BookOpen}
            />
            <MetricCard
              label="도서"
              value={`${bookCount}`}
              detail="국내외 검색 허브 포함"
              icon={FileText}
            />
            <MetricCard
              label="AI 도구"
              value={`${toolProfiles.length}`}
              detail="IDE, CLI, PR 리뷰, 에이전트"
              icon={Boxes}
            />
            <MetricCard
              label="출처"
              value={`${sourceItems.length}`}
              detail="공식/출판사/커뮤니티"
              icon={ExternalLink}
            />
          </div>
        </section>

        <TaskRecommendationSection recommendations={recommendations} />
        <CodingToolDirectorySection tools={toolProfiles} />
        <ResourceLibrary resources={resources} />
        <VibeCodingSection commands={vibeCommands} />
        <BenchmarkBoard />
        <SourcesSection sourceItems={sourceItems} />
      </div>
    </main>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [providers, setProviders] = useState<ProviderId[]>([])
  const [categories, setCategories] = useState<ContentCategory[]>([])
  const [selectedModelId, setSelectedModelId] = useState(modelProfiles[0]?.id ?? '')
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute)
  const [adminSession, setAdminSession] = useState<AdminSession | null>(getInitialAdminSession)
  const [dark, setDark] = useState(false)

  useDocumentTitle(routeTitles[route])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const syncRoute = () => setRoute(getCurrentRoute())
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const navigateToRoute = (nextRoute: AppRoute) => {
    const nextPath = routePath[nextRoute]
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath)
    }
    setRoute(nextRoute)
  }

  const handleAdminLogin = (session: AdminSession) => {
    saveAdminSession(session)
    setAdminSession(session)
  }

  const handleAdminLogout = () => {
    saveAdminSession(null)
    setAdminSession(null)
  }

  const results = useMemo(
    () => searchCatalog(query, providers, categories),
    [query, providers, categories]
  )
  const hasActiveFilter = query.trim() !== '' || providers.length > 0 || categories.length > 0
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
  const visibleAiCodingTools =
    results.aiCodingTools.length > 0 ? results.aiCodingTools : hasActiveFilter ? [] : aiCodingTools
  const visibleTaskRecommendations =
    results.taskRecommendations.length > 0
      ? results.taskRecommendations
      : hasActiveFilter
        ? []
        : taskRecommendations
  const visibleSources =
    categories.includes('sources') || results.sources.length > 0
      ? results.sources
      : hasActiveFilter
        ? []
        : sources

  // selectedModel 은 렌더 중 visibleModels[0] 로 폴백하고, 소비처는 selectedModel?.id
  // 를 쓴다. 따라서 필터로 현재 선택이 빠져도 effect 로 state 를 되돌릴 필요가 없다
  // (https://react.dev/learn/you-might-not-need-an-effect).

  return (
    <div className="min-h-screen bg-bg text-text">
      <SkipLink />
      <RouteAnnouncer routeKey={route} />
      <Header
        query={query}
        onQueryChange={setQuery}
        route={route}
        onNavigate={navigateToRoute}
        adminSession={adminSession}
        dark={dark}
        onToggleDark={() => setDark((value) => !value)}
      />
      {route === 'admin' ? (
        <AdminRoute
          session={adminSession}
          onLogin={handleAdminLogin}
          onLogout={handleAdminLogout}
          onNavigate={navigateToRoute}
        />
      ) : route === 'resources' ? (
        <ResourcesRoute
          resources={visibleResources}
          recommendations={visibleTaskRecommendations}
          toolProfiles={visibleAiCodingTools}
          vibeCommands={visibleVibeCommands}
          sourceItems={visibleSources}
          onNavigate={navigateToRoute}
        />
      ) : route === 'sitemap' ? (
        <SitemapRoute onNavigate={navigateToRoute} />
      ) : (
        <div className="grid lg:grid-cols-[15rem_1fr]">
          <Sidebar />
          <main id="main-content" tabIndex={-1} className="min-w-0 px-4 py-5 outline-none lg:px-6">
            <div className="mx-auto max-w-[96rem] space-y-6">
              <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1fr_1.25fr]">
                <MultiSegmentBar
                  label="제공사"
                  items={providerFilters}
                  value={providers}
                  onChange={setProviders}
                />
                <MultiSegmentBar
                  label="카테고리"
                  items={categoryFilters}
                  value={categories}
                  onChange={setCategories}
                />
              </div>

              <Briefing results={results} useFallback={!hasActiveFilter} />
              <EventPromotionsSection />
              <TaskRecommendationSection recommendations={visibleTaskRecommendations} />
              <CodingToolDirectorySection tools={visibleAiCodingTools} />
              <VibeCodingSection commands={visibleVibeCommands} />
              <DesignWorkflowSection />
              <ModelCards
                models={visibleModels}
                selectedModelId={selectedModel?.id ?? ''}
                onSelectModel={setSelectedModelId}
              />
              {selectedModel ? <ModelDetail profile={selectedModel} /> : null}
              <BenchmarkBoard />
              <ComparisonMatrix />
              <ResourceLibrary resources={visibleResources} />
              <WebzineSection results={results} useFallback={!hasActiveFilter} />
              <ManualGuides guides={visibleGuides} />
              <PersonaPlaybooks guides={visiblePersonaGuides} />
              <ModelCostCalculator />
              <EventCostComparisonSection />
              <SourcesSection sourceItems={visibleSources} />

              <footer className="flex flex-col gap-2 border-t border-border py-6 text-xs text-text-subtle sm:flex-row sm:items-center sm:justify-between">
                <span>AIDigestDesk · {SNAPSHOT_DATE} 스냅샷</span>
                <a
                  href="#main-content"
                  className="inline-flex items-center gap-1 font-semibold text-text-muted hover:text-text"
                >
                  맨 위로 <ChevronRight className="size-3.5 -rotate-90" aria-hidden />
                </a>
              </footer>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
