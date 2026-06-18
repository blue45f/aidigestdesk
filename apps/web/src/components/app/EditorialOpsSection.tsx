import {
  getProviderLabel,
  getSources,
  movePipelineStage,
  runContentAudit,
  SNAPSHOT_DATE,
  type CurationMonitor,
  type FeatureBacklogItem,
  type PipelineStage,
  type UpdatePipelineItem,
} from "@aidigestdesk/content";
import { CheckCircle2, ChevronLeft, ChevronRight, Gauge } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState, SectionHeader } from "@/components/app/CommonUi";

const WORKBENCH_STORAGE_KEY = "aidigestdesk.editorWorkbench.v1";
const contentAudit = runContentAudit();

type PipelineDraft = {
  stage: PipelineStage;
  note: string;
  updatedAt: string;
};

type WorkbenchStorage = {
  version: 1;
  drafts: Record<string, PipelineDraft>;
};

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

export function EditorialOpsSection({
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
