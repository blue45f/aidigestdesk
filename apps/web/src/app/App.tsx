import {
  aiCodingTools,
  benchmarkEntries,
  calculateModelCosts,
  comparisonProviderOrder,
  comparisonRows,
  createNewsletterMarkdown,
  createPipelineExportJson,
  createSnapshotRunbookMarkdown,
  createSourceMonitorCsv,
  curationMonitors,
  featureBacklog,
  getBenchmarkDomainLabel,
  getAiCodingToolCategoryLabel,
  getCatalogStats,
  getModelById,
  getProviderLabel,
  getSources,
  getTaskRecommendationCategoryLabel,
  getSourceSnapshotCandidates,
  learningResources,
  manualGuides,
  modelProfiles,
  movePipelineStage,
  personaGuides,
  providerCatalog,
  runContentAudit,
  searchCatalog,
  SNAPSHOT_DATE,
  sources,
  taskRecommendations,
  updatePipeline,
  updates,
  vibeCodingCommands,
  type BenchmarkDomain,
  type AiCodingToolCategory,
  type AiCodingToolProfile,
  type ContentCategory,
  type CurationMonitor,
  type FeatureBacklogItem,
  type LearningResource,
  type ManualGuide,
  type ModelProfile,
  type PersonaGuide,
  type PipelineStage,
  type ProviderId,
  type SearchResults,
  type SourceRef,
  type TaskRecommendation,
  type TaskRecommendationCategory,
  type UpdatePipelineItem,
  type VibeCodingCommand,
} from "@aidigestdesk/content";
import {
  BarChart3,
  BookOpen,
  Boxes,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  FileText,
  Gauge,
  Home,
  KeyRound,
  Library,
  LayoutDashboard,
  LogIn,
  LogOut,
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

import type { ComponentType, FormEvent } from "react";

import {
  EmptyState,
  IconButton,
  SectionHeader,
  SegmentBar,
  TextList,
} from "@/components/app/CommonUi";
import { RouteAnnouncer } from "@/components/layout/RouteAnnouncer";
import { SkipLink } from "@/components/layout/SkipLink";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type ProviderFilter = ProviderId | "all";
type CategoryFilter = ContentCategory | "all";
type ResourceLanguageFilter = LearningResource["language"] | "all";
type ResourceTypeFilter = LearningResource["type"] | "all";
type ResourceLevelFilter = LearningResource["level"] | "all";
type ResourceProviderFilter = ProviderId | "all";
type ResourceFocusFilter =
  | "all"
  | "modelChannels"
  | "koreanCreators"
  | "coursePlatforms"
  | "books"
  | "community"
  | "officialKo"
  | "codingTools";
type BenchmarkDomainFilter = BenchmarkDomain | "all";
type VibeSurfaceFilter = VibeCodingCommand["surface"] | "all";
type VibeFitFilter = VibeCodingCommand["vibeCodingFit"] | "all";
type AiCodingToolCategoryFilter = AiCodingToolCategory | "all";
type AiCodingToolPricingFilter =
  | "all"
  | "free"
  | "student"
  | "trial"
  | "enterprise"
  | "openSource";
type SourceKindFilter = SourceRef["kind"] | "all";
type TaskRecommendationCategoryFilter = TaskRecommendationCategory | "all";

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

const stats = getCatalogStats();
const contentAudit = runContentAudit();
const WORKBENCH_STORAGE_KEY = "aidigestdesk.editorWorkbench.v1";
const ADMIN_SESSION_STORAGE_KEY = "aidigestdesk.adminSession.v1";

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

type AdminSession = {
  email: string;
  role: "콘텐츠 관리자";
  signedInAt: string;
};

type PipelineDraft = {
  stage: PipelineStage;
  note: string;
  updatedAt: string;
};

type WorkbenchStorage = {
  version: 1;
  drafts: Record<string, PipelineDraft>;
};

function getCurrentRoute(): AppRoute {
  if (typeof window === "undefined") return "portal";
  if (window.location.pathname.startsWith("/resources")) return "resources";
  if (window.location.pathname.startsWith("/admin")) return "admin";
  if (window.location.pathname.startsWith("/sitemap")) return "sitemap";
  return "portal";
}

function getInitialAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    return parsed.email && parsed.role === "콘텐츠 관리자"
      ? {
          email: parsed.email,
          role: "콘텐츠 관리자",
          signedInAt: parsed.signedInAt ?? new Date().toISOString(),
        }
      : null;
  } catch {
    return null;
  }
}

function saveAdminSession(session: AdminSession | null) {
  if (typeof window === "undefined") return;

  if (!session) {
    window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    ADMIN_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
}

function getInitialWorkbenchDrafts(): Record<string, PipelineDraft> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(WORKBENCH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<WorkbenchStorage>;
    return parsed.version === 1 && parsed.drafts ? parsed.drafts : {};
  } catch {
    return {};
  }
}

function saveWorkbenchDrafts(drafts: Record<string, PipelineDraft>) {
  if (typeof window === "undefined") return;
  const payload: WorkbenchStorage = { version: 1, drafts };
  window.localStorage.setItem(WORKBENCH_STORAGE_KEY, JSON.stringify(payload));
}

