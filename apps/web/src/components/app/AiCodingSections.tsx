import {
  getAiCodingToolCategoryLabel,
  getBenchmarkDomainLabel,
  getModelById,
  getProviderLabel,
  getSources,
  getTaskRecommendationCategoryLabel,
  learningResources,
  vibeCodingCommands,
  type AiCodingToolCategory,
  type AiCodingToolProfile,
  type LearningResource,
  type ModelProfile,
  type TaskRecommendation,
  type TaskRecommendationCategory,
  type VibeCodingCommand,
} from "@aidigestdesk/content";
import { Boxes, Code2, ExternalLink, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  SectionHeader,
  SegmentBar,
  TextList,
} from "@/components/app/CommonUi";

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
type TaskRecommendationCategoryFilter = TaskRecommendationCategory | "all";

export function TaskRecommendationSection({
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

export function CodingToolDirectorySection({
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

export function VibeCodingSection({
  commands,
}: {
  commands: VibeCodingCommand[];
}) {
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
