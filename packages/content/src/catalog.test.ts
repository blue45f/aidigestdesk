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

  it("finds learning books only in books category", () => {
    const results = searchCatalog("", "all", "books");
    expect(results.resources.length).toBeGreaterThan(0);
    expect(
      results.resources.every((resource) => resource.type === "도서"),
    ).toBe(true);
  });

  it("resolves source references", () => {
    expect(getSources(["openai-gpt55"])[0]?.publisher).toBe(
      "OpenAI Developers",
    );
  });

  it("exposes summary stats", () => {
    expect(getCatalogStats()).toMatchObject({
      providers: 5,
      updates: 6,
      benchmarkRows: 6,
      personaGuides: 4,
      monitors: 7,
      pipelineItems: 4,
      costProfiles: 5,
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

    expect(estimates).toHaveLength(5);
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
