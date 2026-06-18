import {
  getSources,
  providerCatalog,
  type LearningResource,
  type ProviderId,
} from "@aidigestdesk/content";
import { ExternalLink, Library } from "lucide-react";
import { useMemo, useState } from "react";

import { SectionHeader, SegmentBar } from "@/components/app/CommonUi";
import {
  sourceKindFilters,
  sourceKindLabel,
  type SourceKindFilter,
} from "@/components/app/sourceLabels";

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

export function ResourceLibrary({
  resources,
}: {
  resources: LearningResource[];
}) {
  const [language, setLanguage] = useState<ResourceLanguageFilter>("all");
  const [resourceType, setResourceType] = useState<ResourceTypeFilter>("all");
  const [level, setLevel] = useState<ResourceLevelFilter>("all");
  const [resourceProvider, setResourceProvider] =
    useState<ResourceProviderFilter>("all");
  const [focus, setFocus] = useState<ResourceFocusFilter>("all");
  const [sourceKind, setSourceKind] = useState<SourceKindFilter>("all");
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
            (sourceKind === "all" ||
              getSources(resource.sourceIds).some(
                (source) => source.kind === sourceKind,
              )) &&
            (tag === "all" || resource.tags.includes(tag)),
        )
        .toSorted((a, b) =>
          a.language === b.language ? 0 : a.language === "한국어" ? -1 : 1,
        ),
    [
      focus,
      language,
      level,
      resourceProvider,
      resourceType,
      resources,
      sourceKind,
      tag,
    ],
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
        <SegmentBar
          label="출처 성격"
          items={sourceKindFilters}
          value={sourceKind}
          onChange={setSourceKind}
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
                setSourceKind("all");
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
