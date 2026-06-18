import {
  benchmarkEntries,
  comparisonProviderOrder,
  comparisonRows,
  getBenchmarkDomainLabel,
  getSearchTerms,
  getProviderLabel,
  getSources,
  providerCatalog,
  type ProviderId,
  type BenchmarkEntry,
  type BenchmarkDomain,
  type ModelProfile,
} from "@aidigestdesk/content";
import { BarChart3, Boxes, ExternalLink, Search, Table2 } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import {
  EmptyState,
  SectionHeader,
  SegmentBar,
  TextList,
} from "@/components/app/CommonUi";
import {
  sourceKindFilters,
  sourceKindLabel,
  type SourceKindFilter,
} from "@/components/app/sourceLabels";

type BenchmarkDomainFilter = BenchmarkDomain | "all";
type BenchmarkProviderFilter = BenchmarkEntry["providerId"] | "all";
type BenchmarkSortMode =
  | "rank"
  | "model"
  | "domain"
  | "provider"
  | "score"
  | "price"
  | "speed"
  | "latency"
  | "lastChecked";
type BenchmarkSortDirection = "asc" | "desc";
type ModelCardSortMode = "model" | "provider" | "status" | "lastUpdate" | "verified";
type ModelCardSortDirection = "asc" | "desc";
type ModelCardStatusFilter = "all" | ModelProfile["status"];
type ModelCardProviderFilter = "all" | ProviderId;
type ModelSpecSortMode = "label" | "value";
type ModelSourceSortMode = "publisher" | "kind" | "checked";
type ComparisonMatrixSortMode = "axis" | "filled" | "coverage";
type ComparisonMatrixSortDirection = "asc" | "desc";
type ListLimit = number;

function parseNumericMetric(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function compareNumericWithDirection(
  a: number | null,
  b: number | null,
  direction: BenchmarkSortDirection,
) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return (a - b) * (direction === "asc" ? 1 : -1);
}

