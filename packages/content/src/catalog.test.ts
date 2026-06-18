import { describe, expect, it } from "vitest";

import {
  calculateModelCosts,
  getCatalogStats,
  getMissingSourceReferences,
  getSources,
  movePipelineStage,
  runContentAudit,
  searchCatalog,
} from "./catalog";

describe("catalog search", () => {
  it("finds Gemini with Korean typo alias", () => {
    const results = searchCatalog("재미나이");
    expect(results.models.some((model) => model.id === "gemini-31-pro")).toBe(
      true,
    );
  });

  it("filters by provider", () => {
    const results = searchCatalog("", "openai");
    expect(results.models).toHaveLength(1);
    expect(results.models[0]?.providerId).toBe("openai");
  });

  it("finds newly added AI providers and vibe coding commands", () => {
    const kimiResults = searchCatalog("Kimi");
    expect(
      kimiResults.models.some((model) => model.id === "kimi-k27-code"),
    ).toBe(true);

    const deepSeekResults = searchCatalog("딥시크");
    expect(
      deepSeekResults.models.some((model) => model.id === "deepseek-v4-flash"),
    ).toBe(true);

    const qwenResults = searchCatalog("Qwen", "qwen");
    expect(qwenResults.models.some((model) => model.id === "qwen3-2507")).toBe(
      true,
    );

    const cursorResults = searchCatalog("Cursor", "cursor");
    expect(
      cursorResults.models.some((model) => model.id === "cursor-ai-ide"),
    ).toBe(true);
    expect(
      cursorResults.vibeCodingCommands.some(
        (command) => command.id === "cmd-cursor-agent",
      ),
    ).toBe(true);

    const vibeResults = searchCatalog("aider", "all", "vibe");
    expect(vibeResults.vibeCodingCommands.length).toBeGreaterThan(0);

    const installResults = searchCatalog("curl -fsSL", "all", "vibe");
    expect(
      installResults.vibeCodingCommands.some(
        (command) => command.id === "cmd-openai-codex",
      ),
    ).toBe(true);
  });

  it("finds learning books only in books category", () => {
    const results = searchCatalog("", "all", "books");
    expect(results.resources.length).toBeGreaterThan(0);
    expect(
      results.resources.every((resource) => resource.type === "도서"),
    ).toBe(true);
  });

  it("finds Korean official and community learning resources", () => {
    const results = searchCatalog("한국어", "all", "learning");

    expect(results.resources.length).toBeGreaterThan(0);
    expect(
      results.resources.some((resource) => resource.language === "한국어"),
    ).toBe(true);
    expect(
      results.resources.some((resource) => resource.type === "블로그/글"),
    ).toBe(true);
  });

  it("finds expanded Korean vibe coding resources", () => {
    const hermesResults = searchCatalog("헤르메스", "all", "learning");
    expect(
      hermesResults.resources.some(
        (resource) => resource.id === "res-hermes-agent-video",
      ),
    ).toBe(true);

    const codeFactoryResults = searchCatalog("코드팩토리", "all", "learning");
    expect(
      codeFactoryResults.resources.some(
        (resource) => resource.id === "res-codefactory-ai-coding",
      ),
    ).toBe(true);

    const devDongsaengResults = searchCatalog("개발동생", "all", "learning");
    expect(
      devDongsaengResults.resources.some(
        (resource) => resource.id === "res-dev-dongsaeng-ai-coding",
      ),
    ).toBe(true);

    const cursorResults = searchCatalog("Cursor", "all", "learning");
    expect(
      cursorResults.resources.some(
        (resource) => resource.id === "res-cursor-docs",
      ),
    ).toBe(true);

    const educationResults = searchCatalog("원격 교육", "all", "learning");
    expect(
      educationResults.resources.some(
        (resource) => resource.id === "res-korean-remote-bootcamps",
      ),
    ).toBe(true);
  });

  it("finds LLM event and promotion watch items", () => {
    const results = searchCatalog("초대", "all", "events");

    expect(results.updates.length).toBeGreaterThan(0);
    expect(
      results.updates.some((update) => update.id === "event-manus-promotions"),
    ).toBe(true);
  });

  it("finds expanded AI coding tool profiles", () => {
    const jetBrainsResults = searchCatalog("JetBrains", "all", "tools");
    expect(
      jetBrainsResults.aiCodingTools.some(
        (tool) => tool.id === "tool-jetbrains-junie",
      ),
    ).toBe(true);

    const codeRabbitResults = searchCatalog("PR 리뷰", "all", "tools");
    expect(
      codeRabbitResults.aiCodingTools.some(
        (tool) => tool.id === "tool-coderabbit",
      ),
    ).toBe(true);

    const studentResults = searchCatalog("학생", "all", "tools");
    expect(
      studentResults.aiCodingTools.some(
        (tool) => tool.id === "tool-github-copilot",
      ),
    ).toBe(true);
  });

  it("finds expanded benchmark and Korean course sources", () => {
    const sweBenchResults = searchCatalog("SWE-bench", "all", "benchmarks");
    expect(
      sweBenchResults.benchmarks.some(
        (entry) => entry.id === "swebench-verified-coverage",
      ),
    ).toBe(true);

    const aiderResults = searchCatalog("Aider", "all", "benchmarks");
    expect(
      aiderResults.benchmarks.some(
        (entry) => entry.id === "aider-gpt5-high-polyglot",
      ),
    ).toBe(true);

    const mobileResults = searchCatalog("모바일", "all", "benchmarks");
    expect(
      mobileResults.benchmarks.some(
        (entry) => entry.id === "swebench-mobile-cursor-opus",
      ),
    ).toBe(true);

    const dialogueResults = searchCatalog("대화", "all", "benchmarks");
    expect(
      dialogueResults.benchmarks.some(
        (entry) => entry.id === "dialogue-swebench-agent",
      ),
    ).toBe(true);

    const sweLancerResults = searchCatalog("SWE-Lancer", "all", "benchmarks");
    expect(
      sweLancerResults.benchmarks.some(
        (entry) => entry.id === "swelancer-economic-coding",
      ),
    ).toBe(true);

    const paperBenchResults = searchCatalog("PaperBench", "all", "benchmarks");
    expect(
      paperBenchResults.benchmarks.some(
        (entry) => entry.id === "paperbench-research-replication",
      ),
    ).toBe(true);

    const mleBenchResults = searchCatalog("MLE-bench", "all", "benchmarks");
    expect(
      mleBenchResults.benchmarks.some(
        (entry) => entry.id === "mlebench-kaggle-engineering",
      ),
    ).toBe(true);

    const browseCompResults = searchCatalog("BrowseComp", "all", "benchmarks");
    expect(
      browseCompResults.benchmarks.some(
        (entry) => entry.id === "browsecomp-web-research",
      ),
    ).toBe(true);

    const gpuResults = searchCatalog("GPU", "all", "benchmarks");
    expect(
      gpuResults.benchmarks.some(
        (entry) => entry.id === "kernelbench-gpu-kernels",
      ),
    ).toBe(true);

    const smartContractResults = searchCatalog(
      "스마트컨트랙트",
      "all",
      "benchmarks",
    );
    expect(
      smartContractResults.benchmarks.some(
        (entry) => entry.id === "evmbench-smart-contract-security",
      ),
    ).toBe(true);

    const cybenchResults = searchCatalog("Cybench", "all", "benchmarks");
    expect(
      cybenchResults.benchmarks.some(
        (entry) => entry.id === "cybench-ctf-agent",
      ),
    ).toBe(true);

    const reBenchResults = searchCatalog("RE-Bench", "all", "benchmarks");
    expect(
      reBenchResults.benchmarks.some((entry) => entry.id === "rebench-ai-rd"),
    ).toBe(true);

    const webAgentResults = searchCatalog("웹 에이전트", "all", "learning");
    expect(
      webAgentResults.resources.some(
        (resource) => resource.id === "res-benchmark-hubs-web-os-agents",
      ),
    ).toBe(true);

    const gdpvalResults = searchCatalog("GDPval", "all", "benchmarks");
    expect(
      gdpvalResults.benchmarks.some(
        (entry) => entry.id === "gdpval-work-deliverables",
      ),
    ).toBe(true);

    const sheetResults = searchCatalog("스프레드시트", "all", "benchmarks");
    expect(
      sheetResults.benchmarks.some(
        (entry) => entry.id === "bluefin-finance-spreadsheets",
      ),
    ).toBe(true);

    const officeResults = searchCatalog("Office automation", "all", "learning");
    expect(
      officeResults.resources.some(
        (resource) => resource.id === "res-benchmark-hubs-work-office",
      ),
    ).toBe(true);

    const courseResults = searchCatalog("노마드코더", "all", "learning");
    expect(
      courseResults.resources.some(
        (resource) => resource.id === "res-korean-course-platforms",
      ),
    ).toBe(true);
  });

  it("finds task recommendations by user intent", () => {
    const cursorResults = searchCatalog(
      "버그 수정",
      "cursor",
      "recommendations",
    );
    expect(
      cursorResults.taskRecommendations.some(
        (recommendation) => recommendation.id === "task-repo-fix",
      ),
    ).toBe(true);

    const costResults = searchCatalog("저비용", "all", "recommendations");
    expect(
      costResults.taskRecommendations.some(
        (recommendation) => recommendation.id === "task-low-cost-bulk",
      ),
    ).toBe(true);
  });

  it("resolves source references", () => {
    expect(getSources(["openai-gpt55"])[0]?.publisher).toBe(
      "OpenAI Developers",
    );
  });

  it("exposes summary stats", () => {
    expect(getCatalogStats()).toMatchObject({
      providers: 10,
      updates: 33,
      benchmarkRows: 60,
      vibeCommands: 9,
      aiCodingTools: 14,
      personaGuides: 5,
      taskRecommendations: 8,
      monitors: 35,
      pipelineItems: 9,
      costProfiles: 10,
    });
  });

  it("audits source references and required coverage", () => {
    expect(getMissingSourceReferences()).toEqual([]);

    const audit = runContentAudit();
    expect(audit.passed).toBe(true);
    expect(audit.checks.every((check) => check.status !== "fail")).toBe(true);
  });

  it("searches editorial operations workflow", () => {
    const results = searchCatalog("후보", "all", "ops");

    expect(results.curationMonitors.length).toBeGreaterThan(0);
    expect(results.pipelineItems.length).toBeGreaterThan(0);
    expect(
      results.featureBacklog.some(
        (item) => item.id === "feature-source-crawler",
      ),
    ).toBe(true);
  });

  it("searches persona playbooks with provider filters", () => {
    const pmResults = searchCatalog("PM", "all", "personas");
    expect(
      pmResults.personaGuides.some(
        (guide) => guide.id === "persona-product-manager",
      ),
    ).toBe(true);

    const xaiResults = searchCatalog("", "xai", "personas");
    expect(
      xaiResults.personaGuides.every((guide) =>
        guide.providerIds.includes("xai"),
      ),
    ).toBe(true);
  });

  it("calculates monthly model costs sorted by total cost", () => {
    const estimates = calculateModelCosts({
      inputTokensPerRun: 10_000,
      outputTokensPerRun: 2_000,
      runsPerMonth: 1_000,
    });

    expect(estimates).toHaveLength(10);
    expect(estimates[0]?.totalCost).toBeLessThanOrEqual(
      estimates.at(-1)?.totalCost ?? 0,
    );
    expect(
      estimates.some((estimate) => estimate.profile.modelName === "GPT-5.5"),
    ).toBe(true);
  });

  it("moves pipeline stages within valid bounds", () => {
    expect(movePipelineStage("수집", "previous")).toBe("수집");
    expect(movePipelineStage("수집", "next")).toBe("검토");
    expect(movePipelineStage("게시 준비", "next")).toBe("게시");
    expect(movePipelineStage("게시", "next")).toBe("게시");
  });
});
