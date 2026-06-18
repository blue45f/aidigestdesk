import { ExternalLink, FileText } from "lucide-react";
import { useMemo, useState } from "react";

import type { SourceRef } from "@aidigestdesk/content";

import { EmptyState, SectionHeader, SegmentBar } from "@/components/app/CommonUi";
import {
  sourceKindFilters,
  sourceKindLabel,
  type SourceKindFilter,
} from "@/components/app/sourceLabels";

type SourceSortMode =
  | "title"
  | "publisher"
  | "kind"
  | "lastChecked"
  | "note";
type SourceSortDirection = "asc" | "desc";

export function SourcesSection({
  sourceItems,
}: {
  sourceItems: SourceRef[];
}) {
  const [kind, setKind] = useState<SourceKindFilter>("all");
  const [publisherQuery, setPublisherQuery] = useState("");
  const [sortMode, setSortMode] = useState<SourceSortMode>("title");
  const [sortDirection, setSortDirection] =
    useState<SourceSortDirection>("asc");

  const sortModeFilters: Array<{ id: SourceSortMode; label: string }> = [
    { id: "title", label: "제목" },
    { id: "publisher", label: "발행처" },
    { id: "kind", label: "출처 성격" },
    { id: "lastChecked", label: "확인일" },
    { id: "note", label: "요약" },
  ];
  const sortDirectionFilters: Array<{
    id: SourceSortDirection;
    label: string;
  }> = [
    { id: "asc", label: "오름차순" },
    { id: "desc", label: "내림차순" },
  ];

  const filteredSources = useMemo(() => {
    const direction = sortDirection === "asc" ? 1 : -1;
    const normalizedQuery = publisherQuery.trim().toLocaleLowerCase("ko-KR");

    return sourceItems
      .filter((source) => {
        const searchable = `${source.publisher} ${source.title} ${source.note} ${source.kind}`;
        return (
          (kind === "all" || source.kind === kind) &&
          (!normalizedQuery ||
            searchable.toLocaleLowerCase("ko-KR").includes(normalizedQuery))
        );
      })
      .toSorted((left, right) => {
        switch (sortMode) {
          case "title":
            return left.title.localeCompare(right.title) * direction;
          case "publisher":
            return left.publisher.localeCompare(right.publisher) * direction;
          case "kind":
            return sourceKindLabel(left.kind).localeCompare(
              sourceKindLabel(right.kind),
            ) * direction;
          case "lastChecked":
            return right.lastChecked.localeCompare(left.lastChecked) * direction;
          case "note":
            return left.note.localeCompare(right.note) * direction;
          default:
            return 0;
        }
      });
  }, [kind, publisherQuery, sortDirection, sortMode, sourceItems]);

  const resetFilters = () => {
    setKind("all");
    setPublisherQuery("");
    setSortMode("title");
    setSortDirection("asc");
  };

  const isResetDisabled =
    kind === "all" &&
    publisherQuery.trim() === "" &&
    sortMode === "title" &&
    sortDirection === "asc";

  return (
    <section id="sources" className="space-y-4">
      <SectionHeader
        icon={FileText}
        title="출처"
        description="제품 스펙은 공식 문서, 성능 비교는 벤치마크, 학습 자료는 발행 주체별로 구분하고 출처 성격과 발행처로 좁힙니다."
      />
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 xl:grid-cols-[1fr_1fr_8rem_8rem_1.7fr]">
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
        <SegmentBar
          label="정렬"
          items={sortModeFilters}
          value={sortMode}
          onChange={setSortMode}
        />
        <SegmentBar
          label="정렬 방향"
          items={sortDirectionFilters}
          value={sortDirection}
          onChange={setSortDirection}
        />
        <div className="rounded-md border border-border bg-bg p-3">
          <p className="text-xs font-semibold text-text-subtle">필터 결과</p>
          <p className="mt-1 text-lg font-semibold text-text">
            {filteredSources.length}개
          </p>
          <button
            type="button"
            onClick={resetFilters}
            disabled={isResetDisabled}
            className="mt-3 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            필터 초기화
          </button>
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
