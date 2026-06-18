import {
  eventScheduleItems,
  type EventScheduleItem,
  type EventScheduleType,
  getCatalogStats,
  getProviderLabel,
  getSources,
  learningResources,
  SNAPSHOT_DATE,
  sources,
  updates,
  type SearchResults,
  type SourceRef,
} from "@aidigestdesk/content";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Gauge,
  MapPin,
  Newspaper,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, SectionHeader } from "@/components/app/CommonUi";

const stats = getCatalogStats();

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

const scheduleTypeFilters: Array<{ id: EventScheduleType | "all"; label: string }> =
  [
    { id: "all", label: "전체" },
    { id: "해커톤", label: "해커톤" },
    { id: "컨퍼런스", label: "컨퍼런스" },
    { id: "웨비나", label: "웨비나" },
    { id: "세미나/모임", label: "세미나" },
    { id: "공모전/챌린지", label: "챌린지" },
    { id: "프로모션/지원", label: "지원" },
  ];

const weekdayLabels = ["월", "화", "수", "목", "금", "토", "일"] as const;

function parseDate(value: string) {
  const [year = 1970, month = 1, day = 1] = value
    .split("-")
    .map((part) => Number(part));
  return new Date(year, month - 1, day);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function formatDateRange(item: EventScheduleItem) {
  const start = item.startDate.replaceAll("-", ".");
  if (!item.endDate || item.endDate === item.startDate) return start;
  return `${start} - ${item.endDate.replaceAll("-", ".")}`;
}

function getScheduleEndDate(item: EventScheduleItem) {
  return item.endDate ?? item.startDate;
}

function isSameMonth(dateKey: string, monthDate: Date) {
  const date = parseDate(dateKey);
  return (
    date.getFullYear() === monthDate.getFullYear() &&
    date.getMonth() === monthDate.getMonth()
  );
}

function eventTouchesDate(item: EventScheduleItem, dateKey: string) {
  return item.startDate <= dateKey && getScheduleEndDate(item) >= dateKey;
}

function eventTouchesMonth(item: EventScheduleItem, monthDate: Date) {
  const firstDay = toDateKey(startOfMonth(monthDate));
  const lastDay = toDateKey(
    new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
  );
  return item.startDate <= lastDay && getScheduleEndDate(item) >= firstDay;
}

function statusClass(status: EventScheduleItem["status"]) {
  switch (status) {
    case "모집중":
    case "진행중":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "진행예정":
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300";
    case "상시 확인":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
    case "종료":
      return "border-border bg-bg text-text-subtle";
  }
}

export function Briefing({
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

export function WebzineSection({
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

function EventCalendarBoard() {
  const [activeMonth, setActiveMonth] = useState(() =>
    startOfMonth(parseDate(SNAPSHOT_DATE)),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<EventScheduleType | "all">(
    "all",
  );

  const filteredEvents = useMemo(
    () =>
      eventScheduleItems
        .filter((item) => selectedType === "all" || item.type === selectedType)
        .toSorted((a, b) => a.startDate.localeCompare(b.startDate)),
    [selectedType],
  );

  const monthEvents = filteredEvents.filter((item) =>
    eventTouchesMonth(item, activeMonth),
  );
  const agendaEvents = (
    selectedDate
      ? filteredEvents.filter((item) => eventTouchesDate(item, selectedDate))
      : monthEvents
  ).slice(0, 8);

  const leadingBlankCount = (startOfMonth(activeMonth).getDay() + 6) % 7;
  const firstCellDate = new Date(
    activeMonth.getFullYear(),
    activeMonth.getMonth(),
    1 - leadingBlankCount,
  );
  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCellDate);
    date.setDate(firstCellDate.getDate() + index);
    const dateKey = toDateKey(date);
    const events = filteredEvents.filter((item) =>
      eventTouchesDate(item, dateKey),
    );
    return {
      date,
      dateKey,
      events,
      inMonth: isSameMonth(dateKey, activeMonth),
      isSelected: selectedDate === dateKey,
      isToday: dateKey === SNAPSHOT_DATE,
    };
  });

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              <CalendarDays className="size-3.5" aria-hidden />
              일정 캘린더
            </p>
            <h3 className="mt-1 text-lg font-semibold text-text">
              {formatMonth(activeMonth)}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveMonth((date) => addMonths(date, -1))}
              className="grid size-9 place-items-center rounded-md border border-border bg-bg text-text-muted transition hover:text-text"
              aria-label="이전 달"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMonth(startOfMonth(parseDate(SNAPSHOT_DATE)));
                setSelectedDate(SNAPSHOT_DATE);
              }}
              className="h-9 rounded-md border border-border bg-bg px-3 text-xs font-semibold text-text-muted transition hover:text-text"
            >
              오늘
            </button>
            <button
              type="button"
              onClick={() => setActiveMonth((date) => addMonths(date, 1))}
              className="grid size-9 place-items-center rounded-md border border-border bg-bg text-text-muted transition hover:text-text"
              aria-label="다음 달"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {scheduleTypeFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => {
                setSelectedType(filter.id);
                setSelectedDate(null);
              }}
              className={
                selectedType === filter.id
                  ? "rounded-md border border-ink bg-ink px-2.5 py-1.5 text-xs font-semibold text-ink-fg"
                  : "rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[0.6875rem] font-semibold text-text-subtle">
          {weekdayLabels.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell) => (
            <button
              key={cell.dateKey}
              type="button"
              onClick={() => setSelectedDate(cell.dateKey)}
              className={`min-h-20 rounded-md border p-1.5 text-left transition sm:min-h-24 ${
                cell.isSelected
                  ? "border-ink bg-ink text-ink-fg"
                  : cell.isToday
                    ? "border-accent bg-surface-2 text-text"
                    : "border-border bg-bg text-text hover:border-border-strong"
              } ${cell.inMonth ? "" : "opacity-45"}`}
            >
              <span className="block text-xs font-semibold">
                {cell.date.getDate()}
              </span>
              {cell.events.length ? (
                <span
                  className={`mt-3 inline-flex size-5 items-center justify-center rounded-full text-[0.625rem] font-semibold sm:hidden ${
                    cell.isSelected
                      ? "bg-white/15 text-ink-fg"
                      : "bg-accent text-ink-fg"
                  }`}
                >
                  {cell.events.length}
                </span>
              ) : null}
              <span className="mt-1 hidden space-y-1 sm:block">
                {cell.events.slice(0, 2).map((item) => (
                  <span
                    key={item.id}
                    className={`block truncate rounded-sm px-1.5 py-0.5 text-[0.625rem] font-semibold ${
                      cell.isSelected
                        ? "bg-white/15 text-ink-fg"
                        : "bg-surface-2 text-text-muted"
                    }`}
                  >
                    {item.type === "컨퍼런스" ? "컨퍼런스" : item.type} ·{" "}
                    {item.organizer}
                  </span>
                ))}
                {cell.events.length > 2 ? (
                  <span
                    className={`block text-[0.625rem] font-semibold ${
                      cell.isSelected ? "text-ink-fg" : "text-accent"
                    }`}
                  >
                    +{cell.events.length - 2}
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </div>

      <aside className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              <SlidersHorizontal className="size-3.5" aria-hidden />
              일정 리스트
            </p>
            <h3 className="mt-1 text-lg font-semibold text-text">
              {selectedDate
                ? selectedDate.replaceAll("-", ".")
                : `${formatMonth(activeMonth)} 전체`}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
          >
            월간 전체
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {agendaEvents.length ? (
            agendaEvents.map((item) => {
              const eventSources = getSources(item.sourceIds);
              return (
                <article
                  key={item.id}
                  className="rounded-md border border-border bg-bg p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-accent">
                        {formatDateRange(item)} · {item.type}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold leading-5 text-text">
                        {item.title}
                      </h4>
                    </div>
                    <span
                      className={`rounded-md border px-2 py-1 text-[0.6875rem] font-semibold ${statusClass(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[0.6875rem] font-semibold text-text-subtle">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" aria-hidden />
                      {item.location}
                    </span>
                    {item.timeLabel ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" aria-hidden />
                        {item.timeLabel}
                      </span>
                    ) : null}
                    <span>{item.format}</span>
                    <span>{item.language}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-text-muted">
                    {item.summary}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-subtle">
                    {item.relevance}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-muted transition hover:text-text"
                    >
                      일정 보기
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                    {eventSources.slice(0, 2).map((source) => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[0.6875rem] font-semibold text-text-muted transition hover:text-text"
                      >
                        {source.publisher}
                        <ExternalLink className="size-3" aria-hidden />
                      </a>
                    ))}
                  </div>
                </article>
              );
            })
          ) : (
            <EmptyState
              title="선택한 날짜의 일정이 없습니다"
              body="월간 전체를 누르거나 다른 일정 유형을 선택하세요."
            />
          )}
        </div>
      </aside>
    </div>
  );
}

export function EventPromotionsSection() {
  const eventItems = updates.filter((item) => item.category === "events");

  return (
    <section id="events" className="space-y-4">
      <SectionHeader
        icon={Sparkles}
        title="AI 일정·해커톤·프로모션 워치"
        description="해커톤, 컨퍼런스, 웨비나, 학생/교육 혜택, 크레딧 이벤트를 날짜와 공식 확인 링크 기준으로 추적합니다."
      />
      <EventCalendarBoard />
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