function parseRankValue(rankLabel: string) {
  const hashMatch = rankLabel.match(/#\s*(\d+(?:\.\d+)?)/);
  if (hashMatch) return Number(hashMatch[1]);
  const topMatch = rankLabel.match(/Top\s*(\d+(?:\.\d+)?)/i);
  if (topMatch) return Number(topMatch[1]);
  const plainMatch = rankLabel.match(/(\d+(?:\.\d+)?)/);
  return plainMatch ? Number(plainMatch[1]) : null;
}

function getLatestSourceCheckedAt(entry: BenchmarkEntry) {
  return getSources(entry.sourceIds)
    .map((source) => source.lastChecked)
    .filter(Boolean)
    .toSorted((a, b) => b.localeCompare(a))[0];
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

export function ModelCards({
  models,
  selectedModelId,
  onSelectModel,
}: {
  models: ModelProfile[];
  selectedModelId: string;
  onSelectModel: (id: string) => void;
}) {
  const [statusFilter, setStatusFilter] =
    useState<ModelCardStatusFilter>("all");
  const [providerFilter, setProviderFilter] =
    useState<ModelCardProviderFilter>("all");
  const [modelQuery, setModelQuery] = useState("");
  const [cardSortMode, setCardSortMode] =
    useState<ModelCardSortMode>("model");
  const [cardSortDirection, setCardSortDirection] =
    useState<ModelCardSortDirection>("asc");
  const [modelLimit, setModelLimit] = useState<ListLimit>(0);
  const modelQueryTerms = useMemo(() => getSearchTerms(modelQuery), [modelQuery]);

  const modelSortDirectionFilters: Array<{
    id: ModelCardSortDirection;
    label: string;
  }> = [
    { id: "asc", label: "오름차순" },
    { id: "desc", label: "내림차순" },
  ];
  const modelSortFilters: Array<{ id: ModelCardSortMode; label: string }> = [
    { id: "model", label: "모델명" },
    { id: "provider", label: "제공사" },
    { id: "status", label: "상태" },
    { id: "lastUpdate", label: "최근 업데이트" },
    { id: "verified", label: "확인일" },
  ];
  const providerOptions = useMemo<Array<ModelCardProviderFilter>>(() => {
    const options = Array.from(
      new Set(models.map((model) => model.providerId)),
    ).toSorted((a, b) => a.localeCompare(b, "ko"));
    return ["all", ...options] as Array<ModelCardProviderFilter>;
  }, [models]);
  const statusOptions = useMemo<Array<ModelCardStatusFilter>>(() => {
    const options = Array.from(new Set(models.map((model) => model.status))).toSorted(
      (a, b) => a.localeCompare(b, "ko"),
    );
    return ["all", ...options] as Array<ModelCardStatusFilter>;
  }, [models]);

  const filteredCards = useMemo(
    () =>
      models
        .filter((profile) => {
          const searchableText = [
            profile.id,
            profile.modelName,
            profile.productName,
            profile.providerName,
            profile.oneLine,
            profile.summary,
            ...profile.strengths,
            ...profile.bestFor,
            ...profile.caveats,
            ...profile.specs.flatMap((spec) => [spec.label, spec.value]),
          ]
            .join(" ")
            .toLocaleLowerCase("ko-KR")
            .replace(/\s+/g, " ")
            .trim();

          if (
            modelQueryTerms.length &&
            !modelQueryTerms.some((searchTerm) => searchableText.includes(searchTerm))
          ) {
            return false;
          }
          if (statusFilter !== "all" && profile.status !== statusFilter) {
            return false;
          }
          if (providerFilter !== "all" && profile.providerId !== providerFilter) {
            return false;
          }
          return true;
        })
        .toSorted((left, right) => {
          const direction = cardSortDirection === "asc" ? 1 : -1;
          if (cardSortMode === "model") {
            return left.modelName.localeCompare(right.modelName) * direction;
          }
          if (cardSortMode === "provider") {
            return left.providerName.localeCompare(right.providerName) * direction;
          }
          if (cardSortMode === "status") {
            return left.status.localeCompare(right.status) * direction;
          }
          if (cardSortMode === "lastUpdate") {
            if (left.lastUpdate === right.lastUpdate) return 0;
            return left.lastUpdate.localeCompare(right.lastUpdate) * direction;
          }
          if (left.verifiedAt === right.verifiedAt) return 0;
          return left.verifiedAt.localeCompare(right.verifiedAt) * direction;
        }),
    [
      cardSortDirection,
      cardSortMode,
      modelQueryTerms,
      models,
      providerFilter,
      statusFilter,
    ],
  );
  const visibleCards =
    modelLimit === 0 ? filteredCards : filteredCards.slice(0, modelLimit);
  const isModelCardsResetDisabled =
    modelQuery === "" &&
    statusFilter === "all" &&
    providerFilter === "all" &&
    cardSortMode === "model" &&
    cardSortDirection === "asc" &&
    modelLimit === 0;

  useEffect(() => {
    const selectedInList = filteredCards.some(
      (profile) => profile.id === selectedModelId,
    );
    if (!selectedInList && filteredCards.length > 0) {
      const nextModel = filteredCards[0];
      if (nextModel) {
        onSelectModel(nextModel.id);
      }
    }
  }, [filteredCards, onSelectModel, selectedModelId]);

  return (
    <section id="comparison" className="space-y-4">
      <SectionHeader
        icon={Boxes}
        title="현재 주요 모델"
        description="상용 LLM과 에이전트 서비스를 같은 표면에서 보되, Manus는 모델보다 태스크 플랫폼으로 분리했습니다."
      />
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1fr_1fr_1fr_1.2fr_1.2fr_1fr]">
        <label className="block xl:col-span-2">
          <span className="text-xs font-semibold text-text-subtle">모델 검색</span>
          <input
            value={modelQuery}
            onChange={(event) => setModelQuery(event.target.value)}
            placeholder="모델명, 강점, 추천 업무"
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
          />
        </label>
        <label className="block xl:col-span-2">
          <span className="text-xs font-semibold text-text-subtle">제공사</span>
          <select
            value={providerFilter}
            onChange={(event) =>
              setProviderFilter(event.target.value as ModelCardProviderFilter)
            }
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
          >
            {providerOptions.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "전체" : item}
              </option>
            ))}
          </select>
        </label>
        <label className="block xl:col-span-2">
          <span className="text-xs font-semibold text-text-subtle">상태</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ModelCardStatusFilter)
            }
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "전체" : item}
              </option>
            ))}
          </select>
        </label>
        <SegmentBar
          label="정렬"
          items={modelSortFilters}
          value={cardSortMode}
          onChange={setCardSortMode}
        />
            <SegmentBar
              label="정렬 방향"
              items={modelSortDirectionFilters}
              value={cardSortDirection}
              onChange={setCardSortDirection}
            />
            <label className="block">
              <span className="text-xs font-semibold text-text-subtle">표시 개수</span>
              <select
                value={modelLimit}
                onChange={(event) => setModelLimit(Number(event.target.value))}
                className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
              >
                <option value={0}>전체</option>
                <option value={12}>12개</option>
                <option value={24}>24개</option>
                <option value={36}>36개</option>
              </select>
            </label>
          <div className="rounded-md border border-border bg-bg p-3">
              <p className="text-xs font-semibold text-text-subtle">필터 결과</p>
              <p className="mt-1 text-lg font-semibold text-text">
                표시 {visibleCards.length}개 / 전체 {filteredCards.length}개
              </p>
          <button
            type="button"
            disabled={isModelCardsResetDisabled}
            onClick={() => {
              setProviderFilter("all");
              setStatusFilter("all");
              setModelQuery("");
              setCardSortMode("model");
              setCardSortDirection("asc");
              setModelLimit(0);
            }}
            className="mt-3 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            초기화
          </button>
        </div>
      </div>
      {filteredCards.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {visibleCards.map((profile) => (
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

export function ModelDetail({ profile }: { profile: ModelProfile }) {
  const profileSources = getSources(profile.sourceIds);
  const [modelSpecSortMode, setModelSpecSortMode] =
    useState<ModelSpecSortMode>("label");
  const [modelSpecSortDirection, setModelSpecSortDirection] =
    useState<ModelCardSortDirection>("asc");
  const [modelSourceSortMode, setModelSourceSortMode] =
    useState<ModelSourceSortMode>("publisher");
  const [modelSourceKindFilter, setModelSourceKindFilter] =
    useState<SourceKindFilter>("all");
  const [modelSourceSortDirection, setModelSourceSortDirection] =
    useState<ModelCardSortDirection>("asc");
  const [specLimit, setSpecLimit] = useState<ListLimit>(0);
  const [sourceLimit, setSourceLimit] = useState<ListLimit>(0);
  const sortedSpecs = useMemo(
    () =>
      [...profile.specs].toSorted((left, right) => {
        const direction = modelSpecSortDirection === "asc" ? 1 : -1;
        if (modelSpecSortMode === "label") {
          return left.label.localeCompare(right.label, "ko") * direction;
        }
        const leftNumeric = parseNumericMetric(left.value);
        const rightNumeric = parseNumericMetric(right.value);
        const numericDiff =
          (leftNumeric ?? Number.MIN_SAFE_INTEGER) -
          (rightNumeric ?? Number.MIN_SAFE_INTEGER);
        if (Number.isFinite(numericDiff) && numericDiff !== 0) {
          return numericDiff * direction;
        }
        return left.value.localeCompare(right.value, "ko") * direction;
      }),
    [modelSpecSortDirection, modelSpecSortMode, profile.specs],
  );
  const sortedSources = useMemo(() => {
    return profileSources
      .filter(
        (source) =>
          modelSourceKindFilter === "all" || source.kind === modelSourceKindFilter,
      )
      .toSorted((left, right) => {
        const direction = modelSourceSortDirection === "asc" ? 1 : -1;
        if (modelSourceSortMode === "publisher") {
          return left.publisher.localeCompare(right.publisher, "ko") * direction;
        }
        if (modelSourceSortMode === "kind") {
          return sourceKindLabel(left.kind).localeCompare(
            sourceKindLabel(right.kind),
            "ko",
          ) * direction;
        }
        return (
          left.lastChecked.localeCompare(right.lastChecked) * direction
        );
      });
  }, [
    modelSourceKindFilter,
    modelSourceSortMode,
    modelSourceSortDirection,
    profileSources,
  ]);
  const visibleSpecs =
    specLimit === 0 ? sortedSpecs : sortedSpecs.slice(0, specLimit);
  const visibleSources =
    sourceLimit === 0 ? sortedSources : sortedSources.slice(0, sourceLimit);
  const isModelDetailResetDisabled =
    modelSpecSortMode === "label" &&
    modelSpecSortDirection === "asc" &&
    modelSourceSortMode === "publisher" &&
    modelSourceKindFilter === "all" &&
    modelSourceSortDirection === "asc" &&
    specLimit === 0 &&
    sourceLimit === 0;
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
        <div className="mt-4 grid gap-2 border-t border-border pt-3 xl:grid-cols-3">
          <label>
            <span className="text-xs font-semibold text-text-subtle">
              스펙 정렬
            </span>
            <select
              value={modelSpecSortMode}
              onChange={(event) =>
                setModelSpecSortMode(event.target.value as ModelSpecSortMode)
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              <option value="label">항목명</option>
              <option value="value">값</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() =>
              setModelSpecSortDirection((current) =>
                current === "asc" ? "desc" : "asc",
              )
            }
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-bg px-3 text-xs font-semibold text-text-subtle transition hover:text-text"
          >
            스펙 방향 {modelSpecSortDirection === "asc" ? "오름차순" : "내림차순"}
          </button>
          <label>
            <span className="text-xs font-semibold text-text-subtle">스펙 표시</span>
            <select
              value={specLimit}
              onChange={(event) => setSpecLimit(Number(event.target.value))}
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              <option value={0}>전체</option>
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-semibold text-text-subtle">
              출처 필터
            </span>
            <select
              value={modelSourceKindFilter}
              onChange={(event) =>
                setModelSourceKindFilter(event.target.value as SourceKindFilter)
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              {sourceKindFilters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-semibold text-text-subtle">
              출처 정렬
            </span>
            <select
              value={modelSourceSortMode}
              onChange={(event) =>
                setModelSourceSortMode(event.target.value as ModelSourceSortMode)
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              <option value="publisher">출처</option>
              <option value="kind">출처 성격</option>
              <option value="checked">확인일</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() =>
              setModelSourceSortDirection((current) =>
                current === "asc" ? "desc" : "asc",
              )
            }
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-bg px-3 text-xs font-semibold text-text-subtle transition hover:text-text"
          >
            출처 방향{" "}
            {modelSourceSortDirection === "asc" ? "오름차순" : "내림차순"}
          </button>
          <label>
            <span className="text-xs font-semibold text-text-subtle">
              출처 표시
            </span>
            <select
              value={sourceLimit}
              onChange={(event) => setSourceLimit(Number(event.target.value))}
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              <option value={0}>전체</option>
              <option value={4}>4개</option>
              <option value={8}>8개</option>
              <option value={16}>16개</option>
            </select>
          </label>
        </div>
        <div className="mt-4 rounded-md border border-border bg-bg p-3">
          <p className="text-xs font-semibold text-text-subtle">필터 결과</p>
          <p className="mt-1 text-sm font-semibold text-text">
            스펙 {visibleSpecs.length}개 / 전체 {sortedSpecs.length}개
          </p>
          <p className="mt-1 text-sm font-semibold text-text">
            출처 {visibleSources.length}개 / 전체 {sortedSources.length}개
          </p>
          <button
            type="button"
            disabled={isModelDetailResetDisabled}
            onClick={() => {
              setModelSpecSortMode("label");
              setModelSpecSortDirection("asc");
              setModelSourceSortMode("publisher");
              setModelSourceKindFilter("all");
              setModelSourceSortDirection("asc");
              setSpecLimit(0);
              setSourceLimit(0);
            }}
            className="mt-3 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            초기화
          </button>
        </div>
        <dl className="mt-4 space-y-2">
                {visibleSpecs.map((spec) => (
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
                {visibleSources.map((source) => (
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

export function BenchmarkBoard() {
  const [domain, setDomain] = useState<BenchmarkDomainFilter>("all");
  const [provider, setProvider] = useState<BenchmarkProviderFilter>("all");
  const [sourceKind, setSourceKind] = useState<SourceKindFilter>("all");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<BenchmarkSortMode>("score");
  const [sortDirection, setSortDirection] =
    useState<BenchmarkSortDirection>("desc");
  const [benchmarkLimit, setBenchmarkLimit] = useState<ListLimit>(0);
  const deferredQuery = useDeferredValue(query);
  const searchTerms = useMemo(() => getSearchTerms(deferredQuery), [
    deferredQuery,
  ]);
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
  const benchmarkProviderFilters: Array<{
    id: BenchmarkProviderFilter;
    label: string;
  }> = [
    { id: "all", label: "전체 제공사" },
    ...providerCatalog.map((item) => ({
      id: item.id,
      label: item.label,
    })),
    { id: "other", label: "기타" },
  ];
  const sortFilters: Array<{ id: BenchmarkSortMode; label: string }> = [
    { id: "rank", label: "순위" },
    { id: "model", label: "모델" },
    { id: "provider", label: "제공사" },
    { id: "domain", label: "분야" },
    { id: "score", label: "점수" },
    { id: "price", label: "가격" },
    { id: "speed", label: "속도" },
    { id: "latency", label: "Latency" },
    { id: "lastChecked", label: "최근 확인일" },
  ];
  const sortDirectionFilters: Array<{
    id: BenchmarkSortDirection;
    label: string;
  }> = [
    { id: "asc", label: "오름차순" },
    { id: "desc", label: "내림차순" },
  ];
  const visibleEntries = useMemo(
    () =>
      benchmarkEntries
        .filter((entry) => {
          const entrySources = getSources(entry.sourceIds);
          const searchableText = [
            entry.id,
            entry.rankLabel,
            entry.modelName,
            getProviderLabel(entry.providerId),
            getBenchmarkDomainLabel(entry.domain),
            entry.metric,
            entry.score,
            entry.price,
            entry.speed,
            entry.latency,
            entry.context,
            ...entrySources.flatMap((source) => [
              source.title,
              source.publisher,
              source.note,
              sourceKindLabel(source.kind),
            ]),
          ]
            .join(" ")
            .toLocaleLowerCase("ko-KR")
            .replace(/\s+/g, " ")
            .trim();

          return (
            (domain === "all" || entry.domain === domain) &&
            (provider === "all" || entry.providerId === provider) &&
            (sourceKind === "all" ||
              entrySources.some((source) => source.kind === sourceKind)) &&
            (!searchTerms.length ||
              searchTerms.some((searchTerm) => searchableText.includes(searchTerm)))
          );
        })
        .toSorted((a, b) => {
          const directionOrder = sortDirection === "asc" ? 1 : -1;
          switch (sortMode) {
            case "rank": {
              const rankA = parseRankValue(a.rankLabel);
              const rankB = parseRankValue(b.rankLabel);
              if (rankA == null && rankB == null) {
                return a.rankLabel.localeCompare(b.rankLabel) * directionOrder;
              }
              if (rankA == null) return 1;
              if (rankB == null) return -1;
              return (rankA - rankB) * directionOrder;
            }
            case "model":
              return a.modelName.localeCompare(b.modelName) * directionOrder;
            case "provider": {
              const providerA = getProviderLabel(a.providerId) ?? "미지정";
              const providerB = getProviderLabel(b.providerId) ?? "미지정";
              if (providerA === providerB) return 0;
              return providerA.localeCompare(providerB) * directionOrder;
            }
            case "domain": {
              const domainA = getBenchmarkDomainLabel(a.domain);
              const domainB = getBenchmarkDomainLabel(b.domain);
              if (domainA === domainB) return 0;
              return domainA.localeCompare(domainB) * directionOrder;
            }
            case "score": {
              const scoreA = parseNumericMetric(a.score);
              const scoreB = parseNumericMetric(b.score);
              const byNumeric = compareNumericWithDirection(
                scoreA,
                scoreB,
                sortDirection,
              );
              if (byNumeric !== 0) return byNumeric;
              return a.modelName.localeCompare(b.modelName) * directionOrder;
            }
            case "price": {
              const priceA = parseNumericMetric(a.price);
              const priceB = parseNumericMetric(b.price);
              const byNumeric = compareNumericWithDirection(
                priceA,
                priceB,
                sortDirection,
              );
              if (byNumeric !== 0) return byNumeric;
              return a.modelName.localeCompare(b.modelName) * directionOrder;
            }
            case "speed": {
              const speedA = parseNumericMetric(a.speed);
              const speedB = parseNumericMetric(b.speed);
              const byNumeric = compareNumericWithDirection(
                speedA,
                speedB,
                sortDirection,
              );
              if (byNumeric !== 0) return byNumeric;
              return a.modelName.localeCompare(b.modelName) * directionOrder;
            }
            case "latency": {
              const latencyA = parseNumericMetric(a.latency);
              const latencyB = parseNumericMetric(b.latency);
              const byNumeric = compareNumericWithDirection(
                latencyA,
                latencyB,
                sortDirection,
              );
              if (byNumeric !== 0) return byNumeric;
              return a.modelName.localeCompare(b.modelName) * directionOrder;
            }
            case "lastChecked": {
              const latestA = getLatestSourceCheckedAt(a);
              const latestB = getLatestSourceCheckedAt(b);
              if (!latestA && !latestB) return 0;
              if (!latestA) return 1;
              if (!latestB) return -1;
              return latestB.localeCompare(latestA) * directionOrder;
            }
            default:
              return 0;
          }
        }),
    [domain, provider, searchTerms, sourceKind, sortDirection, sortMode],
  );
  const maxScore = Math.max(
    1,
    ...visibleEntries.map((entry) => parseNumericMetric(entry.score) ?? 0),
  );
  const pagedEntries =
    benchmarkLimit === 0 ? visibleEntries : visibleEntries.slice(0, benchmarkLimit);
  const coverageItems = useMemo(() => {
    const sources = visibleEntries.flatMap((entry) => getSources(entry.sourceIds));
    return [
      { label: "항목", value: visibleEntries.length },
      { label: "출처", value: new Set(sources.map((source) => source.id)).size },
      {
        label: "공식",
        value: sources.filter((source) => source.kind === "official").length,
      },
      {
        label: "논문/벤치",
        value: sources.filter((source) => source.kind === "benchmark").length,
      },
    ];
  }, [visibleEntries]);
  return (
    <section id="benchmarks" className="space-y-4">
      <SectionHeader
        icon={BarChart3}
        title="벤치마크와 비용"
        description="종합 리더보드, SWE-Bench Pro, SWE-Lancer, PaperBench, MLE-bench, BrowseComp, RE-Bench, EVMbench, Cybench, GDPval, SpreadsheetBench를 분야별 점수·규모·비용·latency와 함께 봅니다."
      />
      <div className="grid gap-4 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <label className="block xl:col-span-4">
          <span className="text-xs font-semibold text-text-subtle">
            벤치마크 검색
          </span>
          <span className="relative mt-2 block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-subtle" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="SWE-bench, PPT, 한국어, MCP, 비용, Cursor, GDPval"
              className="h-10 w-full rounded-md border border-border bg-bg pl-9 pr-3 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
            />
          </span>
        </label>
        <SegmentBar
          label="분야"
          items={benchmarkDomainFilters}
          value={domain}
          onChange={setDomain}
        />
        <SegmentBar
          label="출처 성격"
          items={sourceKindFilters}
          value={sourceKind}
          onChange={setSourceKind}
        />
        <SegmentBar
          label="정렬"
          items={sortFilters}
          value={sortMode}
          onChange={setSortMode}
        />
        <SegmentBar
          label="정렬 방향"
          items={sortDirectionFilters}
          value={sortDirection}
          onChange={setSortDirection}
        />
          <label className="block">
            <span className="text-xs font-semibold text-text-subtle">
              제공사
            </span>
          <select
            value={provider}
            onChange={(event) =>
              setProvider(event.target.value as BenchmarkProviderFilter)
            }
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
          >
            {benchmarkProviderFilters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-text-subtle">
              표시 개수
            </span>
            <select
              value={benchmarkLimit}
              onChange={(event) =>
                setBenchmarkLimit(Number(event.target.value))
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              <option value={0}>전체</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={30}>30개</option>
            </select>
          </label>
          <div className="rounded-md border border-border bg-bg p-3 xl:col-span-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {coverageItems.map((item) => (
                  <span
                    key={item.label}
                    className="rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle"
                  >
                    {item.label} {item.value}
                  </span>
                ))}
              </div>
              <p className="text-xs font-semibold text-text-subtle">
                표시 {pagedEntries.length}개 / 전체 {visibleEntries.length}개
              </p>
            <button
              type="button"
              onClick={() => {
                setDomain("all");
                setProvider("all");
                setSourceKind("all");
                setSortMode("score");
                setSortDirection("desc");
                setQuery("");
                setBenchmarkLimit(0);
              }}
              className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-[4.5rem_1fr_5rem] gap-3 border-b border-border px-4 py-3 text-xs font-semibold text-text-subtle md:grid-cols-[5rem_1.4fr_1fr_1fr_1fr_5rem]">
          <span>순위</span>
          <span>모델</span>
          <span className="hidden md:block">가격</span>
          <span className="hidden md:block">속도</span>
          <span className="hidden md:block">Latency</span>
          <span className="text-right">점수/규모</span>
        </div>
        {pagedEntries.map((entry) => {
          const numericScore = parseNumericMetric(entry.score) ?? 0;
          const width = `${Math.max(4, (numericScore / maxScore) * 100)}%`;
          const entrySources = getSources(entry.sourceIds);
          const sourceKinds = [
            ...new Set(entrySources.map((source) => sourceKindLabel(source.kind))),
          ];
          const lastChecked = getLatestSourceCheckedAt(entry);
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
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {entrySources.slice(0, 2).map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle transition hover:text-text"
                    >
                      {source.publisher}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  ))}
                  {sourceKinds.map((kind) => (
                    <span
                      key={kind}
                      className="rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle"
                    >
                      {kind}
                    </span>
                  ))}
                  {lastChecked ? (
                    <span className="rounded-md border border-border bg-bg px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle">
                      확인 {lastChecked}
                    </span>
                  ) : null}
                </div>
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
        {!pagedEntries.length ? (
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

export function ComparisonMatrix() {
  const [rowQuery, setRowQuery] = useState("");
  const [matrixSortMode, setMatrixSortMode] =
    useState<ComparisonMatrixSortMode>("axis");
  const [matrixSortDirection, setMatrixSortDirection] =
    useState<ComparisonMatrixSortDirection>("asc");
  const [matrixLimit, setMatrixLimit] = useState<ListLimit>(0);
  const matrixSortFilters: Array<{
    id: ComparisonMatrixSortMode;
    label: string;
  }> = [
    { id: "axis", label: "축명" },
    { id: "filled", label: "채워진 항목" },
    { id: "coverage", label: "내용 길이" },
  ];
  const matrixSortDirectionFilters: Array<{
    id: ComparisonMatrixSortDirection;
    label: string;
  }> = [
    { id: "asc", label: "오름차순" },
    { id: "desc", label: "내림차순" },
  ];
  const visibleComparisonRows = useMemo(() => {
    const normalizedQuery = rowQuery
      .trim()
      .toLocaleLowerCase("ko-KR");
    const sortedRows = comparisonRows
      .filter((row) =>
        normalizedQuery
          ? row.axis
              .toLocaleLowerCase("ko-KR")
              .includes(normalizedQuery)
          : true,
      )
      .map((row) => ({
        ...row,
        filledCount: Object.values(row.cells)
          .filter((value) => value && value !== "-").length,
        valueLength: Object.values(row.cells).reduce(
          (total, value) => total + value.length,
          0,
        ),
      }))
      .toSorted((left, right) => {
        const direction = matrixSortDirection === "asc" ? 1 : -1;
        if (matrixSortMode === "axis") {
          return left.axis.localeCompare(right.axis, "ko") * direction;
        }
        if (matrixSortMode === "filled") {
          const byFilled = left.filledCount - right.filledCount;
          if (byFilled !== 0) return byFilled * direction;
        }
        const byLength = left.valueLength - right.valueLength;
        return byLength * direction;
      });
    return sortedRows;
  }, [matrixSortDirection, matrixSortMode, rowQuery]);
  const pagedComparisonRows =
    matrixLimit === 0
      ? visibleComparisonRows
      : visibleComparisonRows.slice(0, matrixLimit);

  return (
    <section className="space-y-4">
      <SectionHeader
        icon={Table2}
        title="기능 비교"
        description="최신 모델 스펙과 제품 성격이 다른 항목은 같은 축에 놓되 해석 기준을 분리했습니다."
      />
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
        <label className="block xl:col-span-2">
          <span className="text-xs font-semibold text-text-subtle">
            축 검색
          </span>
          <input
            value={rowQuery}
            onChange={(event) => setRowQuery(event.target.value)}
            placeholder="토큰 수, 멀티모달, 코드 생성, 추론"
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent"
          />
        </label>
        <SegmentBar
          label="행 정렬"
          items={matrixSortFilters}
          value={matrixSortMode}
          onChange={setMatrixSortMode}
        />
        <SegmentBar
          label="정렬 방향"
          items={matrixSortDirectionFilters}
          value={matrixSortDirection}
          onChange={setMatrixSortDirection}
        />
        <label className="block">
          <span className="text-xs font-semibold text-text-subtle">
            표시 개수
          </span>
          <select
            value={matrixLimit}
            onChange={(event) => setMatrixLimit(Number(event.target.value))}
            className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
          >
            <option value={0}>전체</option>
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
          </select>
        </label>
        <div className="rounded-md border border-border bg-bg p-3 xl:col-span-4">
          <p className="text-xs font-semibold text-text-subtle">필터 결과</p>
          <p className="mt-1 text-sm font-semibold text-text">
            표시 {pagedComparisonRows.length}개 / 전체 {visibleComparisonRows.length}개
          </p>
        </div>
      </div>
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
            {pagedComparisonRows.map((row) => (
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
