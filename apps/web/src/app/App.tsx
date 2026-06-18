import {
  aiCodingTools,
  curationMonitors,
  featureBacklog,
  learningResources,
  manualGuides,
  modelProfiles,
  personaGuides,
  providerCatalog,
  searchCatalog,
  SNAPSHOT_DATE,
  sources,
  taskRecommendations,
  updatePipeline,
  vibeCodingCommands,
  type AiCodingToolProfile,
  type ContentCategory,
  type LearningResource,
  type ProviderId,
  type SourceRef,
  type TaskRecommendation,
  type VibeCodingCommand,
} from "@aidigestdesk/content";
import {
  BarChart3,
  BookOpen,
  Boxes,
  Calculator,
  ChevronRight,
  CircleHelp,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Home,
  Library,
  LayoutDashboard,
  Moon,
  Newspaper,
  PanelLeft,
  Palette,
  MapPin,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Table2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { ComponentType } from "react";

import { AdminRoute } from "@/components/app/AdminRoute";
import {
  getInitialAdminSession,
  saveAdminSession,
  type AdminSession,
} from "@/components/app/adminSession";
import {
  CodingToolDirectorySection,
  TaskRecommendationSection,
  VibeCodingSection,
} from "@/components/app/AiCodingSections";
import { IconButton, MetricCard, SegmentBar } from "@/components/app/CommonUi";
import {
  EventCostComparisonSection,
  ModelCostCalculator,
} from "@/components/app/CostSections";
import { EditorialOpsSection } from "@/components/app/EditorialOpsSection";
import { ExportDeskSection } from "@/components/app/ExportDeskSection";
import {
  DesignWorkflowSection,
  ManualGuides,
  PersonaPlaybooks,
} from "@/components/app/LearningWorkflowSections";
import {
  BenchmarkBoard,
  ComparisonMatrix,
  ModelCards,
  ModelDetail,
} from "@/components/app/ModelBenchmarkSections";
import {
  Briefing,
  EventPromotionsSection,
  WebzineSection,
} from "@/components/app/PortalNewsSections";
import { ResourceLibrary } from "@/components/app/ResourceLibrary";
import { SitemapRoute } from "@/components/app/SitemapRoute";
import { SourcesSection } from "@/components/app/SourcesSection";
import { RouteAnnouncer } from "@/components/layout/RouteAnnouncer";
import { SkipLink } from "@/components/layout/SkipLink";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type ProviderFilter = ProviderId | "all";
type CategoryFilter = ContentCategory | "all";

const providerFilters: Array<{ id: ProviderFilter; label: string }> = [
  { id: "all", label: "전체" },
  ...providerCatalog.map((provider) => ({
    id: provider.id,
    label: provider.shortLabel,
  })),
];

const categoryFilters: Array<{ id: CategoryFilter; label: string }> = [
  { id: "all", label: "전체" },
  { id: "news", label: "뉴스" },
  { id: "events", label: "이벤트" },
  { id: "updates", label: "업데이트" },
  { id: "recommendations", label: "추천" },
  { id: "vibe", label: "바이브 코딩" },
  { id: "tools", label: "AI 도구" },
  { id: "design", label: "디자인/PPT" },
  { id: "comparison", label: "모델 비교" },
  { id: "benchmarks", label: "벤치마크" },
  { id: "manuals", label: "사용법" },
  { id: "personas", label: "직군별" },
  { id: "learning", label: "강좌" },
  { id: "books", label: "도서" },
  { id: "ops", label: "편집실" },
  { id: "sources", label: "소스" },
];

const navItems = [
  { href: "#updates", label: "업데이트", icon: Newspaper },
  { href: "#events", label: "이벤트", icon: Sparkles },
  { href: "#task-recommendations", label: "작업 추천", icon: Sparkles },
  { href: "#webzine", label: "웹진", icon: Newspaper },
  { href: "#ai-tools", label: "AI 도구", icon: Boxes },
  { href: "#vibe-coding", label: "바이브 코딩", icon: Code2 },
  { href: "#design", label: "디자인/PPT", icon: Palette },
  { href: "#comparison", label: "모델 비교", icon: Table2 },
  { href: "#benchmarks", label: "벤치마크", icon: BarChart3 },
  { href: "#manuals", label: "사용법", icon: CircleHelp },
  { href: "#personas", label: "직군별", icon: Users },
  { href: "#learning", label: "강좌/도서", icon: BookOpen },
  { href: "#ops", label: "편집실", icon: Gauge },
  { href: "#exports", label: "내보내기", icon: Download },
  { href: "#costs", label: "비용 계산기", icon: Calculator },
  { href: "#event-costs", label: "이벤트 비용", icon: Calculator },
  { href: "#sources", label: "소스", icon: FileText },
] as const;

type AppRoute = "portal" | "resources" | "admin" | "sitemap";

const routePath: Record<
  AppRoute,
  "/resources" | "/admin" | "/sitemap" | "/"
> = {
  portal: "/",
  resources: "/resources",
  admin: "/admin",
  sitemap: "/sitemap",
};

const routeTitles: Record<AppRoute, string> = {
  portal: "포털 대시보드",
  resources: "AI 바이브 코딩 자료실",
  admin: "관리자 콘솔",
  sitemap: "사이트맵",
};

function getCurrentRoute(): AppRoute {
  if (typeof window === "undefined") return "portal";
  if (window.location.pathname.startsWith("/resources")) return "resources";
  if (window.location.pathname.startsWith("/admin")) return "admin";
  if (window.location.pathname.startsWith("/sitemap")) return "sitemap";
  return "portal";
}

function Header({
  query,
  onQueryChange,
  route,
  onNavigate,
  adminSession,
  dark,
  onToggleDark,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  route: AppRoute;
  onNavigate: (route: AppRoute) => void;
  adminSession: AdminSession | null;
  dark: boolean;
  onToggleDark: () => void;
}) {
  const routeButtonClass = (targetRoute: AppRoute) =>
    route === targetRoute
      ? "inline-flex h-9 items-center gap-1.5 rounded-md border border-ink bg-ink px-3 text-xs font-semibold text-ink-fg"
      : "inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-text-muted transition hover:border-border-strong hover:text-text";
  const routeItems: Array<{
    id: AppRoute;
    label: string;
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  }> = [
    { id: "portal", label: "포털", icon: Home },
    { id: "resources", label: "자료", icon: Library },
    { id: "admin", label: "Admin", icon: LayoutDashboard },
    { id: "sitemap", label: "사이트맵", icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-5">
        <a
          href={route === "portal" ? "#main-content" : "/"}
          onClick={(event) => {
            if (route !== "portal") {
              event.preventDefault();
              onNavigate("portal");
            }
          }}
          className="flex min-w-0 items-center gap-3"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-ink text-ink-fg">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-text">
              AI Digest Desk
            </span>
            <span className="block truncate text-xs text-text-subtle">
              {SNAPSHOT_DATE} 기준
            </span>
          </span>
        </a>
        <div className="relative ml-auto hidden w-full max-w-xl md:block">
          {route !== "admin" ? (
            <>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-subtle" />
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={
                  route === "resources"
                    ? "강좌, 유튜브, 교육기관, 도서, 블로그 검색"
                    : "모델, 기능, 벤치마크, 강좌 검색"
                }
                className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
              />
            </>
          ) : (
            <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-text-muted">
              <ShieldCheck className="size-4 text-accent" aria-hidden />
              <span className="truncate">
                관리자 콘솔
                {adminSession ? ` · ${adminSession.email}` : " · 로그인 필요"}
              </span>
            </div>
          )}
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          {routeItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={routeButtonClass(item.id)}
            >
              <item.icon className="size-3.5" aria-hidden />
              {item.label}
            </button>
          ))}
        </div>
        <IconButton label="사이드바">
          <PanelLeft className="size-4" aria-hidden />
        </IconButton>
        <IconButton
          label={dark ? "라이트 모드" : "다크 모드"}
          onClick={onToggleDark}
        >
          {dark ? (
            <Sun className="size-4" aria-hidden />
          ) : (
            <Moon className="size-4" aria-hidden />
          )}
        </IconButton>
        <IconButton
          label={route === "admin" ? "포털로 이동" : "관리자 콘솔"}
          onClick={() => onNavigate(route === "admin" ? "portal" : "admin")}
        >
          {route === "admin" ? (
            <Home className="size-4" aria-hidden />
          ) : (
            <Settings2 className="size-4" aria-hidden />
          )}
        </IconButton>
      </div>
      <div className="border-t border-border px-4 py-3 md:hidden">
        {route !== "admin" ? (
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-subtle" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={route === "resources" ? "자료 검색" : "검색"}
              className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-text outline-none focus:border-accent"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-muted">
            <span className="inline-flex min-w-0 items-center gap-2">
              <ShieldCheck
                className="size-4 shrink-0 text-accent"
                aria-hidden
              />
              <span className="truncate">
                관리자 콘솔
                {adminSession ? ` · ${adminSession.email}` : " · 로그인 필요"}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onNavigate(route === "admin" ? "portal" : "admin")}
              className="shrink-0 text-xs font-semibold text-accent"
            >
              {route === "admin" ? "포털" : "Admin"}
            </button>
          </div>
        )}
        <div className="mt-2 flex gap-1 sm:hidden">
          {routeItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`${routeButtonClass(item.id)} flex-1 justify-center`}
            >
              <item.icon className="size-3.5" aria-hidden />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="hidden border-r border-border bg-surface/70 lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-60 flex-col px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-muted transition hover:bg-surface-2 hover:text-text"
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-md border border-border bg-bg p-3">
          <p className="text-xs font-semibold text-text">소스 워치</p>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            공식 문서, 벤치마크, 출판사, 한국어 커뮤니티 링크를 분리 보관합니다.
          </p>
        </div>
      </div>
    </aside>
  );
}

