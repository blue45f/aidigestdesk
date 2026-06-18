import { describe, expect, it } from 'vitest'

import {
  calculateModelCosts,
  getCatalogStats,
  getMissingSourceReferences,
  getSources,
  movePipelineStage,
  runContentAudit,
  searchCatalog,
} from './catalog'

describe('catalog search', () => {
  it('finds Gemini with Korean typo alias', () => {
    const results = searchCatalog('재미나이')
    expect(results.models.some((model) => model.id === 'gemini-31-pro')).toBe(true)
  })

  it('filters by provider', () => {
    const results = searchCatalog('', 'openai')
    expect(results.models).toHaveLength(1)
    expect(results.models[0]?.providerId).toBe('openai')
  })

  it('finds newly added AI providers and vibe coding commands', () => {
    const kimiResults = searchCatalog('Kimi')
    expect(kimiResults.models.some((model) => model.id === 'kimi-k27-code')).toBe(true)

    const deepSeekResults = searchCatalog('딥시크')
    expect(deepSeekResults.models.some((model) => model.id === 'deepseek-v4-flash')).toBe(true)

    const qwenResults = searchCatalog('Qwen', 'qwen')
    expect(qwenResults.models.some((model) => model.id === 'qwen3-2507')).toBe(true)

    const cursorResults = searchCatalog('Cursor', 'cursor')
    expect(cursorResults.models.some((model) => model.id === 'cursor-ai-ide')).toBe(true)
    expect(
      cursorResults.vibeCodingCommands.some((command) => command.id === 'cmd-cursor-agent')
    ).toBe(true)

    const vibeResults = searchCatalog('aider', 'all', 'vibe')
    expect(vibeResults.vibeCodingCommands.length).toBeGreaterThan(0)

    const installResults = searchCatalog('curl -fsSL', 'all', 'vibe')
    expect(
      installResults.vibeCodingCommands.some((command) => command.id === 'cmd-openai-codex')
    ).toBe(true)
  })

  it('finds xAI 공식 문서와 OpenAI 호환 CLI 자료', () => {
    const xaiLearningResults = searchCatalog('xAI API', 'all', 'learning')

    expect(xaiLearningResults.resources.some((resource) => resource.id === 'res-xai-docs')).toBe(
      true
    )

    const xaiVibeResults = searchCatalog('grok', 'xai', 'vibe')
    expect(
      xaiVibeResults.vibeCodingCommands.some(
        (command) => command.id === 'cmd-xai-openai-compatible'
      )
    ).toBe(true)
  })

  it('finds learning books only in books category', () => {
    const results = searchCatalog('', 'all', 'books')
    expect(results.resources.length).toBeGreaterThan(0)
    expect(results.resources.every((resource) => resource.type === '도서')).toBe(true)
  })

  it('finds Korean official and community learning resources', () => {
    const results = searchCatalog('한국어', 'all', 'learning')

    expect(results.resources.length).toBeGreaterThan(0)
    expect(results.resources.some((resource) => resource.language === '한국어')).toBe(true)
    expect(results.resources.some((resource) => resource.type === '블로그/글')).toBe(true)
  })

  it('finds expanded Korean vibe coding resources', () => {
    const hermesResults = searchCatalog('헤르메스', 'all', 'learning')
    expect(
      hermesResults.resources.some((resource) => resource.id === 'res-hermes-agent-video')
    ).toBe(true)

    const codeFactoryResults = searchCatalog('코드팩토리', 'all', 'learning')
    expect(
      codeFactoryResults.resources.some((resource) => resource.id === 'res-codefactory-ai-coding')
    ).toBe(true)

    const devDongsaengResults = searchCatalog('개발동생', 'all', 'learning')
    expect(
      devDongsaengResults.resources.some(
        (resource) => resource.id === 'res-dev-dongsaeng-ai-coding'
      )
    ).toBe(true)

    const bbanghyongResults = searchCatalog('빵형', 'all', 'learning')
    expect(
      bbanghyongResults.resources.some(
        (resource) => resource.id === 'res-korean-dev-youtube-core-channels'
      )
    ).toBe(true)

    const codingNoonaResults = searchCatalog('코딩 알려주는 누나', 'all', 'learning')
    expect(
      codingNoonaResults.resources.some(
        (resource) => resource.id === 'res-korean-ai-youtube-creator-watchlist'
      )
    ).toBe(true)

    const okkyResults = searchCatalog('OKKY', 'all', 'learning')
    expect(
      okkyResults.resources.some((resource) => resource.id === 'res-korean-community-ai-writing')
    ).toBe(true)

    const velogResults = searchCatalog('Velog', 'all', 'learning')
    expect(
      velogResults.resources.some((resource) => resource.id === 'res-korean-community-ai-writing')
    ).toBe(true)

    const cursorResults = searchCatalog('Cursor', 'all', 'learning')
    expect(cursorResults.resources.some((resource) => resource.id === 'res-cursor-docs')).toBe(true)

    const koreanCursorResults = searchCatalog('커서 강좌', 'all', 'learning')
    expect(
      koreanCursorResults.resources.some(
        (resource) => resource.id === 'res-cursor-korean-youtube'
      )
    ).toBe(true)

    const koreanCodexCliResults = searchCatalog('코덱스 CLI', 'all', 'vibe')
    expect(
      koreanCodexCliResults.vibeCodingCommands.some(
        (command) => command.id === 'cmd-openai-codex'
      )
    ).toBe(true)

    const educationResults = searchCatalog('원격 교육', 'all', 'learning')
    expect(
      educationResults.resources.some((resource) => resource.id === 'res-korean-remote-bootcamps')
    ).toBe(true)

    const kDigitalResults = searchCatalog('K-디지털', 'all', 'learning')
    expect(
      kDigitalResults.resources.some(
        (resource) => resource.id === 'res-kdigital-public-training-hub'
      )
    ).toBe(true)
    expect(
      kDigitalResults.updates.some((update) => update.id === 'update-korean-public-ai-training')
    ).toBe(true)

    const bootcampResults = searchCatalog('SW마에스트로', 'all', 'learning')
    expect(
      bootcampResults.resources.some(
        (resource) => resource.id === 'res-national-ai-bootcamp-watchlist'
      )
    ).toBe(true)

    const newsletterResults = searchCatalog('GeekNews', 'all', 'learning')
    expect(
      newsletterResults.resources.some(
        (resource) => resource.id === 'res-korean-ai-newsletter-community-hub'
      )
    ).toBe(true)

    const domesticLlmResults = searchCatalog('HyperCLOVA X', 'all', 'learning')
    expect(
      domesticLlmResults.resources.some(
        (resource) => resource.id === 'res-korean-llm-official-products'
      )
    ).toBe(true)

    const exaoneResults = searchCatalog('EXAONE', 'all', 'learning')
    expect(
      exaoneResults.resources.some(
        (resource) => resource.id === 'res-korean-open-llm-technical-reports'
      )
    ).toBe(true)

    const koreanBenchmarkResourceResults = searchCatalog('KMMLU', 'all', 'learning')
    expect(
      koreanBenchmarkResourceResults.resources.some(
        (resource) => resource.id === 'res-korean-llm-benchmark-suite'
      )
    ).toBe(true)

    const opsResults = searchCatalog('국내 AI 교육 모집 상태', 'all', 'ops')
    expect(
      opsResults.pipelineItems.some((item) => item.id === 'pipe-korean-education-status-watch')
    ).toBe(true)
  })

  it('finds LLM event and promotion watch items', () => {
    const results = searchCatalog('초대', 'all', 'events')

    expect(results.updates.length).toBeGreaterThan(0)
    expect(results.updates.some((update) => update.id === 'event-manus-promotions')).toBe(true)

    const upstageResults = searchCatalog('Solar Pro 3', 'all', 'events')
    expect(
      upstageResults.updates.some((update) => update.id === 'update-upstage-solar-pro3-pricing')
    ).toBe(true)
  })

  it('finds official status, release, and cost optimization monitors', () => {
    const statusResults = searchCatalog('SLA', 'all', 'events')
    expect(
      statusResults.updates.some((update) => update.id === 'event-ai-status-outage-watch')
    ).toBe(true)

    const batchResults = searchCatalog('Batch', 'all', 'events')
    expect(
      batchResults.updates.some((update) => update.id === 'event-openai-cost-optimization-watch')
    ).toBe(true)

    const releaseResults = searchCatalog('릴리스 노트', 'all', 'news')
    expect(
      releaseResults.updates.some((update) => update.id === 'update-official-release-note-watch')
    ).toBe(true)

    const statusHubResults = searchCatalog('상태/릴리스', 'all', 'learning')
    expect(
      statusHubResults.resources.some(
        (resource) => resource.id === 'res-ai-service-status-release-hub'
      )
    ).toBe(true)

    const costHubResults = searchCatalog('Flex', 'all', 'learning')
    expect(
      costHubResults.resources.some(
        (resource) => resource.id === 'res-cost-optimization-official-hub'
      )
    ).toBe(true)

    const opsResults = searchCatalog('상태/릴리스/비용', 'all', 'ops')
    expect(
      opsResults.pipelineItems.some((item) => item.id === 'pipe-status-release-cost-watch')
    ).toBe(true)

    const sourceResults = searchCatalog('OpenAI Status', 'all', 'sources')
    expect(sourceResults.sources.some((source) => source.id === 'openai-status')).toBe(true)
  })

  it('finds expanded AI coding tool profiles', () => {
    const jetBrainsResults = searchCatalog('JetBrains', 'all', 'tools')
    expect(jetBrainsResults.aiCodingTools.some((tool) => tool.id === 'tool-jetbrains-junie')).toBe(
      true
    )

    const codeRabbitResults = searchCatalog('PR 리뷰', 'all', 'tools')
    expect(codeRabbitResults.aiCodingTools.some((tool) => tool.id === 'tool-coderabbit')).toBe(true)

    const studentResults = searchCatalog('학생', 'all', 'tools')
    expect(studentResults.aiCodingTools.some((tool) => tool.id === 'tool-github-copilot')).toBe(
      true
    )
  })

  it('finds official agent implementation resources', () => {
    const cookbookResults = searchCatalog('Cookbook', 'all', 'learning')
    expect(
      cookbookResults.resources.some((resource) => resource.id === 'res-official-agent-cookbooks')
    ).toBe(true)

    const langGraphResults = searchCatalog('LangGraph', 'all', 'learning')
    expect(
      langGraphResults.resources.some((resource) => resource.id === 'res-agent-frameworks-official')
    ).toBe(true)

    const mcpResults = searchCatalog('MCP', 'all', 'learning')
    expect(
      mcpResults.resources.some((resource) => resource.id === 'res-mcp-local-open-stack')
    ).toBe(true)

    const ollamaResults = searchCatalog('Ollama', 'all', 'learning')
    expect(
      ollamaResults.resources.some((resource) => resource.id === 'res-mcp-local-open-stack')
    ).toBe(true)

    const langSmithResults = searchCatalog('LangSmith', 'all', 'learning')
    expect(
      langSmithResults.resources.some((resource) => resource.id === 'res-agent-observability-evals')
    ).toBe(true)

    const opsResults = searchCatalog('공식 에이전트 구현', 'all', 'ops')
    expect(opsResults.pipelineItems.some((item) => item.id === 'pipe-official-agent-recipes')).toBe(
      true
    )
  })

  it('finds expanded benchmark and Korean course sources', () => {
    const sweBenchResults = searchCatalog('SWE-bench', 'all', 'benchmarks')
    expect(
      sweBenchResults.benchmarks.some((entry) => entry.id === 'swebench-verified-coverage')
    ).toBe(true)

    const aiderResults = searchCatalog('Aider', 'all', 'benchmarks')
    expect(aiderResults.benchmarks.some((entry) => entry.id === 'aider-gpt5-high-polyglot')).toBe(
      true
    )

    const mobileResults = searchCatalog('모바일', 'all', 'benchmarks')
    expect(
      mobileResults.benchmarks.some((entry) => entry.id === 'swebench-mobile-cursor-opus')
    ).toBe(true)

    const dialogueResults = searchCatalog('대화', 'all', 'benchmarks')
    expect(dialogueResults.benchmarks.some((entry) => entry.id === 'dialogue-swebench-agent')).toBe(
      true
    )

    const sweLancerResults = searchCatalog('SWE-Lancer', 'all', 'benchmarks')
    expect(
      sweLancerResults.benchmarks.some((entry) => entry.id === 'swelancer-economic-coding')
    ).toBe(true)

    const paperBenchResults = searchCatalog('PaperBench', 'all', 'benchmarks')
    expect(
      paperBenchResults.benchmarks.some((entry) => entry.id === 'paperbench-research-replication')
    ).toBe(true)

    const mleBenchResults = searchCatalog('MLE-bench', 'all', 'benchmarks')
    expect(
      mleBenchResults.benchmarks.some((entry) => entry.id === 'mlebench-kaggle-engineering')
    ).toBe(true)

    const browseCompResults = searchCatalog('BrowseComp', 'all', 'benchmarks')
    expect(
      browseCompResults.benchmarks.some((entry) => entry.id === 'browsecomp-web-research')
    ).toBe(true)

    const gpuResults = searchCatalog('GPU', 'all', 'benchmarks')
    expect(gpuResults.benchmarks.some((entry) => entry.id === 'kernelbench-gpu-kernels')).toBe(true)

    const smartContractResults = searchCatalog('스마트컨트랙트', 'all', 'benchmarks')
    expect(
      smartContractResults.benchmarks.some(
        (entry) => entry.id === 'evmbench-smart-contract-security'
      )
    ).toBe(true)

    const cybenchResults = searchCatalog('Cybench', 'all', 'benchmarks')
    expect(cybenchResults.benchmarks.some((entry) => entry.id === 'cybench-ctf-agent')).toBe(true)

    const reBenchResults = searchCatalog('RE-Bench', 'all', 'benchmarks')
    expect(reBenchResults.benchmarks.some((entry) => entry.id === 'rebench-ai-rd')).toBe(true)

    const liveSweResults = searchCatalog('SWE-bench Live', 'all', 'benchmarks')
    expect(
      liveSweResults.benchmarks.some((entry) => entry.id === 'swebench-live-fresh-issues')
    ).toBe(true)

    const sweExploreResults = searchCatalog('SWE-Explore', 'all', 'benchmarks')
    expect(
      sweExploreResults.benchmarks.some((entry) => entry.id === 'swe-explore-repo-localization')
    ).toBe(true)

    const utBoostResults = searchCatalog('UTBoost', 'all', 'benchmarks')
    expect(
      utBoostResults.benchmarks.some((entry) => entry.id === 'utboost-test-quality-audit')
    ).toBe(true)

    const codeEloResults = searchCatalog('CodeElo', 'all', 'benchmarks')
    expect(
      codeEloResults.benchmarks.some((entry) => entry.id === 'codeelo-competitive-programming')
    ).toBe(true)

    const kmmluResults = searchCatalog('KMMLU', 'all', 'benchmarks')
    expect(
      kmmluResults.benchmarks.some((entry) => entry.id === 'kmmlu-korean-exam-understanding')
    ).toBe(true)

    const kmmmuResults = searchCatalog('KMMMU', 'all', 'benchmarks')
    expect(kmmmuResults.benchmarks.some((entry) => entry.id === 'kmmmu-korean-multimodal')).toBe(
      true
    )

    const webAgentResults = searchCatalog('웹 에이전트', 'all', 'learning')
    expect(
      webAgentResults.resources.some(
        (resource) => resource.id === 'res-benchmark-hubs-web-os-agents'
      )
    ).toBe(true)

    const gdpvalResults = searchCatalog('GDPval', 'all', 'benchmarks')
    expect(gdpvalResults.benchmarks.some((entry) => entry.id === 'gdpval-work-deliverables')).toBe(
      true
    )

    const sheetResults = searchCatalog('스프레드시트', 'all', 'benchmarks')
    expect(
      sheetResults.benchmarks.some((entry) => entry.id === 'bluefin-finance-spreadsheets')
    ).toBe(true)

    const officeResults = searchCatalog('Office automation', 'all', 'learning')
    expect(
      officeResults.resources.some((resource) => resource.id === 'res-benchmark-hubs-work-office')
    ).toBe(true)

    const mcpBenchResults = searchCatalog('MCP-Bench', 'all', 'benchmarks')
    expect(mcpBenchResults.benchmarks.some((entry) => entry.id === 'mcp-bench-tool-use')).toBe(true)

    const iosWorldResults = searchCatalog('iOSWorld', 'all', 'benchmarks')
    expect(
      iosWorldResults.benchmarks.some((entry) => entry.id === 'iosworld-personal-phone-agent')
    ).toBe(true)

    const pptcResults = searchCatalog('PPTC Benchmark', 'all', 'benchmarks')
    expect(
      pptcResults.benchmarks.some((entry) => entry.id === 'pptc-powerpoint-task-completion')
    ).toBe(true)

    const presentBenchResults = searchCatalog('PresentBench', 'all', 'benchmarks')
    expect(
      presentBenchResults.benchmarks.some((entry) => entry.id === 'presentbench-slide-generation')
    ).toBe(true)

    const qualityHubResults = searchCatalog('벤치마크 신뢰도', 'all', 'learning')
    expect(
      qualityHubResults.resources.some(
        (resource) => resource.id === 'res-benchmark-freshness-quality-audit'
      )
    ).toBe(true)

    const opsResults = searchCatalog('오염', 'all', 'ops')
    expect(
      opsResults.pipelineItems.some((item) => item.id === 'pipe-benchmark-quality-audit')
    ).toBe(true)

    const courseResults = searchCatalog('노마드코더', 'all', 'learning')
    expect(
      courseResults.resources.some((resource) => resource.id === 'res-korean-course-platforms')
    ).toBe(true)
  })

  it('finds task recommendations by user intent', () => {
    const cursorResults = searchCatalog('버그 수정', 'cursor', 'recommendations')
    expect(
      cursorResults.taskRecommendations.some(
        (recommendation) => recommendation.id === 'task-repo-fix'
      )
    ).toBe(true)

    const costResults = searchCatalog('저비용', 'all', 'recommendations')
    expect(
      costResults.taskRecommendations.some(
        (recommendation) => recommendation.id === 'task-low-cost-bulk'
      )
    ).toBe(true)
  })

  it('resolves source references', () => {
    expect(getSources(['openai-gpt55'])[0]?.publisher).toBe('OpenAI Developers')
  })

  it('exposes summary stats', () => {
    expect(getCatalogStats()).toMatchObject({
      providers: 10,
      updates: 46,
      benchmarkRows: 97,
      vibeCommands: 16,
      aiCodingTools: 14,
      personaGuides: 5,
      taskRecommendations: 8,
      monitors: 53,
      pipelineItems: 14,
      costProfiles: 10,
    })
  })

  it('audits source references and required coverage', () => {
    expect(getMissingSourceReferences()).toEqual([])

    const audit = runContentAudit()
    expect(audit.passed).toBe(true)
    expect(audit.checks.every((check) => check.status !== 'fail')).toBe(true)
  })

  it('searches editorial operations workflow', () => {
    const results = searchCatalog('후보', 'all', 'ops')

    expect(results.curationMonitors.length).toBeGreaterThan(0)
    expect(results.pipelineItems.length).toBeGreaterThan(0)
    expect(results.featureBacklog.some((item) => item.id === 'feature-source-crawler')).toBe(true)

    const koreanLlmOpsResults = searchCatalog('국내 LLM/한국어 벤치마크 감시 큐', 'all', 'ops')
    expect(
      koreanLlmOpsResults.pipelineItems.some(
        (item) => item.id === 'pipe-korean-llm-benchmark-watch'
      )
    ).toBe(true)
  })

  it('searches persona playbooks with provider filters', () => {
    const pmResults = searchCatalog('PM', 'all', 'personas')
    expect(pmResults.personaGuides.some((guide) => guide.id === 'persona-product-manager')).toBe(
      true
    )

    const xaiResults = searchCatalog('', 'xai', 'personas')
    expect(xaiResults.personaGuides.every((guide) => guide.providerIds.includes('xai'))).toBe(true)
  })

  it('calculates monthly model costs sorted by total cost', () => {
    const estimates = calculateModelCosts({
      inputTokensPerRun: 10_000,
      outputTokensPerRun: 2_000,
      runsPerMonth: 1_000,
    })

    expect(estimates).toHaveLength(10)
    expect(estimates[0]?.totalCost).toBeLessThanOrEqual(estimates.at(-1)?.totalCost ?? 0)
    expect(estimates.some((estimate) => estimate.profile.modelName === 'GPT-5.5')).toBe(true)
  })

  it('moves pipeline stages within valid bounds', () => {
    expect(movePipelineStage('수집', 'previous')).toBe('수집')
    expect(movePipelineStage('수집', 'next')).toBe('검토')
    expect(movePipelineStage('게시 준비', 'next')).toBe('게시')
    expect(movePipelineStage('게시', 'next')).toBe('게시')
  })
})
