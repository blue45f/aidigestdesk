import { SNAPSHOT_DATE } from "@aidigestdesk/content";
import {
  BookOpen,
  Boxes,
  Calculator,
  Code2,
  FileText,
  Home,
  Library,
  MapPin,
  Moon,
  Newspaper,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Table2,
} from "lucide-react";

import type { AdminSession } from "@/components/app/adminSession";
import type { AppRoute } from "@/components/app/appRoutes";

import { IconButton } from "@/components/app/CommonUi";

const routeItems = [
  { id: "portal", label: "홈", icon: Home },
  { id: "resources", label: "자료", icon: Library },
  { id: "sitemap", label: "사이트맵", icon: MapPin },
] satisfies Array<{
  id: AppRoute;
  label: string;
  icon: typeof Home;
}>;

const navItems = [
  { href: "#updates", label: "브리핑", icon: Newspaper },
  { href: "#events", label: "일정/이벤트", icon: Sparkles },
  { href: "#task-recommendations", label: "작업 추천", icon: Sparkles },
  { href: "#ai-tools", label: "AI 도구", icon: Boxes },
  { href: "#vibe-coding", label: "CLI 명령어", icon: Code2 },
  { href: "#comparison", label: "모델/벤치마크", icon: Table2 },
  { href: "#learning", label: "강좌/자료", icon: BookOpen },
  { href: "#webzine", label: "뉴스 웹진", icon: Newspaper },
  { href: "#costs", label: "비용", icon: Calculator },
  { href: "#sources", label: "소스", icon: FileText },
] as const;

export function Header({
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
        {adminSession || route === "admin" ? (
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
        ) : null}
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

export function Sidebar() {
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