function ResourcesRoute({
  resources,
  recommendations,
  toolProfiles,
  vibeCommands,
  sourceItems,
  onNavigate,
}: {
  resources: LearningResource[];
  recommendations: TaskRecommendation[];
  toolProfiles: AiCodingToolProfile[];
  vibeCommands: VibeCodingCommand[];
  sourceItems: SourceRef[];
  onNavigate: (route: AppRoute) => void;
}) {
  const koreanResourceCount = resources.filter(
    (resource) => resource.language === "한국어",
  ).length;
  const bookCount = resources.filter(
    (resource) => resource.type === "도서",
  ).length;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="px-4 py-5 outline-none lg:px-6"
    >
      <div className="mx-auto max-w-[96rem] space-y-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-accent">
                자료 라우트 · /resources
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-text">
                AI 바이브 코딩 자료실
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
                한국어 유튜브, 교육기관, 원격 강좌, 신간 도서, 블로그, CLI
                자료를 한 화면에서 세밀하게 필터링합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("portal")}
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
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<ProviderFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [selectedModelId, setSelectedModelId] = useState(
    modelProfiles[0]?.id ?? "",
  );
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(
    getInitialAdminSession,
  );
  const [dark, setDark] = useState(false);

  useDocumentTitle(routeTitles[route]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const syncRoute = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const navigateToRoute = (nextRoute: AppRoute) => {
    const nextPath = routePath[nextRoute];
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, "", nextPath);
    }
    setRoute(nextRoute);
  };

  const handleAdminLogin = (session: AdminSession) => {
    saveAdminSession(session);
    setAdminSession(session);
  };

  const handleAdminLogout = () => {
    saveAdminSession(null);
    setAdminSession(null);
  };

  const results = useMemo(
    () => searchCatalog(query, provider, category),
    [query, provider, category],
  );
  const hasActiveFilter =
    query.trim() !== "" || provider !== "all" || category !== "all";
  const visibleModels =
    results.models.length > 0
      ? results.models
      : hasActiveFilter
        ? []
        : modelProfiles;
  const selectedModel =
    visibleModels.find((model) => model.id === selectedModelId) ??
    visibleModels[0] ??
    null;
  const visibleGuides =
    results.manuals.length > 0
      ? results.manuals
      : hasActiveFilter
        ? []
        : manualGuides;
  const visiblePersonaGuides =
    results.personaGuides.length > 0
      ? results.personaGuides
      : hasActiveFilter
        ? []
        : personaGuides;
  const visibleResources =
    results.resources.length > 0
      ? results.resources
      : hasActiveFilter
        ? []
        : learningResources;
  const visibleVibeCommands =
    results.vibeCodingCommands.length > 0
      ? results.vibeCodingCommands
      : hasActiveFilter
        ? []
        : vibeCodingCommands;
  const visibleAiCodingTools =
    results.aiCodingTools.length > 0
      ? results.aiCodingTools
      : hasActiveFilter
        ? []
        : aiCodingTools;
  const visibleTaskRecommendations =
    results.taskRecommendations.length > 0
      ? results.taskRecommendations
      : hasActiveFilter
        ? []
        : taskRecommendations;
  const visibleMonitors =
    results.curationMonitors.length > 0
      ? results.curationMonitors
      : hasActiveFilter
        ? []
        : curationMonitors;
  const visiblePipelineItems =
    results.pipelineItems.length > 0
      ? results.pipelineItems
      : hasActiveFilter
        ? []
        : updatePipeline;
  const visibleBacklog =
    results.featureBacklog.length > 0
      ? results.featureBacklog
      : hasActiveFilter
        ? []
        : featureBacklog;
  const visibleSources =
    category === "sources" || results.sources.length > 0
      ? results.sources
      : hasActiveFilter
        ? []
        : sources;

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
      {route === "admin" ? (
        <AdminRoute
          session={adminSession}
          onLogin={handleAdminLogin}
          onLogout={handleAdminLogout}
          onNavigate={navigateToRoute}
        />
      ) : route === "resources" ? (
        <ResourcesRoute
          resources={visibleResources}
          recommendations={visibleTaskRecommendations}
          toolProfiles={visibleAiCodingTools}
          vibeCommands={visibleVibeCommands}
          sourceItems={visibleSources}
          onNavigate={navigateToRoute}
        />
      ) : route === "sitemap" ? (
        <SitemapRoute onNavigate={navigateToRoute} />
      ) : (
        <div className="grid lg:grid-cols-[15rem_1fr]">
          <Sidebar />
          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 px-4 py-5 outline-none lg:px-6"
          >
            <div className="mx-auto max-w-[96rem] space-y-6">
              <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1fr_1.25fr]">
                <SegmentBar
                  label="제공사"
                  items={providerFilters}
                  value={provider}
                  onChange={setProvider}
                />
                <SegmentBar
                  label="카테고리"
                  items={categoryFilters}
                  value={category}
                  onChange={setCategory}
                />
              </div>

              <Briefing results={results} useFallback={!hasActiveFilter} />
              <WebzineSection
                results={results}
                useFallback={!hasActiveFilter}
              />
              <EventPromotionsSection />
              <TaskRecommendationSection
                recommendations={visibleTaskRecommendations}
              />
              <CodingToolDirectorySection tools={visibleAiCodingTools} />
              <VibeCodingSection commands={visibleVibeCommands} />
              <DesignWorkflowSection />
              <ModelCards
                models={visibleModels}
                selectedModelId={selectedModel?.id ?? ""}
                onSelectModel={setSelectedModelId}
              />
              {selectedModel ? <ModelDetail profile={selectedModel} /> : null}
              <BenchmarkBoard />
              <ComparisonMatrix />
              <ManualGuides guides={visibleGuides} />
              <PersonaPlaybooks guides={visiblePersonaGuides} />
              <ResourceLibrary resources={visibleResources} />
              <EditorialOpsSection
                monitors={visibleMonitors}
                pipelineItems={visiblePipelineItems}
                backlog={visibleBacklog}
              />
              <ExportDeskSection />
              <ModelCostCalculator />
              <EventCostComparisonSection />
              <SourcesSection sourceItems={visibleSources} />

              <footer className="flex flex-col gap-2 border-t border-border py-6 text-xs text-text-subtle sm:flex-row sm:items-center sm:justify-between">
                <span>AIDigestDesk · {SNAPSHOT_DATE} 스냅샷</span>
                <a
                  href="#main-content"
                  className="inline-flex items-center gap-1 font-semibold text-text-muted hover:text-text"
                >
                  맨 위로{" "}
                  <ChevronRight className="size-3.5 -rotate-90" aria-hidden />
                </a>
              </footer>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
