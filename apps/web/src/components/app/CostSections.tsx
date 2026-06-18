import { calculateModelCosts, getProviderLabel } from "@aidigestdesk/content";
import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";

import { SectionHeader } from "@/components/app/CommonUi";

export function ModelCostCalculator() {
  const [scenario, setScenario] = useState({
    inputTokensPerRun: 10000,
    outputTokensPerRun: 2000,
    runsPerMonth: 1000,
  });
  const estimates = useMemo(() => calculateModelCosts(scenario), [scenario]);
  const cheapest = estimates[0];

  const updateScenario = (key: keyof typeof scenario, value: string) => {
    const parsed = Number(value);
    setScenario((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    }));
  };

  return (
    <section id="costs" className="space-y-4">
      <SectionHeader
        icon={Calculator}
        title="모델 비용 계산기"
        description="월 호출량 기준으로 주요 모델의 예상 토큰 비용을 비교합니다. 벤치마크 환산 단가는 비교용으로 표시합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[22rem_1fr]">
        <article className="rounded-lg border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text">사용량 시나리오</h3>
          <div className="mt-4 space-y-3">
            <NumberField
              label="1회 입력 토큰"
              value={scenario.inputTokensPerRun}
              onChange={(value) => updateScenario("inputTokensPerRun", value)}
            />
            <NumberField
              label="1회 출력 토큰"
              value={scenario.outputTokensPerRun}
              onChange={(value) => updateScenario("outputTokensPerRun", value)}
            />
            <NumberField
              label="월 실행 횟수"
              value={scenario.runsPerMonth}
              onChange={(value) => updateScenario("runsPerMonth", value)}
            />
          </div>
          <div className="mt-4 rounded-md border border-border bg-bg p-3">
            <p className="text-xs text-text-subtle">가장 낮은 예상 비용</p>
            <p className="mt-1 text-lg font-semibold text-text">
              {cheapest?.profile.modelName ?? "-"} ·{" "}
              {cheapest?.formattedTotal ?? "$0.00"}
            </p>
            <p className="mt-1 text-xs leading-5 text-text-subtle">
              Manus, Kimi, Qwen처럼 태스크형 서비스이거나 공식 USD 토큰 단가를
              화면에서 확정하지 못한 항목은 계산기에서 제외했습니다.
            </p>
          </div>
        </article>

        <article className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="overflow-x-auto">
            <div className="min-w-[42rem]">
              <div className="grid grid-cols-[1fr_6rem_6rem_6rem] gap-3 border-b border-border px-4 py-3 text-xs font-semibold text-text-subtle">
                <span>모델</span>
                <span className="text-right">입력</span>
                <span className="text-right">출력</span>
                <span className="text-right">월 합계</span>
              </div>
              {estimates.map((estimate) => (
                <div
                  key={estimate.profile.id}
                  className="grid grid-cols-[1fr_6rem_6rem_6rem] gap-3 border-b border-border px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">
                      {estimate.profile.modelName}
                    </p>
                    <p className="mt-1 text-xs text-text-subtle">
                      {getProviderLabel(estimate.profile.providerId)} ·{" "}
                      {estimate.profile.pricingBasis}
                    </p>
                    <p className="mt-1 hidden text-xs leading-5 text-text-subtle md:block">
                      {estimate.profile.notes}
                    </p>
                  </div>
                  <p className="text-right text-xs font-semibold text-text-muted">
                    {estimate.inputCost.toFixed(2)}
                  </p>
                  <p className="text-right text-xs font-semibold text-text-muted">
                    {estimate.outputCost.toFixed(2)}
                  </p>
                  <p className="text-right text-sm font-semibold text-text">
                    {estimate.formattedTotal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

type EventCreditMode = "none" | "double-credit" | "half-price";

const eventCostScenarios = [
  {
    id: "webinar",
    title: "온라인 세미나 Q&A",
    summary: "참가자 질문 요약, 후속 메일 초안, 세션별 하이라이트 생성",
    inputTokensPerRun: 6000,
    outputTokensPerRun: 1200,
    runsPerMonth: 600,
  },
  {
    id: "hackathon",
    title: "해커톤/부트캠프 멘토링",
    summary: "코드 리뷰, README 초안, 에러 로그 분석, 발표 자료 피드백",
    inputTokensPerRun: 14000,
    outputTokensPerRun: 3000,
    runsPerMonth: 1200,
  },
  {
    id: "launch",
    title: "제품 런칭 이벤트",
    summary: "랜딩 카피, FAQ, 고객 문의 분류, 커뮤니티 댓글 요약",
    inputTokensPerRun: 9000,
    outputTokensPerRun: 1800,
    runsPerMonth: 2400,
  },
] as const;

export function EventCostComparisonSection() {
  const [scenarioId, setScenarioId] =
    useState<(typeof eventCostScenarios)[number]["id"]>("webinar");
  const [creditMode, setCreditMode] = useState<EventCreditMode>("none");
  const scenario =
    eventCostScenarios.find((item) => item.id === scenarioId) ??
    eventCostScenarios[0];
  const discountFactor =
    creditMode === "double-credit" || creditMode === "half-price" ? 0.5 : 1;
  const estimates = useMemo(
    () =>
      calculateModelCosts(scenario)
        .slice(0, 6)
        .map((estimate) => ({
          ...estimate,
          adjustedTotal: estimate.totalCost * discountFactor,
        })),
    [discountFactor, scenario],
  );

  return (
    <section id="event-costs" className="space-y-4">
      <SectionHeader
        icon={Calculator}
        title="이벤트 비용 비교"
        description="2배 크레딧, 50% 할인, 친구 초대 크레딧 같은 이벤트를 가정해 행사성 AI 운영 비용을 별도로 비교합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[24rem_1fr]">
        <article className="rounded-lg border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text">행사 시나리오</h3>
          <label className="mt-4 block">
            <span className="text-xs font-semibold text-text-subtle">
              이벤트 유형
            </span>
            <select
              value={scenarioId}
              onChange={(event) =>
                setScenarioId(
                  event.target
                    .value as (typeof eventCostScenarios)[number]["id"],
                )
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              {eventCostScenarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-semibold text-text-subtle">
              프로모션 효과
            </span>
            <select
              value={creditMode}
              onChange={(event) =>
                setCreditMode(event.target.value as EventCreditMode)
              }
              className="mt-2 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition focus:border-accent"
            >
              <option value="none">이벤트 없음</option>
              <option value="double-credit">2배 크레딧 적용</option>
              <option value="half-price">50% 할인 적용</option>
            </select>
          </label>
          <div className="mt-4 rounded-md border border-border bg-bg p-3">
            <p className="text-sm font-semibold text-text">{scenario.title}</p>
            <p className="mt-1 text-xs leading-5 text-text-muted">
              {scenario.summary}
            </p>
            <p className="mt-2 text-xs text-text-subtle">
              {scenario.runsPerMonth.toLocaleString("ko-KR")}회 실행 · 입력{" "}
              {scenario.inputTokensPerRun.toLocaleString("ko-KR")} · 출력{" "}
              {scenario.outputTokensPerRun.toLocaleString("ko-KR")} tokens
            </p>
          </div>
        </article>

        <article className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[1fr_6rem_6rem] gap-3 border-b border-border px-4 py-3 text-xs font-semibold text-text-subtle md:grid-cols-[1.4fr_7rem_7rem_7rem]">
            <span>모델</span>
            <span className="text-right">일반</span>
            <span className="text-right">이벤트</span>
            <span className="hidden text-right md:block">절감</span>
          </div>
          {estimates.map((estimate) => {
            const saved = estimate.totalCost - estimate.adjustedTotal;
            return (
              <div
                key={estimate.profile.id}
                className="grid grid-cols-[1fr_6rem_6rem] gap-3 border-b border-border px-4 py-3 last:border-b-0 md:grid-cols-[1.4fr_7rem_7rem_7rem]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">
                    {estimate.profile.modelName}
                  </p>
                  <p className="mt-1 text-xs text-text-subtle">
                    {getProviderLabel(estimate.profile.providerId)} ·{" "}
                    {estimate.profile.pricingBasis}
                  </p>
                </div>
                <p className="text-right text-xs font-semibold text-text-muted">
                  ${estimate.totalCost.toFixed(2)}
                </p>
                <p className="text-right text-sm font-semibold text-text">
                  ${estimate.adjustedTotal.toFixed(2)}
                </p>
                <p className="hidden text-right text-xs font-semibold text-accent md:block">
                  ${saved.toFixed(2)}
                </p>
              </div>
            );
          })}
        </article>
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-text-subtle">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm font-semibold text-text outline-none transition focus:border-accent"
      />
    </label>
  );
}
