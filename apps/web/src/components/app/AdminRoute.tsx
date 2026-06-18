import {
  curationMonitors,
  featureBacklog,
  getCatalogStats,
  getSourceSnapshotCandidates,
  learningResources,
  runContentAudit,
  sources,
  updatePipeline,
} from "@aidigestdesk/content";
import {
  BookOpen,
  Boxes,
  CheckCircle2,
  ExternalLink,
  FileText,
  Gauge,
  Home,
  KeyRound,
  LogIn,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { AdminSession } from "@/components/app/adminSession";
import type { FormEvent } from "react";

import { MetricCard } from "@/components/app/CommonUi";
import { EditorialOpsSection } from "@/components/app/EditorialOpsSection";
import { ExportDeskSection } from "@/components/app/ExportDeskSection";
import { SourcesSection } from "@/components/app/SourcesSection";

const stats = getCatalogStats();
const contentAudit = runContentAudit();

type AdminRouteTarget = "portal";

function AdminLogin({
  onLogin,
  onNavigate,
}: {
  onLogin: (session: AdminSession) => void;
  onNavigate: (route: AdminRouteTarget) => void;
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
            <MetricCard
              label="모델"
              value={`${stats.providers}`}
              detail="주요 제공사 비교"
              icon={Boxes}
            />
            <MetricCard
              label="모니터"
              value={`${curationMonitors.length}`}
              detail="소스 점검 대상"
              icon={Gauge}
            />
            <MetricCard
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
  onNavigate: (route: AdminRouteTarget) => void;
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
          <MetricCard
            label="로그인 계정"
            value={session.role}
            detail={`${session.email} · ${new Date(
              session.signedInAt,
            ).toLocaleString("ko-KR")}`}
            icon={ShieldCheck}
          />
          <MetricCard
            label="소스 스냅샷"
            value={`${snapshotCandidates.length}`}
            detail="공식/벤치마크/모니터링 대상"
            icon={FileText}
          />
          <MetricCard
            label="P0 모니터"
            value={`${p0Monitors.length}`}
            detail="매일 또는 최우선 확인 대상"
            icon={Gauge}
          />
          <MetricCard
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

export function AdminRoute({
  session,
  onLogin,
  onLogout,
  onNavigate,
}: {
  session: AdminSession | null;
  onLogin: (session: AdminSession) => void;
  onLogout: () => void;
  onNavigate: (route: AdminRouteTarget) => void;
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
