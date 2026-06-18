import {
  benchmarkEntries,
  comparisonProviderOrder,
  comparisonRows,
  getBenchmarkDomainLabel,
  getProviderLabel,
  getSources,
  providerCatalog,
  type BenchmarkDomain,
  type ModelProfile,
} from "@aidigestdesk/content";
import { BarChart3, Boxes, ExternalLink, Table2 } from "lucide-react";
import { useState } from "react";

import {
  EmptyState,
  SectionHeader,
  SegmentBar,
  TextList,
} from "@/components/app/CommonUi";

type BenchmarkDomainFilter = BenchmarkDomain | "all";

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

export function ModelDetail({ profile }: { profile: ModelProfile }) {
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

export function BenchmarkBoard() {
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

export function ComparisonMatrix() {
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