type ExportBundle = {
  id: string;
  title: string;
  metric: string;
  filename: string;
  mimeType: string;
  content: string;
  preview: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

function downloadTextFile(bundle: ExportBundle) {
  const blob = new Blob([bundle.content], {
    type: `${bundle.mimeType};charset=utf-8`,
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = bundle.filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

const providerSummary = [
  { label: "제공사", value: `${stats.providers}` },
  { label: "업데이트", value: `${stats.updates}` },
  { label: "AI 도구", value: `${stats.aiCodingTools}` },
  { label: "벤치마크", value: `${stats.benchmarkRows}` },
  { label: "출처", value: `${stats.sources}` },
] as const;

function sourceUrl(sourceId: string) {
  return getSources([sourceId])[0]?.url ?? "#";
}

function sourceKindLabel(kind: SourceRef["kind"]) {
  switch (kind) {
    case "official":
      return "공식";
    case "benchmark":
      return "벤치마크";
    case "publisher":
      return "출판사/기관";
    case "community":
      return "커뮤니티";
  }
}

function accentBorder(profile: ModelProfile) {
  switch (profile.accent) {
    case "green":
      return "border-l-emerald-500";
    case "blue":
      return "border-l-sky-500";
    case "amber":
      return "border-l-amber-500";
    case "coral":
      return "border-l-rose-500";
    case "ink":
      return "border-l-zinc-800 dark:border-l-zinc-100";
  }
}

function accentText(profile: ModelProfile) {
  switch (profile.accent) {
    case "green":
      return "text-emerald-700 dark:text-emerald-300";
    case "blue":
      return "text-sky-700 dark:text-sky-300";
    case "amber":
      return "text-amber-700 dark:text-amber-300";
    case "coral":
      return "text-rose-700 dark:text-rose-300";
    case "ink":
      return "text-zinc-900 dark:text-zinc-100";
  }
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

function Briefing({
  results,
  useFallback,
}: {
  results: SearchResults;
  useFallback: boolean;
}) {
  const topUpdates = results.updates.length
    ? results.updates.slice(0, 3)
    : useFallback
      ? updates.slice(0, 3)
      : [];
  return (
    <section
      id="updates"
      className="grid items-start gap-4 xl:grid-cols-[1fr_21rem]"
    >
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-text sm:text-3xl">
              오늘의 AI 브리핑
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
              GPT, Claude, Gemini, Grok, Manus, Kimi, DeepSeek, Qwen, Mistral의
              최신 스펙과 AI 바이브 코딩 판단 포인트를 한국어로 비교합니다.
            </p>
          </div>
          <a
            href={sourceUrl("aa-leaderboard")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-muted transition hover:text-text"
          >
            벤치마크 원문 <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-5">
          {providerSummary.map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-border bg-bg p-3"
            >
              <p className="text-xs text-text-subtle">{item.label}</p>
              <p className="mt-1 text-xl font-semibold text-text">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {topUpdates.length ? (
            topUpdates.map((item) => (
              <article
                key={item.id}
                className="grid gap-3 rounded-md border border-border bg-bg p-4 md:grid-cols-[8rem_1fr]"
              >
                <div>
                  <p className="text-xs font-semibold text-text-subtle">
                    {item.date}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-accent">
                    {getProviderLabel(item.providerId)}
                  </p>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-text-muted">
                    {item.summary}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-text-subtle">
                    {item.impact}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title="조건에 맞는 업데이트가 없습니다"
              body="검색어 또는 제공사 필터를 줄이면 관련 업데이트가 다시 표시됩니다."
            />
          )}
        </div>
      </div>
      <SourceWatch
        sources={results.sources.length ? results.sources : sources.slice(0, 5)}
      />
    </section>
  );
}

function SourceWatch({ sources: visibleSources }: { sources: SourceRef[] }) {
  return (
    <aside className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-text">소스 워치</h2>
        <Gauge className="size-4 text-text-subtle" aria-hidden />
      </div>
      <div className="mt-4 space-y-3">
        {visibleSources.slice(0, 3).map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-md border border-border bg-bg p-3 transition hover:border-border-strong"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-text">
                {source.publisher}
              </span>
              <ExternalLink className="size-3.5 text-text-subtle" aria-hidden />
            </span>
            <span className="mt-1 block text-sm font-medium text-text">
              {source.title}
            </span>
            <span className="mt-1 block text-xs leading-5 text-text-subtle">
              {source.note}
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function WebzineSection({
  results,
  useFallback,
}: {
  results: SearchResults;
  useFallback: boolean;
}) {
  const magazineUpdates = (
    results.updates.length || !useFallback
      ? results.updates
      : updates.filter((item) =>
          ["news", "events", "vibe", "design"].includes(item.category),
        )
  )
    .filter((item) =>
      ["news", "events", "vibe", "design"].includes(item.category),
    )
    .slice(0, 5);
  const lead = magazineUpdates[0];
  const sideItems = magazineUpdates.slice(1);
  const communityItems = (
    results.resources.length || !useFallback
      ? results.resources
      : learningResources
  )
    .filter((resource) =>
      ["강좌/영상", "블로그/글", "커뮤니티", "도서"].includes(resource.type),
    )
    .toSorted((a, b) =>
      a.language === b.language ? 0 : a.language === "한국어" ? -1 : 1,
    )
    .slice(0, 6);

  return (
    <section id="webzine" className="space-y-4">
      <SectionHeader
        icon={Newspaper}
        title="AI 뉴스와 커뮤니티 웹진"
        description="모델 릴리스, AI 주권/규제 뉴스, 한국어 유튜브·블로그·도서 자료를 웹진형으로 묶었습니다."
      />
      {lead ? (
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-lg border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-border bg-bg px-2 py-1 text-xs font-semibold text-accent">
                {lead.category === "news"
                  ? "뉴스"
                  : lead.category === "events"
                    ? "이벤트"
                    : lead.category === "vibe"
                      ? "바이브 코딩"
                      : "디자인/PPT"}
              </span>
              <span className="text-xs font-semibold text-text-subtle">
                {lead.date} · {getProviderLabel(lead.providerId)}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-text">
              {lead.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              {lead.summary}
            </p>
            <p className="mt-3 text-sm leading-6 text-text-subtle">
              {lead.impact}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lead.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-subtle"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <aside className="space-y-3">
            {sideItems.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <p className="text-xs font-semibold text-accent">
                  {item.date} · {getProviderLabel(item.providerId)}
                </p>
                <h3 className="mt-2 text-sm font-semibold leading-5 text-text">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-text-muted">
                  {item.summary}
                </p>
              </article>
            ))}
          </aside>
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 웹진 기사가 없습니다"
          body="뉴스 또는 바이브 코딩 카테고리에서 다시 확인하세요."
        />
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {communityItems.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong"
          >
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle">
                  {resource.language} · {resource.type}
                </span>
                <span className="mt-3 block text-sm font-semibold text-text">
                  {resource.title}
                </span>
              </span>
              <ExternalLink
                className="size-3.5 shrink-0 text-text-subtle"
                aria-hidden
              />
            </span>
            <span className="mt-2 block text-xs leading-5 text-text-muted">
              {resource.summary}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function EventPromotionsSection() {
  const eventItems = updates.filter((item) => item.category === "events");

  return (
    <section id="events" className="space-y-4">
      <SectionHeader
        icon={Sparkles}
        title="LLM 이벤트와 프로모션 워치"
        description="2배 크레딧, 친구 초대, 무료 quota, 학생/교육 혜택, 플랜 할인은 공식 확인 링크와 만료 조건을 분리해 추적합니다."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {eventItems.map((item) => {
          const eventSources = getSources(item.sourceIds);
          return (
            <article
              key={item.id}
              className="rounded-lg border border-border border-t-4 border-t-accent bg-surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-accent">
                    {getProviderLabel(item.providerId)}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold leading-5 text-text">
                    {item.title}
                  </h3>
                </div>
                <span className="rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle">
                  확인일 {item.date}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-text-muted">
                {item.summary}
              </p>
              <p className="mt-2 text-xs leading-5 text-text-subtle">
                {item.impact}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {eventSources.slice(0, 2).map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-semibold text-text-muted transition hover:text-text"
                  >
                    {source.publisher}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TaskRecommendationSection({
  recommendations,
}: {
  recommendations: TaskRecommendation[];
}) {
  const [category, setCategory] =
    useState<TaskRecommendationCategoryFilter>("all");
  const [intentQuery, setIntentQuery] = useState("");
  const categoryItems: Array<{
    id: TaskRecommendationCategoryFilter;
    label: string;
  }> = [
    "all",
    "coding",
    "ppt",
    "research",
    "automation",
    "cost",
    "learning",
    "security",
  ].map((id) => ({
    id: id as TaskRecommendationCategoryFilter,
    label: getTaskRecommendationCategoryLabel(
      id as TaskRecommendationCategoryFilter,
    ),
  }));
  const normalizedQuery = intentQuery.toLocaleLowerCase("ko-KR").trim();
  const visibleRecommendations = recommendations.filter(
    (recommendation) =>
      (category === "all" || recommendation.category === category) &&
      (!normalizedQuery ||
        [
          recommendation.title,
          recommendation.userIntent,
          recommendation.promptStarter,
          ...recommendation.rationale,
          ...recommendation.tradeoffs,
        ]
          .join(" ")
          .toLocaleLowerCase("ko-KR")
          .includes(normalizedQuery)),
  );

  return (
    <section id="task-recommendations" className="space-y-4">
      <SectionHeader
        icon={Sparkles}
        title="작업별 LLM·도구 추천"
        description="사용자가 하려는 일을 먼저 고르고, 추천 모델·대체 모델·CLI/IDE 명령어·학습 자료를 한 번에 비교합니다."
      />
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1.4fr_1fr_8rem]">
        <SegmentBar
          label="작업 유형"
          items={categoryItems}
          value={category}
          onChange={setCategory}
        />
        <label className="block">
          <span className="text-xs font-semibold text-text-subtle">
            하고 싶은 작업 검색
          </span>
          <input
            value={intentQuery}
            onChange={(event) => setIntentQuery(event.target.value)}
            placeholder="버그 수정, PPT, 최신 뉴스, 비용, 보안"
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
          />
        </label>
        <div className="rounded-md border border-border bg-bg p-3">
          <p className="text-xs font-semibold text-text-subtle">추천 결과</p>
          <p className="mt-1 text-lg font-semibold text-text">
            {visibleRecommendations.length}개
          </p>
        </div>
      </div>

      {visibleRecommendations.length ? (
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          {visibleRecommendations.map((recommendation) => {
            const primaryModels = recommendation.primaryModelIds
              .map(getModelById)
              .filter((model): model is ModelProfile => Boolean(model));
            const alternateModels = recommendation.alternateModelIds
              .map(getModelById)
              .filter((model): model is ModelProfile => Boolean(model));
            const commands = recommendation.commandIds
              .map((id) =>
                vibeCodingCommands.find((command) => command.id === id),
              )
              .filter((command): command is VibeCodingCommand =>
                Boolean(command),
              );
            const relatedResources = recommendation.resourceIds
              .map((id) =>
                learningResources.find((resource) => resource.id === id),
              )
              .filter((resource): resource is LearningResource =>
                Boolean(resource),
              );

            return (
              <article
                key={recommendation.id}
                className="min-w-0 rounded-lg border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-accent">
                      {getTaskRecommendationCategoryLabel(
                        recommendation.category,
                      )}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-text">
                      {recommendation.title}
                    </h3>
                  </div>
                  <span className="max-w-full rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-subtle">
                    {recommendation.benchmarkDomains
                      .map(getBenchmarkDomainLabel)
                      .join(" · ")}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-text-muted">
                  {recommendation.userIntent}
                </p>

                <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-subtle">
                      우선 추천
                    </p>
                    <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                      {primaryModels.map((model) => (
                        <span
                          key={model.id}
                          className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text"
                        >
                          {model.modelName}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-subtle">
                      대체 후보
                    </p>
                    <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                      {alternateModels.map((model) => (
                        <span
                          key={model.id}
                          className="rounded-md border border-dashed border-border-strong px-2.5 py-1.5 text-xs font-semibold text-text-subtle"
                        >
                          {model.modelName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
                  <TextList
                    title="추천 이유"
                    items={recommendation.rationale}
                  />
                  <TextList
                    title="주의할 점"
                    items={recommendation.tradeoffs}
                  />
                </div>

                <div className="mt-4">
                  <p className="mb-1 text-xs font-semibold text-text-subtle">
                    바로 넣을 프롬프트
                  </p>
                  <pre className="min-w-0 overflow-x-auto whitespace-pre-wrap break-words rounded-md border border-border bg-bg p-3 text-xs leading-5 text-text">
                    <code>{recommendation.promptStarter}</code>
                  </pre>
                </div>

                <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-subtle">
                      연결 명령어
                    </p>
                    <div className="mt-2 space-y-2">
                      {commands.map((command) => (
                        <div
                          key={command.id}
                          className="rounded-md border border-border bg-bg p-3"
                        >
                          <p className="text-xs font-semibold text-text">
                            {command.modelName}
                          </p>
                          <p className="mt-1 text-xs text-text-subtle">
                            {command.surface} · {command.vibeCodingFit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-subtle">
                      관련 자료
                    </p>
                    <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                      {relatedResources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
                        >
                          {resource.title}
                          <ExternalLink className="size-3" aria-hidden />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 추천이 없습니다"
          body="작업 유형을 전체로 바꾸거나 검색어를 줄이면 추천이 다시 표시됩니다."
        />
      )}
    </section>
  );
}

function matchesToolPricing(
  tool: AiCodingToolProfile,
  pricingMode: AiCodingToolPricingFilter,
) {
  if (pricingMode === "all") return true;

  const combined = [
    tool.pricing,
    tool.eventSignal,
    ...tool.tags,
    ...tool.caveats,
  ]
    .join(" ")
    .toLocaleLowerCase("ko-KR");

  switch (pricingMode) {
    case "free":
      return /무료|free|basic|community/.test(combined);
    case "student":
      return /학생|student|education|edu|교육/.test(combined);
    case "trial":
      return /체험|trial|preview|베타/.test(combined);
    case "enterprise":
      return /enterprise|team|business|pro\+|엔터프라이즈|팀/.test(combined);
    case "openSource":
      return /오픈소스|open-source|self-host|로컬|자체/.test(combined);
  }
}

function CodingToolDirectorySection({
  tools,
}: {
  tools: AiCodingToolProfile[];
}) {
  const [category, setCategory] = useState<AiCodingToolCategoryFilter>("all");
  const [pricingMode, setPricingMode] =
    useState<AiCodingToolPricingFilter>("all");
  const [query, setQuery] = useState("");

  const toolCategoryFilters: Array<{
    id: AiCodingToolCategoryFilter;
    label: string;
  }> = [
    "all",
    "AI IDE",
    "IDE 확장",
    "CLI/터미널",
    "PR 리뷰",
    "웹앱 제작",
    "클라우드 에이전트",
    "오픈소스 스택",
  ].map((id) => ({
    id: id as AiCodingToolCategoryFilter,
    label: getAiCodingToolCategoryLabel(id as AiCodingToolCategoryFilter),
  }));
  const pricingFilters: Array<{
    id: AiCodingToolPricingFilter;
    label: string;
  }> = [
    { id: "all", label: "전체" },
    { id: "free", label: "무료/프리" },
    { id: "student", label: "학생" },
    { id: "trial", label: "체험" },
    { id: "enterprise", label: "팀/엔터프라이즈" },
    { id: "openSource", label: "오픈소스/자체" },
  ];

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase("ko-KR").trim();

    return tools.filter((tool) => {
      const searchable = [
        tool.toolName,
        tool.vendor,
        tool.category,
        tool.pricing,
        tool.eventSignal,
        ...tool.bestFor,
        ...tool.integrations,
        ...tool.koreanResources,
        ...tool.caveats,
        ...tool.tags,
      ]
        .join(" ")
        .toLocaleLowerCase("ko-KR");

      return (
        (category === "all" || tool.category === category) &&
        matchesToolPricing(tool, pricingMode) &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [category, pricingMode, query, tools]);

  return (
    <section id="ai-tools" className="space-y-4">
      <SectionHeader
        icon={Boxes}
        title="AI 코딩 도구 디렉터리"
        description="Cursor, Copilot, Junie, Amazon Q, Gemini Code Assist, Jules, Amp, Zed, Augment, Tabnine, CodeRabbit, TRAE와 오픈소스 스택을 도구 관점으로 비교합니다."
      />
      <div className="grid gap-4 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1fr_1fr_18rem]">
        <SegmentBar
          label="도구 유형"
          items={toolCategoryFilters}
          value={category}
          onChange={setCategory}
        />
        <SegmentBar
          label="가격/혜택"
          items={pricingFilters}
          value={pricingMode}
          onChange={setPricingMode}
        />
        <label className="block min-w-0">
          <span className="text-xs font-semibold text-text-subtle">
            도구 검색
          </span>
          <div className="mt-2 flex h-10 items-center gap-2 rounded-md border border-border bg-bg px-3">
            <Search className="size-4 shrink-0 text-text-subtle" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cursor, 학생, PR 리뷰"
              className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-subtle"
            />
          </div>
        </label>
      </div>

      {filteredTools.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTools.map((tool) => {
            const toolSources = getSources(tool.sourceIds).slice(0, 4);
            return (
              <article
                key={tool.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-accent">
                      {tool.vendor} · {tool.category}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-text">
                      {tool.toolName}
                    </h3>
                  </div>
                  <span className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-subtle">
                    {tool.providerIds?.length
                      ? tool.providerIds.map(getProviderLabel).join(" · ")
                      : "도구 독립"}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-border bg-bg p-3">
                    <p className="text-xs font-semibold text-text-subtle">
                      가격/플랜
                    </p>
                    <p className="mt-1 text-sm leading-6 text-text-muted">
                      {tool.pricing}
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-bg p-3">
                    <p className="text-xs font-semibold text-text-subtle">
                      이벤트/혜택 신호
                    </p>
                    <p className="mt-1 text-sm leading-6 text-text-muted">
                      {tool.eventSignal}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <TextList title="추천 업무" items={tool.bestFor} />
                  <TextList title="연동" items={tool.integrations} />
                  <TextList title="주의점" items={tool.caveats} />
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-text-subtle">
                    한국어 자료/검색 허브
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tool.koreanResources.map((resource) => (
                      <span
                        key={resource}
                        className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-muted"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {toolSources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
                    >
                      {source.publisher}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 AI 코딩 도구가 없습니다"
          body="도구 유형, 가격/혜택, 검색어를 전체 기준으로 바꾸면 다시 표시됩니다."
        />
      )}
    </section>
  );
}

function fitClass(fit: VibeCodingCommand["vibeCodingFit"]) {
  switch (fit) {
    case "매우 높음":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "높음":
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300";
    case "보통":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300";
  }
}

function VibeCodingSection({ commands }: { commands: VibeCodingCommand[] }) {
  const [surface, setSurface] = useState<VibeSurfaceFilter>("all");
  const [fit, setFit] = useState<VibeFitFilter>("all");
  const surfaceFilters: Array<{ id: VibeSurfaceFilter; label: string }> = [
    { id: "all", label: "전체" },
    { id: "전용 CLI", label: "전용 CLI" },
    { id: "IDE/에이전트", label: "IDE/에이전트" },
    { id: "OpenAI 호환 API", label: "호환 API" },
    { id: "공식 SDK", label: "공식 SDK" },
    { id: "서드파티 CLI", label: "서드파티 CLI" },
    { id: "웹/에이전트", label: "웹/에이전트" },
  ];
  const fitFilters: Array<{ id: VibeFitFilter; label: string }> = [
    { id: "all", label: "전체" },
    { id: "매우 높음", label: "매우 높음" },
    { id: "높음", label: "높음" },
    { id: "보통", label: "보통" },
    { id: "제한적", label: "제한적" },
  ];
  const filteredCommands = commands.filter(
    (command) =>
      (surface === "all" || command.surface === surface) &&
      (fit === "all" || command.vibeCodingFit === fit),
  );

  return (
    <section id="vibe-coding" className="space-y-4">
      <SectionHeader
        icon={Code2}
        title="AI 바이브 코딩 허브"
        description="전용 CLI, OpenAI 호환 API, 공식 SDK, 로컬 배포를 모델별 명령어와 운영 주의점으로 비교합니다."
      />
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1.3fr_1fr_8rem]">
        <SegmentBar
          label="실행 표면"
          items={surfaceFilters}
          value={surface}
          onChange={setSurface}
        />
        <SegmentBar
          label="바이브 코딩 적합도"
          items={fitFilters}
          value={fit}
          onChange={setFit}
        />
        <div className="rounded-md border border-border bg-bg p-3">
          <p className="text-xs font-semibold text-text-subtle">필터 결과</p>
          <p className="mt-1 text-lg font-semibold text-text">
            {filteredCommands.length}개
          </p>
        </div>
      </div>
      {filteredCommands.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredCommands.map((command) => (
            <article
              key={command.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-accent">
                    {getProviderLabel(command.providerId)} · {command.surface}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-text">
                    {command.modelName}
                  </h3>
                </div>
                <span
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold ${fitClass(
                    command.vibeCodingFit,
                  )}`}
                >
                  {command.vibeCodingFit}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                {command.useCase}
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold text-text-subtle">
                    설치/준비
                  </p>
                  <pre className="min-h-24 overflow-x-auto rounded-md border border-border bg-bg p-3 text-xs leading-5 text-text">
                    <code>{command.installCommand}</code>
                  </pre>
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold text-text-subtle">
                    실행 예시
                  </p>
                  <pre className="min-h-24 overflow-x-auto rounded-md border border-border bg-bg p-3 text-xs leading-5 text-text">
                    <code>{command.command}</code>
                  </pre>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <TextList title="셋업 포인트" items={command.setupNotes} />
                <TextList title="주의점" items={command.caveats} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 바이브 코딩 명령어가 없습니다"
          body="실행 표면이나 적합도 필터를 전체로 바꾸면 명령어가 다시 표시됩니다."
        />
      )}
    </section>
  );
}

function DesignWorkflowSection() {
  const designUpdates = updates
    .filter((item) => item.category === "design")
    .slice(0, 2);
  const pptSignals = benchmarkEntries.filter((entry) => entry.domain === "ppt");

  return (
    <section id="design" className="space-y-4">
      <SectionHeader
        icon={Palette}
        title="디자인/PPT 산출물 비교"
        description="PPT, 웹진, 문서 기반 산출물은 모델 점수보다 입력 자료 처리, 에이전트 실행, 검수 흐름을 기준으로 비교합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-border bg-surface p-5">
          <p className="text-xs font-semibold text-accent">작업 흐름</p>
          <h3 className="mt-2 text-lg font-semibold text-text">
            AI 웹진·PPT 제작 워크플로
          </h3>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Manus는 태스크형 제작, Gemini는 영상/PDF/이미지 이해, Mistral은
            OCR과 자체 배포 가능성, GPT/Claude는 문안과 구조화 검수에 강점을
            둡니다.
          </p>
          <ul className="mt-4 space-y-2">
            {designUpdates.map((item) => (
              <li key={item.id} className="text-xs leading-5 text-text-muted">
                <span className="font-semibold text-text">{item.title}</span>{" "}
                {item.summary}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text">
              PPT/문서 분야 운영 지표
            </h3>
            <p className="mt-1 text-xs text-text-subtle">
              정량 벤치마크가 아닌 공식 기능·운영 신호는 metric으로 구분합니다.
            </p>
          </div>
          <div className="divide-y divide-border">
            {pptSignals.map((entry) => (
              <div
                key={entry.id}
                className="grid gap-3 px-4 py-3 md:grid-cols-[8rem_1fr_7rem]"
              >
                <span className="text-xs font-semibold text-accent">
                  {getProviderLabel(entry.providerId)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">
                    {entry.modelName}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    {entry.metric} · {entry.context}
                  </p>
                </div>
                <span className="text-right text-xs font-semibold text-text-subtle">
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function ModelCards({
  models,
  selectedModelId,
  onSelectModel,
}: {
  models: ModelProfile[];
  selectedModelId: string;
  onSelectModel: (id: string) => void;
}) {
  return (
    <section id="comparison" className="space-y-4">
      <SectionHeader
        icon={Boxes}
        title="현재 주요 모델"
        description="상용 LLM과 에이전트 서비스를 같은 표면에서 보되, Manus는 모델보다 태스크 플랫폼으로 분리했습니다."
      />
      {models.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {models.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelectModel(profile.id)}
              className={`min-h-[15rem] rounded-lg border border-border border-l-4 bg-surface p-4 text-left transition hover:border-border-strong ${accentBorder(
                profile,
              )} ${selectedModelId === profile.id ? "ring-2 ring-accent" : ""}`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span
                    className={`block text-xs font-semibold ${accentText(profile)}`}
                  >
                    {profile.providerName}
                  </span>
                  <span className="mt-1 block text-base font-semibold text-text">
                    {profile.modelName}
                  </span>
                </span>
                <span className="whitespace-nowrap rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle">
                  {profile.status}
                </span>
              </span>
              <span className="mt-3 block text-sm leading-6 text-text-muted">
                {profile.oneLine}
              </span>
              <span className="mt-4 grid gap-2">
                {profile.specs.slice(0, 3).map((spec) => (
                  <span
                    key={spec.label}
                    className="flex items-center justify-between gap-3 border-t border-border pt-2 text-xs"
                  >
                    <span className="shrink-0 whitespace-nowrap text-text-subtle">
                      {spec.label}
                    </span>
                    <span className="text-right font-semibold text-text">
                      {spec.value}
                    </span>
                  </span>
                ))}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 모델이 없습니다"
          body="다른 제공사나 검색어로 다시 좁혀보세요."
        />
      )}
    </section>
  );
}

function ModelDetail({ profile }: { profile: ModelProfile }) {
  const profileSources = getSources(profile.sourceIds);
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`text-xs font-semibold ${accentText(profile)}`}>
              {profile.productName}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-text">
              {profile.modelName}
            </h2>
          </div>
          <p className="rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-subtle">
            확인일 {profile.verifiedAt}
          </p>
        </div>
        <p className="mt-4 text-sm leading-6 text-text-muted">
          {profile.summary}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <TextList title="강점" items={profile.strengths} />
          <TextList title="추천 업무" items={profile.bestFor} />
          <TextList title="주의점" items={profile.caveats} />
        </div>
      </article>
      <article className="rounded-lg border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-text">스펙 요약</h3>
        <dl className="mt-4 space-y-2">
          {profile.specs.map((spec) => (
            <div
              key={spec.label}
              className="flex items-start justify-between gap-4 rounded-md border border-border bg-bg p-3"
            >
              <dt className="text-xs text-text-subtle">{spec.label}</dt>
              <dd className="max-w-[14rem] text-right text-xs font-semibold text-text">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          {profileSources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
            >
              {source.publisher} <ExternalLink className="size-3" aria-hidden />
            </a>
          ))}
        </div>
      </article>
    </section>
  );
}

function BenchmarkBoard() {
  const [domain, setDomain] = useState<BenchmarkDomainFilter>("all");
  const benchmarkDomainFilters: Array<{
    id: BenchmarkDomainFilter;
    label: string;
  }> = [
    "all",
    "overall",
    "coding",
    "ppt",
    "research",
    "multimodal",
    "cost",
    "agent",
  ].map((id) => ({
    id: id as BenchmarkDomainFilter,
    label: getBenchmarkDomainLabel(id as BenchmarkDomainFilter),
  }));
  const visibleEntries = benchmarkEntries.filter(
    (entry) => domain === "all" || entry.domain === domain,
  );
  const maxScore = Math.max(
    1,
    ...visibleEntries.map((entry) => Number(entry.score.replace("*", "")) || 0),
  );
  return (
    <section id="benchmarks" className="space-y-4">
      <SectionHeader
        icon={BarChart3}
        title="벤치마크와 비용"
        description="종합 리더보드, SWE-Bench Pro, SWE-Lancer, PaperBench, MLE-bench, BrowseComp, RE-Bench, EVMbench, Cybench, GDPval, SpreadsheetBench를 분야별 점수·규모·비용·latency와 함께 봅니다."
      />
      <SegmentBar
        label="분야"
        items={benchmarkDomainFilters}
        value={domain}
        onChange={setDomain}
      />
      <div className="rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-[4.5rem_1fr_5rem] gap-3 border-b border-border px-4 py-3 text-xs font-semibold text-text-subtle md:grid-cols-[5rem_1.4fr_1fr_1fr_1fr_5rem]">
          <span>순위</span>
          <span>모델</span>
          <span className="hidden md:block">가격</span>
          <span className="hidden md:block">속도</span>
          <span className="hidden md:block">Latency</span>
          <span className="text-right">점수/규모</span>
        </div>
        {visibleEntries.map((entry) => {
          const numericScore = Number(entry.score.replace("*", "")) || 0;
          const width = `${Math.max(4, (numericScore / maxScore) * 100)}%`;
          return (
            <div
              key={entry.id}
              className="grid grid-cols-[4.5rem_1fr_5rem] gap-3 border-b border-border px-4 py-3 last:border-b-0 md:grid-cols-[5rem_1.4fr_1fr_1fr_1fr_5rem]"
            >
              <span className="text-xs font-semibold text-text-subtle">
                {entry.rankLabel}
              </span>
              <div>
                <p className="text-sm font-semibold text-text">
                  {entry.modelName}
                </p>
                <p className="mt-1 text-xs text-text-subtle">
                  {getProviderLabel(entry.providerId)} ·{" "}
                  {getBenchmarkDomainLabel(entry.domain)} · {entry.context}
                </p>
                <p className="mt-1 text-xs text-text-muted">{entry.metric}</p>
                <div className="mt-2 h-1.5 rounded-md bg-surface-2">
                  <div
                    className="h-1.5 rounded-md bg-accent"
                    style={{ width }}
                  />
                </div>
              </div>
              <span className="hidden text-xs text-text-muted md:block">
                {entry.price}
              </span>
              <span className="hidden text-xs text-text-muted md:block">
                {entry.speed}
              </span>
              <span className="hidden text-xs text-text-muted md:block">
                {entry.latency}
              </span>
              <span className="text-right text-sm font-semibold text-text">
                {entry.score}
              </span>
            </div>
          );
        })}
        {!visibleEntries.length ? (
          <div className="px-4 py-4">
            <EmptyState
              title="조건에 맞는 벤치마크가 없습니다"
              body="다른 분야 필터를 선택하면 지표가 다시 표시됩니다."
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ComparisonMatrix() {
  return (
    <section className="space-y-4">
      <SectionHeader
        icon={Table2}
        title="기능 비교"
        description="최신 모델 스펙과 제품 성격이 다른 항목은 같은 축에 놓되 해석 기준을 분리했습니다."
      />
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-[112rem] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-xs text-text-subtle">
              <th className="w-36 px-4 py-3 font-semibold">축</th>
              {comparisonProviderOrder.map((providerId) => {
                const provider = providerCatalog.find(
                  (item) => item.id === providerId,
                );
                return (
                  <th key={providerId} className="px-4 py-3 font-semibold">
                    {provider?.shortLabel ?? getProviderLabel(providerId)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0"
              >
                <th className="bg-bg px-4 py-4 align-top text-xs font-semibold text-text">
                  {row.axis}
                </th>
                {comparisonProviderOrder.map((providerId) => (
                  <td
                    key={providerId}
                    className="px-4 py-4 align-top text-xs leading-5 text-text-muted"
                  >
                    {row.cells[providerId]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ManualGuides({ guides }: { guides: ManualGuide[] }) {
  return (
    <section id="manuals" className="space-y-4">
      <SectionHeader
        icon={CircleHelp}
        title="사용법 비교"
        description="제품별 문법보다 실무 의사결정과 오류 처리 흐름을 우선 정리했습니다."
      />
      {guides.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {guides.map((guide) => (
            <article
              key={guide.id}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-accent">
                  {getProviderLabel(guide.providerId)}
                </span>
                <span className="rounded-md border border-border bg-bg px-2 py-1 text-xs font-semibold text-text-subtle">
                  {guide.level}
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-text">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {guide.summary}
              </p>
              <ol className="mt-4 space-y-2">
                {guide.steps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 text-xs leading-5 text-text-muted"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-ink text-[0.6875rem] font-semibold text-ink-fg">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 사용법 항목이 없습니다"
          body="전체 보기로 전환하면 기본 매뉴얼을 확인할 수 있습니다."
        />
      )}
    </section>
  );
}

function PersonaPlaybooks({ guides }: { guides: PersonaGuide[] }) {
  return (
    <section id="personas" className="space-y-4">
      <SectionHeader
        icon={Users}
        title="직군별 사용법 플레이북"
        description="개발자, PM, 마케터, 리서처가 모델을 고르는 기준과 검증 흐름을 서로 다른 업무 맥락으로 정리했습니다."
      />
      {guides.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {guides.map((guide) => {
            const recommendedModels = guide.recommendedModelIds
              .map(getModelById)
              .filter((model): model is ModelProfile => Boolean(model));
            const alternateModels = guide.alternateModelIds
              .map(getModelById)
              .filter((model): model is ModelProfile => Boolean(model));

            return (
              <article
                key={guide.id}
                className="overflow-hidden rounded-lg border border-border bg-surface"
              >
                <div className="px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-accent">
                        {guide.role}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-text">
                        {guide.title}
                      </h3>
                    </div>
                    <span className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-subtle">
                      {guide.providerIds.map(getProviderLabel).join(" · ")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text-muted">
                    {guide.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recommendedModels.map((model) => (
                      <span
                        key={model.id}
                        className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text"
                      >
                        {model.modelName}
                      </span>
                    ))}
                    {alternateModels.map((model) => (
                      <span
                        key={model.id}
                        className="rounded-md border border-dashed border-border-strong px-2.5 py-1.5 text-xs font-semibold text-text-subtle"
                      >
                        대체 {model.modelName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border px-4 py-4">
                  <p className="text-xs font-semibold text-text-subtle">
                    업무 흐름
                  </p>
                  <ol className="mt-3 space-y-2">
                    {guide.workflow.map((step, index) => (
                      <li
                        key={step}
                        className="flex gap-3 text-xs leading-5 text-text-muted"
                      >
                        <span className="grid size-5 shrink-0 place-items-center rounded-md bg-ink text-[0.6875rem] font-semibold text-ink-fg">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="grid border-t border-border md:grid-cols-2">
                  <div className="px-4 py-4 md:border-r md:border-border">
                    <p className="text-xs font-semibold text-text-subtle">
                      프롬프트 예시
                    </p>
                    <ul className="mt-3 space-y-2">
                      {guide.promptExamples.map((prompt) => (
                        <li
                          key={prompt}
                          className="text-xs leading-5 text-text-muted"
                        >
                          {prompt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-border px-4 py-4 md:border-t-0">
                    <p className="text-xs font-semibold text-text-subtle">
                      검증 체크
                    </p>
                    <ul className="mt-3 space-y-2">
                      {guide.checklist.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-xs leading-5 text-text-muted"
                        >
                          <CheckCircle2
                            className="mt-0.5 size-3.5 shrink-0 text-accent"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 직군별 플레이북이 없습니다"
          body="검색어를 줄이거나 전체 카테고리에서 다시 확인하세요."
        />
      )}
    </section>
  );
}

function matchesResourceFocus(
  resource: LearningResource,
  focus: ResourceFocusFilter,
) {
  const tagSet = new Set(resource.tags);
  switch (focus) {
    case "modelChannels":
      return (
        tagSet.has("모델별") ||
        tagSet.has("공식 채널") ||
        tagSet.has("후보 채널") ||
        resource.id.includes("model-")
      );
    case "koreanCreators":
      return (
        resource.language === "한국어" &&
        (tagSet.has("유튜브") ||
          tagSet.has("유튜버") ||
          tagSet.has("코드팩토리") ||
          tagSet.has("개발동생") ||
          resource.id.includes("youtube"))
      );
    case "coursePlatforms":
      return (
        tagSet.has("강좌 플랫폼") ||
        tagSet.has("인프런") ||
        tagSet.has("인프런 대체") ||
        tagSet.has("원격 교육") ||
        tagSet.has("K-디지털")
      );
    case "books":
      return resource.type === "도서";
    case "community":
      return resource.type === "커뮤니티";
    case "officialKo":
      return resource.type === "공식 문서" && resource.language === "한국어";
    case "codingTools":
      return (
        tagSet.has("AI 코딩") ||
        tagSet.has("AI 코딩 도구") ||
        tagSet.has("AI IDE") ||
        tagSet.has("CLI") ||
        tagSet.has("바이브 코딩")
      );
    default:
      return true;
  }
}

function ResourceLibrary({ resources }: { resources: LearningResource[] }) {
  const [language, setLanguage] = useState<ResourceLanguageFilter>("all");
  const [resourceType, setResourceType] = useState<ResourceTypeFilter>("all");
  const [level, setLevel] = useState<ResourceLevelFilter>("all");
  const [resourceProvider, setResourceProvider] =
    useState<ResourceProviderFilter>("all");
  const [focus, setFocus] = useState<ResourceFocusFilter>("all");
  const [tag, setTag] = useState("all");
  const languageFilters: Array<{ id: ResourceLanguageFilter; label: string }> =
    [
      { id: "all", label: "전체" },
      { id: "한국어", label: "한국어" },
      { id: "영어", label: "영어" },
    ];
  const typeFilters: Array<{ id: ResourceTypeFilter; label: string }> = [
    { id: "all", label: "전체" },
    { id: "공식 문서", label: "공식 문서" },
    { id: "강좌/영상", label: "유튜브/영상" },
    { id: "블로그/글", label: "블로그/글" },
    { id: "도서", label: "도서" },
    { id: "커뮤니티", label: "커뮤니티" },
  ];
  const levelFilters: Array<{ id: ResourceLevelFilter; label: string }> = [
    { id: "all", label: "전체" },
    { id: "입문", label: "입문" },
    { id: "실무", label: "실무" },
    { id: "고급", label: "고급" },
  ];
  const providerResourceFilters: Array<{
    id: ResourceProviderFilter;
    label: string;
  }> = [
    { id: "all", label: "전체 제공사" },
    ...providerCatalog.map((provider) => ({
      id: provider.id,
      label: provider.label,
    })),
  ];
  const focusFilters: Array<{ id: ResourceFocusFilter; label: string }> = [
    { id: "all", label: "전체 묶음" },
    { id: "modelChannels", label: "모델별 채널" },
    { id: "koreanCreators", label: "국내 유튜버" },
    { id: "coursePlatforms", label: "강좌 플랫폼" },
    { id: "books", label: "도서/신간" },
    { id: "community", label: "커뮤니티" },
    { id: "officialKo", label: "한국어 공식" },
    { id: "codingTools", label: "AI 코딩 도구" },
  ];
  const tagFilters = useMemo(() => {
    const tags = new Set<string>();
    for (const resource of resources) {
      for (const resourceTag of resource.tags) tags.add(resourceTag);
    }
    return ["all", ...[...tags].toSorted((a, b) => a.localeCompare(b, "ko"))];
  }, [resources]);
  const filteredResources = useMemo(
    () =>
      resources
        .filter(
          (resource) =>
            (language === "all" || resource.language === language) &&
            (resourceType === "all" || resource.type === resourceType) &&
            (level === "all" || resource.level === level) &&
            (resourceProvider === "all" ||
              resource.providerIds?.includes(resourceProvider)) &&
            matchesResourceFocus(resource, focus) &&
            (tag === "all" || resource.tags.includes(tag)),
        )
        .toSorted((a, b) =>
          a.language === b.language ? 0 : a.language === "한국어" ? -1 : 1,
        ),
    [focus, language, level, resourceProvider, resourceType, resources, tag],
  );
  const grouped = useMemo(() => {
    return {
      official: filteredResources.filter(
        (resource) => resource.type === "공식 문서",
      ),
      videos: filteredResources.filter(
        (resource) => resource.type === "강좌/영상",
      ),
      blogs: filteredResources.filter(
        (resource) => resource.type === "블로그/글",
      ),
      books: filteredResources.filter((resource) => resource.type === "도서"),
      community: filteredResources.filter(
        (resource) => resource.type === "커뮤니티",
      ),
    };
  }, [filteredResources]);
  const coverageItems = useMemo(() => {
    const countByType = (type: LearningResource["type"]) =>
      filteredResources.filter((resource) => resource.type === type).length;
    const sourceCount = new Set(
      filteredResources.flatMap((resource) => resource.sourceIds),
    ).size;

    return [
      {
        label: "한국어",
        value: filteredResources.filter(
          (resource) => resource.language === "한국어",
        ).length,
      },
      { label: "영상", value: countByType("강좌/영상") },
      { label: "도서", value: countByType("도서") },
      { label: "공식", value: countByType("공식 문서") },
      { label: "출처", value: sourceCount },
    ];
  }, [filteredResources]);

  return (
    <section id="learning" className="space-y-4">
      <SectionHeader
        icon={Library}
        title="강좌와 도서"
        description="공식 문서, 한국어 유튜브, 교육기관, 원격 강좌, 기술 블로그, 도서 검색 허브를 언어·형식·난이도·제공사·태그로 좁혀 봅니다."
      />
      <div className="grid gap-4 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1fr_1.35fr_1fr_1fr]">
        <SegmentBar
          label="자료 언어"
          items={languageFilters}
          value={language}
          onChange={setLanguage}
        />
        <SegmentBar
          label="자료 형식"
          items={typeFilters}
          value={resourceType}
          onChange={setResourceType}
        />
        <SegmentBar
          label="난이도"
          items={levelFilters}
          value={level}
          onChange={setLevel}
        />
        <label className="block">
          <span className="text-xs font-semibold text-text-subtle">
            자료 묶음
          </span>
          <select
            value={focus}
            onChange={(event) =>
              setFocus(event.target.value as ResourceFocusFilter)
            }
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
          >
            {focusFilters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-text-subtle">
            관련 제공사
          </span>
          <select
            value={resourceProvider}
            onChange={(event) =>
              setResourceProvider(event.target.value as ResourceProviderFilter)
            }
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
          >
            {providerResourceFilters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block xl:col-span-2">
          <span className="text-xs font-semibold text-text-subtle">
            세부 태그
          </span>
          <select
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
          >
            {tagFilters.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "전체 태그" : item}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-md border border-border bg-bg p-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-text-subtle">
                필터 결과
              </p>
              <p className="mt-1 text-lg font-semibold text-text">
                {filteredResources.length}개
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLanguage("all");
                setResourceType("all");
                setLevel("all");
                setResourceProvider("all");
                setFocus("all");
                setTag("all");
              }}
              className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
            >
              초기화
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {coverageItems.map((item) => (
              <span
                key={item.label}
                className="rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle"
              >
                {item.label} {item.value}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-3 xl:grid-cols-5">
        <ResourceColumn title="공식 문서" resources={grouped.official} />
        <ResourceColumn title="유튜브/영상" resources={grouped.videos} />
        <ResourceColumn title="블로그/글" resources={grouped.blogs} />
        <ResourceColumn title="도서" resources={grouped.books} />
        <ResourceColumn title="커뮤니티" resources={grouped.community} />
      </div>
    </section>
  );
}

function ResourceColumn({
  title,
  resources,
}: {
  title: string;
  resources: LearningResource[];
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-text">{title}</h3>
      <div className="mt-3 space-y-3">
        {resources.length ? (
          resources.map((resource) => {
            const resourceSources = getSources(resource.sourceIds);
            const primarySource = resourceSources[0];
            const sourceKinds = [
              ...new Set(
                resourceSources.map((source) => sourceKindLabel(source.kind)),
              ),
            ];
            const lastChecked = resourceSources
              .map((source) => source.lastChecked)
              .toSorted((a, b) => b.localeCompare(a))[0];

            return (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-border bg-bg p-3 transition hover:border-border-strong"
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-sm font-semibold text-text">
                      {resource.title}
                    </span>
                    <span className="mt-1 block text-xs text-text-subtle">
                      {resource.author} · {resource.language} ·{" "}
                      {resource.level}
                    </span>
                  </span>
                  <ExternalLink
                    className="size-3.5 shrink-0 text-text-subtle"
                    aria-hidden
                  />
                </span>
                <span className="mt-2 block text-xs leading-5 text-text-muted">
                  {resource.summary}
                </span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {primarySource ? (
                    <span className="rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle">
                      {primarySource.publisher}
                    </span>
                  ) : null}
                  {sourceKinds.map((kind) => (
                    <span
                      key={kind}
                      className="rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle"
                    >
                      {kind}
                    </span>
                  ))}
                  {lastChecked ? (
                    <span className="rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle">
                      확인 {lastChecked}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </a>
            );
          })
        ) : (
          <p className="rounded-md border border-border bg-bg p-3 text-xs leading-5 text-text-subtle">
            현재 필터에 맞는 항목이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

function statusClass(status: string) {
  switch (status) {
    case "정상":
    case "pass":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "확인 필요":
    case "warn":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
    case "fail":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300";
    default:
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300";
  }
}

function priorityClass(priority: string) {
  switch (priority) {
    case "P0":
    case "높음":
      return "text-rose-700 dark:text-rose-300";
    case "P1":
    case "보통":
      return "text-amber-700 dark:text-amber-300";
    default:
      return "text-text-subtle";
  }
}

function EditorialOpsSection({
  monitors,
  pipelineItems,
  backlog,
}: {
  monitors: CurationMonitor[];
  pipelineItems: UpdatePipelineItem[];
  backlog: FeatureBacklogItem[];
}) {
  const [drafts, setDrafts] = useState(getInitialWorkbenchDrafts);
  const failedChecks = contentAudit.checks.filter(
    (check) => check.status === "fail",
  ).length;
  const warningChecks = contentAudit.checks.filter(
    (check) => check.status === "warn",
  ).length;

  useEffect(() => {
    saveWorkbenchDrafts(drafts);
  }, [drafts]);

  const updateDraft = (
    item: UpdatePipelineItem,
    patch: Partial<Pick<PipelineDraft, "stage" | "note">>,
  ) => {
    setDrafts((current) => {
      const previous = current[item.id] ?? {
        stage: item.stage,
        note: "",
        updatedAt: SNAPSHOT_DATE,
      };

      return {
        ...current,
        [item.id]: {
          ...previous,
          ...patch,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
      };
    });
  };

  const resetDraft = (item: UpdatePipelineItem) => {
    setDrafts((current) => {
      const next = { ...current };
      delete next[item.id];
      return next;
    });
  };

  return (
    <section id="ops" className="space-y-4">
      <SectionHeader
        icon={Gauge}
        title="편집실과 자동화 준비"
        description="포털을 최신 상태로 유지하기 위한 출처 모니터링, 업데이트 후보, 다음 기능 백로그를 운영 화면처럼 정리했습니다."
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-lg border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-text">
                소스 모니터링 큐
              </h3>
              <p className="mt-1 text-xs text-text-subtle">
                변동성이 높은 공식 문서와 벤치마크를 우선순위별로 확인합니다.
              </p>
            </div>
            <span className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-subtle">
              {monitors.length}개 소스
            </span>
          </div>
          {monitors.length ? (
            <div className="divide-y divide-border">
              {monitors.map((monitor) => {
                const source = getSources([monitor.sourceId])[0];
                return (
                  <div
                    key={monitor.id}
                    className="grid gap-3 px-4 py-3 lg:grid-cols-[8rem_1fr_8rem]"
                  >
                    <div>
                      <p
                        className={`text-xs font-semibold ${priorityClass(monitor.priority)}`}
                      >
                        {monitor.priority}
                      </p>
                      <p className="mt-1 text-xs text-text-subtle">
                        {monitor.cadence}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {source?.title ?? monitor.sourceId}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-text-muted">
                        {monitor.nextAction}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-text-subtle">
                        {monitor.automationHint}
                      </p>
                    </div>
                    <div className="flex items-start justify-between gap-2 lg:block lg:text-right">
                      <span
                        className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${statusClass(monitor.status)}`}
                      >
                        {monitor.status}
                      </span>
                      <p className="mt-0 text-xs text-text-subtle lg:mt-2">
                        {monitor.nextCheck}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4">
              <EmptyState
                title="조건에 맞는 모니터링 항목이 없습니다"
                body="검색어나 제공사 필터를 조정하면 운영 항목을 볼 수 있습니다."
              />
            </div>
          )}
        </article>

        <article className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-text">
                콘텐츠 품질 게이트
              </h3>
              <p className="mt-1 text-xs leading-5 text-text-subtle">
                실패 {failedChecks}개 · 주의 {warningChecks}개 · 통과{" "}
                {contentAudit.checks.length - failedChecks - warningChecks}개
              </p>
            </div>
            <span
              className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold ${statusClass(contentAudit.passed ? "pass" : "fail")}`}
            >
              {contentAudit.passed ? "통과" : "실패"}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {contentAudit.checks.map((check) => (
              <div
                key={check.id}
                className="rounded-md border border-border bg-bg p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-text">
                    {check.label}
                  </p>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[0.6875rem] font-semibold ${statusClass(check.status)}`}
                  >
                    {check.status}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-text-subtle">
                  {check.detail}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text">
              업데이트 후보 파이프라인
            </h3>
            <p className="mt-1 text-xs text-text-subtle">
              자동 수집 전에도 어떤 정보가 어떤 단계에 있는지 추적합니다.
            </p>
          </div>
          <div className="divide-y divide-border">
            {pipelineItems.length ? (
              pipelineItems.map((item) => {
                const draft = drafts[item.id];
                const currentStage = draft?.stage ?? item.stage;
                const note = draft?.note ?? "";

                return (
                  <div key={item.id} className="px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-text-subtle">
                          {getProviderLabel(item.providerId)} · 원본{" "}
                          {item.stage}
                          {draft ? ` · 수정 ${draft.updatedAt}` : ""}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold ${priorityClass(item.priority)}`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-text-muted">
                      {item.summary}
                    </p>
                    <div className="mt-3 rounded-md border border-border bg-bg p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text">
                          {currentStage}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateDraft(item, {
                                stage: movePipelineStage(
                                  currentStage,
                                  "previous",
                                ),
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
                          >
                            <ChevronLeft className="size-3.5" aria-hidden />
                            이전
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateDraft(item, {
                                stage: movePipelineStage(currentStage, "next"),
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
                          >
                            다음
                            <ChevronRight className="size-3.5" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => resetDraft(item)}
                            className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-subtle transition hover:text-text"
                          >
                            초기화
                          </button>
                        </div>
                      </div>
                      <label className="mt-3 block">
                        <span className="text-xs font-semibold text-text-subtle">
                          편집 메모
                        </span>
                        <textarea
                          value={note}
                          onChange={(event) =>
                            updateDraft(item, { note: event.target.value })
                          }
                          placeholder="원문 확인, 번역 기준, 게시 전 체크 포인트"
                          className="mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
                        />
                      </label>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {item.acceptance.slice(0, 2).map((line) => (
                        <li
                          key={line}
                          className="flex gap-2 text-xs leading-5 text-text-subtle"
                        >
                          <CheckCircle2
                            className="mt-0.5 size-3.5 shrink-0 text-accent"
                            aria-hidden
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            ) : (
              <div className="p-4">
                <EmptyState
                  title="조건에 맞는 업데이트 후보가 없습니다"
                  body="전체 또는 편집실 카테고리에서 후보를 확인하세요."
                />
              </div>
            )}
          </div>
        </article>

        <article className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text">다음 기능 제안</h3>
            <p className="mt-1 text-xs text-text-subtle">
              포털 완성도를 계속 올리기 위한 우선순위와 완료 기준입니다.
            </p>
          </div>
          <div className="divide-y divide-border">
            {backlog.length ? (
              backlog.map((item) => (
                <div key={item.id} className="px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-text-subtle">
                        {item.status}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${priorityClass(item.priority)}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-text-muted">
                    {item.rationale}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-text-subtle">
                    완료 기준: {item.acceptance[0]}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4">
                <EmptyState
                  title="조건에 맞는 기능 제안이 없습니다"
                  body="검색어를 줄이면 전체 백로그를 볼 수 있습니다."
                />
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function ExportDeskSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const snapshotCandidates = useMemo(() => getSourceSnapshotCandidates(), []);
  const exportBundles = useMemo<ExportBundle[]>(
    () => [
      {
        id: "newsletter",
        title: "뉴스레터 Markdown",
        metric: `${updates.length}개 업데이트`,
        filename: `aidigestdesk-newsletter-${SNAPSHOT_DATE}.md`,
        mimeType: "text/markdown",
        content: createNewsletterMarkdown(),
        preview: createNewsletterMarkdown({ maxUpdates: 2, maxBenchmarks: 2 }),
        icon: Clipboard,
      },
      {
        id: "source-monitor",
        title: "소스 모니터 CSV",
        metric: `${curationMonitors.length}개 모니터`,
        filename: `aidigestdesk-source-monitor-${SNAPSHOT_DATE}.csv`,
        mimeType: "text/csv",
        content: createSourceMonitorCsv(),
        preview: createSourceMonitorCsv().split("\n").slice(0, 4).join("\n"),
        icon: FileText,
      },
      {
        id: "pipeline-json",
        title: "편집 파이프라인 JSON",
        metric: `${updatePipeline.length}개 후보`,
        filename: `aidigestdesk-pipeline-${SNAPSHOT_DATE}.json`,
        mimeType: "application/json",
        content: createPipelineExportJson(),
        preview: createPipelineExportJson().split("\n").slice(0, 12).join("\n"),
        icon: FileJson,
      },
      {
        id: "snapshot-runbook",
        title: "스냅샷 Runbook",
        metric: `${snapshotCandidates.length}개 대상`,
        filename: `aidigestdesk-source-snapshot-runbook-${SNAPSHOT_DATE}.md`,
        mimeType: "text/markdown",
        content: createSnapshotRunbookMarkdown(snapshotCandidates),
        preview: createSnapshotRunbookMarkdown(snapshotCandidates)
          .split("\n")
          .slice(0, 10)
          .join("\n"),
        icon: Download,
      },
    ],
    [snapshotCandidates],
  );

  const handleCopy = async (bundle: ExportBundle) => {
    const copied = await copyText(bundle.content).catch(() => false);
    setCopiedId(copied ? bundle.id : `${bundle.id}-failed`);
  };

  return (
    <section id="exports" className="space-y-4">
      <SectionHeader
        icon={Download}
        title="내보내기와 스냅샷 실행"
        description="포털 업데이트를 뉴스레터, 소스 점검표, 편집 파이프라인, 공식 소스 스냅샷 실행 계획으로 재사용합니다."
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {exportBundles.map((bundle) => {
          const Icon = bundle.icon;
          const copied = copiedId === bundle.id;
          const failed = copiedId === `${bundle.id}-failed`;

          return (
            <article
              key={bundle.id}
              className="flex min-h-[20rem] min-w-0 flex-col rounded-lg border border-border bg-surface"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text">
                    {bundle.title}
                  </p>
                  <p className="mt-1 text-xs text-text-subtle">
                    {bundle.metric}
                  </p>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-bg text-accent">
                  <Icon className="size-4" aria-hidden />
                </span>
              </div>
              <pre className="min-h-0 min-w-0 flex-1 overflow-auto whitespace-pre-wrap break-all px-4 py-3 text-xs leading-5 text-text-muted">
                {bundle.preview}
              </pre>
              <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
                <button
                  type="button"
                  onClick={() => downloadTextFile(bundle)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
                >
                  <Download className="size-3.5" aria-hidden />
                  다운로드
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopy(bundle)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
                >
                  {copied ? (
                    <CheckCircle2 className="size-3.5" aria-hidden />
                  ) : (
                    <Copy className="size-3.5" aria-hidden />
                  )}
                  {copied ? "복사됨" : failed ? "복사 실패" : "복사"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ModelCostCalculator() {
  const [scenario, setScenario] = useState({
    inputTokensPerRun: 10000,
    outputTokensPerRun: 2000,
    runsPerMonth: 1000,
  });
  const estimates = useMemo(() => calculateModelCosts(scenario), [scenario]);
  const cheapest = estimates[0];

  const updateScenario = (key: keyof typeof scenario, value: string) => {
    const parsed = Number(value);
    setScenario((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    }));
  };

  return (
    <section id="costs" className="space-y-4">
      <SectionHeader
        icon={Calculator}
        title="모델 비용 계산기"
        description="월 호출량 기준으로 주요 모델의 예상 토큰 비용을 비교합니다. 벤치마크 환산 단가는 비교용으로 표시합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[22rem_1fr]">
        <article className="rounded-lg border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text">사용량 시나리오</h3>
          <div className="mt-4 space-y-3">
            <NumberField
              label="1회 입력 토큰"
              value={scenario.inputTokensPerRun}
              onChange={(value) => updateScenario("inputTokensPerRun", value)}
            />
            <NumberField
              label="1회 출력 토큰"
              value={scenario.outputTokensPerRun}
              onChange={(value) => updateScenario("outputTokensPerRun", value)}
            />
            <NumberField
              label="월 실행 횟수"
              value={scenario.runsPerMonth}
              onChange={(value) => updateScenario("runsPerMonth", value)}
            />
          </div>
          <div className="mt-4 rounded-md border border-border bg-bg p-3">
            <p className="text-xs text-text-subtle">가장 낮은 예상 비용</p>
            <p className="mt-1 text-lg font-semibold text-text">
              {cheapest?.profile.modelName ?? "-"} ·{" "}
              {cheapest?.formattedTotal ?? "$0.00"}
            </p>
            <p className="mt-1 text-xs leading-5 text-text-subtle">
              Manus, Kimi, Qwen처럼 태스크형 서비스이거나 공식 USD 토큰 단가를
              화면에서 확정하지 못한 항목은 계산기에서 제외했습니다.
            </p>
          </div>
        </article>

        <article className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="overflow-x-auto">
            <div className="min-w-[42rem]">
              <div className="grid grid-cols-[1fr_6rem_6rem_6rem] gap-3 border-b border-border px-4 py-3 text-xs font-semibold text-text-subtle">
                <span>모델</span>
                <span className="text-right">입력</span>
                <span className="text-right">출력</span>
                <span className="text-right">월 합계</span>
              </div>
              {estimates.map((estimate) => (
                <div
                  key={estimate.profile.id}
                  className="grid grid-cols-[1fr_6rem_6rem_6rem] gap-3 border-b border-border px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">
                      {estimate.profile.modelName}
                    </p>
                    <p className="mt-1 text-xs text-text-subtle">
                      {getProviderLabel(estimate.profile.providerId)} ·{" "}
                      {estimate.profile.pricingBasis}
                    </p>
                    <p className="mt-1 hidden text-xs leading-5 text-text-subtle md:block">
                      {estimate.profile.notes}
                    </p>
                  </div>
                  <p className="text-right text-xs font-semibold text-text-muted">
                    {estimate.inputCost.toFixed(2)}
                  </p>
                  <p className="text-right text-xs font-semibold text-text-muted">
                    {estimate.outputCost.toFixed(2)}
                  </p>
                  <p className="text-right text-sm font-semibold text-text">
                    {estimate.formattedTotal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

type EventCreditMode = "none" | "double-credit" | "half-price";

const eventCostScenarios = [
  {
    id: "webinar",
    title: "온라인 세미나 Q&A",
    summary: "참가자 질문 요약, 후속 메일 초안, 세션별 하이라이트 생성",
    inputTokensPerRun: 6000,
    outputTokensPerRun: 1200,
    runsPerMonth: 600,
  },
  {
    id: "hackathon",
    title: "해커톤/부트캠프 멘토링",
    summary: "코드 리뷰, README 초안, 에러 로그 분석, 발표 자료 피드백",
    inputTokensPerRun: 14000,
    outputTokensPerRun: 3000,
    runsPerMonth: 1200,
  },
  {
    id: "launch",
    title: "제품 런칭 이벤트",
    summary: "랜딩 카피, FAQ, 고객 문의 분류, 커뮤니티 댓글 요약",
    inputTokensPerRun: 9000,
    outputTokensPerRun: 1800,
    runsPerMonth: 2400,
  },
] as const;

function EventCostComparisonSection() {
  const [scenarioId, setScenarioId] =
    useState<(typeof eventCostScenarios)[number]["id"]>("webinar");
  const [creditMode, setCreditMode] = useState<EventCreditMode>("none");
  const scenario =
    eventCostScenarios.find((item) => item.id === scenarioId) ??
    eventCostScenarios[0];
  const discountFactor =
    creditMode === "double-credit" || creditMode === "half-price" ? 0.5 : 1;
  const estimates = useMemo(
    () =>
      calculateModelCosts(scenario)
        .slice(0, 6)
        .map((estimate) => ({
          ...estimate,
          adjustedTotal: estimate.totalCost * discountFactor,
        })),
    [discountFactor, scenario],
  );

  return (
    <section id="event-costs" className="space-y-4">
      <SectionHeader
        icon={Calculator}
        title="이벤트 비용 비교"
        description="2배 크레딧, 50% 할인, 친구 초대 크레딧 같은 이벤트를 가정해 행사성 AI 운영 비용을 별도로 비교합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[24rem_1fr]">
        <article className="rounded-lg border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text">행사 시나리오</h3>
          <label className="mt-4 block">
            <span className="text-xs font-semibold text-text-subtle">
              이벤트 유형
            </span>
            <select
              value={scenarioId}
              onChange={(event) =>
                setScenarioId(
                  event.target
                    .value as (typeof eventCostScenarios)[number]["id"],
                )
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              {eventCostScenarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-semibold text-text-subtle">
              프로모션 효과
            </span>
            <select
              value={creditMode}
              onChange={(event) =>
                setCreditMode(event.target.value as EventCreditMode)
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              <option value="none">이벤트 없음</option>
              <option value="double-credit">2배 크레딧 적용</option>
              <option value="half-price">50% 할인 적용</option>
            </select>
          </label>
          <div className="mt-4 rounded-md border border-border bg-bg p-3">
            <p className="text-sm font-semibold text-text">{scenario.title}</p>
            <p className="mt-1 text-xs leading-5 text-text-muted">
              {scenario.summary}
            </p>
            <p className="mt-2 text-xs text-text-subtle">
              {scenario.runsPerMonth.toLocaleString("ko-KR")}회 실행 · 입력{" "}
              {scenario.inputTokensPerRun.toLocaleString("ko-KR")} · 출력{" "}
              {scenario.outputTokensPerRun.toLocaleString("ko-KR")} tokens
            </p>
          </div>
        </article>

        <article className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[1fr_6rem_6rem] gap-3 border-b border-border px-4 py-3 text-xs font-semibold text-text-subtle md:grid-cols-[1.4fr_7rem_7rem_7rem]">
            <span>모델</span>
            <span className="text-right">일반</span>
            <span className="text-right">이벤트</span>
            <span className="hidden text-right md:block">절감</span>
          </div>
          {estimates.map((estimate) => {
            const saved = estimate.totalCost - estimate.adjustedTotal;
            return (
              <div
                key={estimate.profile.id}
                className="grid grid-cols-[1fr_6rem_6rem] gap-3 border-b border-border px-4 py-3 last:border-b-0 md:grid-cols-[1.4fr_7rem_7rem_7rem]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">
                    {estimate.profile.modelName}
                  </p>
                  <p className="mt-1 text-xs text-text-subtle">
                    {getProviderLabel(estimate.profile.providerId)} ·{" "}
                    {estimate.profile.pricingBasis}
                  </p>
                </div>
                <p className="text-right text-xs font-semibold text-text-muted">
                  ${estimate.totalCost.toFixed(2)}
                </p>
                <p className="text-right text-sm font-semibold text-text">
                  ${estimate.adjustedTotal.toFixed(2)}
                </p>
                <p className="hidden text-right text-xs font-semibold text-accent md:block">
                  ${saved.toFixed(2)}
                </p>
              </div>
            );
          })}
        </article>
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-text-subtle">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm font-semibold text-text outline-none transition focus:border-accent"
      />
    </label>
  );
}

function SourcesSection({ sourceItems }: { sourceItems: SourceRef[] }) {
  const [kind, setKind] = useState<SourceKindFilter>("all");
  const [publisherQuery, setPublisherQuery] = useState("");
  const sourceKindFilters: Array<{ id: SourceKindFilter; label: string }> = [
    { id: "all", label: "전체" },
    { id: "official", label: "공식" },
    { id: "benchmark", label: "벤치마크" },
    { id: "publisher", label: "출판사/기관" },
    { id: "community", label: "커뮤니티" },
  ];
  const filteredSources = sourceItems.filter(
    (source) =>
      (kind === "all" || source.kind === kind) &&
      (!publisherQuery.trim() ||
        `${source.publisher} ${source.title} ${source.note}`
          .toLocaleLowerCase("ko-KR")
          .includes(publisherQuery.toLocaleLowerCase("ko-KR").trim())),
  );

  return (
    <section id="sources" className="space-y-4">
      <SectionHeader
        icon={FileText}
        title="출처"
        description="제품 스펙은 공식 문서, 성능 비교는 벤치마크, 학습 자료는 발행 주체별로 구분하고 출처 성격과 발행처로 좁힙니다."
      />
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1fr_1fr_8rem]">
        <SegmentBar
          label="출처 성격"
          items={sourceKindFilters}
          value={kind}
          onChange={setKind}
        />
        <label className="block">
          <span className="text-xs font-semibold text-text-subtle">
            발행처/제목 검색
          </span>
          <input
            value={publisherQuery}
            onChange={(event) => setPublisherQuery(event.target.value)}
            placeholder="OpenAI, 인프런, 도서, 이벤트"
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
          />
        </label>
        <div className="rounded-md border border-border bg-bg p-3">
          <p className="text-xs font-semibold text-text-subtle">필터 결과</p>
          <p className="mt-1 text-lg font-semibold text-text">
            {filteredSources.length}개
          </p>
        </div>
      </div>
      {filteredSources.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredSources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="rounded-md border border-border bg-bg px-2 py-1 text-xs font-semibold text-text-subtle">
                  {sourceKindLabel(source.kind)}
                </span>
                <ExternalLink
                  className="size-3.5 text-text-subtle"
                  aria-hidden
                />
              </span>
              <span className="mt-3 block text-sm font-semibold text-text">
                {source.title}
              </span>
              <span className="mt-1 block text-xs font-medium text-accent">
                {source.publisher}
              </span>
              <span className="mt-2 block text-xs leading-5 text-text-muted">
                {source.note}
              </span>
              <span className="mt-3 block text-xs text-text-subtle">
                확인일 {source.lastChecked}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 출처가 없습니다"
          body="출처 성격을 전체로 바꾸거나 발행처 검색어를 줄이세요."
        />
      )}
    </section>
  );
}

const sitemapLinks = [
  {
    id: "portal",
    route: "portal" as const,
    title: "포털 메인",
    description:
      "브리핑, 웹진, 이벤트, 모델 비교, 벤치마크, 사용법, 강좌/도서 등 공개 핵심 화면입니다.",
    links: [
      {
        href: "#updates",
        label: "오늘의 브리핑",
        note: "최신 업데이트 + 핵심 영향",
      },
      {
        href: "#webzine",
        label: "AI 뉴스와 커뮤니티",
        note: "뉴스·이벤트·강좌형 콘텐츠",
      },
      {
        href: "#events",
        label: "이벤트와 프로모션",
        note: "크레딧/할인/초대 신호",
      },
      {
        href: "#comparison",
        label: "모델 비교",
        note: "제공사별 모델 카드",
      },
      {
        href: "#benchmarks",
        label: "벤치마크",
        note: "분야별 점수와 속도",
      },
      {
        href: "#learning",
        label: "강좌/도서",
        note: "언어/형식/난이도/태그 필터",
      },
      {
        href: "#ops",
        label: "편집실",
        note: "운영 모니터링/파이프라인",
      },
      {
        href: "#event-costs",
        label: "이벤트 비용 비교",
        note: "2배 크레딧/할인 시나리오",
      },
    ],
  },
  {
    id: "resources",
    route: "resources" as const,
    title: "AI 바이브 코딩 자료실",
    description:
      "작업 추천, AI 도구, 바이브 코딩 명령어, 벤치마크를 세분화해 탐색하는 전용 라우트입니다.",
    links: [
      {
        href: "#task-recommendations",
        label: "작업 추천",
        note: "코딩, PPT, 비용, 보안 등",
      },
      {
        href: "#ai-tools",
        label: "AI 코딩 도구",
        note: "도구 유형/가격 혜택별",
      },
      {
        href: "#vibe-coding",
        label: "바이브 코딩 명령어",
        note: "CLI/API/IDE 실행형 비교",
      },
      {
        href: "#learning",
        label: "강좌/커뮤니티",
        note: "유튜브, 블로그, 도서, 원격교육",
      },
      {
        href: "#sources",
        label: "자료 출처",
        note: "공식, 벤치마크, 커뮤니티",
      },
    ],
  },
  {
    id: "admin",
    route: "admin" as const,
    title: "관리자 콘솔",
    description:
      "로그인 후 접근하는 운영 페이지입니다. 공개 페이지와 분리된 콘텐츠 관리 공간입니다.",
    links: [
      {
        href: "#admin-overview",
        label: "콘솔 개요",
        note: "로그인 계정과 감사 상태",
      },
      {
        href: "#ops",
        label: "운영 편집실",
        note: "모니터링 큐, 파이프라인, 백로그",
      },
      {
        href: "#exports",
        label: "내보내기",
        note: "뉴스레터, CSV, JSON, Runbook",
      },
      {
        href: "#sources",
        label: "출처",
        note: "출처 성격/발행처 기반 검수",
      },
    ],
  },
];

function SitemapRoute({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  const jumpTo = (route: AppRoute, href?: string) => {
    onNavigate(route);
    if (!href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setTimeout(() => {
      const targetId = href.startsWith("#") ? href.slice(1) : href;
      const node = document.getElementById(targetId);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

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
              <p className="text-xs font-semibold text-accent">사이트맵 라우트</p>
              <h1 className="mt-1 text-2xl font-semibold text-text">
                AI Digest Desk 전체 지도
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
                포털, 자료실, 관리자 콘솔을 페이지 단위와 섹션 단위로 분리해
                빠르게 이동할 수 있게 구성했습니다.
              </p>
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-muted transition hover:text-text"
            >
              <Home className="size-3.5" aria-hidden />
              포털 열기
            </a>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-3">
          {sitemapLinks.map((section) => (
            <article
              key={section.id}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h2 className="text-sm font-semibold text-text">{section.title}</h2>
              <p className="mt-2 text-xs leading-5 text-text-muted">
                {section.description}
              </p>
              <div className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() =>
                      jumpTo(section.route, link.href)
                    }
                    className="w-full rounded-md border border-border bg-bg p-3 text-left transition hover:border-border-strong"
                  >
                    <p className="text-sm font-semibold text-text">{link.label}</p>
                    <p className="mt-1 text-xs text-text-subtle">{link.note}</p>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function AdminMetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
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
  );
}

function AdminLogin({
  onLogin,
  onNavigate,
}: {
  onLogin: (session: AdminSession) => void;
  onNavigate: (route: AppRoute) => void;
}) {
  const [email, setEmail] = useState("admin@aidigestdesk.local");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail.includes("@")) {
      setError("관리자 이메일 형식으로 입력하세요.");
      return;
    }

    if (accessCode.trim().length < 4) {
      setError("운영 세션 코드를 4자 이상 입력하세요.");
      return;
    }

    onLogin({
      email: normalizedEmail,
      role: "콘텐츠 관리자",
      signedInAt: new Date().toISOString(),
    });
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-[calc(100vh-4rem)] px-4 py-8 outline-none lg:px-6"
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_24rem]">
        <section className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-ink text-ink-fg">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold text-accent">/admin 라우트</p>
              <h1 className="mt-1 text-2xl font-semibold text-text">
                관리자 로그인
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                콘텐츠 큐레이션, 소스 모니터, 파이프라인 메모, 내보내기 기능을
                공개 포털과 분리해 관리합니다.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <AdminMetricCard
              label="모델"
              value={`${stats.providers}`}
              detail="주요 제공사 비교"
              icon={Boxes}
            />
            <AdminMetricCard
              label="모니터"
              value={`${curationMonitors.length}`}
              detail="소스 점검 대상"
              icon={Gauge}
            />
            <AdminMetricCard
              label="감사"
              value={contentAudit.passed ? "PASS" : "WARN"}
              detail={`${contentAudit.checks.length}개 품질 체크`}
              icon={CheckCircle2}
            />
          </div>
          <div className="mt-6 rounded-lg border border-border bg-bg p-4">
            <p className="text-sm font-semibold text-text">인증 범위 안내</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              현재 배포는 정적 Vite 앱이라 서버 비밀키 검증이 없는 로컬 관리자
              세션입니다. 실제 권한 통제는 Supabase, Auth.js, Vercel Edge
              Middleware 같은 서버 인증을 붙이는 단계에서 완성해야 합니다.
            </p>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-surface p-5"
        >
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-accent" aria-hidden />
            <h2 className="text-base font-semibold text-text">
              로컬 관리자 세션
            </h2>
          </div>
          <label className="mt-5 block">
            <span className="text-xs font-semibold text-text-subtle">
              관리자 이메일
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-semibold text-text-subtle">
              운영 세션 코드
            </span>
            <input
              type="password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="4자 이상"
              className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
            />
          </label>
          {error ? (
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-ink-fg"
          >
            <LogIn className="size-4" aria-hidden />
            로그인
          </button>
          <button
            type="button"
            onClick={() => onNavigate("portal")}
            className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-bg px-4 text-sm font-semibold text-text-muted transition hover:text-text"
          >
            <Home className="size-4" aria-hidden />
            공개 포털로 이동
          </button>
        </form>
      </div>
    </main>
  );
}

function AdminConsole({
  session,
  onLogout,
  onNavigate,
}: {
  session: AdminSession;
  onLogout: () => void;
  onNavigate: (route: AppRoute) => void;
}) {
  const snapshotCandidates = useMemo(() => getSourceSnapshotCandidates(), []);
  const p0Monitors = curationMonitors.filter(
    (monitor) => monitor.priority === "P0",
  );
  const koreanResourceCount = learningResources.filter(
    (resource) => resource.language === "한국어",
  ).length;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="px-4 py-5 outline-none lg:px-6"
    >
      <div className="mx-auto max-w-[96rem] space-y-6">
        <section
          id="admin-overview"
          className="rounded-lg border border-border bg-surface p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-accent">
                관리자 콘솔 · /admin
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-text">
                콘텐츠 운영 대시보드
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
                AI 바이브 코딩 자료, 모델 업데이트, 출처 스냅샷, 편집
                파이프라인을 공개 포털과 분리해 관리합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate("portal")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-muted transition hover:text-text"
              >
                <Home className="size-3.5" aria-hidden />
                포털
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-muted transition hover:text-text"
              >
                <LogOut className="size-3.5" aria-hidden />
                로그아웃
              </button>
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap gap-2">
            {[
              ["#admin-overview", "개요"],
              ["#ops", "운영 편집실"],
              ["#exports", "내보내기"],
              ["#sources", "출처"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
              >
                {label}
              </a>
            ))}
          </nav>
        </section>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard
            label="로그인 계정"
            value={session.role}
            detail={`${session.email} · ${new Date(
              session.signedInAt,
            ).toLocaleString("ko-KR")}`}
            icon={ShieldCheck}
          />
          <AdminMetricCard
            label="소스 스냅샷"
            value={`${snapshotCandidates.length}`}
            detail="공식/벤치마크/모니터링 대상"
            icon={FileText}
          />
          <AdminMetricCard
            label="P0 모니터"
            value={`${p0Monitors.length}`}
            detail="매일 또는 최우선 확인 대상"
            icon={Gauge}
          />
          <AdminMetricCard
            label="한국어 자료"
            value={`${koreanResourceCount}`}
            detail="강좌, 문서, 블로그, 도서"
            icon={BookOpen}
          />
        </div>

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-text">
                콘텐츠 감사 상태
              </h2>
              <span
                className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                  contentAudit.passed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                }`}
              >
                {contentAudit.passed ? "PASS" : "CHECK"}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {contentAudit.checks.map((check) => (
                <div
                  key={check.id}
                  className="rounded-md border border-border bg-bg p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-text">
                      {check.label}
                    </p>
                    <span className="text-xs font-semibold text-accent">
                      {check.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    {check.detail}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-text">
                스냅샷 우선 후보
              </h2>
              <span className="text-xs font-semibold text-text-subtle">
                {snapshotCandidates.length}개
              </span>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {snapshotCandidates.slice(0, 8).map((candidate) => (
                <a
                  key={candidate.source.id}
                  href={candidate.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-border bg-bg p-3 transition hover:border-border-strong"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-accent">
                      {candidate.priority} · {candidate.cadence}
                    </span>
                    <ExternalLink
                      className="size-3.5 text-text-subtle"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-text">
                    {candidate.source.title}
                  </span>
                  <span className="mt-1 block text-xs text-text-subtle">
                    {candidate.source.publisher}
                  </span>
                </a>
              ))}
            </div>
          </article>
        </section>

        <EditorialOpsSection
          monitors={curationMonitors}
          pipelineItems={updatePipeline}
          backlog={featureBacklog}
        />
        <ExportDeskSection />
        <SourcesSection sourceItems={sources} />
      </div>
    </main>
  );
}

function AdminRoute({
  session,
  onLogin,
  onLogout,
  onNavigate,
}: {
  session: AdminSession | null;
  onLogin: (session: AdminSession) => void;
  onLogout: () => void;
  onNavigate: (route: AppRoute) => void;
}) {
  return session ? (
    <AdminConsole
      session={session}
      onLogout={onLogout}
      onNavigate={onNavigate}
    />
  ) : (
    <AdminLogin onLogin={onLogin} onNavigate={onNavigate} />
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
            <AdminMetricCard
              label="자료"
              value={`${resources.length}`}
              detail="현재 검색/필터 조건"
              icon={Library}
            />
            <AdminMetricCard
              label="한국어"
              value={`${koreanResourceCount}`}
              detail="문서, 영상, 블로그, 도서"
              icon={BookOpen}
            />
            <AdminMetricCard
              label="도서"
              value={`${bookCount}`}
              detail="국내외 검색 허브 포함"
              icon={FileText}
            />
            <AdminMetricCard
              label="AI 도구"
              value={`${toolProfiles.length}`}
              detail="IDE, CLI, PR 리뷰, 에이전트"
              icon={Boxes}
            />
            <AdminMetricCard
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
