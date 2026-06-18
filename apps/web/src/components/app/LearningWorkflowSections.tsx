import {
  benchmarkEntries,
  getModelById,
  getProviderLabel,
  updates,
  type ManualGuide,
  type ModelProfile,
  type PersonaGuide,
} from "@aidigestdesk/content";
import { CheckCircle2, CircleHelp, Palette, Users } from "lucide-react";

import { EmptyState, SectionHeader } from "@/components/app/CommonUi";

export function DesignWorkflowSection() {
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

export function ManualGuides({ guides }: { guides: ManualGuide[] }) {
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

export function PersonaPlaybooks({ guides }: { guides: PersonaGuide[] }) {
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
