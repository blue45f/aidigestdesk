export type ProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "manus"
  | "kimi"
  | "deepseek"
  | "qwen"
  | "mistral"
  | "cursor";

export type ContentCategory =
  | "news"
  | "events"
  | "updates"
  | "recommendations"
  | "vibe"
  | "tools"
  | "design"
  | "comparison"
  | "benchmarks"
  | "manuals"
  | "personas"
  | "learning"
  | "books"
  | "ops"
  | "sources";

export type SourceKind = "official" | "benchmark" | "publisher" | "community";

export type SourceRef = {
  id: string;
  title: string;
  publisher: string;
  kind: SourceKind;
  url: string;
  lastChecked: string;
  note: string;
};

export type ModelSpec = {
  label: string;
  value: string;
  tone?: "default" | "good" | "warning";
};

export type ModelProfile = {
  id: string;
  providerId: ProviderId;
  providerName: string;
  productName: string;
  modelName: string;
  modelId: string;
  status: "일반 제공" | "프리뷰" | "제한 제공" | "서비스/API" | "서비스/IDE";
  lastUpdate: string;
  verifiedAt: string;
  oneLine: string;
  summary: string;
  strengths: string[];
  caveats: string[];
  bestFor: string[];
  specs: ModelSpec[];
  aliases: string[];
  sourceIds: string[];
  accent: "green" | "blue" | "amber" | "coral" | "ink";
};

export type UpdateItem = {
  id: string;
  providerId: ProviderId | "market";
  category: ContentCategory;
  title: string;
  date: string;
  summary: string;
  impact: string;
  tags: string[];
  sourceIds: string[];
};

export type BenchmarkEntry = {
  id: string;
  rankLabel: string;
  modelName: string;
  providerId: ProviderId | "other";
  domain: BenchmarkDomain;
  metric: string;
  score: string;
  price: string;
  speed: string;
  latency: string;
  context: string;
  sourceIds: string[];
};

export type BenchmarkDomain =
  | "overall"
  | "coding"
  | "ppt"
  | "research"
  | "multimodal"
  | "cost"
  | "agent";

export type VibeCodingCommand = {
  id: string;
  providerId: ProviderId;
  modelId: string;
  modelName: string;
  surface:
    | "전용 CLI"
    | "IDE/에이전트"
    | "OpenAI 호환 API"
    | "공식 SDK"
    | "서드파티 CLI"
    | "웹/에이전트";
  installCommand: string;
  command: string;
  useCase: string;
  vibeCodingFit: "매우 높음" | "높음" | "보통" | "제한적";
  setupNotes: string[];
  caveats: string[];
  sourceIds: string[];
};

export type AiCodingToolCategory =
  | "AI IDE"
  | "IDE 확장"
  | "CLI/터미널"
  | "PR 리뷰"
  | "웹앱 제작"
  | "클라우드 에이전트"
  | "오픈소스 스택";

export type AiCodingToolProfile = {
  id: string;
  toolName: string;
  vendor: string;
  category: AiCodingToolCategory;
  providerIds?: ProviderId[];
  pricing: string;
  eventSignal: string;
  bestFor: string[];
  integrations: string[];
  koreanResources: string[];
  caveats: string[];
  sourceIds: string[];
  tags: string[];
};

export type ComparisonRow = {
  id: string;
  axis: string;
  cells: Record<ProviderId, string>;
};

export type ManualGuide = {
  id: string;
  title: string;
  providerId: ProviderId;
  level: "입문" | "실무" | "고급";
  summary: string;
  steps: string[];
  sourceIds: string[];
};

export type PersonaGuide = {
  id: string;
  role: string;
  title: string;
  summary: string;
  providerIds: ProviderId[];
  recommendedModelIds: string[];
  alternateModelIds: string[];
  workflow: string[];
  promptExamples: string[];
  checklist: string[];
  sourceIds: string[];
};

export type LearningResource = {
  id: string;
  type: "공식 문서" | "강좌/영상" | "블로그/글" | "도서" | "커뮤니티";
  title: string;
  author: string;
  language: "한국어" | "영어";
  level: "입문" | "실무" | "고급";
  summary: string;
  url: string;
  sourceIds: string[];
  providerIds?: ProviderId[];
  tags: string[];
};

export type CurationStatus = "정상" | "확인 필요" | "자동화 후보";

export type CurationMonitor = {
  id: string;
  sourceId: string;
  providerId: ProviderId | "market";
  cadence: "매일" | "주 2회" | "주 1회" | "월 1회";
  priority: "P0" | "P1" | "P2";
  status: CurationStatus;
  owner: "모델 스펙" | "벤치마크" | "학습 리소스" | "에이전트";
  nextCheck: string;
  nextAction: string;
  automationHint: string;
};

export type PipelineStage =
  | "수집"
  | "검토"
  | "한국어 요약"
  | "게시 준비"
  | "게시";

export type UpdatePipelineItem = {
  id: string;
  title: string;
  providerId: ProviderId | "market";
  stage: PipelineStage;
  priority: "높음" | "보통" | "낮음";
  sourceIds: string[];
  summary: string;
  acceptance: string[];
};

export type FeatureBacklogItem = {
  id: string;
  title: string;
  priority: "P0" | "P1" | "P2";
  status: "다음" | "진행 후보" | "나중" | "구현됨";
  rationale: string;
  acceptance: string[];
};

export type ContentAuditCheck = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

export type ContentAuditResult = {
  passed: boolean;
  checks: ContentAuditCheck[];
};

export type ModelCostProfile = {
  id: string;
  providerId: ProviderId;
  modelName: string;
  inputUsdPer1M: number;
  outputUsdPer1M: number;
  pricingBasis: "공식 문서" | "벤치마크 환산";
  notes: string;
  sourceIds: string[];
};

export type CostScenario = {
  inputTokensPerRun: number;
  outputTokensPerRun: number;
  runsPerMonth: number;
};

export type ModelCostEstimate = {
  profile: ModelCostProfile;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  totalTokens: number;
  formattedTotal: string;
};

export type TaskRecommendationCategory =
  | "coding"
  | "ppt"
  | "research"
  | "automation"
  | "cost"
  | "learning"
  | "security";

export type TaskRecommendation = {
  id: string;
  category: TaskRecommendationCategory;
  title: string;
  userIntent: string;
  primaryModelIds: string[];
  alternateModelIds: string[];
  commandIds: string[];
  benchmarkDomains: BenchmarkDomain[];
  resourceIds: string[];
  rationale: string[];
  tradeoffs: string[];
  promptStarter: string;
  sourceIds: string[];
};

export type SearchResults = {
  models: ModelProfile[];
  updates: UpdateItem[];
  taskRecommendations: TaskRecommendation[];
  aiCodingTools: AiCodingToolProfile[];
  benchmarks: BenchmarkEntry[];
  manuals: ManualGuide[];
  personaGuides: PersonaGuide[];
  resources: LearningResource[];
  vibeCodingCommands: VibeCodingCommand[];
  curationMonitors: CurationMonitor[];
  pipelineItems: UpdatePipelineItem[];
  featureBacklog: FeatureBacklogItem[];
  sources: SourceRef[];
};

export const SNAPSHOT_DATE = "2026-06-18";

export const providerCatalog: Array<{
  id: ProviderId;
  label: string;
  shortLabel: string;
  productLabel: string;
}> = [
  {
    id: "openai",
    label: "OpenAI",
    shortLabel: "GPT",
    productLabel: "GPT / ChatGPT",
  },
  {
    id: "anthropic",
    label: "Anthropic",
    shortLabel: "Claude",
    productLabel: "Claude",
  },
  {
    id: "google",
    label: "Google",
    shortLabel: "Gemini",
    productLabel: "Gemini",
  },
  {
    id: "xai",
    label: "xAI",
    shortLabel: "Grok",
    productLabel: "Grok",
  },
  {
    id: "manus",
    label: "Manus",
    shortLabel: "Manus",
    productLabel: "Manus",
  },
  {
    id: "kimi",
    label: "Moonshot AI",
    shortLabel: "Kimi",
    productLabel: "Kimi",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    shortLabel: "DeepSeek",
    productLabel: "DeepSeek",
  },
  {
    id: "qwen",
    label: "Alibaba Qwen",
    shortLabel: "Qwen",
    productLabel: "Qwen",
  },
  {
    id: "mistral",
    label: "Mistral AI",
    shortLabel: "Mistral",
    productLabel: "Mistral / Ministral",
  },
  {
    id: "cursor",
    label: "Cursor",
    shortLabel: "Cursor",
    productLabel: "Cursor AI IDE",
  },
];

export const comparisonProviderOrder = providerCatalog.map(
  (provider) => provider.id,
);

export const sources: SourceRef[] = [
  {
    id: "openai-gpt55",
    title: "GPT-5.5 Model",
    publisher: "OpenAI Developers",
    kind: "official",
    url: "https://developers.openai.com/api/docs/models/gpt-5.5",
    lastChecked: SNAPSHOT_DATE,
    note: "GPT-5.5의 모델 ID, 컨텍스트, 출력 한도, 가격, 도구 지원을 확인한 공식 모델 페이지.",
  },
  {
    id: "openai-models",
    title: "OpenAI Models",
    publisher: "OpenAI Developers",
    kind: "official",
    url: "https://developers.openai.com/api/docs/models",
    lastChecked: SNAPSHOT_DATE,
    note: "OpenAI 최신 모델 선택 가이드와 GPT-5.4 mini/nano 비교 출처.",
  },
  {
    id: "anthropic-fable5",
    title: "Introducing Claude Fable 5 and Claude Mythos 5",
    publisher: "Anthropic",
    kind: "official",
    url: "https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude Fable 5/Mythos 5의 공개 범위, 컨텍스트, 가격, 거절·fallback 처리 출처.",
  },
  {
    id: "anthropic-models",
    title: "Claude Models Overview",
    publisher: "Anthropic",
    kind: "official",
    url: "https://platform.claude.com/docs/en/about-claude/models/overview",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude Opus 4.8, Sonnet 4.6, Haiku 4.5 비교와 플랫폼 제공 범위 출처.",
  },
  {
    id: "google-gemini31",
    title: "Gemini 3.1 Pro Preview",
    publisher: "Google AI for Developers",
    kind: "official",
    url: "https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview",
    lastChecked: SNAPSHOT_DATE,
    note: "Gemini 3.1 Pro Preview의 입력 모달리티, 토큰 한도, 도구 지원과 업데이트 날짜 출처.",
  },
  {
    id: "google-models",
    title: "Gemini API Models",
    publisher: "Google AI for Developers",
    kind: "official",
    url: "https://ai.google.dev/gemini-api/docs/models",
    lastChecked: SNAPSHOT_DATE,
    note: "Gemini 3 계열, Gemini 3.5 Flash, Live Translate, Nano Banana 계열 모델 목록 출처.",
  },
  {
    id: "xai-grok43",
    title: "Grok 4.3",
    publisher: "xAI Docs",
    kind: "official",
    url: "https://docs.x.ai/developers/models/grok-4.3",
    lastChecked: SNAPSHOT_DATE,
    note: "Grok 4.3의 모델명, 별칭, 컨텍스트, 가격, 구조화 출력·함수 호출 지원 출처.",
  },
  {
    id: "xai-models",
    title: "xAI Models",
    publisher: "xAI Docs",
    kind: "official",
    url: "https://docs.x.ai/developers/models",
    lastChecked: SNAPSHOT_DATE,
    note: "Grok 4.3, Grok Build, Voice API, Imagine API와 모델 별칭 정책 출처.",
  },
  {
    id: "manus-home",
    title: "Manus: Hands On AI",
    publisher: "Manus",
    kind: "official",
    url: "https://manus.im/",
    lastChecked: SNAPSHOT_DATE,
    note: "Manus의 제품 포지션, 기능 링크, Meta 편입 안내, 웹/데스크톱/모바일 앱 링크 출처.",
  },
  {
    id: "manus-api",
    title: "Manus API v2 Introduction",
    publisher: "Manus API",
    kind: "official",
    url: "https://open.manus.ai/docs/v2/introduction",
    lastChecked: SNAPSHOT_DATE,
    note: "Manus API v2의 태스크, 프로젝트, 파일, 웹훅, 스킬, 에이전트 기능과 base URL 출처.",
  },
  {
    id: "openai-codex-cli",
    title: "Codex CLI Docs",
    publisher: "OpenAI Developers",
    kind: "official",
    url: "https://developers.openai.com/codex/cli",
    lastChecked: SNAPSHOT_DATE,
    note: "Codex CLI, IDE, 앱, 워크플로와 명령행 옵션을 확인하는 OpenAI 공식 문서.",
  },
  {
    id: "claude-code-docs",
    title: "Claude Code Overview",
    publisher: "Anthropic",
    kind: "official",
    url: "https://code.claude.com/docs/en/overview",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude Code 설치, CLI 명령, VS Code/JetBrains/웹/데스크톱 사용면과 자동화 예시 출처.",
  },
  {
    id: "claude-code-setup",
    title: "Claude Code Advanced Setup",
    publisher: "Anthropic",
    kind: "official",
    url: "https://code.claude.com/docs/en/setup",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude Code의 macOS/Linux/Windows 설치 명령, Homebrew/WinGet 설치, claude 실행과 버전 확인 절차 출처.",
  },
  {
    id: "gemini-cli-github",
    title: "Gemini CLI",
    publisher: "Google Gemini",
    kind: "official",
    url: "https://github.com/google-gemini/gemini-cli",
    lastChecked: SNAPSHOT_DATE,
    note: "Gemini CLI 설치 명령, npx 실행, npm/Homebrew 설치, 코드 이해·생성 기능 출처.",
  },
  {
    id: "kimi-models",
    title: "Kimi API Model List",
    publisher: "Moonshot AI",
    kind: "official",
    url: "https://platform.kimi.ai/docs/models",
    lastChecked: SNAPSHOT_DATE,
    note: "Kimi K2.7 Code, K2.7 Code HighSpeed, K2.6/K2.5의 모델명, 컨텍스트, 지원 중단 모델을 확인한 공식 모델 목록.",
  },
  {
    id: "kimi-k27-code",
    title: "Kimi K2.7 Code Quickstart",
    publisher: "Moonshot AI",
    kind: "official",
    url: "https://platform.kimi.ai/docs/guide/kimi-k2-7-code-quickstart",
    lastChecked: SNAPSHOT_DATE,
    note: "Kimi K2.7 Code의 코딩/에이전트 성격, 256K 컨텍스트, OpenAI SDK 호환, 멀티모달 도구 사용 제약 출처.",
  },
  {
    id: "deepseek-pricing",
    title: "DeepSeek Models & Pricing",
    publisher: "DeepSeek API Docs",
    kind: "official",
    url: "https://api-docs.deepseek.com/quick_start/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "DeepSeek V4 Flash/Pro의 1M 컨텍스트, 384K 최대 출력, OpenAI/Anthropic 호환 URL, 공식 토큰 가격 출처.",
  },
  {
    id: "deepseek-updates",
    title: "DeepSeek API Change Log",
    publisher: "DeepSeek API Docs",
    kind: "official",
    url: "https://api-docs.deepseek.com/updates",
    lastChecked: SNAPSHOT_DATE,
    note: "DeepSeek V4 공개와 deepseek-chat/deepseek-reasoner 레거시 이름 지원 중단 일정을 확인한 공식 변경 로그.",
  },
  {
    id: "qwen-docs",
    title: "Qwen Documentation",
    publisher: "Alibaba Qwen Team",
    kind: "official",
    url: "https://qwen.readthedocs.io/en/latest/",
    lastChecked: SNAPSHOT_DATE,
    note: "Qwen3-2507, Qwen3, 장문 컨텍스트, 오픈웨이트 배포 프레임워크, 리소스 링크 출처.",
  },
  {
    id: "qwen-quickstart",
    title: "Qwen Quickstart",
    publisher: "Alibaba Qwen Team",
    kind: "official",
    url: "https://qwen.readthedocs.io/en/latest/getting_started/quickstart.html",
    lastChecked: SNAPSHOT_DATE,
    note: "Qwen3 Transformers 실행, vLLM/SGLang OpenAI 호환 서버 실행, curl/OpenAI SDK 호출 예시 출처.",
  },
  {
    id: "mistral-models",
    title: "Mistral Models Overview",
    publisher: "Mistral AI",
    kind: "official",
    url: "https://docs.mistral.ai/models/overview",
    lastChecked: SNAPSHOT_DATE,
    note: "Mistral Medium 3.5, Mistral Small 4, Ministral 3 계열과 모델 지원 중단 대체 모델을 확인한 공식 목록.",
  },
  {
    id: "mistral-medium-35",
    title: "Mistral Medium 3.5 Model Card",
    publisher: "Mistral AI",
    kind: "official",
    url: "https://docs.mistral.ai/models/model-cards/mistral-medium-3-5-26-04",
    lastChecked: SNAPSHOT_DATE,
    note: "Mistral Medium 3.5의 공개일, 256K 컨텍스트, 오픈웨이트 라이선스, 공식 입력/출력 가격 출처.",
  },
  {
    id: "mistral-small-4",
    title: "Mistral Small 4 Model Card",
    publisher: "Mistral AI",
    kind: "official",
    url: "https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03",
    lastChecked: SNAPSHOT_DATE,
    note: "Mistral Small 4의 하이브리드 instruct/reasoning/coding 성격, 256K 컨텍스트, 119B/6.5B active 구조, 가격 출처.",
  },
  {
    id: "mistral-ministral-3-14b",
    title: "Ministral 3 14B Model Card",
    publisher: "Mistral AI",
    kind: "official",
    url: "https://docs.mistral.ai/models/model-cards/ministral-3-14b-25-12",
    lastChecked: SNAPSHOT_DATE,
    note: "Ministral 3 14B의 로컬 배포 포지션, 256K 컨텍스트, 공식 입력/출력 가격 출처.",
  },
  {
    id: "mistral-api",
    title: "Mistral Chat Completion API",
    publisher: "Mistral AI",
    kind: "official",
    url: "https://docs.mistral.ai/api",
    lastChecked: SNAPSHOT_DATE,
    note: "Mistral Chat Completions API, TypeScript/Python SDK와 curl 호출 예시, model/messages/tools 파라미터 출처.",
  },
  {
    id: "anthropic-pricing",
    title: "Anthropic Pricing",
    publisher: "Anthropic",
    kind: "official",
    url: "https://www.anthropic.com/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude API/플랜 가격과 프로모션성 가격 변경 여부를 확인하는 공식 가격 페이지.",
  },
  {
    id: "anthropic-news",
    title: "Anthropic News",
    publisher: "Anthropic",
    kind: "official",
    url: "https://www.anthropic.com/news",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude 제품, 플랜, 정책, 이벤트성 공지 후보를 확인하는 공식 뉴스 페이지.",
  },
  {
    id: "google-gemini-pricing",
    title: "Gemini API Pricing",
    publisher: "Google AI for Developers",
    kind: "official",
    url: "https://ai.google.dev/gemini-api/docs/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "Gemini API 가격, free tier, batch/캐시 등 비용 이벤트성 변경을 확인하는 공식 가격 문서.",
  },
  {
    id: "google-ai-blog",
    title: "Google AI Blog",
    publisher: "Google",
    kind: "official",
    url: "https://blog.google/technology/ai/",
    lastChecked: SNAPSHOT_DATE,
    note: "Gemini, AI Pro, 학생/교육/제품 이벤트 소식을 확인하는 Google AI 공식 블로그.",
  },
  {
    id: "manus-pricing",
    title: "Manus Pricing",
    publisher: "Manus",
    kind: "official",
    url: "https://manus.im/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "Manus 플랜, 크레딧, 초대/추천 이벤트 후보를 확인하는 가격 페이지.",
  },
  {
    id: "kimi-pricing",
    title: "Kimi API Pricing",
    publisher: "Moonshot AI",
    kind: "official",
    url: "https://platform.kimi.ai/docs/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "Kimi API 가격, 무료/할인/크레딧성 이벤트 변경 여부를 확인하는 공식 가격 문서.",
  },
  {
    id: "qwen-billing",
    title: "Alibaba Model Studio Billing",
    publisher: "Alibaba Cloud",
    kind: "official",
    url: "https://help.aliyun.com/zh/model-studio/billing",
    lastChecked: SNAPSHOT_DATE,
    note: "Qwen/Model Studio 과금, 무료 quota, 할인 이벤트 후보를 확인하는 Alibaba Cloud 문서.",
  },
  {
    id: "mistral-news",
    title: "Mistral AI News",
    publisher: "Mistral AI",
    kind: "official",
    url: "https://mistral.ai/news",
    lastChecked: SNAPSHOT_DATE,
    note: "Mistral 모델, 제품, La Plateforme, 이벤트성 공지를 확인하는 공식 뉴스 페이지.",
  },
  {
    id: "mistral-pricing",
    title: "Mistral Pricing",
    publisher: "Mistral AI",
    kind: "official",
    url: "https://docs.mistral.ai/getting-started/pricing/",
    lastChecked: SNAPSHOT_DATE,
    note: "Mistral API 가격, 무료/할인/플랜 변경 여부를 확인하는 공식 가격 문서.",
  },
  {
    id: "openai-academy-events",
    title: "OpenAI Academy Events",
    publisher: "OpenAI Academy",
    kind: "official",
    url: "https://academy.openai.com/public/events",
    lastChecked: SNAPSHOT_DATE,
    note: "OpenAI와 커뮤니티 파트너가 진행하는 온라인/라이브 학습 이벤트, Builder Bootcamp, Codex/Agents 세션을 확인하는 공식 이벤트 허브.",
  },
  {
    id: "anthropic-claude-corps",
    title: "Introducing Claude Corps",
    publisher: "Anthropic",
    kind: "official",
    url: "https://www.anthropic.com/news/claude-corps",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude Corps 2026 펠로십, 비영리 호스트 조직, Claude 교육/토큰 예산, 신청 일정 정보를 확인한 공식 발표.",
  },
  {
    id: "google-gemini-students",
    title: "Gemini for Students",
    publisher: "Google Gemini",
    kind: "official",
    url: "https://gemini.google/students/",
    lastChecked: SNAPSHOT_DATE,
    note: "대학생 대상 Gemini 학습 파트너와 국가/언어별 학생 혜택 페이지를 확인하는 공식 Gemini 학생 허브.",
  },
  {
    id: "google-gemini-docs-ko",
    title: "Gemini API Korean Docs",
    publisher: "Google AI for Developers",
    kind: "official",
    url: "https://ai.google.dev/gemini-api/docs?hl=ko",
    lastChecked: SNAPSHOT_DATE,
    note: "Gemini API의 한국어 공식 문서, 빠른 시작, 모델, 도구, 긴 컨텍스트, 함수 호출, 프롬프트 엔지니어링 학습 경로 출처.",
  },
  {
    id: "google-cloud-vertex-ko",
    title: "Google Cloud Gemini Enterprise Agent Platform Korean Docs",
    publisher: "Google Cloud",
    kind: "official",
    url: "https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models?hl=ko",
    lastChecked: SNAPSHOT_DATE,
    note: "Google Cloud의 한국어 Gemini/Claude/Grok/Mistral/DeepSeek 파트너 모델 문서와 엔터프라이즈 에이전트 플랫폼 출처.",
  },
  {
    id: "anthropic-docs-ko",
    title: "Claude API Korean Docs",
    publisher: "Anthropic",
    kind: "official",
    url: "https://platform.claude.com/docs/ko/intro",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude 소개, 빠른 시작, Messages API, 도구 사용, MCP, 모델 선택 가이드를 한국어로 확인한 공식 문서.",
  },
  {
    id: "azure-openai-ko",
    title: "Azure OpenAI Service Korean Docs",
    publisher: "Microsoft Learn",
    kind: "official",
    url: "https://learn.microsoft.com/ko-kr/azure/ai-services/openai/overview",
    lastChecked: SNAPSHOT_DATE,
    note: "Azure OpenAI 개요, 모델 배포, API/SDK 시작, 책임 있는 AI와 엔터프라이즈 보안 설명의 한국어 공식 문서.",
  },
  {
    id: "aws-bedrock-ko",
    title: "Amazon Bedrock Korean User Guide",
    publisher: "AWS Docs",
    kind: "official",
    url: "https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/what-is-bedrock.html",
    lastChecked: SNAPSHOT_DATE,
    note: "Amazon Bedrock의 한국어 개요와 Anthropic, DeepSeek, Moonshot AI(Kimi), OpenAI 등 지원 모델 제공사 확인 출처.",
  },
  {
    id: "aa-leaderboard",
    title: "LLM Leaderboard",
    publisher: "Artificial Analysis",
    kind: "benchmark",
    url: "https://artificialanalysis.ai/leaderboards/models",
    lastChecked: SNAPSHOT_DATE,
    note: "상용·오픈 모델의 Intelligence Index, 가격, 속도, latency, context 비교 출처.",
  },
  {
    id: "lmarena-leaderboard",
    title: "Arena Leaderboard",
    publisher: "LMArena",
    kind: "benchmark",
    url: "https://arena.ai/leaderboard",
    lastChecked: SNAPSHOT_DATE,
    note: "사용자 선호 기반 Elo/arena 방식으로 frontier model 응답 품질을 비교하는 리더보드.",
  },
  {
    id: "scale-leaderboard",
    title: "Scale Labs Leaderboard",
    publisher: "Scale Labs",
    kind: "benchmark",
    url: "https://labs.scale.com/leaderboard",
    lastChecked: SNAPSHOT_DATE,
    note: "Scale Labs의 AI 모델 리더보드와 실무형 평가 신호를 확인하는 벤치마크 허브.",
  },
  {
    id: "helm-leaderboard",
    title: "HELM",
    publisher: "Stanford CRFM",
    kind: "benchmark",
    url: "https://crfm.stanford.edu/helm/latest/",
    lastChecked: SNAPSHOT_DATE,
    note: "Stanford CRFM의 Holistic Evaluation of Language Models. 정확도, calibration, robustness, fairness, bias, toxicity, efficiency 등 다축 평가 출처.",
  },
  {
    id: "swebench-leaderboard",
    title: "SWE-bench Leaderboards",
    publisher: "SWE-bench",
    kind: "benchmark",
    url: "https://www.swebench.com/",
    lastChecked: SNAPSHOT_DATE,
    note: "SWE-bench Full/Verified/Lite/Multilingual/Multimodal 리더보드, resolved %, cost/step 비교, 실제 GitHub issue 해결 능력 평가 출처.",
  },
  {
    id: "dialogue-swebench-paper",
    title: "Dialogue-SWEBench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2606.13995",
    lastChecked: SNAPSHOT_DATE,
    note: "대화로 요구사항을 보완하며 repository-level SWE task를 해결하는 코딩 에이전트 평가 논문.",
  },
  {
    id: "swe-contextbench-paper",
    title: "SWE Context Bench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2602.08316",
    lastChecked: SNAPSHOT_DATE,
    note: "관련 issue/task 경험을 재사용하는 coding agent의 정확도, 시간 효율, 비용 효율을 평가하는 벤치마크.",
  },
  {
    id: "swebench-mobile-leaderboard",
    title: "SWE-Bench Mobile",
    publisher: "SWE-Bench Mobile",
    kind: "benchmark",
    url: "https://swebenchmobile.com/",
    lastChecked: SNAPSHOT_DATE,
    note: "산업 수준 iOS codebase, PRD, 테스트 케이스 기반 모바일 개발 에이전트 리더보드.",
  },
  {
    id: "swebench-mobile-paper",
    title: "SWE-Bench Mobile Paper",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2602.09540",
    lastChecked: SNAPSHOT_DATE,
    note: "Cursor, Codex, Claude Code, OpenCode 조합을 industry-level mobile task에서 비교한 논문.",
  },
  {
    id: "swe-mera-paper",
    title: "SWE-MERA",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2507.11059",
    lastChecked: SNAPSHOT_DATE,
    note: "SWE-bench류 오염과 테스트 품질 한계를 줄이기 위한 동적 소프트웨어 엔지니어링 에이전트 평가 논문.",
  },
  {
    id: "swebench-pro-paper",
    title: "SWE-Bench Pro",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2509.16941",
    lastChecked: SNAPSHOT_DATE,
    note: "1,865개 장기·기업형 소프트웨어 엔지니어링 과제로 AI coding agent의 전문 수준 장기 작업 능력을 평가하는 논문.",
  },
  {
    id: "claw-swebench-paper",
    title: "Claw-SWE-Bench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2606.12344",
    lastChecked: SNAPSHOT_DATE,
    note: "OpenClaw-style agent harness를 공정하게 비교하기 위한 350개 multilingual SWE issue-resolution 벤치마크와 adapter protocol.",
  },
  {
    id: "swelancer-paper",
    title: "SWE-Lancer",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2502.12115",
    lastChecked: SNAPSHOT_DATE,
    note: "Upwork 기반 1,400개 이상 freelance software engineering task와 100만 달러 규모 payout 가치로 모델 성능을 평가하는 벤치마크.",
  },
  {
    id: "openai-frontier-evals",
    title: "OpenAI Frontier Evals",
    publisher: "OpenAI GitHub",
    kind: "benchmark",
    url: "https://github.com/openai/frontier-evals",
    lastChecked: SNAPSHOT_DATE,
    note: "PaperBench, SWE-Lancer, EVMbench 등 OpenAI frontier capability eval 실행 코드와 재현 절차.",
  },
  {
    id: "paperbench-paper",
    title: "PaperBench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2504.01848",
    lastChecked: SNAPSHOT_DATE,
    note: "ICML 2024 Spotlight/Oral 논문 20편을 처음부터 재현하는 AI research replication agent 평가 논문.",
  },
  {
    id: "mlebench-paper",
    title: "MLE-bench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2410.07095",
    lastChecked: SNAPSHOT_DATE,
    note: "Kaggle 기반 75개 machine learning engineering competition으로 모델 학습, 데이터 준비, 실험 실행 능력을 평가하는 논문.",
  },
  {
    id: "mlebench-github",
    title: "MLE-bench GitHub",
    publisher: "OpenAI GitHub",
    kind: "benchmark",
    url: "https://github.com/openai/mle-bench",
    lastChecked: SNAPSHOT_DATE,
    note: "MLE-bench 코드, task 구성, agent 실행 도구를 확인하는 공식 GitHub 저장소.",
  },
  {
    id: "browsecomp-paper",
    title: "BrowseComp",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2504.12516",
    lastChecked: SNAPSHOT_DATE,
    note: "웹을 끈질기게 탐색해야 풀 수 있는 1,266개 hard-to-find factual question으로 browsing agent를 평가하는 논문.",
  },
  {
    id: "browsecomp-v3-paper",
    title: "BrowseComp-V3",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2602.12876",
    lastChecked: SNAPSHOT_DATE,
    note: "텍스트와 시각 정보를 함께 찾아야 하는 300개 visual, vertical, verifiable multimodal browsing agent 평가 논문.",
  },
  {
    id: "openai-simple-evals",
    title: "OpenAI Simple Evals",
    publisher: "OpenAI GitHub",
    kind: "benchmark",
    url: "https://github.com/openai/simple-evals",
    lastChecked: SNAPSHOT_DATE,
    note: "BrowseComp, SimpleQA, HealthBench, HumanEval 등 lightweight eval reference implementation을 담은 OpenAI 저장소.",
  },
  {
    id: "kernelbench-paper",
    title: "KernelBench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2502.10517",
    lastChecked: SNAPSHOT_DATE,
    note: "250개 PyTorch ML workload에서 빠르고 정확한 GPU kernel을 작성하는 능력을 평가하는 benchmark.",
  },
  {
    id: "hcast-paper",
    title: "HCAST",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2503.17354",
    lastChecked: SNAPSHOT_DATE,
    note: "ML engineering, cybersecurity, software engineering, reasoning task 189개를 사람 소요 시간 baseline과 함께 평가하는 autonomy benchmark.",
  },
  {
    id: "evmbench-paper",
    title: "EVMbench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2603.04915",
    lastChecked: SNAPSHOT_DATE,
    note: "117개 curated vulnerability로 smart contract 취약점 탐지, 패치, exploit 수행 능력을 평가하는 AI agent security benchmark.",
  },
  {
    id: "reevmbench-paper",
    title: "Re-Evaluating EVMBench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2603.10795",
    lastChecked: SNAPSHOT_DATE,
    note: "EVMbench의 모델·scaffold·오염 한계를 재검토하고 22개 real-world security incident dataset을 추가한 후속 평가.",
  },
  {
    id: "cybench-paper",
    title: "Cybench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2408.08926",
    lastChecked: SNAPSHOT_DATE,
    note: "40개 professional-level CTF task와 subtask로 language model cybersecurity agent 능력과 위험을 평가하는 논문.",
  },
  {
    id: "cybench-site",
    title: "Cybench Project",
    publisher: "Cybench",
    kind: "benchmark",
    url: "https://cybench.github.io/",
    lastChecked: SNAPSHOT_DATE,
    note: "Cybench task, code, data, evaluation framework를 제공하는 프로젝트 사이트.",
  },
  {
    id: "rebench-paper",
    title: "RE-Bench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2411.15114",
    lastChecked: SNAPSHOT_DATE,
    note: "7개 ML research engineering 환경과 71개 human expert attempt로 frontier AI R&D 자동화 능력을 비교하는 METR 계열 평가 논문.",
  },
  {
    id: "swegym-paper",
    title: "SWE-Gym",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2412.21139",
    lastChecked: SNAPSHOT_DATE,
    note: "2,438개 real-world Python task instance로 software engineering agent와 verifier를 훈련·평가하는 환경 논문.",
  },
  {
    id: "gaia-paper",
    title: "GAIA",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2311.12983",
    lastChecked: SNAPSHOT_DATE,
    note: "추론, 멀티모달, 웹 브라우징, tool-use를 함께 요구하는 general AI assistant 평가 논문.",
  },
  {
    id: "gaia-leaderboard",
    title: "GAIA Benchmark",
    publisher: "Hugging Face",
    kind: "benchmark",
    url: "https://huggingface.co/gaia-benchmark",
    lastChecked: SNAPSHOT_DATE,
    note: "GAIA 공개 문제와 leaderboard 진입점을 확인하는 Hugging Face benchmark hub.",
  },
  {
    id: "mind2web-paper",
    title: "Mind2Web",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2306.06070",
    lastChecked: SNAPSHOT_DATE,
    note: "137개 실제 웹사이트, 31개 도메인, 2천 개 이상 open-ended web task로 generalist web agent를 평가하는 논문.",
  },
  {
    id: "mind2web-site",
    title: "Mind2Web Project",
    publisher: "OSU NLP Group",
    kind: "benchmark",
    url: "https://osu-nlp-group.github.io/Mind2Web/",
    lastChecked: SNAPSHOT_DATE,
    note: "Mind2Web dataset, code, model implementation, trained model 링크를 제공하는 프로젝트 사이트.",
  },
  {
    id: "windows-agent-arena-paper",
    title: "Windows Agent Arena",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2409.08264",
    lastChecked: SNAPSHOT_DATE,
    note: "150개 이상 Windows OS task에서 multimodal OS agent의 planning, screen understanding, tool usage를 평가하는 논문.",
  },
  {
    id: "windows-agent-arena-site",
    title: "Windows Agent Arena Project",
    publisher: "Microsoft",
    kind: "benchmark",
    url: "https://microsoft.github.io/WindowsAgentArena/",
    lastChecked: SNAPSHOT_DATE,
    note: "Windows Agent Arena task, code, Azure 기반 scalable evaluation 정보를 제공하는 프로젝트 사이트.",
  },
  {
    id: "scienceagentbench-paper",
    title: "ScienceAgentBench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2410.05080",
    lastChecked: SNAPSHOT_DATE,
    note: "44개 peer-reviewed publication에서 추출한 102개 data-driven scientific discovery task로 language agent를 평가하는 논문.",
  },
  {
    id: "scivisagentbench-paper",
    title: "SciVisAgentBench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2603.29139",
    lastChecked: SNAPSHOT_DATE,
    note: "108개 expert-crafted case로 scientific data analysis와 visualization agent를 outcome 중심으로 평가하는 2026년 논문.",
  },
  {
    id: "scivisagentbench-site",
    title: "SciVisAgentBench Project",
    publisher: "SciVisAgentBench",
    kind: "benchmark",
    url: "https://scivisagentbench.github.io/",
    lastChecked: SNAPSHOT_DATE,
    note: "SciVisAgentBench benchmark, evaluator, baseline 정보를 제공하는 프로젝트 사이트.",
  },
  {
    id: "securewebarena-paper",
    title: "SecureWebArena",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2510.10073",
    lastChecked: SNAPSHOT_DATE,
    note: "6개 simulated web environment와 2,970개 trajectory로 LVLM web agent 보안 취약성을 평가하는 논문.",
  },
  {
    id: "gdpval-openai",
    title: "Measuring the performance of our models on real-world tasks",
    publisher: "OpenAI",
    kind: "benchmark",
    url: "https://openai.com/index/gdpval/",
    lastChecked: SNAPSHOT_DATE,
    note: "GDPval 소개. 44개 직업, 9개 산업, 문서·슬라이드·다이어그램·스프레드시트·멀티미디어 산출물을 포함한 경제적 업무 평가 출처.",
  },
  {
    id: "gdpval-paper",
    title: "GDPval",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2510.04374",
    lastChecked: SNAPSHOT_DATE,
    note: "경제적으로 가치 있는 실제 지식 업무 산출물 1,320개와 공개 gold subset 220개를 기반으로 한 업무 성능 평가 논문.",
  },
  {
    id: "spreadsheetbench-paper",
    title: "SpreadsheetBench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2406.14991",
    lastChecked: SNAPSHOT_DATE,
    note: "실제 Excel forum 질문 912개와 2,729개 test case로 스프레드시트 조작·수식·정리·레이아웃 편집을 평가하는 벤치마크.",
  },
  {
    id: "bluefin-paper",
    title: "BlueFin",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2605.30907",
    lastChecked: SNAPSHOT_DATE,
    note: "전문 finance spreadsheet workbook에서 합성, 조작, 이해 task 131개와 3,225개 rubric criterion으로 LLM agent를 평가하는 벤치마크.",
  },
  {
    id: "officebench-paper",
    title: "OfficeBench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2407.19056",
    lastChecked: SNAPSHOT_DATE,
    note: "여러 office application을 오가며 long-horizon planning과 action grounding을 수행하는 language agent 업무 자동화 벤치마크.",
  },
  {
    id: "tau2-bench-paper",
    title: "τ²-Bench",
    publisher: "arXiv",
    kind: "benchmark",
    url: "https://arxiv.org/abs/2506.07982",
    lastChecked: SNAPSHOT_DATE,
    note: "상담/지원 업무처럼 사용자와 에이전트가 함께 tool을 쓰는 dual-control conversational agent 평가 벤치마크.",
  },
  {
    id: "livecodebench-leaderboard",
    title: "LiveCodeBench Leaderboard",
    publisher: "LiveCodeBench",
    kind: "benchmark",
    url: "https://livecodebench.github.io/leaderboard.html",
    lastChecked: SNAPSHOT_DATE,
    note: "contamination-free coding evaluation, Pass@1, 난이도별 programming task 성능을 확인하는 코딩 벤치마크.",
  },
  {
    id: "aider-polyglot-leaderboard",
    title: "Aider LLM Leaderboards",
    publisher: "Aider",
    kind: "benchmark",
    url: "https://aider.chat/docs/leaderboards/",
    lastChecked: SNAPSHOT_DATE,
    note: "Aider polyglot benchmark. 225개 Exercism 코딩 과제를 C++, Go, Java, JavaScript, Python, Rust로 평가하며 비용, 명령어, edit format 정확도를 함께 제공.",
  },
  {
    id: "bigcodebench-leaderboard",
    title: "BigCodeBench Leaderboard",
    publisher: "BigCodeBench",
    kind: "benchmark",
    url: "https://bigcode-bench.github.io/",
    lastChecked: SNAPSHOT_DATE,
    note: "1140개 practical programming task와 Hard subset, Complete/Instruct(Vibe Check) coding ability 평가 출처.",
  },
  {
    id: "bfcl-leaderboard",
    title: "Berkeley Function Calling Leaderboard",
    publisher: "Berkeley Gorilla",
    kind: "benchmark",
    url: "https://gorilla.cs.berkeley.edu/leaderboard.html",
    lastChecked: SNAPSHOT_DATE,
    note: "BFCL V4 함수 호출, tool use, AST/API call 정확도를 비교하는 도구 호출 벤치마크.",
  },
  {
    id: "terminal-bench",
    title: "Terminal-Bench",
    publisher: "Terminal-Bench",
    kind: "benchmark",
    url: "https://www.tbench.ai/",
    lastChecked: SNAPSHOT_DATE,
    note: "Linux terminal에서 복합 개발/운영 작업을 수행하는 agent 능력을 평가하는 터미널 벤치마크.",
  },
  {
    id: "osworld-benchmark",
    title: "OSWorld",
    publisher: "OSWorld",
    kind: "benchmark",
    url: "https://os-world.github.io/",
    lastChecked: SNAPSHOT_DATE,
    note: "실제 컴퓨터 환경에서 open-ended GUI task를 수행하는 multimodal computer-use agent 벤치마크.",
  },
  {
    id: "webarena-benchmark",
    title: "WebArena",
    publisher: "WebArena",
    kind: "benchmark",
    url: "https://webarena.dev/",
    lastChecked: SNAPSHOT_DATE,
    note: "웹사이트 조작, 탐색, 정보 입력, 설정 변경 등 web agent task 평가를 위한 벤치마크 허브.",
  },
  {
    id: "mmmu-benchmark",
    title: "MMMU",
    publisher: "MMMU",
    kind: "benchmark",
    url: "https://mmmu-benchmark.github.io/",
    lastChecked: SNAPSHOT_DATE,
    note: "대학 수준의 Art & Design, Business, Science, Health, Humanities, Tech & Engineering 멀티모달 추론 벤치마크.",
  },
  {
    id: "docvqa-benchmark",
    title: "DocVQA",
    publisher: "DocVQA",
    kind: "benchmark",
    url: "https://www.docvqa.org/",
    lastChecked: SNAPSHOT_DATE,
    note: "문서 이미지, 양식, 표, 스캔 문서 기반 질의응답을 평가하는 문서 이해 벤치마크.",
  },
  {
    id: "chartqa-benchmark",
    title: "ChartQA",
    publisher: "ChartQA",
    kind: "benchmark",
    url: "https://github.com/vis-nlp/ChartQA",
    lastChecked: SNAPSHOT_DATE,
    note: "차트/그래프 질의응답을 평가하는 시각 자료 이해 벤치마크. PPT/리포트 분석 품질의 보조 지표로 사용.",
  },
  {
    id: "openai-videos",
    title: "OpenAI Developer Videos",
    publisher: "OpenAI Developers",
    kind: "official",
    url: "https://developers.openai.com/learn/videos",
    lastChecked: SNAPSHOT_DATE,
    note: "OpenAI API와 에이전트 개발 학습 영상 출처.",
  },
  {
    id: "anthropic-courses",
    title: "Anthropic Academy",
    publisher: "Anthropic",
    kind: "official",
    url: "https://www.anthropic.com/learn",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude, Claude Code, MCP, API 개발, 업무 적용 학습 과정 출처.",
  },
  {
    id: "oreilly-ai-engineering",
    title: "AI Engineering",
    publisher: "O'Reilly",
    kind: "publisher",
    url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
    lastChecked: SNAPSHOT_DATE,
    note: "LLM 애플리케이션 설계·평가·운영을 체계적으로 다루는 실무 도서 출처.",
  },
  {
    id: "oreilly-hands-on-llm",
    title: "Hands-On Large Language Models",
    publisher: "O'Reilly",
    kind: "publisher",
    url: "https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/",
    lastChecked: SNAPSHOT_DATE,
    note: "임베딩, RAG, 파인튜닝 등 LLM 기초와 실습을 연결하는 도서 출처.",
  },
  {
    id: "udemy-ai-coding-agents",
    title: "Udemy AI Coding Agents Search",
    publisher: "Udemy",
    kind: "publisher",
    url: "https://www.udemy.com/courses/search/?q=ai%20coding%20agents",
    lastChecked: SNAPSHOT_DATE,
    note: "AI coding agents, Claude Code, Cursor, agentic coding 관련 해외 강좌 후보를 찾는 검색 허브.",
  },
  {
    id: "coursera-ai-coding-agents",
    title: "Coursera AI Coding Agents Search",
    publisher: "Coursera",
    kind: "publisher",
    url: "https://www.coursera.org/search?query=ai%20coding%20agents",
    lastChecked: SNAPSHOT_DATE,
    note: "AI coding agents, software engineering with AI, developer productivity 관련 해외 강좌 후보를 찾는 검색 허브.",
  },
  {
    id: "deeplearning-ai-courses",
    title: "DeepLearning.AI Courses",
    publisher: "DeepLearning.AI",
    kind: "publisher",
    url: "https://www.deeplearning.ai/short-courses/",
    lastChecked: SNAPSHOT_DATE,
    note: "프롬프트, 에이전트, LLM 앱 개발 단기 강좌를 추적하는 해외 강좌 허브.",
  },
  {
    id: "oreilly-ai-coding-books",
    title: "O'Reilly AI Coding Agents Book Search",
    publisher: "O'Reilly",
    kind: "publisher",
    url: "https://www.oreilly.com/search/?q=AI%20coding%20agents&type=book",
    lastChecked: SNAPSHOT_DATE,
    note: "AI coding agents, LLM application engineering, agentic software development 관련 해외 도서 후보 검색 허브.",
  },
  {
    id: "manning-llm-agent-books",
    title: "Manning LLM Agents Search",
    publisher: "Manning",
    kind: "publisher",
    url: "https://www.manning.com/search?q=LLM%20agents",
    lastChecked: SNAPSHOT_DATE,
    note: "LLM agents, AI engineering, agentic application development 관련 해외 도서 후보 검색 허브.",
  },
  {
    id: "cursor-docs",
    title: "Cursor Documentation",
    publisher: "Cursor",
    kind: "official",
    url: "https://docs.cursor.com",
    lastChecked: SNAPSHOT_DATE,
    note: "Cursor AI IDE, agent, rules, MCP, model 설정, 팀 운영 문서를 확인하는 공식 문서.",
  },
  {
    id: "cursor-pricing",
    title: "Cursor Pricing",
    publisher: "Cursor",
    kind: "official",
    url: "https://cursor.com/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "Cursor Hobby, Pro, Teams, Enterprise 플랜과 Agent, Tab, MCP, Cloud agents, Bugbot, 사용량 기반 과금을 확인하는 공식 가격 페이지.",
  },
  {
    id: "cursor-changelog",
    title: "Cursor Changelog",
    publisher: "Cursor",
    kind: "official",
    url: "https://cursor.com/changelog",
    lastChecked: SNAPSHOT_DATE,
    note: "Cursor Cloud agents, Bugbot, Design Mode, SDK, CLI, agent 기능 변경을 추적하는 공식 변경 로그.",
  },
  {
    id: "cursor-students",
    title: "Cursor Students",
    publisher: "Cursor",
    kind: "official",
    url: "https://cursor.com/students",
    lastChecked: SNAPSHOT_DATE,
    note: "대학 이메일 인증 기반 Cursor Pro 학생 혜택과 포함 사용량을 확인하는 공식 학생 페이지.",
  },
  {
    id: "windsurf-docs",
    title: "Windsurf Documentation",
    publisher: "Windsurf",
    kind: "official",
    url: "https://docs.windsurf.com",
    lastChecked: SNAPSHOT_DATE,
    note: "Windsurf AI IDE, Cascade, context, MCP, enterprise 설정을 확인하는 공식 문서.",
  },
  {
    id: "cline-github",
    title: "Cline GitHub",
    publisher: "Cline",
    kind: "official",
    url: "https://github.com/cline/cline",
    lastChecked: SNAPSHOT_DATE,
    note: "VS Code 기반 오픈소스 코딩 에이전트 Cline의 설치, 기능, 이슈, 릴리스를 확인하는 저장소.",
  },
  {
    id: "roo-code-docs",
    title: "Roo Code Documentation",
    publisher: "Roo Code",
    kind: "official",
    url: "https://docs.roocode.com",
    lastChecked: SNAPSHOT_DATE,
    note: "Roo Code의 모드, MCP, 커스텀 지시, 모델 연결, VS Code 확장 설정을 확인하는 문서.",
  },
  {
    id: "aider-docs",
    title: "Aider Documentation",
    publisher: "Aider",
    kind: "official",
    url: "https://aider.chat",
    lastChecked: SNAPSHOT_DATE,
    note: "터미널 기반 pair programming 도구 Aider의 모델 연결, Git 워크플로, 명령어 문서.",
  },
  {
    id: "continue-docs",
    title: "Continue Documentation",
    publisher: "Continue",
    kind: "official",
    url: "https://docs.continue.dev",
    lastChecked: SNAPSHOT_DATE,
    note: "오픈소스 AI code assistant Continue의 IDE 확장, 모델/provider 설정, context 문서.",
  },
  {
    id: "openhands-docs",
    title: "OpenHands Documentation",
    publisher: "All Hands AI",
    kind: "official",
    url: "https://docs.all-hands.dev",
    lastChecked: SNAPSHOT_DATE,
    note: "OpenHands 에이전트 개발 환경, 로컬/클라우드 실행, LLM 설정을 확인하는 공식 문서.",
  },
  {
    id: "lovable-docs",
    title: "Lovable Documentation",
    publisher: "Lovable",
    kind: "official",
    url: "https://docs.lovable.dev",
    lastChecked: SNAPSHOT_DATE,
    note: "프롬프트 기반 웹 앱 제작 도구 Lovable의 프로젝트, 배포, 데이터 연동 문서.",
  },
  {
    id: "bolt-docs",
    title: "Bolt Support",
    publisher: "Bolt",
    kind: "official",
    url: "https://support.bolt.new",
    lastChecked: SNAPSHOT_DATE,
    note: "StackBlitz Bolt의 앱 생성, 프롬프트, 배포, 문제 해결 자료를 확인하는 지원 문서.",
  },
  {
    id: "v0-docs",
    title: "v0 Documentation",
    publisher: "Vercel",
    kind: "official",
    url: "https://v0.dev/docs",
    lastChecked: SNAPSHOT_DATE,
    note: "Vercel v0의 UI 생성, 프로젝트, 배포, 프롬프트 워크플로를 확인하는 공식 문서.",
  },
  {
    id: "replit-agent-docs",
    title: "Replit Agent Documentation",
    publisher: "Replit",
    kind: "official",
    url: "https://docs.replit.com/replitai/agent",
    lastChecked: SNAPSHOT_DATE,
    note: "Replit Agent의 앱 생성, 계획, 실행, 배포 흐름을 확인하는 공식 문서.",
  },
  {
    id: "github-copilot-docs",
    title: "GitHub Copilot Documentation",
    publisher: "GitHub Docs",
    kind: "official",
    url: "https://docs.github.com/en/copilot",
    lastChecked: SNAPSHOT_DATE,
    note: "GitHub Copilot, Copilot Chat, agent mode, CLI/IDE 설정과 조직 정책을 확인하는 공식 문서.",
  },
  {
    id: "github-copilot-plans",
    title: "GitHub Copilot Plans",
    publisher: "GitHub Docs",
    kind: "official",
    url: "https://docs.github.com/en/copilot/get-started/plans",
    lastChecked: SNAPSHOT_DATE,
    note: "Copilot Free, Student, Pro, Pro+, Max, Business, Enterprise 플랜, AI Credits, agent/cloud/code review/MCP 기능 매트릭스와 일시 중단 안내 확인 출처.",
  },
  {
    id: "github-education-pack",
    title: "GitHub Student Developer Pack",
    publisher: "GitHub Education",
    kind: "official",
    url: "https://education.github.com/pack",
    lastChecked: SNAPSHOT_DATE,
    note: "GitHub Copilot 학생 혜택 상태, GitHub Pro, JetBrains 학생 구독 등 개발자 도구 교육 혜택을 확인하는 공식 허브.",
  },
  {
    id: "jetbrains-ai",
    title: "JetBrains AI",
    publisher: "JetBrains",
    kind: "official",
    url: "https://www.jetbrains.com/ai/",
    lastChecked: SNAPSHOT_DATE,
    note: "JetBrains AI Assistant, 코드 완성, IDE 통합, 팀/엔터프라이즈 AI 기능과 가격 진입점을 확인하는 공식 제품 페이지.",
  },
  {
    id: "jetbrains-junie",
    title: "Junie by JetBrains",
    publisher: "JetBrains",
    kind: "official",
    url: "https://www.jetbrains.com/junie/",
    lastChecked: SNAPSHOT_DATE,
    note: "JetBrains IDE 안에서 동작하는 Junie AI coding agent의 제품 포지션, 지원 IDE, 사용 흐름을 확인하는 공식 페이지.",
  },
  {
    id: "jetbrains-student-pack",
    title: "Free JetBrains Student Pack",
    publisher: "JetBrains",
    kind: "official",
    url: "https://www.jetbrains.com/academy/student-pack/",
    lastChecked: SNAPSHOT_DATE,
    note: "JetBrains 학생용 무료 개발 도구와 교육 혜택을 확인하는 공식 학생 팩 페이지.",
  },
  {
    id: "amazon-q-developer-docs",
    title: "What is Amazon Q Developer?",
    publisher: "AWS Docs",
    kind: "official",
    url: "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html",
    lastChecked: SNAPSHOT_DATE,
    note: "Amazon Q Developer의 IDE/CLI, 코드 완성, 보안 스캔, 업그레이드/디버깅 지원과 AWS Builder ID 무료 로그인 경로 확인 출처.",
  },
  {
    id: "amazon-q-developer-pricing",
    title: "Amazon Q Developer Pricing",
    publisher: "AWS",
    kind: "official",
    url: "https://aws.amazon.com/q/developer/pricing/",
    lastChecked: SNAPSHOT_DATE,
    note: "Amazon Q Developer Free tier, Pro $19/user/month, agentic requests, Java/.NET transformation LOC 한도와 과금 방식을 확인하는 공식 가격 페이지.",
  },
  {
    id: "sourcegraph-amp-manual",
    title: "Amp Owner's Manual",
    publisher: "Amp",
    kind: "official",
    url: "https://ampcode.com/manual",
    lastChecked: SNAPSHOT_DATE,
    note: "Amp CLI 설치, deep/smart/rush 모드, Oracle, subagents, AGENTS.md, IDE 연동, thread sharing과 모델 사용 정책을 확인하는 공식 매뉴얼.",
  },
  {
    id: "sourcegraph-pricing",
    title: "Sourcegraph Pricing",
    publisher: "Sourcegraph",
    kind: "official",
    url: "https://sourcegraph.com/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "Sourcegraph 엔터프라이즈 가격, AI 기능 크레딧, MCP server, CLI, Cursor/Codex/Amp/Claude Code 연동을 확인하는 공식 가격 페이지.",
  },
  {
    id: "zed-ai",
    title: "Zed AI",
    publisher: "Zed",
    kind: "official",
    url: "https://zed.dev/ai",
    lastChecked: SNAPSHOT_DATE,
    note: "Zed의 agentic editing, 실시간 협업, unified diff review, ACP 기반 Claude Agent/Codex/OpenCode 연동과 MCP 지원 출처.",
  },
  {
    id: "augment-docs",
    title: "Augment Documentation",
    publisher: "Augment Code",
    kind: "official",
    url: "https://docs.augmentcode.com/introduction",
    lastChecked: SNAPSHOT_DATE,
    note: "Augment, Cosmos, Auggie CLI, Context Engine, VS Code/JetBrains/Vim/Neovim, Code Review, Slack, admin/analytics 문서 출처.",
  },
  {
    id: "augment-pricing",
    title: "Augment Pricing",
    publisher: "Augment Code",
    kind: "official",
    url: "https://www.augmentcode.com/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "Augment Business $100/month flat, up to 50 seats, usage included, CLI/MCP/Cosmos/Context Engine 포함 여부를 확인하는 공식 가격 페이지.",
  },
  {
    id: "tabnine-docs",
    title: "Tabnine Documentation",
    publisher: "Tabnine",
    kind: "official",
    url: "https://docs.tabnine.com/main",
    lastChecked: SNAPSHOT_DATE,
    note: "Tabnine AI code assistant, IDE/CLI, context, enterprise/privacy deployment 문서 출처.",
  },
  {
    id: "tabnine-pricing",
    title: "Tabnine Pricing",
    publisher: "Tabnine",
    kind: "official",
    url: "https://www.tabnine.com/pricing/",
    lastChecked: SNAPSHOT_DATE,
    note: "Tabnine Code Assistant $39/user/month, Agentic Platform $59/user/month, CLI, Context Engine, SaaS/VPC/on-prem/air-gapped, zero retention 정책 확인 출처.",
  },
  {
    id: "coderabbit-docs",
    title: "CodeRabbit Documentation",
    publisher: "CodeRabbit",
    kind: "official",
    url: "https://docs.coderabbit.ai/",
    lastChecked: SNAPSHOT_DATE,
    note: "CodeRabbit AI code review, PR summaries, IDE/CLI reviews, CodeRabbit Plan, Slack agent, pre-merge checks, Autofix, unit test generation 문서 출처.",
  },
  {
    id: "coderabbit-pricing",
    title: "CodeRabbit Pricing",
    publisher: "CodeRabbit",
    kind: "official",
    url: "https://www.coderabbit.ai/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "CodeRabbit Pro/Pro Plus/Enterprise, 무료 공개 저장소 리뷰, Slack agent minute 과금, PR 리뷰 제한과 기능 비교 출처.",
  },
  {
    id: "google-jules-docs",
    title: "Jules Getting Started",
    publisher: "Google Jules",
    kind: "official",
    url: "https://jules.google/docs",
    lastChecked: SNAPSHOT_DATE,
    note: "Google Jules의 GitHub 연동, 가상 머신 기반 작업 실행, 계획/리뷰/예약 작업, CLI/API/통합 문서를 확인하는 공식 문서.",
  },
  {
    id: "gemini-code-assist-ko",
    title: "Gemini Code Assist Korean Product Page",
    publisher: "Google Code Assist",
    kind: "official",
    url: "https://codeassist.google/products/business?hl=ko",
    lastChecked: SNAPSHOT_DATE,
    note: "Gemini Code Assist의 한국어 제품 설명, VS Code/JetBrains/Cloud Workstations, Gemini CLI, smart actions, 엔터프라이즈 보안과 가격표 출처.",
  },
  {
    id: "trae-docs",
    title: "TRAE Documentation",
    publisher: "TRAE",
    kind: "official",
    url: "https://docs.trae.ai/ide/trae-solo-is-now-available?_lang=en",
    lastChecked: SNAPSHOT_DATE,
    note: "TRAE IDE와 SOLO mode, cloud task, 문서 진입점을 확인하는 공식 문서.",
  },
  {
    id: "trae-pricing",
    title: "TRAE Pricing",
    publisher: "TRAE",
    kind: "official",
    url: "https://www.trae.ai/pricing",
    lastChecked: SNAPSHOT_DATE,
    note: "TRAE Free/Lite/Pro/Pro+/Ultra, 7일 Pro trial, Basic usage, Autocomplete, concurrent cloud tasks, SOLO mode 포함 여부 확인 출처.",
  },
  {
    id: "devin-docs",
    title: "Devin Documentation",
    publisher: "Cognition",
    kind: "official",
    url: "https://docs.devin.ai",
    lastChecked: SNAPSHOT_DATE,
    note: "Devin AI software engineer의 작업 환경, 지식, Slack/GitHub 연동, 운영 문서를 확인하는 공식 문서.",
  },
  {
    id: "youtube-teddynote",
    title: "테디노트 TeddyNote",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@teddynote",
    lastChecked: SNAPSHOT_DATE,
    note: "LangChain, RAG, 생성형 AI 실습을 한국어로 따라가기 좋은 채널.",
  },
  {
    id: "youtube-jocoding",
    title: "조코딩 JoCoding",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@jocoding",
    lastChecked: SNAPSHOT_DATE,
    note: "AI 코딩 도구와 자동화 워크플로를 빠르게 훑기 좋은 한국어 채널.",
  },
  {
    id: "youtube-hermes-agent-video",
    title: "헤르메스 에이전트 - 노트북 꺼도 24시간 일하는 AI 팀 만들기",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/watch?v=h_6jRAkMATI",
    lastChecked: SNAPSHOT_DATE,
    note: "사용자 요청으로 추가한 한국어 AI 에이전트 영상. 24시간 동작형 AI 팀/자동화 관점의 커뮤니티 자료로 분류합니다.",
  },
  {
    id: "youtube-vibe-coding-search",
    title: "Korean Vibe Coding YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EB%B0%94%EC%9D%B4%EB%B8%8C+%EC%BD%94%EB%94%A9+Claude+Code+Codex+Cursor",
    lastChecked: SNAPSHOT_DATE,
    note: "바이브 코딩, Claude Code, Codex, Cursor 관련 한국어 유튜브 강좌 후보를 계속 찾는 검색 링크.",
  },
  {
    id: "youtube-codefactory-search",
    title: "Code Factory YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EC%BD%94%EB%93%9C%ED%8C%A9%ED%86%A0%EB%A6%AC+AI+%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "코드팩토리, AI 코딩, 앱 개발, 개발 생산성 강좌 후보를 찾는 한국어 유튜브 검색 링크.",
  },
  {
    id: "youtube-dev-dongsaeng-search",
    title: "개발동생 YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EA%B0%9C%EB%B0%9C%EB%8F%99%EC%83%9D+AI+%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "개발동생, AI 코딩, 개발 자동화, 실무 코딩 강좌 후보를 찾는 한국어 유튜브 검색 링크.",
  },
  {
    id: "youtube-cursor-korean-search",
    title: "Cursor Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Cursor+AI+%EC%BD%94%EB%94%A9+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "Cursor AI IDE, AI 코딩, 바이브 코딩 관련 한국어 유튜브 강좌 후보를 찾는 검색 링크.",
  },
  {
    id: "youtube-windsurf-korean-search",
    title: "Windsurf Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Windsurf+AI+%EC%BD%94%EB%94%A9+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "Windsurf, Cascade, AI IDE 관련 한국어 유튜브 강좌 후보를 찾는 검색 링크.",
  },
  {
    id: "youtube-cline-roo-korean-search",
    title: "Cline Roo Code Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Cline+Roo+Code+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "Cline, Roo Code, VS Code 코딩 에이전트 관련 한국어 유튜브 강좌 후보 검색 링크.",
  },
  {
    id: "youtube-copilot-korean-search",
    title: "GitHub Copilot Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=GitHub+Copilot+%ED%95%9C%EA%B5%AD%EC%96%B4+%EA%B0%95%EC%A2%8C",
    lastChecked: SNAPSHOT_DATE,
    note: "GitHub Copilot, Copilot Chat, agent mode 관련 한국어 유튜브 강좌 후보 검색 링크.",
  },
  {
    id: "youtube-jetbrains-junie-korean-search",
    title: "JetBrains Junie Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=JetBrains+Junie+AI+%EC%BD%94%EB%94%A9+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "JetBrains AI, Junie, IntelliJ/WebStorm AI 코딩 에이전트 관련 한국어 영상 후보를 찾는 검색 링크.",
  },
  {
    id: "youtube-amazon-q-korean-search",
    title: "Amazon Q Developer Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Amazon+Q+Developer+%ED%95%9C%EA%B5%AD%EC%96%B4+%EA%B0%95%EC%A2%8C",
    lastChecked: SNAPSHOT_DATE,
    note: "Amazon Q Developer, AWS IDE/CLI AI 코딩, 코드 변환 관련 한국어 영상 후보 검색 링크.",
  },
  {
    id: "youtube-augment-korean-search",
    title: "Augment Code Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Augment+Code+AI+%EC%BD%94%EB%94%A9+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "Augment Code, Auggie CLI, enterprise coding agent 관련 한국어 영상 후보 검색 링크.",
  },
  {
    id: "youtube-tabnine-korean-search",
    title: "Tabnine Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Tabnine+AI+%EC%BD%94%EB%94%A9+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "Tabnine AI code assistant, privacy-first coding assistant 관련 한국어 영상 후보 검색 링크.",
  },
  {
    id: "youtube-coderabbit-korean-search",
    title: "CodeRabbit Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=CodeRabbit+AI+%EC%BD%94%EB%93%9C+%EB%A6%AC%EB%B7%B0+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "CodeRabbit AI code review, PR 리뷰 자동화 관련 한국어 영상 후보 검색 링크.",
  },
  {
    id: "youtube-trae-korean-search",
    title: "TRAE Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=TRAE+AI+IDE+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "TRAE AI IDE, SOLO mode, cloud task 관련 한국어 영상 후보 검색 링크.",
  },
  {
    id: "youtube-v0-lovable-bolt-korean-search",
    title: "v0 Lovable Bolt Korean YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=v0+Lovable+Bolt+AI+%ED%95%9C%EA%B5%AD%EC%96%B4",
    lastChecked: SNAPSHOT_DATE,
    note: "v0, Lovable, Bolt 기반 프롬프트 웹 앱 제작 한국어 유튜브 강좌 후보 검색 링크.",
  },
  {
    id: "youtube-nomadcoders-ai-search",
    title: "Nomad Coders AI Coding Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EB%85%B8%EB%A7%88%EB%93%9C%EC%BD%94%EB%8D%94+AI+%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "노마드 코더의 AI 코딩, 프론트엔드 생산성, 앱 제작 관련 영상 후보를 찾는 검색 링크.",
  },
  {
    id: "youtube-dreamcoding-ai-search",
    title: "Dream Coding AI Coding Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EB%93%9C%EB%A6%BC%EC%BD%94%EB%94%A9+AI+%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "드림코딩의 AI 코딩, 개발 생산성, 프론트엔드 실무 영상 후보 검색 링크.",
  },
  {
    id: "youtube-yalco-ai-search",
    title: "Yalco AI Coding Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EC%96%84%EC%BD%94+AI+%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "얄코의 AI 코딩, 개발 도구, 개념 설명 영상 후보 검색 링크.",
  },
  {
    id: "youtube-codingapple-ai-search",
    title: "Coding Apple AI Coding Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EC%BD%94%EB%94%A9%EC%95%A0%ED%94%8C+AI+%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "코딩애플의 AI 코딩, 웹 개발 자동화, 실무 개발 영상 후보 검색 링크.",
  },
  {
    id: "youtube-nadocoding-ai-search",
    title: "Nado Coding AI Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EB%82%98%EB%8F%84%EC%BD%94%EB%94%A9+AI+%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "나도코딩의 AI 코딩, 자동화, 입문 개발 영상 후보 검색 링크.",
  },
  {
    id: "youtube-nomadcoders-channel",
    title: "노마드 코더 Nomad Coders YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@nomadcoders",
    lastChecked: SNAPSHOT_DATE,
    note: "웹/앱 개발, 프론트엔드, 생산성, AI 코딩 이슈를 한국어로 확인하는 노마드 코더 공식 채널.",
  },
  {
    id: "youtube-dreamcoding-channel",
    title: "드림코딩 YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@dream-coding",
    lastChecked: SNAPSHOT_DATE,
    note: "프론트엔드 실무, 개발 생산성, AI 활용 흐름을 한국어로 확인하는 드림코딩 공식 채널.",
  },
  {
    id: "youtube-codingapple-channel",
    title: "코딩애플 YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@codingapple",
    lastChecked: SNAPSHOT_DATE,
    note: "웹 개발, 실무 개발 도구, AI 코딩 트렌드 후보를 한국어로 확인하는 코딩애플 채널.",
  },
  {
    id: "youtube-nadocoding-channel",
    title: "나도코딩 YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@nadocoding",
    lastChecked: SNAPSHOT_DATE,
    note: "Python, 자동화, 입문 개발, AI 활용 기초 자료를 한국어로 확인하는 나도코딩 채널.",
  },
  {
    id: "youtube-yalco-channel",
    title: "얄팍한 코딩사전 YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@yalco-coding",
    lastChecked: SNAPSHOT_DATE,
    note: "개발 개념, 도구, 웹 기술, AI 코딩 입문자용 배경지식을 한국어 영상으로 확인하는 채널.",
  },
  {
    id: "youtube-opentutorials-channel",
    title: "생활코딩 YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@coohde",
    lastChecked: SNAPSHOT_DATE,
    note: "생활코딩의 무료 개발 입문 영상과 AI 코딩 입문 전 필요한 웹/프로그래밍 기초를 확인하는 채널.",
  },
  {
    id: "youtube-bbanghyong-channel",
    title: "빵형의 개발도상국 YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@bbanghyong",
    lastChecked: SNAPSHOT_DATE,
    note: "Python, 데이터, AI/ML, 생성형 AI 실험 영상을 한국어로 확인하는 개발·AI 채널.",
  },
  {
    id: "youtube-codingnoona-search",
    title: "코딩 알려주는 누나 YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EC%BD%94%EB%94%A9+%EC%95%8C%EB%A0%A4%EC%A3%BC%EB%8A%94+%EB%88%84%EB%82%98+AI+%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "코딩 알려주는 누나의 웹 개발, 프론트엔드, AI 코딩 관련 영상 후보를 찾는 검색 링크.",
  },
  {
    id: "youtube-metacodem-search",
    title: "메타코드M YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=%EB%A9%94%ED%83%80%EC%BD%94%EB%93%9CM+AI+%EB%8D%B0%EC%9D%B4%ED%84%B0",
    lastChecked: SNAPSHOT_DATE,
    note: "메타코드M의 AI, 데이터, 개발 강의 영상 후보를 찾는 한국어 유튜브 검색 링크.",
  },
  {
    id: "youtube-openai",
    title: "OpenAI YouTube",
    publisher: "YouTube",
    kind: "official",
    url: "https://www.youtube.com/@OpenAI",
    lastChecked: SNAPSHOT_DATE,
    note: "OpenAI 제품 발표, 데모, 연구/개발자 세션을 추적하는 공식 유튜브 채널.",
  },
  {
    id: "youtube-anthropic",
    title: "Anthropic YouTube",
    publisher: "YouTube",
    kind: "official",
    url: "https://www.youtube.com/@anthropic-ai",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude, Claude Code, Anthropic 연구/제품 발표 영상을 추적하는 공식 유튜브 채널.",
  },
  {
    id: "youtube-google-developers",
    title: "Google for Developers YouTube",
    publisher: "YouTube",
    kind: "official",
    url: "https://www.youtube.com/@GoogleDevelopers",
    lastChecked: SNAPSHOT_DATE,
    note: "Gemini API, Google AI, Android/Web/Cloud 개발자 영상을 추적하는 Google 공식 개발자 채널.",
  },
  {
    id: "youtube-google-cloud-tech",
    title: "Google Cloud Tech YouTube",
    publisher: "YouTube",
    kind: "official",
    url: "https://www.youtube.com/@GoogleCloudTech",
    lastChecked: SNAPSHOT_DATE,
    note: "Vertex AI, Gemini Enterprise, Google Cloud 생성형 AI 세션을 추적하는 공식 채널.",
  },
  {
    id: "youtube-google-developers-korea",
    title: "Google Developers Korea",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@GoogleDevelopersKorea",
    lastChecked: SNAPSHOT_DATE,
    note: "Google 개발자 행사, Gemini/Cloud/Android 개발 세션을 한국어로 확인하기 좋은 공식 채널.",
  },
  {
    id: "youtube-aws-korea",
    title: "AWS Korea",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@AWSKorea",
    lastChecked: SNAPSHOT_DATE,
    note: "Amazon Bedrock, 생성형 AI, 클라우드 아키텍처 세션을 한국어 영상으로 확인하는 공식 채널.",
  },
  {
    id: "youtube-ms-dev-korea",
    title: "Microsoft Developer Korea",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@MicrosoftDeveloperKorea",
    lastChecked: SNAPSHOT_DATE,
    note: "Azure OpenAI, Copilot, 개발자 도구 세션을 한국어 영상으로 확인하기 좋은 공식 개발자 채널.",
  },
  {
    id: "youtube-devocean",
    title: "DEVOCEAN",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@devocean",
    lastChecked: SNAPSHOT_DATE,
    note: "국내 개발자 컨퍼런스와 AI/ML 세션 영상을 추적하기 좋은 한국어 기술 채널.",
  },
  {
    id: "youtube-mistral-ai",
    title: "Mistral AI YouTube",
    publisher: "YouTube",
    kind: "official",
    url: "https://www.youtube.com/@MistralAI",
    lastChecked: SNAPSHOT_DATE,
    note: "Mistral 모델 발표, 제품 데모, 연구/개발자 콘텐츠를 추적하는 유튜브 채널.",
  },
  {
    id: "youtube-moonshot-ai",
    title: "Moonshot AI YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@MoonshotAI",
    lastChecked: SNAPSHOT_DATE,
    note: "Kimi/Moonshot 관련 영상 후보를 확인하는 채널. 공식 문서에서 직접 연결된 채널인지 추가 확인이 필요합니다.",
  },
  {
    id: "youtube-kimi-search",
    title: "Kimi K2 YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Kimi+K2.7+Code",
    lastChecked: SNAPSHOT_DATE,
    note: "Kimi K2.7 Code, Moonshot API, Kimi coding agent 관련 최신 유튜브 강좌를 찾는 검색 링크.",
  },
  {
    id: "youtube-deepseek",
    title: "DeepSeek YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@deepseek",
    lastChecked: SNAPSHOT_DATE,
    note: "DeepSeek 관련 영상 후보를 확인하는 채널. 공식 문서에서 직접 연결된 채널인지 추가 확인이 필요합니다.",
  },
  {
    id: "youtube-deepseek-search",
    title: "DeepSeek V4 YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=DeepSeek+V4+API",
    lastChecked: SNAPSHOT_DATE,
    note: "DeepSeek V4, R1, API 호환, 저비용 LLM 운용 관련 유튜브 강좌를 찾는 검색 링크.",
  },
  {
    id: "youtube-qwen",
    title: "Qwen YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@QwenLM",
    lastChecked: SNAPSHOT_DATE,
    note: "Qwen 관련 영상 후보를 확인하는 채널. 공식 문서에서 직접 연결된 채널인지 추가 확인이 필요합니다.",
  },
  {
    id: "youtube-qwen-search",
    title: "Qwen3 YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Qwen3+LLM+Korean",
    lastChecked: SNAPSHOT_DATE,
    note: "Qwen3, Qwen 로컬 실행, Ollama/vLLM 배포 관련 한국어·영어 유튜브 강좌를 찾는 검색 링크.",
  },
  {
    id: "youtube-xai-grok-search",
    title: "xAI Grok YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=xAI+Grok+API",
    lastChecked: SNAPSHOT_DATE,
    note: "xAI/Grok API, X Search, Grok 실시간 리서치 관련 유튜브 강좌를 찾는 검색 링크. 공식 채널은 추가 확인 대상으로 둡니다.",
  },
  {
    id: "youtube-manusai",
    title: "Manus AI YouTube",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/@ManusAI",
    lastChecked: SNAPSHOT_DATE,
    note: "Manus 관련 영상 후보를 확인하는 채널. 제품 공식 채널 여부와 최신 업로드는 별도 확인이 필요합니다.",
  },
  {
    id: "youtube-manus-search",
    title: "Manus AI YouTube Search",
    publisher: "YouTube",
    kind: "community",
    url: "https://www.youtube.com/results?search_query=Manus+AI+agent+tutorial",
    lastChecked: SNAPSHOT_DATE,
    note: "Manus 에이전트, 브라우저 오퍼레이터, 업무 자동화 강좌를 찾는 유튜브 검색 링크.",
  },
  {
    id: "teddynote-blog",
    title: "TeddyNote Blog",
    publisher: "TeddyNote",
    kind: "community",
    url: "https://teddylee777.github.io/",
    lastChecked: SNAPSHOT_DATE,
    note: "LangChain, RAG, LLM 앱 실습을 한국어 글과 코드 예제로 정리한 블로그.",
  },
  {
    id: "naver-d2",
    title: "NAVER D2",
    publisher: "NAVER D2",
    kind: "publisher",
    url: "https://d2.naver.com/home",
    lastChecked: SNAPSHOT_DATE,
    note: "네이버의 AI, 검색, 추천, 대규모 시스템 기술 글을 한국어로 확인하는 개발자 블로그.",
  },
  {
    id: "kakao-tech-blog",
    title: "Kakao Tech",
    publisher: "Kakao",
    kind: "publisher",
    url: "https://tech.kakao.com/",
    lastChecked: SNAPSHOT_DATE,
    note: "카카오의 생성형 AI, 검색, 추천, 데이터/플랫폼 기술 글을 한국어로 확인하는 공식 기술 블로그.",
  },
  {
    id: "toss-tech-blog",
    title: "Toss Tech",
    publisher: "Viva Republica",
    kind: "publisher",
    url: "https://toss.tech/",
    lastChecked: SNAPSHOT_DATE,
    note: "토스의 제품 개발, 데이터, ML/AI 적용 경험을 한국어로 확인하는 기술 블로그.",
  },
  {
    id: "woowahan-ai-blog",
    title: "Woowahan Tech Blog AI",
    publisher: "Woowahan Brothers",
    kind: "publisher",
    url: "https://techblog.woowahan.com/category/ai/",
    lastChecked: SNAPSHOT_DATE,
    note: "우아한형제들의 AI 적용 사례와 기술 글을 한국어로 확인하는 카테고리.",
  },
  {
    id: "devocean-blog",
    title: "DEVOCEAN",
    publisher: "SK Telecom",
    kind: "publisher",
    url: "https://devocean.sk.com/",
    lastChecked: SNAPSHOT_DATE,
    note: "국내 개발자 커뮤니티의 AI/ML, 클라우드, 데이터 기술 글과 세션을 찾는 허브.",
  },
  {
    id: "google-dev-blog-ko",
    title: "Google Developers Blog Korean",
    publisher: "Google Developers",
    kind: "official",
    url: "https://developers.googleblog.com/ko/",
    lastChecked: SNAPSHOT_DATE,
    note: "Google 개발자 블로그의 한국어 글과 Gemini/AI 개발자 뉴스 확인 출처.",
  },
  {
    id: "upstage-blog",
    title: "Upstage Blog",
    publisher: "Upstage",
    kind: "publisher",
    url: "https://www.upstage.ai/blog",
    lastChecked: SNAPSHOT_DATE,
    note: "Upstage의 LLM, Document AI, Solar, AI 제품/연구 업데이트를 확인하는 블로그.",
  },
  {
    id: "naver-cloud-blog",
    title: "NAVER Cloud Platform Blog",
    publisher: "NAVER Cloud",
    kind: "publisher",
    url: "https://blog.naver.com/n_cloudplatform",
    lastChecked: SNAPSHOT_DATE,
    note: "NAVER Cloud, HyperCLOVA X, 클라우드 AI 제품과 기술 자료를 확인하는 공식 블로그.",
  },
  {
    id: "lycorp-tech-ko",
    title: "LY Corporation Tech Blog Korean",
    publisher: "LY Corporation",
    kind: "publisher",
    url: "https://techblog.lycorp.co.jp/ko",
    lastChecked: SNAPSHOT_DATE,
    note: "LINE/Yahoo 계열의 AI, 검색, 데이터, 플랫폼 기술 글을 한국어로 확인하는 기술 블로그.",
  },
  {
    id: "superb-ai-blog-ko",
    title: "Superb AI Korean Blog",
    publisher: "Superb AI",
    kind: "publisher",
    url: "https://blog-ko.superb-ai.com",
    lastChecked: SNAPSHOT_DATE,
    note: "비전 AI, 데이터셋, 모델 운영, AI 제품 사례를 한국어로 확인하는 블로그.",
  },
  {
    id: "okky-community",
    title: "OKKY",
    publisher: "OKKY",
    kind: "community",
    url: "https://okky.kr/",
    lastChecked: SNAPSHOT_DATE,
    note: "국내 개발자 Q&A, 커뮤니티, AI/Tech 뉴스, 바이브 코딩 사례와 도구 사용 경험 후보를 확인하는 커뮤니티.",
  },
  {
    id: "velog-ai-coding-search",
    title: "Velog AI Coding Search",
    publisher: "Velog",
    kind: "community",
    url: "https://velog.io/search?q=AI%20%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "개발자 개인 블로그의 AI 코딩, LLM, LangChain, Cursor, Claude Code 실습 글 후보를 찾는 검색 링크.",
  },
  {
    id: "brunch-ai-coding-search",
    title: "Brunch AI Coding Search",
    publisher: "Brunch",
    kind: "community",
    url: "https://brunch.co.kr/search?q=AI%20%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "AI 코딩, 생산성, 기획/디자인/PPT 자동화 관점의 한국어 에세이·실무 글 후보를 찾는 검색 링크.",
  },
  {
    id: "kmooc-ai",
    title: "K-MOOC AI Courses",
    publisher: "K-MOOC",
    kind: "publisher",
    url: "https://www.kmooc.kr",
    lastChecked: SNAPSHOT_DATE,
    note: "국내 대학·기관의 AI, 데이터, 컴퓨터공학 온라인 공개강좌를 찾는 공공 원격 교육 허브.",
  },
  {
    id: "boostcourse-ai",
    title: "Boostcourse AI Courses",
    publisher: "NAVER Connect Foundation",
    kind: "publisher",
    url: "https://www.boostcourse.org",
    lastChecked: SNAPSHOT_DATE,
    note: "부스트코스의 AI, 데이터, 웹/앱 개발 무료·온라인 강좌를 찾는 교육 허브.",
  },
  {
    id: "elice-ai",
    title: "Elice AI Education",
    publisher: "Elice",
    kind: "publisher",
    url: "https://elice.io/ko",
    lastChecked: SNAPSHOT_DATE,
    note: "엘리스의 AI, 데이터, 개발자 교육과 기업 원격 교육 프로그램을 찾는 허브.",
  },
  {
    id: "programmers-school-ai",
    title: "Programmers School",
    publisher: "Programmers",
    kind: "publisher",
    url: "https://school.programmers.co.kr",
    lastChecked: SNAPSHOT_DATE,
    note: "프로그래머스 스쿨의 개발자 교육, 데브코스, 코딩 테스트, AI/데이터 강좌 후보를 찾는 허브.",
  },
  {
    id: "goorm-edu-ai",
    title: "goormEDU",
    publisher: "goorm",
    kind: "publisher",
    url: "https://edu.goorm.io",
    lastChecked: SNAPSHOT_DATE,
    note: "구름EDU의 AI, 데이터, 개발자 원격 강좌 후보를 찾는 교육 허브.",
  },
  {
    id: "fastcampus-ai",
    title: "Fast Campus",
    publisher: "Fast Campus",
    kind: "publisher",
    url: "https://fastcampus.co.kr",
    lastChecked: SNAPSHOT_DATE,
    note: "패스트캠퍼스의 AI, 데이터, 개발, 자동화 실무 강좌 후보를 찾는 원격 교육 허브.",
  },
  {
    id: "codeit-ai",
    title: "Codeit",
    publisher: "Codeit",
    kind: "publisher",
    url: "https://www.codeit.kr",
    lastChecked: SNAPSHOT_DATE,
    note: "코드잇의 개발 입문, 데이터, AI 활용 학습 경로를 찾는 온라인 교육 허브.",
  },
  {
    id: "spartacoding-ai",
    title: "Sparta Coding Club",
    publisher: "Sparta Coding Club",
    kind: "publisher",
    url: "https://spartacodingclub.kr",
    lastChecked: SNAPSHOT_DATE,
    note: "스파르타코딩클럽의 AI, 웹/앱 개발, 업무 자동화 원격 강좌 후보를 찾는 교육 허브.",
  },
  {
    id: "modulabs-ai",
    title: "모두의연구소",
    publisher: "모두의연구소",
    kind: "community",
    url: "https://modulabs.co.kr",
    lastChecked: SNAPSHOT_DATE,
    note: "AI 연구 커뮤니티, 풀잎스쿨, 랩, 세미나와 학습 모임을 찾는 국내 커뮤니티 교육 허브.",
  },
  {
    id: "nomadcoders",
    title: "Nomad Coders",
    publisher: "Nomad Coders",
    kind: "publisher",
    url: "https://nomadcoders.co/",
    lastChecked: SNAPSHOT_DATE,
    note: "한국어 웹/앱 개발 강좌, 프론트엔드/백엔드/풀스택 학습 경로와 AI 코딩 관련 신규 강좌 후보를 찾는 플랫폼.",
  },
  {
    id: "dreamcoding-academy",
    title: "Dream Coding Academy",
    publisher: "Dream Coding",
    kind: "publisher",
    url: "https://academy.dream-coding.com/",
    lastChecked: SNAPSHOT_DATE,
    note: "드림코딩의 프론트엔드, 실무 개발, 생산성·AI 도구 관련 신규 강좌 후보를 찾는 한국어 강좌 플랫폼.",
  },
  {
    id: "class101-dev-ai",
    title: "CLASS101",
    publisher: "CLASS101",
    kind: "publisher",
    url: "https://class101.net/ko",
    lastChecked: SNAPSHOT_DATE,
    note: "클래스101의 AI 활용, 업무 자동화, 디자인·개발·크리에이터 강좌 후보를 찾는 구독형 강좌 플랫폼.",
  },
  {
    id: "coloso-dev-ai",
    title: "Coloso",
    publisher: "Coloso",
    kind: "publisher",
    url: "https://coloso.co.kr/",
    lastChecked: SNAPSHOT_DATE,
    note: "콜로소의 AI, 디자인, 3D, 개발, 생산성 실무 강좌 후보를 찾는 한국어 전문 강좌 플랫폼.",
  },
  {
    id: "wanted-events",
    title: "Wanted Events",
    publisher: "Wanted",
    kind: "publisher",
    url: "https://www.wanted.co.kr/events",
    lastChecked: SNAPSHOT_DATE,
    note: "원티드의 개발자 커리어, AI/데이터/제품 세미나, 웨비나, 교육 이벤트 후보를 찾는 이벤트 허브.",
  },
  {
    id: "likelion-school",
    title: "LIKELION",
    publisher: "LIKELION",
    kind: "publisher",
    url: "https://likelion.net/",
    lastChecked: SNAPSHOT_DATE,
    note: "멋쟁이사자처럼의 부트캠프, AI/개발 교육, 창업/서비스 제작 프로그램 후보를 확인하는 교육 플랫폼.",
  },
  {
    id: "aiffel-ai",
    title: "AIFFEL",
    publisher: "AIFFEL",
    kind: "publisher",
    url: "https://aiffel.io/",
    lastChecked: SNAPSHOT_DATE,
    note: "AIFFEL의 AI 개발자 교육, 부트캠프, 프로젝트 기반 학습과 원격/오프라인 과정 후보를 확인하는 플랫폼.",
  },
  {
    id: "opentutorials",
    title: "생활코딩 / OpenTutorials",
    publisher: "OpenTutorials",
    kind: "community",
    url: "https://opentutorials.org/course/1",
    lastChecked: SNAPSHOT_DATE,
    note: "생활코딩의 무료 웹/개발 입문 자료와 AI 코딩 입문자가 함께 볼 수 있는 한국어 공개 학습 허브.",
  },
  {
    id: "edwith",
    title: "edwith",
    publisher: "edwith",
    kind: "publisher",
    url: "https://www.edwith.org/",
    lastChecked: SNAPSHOT_DATE,
    note: "edwith의 공개 온라인 강좌, SW/AI/데이터 학습 자료 후보를 찾는 한국어 교육 플랫폼.",
  },
  {
    id: "kocw",
    title: "KOCW",
    publisher: "KOCW",
    kind: "publisher",
    url: "https://www.kocw.net/home/index.do",
    lastChecked: SNAPSHOT_DATE,
    note: "국내 대학 공개 강의, AI/데이터/컴퓨터공학 강좌 후보를 찾는 공공 공개강좌 허브.",
  },
  {
    id: "zerobase",
    title: "ZeroBase",
    publisher: "ZeroBase",
    kind: "publisher",
    url: "https://zero-base.co.kr/",
    lastChecked: SNAPSHOT_DATE,
    note: "제로베이스의 개발, 데이터, PM, AI 활용 부트캠프와 실무 강좌 후보를 찾는 교육 플랫폼.",
  },
  {
    id: "ozcoding",
    title: "OZ Coding School",
    publisher: "OZ Coding School",
    kind: "publisher",
    url: "https://ozcodingschool.com/",
    lastChecked: SNAPSHOT_DATE,
    note: "오즈코딩스쿨의 개발자 교육, 부트캠프, AI/웹 개발 원격 과정 후보를 확인하는 플랫폼.",
  },
  {
    id: "multicampus",
    title: "Multicampus",
    publisher: "Multicampus",
    kind: "publisher",
    url: "https://www.multicampus.com/",
    lastChecked: SNAPSHOT_DATE,
    note: "멀티캠퍼스의 기업교육, AI/데이터/클라우드/개발자 교육 과정과 B2B 원격 교육 후보를 확인하는 플랫폼.",
  },
  {
    id: "aihub",
    title: "AI Hub",
    publisher: "AI Hub",
    kind: "publisher",
    url: "https://www.aihub.or.kr",
    lastChecked: SNAPSHOT_DATE,
    note: "국내 AI 학습용 데이터, 활용 사례, 교육 자료 후보를 확인하는 공공 AI 데이터 허브.",
  },
  {
    id: "inflearn-langchain",
    title: "Inflearn LangChain Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=langchain",
    lastChecked: SNAPSHOT_DATE,
    note: "LangChain, RAG, LLM 앱 개발 관련 한국어 유료/무료 강좌를 찾는 강좌 검색 허브.",
  },
  {
    id: "inflearn-vibe-coding",
    title: "Inflearn Vibe Coding Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=%EB%B0%94%EC%9D%B4%EB%B8%8C%20%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "바이브 코딩, AI 코딩 도구, Cursor/Claude Code/Codex류 강좌 후보를 한국어로 찾는 인프런 검색 허브.",
  },
  {
    id: "inflearn-ai-coding",
    title: "Inflearn AI Coding Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=AI%20%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "AI 코딩, 코딩 자동화, 개발 생산성 강좌 후보를 한국어로 찾는 인프런 검색 허브.",
  },
  {
    id: "inflearn-claude-code",
    title: "Inflearn Claude Code Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=Claude%20Code",
    lastChecked: SNAPSHOT_DATE,
    note: "Claude Code 한국어 강좌 후보를 추적하기 위한 인프런 검색 링크.",
  },
  {
    id: "inflearn-codex",
    title: "Inflearn Codex Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=Codex",
    lastChecked: SNAPSHOT_DATE,
    note: "OpenAI Codex와 Codex CLI 관련 한국어 강좌 후보를 추적하기 위한 인프런 검색 링크.",
  },
  {
    id: "inflearn-cursor",
    title: "Inflearn Cursor Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=Cursor",
    lastChecked: SNAPSHOT_DATE,
    note: "Cursor, AI IDE, AI pair programming 강좌 후보를 추적하기 위한 인프런 검색 링크.",
  },
  {
    id: "inflearn-jetbrains-ai",
    title: "Inflearn JetBrains AI Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=JetBrains%20AI",
    lastChecked: SNAPSHOT_DATE,
    note: "JetBrains AI, Junie, IntelliJ/WebStorm AI 코딩 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-amazon-q",
    title: "Inflearn Amazon Q Developer Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=Amazon%20Q%20Developer",
    lastChecked: SNAPSHOT_DATE,
    note: "Amazon Q Developer, AWS AI 코딩, IDE/CLI 개발 보조 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-coderabbit",
    title: "Inflearn CodeRabbit Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=CodeRabbit",
    lastChecked: SNAPSHOT_DATE,
    note: "CodeRabbit, AI 코드 리뷰, PR 자동화 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-trae",
    title: "Inflearn TRAE Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=TRAE",
    lastChecked: SNAPSHOT_DATE,
    note: "TRAE AI IDE, SOLO mode, AI 개발 도구 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-codefactory",
    title: "Inflearn Code Factory Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=%EC%BD%94%EB%93%9C%ED%8C%A9%ED%86%A0%EB%A6%AC",
    lastChecked: SNAPSHOT_DATE,
    note: "코드팩토리 강좌와 AI 코딩/앱 개발 관련 한국어 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-dev-dongsaeng",
    title: "Inflearn 개발동생 Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=%EA%B0%9C%EB%B0%9C%EB%8F%99%EC%83%9D",
    lastChecked: SNAPSHOT_DATE,
    note: "개발동생 강좌와 실무 개발/AI 코딩 관련 한국어 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-github-copilot",
    title: "Inflearn GitHub Copilot Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=GitHub%20Copilot",
    lastChecked: SNAPSHOT_DATE,
    note: "GitHub Copilot, Copilot Chat, AI pair programming 관련 한국어 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-windsurf",
    title: "Inflearn Windsurf Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=Windsurf",
    lastChecked: SNAPSHOT_DATE,
    note: "Windsurf, Cascade, AI IDE 관련 한국어 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-cline",
    title: "Inflearn Cline Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=Cline",
    lastChecked: SNAPSHOT_DATE,
    note: "Cline, Roo Code, VS Code 에이전트 관련 한국어 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-v0",
    title: "Inflearn v0 Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=v0",
    lastChecked: SNAPSHOT_DATE,
    note: "Vercel v0, 프롬프트 UI 생성, AI 웹앱 제작 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "inflearn-lovable",
    title: "Inflearn Lovable Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=Lovable",
    lastChecked: SNAPSHOT_DATE,
    note: "Lovable, 노코드/프롬프트 기반 웹앱 제작 강좌 후보를 찾는 인프런 검색 링크.",
  },
  {
    id: "yes24-llm-books",
    title: "YES24 LLM Book Search",
    publisher: "YES24",
    kind: "publisher",
    url: "https://www.yes24.com/Product/Search?domain=BOOK&query=LLM",
    lastChecked: SNAPSHOT_DATE,
    note: "한국어 LLM, 생성형 AI, LangChain 관련 도서 후보를 추적하는 도서 검색 허브.",
  },
  {
    id: "yes24-langchain-books",
    title: "YES24 LangChain Book Search",
    publisher: "YES24",
    kind: "publisher",
    url: "https://www.yes24.com/Product/Search?domain=BOOK&query=LangChain",
    lastChecked: SNAPSHOT_DATE,
    note: "LangChain과 RAG 실무 도서 후보를 별도로 추적하기 위한 도서 검색 링크.",
  },
  {
    id: "yes24-vibe-coding-books",
    title: "YES24 Vibe Coding Book Search",
    publisher: "YES24",
    kind: "publisher",
    url: "https://www.yes24.com/Product/Search?domain=BOOK&query=%EB%B0%94%EC%9D%B4%EB%B8%8C%20%EC%BD%94%EB%94%A9",
    lastChecked: SNAPSHOT_DATE,
    note: "바이브 코딩과 AI 코딩 관련 한국어 도서 후보를 계속 찾는 YES24 검색 허브.",
  },
  {
    id: "aladin-llm-books",
    title: "Aladin LLM Book Search",
    publisher: "Aladin",
    kind: "publisher",
    url: "https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=Book&SearchWord=LLM",
    lastChecked: SNAPSHOT_DATE,
    note: "LLM, 생성형 AI, 프롬프트 엔지니어링 관련 한국어 도서 후보를 찾는 알라딘 검색 허브.",
  },
  {
    id: "kyobo-llm-books",
    title: "Kyobo LLM Book Search",
    publisher: "Kyobo Book Centre",
    kind: "publisher",
    url: "https://search.kyobobook.co.kr/search?keyword=LLM&target=total&gbCode=TOT",
    lastChecked: SNAPSHOT_DATE,
    note: "LLM과 생성형 AI 관련 국내 도서 후보를 찾는 교보문고 검색 허브.",
  },
  {
    id: "gilbut-llm-books",
    title: "Gilbut LLM Book Search",
    publisher: "Gilbut",
    kind: "publisher",
    url: "https://www.gilbut.co.kr/search?keyword=LLM",
    lastChecked: SNAPSHOT_DATE,
    note: "길벗 출판사의 LLM, AI 개발, 데이터/자동화 도서 후보를 찾는 검색 링크.",
  },
  {
    id: "wikibook-llm-books",
    title: "Wikibook LLM Book Search",
    publisher: "Wikibook",
    kind: "publisher",
    url: "https://wikibook.co.kr/?s=LLM",
    lastChecked: SNAPSHOT_DATE,
    note: "위키북스의 LLM, 생성형 AI, 개발 실무 도서 후보를 찾는 검색 링크.",
  },
  {
    id: "hanbit-llm-books",
    title: "Hanbit LLM Book Search",
    publisher: "Hanbit Media",
    kind: "publisher",
    url: "https://www.hanbit.co.kr/search/search_list.html?keyword=LLM",
    lastChecked: SNAPSHOT_DATE,
    note: "한빛미디어의 LLM, 생성형 AI, 데이터/개발 실무 신간 후보를 찾는 검색 링크.",
  },
  {
    id: "jpub-llm-books",
    title: "JPub LLM Book Search",
    publisher: "JPub",
    kind: "publisher",
    url: "https://jpub.tistory.com/search/LLM",
    lastChecked: SNAPSHOT_DATE,
    note: "제이펍의 LLM, AI, 데이터/개발 도서와 신간 후보를 찾는 검색 링크.",
  },
  {
    id: "acornpub-llm-books",
    title: "Acorn Publishing LLM Search",
    publisher: "Acorn Publishing",
    kind: "publisher",
    url: "https://www.acornpub.co.kr/search?keyword=LLM",
    lastChecked: SNAPSHOT_DATE,
    note: "에이콘출판사의 LLM, 생성형 AI, 개발/데이터 도서 후보를 찾는 검색 링크.",
  },
  {
    id: "packt-llm-agent-books",
    title: "Packt LLM Agents Search",
    publisher: "Packt",
    kind: "publisher",
    url: "https://www.packtpub.com/search?query=LLM%20agents",
    lastChecked: SNAPSHOT_DATE,
    note: "LLM agents, AI coding, LangChain/LangGraph 등 해외 실무 도서 후보를 찾는 Packt 검색 허브.",
  },
  {
    id: "wikidocs",
    title: "WikiDocs",
    publisher: "WikiDocs",
    kind: "community",
    url: "https://wikidocs.net/",
    lastChecked: SNAPSHOT_DATE,
    note: "한국어 개발/데이터/AI 전자책과 무료 튜토리얼을 찾을 수 있는 커뮤니티 문서 허브.",
  },
  {
    id: "ap-g7-ai-sovereignty",
    title:
      "AI executives gather at G7 as Europeans seek checks on American dominance",
    publisher: "Associated Press",
    kind: "publisher",
    url: "https://apnews.com/article/7d783c6de4356962e338b8b8563d48ea",
    lastChecked: SNAPSHOT_DATE,
    note: "G7 AI 논의, 기술 주권, Mistral/Cohere 등 비미국 AI 생태계 논의의 최신 뉴스 출처.",
  },
  {
    id: "axios-anthropic-oversight",
    title: "Anthropic-U.S. battle highlights AI power struggle",
    publisher: "Axios",
    kind: "publisher",
    url: "https://www.axios.com/2026/06/17/anthropic-fable-mythos-ai-model-government-oversight",
    lastChecked: SNAPSHOT_DATE,
    note: "Anthropic Fable/Mythos 접근 제한 논란과 AI 모델 거버넌스 논쟁의 최신 뉴스 출처.",
  },
];

export const modelProfiles: ModelProfile[] = [
  {
    id: "gpt-55",
    providerId: "openai",
    providerName: "OpenAI",
    productName: "GPT / ChatGPT / API",
    modelName: "GPT-5.5",
    modelId: "gpt-5.5",
    status: "일반 제공",
    lastUpdate: "2026-04-23",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "복잡한 전문 업무, 코딩, 장문 컨텍스트를 위한 OpenAI 최신 프런티어 모델.",
    summary:
      "GPT-5.5는 텍스트·이미지 입력과 텍스트 출력을 지원하며 Responses API에서 웹 검색, 파일 검색, 코드 인터프리터, 컴퓨터 사용, MCP 등 폭넓은 도구를 붙일 수 있다.",
    strengths: [
      "전문 업무 추론",
      "코딩과 리포지토리 작업",
      "1M급 장문 컨텍스트",
      "도구 생태계",
    ],
    caveats: [
      "오디오·비디오 직접 입출력은 전용 모델을 사용",
      "긴 입력은 별도 고가 과금 규칙 확인 필요",
    ],
    bestFor: [
      "복잡한 분석 보고서",
      "코드 리뷰·수정",
      "에이전트 워크플로",
      "도구 호출 기반 리서치",
    ],
    specs: [
      { label: "컨텍스트", value: "1,050,000 tokens", tone: "good" },
      { label: "최대 출력", value: "128,000 tokens", tone: "good" },
      { label: "입력/출력", value: "Text+Image / Text" },
      { label: "가격", value: "$5 input · $30 output / 1M tokens" },
      { label: "지식 기준", value: "2025-12-01" },
    ],
    aliases: ["GPT", "ChatGPT", "OpenAI", "지피티", "챗지피티"],
    sourceIds: ["openai-gpt55", "openai-models"],
    accent: "green",
  },
  {
    id: "claude-fable-5",
    providerId: "anthropic",
    providerName: "Anthropic",
    productName: "Claude",
    modelName: "Claude Fable 5",
    modelId: "claude-fable-5",
    status: "일반 제공",
    lastUpdate: "2026-06-09",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "장기 자율 작업과 고난도 추론에 맞춘 Anthropic의 최신 광범위 공개 모델.",
    summary:
      "Claude Fable 5는 Mythos 5와 같은 계열의 고성능 모델이지만, 일반 제공 모델에는 안전 분류기와 refusal/fallback 처리 흐름이 포함된다.",
    strengths: [
      "장기 에이전트 작업",
      "복잡한 추론",
      "Claude 생태계",
      "fallback 설계",
    ],
    caveats: [
      "거절 응답은 HTTP 200의 stop_reason으로 처리",
      "Mythos 5는 승인 고객 대상 제한 제공",
    ],
    bestFor: [
      "고자율 업무 에이전트",
      "긴 문서 분석",
      "정책 민감 업무",
      "워크플로 안정성 설계",
    ],
    specs: [
      { label: "컨텍스트", value: "1M tokens", tone: "good" },
      { label: "최대 출력", value: "128K tokens", tone: "good" },
      { label: "가격", value: "$10 input · $50 output / 1M tokens" },
      { label: "사고 방식", value: "Adaptive thinking always on" },
      {
        label: "제공",
        value: "Claude API, AWS, Bedrock, Vertex AI, Microsoft Foundry",
      },
    ],
    aliases: ["Claude", "클로드", "Anthropic", "Fable", "Mythos"],
    sourceIds: ["anthropic-fable5", "anthropic-models"],
    accent: "blue",
  },
  {
    id: "gemini-31-pro",
    providerId: "google",
    providerName: "Google",
    productName: "Gemini",
    modelName: "Gemini 3.1 Pro Preview",
    modelId: "gemini-3.1-pro-preview",
    status: "프리뷰",
    lastUpdate: "2026-04-28",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "멀티모달 입력과 도구 사용, 에이전트형 코딩 워크플로에 초점을 둔 Gemini 3 Pro 계열 프리뷰.",
    summary:
      "Gemini 3.1 Pro Preview는 텍스트, 이미지, 비디오, 오디오, PDF 입력을 받으며 검색 grounding, 코드 실행, URL context, 구조화 출력, 함수 호출을 지원한다.",
    strengths: [
      "멀티모달 입력 범위",
      "Google Search grounding",
      "PDF·비디오·오디오 입력",
      "토큰 효율 개선",
    ],
    caveats: [
      "프리뷰 모델이라 품질 변동 가능",
      "Live API와 이미지 생성은 이 모델에서 직접 지원하지 않음",
    ],
    bestFor: [
      "문서·영상 기반 분석",
      "검색 grounding 답변",
      "에이전트 코딩",
      "멀티모달 리서치",
    ],
    specs: [
      { label: "컨텍스트", value: "1,048,576 tokens", tone: "good" },
      { label: "최대 출력", value: "65,536 tokens" },
      { label: "입력", value: "Text, Image, Video, Audio, PDF", tone: "good" },
      {
        label: "도구",
        value: "Code execution, Search, URL context, Function calling",
      },
      { label: "지식 기준", value: "2025-01" },
    ],
    aliases: ["Gemini", "제미나이", "재미나이", "Google AI", "Gemini Pro"],
    sourceIds: ["google-gemini31", "google-models"],
    accent: "amber",
  },
  {
    id: "grok-43",
    providerId: "xai",
    providerName: "xAI",
    productName: "Grok",
    modelName: "Grok 4.3",
    modelId: "grok-4.3",
    status: "일반 제공",
    lastUpdate: "2026-05-29",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "xAI의 최신 플래그십 모델로, 도구 호출·지시 따르기·낮은 환각률을 전면에 둔다.",
    summary:
      "Grok 4.3은 텍스트와 이미지 입력, 텍스트 출력을 제공하며 함수 호출, 구조화 출력, configurable reasoning을 지원한다. 실시간 정보는 검색 도구를 켜야 한다.",
    strengths: [
      "빠른 출력 속도",
      "저렴한 토큰 가격",
      "X Search 연계",
      "구조화 출력",
    ],
    caveats: [
      "검색 도구 없이는 최신 사건 접근 불가",
      "일부 레거시 alias가 최신 모델로 이어질 수 있어 고정 버전 확인 필요",
    ],
    bestFor: [
      "실시간 웹/X 리서치",
      "저비용 고속 요약",
      "구조화 데이터 추출",
      "이미지 포함 질의",
    ],
    specs: [
      { label: "컨텍스트", value: "1,000,000 tokens", tone: "good" },
      { label: "입력/출력", value: "Text+Image / Text" },
      {
        label: "가격",
        value: "$1.25 input · $2.50 output / 1M tokens",
        tone: "good",
      },
      { label: "추론", value: "none, low, medium, high" },
      { label: "별칭", value: "grok-4.3-latest, grok-latest" },
    ],
    aliases: ["Grok", "그록", "xAI", "X Search"],
    sourceIds: ["xai-grok43", "xai-models"],
    accent: "coral",
  },
  {
    id: "manus-api-v2",
    providerId: "manus",
    providerName: "Manus",
    productName: "Manus",
    modelName: "Manus API v2",
    modelId: "api.manus.ai",
    status: "서비스/API",
    lastUpdate: "2026-06-17",
    verifiedAt: SNAPSHOT_DATE,
    oneLine: "모델명보다 태스크 중심 API가 핵심인 자율 에이전트 서비스.",
    summary:
      "Manus는 웹 앱, 브라우저 오퍼레이터, 슬라이드·웹사이트·디자인 생성, v2 API를 통해 AI agent task를 만들고 관리하는 서비스로 포지셔닝한다.",
    strengths: [
      "태스크 기반 에이전트",
      "프로젝트 공유 지시",
      "파일 첨부",
      "웹훅·스킬·커스텀 에이전트",
    ],
    caveats: [
      "기저 LLM 스펙은 모델 API처럼 공개되어 있지 않음",
      "LLM 비교표에서는 모델보다 에이전트 플랫폼으로 분리해 보는 것이 정확",
    ],
    bestFor: [
      "반복 업무 자동화",
      "문서·파일 기반 작업",
      "웹 조작형 태스크",
      "비개발자용 에이전트 실행",
    ],
    specs: [
      { label: "API", value: "v2 latest" },
      { label: "Base URL", value: "https://api.manus.ai" },
      {
        label: "핵심 객체",
        value: "Tasks, Projects, Files, Webhooks, Skills, Agents",
      },
      { label: "제품", value: "Web app, Desktop app, Browser operator" },
      { label: "소속", value: "Meta 편입 안내 표시" },
    ],
    aliases: ["Manus", "마누스", "Butterfly Effect", "Meta", "AI agent"],
    sourceIds: ["manus-home", "manus-api"],
    accent: "ink",
  },
  {
    id: "kimi-k27-code",
    providerId: "kimi",
    providerName: "Moonshot AI",
    productName: "Kimi / Moonshot API",
    modelName: "Kimi K2.7 Code",
    modelId: "kimi-k2.7-code",
    status: "일반 제공",
    lastUpdate: "2026-06-18",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "장문 코딩, 에이전트, 멀티모달 도구 사용에 초점을 둔 Kimi 최신 코딩 모델.",
    summary:
      "Kimi K2.7 Code는 Kimi의 강한 코딩 모델로 문서화되어 있으며 K2.7 Code HighSpeed는 같은 모델의 고속 변형이다. OpenAI SDK/API 형식을 그대로 쓰는 base URL 연동이 가능하고, 이미지·비디오 입력과 도구 호출 예제가 제공된다.",
    strengths: [
      "장문 코딩 작업",
      "멀티스텝 도구 호출",
      "비디오/이미지 입력",
      "OpenAI SDK 호환",
    ],
    caveats: [
      "K2.7 Code는 non-thinking mode 비활성화를 지원하지 않음",
      "tool_choice는 auto/none 중심으로 제한",
      "공식 가격표의 상세 숫자는 모델별 페이지에서 별도 확인 필요",
    ],
    bestFor: [
      "장시간 코딩 에이전트",
      "비디오/이미지 포함 코드 분석",
      "Claude Code/Roo Code류 도구 연결",
      "OpenAI 호환 API 교체 실험",
    ],
    specs: [
      { label: "컨텍스트", value: "256K tokens", tone: "good" },
      { label: "기본 최대 출력", value: "32K tokens" },
      { label: "입력", value: "Text, Image, Video", tone: "good" },
      {
        label: "고속 변형",
        value: "HighSpeed 약 180 tok/s, 짧은 문맥 최대 260 tok/s",
      },
      { label: "Base URL", value: "https://api.moonshot.ai/v1" },
    ],
    aliases: ["Kimi", "키미", "Moonshot", "문샷", "kimi-k2.7-code", "K2.7"],
    sourceIds: ["kimi-models", "kimi-k27-code", "aws-bedrock-ko"],
    accent: "coral",
  },
  {
    id: "deepseek-v4-flash",
    providerId: "deepseek",
    providerName: "DeepSeek",
    productName: "DeepSeek API",
    modelName: "DeepSeek V4 Flash",
    modelId: "deepseek-v4-flash",
    status: "일반 제공",
    lastUpdate: "2026-04-24",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "1M 컨텍스트와 384K 출력 한도를 제공하는 저비용 OpenAI/Anthropic 호환 모델.",
    summary:
      "DeepSeek V4 Flash는 OpenAI Chat Completions 형식과 Anthropic 형식의 base URL을 모두 제공하며, thinking/non-thinking 모드, JSON 출력, tool calls, prefix completion, non-thinking FIM을 지원한다.",
    strengths: [
      "1M 컨텍스트",
      "384K 최대 출력",
      "매우 낮은 공식 토큰 단가",
      "OpenAI/Anthropic 형식 호환",
    ],
    caveats: [
      "deepseek-chat/deepseek-reasoner 레거시 이름은 2026-07-24 15:59 UTC 지원 중단 예정",
      "FIM은 non-thinking mode에서만 사용",
      "가격은 DeepSeek 잔액 차감 정책과 캐시 hit/miss를 함께 봐야 함",
    ],
    bestFor: [
      "대량 요약/분류",
      "저비용 장문 처리",
      "OpenAI 호환 API 대체",
      "캐시 기반 반복 워크로드",
    ],
    specs: [
      { label: "컨텍스트", value: "1M tokens", tone: "good" },
      { label: "최대 출력", value: "384K tokens", tone: "good" },
      {
        label: "가격",
        value: "$0.14 input miss · $0.28 output / 1M",
        tone: "good",
      },
      { label: "캐시 hit 입력", value: "$0.0028 / 1M tokens" },
      { label: "호환 API", value: "OpenAI + Anthropic format" },
    ],
    aliases: [
      "DeepSeek",
      "딥시크",
      "deepseek-v4-flash",
      "deepseek-chat",
      "deepseek-reasoner",
    ],
    sourceIds: ["deepseek-pricing", "deepseek-updates", "aws-bedrock-ko"],
    accent: "blue",
  },
  {
    id: "qwen3-2507",
    providerId: "qwen",
    providerName: "Alibaba Qwen",
    productName: "Qwen",
    modelName: "Qwen3-2507",
    modelId: "qwen3-2507",
    status: "서비스/API",
    lastUpdate: "2026-06-18",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "오픈웨이트·멀티링구얼·로컬 실행 생태계가 강한 Alibaba Qwen 최신 문서 기준 모델군.",
    summary:
      "Qwen3-2507은 Instruct-only와 Thinking-only 모델을 다시 분리해 제공한다고 문서화되어 있으며, 256K 장문 이해와 1M 확장 가능성을 전면에 둔다. Qwen3 문서는 100개 이상 언어/방언, 도구 사용, 에이전트, 로컬 실행/배포 프레임워크를 함께 안내한다.",
    strengths: [
      "오픈웨이트 생태계",
      "100개 이상 언어/방언",
      "로컬 실행/배포 문서",
      "도구 사용·에이전트",
    ],
    caveats: [
      "서비스별 API 가격과 모델 배포명은 플랫폼마다 다를 수 있음",
      "모델 크기와 양자화 방식에 따라 품질·속도 편차가 큼",
    ],
    bestFor: [
      "온프레미스/로컬 LLM 실험",
      "한국어 포함 다국어 워크로드",
      "오픈웨이트 비교 평가",
      "vLLM/SGLang/Ollama 배포 검토",
    ],
    specs: [
      { label: "컨텍스트", value: "256K, 1M 확장 가능", tone: "good" },
      { label: "모델군", value: "Dense/MoE 0.6B~235B" },
      { label: "언어", value: "100+ languages/dialects", tone: "good" },
      { label: "실행", value: "Transformers, llama.cpp, Ollama, LM Studio" },
      { label: "배포", value: "SGLang, vLLM, TGI, dstack, SkyPilot" },
    ],
    aliases: ["Qwen", "큐원", "쿠엔", "Alibaba", "Qwen3", "Qwen3-2507"],
    sourceIds: ["qwen-docs", "google-cloud-vertex-ko"],
    accent: "amber",
  },
  {
    id: "mistral-medium-35",
    providerId: "mistral",
    providerName: "Mistral AI",
    productName: "Mistral",
    modelName: "Mistral Medium 3.5",
    modelId: "mistral-medium-3-5",
    status: "일반 제공",
    lastUpdate: "2026-04-28",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "에이전트와 코딩에 최적화된 256K 컨텍스트의 오픈웨이트 멀티모달 모델.",
    summary:
      "Mistral Medium 3.5는 Modified MIT 라이선스 오픈웨이트로 공개된 frontier-class 멀티모달 모델이다. Chat Completions, function calling, agents/conversations, built-in tools, structured outputs, OCR, document QnA, FIM 등 폭넓은 기능이 모델 카드에 문서화되어 있다.",
    strengths: [
      "오픈웨이트",
      "코딩/에이전트 최적화",
      "문서/OCR 기능",
      "명확한 공식 단가",
    ],
    caveats: [
      "라이선스는 Modified MIT 조건을 별도 검토",
      "클라우드 API와 자체 배포의 비용/운영 책임이 다름",
    ],
    bestFor: [
      "유럽/오픈웨이트 전략",
      "문서 QnA",
      "에이전트 코딩",
      "자체 호스팅 후보 평가",
    ],
    specs: [
      { label: "컨텍스트", value: "256K tokens", tone: "good" },
      { label: "가격", value: "$1.5 input · $7.5 output / 1M" },
      { label: "라이선스", value: "Open weights, Modified MIT" },
      { label: "기능", value: "Tools, Agents, OCR, Structured Outputs, FIM" },
      { label: "출시", value: "2026-04-28" },
    ],
    aliases: ["Mistral", "미스트랄", "Mistral Medium", "Mistral AI"],
    sourceIds: [
      "mistral-models",
      "mistral-medium-35",
      "google-cloud-vertex-ko",
    ],
    accent: "green",
  },
  {
    id: "ministral-3-14b",
    providerId: "mistral",
    providerName: "Mistral AI",
    productName: "Ministral",
    modelName: "Ministral 3 14B",
    modelId: "ministral-14b-2512",
    status: "일반 제공",
    lastUpdate: "2025-12-02",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "로컬 배포와 경량 오픈웨이트 전략에 맞춘 Mistral의 Ministral 3 계열 14B 모델.",
    summary:
      "Ministral 3 14B는 Ministral 3 패밀리의 큰 축으로, 로컬 환경을 포함한 다양한 하드웨어에서 고성능 실행을 목표로 한다. 256K 컨텍스트와 입력/출력 동일 공식 단가가 모델 카드에 공개되어 있다.",
    strengths: [
      "로컬 배포 후보",
      "저렴한 공식 단가",
      "256K 컨텍스트",
      "오픈웨이트 계열",
    ],
    caveats: [
      "소형 모델이라 초대형 프런티어 모델과 직접 품질 비교는 분리 필요",
      "자체 배포 시 GPU/서빙 비용과 모델 카드 단가를 따로 계산해야 함",
    ],
    bestFor: [
      "온디바이스/온프레미스 검토",
      "저비용 사내 챗봇",
      "경량 문서 QnA",
      "오픈웨이트 평가 기준선",
    ],
    specs: [
      { label: "컨텍스트", value: "256K tokens", tone: "good" },
      { label: "가격", value: "$0.2 input · $0.2 output / 1M", tone: "good" },
      { label: "출시", value: "2025-12-02" },
      { label: "최적화", value: "Local deployment" },
      { label: "계열", value: "Ministral 3 14B/8B/3B" },
    ],
    aliases: ["Ministral", "미니스트랄", "ministrai", "Mistral local", "14B"],
    sourceIds: ["mistral-models", "mistral-ministral-3-14b"],
    accent: "ink",
  },
  {
    id: "cursor-ai-ide",
    providerId: "cursor",
    providerName: "Cursor",
    productName: "Cursor AI IDE",
    modelName: "Cursor AI IDE / Agents",
    modelId: "cursor",
    status: "서비스/IDE",
    lastUpdate: "2026-06-17",
    verifiedAt: SNAPSHOT_DATE,
    oneLine:
      "기저 모델보다 개발 환경, Agent, Tab, Cloud agents, Bugbot, CLI가 핵심인 AI 코딩 IDE.",
    summary:
      "Cursor는 모델 API가 아니라 VS Code 계열 개발 경험 위에 Agent, Tab 완성, MCP/skills/hooks, Cloud agents, Bugbot 리뷰, CLI와 팀 관리 기능을 얹은 AI IDE다. 바이브 코딩 비교에서는 GPT/Claude/Gemini 같은 기저 LLM과 별도 축으로 보되, 실제 개발 생산성 평가에는 함께 넣는 것이 정확하다.",
    strengths: [
      "IDE 안에서 repo 맥락 활용",
      "Agent와 Tab 자동완성",
      "Cloud agents와 병렬 작업",
      "Bugbot/보안 리뷰",
    ],
    caveats: [
      "기저 모델 품질과 Cursor 실행 표면 품질을 분리 평가해야 함",
      "팀/엔터프라이즈 사용은 repo, model, MCP 접근 제어와 privacy mode를 함께 검토",
    ],
    bestFor: [
      "프론트엔드/풀스택 구현",
      "장시간 바이브 코딩",
      "PR 리뷰와 버그 탐지",
      "학생/팀 개발 학습",
    ],
    specs: [
      { label: "무료 플랜", value: "Hobby, 제한 Agent/Tab" },
      { label: "Pro", value: "$20 / mo", tone: "good" },
      { label: "Teams", value: "$40 / user / mo" },
      { label: "학생", value: "eligible students 1년 Pro 무료" },
      { label: "핵심 기능", value: "Agents, CLI, Cloud, Bugbot, MCP" },
    ],
    aliases: ["Cursor", "커서", "Anysphere", "AI IDE", "Composer", "Bugbot"],
    sourceIds: [
      "cursor-docs",
      "cursor-pricing",
      "cursor-changelog",
      "cursor-students",
    ],
    accent: "ink",
  },
];

export const modelCostProfiles: ModelCostProfile[] = [
  {
    id: "cost-gpt-55",
    providerId: "openai",
    modelName: "GPT-5.5",
    inputUsdPer1M: 5,
    outputUsdPer1M: 30,
    pricingBasis: "공식 문서",
    notes: "OpenAI GPT-5.5 문서의 1M 토큰당 입력/출력 가격 기준.",
    sourceIds: ["openai-gpt55"],
  },
  {
    id: "cost-claude-fable-5",
    providerId: "anthropic",
    modelName: "Claude Fable 5",
    inputUsdPer1M: 10,
    outputUsdPer1M: 50,
    pricingBasis: "공식 문서",
    notes: "Anthropic Fable 5 소개 문서의 1M 토큰당 입력/출력 가격 기준.",
    sourceIds: ["anthropic-fable5"],
  },
  {
    id: "cost-gemini-31-pro",
    providerId: "google",
    modelName: "Gemini 3.1 Pro Preview",
    inputUsdPer1M: 1.74,
    outputUsdPer1M: 1.74,
    pricingBasis: "벤치마크 환산",
    notes:
      "Artificial Analysis blended price를 입력/출력 동일 단가로 단순 환산한 비교용 값.",
    sourceIds: ["aa-leaderboard", "google-gemini31"],
  },
  {
    id: "cost-gemini-35-flash",
    providerId: "google",
    modelName: "Gemini 3.5 Flash",
    inputUsdPer1M: 1.31,
    outputUsdPer1M: 1.31,
    pricingBasis: "벤치마크 환산",
    notes: "Artificial Analysis blended price 기반의 저비용 Gemini 후보.",
    sourceIds: ["aa-leaderboard", "google-models"],
  },
  {
    id: "cost-grok-43",
    providerId: "xai",
    modelName: "Grok 4.3",
    inputUsdPer1M: 1.25,
    outputUsdPer1M: 2.5,
    pricingBasis: "공식 문서",
    notes: "xAI Grok 4.3 문서의 1M 토큰당 입력/출력 가격 기준.",
    sourceIds: ["xai-grok43"],
  },
  {
    id: "cost-deepseek-v4-flash",
    providerId: "deepseek",
    modelName: "DeepSeek V4 Flash",
    inputUsdPer1M: 0.14,
    outputUsdPer1M: 0.28,
    pricingBasis: "공식 문서",
    notes:
      "DeepSeek 공식 cache miss 입력 단가 기준. cache hit 입력은 $0.0028/1M으로 별도 최적화 여지가 큽니다.",
    sourceIds: ["deepseek-pricing"],
  },
  {
    id: "cost-deepseek-v4-pro",
    providerId: "deepseek",
    modelName: "DeepSeek V4 Pro",
    inputUsdPer1M: 0.435,
    outputUsdPer1M: 0.87,
    pricingBasis: "공식 문서",
    notes:
      "DeepSeek 공식 cache miss 입력 단가 기준. cache hit 입력은 $0.003625/1M으로 문서화되어 있습니다.",
    sourceIds: ["deepseek-pricing"],
  },
  {
    id: "cost-mistral-medium-35",
    providerId: "mistral",
    modelName: "Mistral Medium 3.5",
    inputUsdPer1M: 1.5,
    outputUsdPer1M: 7.5,
    pricingBasis: "공식 문서",
    notes: "Mistral Medium 3.5 모델 카드의 1M 토큰당 입력/출력 가격 기준.",
    sourceIds: ["mistral-medium-35"],
  },
  {
    id: "cost-mistral-small-4",
    providerId: "mistral",
    modelName: "Mistral Small 4",
    inputUsdPer1M: 0.15,
    outputUsdPer1M: 0.6,
    pricingBasis: "공식 문서",
    notes: "Mistral Small 4 모델 카드의 1M 토큰당 입력/출력 가격 기준.",
    sourceIds: ["mistral-small-4"],
  },
  {
    id: "cost-ministral-3-14b",
    providerId: "mistral",
    modelName: "Ministral 3 14B",
    inputUsdPer1M: 0.2,
    outputUsdPer1M: 0.2,
    pricingBasis: "공식 문서",
    notes:
      "Ministral 3 14B 모델 카드의 1M 토큰당 입력/출력 가격 기준. 자체 배포 비용은 별도 계산이 필요합니다.",
    sourceIds: ["mistral-ministral-3-14b"],
  },
];

export const updates: UpdateItem[] = [
  {
    id: "update-openai-gpt55",
    providerId: "openai",
    category: "updates",
    title: "OpenAI GPT-5.5가 최신 프런티어 모델로 문서화됨",
    date: "2026-04-23",
    summary:
      "1M급 컨텍스트, 128K 출력, xhigh reasoning, 웹 검색·파일 검색·컴퓨터 사용·MCP 등 도구 지원을 전면에 둔다.",
    impact:
      "복잡한 코딩/전문 업무 포털에서는 GPT-5.5를 기본 비교 축으로 삼고, 비용 민감 작업은 GPT-5.4 mini/nano로 내려가는 전략이 적합하다.",
    tags: ["모델 업데이트", "도구 호출", "코딩"],
    sourceIds: ["openai-gpt55"],
  },
  {
    id: "update-anthropic-fable",
    providerId: "anthropic",
    category: "updates",
    title: "Claude Fable 5 일반 제공, Mythos 5는 제한 제공",
    date: "2026-06-09",
    summary:
      "Fable 5는 광범위 공개 모델, Mythos 5는 Project Glasswing 승인 고객 대상이다. Fable 5는 refusal/fallback 처리를 통합해야 한다.",
    impact:
      "업무 자동화에서 Claude를 붙일 때는 거절 응답과 fallback credit 흐름을 앱 설계에 반영해야 한다.",
    tags: ["모델 업데이트", "안전", "에이전트"],
    sourceIds: ["anthropic-fable5"],
  },
  {
    id: "update-google-gemini31",
    providerId: "google",
    category: "updates",
    title: "Gemini 3.1 Pro Preview, 에이전트형 도구 사용과 grounding 강화",
    date: "2026-04-28",
    summary:
      "텍스트·이미지·비디오·오디오·PDF 입력과 검색 grounding, 코드 실행, URL context, 구조화 출력을 지원한다.",
    impact:
      "멀티모달 자료 분석과 Google 검색 기반 답변이 중요한 한국어 리서치 워크플로에서 강점이 크다.",
    tags: ["멀티모달", "검색 grounding", "프리뷰"],
    sourceIds: ["google-gemini31"],
  },
  {
    id: "update-xai-grok43",
    providerId: "xai",
    category: "updates",
    title: "Grok 4.3, 1M 컨텍스트와 저렴한 토큰 가격으로 문서화",
    date: "2026-05-29",
    summary:
      "텍스트·이미지 입력, 함수 호출, 구조화 출력, configurable reasoning을 제공하며 X Search/Web Search 도구로 최신성을 보강한다.",
    impact:
      "실시간 이슈 요약이나 X 기반 여론 탐색은 Grok을 별도 후보로 비교할 가치가 있다.",
    tags: ["실시간 검색", "저비용", "구조화 출력"],
    sourceIds: ["xai-grok43", "xai-models"],
  },
  {
    id: "update-manus-api",
    providerId: "manus",
    category: "updates",
    title: "Manus API v2가 최신 API로 안내됨",
    date: "2026-06-17",
    summary:
      "Manus API v2는 태스크 생성, 후속 메시지, 결과 조회, 프로젝트 지시, 파일, 웹훅, 스킬, 에이전트를 제공한다.",
    impact:
      "마누스는 단일 LLM 모델 비교보다 “에이전트 실행 플랫폼” 카테고리로 비교하는 것이 정확하다.",
    tags: ["에이전트", "API", "자동화"],
    sourceIds: ["manus-home", "manus-api"],
  },
  {
    id: "update-kimi-k27-code",
    providerId: "kimi",
    category: "updates",
    title:
      "Kimi K2.7 Code와 HighSpeed 모델이 공식 문서에 최신 코딩 모델로 안내됨",
    date: "2026-06-18",
    summary:
      "K2.7 Code는 256K 컨텍스트, 강한 코딩/에이전트 성능, 이미지·비디오 입력, OpenAI SDK 호환을 제공하며 HighSpeed 변형은 고속 출력에 초점을 둔다.",
    impact:
      "코딩 에이전트와 멀티모달 코드 분석을 비교할 때 Kimi를 GPT/Claude/Mistral과 별도 후보로 평가할 수 있다.",
    tags: ["코딩", "에이전트", "멀티모달", "OpenAI 호환"],
    sourceIds: ["kimi-models", "kimi-k27-code"],
  },
  {
    id: "update-deepseek-v4",
    providerId: "deepseek",
    category: "updates",
    title:
      "DeepSeek V4 Flash/Pro, 1M 컨텍스트와 OpenAI/Anthropic 호환 API 제공",
    date: "2026-04-24",
    summary:
      "DeepSeek V4는 V4 Flash와 V4 Pro로 제공되며 thinking/non-thinking, JSON output, tool calls, 384K 최대 출력, 캐시 hit/miss 가격 체계를 문서화했다.",
    impact:
      "대량 장문 처리와 저비용 API 대체를 검토하는 팀은 DeepSeek V4 Flash를 비용 계산기에 넣고 캐시 hit 전략을 함께 봐야 한다.",
    tags: ["저비용", "1M 컨텍스트", "API 호환", "캐시"],
    sourceIds: ["deepseek-pricing", "deepseek-updates"],
  },
  {
    id: "update-qwen3-2507",
    providerId: "qwen",
    category: "updates",
    title: "Qwen3-2507, Instruct-only와 Thinking-only 라인으로 문서화",
    date: "2026-06-18",
    summary:
      "Qwen3-2507은 256K 장문 이해와 1M 확장 가능성을 내세우며, Qwen3 문서는 100개 이상 언어/방언과 로컬 실행·배포 프레임워크를 함께 안내한다.",
    impact:
      "오픈웨이트와 자체 호스팅을 중시하는 한국어 서비스는 Qwen을 vLLM/SGLang/Ollama 기준으로 별도 평가해야 한다.",
    tags: ["오픈웨이트", "로컬 실행", "다국어", "장문"],
    sourceIds: ["qwen-docs"],
  },
  {
    id: "update-mistral-medium-35",
    providerId: "mistral",
    category: "updates",
    title: "Mistral Medium 3.5, 오픈웨이트 멀티모달 코딩/에이전트 모델로 공개",
    date: "2026-04-28",
    summary:
      "Mistral Medium 3.5는 256K 컨텍스트, Modified MIT 오픈웨이트, function calling, agents/conversations, OCR, structured outputs, FIM을 모델 카드에 공개했다.",
    impact:
      "유럽/오픈웨이트/자체 배포 전략을 고려하는 팀은 Mistral Medium 3.5와 Small 4, Ministral 3를 같은 Mistral 축에서 비교할 수 있다.",
    tags: ["오픈웨이트", "코딩", "에이전트", "OCR"],
    sourceIds: ["mistral-medium-35", "mistral-models"],
  },
  {
    id: "update-ministral-3",
    providerId: "mistral",
    category: "updates",
    title: "Ministral 3 14B, 로컬 배포용 256K 경량 모델 후보로 정리",
    date: "2025-12-02",
    summary:
      "Ministral 3 14B는 로컬 배포 최적화와 256K 컨텍스트를 내세우며 입력/출력 각각 $0.2/1M 토큰 단가를 모델 카드에 공개했다.",
    impact:
      "사내 챗봇, 보안 민감 문서 QnA, 온프레미스 배포 후보를 고를 때 초대형 모델과 별도 카테고리로 비교해야 한다.",
    tags: ["Ministral", "로컬 배포", "저비용", "오픈웨이트"],
    sourceIds: ["mistral-ministral-3-14b", "mistral-models"],
  },
  {
    id: "update-g7-ai-sovereignty",
    providerId: "market",
    category: "news",
    title: "G7 AI 논의에서 기술 주권과 오픈웨이트 대안 수요가 부각",
    date: "2026-06-18",
    summary:
      "AP와 Axios 보도 기준, G7 AI 논의와 Anthropic 모델 접근 제한 논란은 미국 폐쇄형 모델 의존과 각국 AI 주권 논쟁을 다시 끌어올렸다.",
    impact:
      "모델 비교는 단순 성능표를 넘어 배포 통제권, 자체 호스팅 가능성, 지역 규제 리스크까지 포함해야 한다.",
    tags: ["AI 뉴스", "AI 주권", "규제", "오픈웨이트"],
    sourceIds: ["ap-g7-ai-sovereignty", "axios-anthropic-oversight"],
  },
  {
    id: "update-community-korean-ai-learning",
    providerId: "market",
    category: "news",
    title: "한국어 AI 학습 자료는 공식 문서와 커뮤니티 채널을 함께 봐야 함",
    date: "2026-06-18",
    summary:
      "Claude/Gemini/Azure OpenAI/AWS Bedrock은 한국어 공식 문서가 있고, 테디노트·조코딩·Google Developers Korea·AWS Korea·Microsoft Developer Korea 같은 채널은 실습/세션 추적에 유용하다.",
    impact:
      "한국어 사용자용 포털은 공식 문서, 유튜브 채널, 블로그, 도서 검색 허브를 언어와 형식으로 필터링해야 탐색 비용이 줄어든다.",
    tags: ["한국어 자료", "커뮤니티", "유튜브", "블로그"],
    sourceIds: [
      "anthropic-docs-ko",
      "google-gemini-docs-ko",
      "azure-openai-ko",
      "aws-bedrock-ko",
      "youtube-teddynote",
      "youtube-jocoding",
      "youtube-hermes-agent-video",
      "youtube-vibe-coding-search",
      "youtube-codefactory-search",
      "youtube-dev-dongsaeng-search",
      "youtube-google-developers-korea",
    ],
  },
  {
    id: "update-cursor-comparison",
    providerId: "cursor",
    category: "vibe",
    title: "Cursor를 AI 바이브 코딩 비교군에 추가",
    date: SNAPSHOT_DATE,
    summary:
      "Cursor는 Hobby 무료, Pro/Teams 플랜, Agent/Tab, MCP·skills·hooks, Cloud agents, Bugbot, CLI와 학생 Pro 혜택을 갖춘 AI IDE라 모델 표면과 별도 비교가 필요하다.",
    impact:
      "실제 코딩 생산성 비교에서는 GPT/Claude/Gemini 같은 기저 모델뿐 아니라 Cursor처럼 repo와 IDE를 직접 다루는 실행 표면을 함께 필터링해야 한다.",
    tags: ["Cursor", "AI IDE", "바이브 코딩", "Bugbot", "Cloud agents"],
    sourceIds: [
      "cursor-docs",
      "cursor-pricing",
      "cursor-changelog",
      "cursor-students",
    ],
  },
  {
    id: "update-ai-coding-tool-directory",
    providerId: "market",
    category: "tools",
    title:
      "AI 코딩 도구 디렉터리를 IDE·CLI·PR 리뷰·클라우드 에이전트 축으로 확장",
    date: SNAPSHOT_DATE,
    summary:
      "Cursor, GitHub Copilot, JetBrains Junie, Amazon Q Developer, Gemini Code Assist/Jules, Amp, Zed, Augment, Tabnine, CodeRabbit, TRAE, 오픈소스 agent stack, Lovable/Bolt/v0, Devin/Replit/Manus를 별도 비교군으로 추가했다.",
    impact:
      "모델 성능표만으로는 바이브 코딩 도구 선택이 어렵기 때문에, 사용 표면·가격·이벤트·한국어 자료·권한 리스크를 함께 필터링할 수 있다.",
    tags: ["AI 코딩 도구", "도구 디렉터리", "Cursor", "Copilot", "CLI"],
    sourceIds: [
      "cursor-docs",
      "github-copilot-plans",
      "jetbrains-junie",
      "amazon-q-developer-docs",
      "gemini-code-assist-ko",
      "sourcegraph-amp-manual",
      "coderabbit-docs",
      "trae-pricing",
    ],
  },
  {
    id: "event-github-copilot-student-pack",
    providerId: "market",
    category: "events",
    title: "GitHub Copilot Student와 Education Pack 상태 확인",
    date: SNAPSHOT_DATE,
    summary:
      "GitHub Docs는 Copilot Student 무료 접근을 안내하지만, Student Developer Pack의 Copilot 신규 plan sign-up은 일시 중단 상태로 표시된다.",
    impact:
      "학생 대상 AI 코딩 혜택 비교에서는 Copilot 공식 플랜 문서와 Education Pack 상태를 동시에 보여주고, Cursor/JetBrains 학생 혜택과 같이 비교해야 한다.",
    tags: ["이벤트", "학생 혜택", "Copilot", "Education Pack", "일시 중단"],
    sourceIds: ["github-copilot-plans", "github-education-pack"],
  },
  {
    id: "event-trae-trial",
    providerId: "market",
    category: "events",
    title: "TRAE Pro 7일 체험과 cloud task 플랜 비교",
    date: SNAPSHOT_DATE,
    summary:
      "TRAE 가격표는 Pro 7일 무료 체험, Lite/Pro/Pro+/Ultra 월 가격, Basic usage와 concurrent cloud tasks 차이를 안내한다.",
    impact:
      "Cursor/Windsurf/TRAE 같은 AI IDE 비교에서 무료 체험, SOLO mode, cloud task 병렬 수를 이벤트 비용 축으로 필터링할 수 있다.",
    tags: ["이벤트", "TRAE", "무료 체험", "AI IDE", "cloud task"],
    sourceIds: ["trae-pricing", "trae-docs"],
  },
  {
    id: "event-openai-academy",
    providerId: "openai",
    category: "events",
    title: "OpenAI Academy 온라인 학습 이벤트",
    date: SNAPSHOT_DATE,
    summary:
      "OpenAI Academy는 Builder Bootcamp, Agents, SME Accelerator 등 온라인 학습 이벤트를 공개 이벤트 허브에서 운영한다.",
    impact:
      "Codex/Agents 학습 이벤트는 강좌 리소스와 뉴스레터 후보로 연결하고, 등록 마감·언어·대상자 조건을 편집 큐에서 확인한다.",
    tags: ["이벤트", "OpenAI Academy", "Agents", "Codex", "온라인"],
    sourceIds: ["openai-academy-events", "openai-codex-cli"],
  },
  {
    id: "event-claude-corps",
    providerId: "anthropic",
    category: "events",
    title: "Claude Corps 2026 펠로십과 비영리 AI 활용 프로그램",
    date: "2026-06-11",
    summary:
      "Anthropic은 Claude Corps를 통해 초기 경력 인재를 비영리 조직에 배치하고 Claude 교육, 토큰 예산, 멘토링을 제공하는 프로그램을 발표했다.",
    impact:
      "Claude 이벤트는 단순 할인보다 교육/비영리/AI 역량 확산 관점의 혜택으로 분류하고, 신청 마감과 참여 조건을 별도 표시한다.",
    tags: ["이벤트", "Claude", "교육", "비영리", "펠로십"],
    sourceIds: ["anthropic-claude-corps", "anthropic-news"],
  },
  {
    id: "event-gemini-students",
    providerId: "google",
    category: "events",
    title: "Gemini 학생/교육 혜택 확인",
    date: SNAPSHOT_DATE,
    summary:
      "Gemini 공식 학생 허브는 국가·언어별 학생용 Gemini 학습 파트너와 교육 혜택 진입점을 제공한다.",
    impact:
      "학생 혜택은 국가와 인증 조건이 바뀔 수 있으므로 한국어 포털에서는 공식 학생 페이지, AI 블로그, 가격 문서를 함께 연결한다.",
    tags: ["이벤트", "Gemini", "학생 혜택", "교육", "Google AI"],
    sourceIds: ["google-gemini-students", "google-ai-blog"],
  },
  {
    id: "event-cursor-students",
    providerId: "cursor",
    category: "events",
    title: "Cursor 학생 1년 Pro 무료 혜택",
    date: SNAPSHOT_DATE,
    summary:
      "Cursor는 자격을 갖춘 대학생에게 Cursor Pro 1년 무료 혜택을 제공하며, Pro 기능과 월 $20 상당 포함 사용량을 안내한다.",
    impact:
      "학생·부트캠프·동아리 대상 AI 코딩 교육 자료에서는 Cursor 혜택을 공식 학생 페이지와 함께 우선 노출할 수 있다.",
    tags: ["이벤트", "Cursor", "학생 혜택", "Pro", "AI 코딩"],
    sourceIds: ["cursor-students", "cursor-pricing"],
  },
  {
    id: "event-qwen-free-quota",
    providerId: "qwen",
    category: "events",
    title: "Qwen/Alibaba Model Studio 무료 quota와 Batch 반값 확인",
    date: SNAPSHOT_DATE,
    summary:
      "Alibaba Model Studio 과금 문서는 일부 Qwen 모델에 지역별 무료 quota와 Batch 호출 50% 과금, 컨텍스트 캐시 할인 조건을 안내한다.",
    impact:
      "Qwen API와 자체 배포를 비교할 때 무료 quota, Batch 반값, 캐시 할인은 이벤트성 비용 절감 축으로 따로 표시한다.",
    tags: ["이벤트", "Qwen", "무료 quota", "Batch 50%", "캐시 할인"],
    sourceIds: ["qwen-billing", "qwen-docs"],
  },
  {
    id: "event-openai-promotions",
    providerId: "openai",
    category: "events",
    title: "OpenAI 이벤트/크레딧/초대 혜택 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "OpenAI는 모델 가격, API 크레딧, ChatGPT 플랜/팀/교육 혜택, Codex 관련 이벤트가 수시로 바뀔 수 있으므로 공식 모델·가격 문서와 뉴스 페이지를 분리 감시한다.",
    impact:
      "2배 크레딧, 친구 초대, 신규 플랜 할인, 교육 혜택이 확인되면 이벤트 카드로 승격하고 만료일과 적용 국가를 별도 표시한다.",
    tags: ["이벤트", "크레딧", "초대", "가격", "OpenAI"],
    sourceIds: ["openai-models", "openai-gpt55", "openai-codex-cli"],
  },
  {
    id: "event-claude-promotions",
    providerId: "anthropic",
    category: "events",
    title: "Claude 플랜/크레딧/추천 이벤트 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "Claude API 가격, Pro/Team/Enterprise 플랜, Claude Code 관련 행사·할인·초대 혜택은 Anthropic pricing/news와 Claude Code 문서를 함께 확인한다.",
    impact:
      "친구 초대, 팀 플랜 프로모션, Claude Code 사용량 이벤트는 공식 근거가 확인된 경우에만 게시한다.",
    tags: ["이벤트", "Claude", "Claude Code", "추천", "가격"],
    sourceIds: ["anthropic-pricing", "anthropic-news", "claude-code-setup"],
  },
  {
    id: "event-gemini-promotions",
    providerId: "google",
    category: "events",
    title: "Gemini 무료 quota, 학생/교육, AI Pro 이벤트 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "Gemini API pricing, free tier, batch/caching 비용, Google AI Pro/교육 이벤트를 공식 가격 문서와 Google AI 블로그에서 확인한다.",
    impact:
      "학생/교육 혜택, 무료 quota 확대, 2배 크레딧성 이벤트는 지역·계정 조건이 달라질 수 있어 조건 필터를 함께 표시한다.",
    tags: ["이벤트", "Gemini", "무료 quota", "학생 혜택", "가격"],
    sourceIds: ["google-gemini-pricing", "google-ai-blog"],
  },
  {
    id: "event-grok-promotions",
    providerId: "xai",
    category: "events",
    title: "Grok/X Premium/API 이벤트 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "Grok은 API 가격, X Premium 연계, 검색/사용량 이벤트가 제품 플랜과 함께 움직일 수 있어 xAI 모델 문서와 가격 정보를 분리 감시한다.",
    impact:
      "무료 사용량, X Premium 번들, API 할인 이벤트는 적용 지역과 플랜 조건을 확인한 뒤 게시한다.",
    tags: ["이벤트", "Grok", "X Premium", "API", "가격"],
    sourceIds: ["xai-models", "xai-grok43"],
  },
  {
    id: "event-manus-promotions",
    providerId: "manus",
    category: "events",
    title: "Manus 크레딧/초대/플랜 이벤트 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "Manus는 태스크형 서비스라 친구 초대, 크레딧, 플랜 이벤트가 실제 사용 비용에 직접 영향을 주므로 pricing과 API 문서를 함께 감시한다.",
    impact:
      "초대 보상, 신규 가입 크레딧, 태스크 크레딧 2배 이벤트가 확인되면 이벤트 카드와 비용 계산기에 반영한다.",
    tags: ["이벤트", "Manus", "초대", "크레딧", "태스크"],
    sourceIds: ["manus-pricing", "manus-api"],
  },
  {
    id: "event-kimi-promotions",
    providerId: "kimi",
    category: "events",
    title: "Kimi/Moonshot API 무료·할인 이벤트 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "Kimi API pricing과 K2.7 Code 문서를 기준으로 무료 quota, 신규 개발자 크레딧, 고속 모델 할인 이벤트를 확인한다.",
    impact:
      "Kimi K2.7 Code를 aider/Cursor류 도구에 붙일 때 프로모션 여부가 초기 실험 비용에 영향을 줄 수 있다.",
    tags: ["이벤트", "Kimi", "Moonshot", "무료 quota", "가격"],
    sourceIds: ["kimi-pricing", "kimi-k27-code"],
  },
  {
    id: "event-deepseek-promotions",
    providerId: "deepseek",
    category: "events",
    title: "DeepSeek 캐시/할인/모델 전환 이벤트 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "DeepSeek은 이미 cache hit/miss 가격 차이가 크므로, 추가 할인·무료 quota보다 캐시 정책과 레거시 모델 중단 일정까지 함께 감시한다.",
    impact:
      "저비용 장문 처리 캠페인에서는 이벤트보다 cache hit율이 더 큰 비용 변수일 수 있어 이벤트 카드와 비용 계산기를 같이 갱신한다.",
    tags: ["이벤트", "DeepSeek", "캐시", "할인", "가격"],
    sourceIds: ["deepseek-pricing", "deepseek-updates"],
  },
  {
    id: "event-qwen-promotions",
    providerId: "qwen",
    category: "events",
    title: "Qwen/DashScope 무료 quota·할인 이벤트 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "Qwen/Model Studio 과금 문서에서 무료 quota, 모델별 과금, 할인 이벤트, 개발자 크레딧 변동을 확인한다.",
    impact:
      "오픈웨이트 자체 배포와 API 사용 비용을 비교할 때 무료 quota와 이벤트성 크레딧을 분리해야 한다.",
    tags: ["이벤트", "Qwen", "DashScope", "무료 quota", "가격"],
    sourceIds: ["qwen-billing", "qwen-docs"],
  },
  {
    id: "event-mistral-promotions",
    providerId: "mistral",
    category: "events",
    title: "Mistral La Plateforme 가격/크레딧 이벤트 확인 루프",
    date: SNAPSHOT_DATE,
    summary:
      "Mistral pricing과 news를 기준으로 La Plateforme, Devstral, 오픈웨이트/호스팅 이벤트, 가격 변경을 감시한다.",
    impact:
      "유럽/오픈웨이트 전략에서는 프로모션보다 자체 배포 비용과 API 할인 이벤트를 함께 비교해야 한다.",
    tags: ["이벤트", "Mistral", "La Plateforme", "크레딧", "가격"],
    sourceIds: ["mistral-pricing", "mistral-news"],
  },
  {
    id: "update-vibe-coding-focus",
    providerId: "market",
    category: "vibe",
    title: "바이브 코딩은 모델보다 실행 표면을 함께 비교해야 함",
    date: "2026-06-18",
    summary:
      "Codex, Claude Code, Gemini CLI는 전용 CLI/IDE 표면이 강하고, Kimi·DeepSeek는 OpenAI 호환 API로 기존 코딩 도구에 붙이기 쉽다. Qwen/Mistral은 자체 배포와 공식 SDK 중심으로 운영 난이도가 달라진다.",
    impact:
      "AI 코딩 도입 평가는 모델 점수뿐 아니라 CLI, repo 접근 권한, 테스트 실행, 비용, fallback, 로컬 배포 가능성까지 같은 표로 비교해야 한다.",
    tags: ["바이브 코딩", "CLI", "코딩 에이전트", "명령어"],
    sourceIds: [
      "openai-codex-cli",
      "claude-code-docs",
      "claude-code-setup",
      "cursor-docs",
      "cursor-changelog",
      "gemini-cli-github",
      "kimi-k27-code",
      "deepseek-pricing",
      "qwen-quickstart",
      "mistral-api",
    ],
  },
  {
    id: "update-ppt-design-workflows",
    providerId: "market",
    category: "design",
    title: "PPT/디자인 산출물은 Manus, Gemini, Mistral을 분리 비교",
    date: "2026-06-18",
    summary:
      "Manus는 태스크형 산출물 제작, Gemini는 문서·이미지·영상·PDF 이해, Mistral은 OCR/Document QnA와 자체 배포 가능성을 축으로 본다.",
    impact:
      "PPT와 웹진형 콘텐츠 제작은 단일 LLM 점수보다 입력 자료 종류, 파일 처리, 산출물 검수, 브라우저/디자인 도구 연동 여부가 중요하다.",
    tags: ["PPT", "디자인", "문서 제작", "에이전트"],
    sourceIds: [
      "manus-home",
      "manus-api",
      "google-gemini31",
      "mistral-medium-35",
    ],
  },
  {
    id: "update-aa-leaderboard",
    providerId: "market",
    category: "benchmarks",
    title:
      "Artificial Analysis 기준 최상위권은 Claude Fable 5, Claude Opus 4.8, GPT-5.5",
    date: "2026-06-17",
    summary:
      "Intelligence Index 상단에는 Claude Fable 5 with fallback, Claude Opus 4.8 max, GPT-5.5 xhigh가 위치한다.",
    impact:
      "벤치마크 결과는 가격·속도·컨텍스트와 함께 봐야 하며, 사용 시나리오별 최적 모델은 달라진다.",
    tags: ["벤치마크", "가격", "성능"],
    sourceIds: ["aa-leaderboard"],
  },
];

export const benchmarkEntries: BenchmarkEntry[] = [
  {
    id: "aa-claude-fable",
    rankLabel: "#1",
    modelName: "Claude Fable 5 (with fallback)",
    providerId: "anthropic",
    domain: "overall",
    metric: "AA Intelligence Index",
    score: "60",
    price: "$7.70 blended / 1M",
    speed: "--",
    latency: "--",
    context: "1M",
    sourceIds: ["aa-leaderboard"],
  },
  {
    id: "aa-claude-opus48",
    rankLabel: "#2",
    modelName: "Claude Opus 4.8 (max)",
    providerId: "anthropic",
    domain: "overall",
    metric: "AA Intelligence Index",
    score: "56",
    price: "$3.85 blended / 1M",
    speed: "63 tok/s",
    latency: "37.01s first chunk",
    context: "1M",
    sourceIds: ["aa-leaderboard", "anthropic-models"],
  },
  {
    id: "aa-gpt55-xhigh",
    rankLabel: "#3",
    modelName: "GPT-5.5 (xhigh)",
    providerId: "openai",
    domain: "overall",
    metric: "AA Intelligence Index",
    score: "55",
    price: "$4.35 blended / 1M",
    speed: "61 tok/s",
    latency: "117.11s first chunk",
    context: "922k",
    sourceIds: ["aa-leaderboard", "openai-gpt55"],
  },
  {
    id: "aa-gemini35-flash",
    rankLabel: "Top 10",
    modelName: "Gemini 3.5 Flash",
    providerId: "google",
    domain: "cost",
    metric: "AA Intelligence Index",
    score: "50",
    price: "$1.31 blended / 1M",
    speed: "153 tok/s",
    latency: "19.22s first chunk",
    context: "1M",
    sourceIds: ["aa-leaderboard", "google-models"],
  },
  {
    id: "aa-gemini31-pro",
    rankLabel: "Top 15",
    modelName: "Gemini 3.1 Pro Preview",
    providerId: "google",
    domain: "multimodal",
    metric: "AA Intelligence Index",
    score: "46",
    price: "$1.74 blended / 1M",
    speed: "122 tok/s",
    latency: "23.02s first chunk",
    context: "1M",
    sourceIds: ["aa-leaderboard", "google-gemini31"],
  },
  {
    id: "aa-grok43-high",
    rankLabel: "Watch",
    modelName: "Grok 4.3 (high)",
    providerId: "xai",
    domain: "research",
    metric: "AA Intelligence Index",
    score: "38",
    price: "$0.64 blended / 1M",
    speed: "165 tok/s",
    latency: "13.61s first chunk",
    context: "1M",
    sourceIds: ["aa-leaderboard", "xai-grok43"],
  },
  {
    id: "deepseek-v31-swebench",
    rankLabel: "Coding",
    modelName: "DeepSeek V3.1 Think",
    providerId: "deepseek",
    domain: "coding",
    metric: "SWE-bench Verified",
    score: "66.0",
    price: "V4 Flash $0.14/$0.28 official",
    speed: "API",
    latency: "--",
    context: "1M on V4",
    sourceIds: ["deepseek-updates", "deepseek-pricing"],
  },
  {
    id: "kimi-k27-coding",
    rankLabel: "Coding",
    modelName: "Kimi K2.7 Code HighSpeed",
    providerId: "kimi",
    domain: "coding",
    metric: "Official output speed marker",
    score: "180",
    price: "pricing page check required",
    speed: "~180 tok/s, short context up to 260",
    latency: "--",
    context: "256K",
    sourceIds: ["kimi-models", "kimi-k27-code"],
  },
  {
    id: "mistral-medium35-coding",
    rankLabel: "Coding",
    modelName: "Mistral Medium 3.5",
    providerId: "mistral",
    domain: "coding",
    metric: "Agentic/coding model card",
    score: "256",
    price: "$1.5/$7.5 official",
    speed: "--",
    latency: "--",
    context: "256K",
    sourceIds: ["mistral-medium-35"],
  },
  {
    id: "qwen3-local-coding",
    rankLabel: "Coding",
    modelName: "Qwen3-2507",
    providerId: "qwen",
    domain: "coding",
    metric: "Open-weight local deployment marker",
    score: "256",
    price: "self-hosting dependent",
    speed: "vLLM/SGLang/Ollama",
    latency: "GPU dependent",
    context: "256K, extensible to 1M",
    sourceIds: ["qwen-docs", "qwen-quickstart"],
  },
  {
    id: "cursor-agent-surface",
    rankLabel: "Tooling",
    modelName: "Cursor Agents / Bugbot",
    providerId: "cursor",
    domain: "agent",
    metric: "IDE agent surface marker",
    score: "3.7",
    price: "Hobby free, Pro $20/mo, Teams $40/user/mo",
    speed: "Cloud subagents, Bugbot ~90s review marker",
    latency: "task dependent",
    context: "repo, IDE, terminal, cloud agents",
    sourceIds: ["cursor-pricing", "cursor-changelog"],
  },
  {
    id: "gemini-ppt-docs",
    rankLabel: "PPT/Docs",
    modelName: "Gemini 3.1 Pro Preview",
    providerId: "google",
    domain: "ppt",
    metric: "Document understanding marker",
    score: "1000",
    price: "$1.74 blended / 1M",
    speed: "122 tok/s AA",
    latency: "23.02s first chunk AA",
    context: "1M",
    sourceIds: ["google-gemini31", "google-gemini-docs-ko"],
  },
  {
    id: "manus-ppt-agent",
    rankLabel: "PPT/Docs",
    modelName: "Manus API v2",
    providerId: "manus",
    domain: "ppt",
    metric: "Task platform capability marker",
    score: "2",
    price: "service pricing",
    speed: "task dependent",
    latency: "task dependent",
    context: "files/projects",
    sourceIds: ["manus-home", "manus-api", "youtube-manus-search"],
  },
  {
    id: "lmarena-user-preference",
    rankLabel: "Arena",
    modelName: "Frontier chat models",
    providerId: "other",
    domain: "overall",
    metric: "Human preference Elo leaderboard",
    score: "100",
    price: "varies",
    speed: "model dependent",
    latency: "model dependent",
    context: "anonymous pairwise user votes",
    sourceIds: ["lmarena-leaderboard"],
  },
  {
    id: "helm-holistic",
    rankLabel: "Holistic",
    modelName: "HELM scenarios",
    providerId: "other",
    domain: "overall",
    metric:
      "Accuracy, calibration, robustness, fairness, bias, toxicity, efficiency",
    score: "7",
    price: "benchmark dependent",
    speed: "tracked in efficiency",
    latency: "tracked in efficiency",
    context: "multi-metric evaluation",
    sourceIds: ["helm-leaderboard"],
  },
  {
    id: "scale-labs-practical",
    rankLabel: "Practical",
    modelName: "Scale Labs evaluations",
    providerId: "other",
    domain: "overall",
    metric: "Practical model leaderboard hub",
    score: "100",
    price: "varies",
    speed: "varies",
    latency: "varies",
    context: "frontier model evals",
    sourceIds: ["scale-leaderboard"],
  },
  {
    id: "swebench-verified-coverage",
    rankLabel: "SWE",
    modelName: "SWE-bench Verified",
    providerId: "other",
    domain: "coding",
    metric: "% resolved on 500 human-filtered GitHub issues",
    score: "500",
    price: "agent run cost compared on leaderboard",
    speed: "step count tracked",
    latency: "task dependent",
    context: "500 verified instances",
    sourceIds: ["swebench-leaderboard"],
  },
  {
    id: "swebench-multilingual-coverage",
    rankLabel: "SWE",
    modelName: "SWE-bench Multilingual",
    providerId: "other",
    domain: "coding",
    metric: "% resolved across non-Python language issue tasks",
    score: "300",
    price: "agent run cost compared on leaderboard",
    speed: "step count tracked",
    latency: "task dependent",
    context: "300 tasks across 9 programming languages",
    sourceIds: ["swebench-leaderboard"],
  },
  {
    id: "swebench-multimodal-coverage",
    rankLabel: "SWE",
    modelName: "SWE-bench Multimodal",
    providerId: "other",
    domain: "multimodal",
    metric: "% resolved on image-required JavaScript issue tasks",
    score: "517",
    price: "agent run cost compared on leaderboard",
    speed: "step count tracked",
    latency: "task dependent",
    context: "517 multimodal issue instances",
    sourceIds: ["swebench-leaderboard"],
  },
  {
    id: "dialogue-swebench-agent",
    rankLabel: "Dialogue",
    modelName: "Dialogue-SWEBench",
    providerId: "other",
    domain: "agent",
    metric:
      "대화형 Dialogue-driven repository task resolve rate and dialogue quality",
    score: "46.9",
    price: "$0.38 avg reported",
    speed: "50.9 steps avg",
    latency: "6.9 turns avg",
    context: "SWE-bench Verified tasks reformulated as user-agent dialogue",
    sourceIds: ["dialogue-swebench-paper"],
  },
  {
    id: "swe-contextbench-reuse",
    rankLabel: "Context",
    modelName: "SWE Context Bench",
    providerId: "other",
    domain: "agent",
    metric: "Experience reuse accuracy, time efficiency, cost efficiency",
    score: "399",
    price: "token/runtime efficiency tracked",
    speed: "experience reuse tracked",
    latency: "task sequence dependent",
    context: "300 SWE-bench Lite base tasks plus 99 related tasks",
    sourceIds: ["swe-contextbench-paper"],
  },
  {
    id: "swebench-mobile-cursor-opus",
    rankLabel: "Mobile",
    modelName: "Cursor Opus 4.5 on SWE-Bench Mobile",
    providerId: "cursor",
    domain: "coding",
    metric: "Industry-level 모바일 task success and test pass rate",
    score: "12.0",
    price: "agent/model dependent",
    speed: "449 test cases",
    latency: "task dependent",
    context: "50 iOS tasks, 4 agents, 9 models",
    sourceIds: ["swebench-mobile-leaderboard", "swebench-mobile-paper"],
  },
  {
    id: "swe-mera-dynamic",
    rankLabel: "Dynamic",
    modelName: "SWE-MERA",
    providerId: "other",
    domain: "coding",
    metric:
      "Dynamic software engineering agent evaluation with contamination controls",
    score: "300",
    price: "agent/model dependent",
    speed: "collection date tracked",
    latency: "task dependent",
    context: "300 current samples from about 10,000 potential tasks",
    sourceIds: ["swe-mera-paper"],
  },
  {
    id: "swebench-pro-long-horizon",
    rankLabel: "Pro",
    modelName: "SWE-Bench Pro",
    providerId: "other",
    domain: "coding",
    metric: "Long-horizon enterprise software engineering task Pass@1",
    score: "1865",
    price: "agent/model dependent",
    speed: "hours-to-days human-equivalent tasks",
    latency: "long-horizon",
    context: "1,865 problems across 41 repositories",
    sourceIds: ["swebench-pro-paper"],
  },
  {
    id: "claw-swebench-harness",
    rankLabel: "Harness",
    modelName: "Claw-SWE-Bench",
    providerId: "other",
    domain: "agent",
    metric: "OpenClaw-style harness Pass@1, cost, adapter protocol",
    score: "350",
    price: "API cost compared by harness",
    speed: "runtime budget controlled",
    latency: "80-instance Lite subset available",
    context: "350 multilingual issue-resolution tasks, 8 languages, 43 repos",
    sourceIds: ["claw-swebench-paper"],
  },
  {
    id: "swelancer-economic-coding",
    rankLabel: "Freelance",
    modelName: "SWE-Lancer",
    providerId: "openai",
    domain: "coding",
    metric: "Real freelance engineering task value and end-to-end tests",
    score: "1488",
    price: "$1M real-world payout value",
    speed: "task payout bands tracked",
    latency: "project dependent",
    context: "implementation and managerial software tasks from Upwork",
    sourceIds: ["swelancer-paper", "openai-frontier-evals"],
  },
  {
    id: "paperbench-research-replication",
    rankLabel: "Research",
    modelName: "PaperBench",
    providerId: "openai",
    domain: "research",
    metric: "AI research replication rubric score across gradable subtasks",
    score: "8316",
    price: "agent/model dependent",
    speed: "48-hour human baseline subset",
    latency: "long-horizon research",
    context: "20 ICML 2024 Spotlight/Oral papers, 8,316 gradable tasks",
    sourceIds: ["paperbench-paper", "openai-frontier-evals"],
  },
  {
    id: "mlebench-kaggle-engineering",
    rankLabel: "ML Eng",
    modelName: "MLE-bench",
    providerId: "openai",
    domain: "research",
    metric: "Machine learning engineering competition medal-level performance",
    score: "75",
    price: "compute and agent cost dependent",
    speed: "Kaggle competition workflow",
    latency: "experiment-loop dependent",
    context: "75 Kaggle-style ML engineering competitions",
    sourceIds: ["mlebench-paper", "mlebench-github"],
  },
  {
    id: "browsecomp-web-research",
    rankLabel: "Browse",
    modelName: "BrowseComp",
    providerId: "openai",
    domain: "agent",
    metric:
      "Persistent web browsing accuracy on hard-to-find factual questions",
    score: "1266",
    price: "search/tool cost dependent",
    speed: "human trainers often gave up after 2 hours",
    latency: "deep search",
    context: "1,266 difficult web search questions",
    sourceIds: ["browsecomp-paper", "openai-simple-evals"],
  },
  {
    id: "browsecomp-v3-multimodal",
    rankLabel: "Browse-V3",
    modelName: "BrowseComp-V3",
    providerId: "other",
    domain: "multimodal",
    metric: "Visual, vertical, verifiable multimodal deep browsing accuracy",
    score: "300",
    price: "search/vision/tool cost dependent",
    speed: "multi-hop evidence search",
    latency: "deep search",
    context: "300 cross-modal browsing questions with public evidence",
    sourceIds: ["browsecomp-v3-paper"],
  },
  {
    id: "kernelbench-gpu-kernels",
    rankLabel: "GPU",
    modelName: "KernelBench",
    providerId: "other",
    domain: "coding",
    metric: "Correct and faster-than-baseline GPU kernel generation",
    score: "250",
    price: "GPU profiling cost dependent",
    speed: "fast_p speedup metric",
    latency: "iterative profiling loop",
    context: "250 PyTorch ML workloads",
    sourceIds: ["kernelbench-paper"],
  },
  {
    id: "hcast-human-calibrated",
    rankLabel: "Autonomy",
    modelName: "HCAST",
    providerId: "other",
    domain: "agent",
    metric: "Human-calibrated autonomy success by human task duration",
    score: "189",
    price: "agent/model dependent",
    speed: "1 minute to 8+ hour human baselines",
    latency: "task-duration calibrated",
    context: "189 ML, cybersecurity, SWE, reasoning tasks",
    sourceIds: ["hcast-paper"],
  },
  {
    id: "evmbench-smart-contract-security",
    rankLabel: "EVM",
    modelName: "EVMbench",
    providerId: "openai",
    domain: "coding",
    metric:
      "스마트컨트랙트 Smart contract vulnerability detection, patching, exploitation",
    score: "117",
    price: "agent/model dependent",
    speed: "local Ethereum execution",
    latency: "exploit workflow dependent",
    context: "117 curated vulnerabilities from 40 repositories",
    sourceIds: ["evmbench-paper", "openai-frontier-evals"],
  },
  {
    id: "cybench-ctf-agent",
    rankLabel: "Cyber",
    modelName: "Cybench",
    providerId: "other",
    domain: "agent",
    metric: "Professional CTF cybersecurity task and subtask solve rate",
    score: "40",
    price: "agent/model dependent",
    speed: "human team baseline from minutes to 24h+",
    latency: "terminal/web search scaffold dependent",
    context: "40 professional-level CTF tasks from 4 competitions",
    sourceIds: ["cybench-paper", "cybench-site"],
  },
  {
    id: "rebench-ai-rd",
    rankLabel: "AI R&D",
    modelName: "RE-Bench",
    providerId: "other",
    domain: "research",
    metric: "AI R&D research engineering score against human experts",
    score: "7",
    price: "agent/model/runtime dependent",
    speed: "2h, 8h, 32h budget comparisons",
    latency: "long-horizon ML R&D",
    context: "7 ML research engineering environments, 71 human attempts",
    sourceIds: ["rebench-paper"],
  },
  {
    id: "swegym-agent-training",
    rankLabel: "SWE Gym",
    modelName: "SWE-Gym",
    providerId: "other",
    domain: "coding",
    metric: "Software engineering agent training and verifier environment",
    score: "2438",
    price: "training/inference runtime dependent",
    speed: "trajectory sampling and verifier scaling",
    latency: "repo test runtime dependent",
    context: "2,438 real-world Python task instances",
    sourceIds: ["swegym-paper"],
  },
  {
    id: "gaia-general-assistant",
    rankLabel: "GAIA",
    modelName: "GAIA",
    providerId: "other",
    domain: "agent",
    metric:
      "General assistant reasoning, browsing, multimodal, tool-use accuracy",
    score: "466",
    price: "tool/search/model dependent",
    speed: "multi-step assistant tasks",
    latency: "task dependent",
    context: "466 real-world assistant questions across 3 difficulty levels",
    sourceIds: ["gaia-paper", "gaia-leaderboard"],
  },
  {
    id: "mind2web-web-agent",
    rankLabel: "Web",
    modelName: "Mind2Web",
    providerId: "other",
    domain: "agent",
    metric: "Open-ended real website task completion and action grounding",
    score: "2350",
    price: "web interaction runtime dependent",
    speed: "trajectory length tracked",
    latency: "website/task dependent",
    context: "2,000+ tasks from 137 websites and 31 domains",
    sourceIds: ["mind2web-paper", "mind2web-site"],
  },
  {
    id: "windows-agent-arena-os",
    rankLabel: "Windows",
    modelName: "Windows Agent Arena",
    providerId: "other",
    domain: "agent",
    metric: "Windows OS planning, screen understanding, and tool-use success",
    score: "150",
    price: "Azure/evaluation runtime dependent",
    speed: "parallel evaluation supports short full-run time",
    latency: "multi-step OS task dependent",
    context: "150+ Windows tasks across apps, tools, browsers",
    sourceIds: ["windows-agent-arena-paper", "windows-agent-arena-site"],
  },
  {
    id: "scienceagentbench-discovery",
    rankLabel: "Science",
    modelName: "ScienceAgentBench",
    providerId: "other",
    domain: "research",
    metric: "Data-driven scientific discovery code generation and execution",
    score: "102",
    price: "model/execution cost tracked",
    speed: "3 attempts per task reported",
    latency: "scientific workflow dependent",
    context: "102 tasks from 44 peer-reviewed publications",
    sourceIds: ["scienceagentbench-paper"],
  },
  {
    id: "scivisagentbench-visualization",
    rankLabel: "SciVis",
    modelName: "SciVisAgentBench",
    providerId: "other",
    domain: "multimodal",
    metric: "Scientific data analysis and visualization outcome quality",
    score: "108",
    price: "agent/model/evaluator dependent",
    speed: "multi-step visualization workflows",
    latency: "analysis pipeline dependent",
    context: "108 expert-crafted scientific visualization cases",
    sourceIds: ["scivisagentbench-paper", "scivisagentbench-site"],
  },
  {
    id: "securewebarena-security",
    rankLabel: "SecureWeb",
    modelName: "SecureWebArena",
    providerId: "other",
    domain: "agent",
    metric: "Web agent 보안 attack robustness and failure analysis",
    score: "2970",
    price: "web evaluation runtime dependent",
    speed: "trajectory-level analysis",
    latency: "multi-step web task dependent",
    context: "2,970 trajectories across 6 simulated web environments",
    sourceIds: ["securewebarena-paper"],
  },
  {
    id: "gdpval-work-deliverables",
    rankLabel: "Work",
    modelName: "GDPval",
    providerId: "openai",
    domain: "ppt",
    metric:
      "실제 업무 산출물 quality across documents, slides, diagrams, spreadsheets, multimedia",
    score: "1320",
    price: "API cost and expert review cost compared",
    speed: "model inference time compared",
    latency: "one-shot evaluation",
    context: "44 occupations, 9 industries, 220 public gold tasks",
    sourceIds: ["gdpval-openai", "gdpval-paper"],
  },
  {
    id: "spreadsheetbench-office",
    rankLabel: "Sheet",
    modelName: "SpreadsheetBench",
    providerId: "other",
    domain: "ppt",
    metric:
      "스프레드시트 Excel formula, data cleaning, filtering, layout edit robustness",
    score: "912",
    price: "model dependent",
    speed: "2,729 test cases",
    latency: "single/multi-round inference",
    context: "912 real Excel forum tasks",
    sourceIds: ["spreadsheetbench-paper"],
  },
  {
    id: "bluefin-finance-spreadsheets",
    rankLabel: "Finance",
    modelName: "BlueFin",
    providerId: "other",
    domain: "ppt",
    metric:
      "스프레드시트 professional finance spreadsheet synthesis, manipulation, comprehension",
    score: "131",
    price: "model dependent",
    speed: "3,225 rubric criteria",
    latency: "agent task dependent",
    context: "131 complex finance workbook tasks",
    sourceIds: ["bluefin-paper"],
  },
  {
    id: "officebench-automation",
    rankLabel: "Office",
    modelName: "OfficeBench",
    providerId: "other",
    domain: "agent",
    metric: "Office automation pass rate across multiple applications",
    score: "47.00",
    price: "agent/model dependent",
    speed: "multi-app workflow",
    latency: "long-horizon planning",
    context: "office task workflows with app switching and action grounding",
    sourceIds: ["officebench-paper"],
  },
  {
    id: "tau2bench-dual-control",
    rankLabel: "Support",
    modelName: "τ²-Bench",
    providerId: "other",
    domain: "agent",
    metric: "Dual-control conversational support task coordination",
    score: "4",
    price: "model dependent",
    speed: "tool coordination tracked",
    latency: "dialogue dependent",
    context: "Telecom support domain with agent and user tools",
    sourceIds: ["tau2-bench-paper"],
  },
  {
    id: "livecodebench-pass1",
    rankLabel: "Coding",
    modelName: "LiveCodeBench",
    providerId: "other",
    domain: "coding",
    metric: "Pass@1, Easy/Medium/Hard contamination-free coding tasks",
    score: "3",
    price: "model dependent",
    speed: "model dependent",
    latency: "model dependent",
    context: "leaderboard splits by difficulty",
    sourceIds: ["livecodebench-leaderboard"],
  },
  {
    id: "aider-gpt5-high-polyglot",
    rankLabel: "#1 Aider",
    modelName: "GPT-5 high in Aider",
    providerId: "openai",
    domain: "coding",
    metric: "Aider Polyglot benchmark percent correct",
    score: "88.0",
    price: "$29.08 total benchmark cost",
    speed: "194.0 sec/case",
    latency: "225 cases",
    context: "C++, Go, Java, JavaScript, Python, Rust",
    sourceIds: ["aider-polyglot-leaderboard"],
  },
  {
    id: "aider-gemini25-polyglot",
    rankLabel: "Aider",
    modelName: "Gemini 2.5 Pro preview in Aider",
    providerId: "google",
    domain: "coding",
    metric: "Aider Polyglot benchmark percent correct",
    score: "83.1",
    price: "$49.88 total benchmark cost",
    speed: "200.3 sec/case",
    latency: "225 cases",
    context: "diff-fenced edit format, 32K thinking",
    sourceIds: ["aider-polyglot-leaderboard"],
  },
  {
    id: "aider-grok4-polyglot",
    rankLabel: "Aider",
    modelName: "Grok 4 high in Aider",
    providerId: "xai",
    domain: "coding",
    metric: "Aider Polyglot benchmark percent correct",
    score: "79.6",
    price: "$59.62 total benchmark cost",
    speed: "403.2 sec/case",
    latency: "225 cases",
    context: "OpenRouter xAI route",
    sourceIds: ["aider-polyglot-leaderboard"],
  },
  {
    id: "bigcodebench-full",
    rankLabel: "Coding",
    modelName: "BigCodeBench Full",
    providerId: "other",
    domain: "coding",
    metric: "Practical programming tasks, Complete/Instruct Vibe Check",
    score: "1140",
    price: "model dependent",
    speed: "model dependent",
    latency: "model dependent",
    context: "1140 tasks, hard subset ~150",
    sourceIds: ["bigcodebench-leaderboard"],
  },
  {
    id: "bfcl-v4-tool-use",
    rankLabel: "Tool Use",
    modelName: "Berkeley Function Calling Leaderboard V4",
    providerId: "other",
    domain: "agent",
    metric: "Overall Accuracy, cost, latency for function/tool calling",
    score: "4",
    price: "entire benchmark cost estimated",
    speed: "latency tracked",
    latency: "seconds",
    context: "real-world functions, multi-turn, agentic eval",
    sourceIds: ["bfcl-leaderboard"],
  },
  {
    id: "terminal-bench-agent",
    rankLabel: "Terminal",
    modelName: "Terminal-Bench 2.0",
    providerId: "other",
    domain: "agent",
    metric: "Task resolution success-rate for terminal agents",
    score: "2",
    price: "run dependent",
    speed: "agent dependent",
    latency: "task dependent",
    context: "Linux terminal, system, security, data-science tasks",
    sourceIds: ["terminal-bench"],
  },
  {
    id: "osworld-agent",
    rankLabel: "Computer",
    modelName: "OSWorld",
    providerId: "other",
    domain: "agent",
    metric: "GUI computer-use agent task success",
    score: "369",
    price: "run dependent",
    speed: "trajectory dependent",
    latency: "task dependent",
    context: "369 full tasks or 361 excluding Google Drive tasks",
    sourceIds: ["osworld-benchmark"],
  },
  {
    id: "webarena-agent",
    rankLabel: "Web",
    modelName: "WebArena",
    providerId: "other",
    domain: "agent",
    metric: "Web navigation and website operation task success",
    score: "812",
    price: "run dependent",
    speed: "trajectory dependent",
    latency: "task dependent",
    context: "mock websites, web agent actions",
    sourceIds: ["webarena-benchmark"],
  },
  {
    id: "mmmu-multimodal",
    rankLabel: "MMMU",
    modelName: "MMMU / MMMU-Pro",
    providerId: "other",
    domain: "multimodal",
    metric: "College-level multimodal reasoning across 6 disciplines",
    score: "11500",
    price: "model dependent",
    speed: "model dependent",
    latency: "model dependent",
    context: "11.5K questions, 30 image formats",
    sourceIds: ["mmmu-benchmark"],
  },
  {
    id: "mmmu-design-ppt",
    rankLabel: "PPT/Charts",
    modelName: "MMMU Art & Design / Business / Tech slices",
    providerId: "other",
    domain: "ppt",
    metric: "Charts, tables, diagrams, posters, logos, blueprints, screenshots",
    score: "30",
    price: "model dependent",
    speed: "model dependent",
    latency: "model dependent",
    context: "30 image types for document/design-heavy workflows",
    sourceIds: ["mmmu-benchmark"],
  },
  {
    id: "docvqa-docs",
    rankLabel: "Docs",
    modelName: "DocVQA / InfographicVQA",
    providerId: "other",
    domain: "ppt",
    metric: "Document visual question answering challenge",
    score: "2026",
    price: "model dependent",
    speed: "model dependent",
    latency: "model dependent",
    context: "forms, scanned docs, infographics, multimodal documents",
    sourceIds: ["docvqa-benchmark"],
  },
  {
    id: "chartqa-reports",
    rankLabel: "Charts",
    modelName: "ChartQA",
    providerId: "other",
    domain: "ppt",
    metric: "Chart and graph question answering",
    score: "100",
    price: "model dependent",
    speed: "model dependent",
    latency: "model dependent",
    context: "charts/graphs for PPT and report analysis",
    sourceIds: ["chartqa-benchmark"],
  },
];

export const vibeCodingCommands: VibeCodingCommand[] = [
  {
    id: "cmd-openai-codex",
    providerId: "openai",
    modelId: "gpt-55",
    modelName: "OpenAI Codex / GPT",
    surface: "전용 CLI",
    installCommand: "curl -fsSL https://chatgpt.com/codex/install.sh | sh",
    command:
      'codex "이 저장소에서 실패하는 테스트를 찾아 최소 수정하고, 변경 파일과 검증 명령을 요약해줘"',
    useCase:
      "로컬 저장소를 직접 읽고 패치·테스트·리뷰 루프까지 맡기는 터미널 중심 바이브 코딩.",
    vibeCodingFit: "매우 높음",
    setupNotes: [
      "Codex CLI는 로컬 repo 맥락, diff, 테스트 명령을 중심으로 운용한다.",
      "대규모 변경은 먼저 계획/검토를 받고 작은 패치 단위로 나누는 것이 안정적이다.",
      "OpenAI 모델 선택은 Codex 표면의 기본값과 프로젝트 정책을 함께 확인한다.",
    ],
    caveats: [
      "보안 키가 포함된 파일과 파괴적 명령 권한을 분리해야 한다.",
      "실패 테스트 없이 구현만 맡기면 회귀 검증 품질이 떨어진다.",
    ],
    sourceIds: ["openai-codex-cli", "openai-models", "youtube-openai"],
  },
  {
    id: "cmd-claude-code",
    providerId: "anthropic",
    modelId: "claude-fable-5",
    modelName: "Claude Code / Claude",
    surface: "전용 CLI",
    installCommand: "curl -fsSL https://claude.ai/install.sh | bash",
    command:
      'claude "이 PR diff를 읽고 버그 위험과 누락된 테스트를 파일/라인 기준으로 리뷰해줘"',
    useCase:
      "긴 문맥 코드베이스 이해, 리팩터링 계획, PR 리뷰, Claude Code 중심의 pair programming.",
    vibeCodingFit: "매우 높음",
    setupNotes: [
      "Claude Code는 터미널, IDE, 웹/데스크톱 표면을 함께 쓰는 방식으로 운용할 수 있다.",
      "장기 작업은 역할, 변경 범위, 테스트 명령, 금지 리팩터링을 명확히 적는다.",
      "MCP와 사내 도구를 붙일 때는 권한 범위를 작은 단위로 나눈다.",
    ],
    caveats: [
      "정책상 refusal/fallback이 필요한 응답은 오류와 다르게 처리해야 한다.",
      "대규모 자동 수정은 코드 리뷰 관점의 두 번째 패스를 돌리는 것이 안전하다.",
    ],
    sourceIds: [
      "claude-code-docs",
      "claude-code-setup",
      "anthropic-fable5",
      "anthropic-docs-ko",
      "youtube-anthropic",
    ],
  },
  {
    id: "cmd-cursor-agent",
    providerId: "cursor",
    modelId: "cursor-ai-ide",
    modelName: "Cursor Agents / Bugbot",
    surface: "IDE/에이전트",
    installCommand:
      "cursor . # Cursor 데스크톱/CLI 설치 후 현재 repo를 열어 Agent, Tab, Rules, MCP를 설정",
    command:
      '/review-bugbot 또는 Agent: "이 브랜치의 실패 테스트를 재현하고 최소 수정 PR을 준비해줘"',
    useCase:
      "IDE 안에서 파일 탐색, 코드 생성, Tab 자동완성, Bugbot 리뷰, Cloud agents 병렬 작업까지 묶는 실전 바이브 코딩.",
    vibeCodingFit: "매우 높음",
    setupNotes: [
      "Pro/Teams 플랜의 포함 사용량, on-demand usage, privacy mode를 팀 정책으로 먼저 정한다.",
      "Cursor rules, MCP, skills, hooks를 repo 규칙에 맞춰 고정하면 반복 작업 품질이 안정된다.",
      "Cloud subagent와 /in-cloud는 장시간 CI 수정, 병렬 탐색, PR babysit 같은 작업에 적합하다.",
    ],
    caveats: [
      "Cursor는 기저 모델이 아니라 실행 표면이므로 GPT/Claude/Gemini 품질과 별도 평가한다.",
      "자동 리뷰와 agent 실행은 repo 권한, 네트워크, 브라우저, destructive command 정책을 함께 제한해야 한다.",
    ],
    sourceIds: ["cursor-docs", "cursor-pricing", "cursor-changelog"],
  },
  {
    id: "cmd-gemini-cli",
    providerId: "google",
    modelId: "gemini-31-pro",
    modelName: "Gemini CLI / Gemini",
    surface: "전용 CLI",
    installCommand: "npx @google/gemini-cli",
    command:
      'gemini "이 앱의 라우팅과 상태 흐름을 설명하고 리팩터링 후보를 정리해줘"',
    useCase:
      "멀티모달 자료, Google Cloud/Workspace 맥락, 대형 컨텍스트 코드 이해를 함께 쓰는 CLI 코딩.",
    vibeCodingFit: "높음",
    setupNotes: [
      "Gemini CLI는 npx, npm 전역 설치, Homebrew 설치 경로가 공개되어 있다.",
      "PDF, 이미지, 긴 문서가 섞인 기획/코딩 설명에는 Gemini 모델의 멀티모달 강점이 유리하다.",
      "Vertex AI/Gemini API와 연결하는 팀은 한국어 공식 문서를 운영 문서로 함께 둔다.",
    ],
    caveats: [
      "프리뷰 모델은 기능과 품질 변동 가능성을 별도 기록한다.",
      "Google Search grounding과 코드 실행 도구는 모델/환경별 지원 여부를 확인해야 한다.",
    ],
    sourceIds: [
      "gemini-cli-github",
      "google-gemini31",
      "google-gemini-docs-ko",
      "youtube-google-developers",
    ],
  },
  {
    id: "cmd-kimi-openai-compatible",
    providerId: "kimi",
    modelId: "kimi-k2.7-code",
    modelName: "Kimi K2.7 Code",
    surface: "OpenAI 호환 API",
    installCommand: "pipx install aider-chat",
    command:
      "OPENAI_BASE_URL=https://api.moonshot.ai/v1 OPENAI_API_KEY=$MOONSHOT_API_KEY aider --model openai/kimi-k2.7-code",
    useCase:
      "OpenAI 호환 코딩 도구(aider, Continue, OpenAI SDK 래퍼 등)에 Kimi 코딩 모델을 연결해 실험.",
    vibeCodingFit: "높음",
    setupNotes: [
      "Moonshot API는 OpenAI SDK/API 호환 base URL을 제공한다.",
      "K2.7 Code는 코딩·에이전트 작업, 이미지/비디오 입력, tool calls를 중심으로 테스트한다.",
      "빠른 반복은 HighSpeed 변형을 별도 프로파일로 측정한다.",
    ],
    caveats: [
      "K2.7 Code는 non-thinking mode를 끄는 방식으로 운용하지 않는다.",
      "tool_choice와 파라미터 제약은 공식 quickstart 기준으로 맞춘다.",
    ],
    sourceIds: ["kimi-k27-code", "kimi-models", "youtube-kimi-search"],
  },
  {
    id: "cmd-deepseek-openai-compatible",
    providerId: "deepseek",
    modelId: "deepseek-v4-flash",
    modelName: "DeepSeek V4 Flash",
    surface: "OpenAI 호환 API",
    installCommand: "pipx install aider-chat",
    command:
      "OPENAI_BASE_URL=https://api.deepseek.com OPENAI_API_KEY=$DEEPSEEK_API_KEY aider --model openai/deepseek-v4-flash",
    useCase:
      "저비용 장문 코드 이해, 대량 리팩터링 후보 탐색, OpenAI 호환 코딩 도구 비용 절감 실험.",
    vibeCodingFit: "높음",
    setupNotes: [
      "OpenAI 형식과 Anthropic 형식의 base URL을 모두 제공한다.",
      "1M 컨텍스트와 384K 출력 한도를 전제로 대형 로그/코드베이스 요약을 실험한다.",
      "반복 프롬프트는 cache hit율을 지표로 저장한다.",
    ],
    caveats: [
      "deepseek-chat/deepseek-reasoner 호환 이름은 2026-07-24 15:59 UTC 중단 일정이 있다.",
      "FIM은 non-thinking mode 제한을 확인해야 한다.",
    ],
    sourceIds: [
      "deepseek-pricing",
      "deepseek-updates",
      "youtube-deepseek-search",
    ],
  },
  {
    id: "cmd-qwen-local-vllm",
    providerId: "qwen",
    modelId: "qwen3-2507",
    modelName: "Qwen3 / Qwen Coder",
    surface: "서드파티 CLI",
    installCommand: "pip install vllm transformers accelerate",
    command:
      "vllm serve Qwen/Qwen3-32B --served-model-name qwen3-local --enable-auto-tool-choice",
    useCase:
      "오픈웨이트 모델을 로컬/온프레미스 OpenAI 호환 서버로 띄워 사내 코드와 문서에 붙이는 방식.",
    vibeCodingFit: "높음",
    setupNotes: [
      "Qwen 문서는 Transformers, llama.cpp, Ollama, LM Studio, vLLM, SGLang 등 여러 실행·배포 경로를 안내한다.",
      "한국어 코드 설명 품질은 실제 내부 repo 샘플로 별도 평가한다.",
      "Coder 전용 모델이나 Thinking-only 모델은 목적별로 분리해 벤치마크한다.",
    ],
    caveats: [
      "GPU 메모리, 양자화, 컨텍스트 길이에 따라 품질과 속도가 크게 달라진다.",
      "모델 라이선스와 상업 사용 조건을 배포 전 확인해야 한다.",
    ],
    sourceIds: ["qwen-docs", "qwen-quickstart", "youtube-qwen-search"],
  },
  {
    id: "cmd-mistral-api",
    providerId: "mistral",
    modelId: "mistral-medium-3-5",
    modelName: "Mistral Medium 3.5 / Devstral",
    surface: "공식 SDK",
    installCommand: "npm install @mistralai/mistralai",
    command:
      'curl https://api.mistral.ai/v1/chat/completions -H "Authorization: Bearer $MISTRAL_API_KEY" -H "Content-Type: application/json" -d \'{"model":"mistral-medium-3-5","messages":[{"role":"user","content":"이 TypeScript 모듈을 리뷰하고 테스트 케이스를 제안해줘"}]}\'',
    useCase:
      "공식 API/SDK로 코딩·에이전트·문서 QnA를 연결하고, 오픈웨이트 자체 배포 후보와 비교.",
    vibeCodingFit: "높음",
    setupNotes: [
      "Medium 3.5는 agentic/coding 모델 카드와 공식 단가가 공개되어 있다.",
      "Ministral 3는 로컬 배포 후보로, API와 자체 배포 비용을 별도로 비교한다.",
      "OCR/Document QnA 기능이 있는 업무는 Mistral 축에서 별도 평가한다.",
    ],
    caveats: [
      "Modified MIT 등 모델별 라이선스를 검토해야 한다.",
      "자체 배포는 토큰 단가가 아니라 GPU/운영 비용이 지배할 수 있다.",
    ],
    sourceIds: [
      "mistral-api",
      "mistral-medium-35",
      "mistral-ministral-3-14b",
      "youtube-mistral-ai",
    ],
  },
  {
    id: "cmd-manus-task",
    providerId: "manus",
    modelId: "api.manus.ai",
    modelName: "Manus Agent",
    surface: "웹/에이전트",
    installCommand:
      "MANUS_API_KEY=... # open.manus.ai에서 API 키 또는 웹앱 권한 준비",
    command:
      'Manus Task: "이 레포의 랜딩 페이지를 웹진형 AI 바이브 코딩 포털로 개편하고 스크린샷으로 결과를 보여줘"',
    useCase:
      "코드 명령어보다 브라우저 조작, 자료 수집, 슬라이드/웹사이트 제작 같은 태스크형 자동화.",
    vibeCodingFit: "보통",
    setupNotes: [
      "Manus API는 Tasks, Projects, Files, Webhooks, Skills, Agents 중심으로 설계한다.",
      "비개발자 업무 자동화와 PPT/웹페이지 제작 태스크를 따로 비교한다.",
      "결과물 검수와 권한/감사 로그를 별도 운영 절차로 둔다.",
    ],
    caveats: [
      "기저 모델 스펙이 모델 API처럼 공개되어 있지 않다.",
      "코드 diff 단위 검증보다 산출물/태스크 완료 검증이 중요하다.",
    ],
    sourceIds: ["manus-api", "manus-home", "youtube-manus-search"],
  },
];

export const aiCodingTools: AiCodingToolProfile[] = [
  {
    id: "tool-cursor",
    toolName: "Cursor",
    vendor: "Anysphere",
    category: "AI IDE",
    providerIds: ["cursor", "openai", "anthropic", "google"],
    pricing:
      "Hobby 무료, Pro/Teams/Enterprise. Pro는 월 $20 기준이며 학생 Pro 혜택은 별도 조건 확인.",
    eventSignal:
      "학생 1년 Pro 무료, Cloud agents/Bugbot/CLI 변경, Pro 포함 사용량과 on-demand usage 변동 감시.",
    bestFor: [
      "기존 저장소를 열어 바로 수정하는 바이브 코딩",
      "프론트엔드 화면 보정과 테스트 재실행",
      "팀 rules, MCP, Bugbot 리뷰까지 포함한 PR 루프",
    ],
    integrations: [
      "VS Code 계열 IDE",
      "Agent, Tab, Rules, MCP, Skills, Hooks",
      "Cloud agents, Bugbot, Cursor CLI",
    ],
    koreanResources: [
      "Cursor 한국어 YouTube 검색",
      "인프런 Cursor 강좌 검색",
      "코드팩토리/개발동생 AI 코딩 검색 허브",
    ],
    caveats: [
      "기저 모델 품질과 IDE 실행 표면 품질을 분리해 평가해야 한다.",
      "repo 권한, MCP 서버, 터미널 명령, privacy mode를 팀 정책으로 고정한다.",
    ],
    sourceIds: [
      "cursor-docs",
      "cursor-pricing",
      "cursor-changelog",
      "cursor-students",
      "youtube-cursor-korean-search",
      "inflearn-cursor",
    ],
    tags: ["Cursor", "AI IDE", "Agent", "Bugbot", "학생 혜택"],
  },
  {
    id: "tool-github-copilot",
    toolName: "GitHub Copilot",
    vendor: "GitHub",
    category: "IDE 확장",
    providerIds: ["openai", "anthropic", "google", "xai"],
    pricing:
      "Free, Student, Pro $10, Pro+ $39, Max $100, Business $19/seat, Enterprise $39/seat/month 기준.",
    eventSignal:
      "GitHub Education Copilot 신규 sign-up 일시 중단, Business self-serve pause, AI Credits/모델 제공 범위 변경 감시.",
    bestFor: [
      "VS Code/JetBrains/Visual Studio 안의 보편적 코드 보조",
      "GitHub PR, issue, code review, cloud agent 흐름",
      "팀/엔터프라이즈 정책과 감사 로그가 필요한 조직",
    ],
    integrations: [
      "VS Code, Visual Studio, JetBrains, Eclipse, Xcode, Vim/Neovim",
      "GitHub.com, GitHub Mobile, Copilot CLI",
      "MCP, cloud agent, code review, Spark",
    ],
    koreanResources: [
      "GitHub Copilot 한국어 YouTube 검색",
      "인프런 GitHub Copilot 강좌 검색",
      "GitHub Student Developer Pack",
    ],
    caveats: [
      "Free/Student 모델과 Pro/Business/Enterprise 모델 제공 범위가 다르며 변경될 수 있다.",
      "학생 혜택과 신규 가입 가능 여부는 GitHub Education 페이지에서 재확인해야 한다.",
    ],
    sourceIds: [
      "github-copilot-docs",
      "github-copilot-plans",
      "github-education-pack",
      "youtube-copilot-korean-search",
      "inflearn-github-copilot",
    ],
    tags: ["Copilot", "GitHub", "AI Credits", "MCP", "Student"],
  },
  {
    id: "tool-jetbrains-junie",
    toolName: "JetBrains AI / Junie",
    vendor: "JetBrains",
    category: "AI IDE",
    providerIds: ["openai", "google"],
    pricing:
      "JetBrains AI 플랜과 IDE 라이선스 정책을 함께 확인. 학생용 JetBrains 개발 도구 혜택은 별도 학생 팩에서 확인.",
    eventSignal:
      "Junie 지원 IDE, AI Assistant 플랜, JetBrains 학생 팩, Gemini/OpenAI 모델 통합 변경 감시.",
    bestFor: [
      "IntelliJ, WebStorm, PyCharm, GoLand 중심 개발팀",
      "IDE 인덱스와 리팩터링 도구를 깊게 쓰는 JVM/백엔드 프로젝트",
      "JetBrains 생태계에서 AI 코딩 에이전트를 쓰려는 팀",
    ],
    integrations: [
      "JetBrains IDEs",
      "Junie coding agent",
      "AI Assistant, Mellum, OpenAI/Google 모델 연동",
    ],
    koreanResources: [
      "JetBrains Junie 한국어 YouTube 검색",
      "인프런 JetBrains AI 검색",
      "GitHub Education JetBrains 학생 혜택",
    ],
    caveats: [
      "IDE별 지원 기능과 플랜 제공 범위가 다를 수 있다.",
      "VS Code 중심 강좌보다 JetBrains 한국어 실습 자료가 적어 검색 허브 추적이 필요하다.",
    ],
    sourceIds: [
      "jetbrains-ai",
      "jetbrains-junie",
      "jetbrains-student-pack",
      "github-education-pack",
      "youtube-jetbrains-junie-korean-search",
      "inflearn-jetbrains-ai",
    ],
    tags: ["JetBrains", "Junie", "IntelliJ", "WebStorm", "학생 혜택"],
  },
  {
    id: "tool-amazon-q-developer",
    toolName: "Amazon Q Developer",
    vendor: "AWS",
    category: "IDE 확장",
    providerIds: ["anthropic"],
    pricing:
      "Free tier와 Pro $19/user/month. Free는 월 agentic request/변환 LOC 제한, Pro는 더 높은 한도와 관리자 기능 제공.",
    eventSignal:
      "Free tier agentic request, Pro 포함 LOC, Java/.NET transformation overage, AWS Builder ID 무료 로그인 조건 감시.",
    bestFor: [
      "AWS 아키텍처와 코드베이스를 같이 다루는 개발",
      "Java/.NET 업그레이드와 보안 취약점 스캔",
      "AWS Console, IDE, CLI를 같이 쓰는 클라우드 팀",
    ],
    integrations: [
      "VS Code, JetBrains, Visual Studio, Eclipse",
      "AWS Console, AWS docs/site, AWS Chatbot",
      "Amazon Bedrock 기반 Q Developer",
    ],
    koreanResources: [
      "Amazon Q Developer 한국어 YouTube 검색",
      "인프런 Amazon Q Developer 검색",
      "AWS Bedrock 한국어 문서",
    ],
    caveats: [
      "AWS 권한과 IAM Identity Center 설정에 따라 기능 접근과 과금 시작 조건이 달라질 수 있다.",
      "Free/Pro의 LOC와 agentic request 한도는 월별 운영 지표로 따로 본다.",
    ],
    sourceIds: [
      "amazon-q-developer-docs",
      "amazon-q-developer-pricing",
      "aws-bedrock-ko",
      "youtube-amazon-q-korean-search",
      "inflearn-amazon-q",
    ],
    tags: ["AWS", "Amazon Q", "IDE", "CLI", "Java upgrade"],
  },
  {
    id: "tool-gemini-code-assist-jules",
    toolName: "Gemini Code Assist / Jules",
    vendor: "Google",
    category: "클라우드 에이전트",
    providerIds: ["google"],
    pricing:
      "Gemini Code Assist Standard 월 $22.80/user, 30일 무료 체험 가능. Jules 사용량/limits는 별도 문서 확인.",
    eventSignal:
      "Gemini Code Assist trial, Gemini CLI 라이선스 연동, Jules usage limits, Google 학생/교육 혜택 감시.",
    bestFor: [
      "Google Cloud, Firebase, Apigee, BigQuery 개발 흐름",
      "Gemini CLI와 IDE chat/completion을 함께 쓰는 팀",
      "GitHub repo를 VM에서 비동기 수정하는 Jules 작업",
    ],
    integrations: [
      "VS Code, JetBrains IDEs, Cloud Workstations",
      "Gemini CLI",
      "Jules GitHub integration, REST API, scheduled tasks",
    ],
    koreanResources: [
      "Gemini Code Assist 한국어 제품 페이지",
      "Google Developers Korea YouTube",
      "Gemini API 한국어 문서",
    ],
    caveats: [
      "Code Assist와 Gemini API 가격/한도는 다른 제품 축으로 관리한다.",
      "Jules는 실험적 coding agent로 repo 권한과 VM 환경 설정을 별도 검토한다.",
    ],
    sourceIds: [
      "gemini-code-assist-ko",
      "google-jules-docs",
      "gemini-cli-github",
      "google-gemini-docs-ko",
      "youtube-google-developers-korea",
    ],
    tags: ["Gemini", "Code Assist", "Jules", "Google Cloud", "CLI"],
  },
  {
    id: "tool-sourcegraph-amp",
    toolName: "Amp",
    vendor: "Sourcegraph",
    category: "CLI/터미널",
    providerIds: ["openai", "anthropic"],
    pricing:
      "Amp 자체 사용 정책은 manual/pricing 확인. Sourcegraph enterprise는 starting at $16K와 AI credits 포함 안내.",
    eventSignal:
      "Amp 모델 모드, Oracle/subagents, Sourcegraph credit pooling, MCP/CLI/agents 연동 변경 감시.",
    bestFor: [
      "터미널 중심 장시간 coding agent 작업",
      "Oracle, subagents, thread sharing을 쓰는 리뷰/탐색",
      "대형 codebase context를 Sourcegraph와 같이 쓰는 엔터프라이즈 팀",
    ],
    integrations: [
      "Amp CLI",
      "VS Code/Cursor/Windsurf, JetBrains, Neovim, Zed",
      "Sourcegraph MCP, code graph, Deep Search",
    ],
    koreanResources: [
      "Amp/Sourcegraph 한국어 검색 후보는 AI 코딩 검색 허브에서 추적",
      "Cursor/Claude Code/Codex 한국어 채널과 병행 비교",
    ],
    caveats: [
      "Amp 매뉴얼의 모델/모드 설명은 제품 정책에 맞춰 자주 바뀔 수 있다.",
      "Sourcegraph 가격은 엔터프라이즈 영업/크레딧 구조라 개인 도구와 직접 비교하기 어렵다.",
    ],
    sourceIds: ["sourcegraph-amp-manual", "sourcegraph-pricing"],
    tags: ["Amp", "Sourcegraph", "CLI", "Subagents", "MCP"],
  },
  {
    id: "tool-zed-ai",
    toolName: "Zed AI",
    vendor: "Zed",
    category: "AI IDE",
    providerIds: ["openai", "anthropic"],
    pricing:
      "Zed AI 사용 비용은 Zed 계정/모델/API 설정 기준으로 별도 확인. ACP 기반 외부 agent 연결 가능.",
    eventSignal:
      "ACP, Claude Agent/Codex/OpenCode 연동, agentic editing, MCP support, review diff 기능 변경 감시.",
    bestFor: [
      "빠른 Rust 기반 editor와 agentic editing을 함께 쓰는 개발자",
      "실시간 협업과 AI agent 진행 상황을 같이 보는 팀",
      "Codex/Claude/OpenCode 등 외부 agent를 editor 안에 붙이는 실험",
    ],
    integrations: [
      "Zed Agent Panel",
      "ACP, MCP",
      "Claude Agent, Codex, OpenCode",
    ],
    koreanResources: [
      "Zed AI 한국어 자료는 일반 AI IDE/바이브 코딩 검색 허브에서 추적",
      "해외 공식 문서 중심으로 우선 검증",
    ],
    caveats: [
      "Zed 자체 LLM이 아니라 editor/agent host 성격이 강하다.",
      "팀에서 이미 VS Code/JetBrains 표준이면 전환 비용을 따로 계산한다.",
    ],
    sourceIds: ["zed-ai"],
    tags: ["Zed", "ACP", "Agentic editing", "MCP"],
  },
  {
    id: "tool-augment-code",
    toolName: "Augment Code",
    vendor: "Augment",
    category: "클라우드 에이전트",
    providerIds: ["openai", "anthropic", "google"],
    pricing:
      "Business $100/month flat, up to 50 seats, $100/month usage included, top-ups/pay as you go. Enterprise custom.",
    eventSignal:
      "Cosmos, Auggie CLI, Context Engine, usage top-up, enterprise/compliance 기능과 가격 변경 감시.",
    bestFor: [
      "큰 코드베이스 맥락을 Context Engine으로 잡아야 하는 팀",
      "Auggie CLI와 IDE/Slack/PR 리뷰를 함께 쓰는 엔터프라이즈 SDLC",
      "반복 workflow automation과 ticket-to-PR 흐름",
    ],
    integrations: [
      "VS Code, JetBrains, Vim/Neovim",
      "Auggie CLI, Cosmos, Context Engine MCP",
      "Slack, Code Review, admin analytics",
    ],
    koreanResources: [
      "Augment 한국어 YouTube 검색",
      "공식 문서와 가격표 중심 검증",
    ],
    caveats: [
      "가격은 사용량 포함/초과 과금 구조라 좌석당 단순 비교가 어렵다.",
      "엔터프라이즈 자동화는 권한과 감사 로그 설계가 먼저다.",
    ],
    sourceIds: [
      "augment-docs",
      "augment-pricing",
      "youtube-augment-korean-search",
    ],
    tags: ["Augment", "Auggie", "Cosmos", "Context Engine", "Enterprise"],
  },
  {
    id: "tool-tabnine",
    toolName: "Tabnine",
    vendor: "Tabnine",
    category: "IDE 확장",
    providerIds: ["openai", "anthropic", "google", "mistral"],
    pricing:
      "Code Assistant $39/user/month, Agentic Platform $59/user/month annual subscription 기준. 자체 LLM 사용 시 별도 quota/handling fee 조건 확인.",
    eventSignal:
      "Tabnine CLI, Agentic Platform, Context Engine, air-gapped/VPC/on-prem 배포, zero retention 정책 변경 감시.",
    bestFor: [
      "코드 프라이버시와 자체 배포 요구가 강한 조직",
      "IDE completion/chat을 빠르게 표준화하려는 팀",
      "on-prem/air-gapped 환경의 AI coding assistant",
    ],
    integrations: [
      "All major IDEs",
      "Tabnine CLI",
      "Jira, Confluence, Git providers, MCP",
    ],
    koreanResources: [
      "Tabnine 한국어 YouTube 검색",
      "해외 공식 문서와 privacy/enterprise 문서 중심 검증",
    ],
    caveats: [
      "개인 바이브 코딩보다 엔터프라이즈 보안/배포 요구에 강점이 있다.",
      "무제한 사용 조건은 자체 LLM/on-prem 여부에 따라 다르게 해석해야 한다.",
    ],
    sourceIds: [
      "tabnine-docs",
      "tabnine-pricing",
      "youtube-tabnine-korean-search",
    ],
    tags: ["Tabnine", "Privacy", "On-prem", "CLI", "Enterprise"],
  },
  {
    id: "tool-coderabbit",
    toolName: "CodeRabbit",
    vendor: "CodeRabbit",
    category: "PR 리뷰",
    providerIds: ["openai", "anthropic"],
    pricing:
      "Pro/Pro Plus/Enterprise. 공개 저장소 무료 리뷰, Slack agent는 agent minute 기준 과금.",
    eventSignal:
      "OSS free review, Slack agent minute, Pro/Pro Plus review limit, Autofix/UTG/merge conflict 기능 변경 감시.",
    bestFor: [
      "PR 리뷰, 요약, walkthrough, pre-merge checks 자동화",
      "IDE/CLI에서 리뷰 피드백을 빠르게 받는 팀",
      "issue/Slack에서 계획과 PR 생성까지 연결하는 흐름",
    ],
    integrations: [
      "GitHub, GitLab",
      "IDE review extension, CLI review tool",
      "Slack agent, Jira, Linear, MCP/tool catalog",
    ],
    koreanResources: [
      "CodeRabbit 한국어 YouTube 검색",
      "인프런 CodeRabbit 검색",
    ],
    caveats: [
      "구현 agent가 아니라 code review/planning에 강한 도구로 분류한다.",
      "리뷰 자동화는 팀 coding standard와 false positive 관리가 중요하다.",
    ],
    sourceIds: [
      "coderabbit-docs",
      "coderabbit-pricing",
      "youtube-coderabbit-korean-search",
      "inflearn-coderabbit",
    ],
    tags: ["CodeRabbit", "PR review", "Autofix", "Slack agent", "OSS"],
  },
  {
    id: "tool-trae",
    toolName: "TRAE",
    vendor: "TRAE",
    category: "AI IDE",
    providerIds: ["anthropic", "openai"],
    pricing:
      "Free/Lite $3, Pro $10 after 7-day trial, Pro+ $30, Ultra $100/month. Basic usage와 cloud task 동시 실행 수 차등.",
    eventSignal:
      "Pro 7일 무료 체험, SOLO mode, cloud task concurrency, Basic/Bonus usage, Model early access 변경 감시.",
    bestFor: [
      "SOLO mode 중심의 AI IDE 실험",
      "cloud task 동시 실행으로 여러 개발 작업을 돌리는 개인/소규모 팀",
      "Cursor/Windsurf와 비교할 신규 AI IDE 후보",
    ],
    integrations: [
      "TRAE IDE",
      "SOLO mode",
      "TRAE Work Web/Desktop cloud tasks",
    ],
    koreanResources: ["TRAE 한국어 YouTube 검색", "인프런 TRAE 검색"],
    caveats: [
      "공식 문서/가격 페이지의 플랜명과 usage 단위가 바뀔 수 있어 주기 확인이 필요하다.",
      "한국어 강좌/커뮤니티 자료는 아직 검색 허브로 추적하는 단계다.",
    ],
    sourceIds: [
      "trae-docs",
      "trae-pricing",
      "youtube-trae-korean-search",
      "inflearn-trae",
    ],
    tags: ["TRAE", "SOLO", "AI IDE", "Cloud tasks", "Trial"],
  },
  {
    id: "tool-open-source-agent-stack",
    toolName: "Cline / Roo Code / Aider / Continue / OpenHands",
    vendor: "Open-source ecosystem",
    category: "오픈소스 스택",
    providerIds: ["openai", "anthropic", "google", "kimi", "deepseek", "qwen"],
    pricing:
      "도구는 오픈소스 중심. 비용은 연결한 API 모델, 로컬 GPU, 자체 호스팅, MCP/서빙 인프라에 따라 달라짐.",
    eventSignal:
      "GitHub release, model provider 지원, MCP/tool calling, VS Code extension 정책, 로컬 실행 가이드 변경 감시.",
    bestFor: [
      "모델을 직접 고르고 OpenAI 호환 API를 바꿔가며 실험",
      "저비용/로컬/사내망 코딩 agent 구성",
      "Cursor/Copilot에 종속되지 않는 개발 워크플로",
    ],
    integrations: [
      "VS Code extensions",
      "Terminal Git workflow",
      "OpenAI-compatible APIs, local models, MCP",
    ],
    koreanResources: [
      "Cline/Roo Code 한국어 YouTube 검색",
      "인프런 Cline 검색",
      "Kimi/DeepSeek/Qwen 한국어 검색 허브",
    ],
    caveats: [
      "품질과 보안은 연결 모델, permission 설정, repo 규칙에 크게 좌우된다.",
      "직접 운영 시 업데이트/보안 패치/키 관리 책임이 커진다.",
    ],
    sourceIds: [
      "cline-github",
      "roo-code-docs",
      "aider-docs",
      "continue-docs",
      "openhands-docs",
      "youtube-cline-roo-korean-search",
      "inflearn-cline",
    ],
    tags: ["Cline", "Roo Code", "Aider", "Continue", "OpenHands"],
  },
  {
    id: "tool-web-app-builders",
    toolName: "Lovable / Bolt / v0",
    vendor: "Lovable, StackBlitz, Vercel",
    category: "웹앱 제작",
    providerIds: ["openai", "anthropic"],
    pricing:
      "도구별 무료/유료 플랜과 배포/크레딧 정책 상이. 실제 비용은 생성 횟수, 배포, 팀 기능, 모델 사용량을 같이 확인.",
    eventSignal:
      "신규 사용자 크레딧, 생성 한도, GitHub export, Vercel/StackBlitz 배포, 팀 플랜 이벤트 변경 감시.",
    bestFor: [
      "랜딩 페이지와 CRUD 웹앱의 빠른 초안",
      "디자인 시안과 프론트엔드 구조를 프롬프트로 생성",
      "비개발자와 개발자가 함께 요구사항을 시각화",
    ],
    integrations: [
      "Lovable projects and integrations",
      "Bolt app generation and deployment",
      "v0 UI generation and Vercel workflow",
    ],
    koreanResources: [
      "v0/Lovable/Bolt 한국어 YouTube 검색",
      "인프런 v0 검색",
      "인프런 Lovable 검색",
    ],
    caveats: [
      "초안 생성과 운영 가능한 제품 코드는 품질 기준이 다르다.",
      "라우팅, auth, DB, 배포 권한, 비용 한도는 개발자가 별도 검수해야 한다.",
    ],
    sourceIds: [
      "lovable-docs",
      "bolt-docs",
      "v0-docs",
      "youtube-v0-lovable-bolt-korean-search",
      "inflearn-v0",
      "inflearn-lovable",
    ],
    tags: ["Lovable", "Bolt", "v0", "웹앱", "프로토타입"],
  },
  {
    id: "tool-cloud-agents",
    toolName: "Devin / Replit Agent / Manus",
    vendor: "Cognition, Replit, Manus",
    category: "클라우드 에이전트",
    providerIds: ["manus", "openai", "anthropic"],
    pricing:
      "제품별 task/session/credit/seat 구조가 달라 공식 가격과 사용량 로그를 함께 확인해야 함.",
    eventSignal:
      "초대/크레딧, cloud workspace limits, GitHub/Slack 연동, 태스크 병렬 실행, 브라우저 조작 기능 변경 감시.",
    bestFor: [
      "로컬 노트북을 켜두지 않는 비동기 개발/자동화",
      "issue-to-PR, 브라우저 조작, 웹사이트/PPT 산출물 제작",
      "비개발자도 태스크 단위로 결과를 검수하는 업무",
    ],
    integrations: [
      "GitHub repositories",
      "Slack/웹앱/브라우저",
      "Files, webhooks, project instructions",
    ],
    koreanResources: [
      "헤르메스 에이전트 사용자 요청 영상",
      "Manus/AI agent 한국어 YouTube 검색",
      "국내 AI 자동화 커뮤니티 검색 허브",
    ],
    caveats: [
      "모델 벤치마크보다 태스크 완료율, 권한, 비용, 감사 로그가 핵심 지표다.",
      "자동 브라우저/파일 조작 권한은 민감 데이터와 분리해야 한다.",
    ],
    sourceIds: [
      "devin-docs",
      "replit-agent-docs",
      "manus-home",
      "manus-api",
      "youtube-hermes-agent-video",
      "youtube-manus-search",
    ],
    tags: ["Devin", "Replit Agent", "Manus", "Cloud agent", "Task automation"],
  },
];

export const comparisonRows: ComparisonRow[] = [
  {
    id: "positioning",
    axis: "포지셔닝",
    cells: {
      openai: "범용 프런티어 모델 + 가장 넓은 도구/개발자 생태계",
      anthropic: "장기 추론·고자율 업무와 안전/fallback 설계 중심",
      google: "멀티모달 입력, 검색 grounding, Google 생태계 연계",
      xai: "빠른 응답, X/Web 검색 결합, 저렴한 고속 API",
      manus: "모델 API보다 태스크 실행형 에이전트 플랫폼",
      kimi: "장문 코딩과 멀티모달 에이전트 작업에 강한 OpenAI 호환 API",
      deepseek: "1M 컨텍스트와 매우 낮은 공식 단가의 장문/대량 처리 후보",
      qwen: "오픈웨이트, 로컬 실행, 다국어 생태계가 강한 모델군",
      mistral: "유럽 기반 오픈웨이트·자체 배포·문서/OCR 워크로드 후보",
      cursor: "모델 API가 아니라 IDE/Agent/Cloud/Bugbot 기반 코딩 실행 표면",
    },
  },
  {
    id: "input",
    axis: "입력 모달리티",
    cells: {
      openai: "텍스트, 이미지",
      anthropic: "텍스트, 이미지",
      google: "텍스트, 이미지, 비디오, 오디오, PDF",
      xai: "텍스트, 이미지",
      manus: "태스크 메시지, 파일, 프로젝트 컨텍스트",
      kimi: "텍스트, 이미지, 비디오",
      deepseek: "텍스트 중심 Chat/API",
      qwen: "텍스트, 비전/오디오 등 모델군별 멀티모달",
      mistral: "텍스트, 이미지, 문서/OCR 중심 멀티모달",
      cursor: "로컬 repo, diff, 터미널, 브라우저, IDE 상태, 팀 컨텍스트",
    },
  },
  {
    id: "tools",
    axis: "도구/액션",
    cells: {
      openai: "웹 검색, 파일 검색, 코드, 컴퓨터 사용, MCP",
      anthropic: "fallback, 플랫폼별 Claude 도구/연동",
      google: "검색 grounding, Maps, 코드 실행, URL context",
      xai: "Web Search, X Search, Code Execution, RAG Collections",
      manus: "Tasks, Files, Webhooks, Skills, Agents",
      kimi: "OpenAI 호환 tool calls, 멀티모달 tool result",
      deepseek: "JSON output, Tool Calls, Prefix Completion, FIM",
      qwen: "Qwen-Agent, Function Calling, LangChain/LlamaIndex",
      mistral: "Function Calling, Agents, Built-In Tools, OCR, FIM",
      cursor: "Agents, Tab, Rules, MCP, Skills, Hooks, Cloud agents, Bugbot",
    },
  },
  {
    id: "korean-workflow",
    axis: "한국어 실무 추천",
    cells: {
      openai: "기획·코딩·문서 자동화의 기본 기준선",
      anthropic: "긴 문서, 정책 민감한 업무, 에이전트 안정성",
      google: "영상/PDF/검색 기반 자료 조사",
      xai: "최신 이슈·X 여론·저비용 대량 요약",
      manus: "비개발자 업무 자동화와 브라우저 조작형 태스크",
      kimi: "코딩 에이전트와 영상/이미지 기반 코드 분석",
      deepseek: "대량 한국어 요약, 로그/문서 장문 처리, 비용 절감",
      qwen: "한국어 포함 다국어 로컬 모델 실험과 자체 호스팅",
      mistral: "보안 민감 문서 QnA, 유럽/온프레미스 전략, OCR",
      cursor:
        "실제 repo 수정, 프론트엔드 화면 보정, PR 리뷰, 학생/팀 바이브 코딩",
    },
  },
  {
    id: "risk",
    axis: "주의점",
    cells: {
      openai: "긴 입력 고가 과금과 전용 멀티미디어 모델 구분",
      anthropic: "Fable 5 refusal 처리를 성공 응답으로 처리",
      google: "Preview 모델 품질 변동과 모델별 지원 기능 차이",
      xai: "검색 도구 없이는 최신 이벤트 접근 불가",
      manus: "기저 모델 스펙 대신 서비스 SLA·권한·보안 검토 필요",
      kimi: "K2.7 Code 파라미터 제약과 가격표 수동 확인 필요",
      deepseek: "레거시 모델명 지원 중단과 캐시 hit/miss 가격 구분",
      qwen: "모델 크기·양자화·서빙 환경별 품질 편차",
      mistral: "오픈웨이트 라이선스와 자체 배포 운영 비용 검토",
      cursor: "기저 모델 비용·품질과 IDE/Agent 권한·보안 정책을 분리 평가",
    },
  },
];

export const manualGuides: ManualGuide[] = [
  {
    id: "manual-model-choice",
    title: "업무별 모델 선택 5단계",
    providerId: "openai",
    level: "입문",
    summary:
      "비용, 최신성, 멀티모달, 도구 호출, 출력 품질을 순서대로 좁혀 모델을 고르는 실무 체크리스트.",
    steps: [
      "업무가 리서치, 코딩, 문서 분석, 자동화 중 어디에 가까운지 고른다.",
      "최신 정보가 필요하면 검색 도구 지원 여부를 먼저 본다.",
      "PDF·영상·오디오가 핵심이면 Gemini 계열을 우선 검토한다.",
      "장기 자율 실행과 안전 설계가 중요하면 Claude fallback 처리를 설계한다.",
      "코딩 에이전트는 GPT/Claude/Kimi/Mistral을, 오픈웨이트 자체 배포는 Qwen/Mistral/Ministral을 별도 평가한다.",
      "대량 처리라면 Grok, Gemini Flash, DeepSeek V4 Flash, mini/nano 계열의 blended cost를 비교한다.",
    ],
    sourceIds: [
      "openai-models",
      "anthropic-models",
      "google-models",
      "xai-models",
      "kimi-models",
      "deepseek-pricing",
      "qwen-docs",
      "mistral-models",
    ],
  },
  {
    id: "manual-claude-fallback",
    title: "Claude Fable 5 refusal/fallback 처리",
    providerId: "anthropic",
    level: "실무",
    summary:
      "Fable 5의 거절은 에러가 아니라 성공 응답의 stop_reason이므로, UI와 재시도 로직을 별도 설계한다.",
    steps: [
      "Messages API 응답에서 stop_reason이 refusal인지 확인한다.",
      "사용자에게 정책상 처리 불가와 대체 경로를 짧게 안내한다.",
      "서버-side fallbacks 또는 SDK middleware로 대체 Claude 모델을 호출한다.",
      "재시도와 fallback credit은 로그에 남겨 비용과 품질을 추적한다.",
    ],
    sourceIds: ["anthropic-fable5"],
  },
  {
    id: "manual-grounded-research",
    title: "검색 grounding 리서치 흐름",
    providerId: "google",
    level: "실무",
    summary:
      "최신성·출처가 중요한 한국어 리서치에서는 검색 grounding 모델과 별도 출처 패널을 함께 설계한다.",
    steps: [
      "질문을 사실 확인형, 비교형, 요약형으로 분류한다.",
      "검색 grounding 또는 Web/X Search 도구를 명시적으로 켠다.",
      "답변 본문과 출처 목록을 분리해 UI에 표시한다.",
      "출처 확인일과 모델 지식 기준일을 함께 노출한다.",
    ],
    sourceIds: ["google-gemini31", "xai-grok43"],
  },
  {
    id: "manual-manus-task",
    title: "Manus 태스크 API 설계",
    providerId: "manus",
    level: "고급",
    summary:
      "Manus는 LLM 호출보다 태스크 생명주기, 파일, 웹훅, 프로젝트 지시를 중심으로 설계한다.",
    steps: [
      "반복 업무를 Task 단위로 정의하고 입력 파일과 목표 산출물을 명확히 쓴다.",
      "반복 지시는 Project에 저장해 태스크마다 중복 입력을 줄인다.",
      "완료·사용자 입력 필요 이벤트는 Webhook으로 받는다.",
      "중요 자동화는 권한, 감사 로그, 데이터 보관 정책을 별도로 검토한다.",
    ],
    sourceIds: ["manus-api"],
  },
  {
    id: "manual-kimi-coding-agent",
    title: "Kimi K2.7 Code 코딩 에이전트 연결",
    providerId: "kimi",
    level: "실무",
    summary:
      "Kimi는 OpenAI SDK 호환 base URL을 쓰되 K2.7 Code의 thinking, temperature, tool_choice 제약을 코드에 반영한다.",
    steps: [
      "OpenAI SDK 클라이언트의 base URL을 https://api.moonshot.ai/v1 로 바꾸고 MOONSHOT_API_KEY를 분리 저장한다.",
      "코딩 작업은 kimi-k2.7-code, 빠른 반복은 kimi-k2.7-code-highspeed 후보로 나누어 테스트한다.",
      "K2.7 Code는 thinking 비활성화가 불가하므로 요청 파라미터를 기본값 중심으로 유지한다.",
      "도구 호출은 tool_choice auto/none 범위에서 설계하고 reasoning_content가 필요한 멀티스텝 컨텍스트를 보존한다.",
      "영상/이미지 입력은 파일 크기와 해상도 제한, 토큰 추정 API를 함께 검토한다.",
    ],
    sourceIds: ["kimi-k27-code", "kimi-models", "youtube-kimi-search"],
  },
  {
    id: "manual-deepseek-v4-migration",
    title: "DeepSeek V4 전환과 레거시 이름 정리",
    providerId: "deepseek",
    level: "실무",
    summary:
      "deepseek-chat/deepseek-reasoner 호환 이름을 V4 Flash 명시 모델명으로 바꾸고, cache hit/miss 비용을 운영 지표로 분리한다.",
    steps: [
      "신규 호출은 deepseek-v4-flash 또는 deepseek-v4-pro로 명시한다.",
      "OpenAI 형식은 https://api.deepseek.com, Anthropic 형식은 https://api.deepseek.com/anthropic base URL을 사용한다.",
      "2026-07-24 15:59 UTC 레거시 이름 중단 전에 deepseek-chat/reasoner 의존 코드를 찾아 교체한다.",
      "대량 반복 요청은 cache hit 입력 단가와 cache miss 입력 단가를 분리해 비용 대시보드에 기록한다.",
      "FIM은 non-thinking mode 제한이 있으므로 코딩 자동완성 흐름을 별도 테스트한다.",
    ],
    sourceIds: [
      "deepseek-pricing",
      "deepseek-updates",
      "youtube-deepseek-search",
    ],
  },
  {
    id: "manual-qwen-local-eval",
    title: "Qwen 오픈웨이트 로컬 평가",
    providerId: "qwen",
    level: "고급",
    summary:
      "Qwen은 모델 크기, thinking/instruct 분리, 양자화, 서빙 프레임워크에 따라 결과가 크게 달라지므로 평가 매트릭스를 먼저 만든다.",
    steps: [
      "업무가 일반 챗, 추론, 코딩, 도구 사용, 멀티모달 중 어디인지 나눈다.",
      "Qwen3-2507 Instruct-only와 Thinking-only 후보를 별도 평가한다.",
      "로컬 실행은 Ollama/LM Studio, 서버 배포는 vLLM/SGLang/TGI 후보를 나누어 측정한다.",
      "한국어 품질, 응답 속도, GPU 메모리, 컨텍스트 길이, 함수 호출 안정성을 같은 표로 기록한다.",
      "Hugging Face/ModelScope/GitHub 모델 카드의 라이선스와 상업 사용 조건을 배포 전 확인한다.",
    ],
    sourceIds: ["qwen-docs", "youtube-qwen-search", "wikidocs"],
  },
  {
    id: "manual-mistral-open-weight",
    title: "Mistral/Ministral 오픈웨이트 도입 체크",
    providerId: "mistral",
    level: "고급",
    summary:
      "Mistral Medium 3.5, Small 4, Ministral 3는 API 가격과 자체 배포 비용이 다르므로 라이선스, GPU, 보안 요구사항을 함께 계산한다.",
    steps: [
      "고성능 코딩/에이전트는 Mistral Medium 3.5, 비용 효율은 Small 4, 로컬 배포는 Ministral 3 14B/8B/3B를 후보로 잡는다.",
      "문서 QnA와 OCR이 필요하면 Mistral의 OCR/Document QnA 기능 지원 여부를 먼저 확인한다.",
      "API 사용 시 공식 입력/출력 단가를 계산기에 넣고, 자체 배포 시 GPU/서빙/모니터링 비용을 별도 산정한다.",
      "Modified MIT 등 모델별 라이선스와 데이터 반출 정책을 법무/보안 체크리스트에 포함한다.",
      "한국어 자료가 부족한 경우 Mistral 공식 문서와 한국어 자체 검증 리포트를 함께 남긴다.",
    ],
    sourceIds: [
      "mistral-models",
      "mistral-medium-35",
      "mistral-small-4",
      "mistral-ministral-3-14b",
      "youtube-mistral-ai",
    ],
  },
];

export const personaGuides: PersonaGuide[] = [
  {
    id: "persona-developer",
    role: "개발자",
    title: "코드 리뷰와 구현 보조 플레이북",
    summary:
      "코드베이스 맥락, 테스트 실패 로그, 변경 범위를 함께 넣고 구현/리뷰/검증을 분리해 모델을 운용한다.",
    providerIds: [
      "openai",
      "anthropic",
      "google",
      "kimi",
      "deepseek",
      "mistral",
    ],
    recommendedModelIds: ["gpt-55", "claude-fable-5", "kimi-k27-code"],
    alternateModelIds: [
      "gemini-31-pro",
      "deepseek-v4-flash",
      "mistral-medium-35",
    ],
    workflow: [
      "요구사항, 관련 파일, 실패 로그를 한 번에 제공하고 수정 범위를 제한한다.",
      "구현 요청과 코드 리뷰 요청을 분리해 산출물의 관점을 바꾼다.",
      "테스트 명령과 기대 결과를 프롬프트에 포함해 검증 가능한 답변을 유도한다.",
      "대규모 리팩터링은 먼저 영향 범위 표를 받고 작은 패치로 나눈다.",
    ],
    promptExamples: [
      "이 diff를 기능 회귀와 누락된 테스트 관점으로 리뷰하고, 파일/라인 기준으로 위험만 먼저 알려줘.",
      "아래 실패 로그를 기준으로 최소 수정안을 제안하고, 수정 후 어떤 테스트를 다시 돌릴지 적어줘.",
    ],
    checklist: [
      "모델이 존재하지 않는 API를 만들지 않았는가",
      "테스트·타입 체크·빌드 중 최소 하나 이상의 검증 명령이 명시되었는가",
      "보안 키, 사용자 데이터, 파괴적 명령이 답변에 섞이지 않았는가",
    ],
    sourceIds: [
      "openai-models",
      "anthropic-models",
      "google-models",
      "openai-videos",
      "kimi-k27-code",
      "deepseek-pricing",
      "mistral-medium-35",
    ],
  },
  {
    id: "persona-product-manager",
    role: "PM/기획자",
    title: "요구사항 정리와 의사결정 플레이북",
    summary:
      "긴 문서 요약, 사용자 시나리오, 선택지 비교는 Claude와 GPT를 기준선으로 두고 최신 시장 확인은 검색 모델로 보강한다.",
    providerIds: ["anthropic", "openai", "google", "manus", "mistral"],
    recommendedModelIds: ["claude-fable-5", "gpt-55", "gemini-31-pro"],
    alternateModelIds: ["manus-api-v2", "mistral-medium-35"],
    workflow: [
      "회의록과 고객 피드백을 문제, 근거, 결정 필요 항목으로 나눈다.",
      "각 선택지의 사용자 영향, 개발 비용, 리스크를 같은 축으로 비교한다.",
      "외부 트렌드나 경쟁사 정보는 검색 grounding 결과와 출처를 함께 확인한다.",
      "최종 PRD에는 범위 밖 항목과 검증 지표를 별도 섹션으로 둔다.",
    ],
    promptExamples: [
      "아래 고객 피드백을 JTBD, 불만 원인, 기회 영역, 실험 아이디어로 재분류해줘.",
      "세 가지 기능안을 사용자 가치, 구현 난이도, 데이터 리스크 기준으로 비교하고 추천안을 하나만 골라줘.",
    ],
    checklist: [
      "모델이 추정한 시장 사실에 출처와 확인일이 붙었는가",
      "결정안과 보류안을 명확히 분리했는가",
      "성공 지표가 행동 가능한 수치로 표현되었는가",
    ],
    sourceIds: [
      "anthropic-fable5",
      "openai-gpt55",
      "google-gemini31",
      "manus-home",
      "mistral-models",
    ],
  },
  {
    id: "persona-marketer",
    role: "마케터",
    title: "캠페인 기획과 콘텐츠 변형 플레이북",
    summary:
      "브랜드 톤과 금지 표현을 먼저 고정하고, 고품질 초안은 GPT/Claude, 대량 변형은 Gemini Flash와 Grok 비용을 비교한다.",
    providerIds: ["openai", "anthropic", "google", "xai", "deepseek"],
    recommendedModelIds: ["gpt-55", "gemini-31-pro", "grok-43"],
    alternateModelIds: ["claude-fable-5", "deepseek-v4-flash"],
    workflow: [
      "브랜드 톤, 대상 세그먼트, 금지 주장, 필수 CTA를 시스템처럼 고정한다.",
      "하나의 메시지를 랜딩, 이메일, 숏폼, 광고 문안으로 변형한다.",
      "대량 변형 전에는 비용 계산기로 월 토큰 예산을 먼저 산정한다.",
      "최신 이슈를 활용할 때는 검색 출처와 날짜를 본문 근거에서 분리한다.",
    ],
    promptExamples: [
      "아래 제품 설명을 20대 신규 사용자용 이메일 제목 10개와 본문 3개로 변형하되 과장 표현은 빼줘.",
      "같은 캠페인 메시지를 검색 광고, 소셜 캡션, 앱 푸시 톤으로 각각 5개씩 만들어줘.",
    ],
    checklist: [
      "의학·금융·법률처럼 검증이 필요한 주장을 자동 생성하지 않았는가",
      "브랜드 금지어와 필수 고지가 반영되었는가",
      "대량 생성 결과의 중복률과 비용을 확인했는가",
    ],
    sourceIds: [
      "openai-gpt55",
      "anthropic-fable5",
      "google-models",
      "xai-grok43",
      "deepseek-pricing",
    ],
  },
  {
    id: "persona-researcher",
    role: "리서처",
    title: "근거 기반 조사와 문헌 요약 플레이북",
    summary:
      "출처가 중요한 조사는 Gemini 검색 grounding과 긴 문서 처리 모델을 조합하고, 주장·근거·불확실성을 분리해 기록한다.",
    providerIds: ["google", "anthropic", "openai", "xai", "qwen", "mistral"],
    recommendedModelIds: ["gemini-31-pro", "claude-fable-5", "gpt-55"],
    alternateModelIds: ["grok-43", "qwen3-2507", "mistral-medium-35"],
    workflow: [
      "질문을 사실 확인, 원인 분석, 비교 평가, 가설 생성 중 하나로 분류한다.",
      "검색 기반 답변은 출처 URL, 발행일, 모델 확인일을 표로 남긴다.",
      "긴 논문이나 보고서는 먼저 구조 요약을 받고 세부 근거를 재질문한다.",
      "최종 산출물은 확인된 사실, 추론, 남은 불확실성으로 나눈다.",
    ],
    promptExamples: [
      "아래 자료의 주장, 근거, 한계, 후속 질문을 표로 정리하고 근거가 약한 문장을 표시해줘.",
      "이 주제의 최근 변화를 출처별로 비교하되 확인 날짜와 서로 충돌하는 내용을 따로 묶어줘.",
    ],
    checklist: [
      "원문 URL과 확인일이 빠지지 않았는가",
      "모델의 추론과 원문 근거가 섞이지 않았는가",
      "상충하는 출처를 하나의 결론으로 뭉개지 않았는가",
    ],
    sourceIds: [
      "google-gemini31",
      "anthropic-models",
      "openai-models",
      "xai-models",
      "qwen-docs",
      "mistral-models",
    ],
  },
  {
    id: "persona-ai-infra",
    role: "AI 인프라/플랫폼",
    title: "오픈웨이트와 API 혼합 운영 플레이북",
    summary:
      "폐쇄형 API, 오픈웨이트, 자체 배포 모델을 비용·보안·운영 책임 기준으로 나누어 평가한다.",
    providerIds: ["qwen", "mistral", "deepseek", "kimi", "google"],
    recommendedModelIds: [
      "qwen3-2507",
      "mistral-medium-35",
      "deepseek-v4-flash",
    ],
    alternateModelIds: ["ministral-3-14b", "kimi-k27-code"],
    workflow: [
      "업무별로 API 사용 가능 데이터와 자체 배포가 필요한 데이터를 분리한다.",
      "Qwen/Mistral/Ministral은 로컬·온프레미스 후보, DeepSeek/Kimi는 OpenAI 호환 API 후보로 평가한다.",
      "벤치마크 점수보다 GPU 메모리, latency, 캐시 hit율, 장애 대응, 라이선스를 먼저 기록한다.",
      "한국어 품질은 실제 내부 문서와 고객 질의 세트로 별도 평가한다.",
    ],
    promptExamples: [
      "아래 내부 문서 QnA 50개를 기준으로 오픈웨이트 모델 평가표를 만들고, 실패 유형을 보안/품질/속도로 나눠줘.",
      "API 모델과 자체 배포 모델의 월 비용을 입력/출력 토큰, GPU 비용, 운영 인력 기준으로 비교해줘.",
    ],
    checklist: [
      "모델 라이선스와 상업 사용 조건을 확인했는가",
      "민감 데이터가 외부 API로 나가는 경로를 분리했는가",
      "장애 시 fallback 모델과 품질 저하 안내가 준비되었는가",
    ],
    sourceIds: [
      "qwen-docs",
      "mistral-models",
      "mistral-ministral-3-14b",
      "deepseek-pricing",
      "kimi-k27-code",
      "aws-bedrock-ko",
    ],
  },
];

export const taskRecommendations: TaskRecommendation[] = [
  {
    id: "task-repo-fix",
    category: "coding",
    title: "기존 레포 버그 수정과 테스트 통과",
    userIntent:
      "이미 있는 코드베이스에서 실패 테스트, 타입 오류, 런타임 버그를 최소 수정으로 고치고 싶다.",
    primaryModelIds: ["cursor-ai-ide", "gpt-55", "claude-fable-5"],
    alternateModelIds: [
      "kimi-k27-code",
      "deepseek-v4-flash",
      "mistral-medium-35",
    ],
    commandIds: [
      "cmd-cursor-agent",
      "cmd-openai-codex",
      "cmd-claude-code",
      "cmd-kimi-openai-compatible",
    ],
    benchmarkDomains: ["coding", "agent"],
    resourceIds: [
      "res-cursor-docs",
      "res-aider-docs",
      "res-inflearn-ai-coding",
      "res-cursor-korean-youtube",
    ],
    rationale: [
      "Cursor는 IDE 안에서 파일·diff·터미널·리뷰 흐름을 붙이기 좋아 1차 실행 표면으로 적합하다.",
      "GPT와 Claude는 복잡한 수정과 리뷰/검증 루프의 기준선으로 둔다.",
      "Kimi, DeepSeek, Mistral은 OpenAI 호환 API 또는 공식 SDK로 비용/속도 실험 후보가 된다.",
    ],
    tradeoffs: [
      "Cursor는 기저 모델이 아니므로 품질 문제를 모델 탓과 IDE 실행 탓으로 분리해야 한다.",
      "장시간 자동 수정은 테스트 명령, 금지 리팩터링, destructive command 제한을 먼저 지정해야 한다.",
    ],
    promptStarter:
      "이 저장소에서 실패하는 테스트를 재현하고, 원인을 파일 단위로 좁힌 뒤 최소 수정 패치와 재검증 명령을 제안해줘.",
    sourceIds: [
      "cursor-docs",
      "cursor-changelog",
      "openai-codex-cli",
      "claude-code-docs",
      "kimi-k27-code",
      "mistral-medium-35",
    ],
  },
  {
    id: "task-new-vibe-app",
    category: "coding",
    title: "새 웹앱을 바이브 코딩으로 빠르게 만들기",
    userIntent:
      "기획은 대략 있고, 실제 화면과 라우팅, 데이터 흐름까지 빠르게 동작하는 앱을 만들고 싶다.",
    primaryModelIds: ["cursor-ai-ide", "gpt-55", "claude-fable-5"],
    alternateModelIds: ["gemini-31-pro", "manus-api-v2", "kimi-k27-code"],
    commandIds: [
      "cmd-cursor-agent",
      "cmd-openai-codex",
      "cmd-claude-code",
      "cmd-gemini-cli",
    ],
    benchmarkDomains: ["coding", "ppt", "agent"],
    resourceIds: [
      "res-lovable-bolt-v0-docs",
      "res-v0-lovable-bolt-korean-youtube",
      "res-inflearn-vibe-coding",
      "res-korean-creator-ai-youtube",
    ],
    rationale: [
      "Cursor와 Codex는 실제 repo 변경과 테스트 검증을 붙이기 쉽다.",
      "Claude는 긴 요구사항을 구조화하고 리팩터링 범위를 나누는 데 강하다.",
      "Gemini와 Manus는 이미지/PDF/브라우저 기반 산출물 검토와 태스크형 제작 후보로 둔다.",
    ],
    tradeoffs: [
      "처음부터 큰 화면을 한 번에 만들기보다 라우터, 핵심 상태, 검증 명령을 먼저 고정해야 한다.",
      "Lovable, Bolt, v0는 빠른 초안에는 좋지만 코드 소유권과 배포 구조를 별도 검수해야 한다.",
    ],
    promptStarter:
      "이 요구사항을 실제 사용 가능한 첫 화면으로 구현해줘. 라우터, 모바일 반응형, 빈 상태, 검증 명령까지 포함해줘.",
    sourceIds: [
      "cursor-docs",
      "openai-codex-cli",
      "claude-code-docs",
      "gemini-cli-github",
      "lovable-docs",
      "bolt-docs",
      "v0-docs",
    ],
  },
  {
    id: "task-ppt-webzine",
    category: "ppt",
    title: "PPT·웹진·문서 산출물 만들기",
    userIntent:
      "자료를 요약해 발표자료, 웹진형 페이지, 보고서 초안처럼 사람이 읽는 산출물로 만들고 싶다.",
    primaryModelIds: ["gemini-31-pro", "gpt-55", "manus-api-v2"],
    alternateModelIds: ["claude-fable-5", "mistral-medium-35"],
    commandIds: ["cmd-gemini-cli", "cmd-manus-task", "cmd-openai-codex"],
    benchmarkDomains: ["ppt", "multimodal", "research"],
    resourceIds: [
      "res-gemini-docs-ko",
      "res-hermes-agent-video",
      "res-google-dev-korea-youtube",
      "res-korean-ai-company-blogs",
    ],
    rationale: [
      "Gemini는 PDF, 이미지, 영상, 오디오 입력을 함께 보는 문서형 작업에 강점이 있다.",
      "GPT는 구조화된 글과 웹진형 UI/카피 초안의 기준선으로 쓰기 좋다.",
      "Manus는 브라우저 조작과 산출물 제작을 태스크로 맡기는 후보가 된다.",
    ],
    tradeoffs: [
      "PPT/웹진은 모델 점수보다 원자료 충실도와 사람이 보는 레이아웃 검수가 더 중요하다.",
      "자동 생성한 숫자, 인용, 이미지 설명은 원문과 대조해야 한다.",
    ],
    promptStarter:
      "첨부 자료를 발표용 구조로 재정리하고, 핵심 메시지, 슬라이드 흐름, 검증해야 할 사실 목록을 나눠줘.",
    sourceIds: [
      "google-gemini31",
      "google-gemini-docs-ko",
      "openai-gpt55",
      "manus-api",
      "mistral-medium-35",
    ],
  },
  {
    id: "task-latest-research",
    category: "research",
    title: "최신 뉴스·시장·커뮤니티 리서치",
    userIntent:
      "모델 업데이트, 가격 이벤트, 최신 뉴스, 커뮤니티 반응을 출처와 날짜 기준으로 조사하고 싶다.",
    primaryModelIds: ["gemini-31-pro", "grok-43", "gpt-55"],
    alternateModelIds: ["claude-fable-5", "mistral-medium-35"],
    commandIds: ["cmd-gemini-cli", "cmd-openai-codex"],
    benchmarkDomains: ["research", "multimodal"],
    resourceIds: [
      "res-google-dev-blog-ko",
      "res-korean-ai-company-blogs",
      "res-devocean-youtube",
      "res-teddynote-blog",
    ],
    rationale: [
      "Gemini는 검색 grounding과 멀티모달 자료 확인이 필요한 리서치에 맞다.",
      "Grok은 X/Web Search 축의 실시간 이슈 탐색 후보로 둔다.",
      "GPT와 Claude는 근거 정리, 반론 정리, 최종 한국어 요약에 적합하다.",
    ],
    tradeoffs: [
      "최신 이벤트는 지역·계정·만료일 조건이 바뀌므로 공식 링크 확인이 필수다.",
      "뉴스와 커뮤니티 제보는 출처 성격을 분리하고 자동 게시하지 않아야 한다.",
    ],
    promptStarter:
      "이 주제의 최신 업데이트를 공식 문서, 뉴스, 커뮤니티로 나눠 정리하고 각 항목에 발행일과 확인일을 붙여줘.",
    sourceIds: [
      "google-gemini31",
      "xai-grok43",
      "openai-models",
      "anthropic-news",
      "google-ai-blog",
      "mistral-news",
    ],
  },
  {
    id: "task-office-automation",
    category: "automation",
    title: "반복 업무·브라우저·파일 자동화",
    userIntent:
      "파일 정리, 웹 조작, 폼 입력, 보고서 생성 같은 반복 업무를 에이전트에게 맡기고 싶다.",
    primaryModelIds: ["manus-api-v2", "claude-fable-5", "gpt-55"],
    alternateModelIds: ["cursor-ai-ide", "gemini-31-pro"],
    commandIds: ["cmd-manus-task", "cmd-claude-code", "cmd-openai-codex"],
    benchmarkDomains: ["agent", "ppt", "research"],
    resourceIds: [
      "res-manus-api",
      "res-hermes-agent-video",
      "res-jocoding",
      "res-modulabs-aihub",
    ],
    rationale: [
      "Manus는 모델 호출이 아니라 Tasks, Files, Webhooks, Skills, Agents를 다루는 태스크형 플랫폼이다.",
      "Claude와 GPT는 절차 분해, 권한 설계, fallback 로직 설명에 강하다.",
      "Cursor는 개발 자동화와 코드 기반 운영 스크립트 제작에 보조 후보가 된다.",
    ],
    tradeoffs: [
      "브라우저 조작형 자동화는 권한, 개인정보, 감사 로그, 실패 복구 절차가 품질만큼 중요하다.",
      "기저 모델 스펙을 알 수 없는 태스크형 서비스는 SLA와 검수 기준을 별도로 봐야 한다.",
    ],
    promptStarter:
      "이 반복 업무를 태스크 단위로 쪼개고, 필요한 파일/권한/웹훅/실패 복구 조건을 체크리스트로 만들어줘.",
    sourceIds: [
      "manus-api",
      "manus-home",
      "anthropic-fable5",
      "openai-gpt55",
      "youtube-hermes-agent-video",
    ],
  },
  {
    id: "task-low-cost-bulk",
    category: "cost",
    title: "저비용 대량 요약·분류·로그 처리",
    userIntent:
      "많은 문서, 로그, 고객 문의를 낮은 월 비용으로 요약하고 분류하고 싶다.",
    primaryModelIds: ["deepseek-v4-flash", "grok-43", "ministral-3-14b"],
    alternateModelIds: ["gemini-31-pro", "qwen3-2507", "mistral-medium-35"],
    commandIds: [
      "cmd-deepseek-openai-compatible",
      "cmd-qwen-local-vllm",
      "cmd-mistral-api",
    ],
    benchmarkDomains: ["cost", "research"],
    resourceIds: [
      "res-deepseek-api-docs",
      "res-qwen-docs",
      "res-mistral-docs",
      "res-packt-llm-agent-books",
    ],
    rationale: [
      "DeepSeek V4 Flash는 cache miss 기준도 낮고 cache hit 입력 단가가 매우 낮아 반복 워크로드 후보가 된다.",
      "Grok은 빠른 출력과 낮은 토큰 단가 후보로, Ministral은 경량/로컬 전략 후보로 둔다.",
      "Qwen과 Mistral은 자체 배포 가능성이 있어 데이터 반출 제한이 있는 팀에 유리할 수 있다.",
    ],
    tradeoffs: [
      "저비용 모델은 품질 검수 샘플링과 fallback 규칙을 더 촘촘하게 둬야 한다.",
      "자체 배포는 토큰 단가가 아니라 GPU, 운영, 모니터링 비용이 지배할 수 있다.",
    ],
    promptStarter:
      "월 실행량 기준으로 입력/출력 토큰, 캐시 hit 가능성, fallback 필요성을 나눠 가장 낮은 비용 후보 3개를 추천해줘.",
    sourceIds: [
      "deepseek-pricing",
      "xai-grok43",
      "mistral-ministral-3-14b",
      "qwen-docs",
      "qwen-billing",
    ],
  },
  {
    id: "task-korean-learning",
    category: "learning",
    title: "한국어 강좌·유튜브·도서 학습 경로",
    userIntent:
      "AI 코딩과 LLM 앱 개발을 한국어 자료 위주로 빠르게 따라가고 싶다.",
    primaryModelIds: ["cursor-ai-ide", "gpt-55", "claude-fable-5"],
    alternateModelIds: ["gemini-31-pro", "qwen3-2507"],
    commandIds: ["cmd-cursor-agent", "cmd-openai-codex", "cmd-claude-code"],
    benchmarkDomains: ["coding", "agent"],
    resourceIds: [
      "res-cursor-korean-youtube",
      "res-inflearn-ai-coding-tools",
      "res-korean-remote-bootcamps",
      "res-korean-publisher-llm-books",
    ],
    rationale: [
      "Cursor와 Codex/Claude Code는 강좌를 보면서 바로 repo에 적용하기 좋은 표면이다.",
      "한국어 공식 문서와 유튜브, 인프런, 도서 검색 허브를 같이 보면 최신성과 실습성이 보완된다.",
      "Gemini와 Qwen은 한국어 문서/다국어·로컬 모델 학습 경로 보조 후보가 된다.",
    ],
    tradeoffs: [
      "검색 허브는 후보 링크라서 개별 강좌명, 강사, 출간일은 수동 확인이 필요하다.",
      "입문자는 IDE 자동수정만 따라가기보다 Git diff와 테스트 실행을 함께 익혀야 한다.",
    ],
    promptStarter:
      "내 수준은 입문/실무 사이야. 한국어 영상, 공식 문서, 도서, 실습 프로젝트 순서로 4주 학습 경로를 짜줘.",
    sourceIds: [
      "cursor-students",
      "youtube-cursor-korean-search",
      "inflearn-ai-coding",
      "elice-ai",
      "hanbit-llm-books",
      "anthropic-docs-ko",
      "google-gemini-docs-ko",
    ],
  },
  {
    id: "task-private-self-hosted",
    category: "security",
    title: "보안 민감 코드·문서와 자체 배포",
    userIntent:
      "민감 데이터가 있어 외부 API와 자체 호스팅 후보를 나눠 평가하고 싶다.",
    primaryModelIds: ["qwen3-2507", "mistral-medium-35", "ministral-3-14b"],
    alternateModelIds: ["deepseek-v4-flash", "cursor-ai-ide"],
    commandIds: ["cmd-qwen-local-vllm", "cmd-mistral-api", "cmd-cursor-agent"],
    benchmarkDomains: ["agent", "coding", "cost"],
    resourceIds: [
      "res-qwen-docs",
      "res-mistral-docs",
      "res-continue-openhands-docs",
      "res-aws-bedrock-ko",
    ],
    rationale: [
      "Qwen과 Mistral/Ministral은 오픈웨이트와 자체 배포 검토 축을 제공한다.",
      "Cursor Teams/Enterprise는 privacy mode, repo/model/MCP 접근 제어, 감사 로그 확인이 중요하다.",
      "DeepSeek은 외부 API지만 저비용 장문 처리 후보로 별도 격리 평가할 수 있다.",
    ],
    tradeoffs: [
      "오픈웨이트라고 해서 자동으로 보안 문제가 해결되는 것은 아니며 서빙 로그와 권한 통제가 필요하다.",
      "IDE형 도구는 코드가 외부 모델 제공사로 나가는 경로와 팀 정책을 확인해야 한다.",
    ],
    promptStarter:
      "이 업무를 외부 API 가능, 자체 배포 필요, IDE 사용 가능으로 나누고 보안/비용/운영 책임을 표로 비교해줘.",
    sourceIds: [
      "qwen-docs",
      "mistral-models",
      "mistral-ministral-3-14b",
      "cursor-pricing",
      "aws-bedrock-ko",
    ],
  },
];

export const learningResources: LearningResource[] = [
  {
    id: "res-openai-videos",
    type: "강좌/영상",
    title: "OpenAI Developer Videos",
    author: "OpenAI Developers",
    language: "영어",
    level: "실무",
    summary:
      "Responses API, 에이전트, 도구 호출 등 OpenAI 개발자용 공식 영상 모음.",
    url: "https://developers.openai.com/learn/videos",
    sourceIds: ["openai-videos"],
    providerIds: ["openai"],
    tags: ["OpenAI", "API", "Agents"],
  },
  {
    id: "res-claude-courses",
    type: "강좌/영상",
    title: "Anthropic Academy",
    author: "Anthropic",
    language: "영어",
    level: "입문",
    summary:
      "Claude, Claude Code, MCP, API 개발과 업무 적용법을 공식 학습 리소스로 따라갈 수 있다.",
    url: "https://www.anthropic.com/learn",
    sourceIds: ["anthropic-courses"],
    providerIds: ["anthropic"],
    tags: ["Claude", "Prompting", "Workflows"],
  },
  {
    id: "res-gemini-docs",
    type: "공식 문서",
    title: "Gemini API Developer Docs",
    author: "Google AI for Developers",
    language: "영어",
    level: "실무",
    summary:
      "Gemini 모델, 검색 grounding, URL context, 파일 입력, Live API까지 확인하는 공식 문서.",
    url: "https://ai.google.dev/gemini-api/docs",
    sourceIds: ["google-models"],
    providerIds: ["google"],
    tags: ["Gemini", "Multimodal", "Grounding"],
  },
  {
    id: "res-manus-api",
    type: "공식 문서",
    title: "Manus API v2 Docs",
    author: "Manus",
    language: "영어",
    level: "실무",
    summary:
      "태스크, 프로젝트, 파일, 웹훅, 스킬, 에이전트를 API로 다루는 공식 문서.",
    url: "https://open.manus.ai/docs/v2/introduction",
    sourceIds: ["manus-api"],
    providerIds: ["manus"],
    tags: ["Manus", "Agents", "Automation"],
  },
  {
    id: "res-kimi-api-docs",
    type: "공식 문서",
    title: "Kimi API Platform Docs",
    author: "Moonshot AI",
    language: "영어",
    level: "실무",
    summary:
      "Kimi 모델 목록, K2.7 Code 빠른 시작, OpenAI SDK 호환, 멀티모달 도구 호출 제약을 확인하는 공식 문서.",
    url: "https://platform.kimi.ai/docs/models",
    sourceIds: ["kimi-models", "kimi-k27-code"],
    providerIds: ["kimi"],
    tags: ["Kimi", "Moonshot", "Coding", "Multimodal"],
  },
  {
    id: "res-deepseek-api-docs",
    type: "공식 문서",
    title: "DeepSeek API Docs",
    author: "DeepSeek",
    language: "영어",
    level: "실무",
    summary:
      "DeepSeek V4 Flash/Pro, 가격, thinking mode, Anthropic/OpenAI 호환 API와 변경 로그를 확인하는 공식 문서.",
    url: "https://api-docs.deepseek.com/quick_start/pricing",
    sourceIds: ["deepseek-pricing", "deepseek-updates"],
    providerIds: ["deepseek"],
    tags: ["DeepSeek", "Pricing", "API", "Cache"],
  },
  {
    id: "res-qwen-docs",
    type: "공식 문서",
    title: "Qwen Documentation",
    author: "Alibaba Qwen Team",
    language: "영어",
    level: "고급",
    summary:
      "Qwen3-2507, Qwen3, 로컬 실행, vLLM/SGLang/TGI 배포, Qwen-Agent와 LangChain 연동을 확인하는 공식 문서.",
    url: "https://qwen.readthedocs.io/en/latest/",
    sourceIds: ["qwen-docs"],
    providerIds: ["qwen"],
    tags: ["Qwen", "Open Weight", "Local", "vLLM"],
  },
  {
    id: "res-mistral-docs",
    type: "공식 문서",
    title: "Mistral AI Docs",
    author: "Mistral AI",
    language: "영어",
    level: "실무",
    summary:
      "Mistral Medium 3.5, Mistral Small 4, Ministral 3, OCR, Agents, self-deployment를 확인하는 공식 문서.",
    url: "https://docs.mistral.ai/models/overview",
    sourceIds: [
      "mistral-models",
      "mistral-medium-35",
      "mistral-small-4",
      "mistral-ministral-3-14b",
    ],
    providerIds: ["mistral"],
    tags: ["Mistral", "Ministral", "Open Weight", "OCR"],
  },
  {
    id: "res-cursor-docs",
    type: "공식 문서",
    title: "Cursor 공식 문서",
    author: "Cursor",
    language: "영어",
    level: "실무",
    summary:
      "Cursor AI IDE의 agent, rules, MCP, model 설정, 팀 운영 방식을 확인하는 공식 문서.",
    url: "https://docs.cursor.com",
    sourceIds: ["cursor-docs"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["Cursor", "AI IDE", "바이브 코딩", "MCP"],
  },
  {
    id: "res-windsurf-docs",
    type: "공식 문서",
    title: "Windsurf 공식 문서",
    author: "Windsurf",
    language: "영어",
    level: "실무",
    summary:
      "Windsurf AI IDE와 Cascade, context, MCP, enterprise 설정을 확인하는 공식 문서.",
    url: "https://docs.windsurf.com",
    sourceIds: ["windsurf-docs"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["Windsurf", "AI IDE", "Cascade", "바이브 코딩"],
  },
  {
    id: "res-cline-roo-docs",
    type: "공식 문서",
    title: "Cline / Roo Code 문서",
    author: "Cline, Roo Code",
    language: "영어",
    level: "고급",
    summary:
      "VS Code 기반 코딩 에이전트 Cline과 Roo Code의 오픈소스 에이전트, MCP, 모드 설정 자료.",
    url: "https://github.com/cline/cline",
    sourceIds: ["cline-github", "roo-code-docs"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["Cline", "Roo Code", "VS Code", "MCP"],
  },
  {
    id: "res-aider-docs",
    type: "공식 문서",
    title: "Aider 공식 문서",
    author: "Aider",
    language: "영어",
    level: "실무",
    summary:
      "터미널 기반 pair programming, Git diff 중심 코딩, OpenAI 호환 모델 연결을 확인하는 Aider 문서.",
    url: "https://aider.chat",
    sourceIds: ["aider-docs"],
    providerIds: ["openai", "anthropic", "deepseek", "kimi", "qwen", "mistral"],
    tags: ["Aider", "CLI", "Git", "OpenAI 호환"],
  },
  {
    id: "res-continue-openhands-docs",
    type: "공식 문서",
    title: "Continue / OpenHands 문서",
    author: "Continue, All Hands AI",
    language: "영어",
    level: "고급",
    summary:
      "오픈소스 IDE assistant Continue와 개발 에이전트 OpenHands의 모델/provider 설정, context, 실행 환경 문서.",
    url: "https://docs.continue.dev",
    sourceIds: ["continue-docs", "openhands-docs"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["Continue", "OpenHands", "오픈소스", "Agent"],
  },
  {
    id: "res-lovable-bolt-v0-docs",
    type: "공식 문서",
    title: "Lovable / Bolt / v0 문서",
    author: "Lovable, Bolt, Vercel",
    language: "영어",
    level: "입문",
    summary:
      "프롬프트 기반 웹 앱 제작, UI 생성, 배포와 프로젝트 운영을 확인하는 Lovable, Bolt, v0 공식 자료.",
    url: "https://docs.lovable.dev",
    sourceIds: ["lovable-docs", "bolt-docs", "v0-docs"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["Lovable", "Bolt", "v0", "웹앱 제작"],
  },
  {
    id: "res-replit-devin-copilot-docs",
    type: "공식 문서",
    title: "Replit Agent / Devin / GitHub Copilot 문서",
    author: "Replit, Cognition, GitHub",
    language: "영어",
    level: "실무",
    summary:
      "Replit Agent, Devin, GitHub Copilot의 에이전트형 개발, IDE/CLI/조직 정책, GitHub 연동 문서.",
    url: "https://docs.github.com/en/copilot",
    sourceIds: ["replit-agent-docs", "devin-docs", "github-copilot-docs"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["GitHub Copilot", "Devin", "Replit Agent", "Agent"],
  },
  {
    id: "res-claude-docs-ko",
    type: "공식 문서",
    title: "Claude API 한국어 공식 문서",
    author: "Anthropic",
    language: "한국어",
    level: "입문",
    summary:
      "Claude 소개, 빠른 시작, Messages API, 도구 사용, MCP, 모델 선택을 한국어로 읽을 수 있는 공식 문서.",
    url: "https://platform.claude.com/docs/ko/intro",
    sourceIds: ["anthropic-docs-ko"],
    providerIds: ["anthropic"],
    tags: ["한국어", "Claude", "API", "MCP"],
  },
  {
    id: "res-gemini-docs-ko",
    type: "공식 문서",
    title: "Gemini API 한국어 공식 문서",
    author: "Google AI for Developers",
    language: "한국어",
    level: "입문",
    summary:
      "Gemini API 빠른 시작, 모델, 도구, 긴 컨텍스트, 함수 호출, 프롬프트 엔지니어링을 한국어로 확인한다.",
    url: "https://ai.google.dev/gemini-api/docs?hl=ko",
    sourceIds: ["google-gemini-docs-ko"],
    providerIds: ["google"],
    tags: ["한국어", "Gemini", "API", "Tools"],
  },
  {
    id: "res-azure-openai-ko",
    type: "공식 문서",
    title: "Azure OpenAI 한국어 문서",
    author: "Microsoft Learn",
    language: "한국어",
    level: "실무",
    summary:
      "Azure에서 OpenAI 모델을 배포하고 API/SDK로 호출하는 흐름, 콘텐츠 필터링과 엔터프라이즈 보안 개념을 한국어로 확인한다.",
    url: "https://learn.microsoft.com/ko-kr/azure/ai-services/openai/overview",
    sourceIds: ["azure-openai-ko"],
    providerIds: ["openai"],
    tags: ["한국어", "OpenAI", "Azure", "Enterprise"],
  },
  {
    id: "res-aws-bedrock-ko",
    type: "공식 문서",
    title: "Amazon Bedrock 한국어 문서",
    author: "AWS Docs",
    language: "한국어",
    level: "실무",
    summary:
      "Bedrock에서 Anthropic, DeepSeek, Moonshot AI(Kimi), OpenAI 등 여러 모델 제공사를 다루는 방법을 한국어로 확인한다.",
    url: "https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/what-is-bedrock.html",
    sourceIds: ["aws-bedrock-ko"],
    providerIds: ["anthropic", "deepseek", "kimi", "openai"],
    tags: ["한국어", "Bedrock", "Claude", "DeepSeek", "Kimi"],
  },
  {
    id: "res-teddynote",
    type: "강좌/영상",
    title: "테디노트 TeddyNote",
    author: "TeddyNote",
    language: "한국어",
    level: "실무",
    summary:
      "LangChain, RAG, LLM 앱 개발을 한국어 실습 영상으로 빠르게 따라가기 좋다.",
    url: "https://www.youtube.com/@teddynote",
    sourceIds: ["youtube-teddynote"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "RAG", "LangChain"],
  },
  {
    id: "res-jocoding",
    type: "강좌/영상",
    title: "조코딩 JoCoding",
    author: "JoCoding",
    language: "한국어",
    level: "입문",
    summary:
      "AI 코딩 도구와 자동화 트렌드를 비개발자도 이해하기 쉽게 훑기 좋은 한국어 채널.",
    url: "https://www.youtube.com/@jocoding",
    sourceIds: ["youtube-jocoding"],
    providerIds: ["openai", "anthropic", "google", "manus"],
    tags: ["한국어", "AI 코딩", "자동화"],
  },
  {
    id: "res-hermes-agent-video",
    type: "강좌/영상",
    title: "헤르메스 에이전트 - 24시간 일하는 AI 팀",
    author: "YouTube",
    language: "한국어",
    level: "실무",
    summary:
      "노트북을 꺼도 계속 일하는 AI 팀을 주제로 한 한국어 에이전트/자동화 영상. 바이브 코딩과 업무 자동화 자료 후보로 분류한다.",
    url: "https://www.youtube.com/watch?v=h_6jRAkMATI",
    sourceIds: ["youtube-hermes-agent-video"],
    providerIds: ["openai", "anthropic", "google", "manus"],
    tags: ["한국어", "AI 에이전트", "자동화", "바이브 코딩"],
  },
  {
    id: "res-youtube-vibe-coding-search",
    type: "강좌/영상",
    title: "한국어 바이브 코딩 유튜브 검색",
    author: "YouTube",
    language: "한국어",
    level: "입문",
    summary:
      "바이브 코딩, Claude Code, Codex, Cursor 관련 한국어 유튜브 강좌 후보를 계속 찾는 검색 허브.",
    url: "https://www.youtube.com/results?search_query=%EB%B0%94%EC%9D%B4%EB%B8%8C+%EC%BD%94%EB%94%A9+Claude+Code+Codex+Cursor",
    sourceIds: ["youtube-vibe-coding-search"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "유튜브", "바이브 코딩", "Claude Code", "Codex"],
  },
  {
    id: "res-codefactory-ai-coding",
    type: "강좌/영상",
    title: "코드팩토리 AI 코딩 자료 검색",
    author: "Code Factory / Inflearn / YouTube",
    language: "한국어",
    level: "입문",
    summary:
      "코드팩토리 이름으로 AI 코딩, 앱 개발, 개발 생산성 강좌 후보를 찾는 유튜브·인프런 검색 허브.",
    url: "https://www.youtube.com/results?search_query=%EC%BD%94%EB%93%9C%ED%8C%A9%ED%86%A0%EB%A6%AC+AI+%EC%BD%94%EB%94%A9",
    sourceIds: ["youtube-codefactory-search", "inflearn-codefactory"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "코드팩토리", "AI 코딩", "강좌"],
  },
  {
    id: "res-dev-dongsaeng-ai-coding",
    type: "강좌/영상",
    title: "개발동생 AI 코딩 자료 검색",
    author: "개발동생 / Inflearn / YouTube",
    language: "한국어",
    level: "입문",
    summary:
      "개발동생 이름으로 AI 코딩, 개발 자동화, 실무 개발 강좌 후보를 찾는 유튜브·인프런 검색 허브.",
    url: "https://www.youtube.com/results?search_query=%EA%B0%9C%EB%B0%9C%EB%8F%99%EC%83%9D+AI+%EC%BD%94%EB%94%A9",
    sourceIds: ["youtube-dev-dongsaeng-search", "inflearn-dev-dongsaeng"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "개발동생", "AI 코딩", "강좌"],
  },
  {
    id: "res-cursor-korean-youtube",
    type: "강좌/영상",
    title: "Cursor 한국어 유튜브 강좌 검색",
    author: "YouTube",
    language: "한국어",
    level: "입문",
    summary:
      "Cursor AI IDE, Composer/Agent, rules, MCP, 바이브 코딩 관련 한국어 영상 후보를 찾는 검색 허브.",
    url: "https://www.youtube.com/results?search_query=Cursor+AI+%EC%BD%94%EB%94%A9+%ED%95%9C%EA%B5%AD%EC%96%B4",
    sourceIds: ["youtube-cursor-korean-search"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "Cursor", "AI IDE", "바이브 코딩"],
  },
  {
    id: "res-windsurf-korean-youtube",
    type: "강좌/영상",
    title: "Windsurf 한국어 유튜브 강좌 검색",
    author: "YouTube",
    language: "한국어",
    level: "입문",
    summary:
      "Windsurf, Cascade, AI IDE, 바이브 코딩 관련 한국어 영상 후보를 찾는 검색 허브.",
    url: "https://www.youtube.com/results?search_query=Windsurf+AI+%EC%BD%94%EB%94%A9+%ED%95%9C%EA%B5%AD%EC%96%B4",
    sourceIds: ["youtube-windsurf-korean-search"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "Windsurf", "AI IDE", "Cascade"],
  },
  {
    id: "res-cline-roo-korean-youtube",
    type: "강좌/영상",
    title: "Cline / Roo Code 한국어 유튜브 검색",
    author: "YouTube",
    language: "한국어",
    level: "실무",
    summary:
      "Cline, Roo Code, VS Code 에이전트, MCP 기반 코딩 자동화 영상 후보를 찾는 검색 허브.",
    url: "https://www.youtube.com/results?search_query=Cline+Roo+Code+%ED%95%9C%EA%B5%AD%EC%96%B4",
    sourceIds: ["youtube-cline-roo-korean-search"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "Cline", "Roo Code", "MCP"],
  },
  {
    id: "res-copilot-korean-youtube",
    type: "강좌/영상",
    title: "GitHub Copilot 한국어 유튜브 검색",
    author: "YouTube",
    language: "한국어",
    level: "입문",
    summary:
      "GitHub Copilot, Copilot Chat, agent mode, IDE/CLI 활용 강좌 후보를 찾는 한국어 유튜브 검색 허브.",
    url: "https://www.youtube.com/results?search_query=GitHub+Copilot+%ED%95%9C%EA%B5%AD%EC%96%B4+%EA%B0%95%EC%A2%8C",
    sourceIds: ["youtube-copilot-korean-search"],
    providerIds: ["openai", "anthropic"],
    tags: ["한국어", "GitHub Copilot", "AI 코딩", "강좌"],
  },
  {
    id: "res-v0-lovable-bolt-korean-youtube",
    type: "강좌/영상",
    title: "v0 / Lovable / Bolt 한국어 유튜브 검색",
    author: "YouTube",
    language: "한국어",
    level: "입문",
    summary:
      "프롬프트 기반 웹앱 제작, UI 생성, 배포 자동화 도구의 한국어 영상 후보를 찾는 검색 허브.",
    url: "https://www.youtube.com/results?search_query=v0+Lovable+Bolt+AI+%ED%95%9C%EA%B5%AD%EC%96%B4",
    sourceIds: ["youtube-v0-lovable-bolt-korean-search"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "v0", "Lovable", "Bolt"],
  },
  {
    id: "res-korean-creator-ai-youtube",
    type: "강좌/영상",
    title: "국내 개발 유튜버 AI 코딩 검색 묶음",
    author: "Nomad Coders, Dream Coding, Yalco, Coding Apple, Nado Coding",
    language: "한국어",
    level: "입문",
    summary:
      "노마드 코더, 드림코딩, 얄코, 코딩애플, 나도코딩의 AI 코딩/개발 생산성 영상 후보를 묶어 추적한다.",
    url: "https://www.youtube.com/results?search_query=%EB%85%B8%EB%A7%88%EB%93%9C%EC%BD%94%EB%8D%94+AI+%EC%BD%94%EB%94%A9",
    sourceIds: [
      "youtube-nomadcoders-ai-search",
      "youtube-dreamcoding-ai-search",
      "youtube-yalco-ai-search",
      "youtube-codingapple-ai-search",
      "youtube-nadocoding-ai-search",
    ],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "유튜버", "AI 코딩", "개발 생산성"],
  },
  {
    id: "res-openai-youtube",
    type: "강좌/영상",
    title: "OpenAI 공식 유튜브",
    author: "OpenAI",
    language: "영어",
    level: "입문",
    summary:
      "ChatGPT, API, 모델 발표, 제품 데모를 공식 영상으로 확인하는 채널.",
    url: "https://www.youtube.com/@OpenAI",
    sourceIds: ["youtube-openai"],
    providerIds: ["openai"],
    tags: ["OpenAI", "YouTube", "Official"],
  },
  {
    id: "res-anthropic-youtube",
    type: "강좌/영상",
    title: "Anthropic 공식 유튜브",
    author: "Anthropic",
    language: "영어",
    level: "입문",
    summary:
      "Claude 제품 발표, Claude Code, 연구/안전성 관련 세션을 공식 영상으로 확인하는 채널.",
    url: "https://www.youtube.com/@anthropic-ai",
    sourceIds: ["youtube-anthropic"],
    providerIds: ["anthropic"],
    tags: ["Claude", "YouTube", "Official"],
  },
  {
    id: "res-google-dev-youtube",
    type: "강좌/영상",
    title: "Google for Developers 공식 유튜브",
    author: "Google for Developers",
    language: "영어",
    level: "실무",
    summary: "Gemini API와 Google 개발자 생태계 영상을 공식 채널에서 추적한다.",
    url: "https://www.youtube.com/@GoogleDevelopers",
    sourceIds: ["youtube-google-developers"],
    providerIds: ["google"],
    tags: ["Gemini", "Google", "YouTube", "Official"],
  },
  {
    id: "res-google-cloud-youtube",
    type: "강좌/영상",
    title: "Google Cloud Tech 공식 유튜브",
    author: "Google Cloud",
    language: "영어",
    level: "실무",
    summary:
      "Vertex AI, Gemini Enterprise, Agent Platform, 클라우드 생성형 AI 세션을 공식 영상으로 확인한다.",
    url: "https://www.youtube.com/@GoogleCloudTech",
    sourceIds: ["youtube-google-cloud-tech"],
    providerIds: ["google", "anthropic", "mistral", "deepseek"],
    tags: ["Gemini", "Vertex AI", "Cloud", "YouTube"],
  },
  {
    id: "res-google-dev-korea-youtube",
    type: "강좌/영상",
    title: "Google Developers Korea",
    author: "Google Developers Korea",
    language: "한국어",
    level: "실무",
    summary:
      "Gemini, Google Cloud, 개발자 행사 세션을 한국어로 확인하는 공식 개발자 채널.",
    url: "https://www.youtube.com/@GoogleDevelopersKorea",
    sourceIds: ["youtube-google-developers-korea"],
    providerIds: ["google"],
    tags: ["한국어", "Gemini", "Google", "YouTube"],
  },
  {
    id: "res-aws-korea-youtube",
    type: "강좌/영상",
    title: "AWS Korea",
    author: "AWS Korea",
    language: "한국어",
    level: "실무",
    summary:
      "Amazon Bedrock과 생성형 AI 아키텍처 세션을 한국어 영상으로 추적한다.",
    url: "https://www.youtube.com/@AWSKorea",
    sourceIds: ["youtube-aws-korea"],
    providerIds: ["anthropic", "deepseek", "kimi", "openai"],
    tags: ["한국어", "Bedrock", "YouTube", "Cloud"],
  },
  {
    id: "res-ms-dev-korea-youtube",
    type: "강좌/영상",
    title: "Microsoft Developer Korea",
    author: "Microsoft Developer Korea",
    language: "한국어",
    level: "실무",
    summary:
      "Azure OpenAI, Copilot, 개발자 워크플로 관련 한국어 세션을 추적한다.",
    url: "https://www.youtube.com/@MicrosoftDeveloperKorea",
    sourceIds: ["youtube-ms-dev-korea"],
    providerIds: ["openai"],
    tags: ["한국어", "Azure OpenAI", "Copilot", "YouTube"],
  },
  {
    id: "res-devocean-youtube",
    type: "강좌/영상",
    title: "DEVOCEAN 유튜브",
    author: "DEVOCEAN",
    language: "한국어",
    level: "실무",
    summary:
      "국내 개발자 컨퍼런스와 AI/ML 세션 영상을 계속 추적하는 한국어 채널.",
    url: "https://www.youtube.com/@devocean",
    sourceIds: ["youtube-devocean"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "AI", "ML", "Conference"],
  },
  {
    id: "res-mistral-youtube",
    type: "강좌/영상",
    title: "Mistral AI 유튜브",
    author: "Mistral AI",
    language: "영어",
    level: "실무",
    summary:
      "Mistral 모델 발표와 제품 데모, 연구/개발자 콘텐츠를 추적하는 채널.",
    url: "https://www.youtube.com/@MistralAI",
    sourceIds: ["youtube-mistral-ai"],
    providerIds: ["mistral"],
    tags: ["Mistral", "Ministral", "YouTube"],
  },
  {
    id: "res-kimi-youtube-hub",
    type: "강좌/영상",
    title: "Kimi K2 유튜브 검색 허브",
    author: "YouTube",
    language: "영어",
    level: "실무",
    summary:
      "Kimi K2.7 Code, Moonshot API, 코딩 에이전트 관련 최신 영상 강좌를 찾는 검색 링크.",
    url: "https://www.youtube.com/results?search_query=Kimi+K2.7+Code",
    sourceIds: ["youtube-moonshot-ai", "youtube-kimi-search"],
    providerIds: ["kimi"],
    tags: ["Kimi", "Moonshot", "YouTube", "Search"],
  },
  {
    id: "res-deepseek-youtube-hub",
    type: "강좌/영상",
    title: "DeepSeek V4 유튜브 검색 허브",
    author: "YouTube",
    language: "영어",
    level: "실무",
    summary:
      "DeepSeek V4, DeepSeek API, R1/V3 계열, 저비용 장문 처리 강좌를 찾는 검색 링크.",
    url: "https://www.youtube.com/results?search_query=DeepSeek+V4+API",
    sourceIds: ["youtube-deepseek", "youtube-deepseek-search"],
    providerIds: ["deepseek"],
    tags: ["DeepSeek", "YouTube", "Search", "API"],
  },
  {
    id: "res-qwen-youtube-hub",
    type: "강좌/영상",
    title: "Qwen3 유튜브 검색 허브",
    author: "YouTube",
    language: "영어",
    level: "고급",
    summary:
      "Qwen3, Qwen 로컬 실행, Ollama, vLLM, SGLang 배포 강좌를 찾는 검색 링크.",
    url: "https://www.youtube.com/results?search_query=Qwen3+LLM+Korean",
    sourceIds: ["youtube-qwen", "youtube-qwen-search"],
    providerIds: ["qwen"],
    tags: ["Qwen", "Open Weight", "YouTube", "Local"],
  },
  {
    id: "res-xai-youtube-hub",
    type: "강좌/영상",
    title: "xAI Grok 유튜브 검색 허브",
    author: "YouTube",
    language: "영어",
    level: "실무",
    summary:
      "Grok API, X Search, 실시간 리서치 사용법 영상을 찾는 검색 링크. 공식 채널은 추가 확인 대상으로 둔다.",
    url: "https://www.youtube.com/results?search_query=xAI+Grok+API",
    sourceIds: ["youtube-xai-grok-search"],
    providerIds: ["xai"],
    tags: ["Grok", "xAI", "YouTube", "Search"],
  },
  {
    id: "res-manus-youtube-hub",
    type: "강좌/영상",
    title: "Manus AI 유튜브 검색 허브",
    author: "YouTube",
    language: "영어",
    level: "입문",
    summary:
      "Manus 에이전트, 브라우저 오퍼레이터, 업무 자동화 영상 강좌를 찾는 검색 링크.",
    url: "https://www.youtube.com/results?search_query=Manus+AI+agent+tutorial",
    sourceIds: ["youtube-manusai", "youtube-manus-search"],
    providerIds: ["manus"],
    tags: ["Manus", "Agent", "YouTube", "Automation"],
  },
  {
    id: "res-teddynote-blog",
    type: "블로그/글",
    title: "TeddyNote Blog",
    author: "TeddyNote",
    language: "한국어",
    level: "실무",
    summary:
      "LangChain, RAG, LLM 앱 개발을 한국어 글과 코드 예제로 따라갈 수 있는 블로그.",
    url: "https://teddylee777.github.io/",
    sourceIds: ["teddynote-blog"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "블로그", "LangChain", "RAG"],
  },
  {
    id: "res-naver-d2-ai",
    type: "블로그/글",
    title: "NAVER D2",
    author: "NAVER D2",
    language: "한국어",
    level: "고급",
    summary:
      "네이버의 AI, 검색, 추천, 대규모 시스템 기술 글을 찾아볼 수 있는 한국어 기술 블로그.",
    url: "https://d2.naver.com/home",
    sourceIds: ["naver-d2"],
    providerIds: ["openai", "google", "qwen", "mistral"],
    tags: ["한국어", "블로그", "검색", "AI"],
  },
  {
    id: "res-kakao-tech-ai",
    type: "블로그/글",
    title: "Kakao Tech",
    author: "Kakao",
    language: "한국어",
    level: "고급",
    summary:
      "카카오의 생성형 AI, 검색, 추천, 데이터/플랫폼 기술 글을 찾는 한국어 공식 기술 블로그.",
    url: "https://tech.kakao.com/",
    sourceIds: ["kakao-tech-blog"],
    providerIds: ["openai", "google", "qwen", "mistral"],
    tags: ["한국어", "블로그", "AI", "Data"],
  },
  {
    id: "res-toss-tech-ai",
    type: "블로그/글",
    title: "Toss Tech",
    author: "Viva Republica",
    language: "한국어",
    level: "실무",
    summary:
      "제품 개발, 데이터, ML/AI 적용 경험을 한국어로 확인하는 기술 블로그.",
    url: "https://toss.tech/",
    sourceIds: ["toss-tech-blog"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "블로그", "Product", "AI"],
  },
  {
    id: "res-woowahan-ai",
    type: "블로그/글",
    title: "우아한형제들 AI 기술 블로그",
    author: "Woowahan Brothers",
    language: "한국어",
    level: "실무",
    summary:
      "국내 서비스 조직의 AI 적용 사례와 운영 경험을 확인하는 한국어 AI 글 카테고리.",
    url: "https://techblog.woowahan.com/category/ai/",
    sourceIds: ["woowahan-ai-blog"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "블로그", "AI", "Case Study"],
  },
  {
    id: "res-google-dev-blog-ko",
    type: "블로그/글",
    title: "Google Developers Blog 한국어",
    author: "Google Developers",
    language: "한국어",
    level: "입문",
    summary:
      "Google의 Gemini, AI 개발자 뉴스, 제품 업데이트를 한국어 글로 확인하는 공식 블로그.",
    url: "https://developers.googleblog.com/ko/",
    sourceIds: ["google-dev-blog-ko"],
    providerIds: ["google"],
    tags: ["한국어", "Gemini", "Google", "블로그"],
  },
  {
    id: "res-korean-ai-company-blogs",
    type: "블로그/글",
    title: "국내 AI 기업/플랫폼 블로그 묶음",
    author: "Upstage, NAVER Cloud, LY Corporation, Superb AI",
    language: "한국어",
    level: "실무",
    summary:
      "Upstage, NAVER Cloud, LY Corporation, Superb AI의 LLM, 클라우드 AI, 비전 AI, 제품/연구 업데이트를 묶어 추적한다.",
    url: "https://www.upstage.ai/blog",
    sourceIds: [
      "upstage-blog",
      "naver-cloud-blog",
      "lycorp-tech-ko",
      "superb-ai-blog-ko",
    ],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "블로그", "최신 업데이트", "AI 기업"],
  },
  {
    id: "res-kmooc-boostcourse-ai",
    type: "강좌/영상",
    title: "K-MOOC / 부스트코스 AI 온라인 강좌",
    author: "K-MOOC, NAVER Connect Foundation",
    language: "한국어",
    level: "입문",
    summary:
      "국내 대학·기관 공개강좌와 부스트코스의 AI, 데이터, 컴퓨터공학 온라인 강좌를 찾는 공공/무료 교육 허브.",
    url: "https://www.kmooc.kr",
    sourceIds: ["kmooc-ai", "boostcourse-ai"],
    providerIds: ["openai", "google", "qwen"],
    tags: ["한국어", "교육기관", "원격 교육", "무료 강좌"],
  },
  {
    id: "res-korean-remote-bootcamps",
    type: "강좌/영상",
    title: "국내 원격 교육기관 AI 강좌 허브",
    author: "Elice, Programmers, goorm, Fast Campus, Codeit, Sparta",
    language: "한국어",
    level: "입문",
    summary:
      "엘리스, 프로그래머스, 구름EDU, 패스트캠퍼스, 코드잇, 스파르타코딩클럽의 AI/개발/자동화 강좌 후보를 추적한다.",
    url: "https://elice.io/ko",
    sourceIds: [
      "elice-ai",
      "programmers-school-ai",
      "goorm-edu-ai",
      "fastcampus-ai",
      "codeit-ai",
      "spartacoding-ai",
    ],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "교육기관", "원격 교육", "부트캠프"],
  },
  {
    id: "res-korean-course-platforms",
    type: "강좌/영상",
    title: "인프런 유사 국내 강좌 플랫폼 묶음",
    author: "Nomad Coders, Dream Coding, CLASS101, Coloso",
    language: "한국어",
    level: "입문",
    summary:
      "노마드코더, 드림코딩 아카데미, 클래스101, 콜로소의 개발·AI·업무 자동화·디자인 강좌 후보를 계속 추적한다.",
    url: "https://nomadcoders.co/",
    sourceIds: [
      "nomadcoders",
      "dreamcoding-academy",
      "class101-dev-ai",
      "coloso-dev-ai",
    ],
    providerIds: ["openai", "anthropic", "google", "cursor"],
    tags: ["한국어", "강좌 플랫폼", "인프런 유사", "개발 강좌", "AI 강좌"],
  },
  {
    id: "res-korean-dev-youtube-core-channels",
    type: "강좌/영상",
    title: "한국어 개발 유튜브 직접 채널 묶음",
    author:
      "노마드코더, 드림코딩, 코딩애플, 나도코딩, 얄코, 생활코딩, 빵형의 개발도상국",
    language: "한국어",
    level: "입문",
    summary:
      "AI 바이브 코딩을 따라가기 전에 필요한 웹/앱 개발 기초, 프론트엔드 실무, Python 자동화, AI/ML 실험 영상을 직접 채널 단위로 추적한다.",
    url: "https://www.youtube.com/@nomadcoders",
    sourceIds: [
      "youtube-nomadcoders-channel",
      "youtube-dreamcoding-channel",
      "youtube-codingapple-channel",
      "youtube-nadocoding-channel",
      "youtube-yalco-channel",
      "youtube-opentutorials-channel",
      "youtube-bbanghyong-channel",
    ],
    providerIds: ["openai", "anthropic", "google", "cursor"],
    tags: [
      "한국어",
      "유튜브",
      "개발 입문",
      "AI 코딩",
      "노마드코더",
      "생활코딩",
      "빵형",
    ],
  },
  {
    id: "res-korean-ai-youtube-creator-watchlist",
    type: "강좌/영상",
    title: "한국어 AI 코딩 크리에이터 감시 목록",
    author:
      "테디노트, 조코딩, 코드팩토리, 개발동생, 코딩 알려주는 누나, 메타코드M",
    language: "한국어",
    level: "실무",
    summary:
      "LLM 앱, RAG, 자동화, AI IDE, Cursor/Claude Code/Codex류 도구를 다루는 한국어 크리에이터와 검색 허브를 주간 큐레이션 후보로 묶는다.",
    url: "https://www.youtube.com/@teddynote",
    sourceIds: [
      "youtube-teddynote",
      "youtube-jocoding",
      "youtube-codefactory-search",
      "youtube-dev-dongsaeng-search",
      "youtube-codingnoona-search",
      "youtube-metacodem-search",
      "youtube-vibe-coding-search",
    ],
    providerIds: ["openai", "anthropic", "google", "cursor"],
    tags: [
      "한국어",
      "유튜브",
      "바이브 코딩",
      "AI 코딩",
      "테디노트",
      "조코딩",
      "코드팩토리",
      "개발동생",
    ],
  },
  {
    id: "res-korean-bootcamp-expanded",
    type: "강좌/영상",
    title: "국내 AI/개발 부트캠프 확장 묶음",
    author: "LIKELION, AIFFEL, ZeroBase, OZ Coding School, Multicampus",
    language: "한국어",
    level: "실무",
    summary:
      "멋쟁이사자처럼, AIFFEL, 제로베이스, 오즈코딩스쿨, 멀티캠퍼스의 AI/데이터/개발자 교육과 기업교육 후보를 추적한다.",
    url: "https://likelion.net/",
    sourceIds: [
      "likelion-school",
      "aiffel-ai",
      "zerobase",
      "ozcoding",
      "multicampus",
    ],
    providerIds: ["openai", "anthropic", "google", "qwen"],
    tags: ["한국어", "부트캠프", "원격 교육", "기업교육", "AI 개발자"],
  },
  {
    id: "res-korean-open-course-hubs",
    type: "강좌/영상",
    title: "무료/공개 개발 강좌 허브",
    author: "OpenTutorials, edwith, KOCW",
    language: "한국어",
    level: "입문",
    summary:
      "생활코딩/OpenTutorials, edwith, KOCW의 무료 공개 개발·AI·데이터 강좌 후보를 함께 추적한다.",
    url: "https://opentutorials.org/course/1",
    sourceIds: ["opentutorials", "edwith", "kocw"],
    providerIds: ["openai", "google", "qwen"],
    tags: ["한국어", "무료 강좌", "공개강좌", "입문", "원격 교육"],
  },
  {
    id: "res-korean-dev-events",
    type: "커뮤니티",
    title: "국내 개발자 AI 교육/이벤트/커뮤니티 허브",
    author: "Wanted, DEVOCEAN, 모두의연구소, OKKY",
    language: "한국어",
    level: "실무",
    summary:
      "원티드 이벤트, DEVOCEAN, 모두의연구소, OKKY에서 AI/개발/데이터 웨비나, 커뮤니티 학습 이벤트, 바이브 코딩 사례 후보를 추적한다.",
    url: "https://www.wanted.co.kr/events",
    sourceIds: [
      "wanted-events",
      "devocean-blog",
      "modulabs-ai",
      "okky-community",
    ],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "이벤트", "웨비나", "커뮤니티", "개발자 교육", "OKKY"],
  },
  {
    id: "res-korean-community-ai-writing",
    type: "커뮤니티",
    title: "한국어 AI 코딩 커뮤니티/개인 블로그 검색",
    author: "OKKY, Velog, Brunch",
    language: "한국어",
    level: "입문",
    summary:
      "OKKY의 AI/기술 글과 Velog, Brunch의 AI 코딩·LLM·생산성 글을 묶어 최신 커뮤니티 경험담과 실무 적용 글 후보를 찾는다.",
    url: "https://okky.kr/",
    sourceIds: [
      "okky-community",
      "velog-ai-coding-search",
      "brunch-ai-coding-search",
    ],
    providerIds: ["openai", "anthropic", "google", "cursor"],
    tags: [
      "한국어",
      "커뮤니티",
      "블로그",
      "AI 코딩",
      "바이브 코딩",
      "OKKY",
      "Velog",
    ],
  },
  {
    id: "res-modulabs-aihub",
    type: "커뮤니티",
    title: "모두의연구소 / AI Hub",
    author: "모두의연구소, AI Hub",
    language: "한국어",
    level: "실무",
    summary:
      "AI 학습 모임, 연구 커뮤니티, 데이터셋, 공공 AI 자료를 찾는 국내 커뮤니티·공공 데이터 허브.",
    url: "https://modulabs.co.kr",
    sourceIds: ["modulabs-ai", "aihub"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "커뮤니티", "교육기관", "데이터셋"],
  },
  {
    id: "res-inflearn-langchain",
    type: "강좌/영상",
    title: "인프런 LangChain 강좌 검색",
    author: "Inflearn",
    language: "한국어",
    level: "입문",
    summary:
      "LangChain, RAG, LLM 앱 개발 관련 한국어 유료/무료 강좌를 계속 찾는 검색 허브.",
    url: "https://www.inflearn.com/search?s=langchain",
    sourceIds: ["inflearn-langchain"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "강좌", "LangChain", "RAG"],
  },
  {
    id: "res-inflearn-vibe-coding",
    type: "강좌/영상",
    title: "인프런 바이브 코딩 강좌 검색",
    author: "Inflearn",
    language: "한국어",
    level: "입문",
    summary:
      "바이브 코딩, AI 코딩 도구, Cursor/Claude Code/Codex류 강좌 후보를 계속 찾는 한국어 강좌 허브.",
    url: "https://www.inflearn.com/search?s=%EB%B0%94%EC%9D%B4%EB%B8%8C%20%EC%BD%94%EB%94%A9",
    sourceIds: ["inflearn-vibe-coding"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "강좌", "바이브 코딩", "AI 코딩"],
  },
  {
    id: "res-inflearn-ai-coding",
    type: "강좌/영상",
    title: "인프런 AI 코딩 강좌 검색",
    author: "Inflearn",
    language: "한국어",
    level: "입문",
    summary:
      "AI 코딩, 개발 자동화, 생성형 AI 활용 개발 강좌 후보를 계속 찾는 인프런 검색 허브.",
    url: "https://www.inflearn.com/search?s=AI%20%EC%BD%94%EB%94%A9",
    sourceIds: ["inflearn-ai-coding"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "강좌", "AI 코딩", "자동화"],
  },
  {
    id: "res-inflearn-claude-code",
    type: "강좌/영상",
    title: "인프런 Claude Code 강좌 검색",
    author: "Inflearn",
    language: "한국어",
    level: "실무",
    summary:
      "Claude Code, Claude 기반 코딩 에이전트, AI pair programming 강좌 후보를 추적하는 인프런 검색 링크.",
    url: "https://www.inflearn.com/search?s=Claude%20Code",
    sourceIds: ["inflearn-claude-code"],
    providerIds: ["anthropic"],
    tags: ["한국어", "Claude Code", "AI 코딩", "강좌"],
  },
  {
    id: "res-inflearn-codex",
    type: "강좌/영상",
    title: "인프런 Codex 강좌 검색",
    author: "Inflearn",
    language: "한국어",
    level: "실무",
    summary:
      "OpenAI Codex, Codex CLI, GPT 기반 코딩 워크플로 강좌 후보를 추적하는 인프런 검색 링크.",
    url: "https://www.inflearn.com/search?s=Codex",
    sourceIds: ["inflearn-codex"],
    providerIds: ["openai"],
    tags: ["한국어", "Codex", "OpenAI", "CLI"],
  },
  {
    id: "res-inflearn-cursor",
    type: "강좌/영상",
    title: "인프런 Cursor 강좌 검색",
    author: "Inflearn",
    language: "한국어",
    level: "입문",
    summary:
      "Cursor, AI IDE, AI pair programming 강좌 후보를 찾는 인프런 검색 링크.",
    url: "https://www.inflearn.com/search?s=Cursor",
    sourceIds: ["inflearn-cursor"],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "Cursor", "AI IDE", "강좌"],
  },
  {
    id: "res-inflearn-ai-coding-tools",
    type: "강좌/영상",
    title: "인프런 AI 코딩 도구 강좌 검색 묶음",
    author: "Inflearn",
    language: "한국어",
    level: "입문",
    summary:
      "GitHub Copilot, Cursor, Windsurf, Cline, v0, Lovable 관련 한국어 강좌 후보를 묶어 추적한다.",
    url: "https://www.inflearn.com/search?s=GitHub%20Copilot",
    sourceIds: [
      "inflearn-github-copilot",
      "inflearn-cursor",
      "inflearn-windsurf",
      "inflearn-cline",
      "inflearn-v0",
      "inflearn-lovable",
    ],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "AI IDE", "Copilot", "프롬프트 웹앱"],
  },
  {
    id: "res-official-ai-coding-tools",
    type: "공식 문서",
    title: "AI 코딩 도구 공식 문서 묶음",
    author:
      "Cursor, GitHub, JetBrains, AWS, Sourcegraph, Augment, Tabnine, CodeRabbit, TRAE",
    language: "영어",
    level: "실무",
    summary:
      "AI IDE, IDE 확장, CLI, PR 리뷰, 클라우드 에이전트 도구의 공식 문서를 한 번에 추적하는 리소스 묶음.",
    url: "https://docs.cursor.com",
    sourceIds: [
      "cursor-docs",
      "github-copilot-docs",
      "jetbrains-junie",
      "amazon-q-developer-docs",
      "sourcegraph-amp-manual",
      "augment-docs",
      "tabnine-docs",
      "coderabbit-docs",
      "trae-docs",
    ],
    providerIds: ["cursor", "openai", "anthropic", "google", "mistral"],
    tags: ["공식 문서", "AI 코딩 도구", "IDE", "CLI", "PR 리뷰"],
  },
  {
    id: "res-gemini-code-assist-ko",
    type: "공식 문서",
    title: "Gemini Code Assist 한국어 제품/가격 페이지",
    author: "Google Code Assist",
    language: "한국어",
    level: "실무",
    summary:
      "Gemini Code Assist의 한국어 제품 설명, VS Code/JetBrains/Cloud Workstations, Gemini CLI, smart actions, 가격 정보를 확인한다.",
    url: "https://codeassist.google/products/business?hl=ko",
    sourceIds: ["gemini-code-assist-ko", "google-jules-docs"],
    providerIds: ["google"],
    tags: ["한국어", "공식 문서", "Gemini Code Assist", "Jules", "CLI"],
  },
  {
    id: "res-ai-coding-student-benefits",
    type: "공식 문서",
    title: "AI 코딩 학생/교육 혜택 확인 묶음",
    author: "GitHub, Cursor, JetBrains, Google",
    language: "영어",
    level: "입문",
    summary:
      "Copilot Student, GitHub Education Pack, Cursor Students, JetBrains Student Pack, Gemini 학생 혜택을 한 곳에서 비교한다.",
    url: "https://education.github.com/pack",
    sourceIds: [
      "github-copilot-plans",
      "github-education-pack",
      "cursor-students",
      "jetbrains-student-pack",
      "google-gemini-students",
    ],
    providerIds: ["cursor", "openai", "google"],
    tags: ["학생 혜택", "이벤트", "교육", "Copilot", "Cursor"],
  },
  {
    id: "res-korean-ai-tool-youtube-searches",
    type: "강좌/영상",
    title: "한국어 AI 코딩 도구 YouTube 검색 묶음",
    author: "YouTube",
    language: "한국어",
    level: "입문",
    summary:
      "Cursor, Copilot, JetBrains Junie, Amazon Q, Augment, Tabnine, CodeRabbit, TRAE, Cline/Roo, v0/Lovable/Bolt 한국어 영상 후보를 계속 찾는 검색 묶음.",
    url: "https://www.youtube.com/results?search_query=AI+%EC%BD%94%EB%94%A9+%EB%8F%84%EA%B5%AC+%ED%95%9C%EA%B5%AD%EC%96%B4",
    sourceIds: [
      "youtube-cursor-korean-search",
      "youtube-copilot-korean-search",
      "youtube-jetbrains-junie-korean-search",
      "youtube-amazon-q-korean-search",
      "youtube-augment-korean-search",
      "youtube-tabnine-korean-search",
      "youtube-coderabbit-korean-search",
      "youtube-trae-korean-search",
      "youtube-cline-roo-korean-search",
      "youtube-v0-lovable-bolt-korean-search",
    ],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "유튜브", "AI 코딩 도구", "Cursor", "Copilot"],
  },
  {
    id: "res-inflearn-expanded-ai-tools",
    type: "강좌/영상",
    title: "인프런 AI 코딩 도구 세부 검색 묶음",
    author: "Inflearn",
    language: "한국어",
    level: "입문",
    summary:
      "GitHub Copilot, Cursor, JetBrains AI, Amazon Q Developer, CodeRabbit, TRAE, Cline, v0, Lovable 강좌 후보를 세부 검색으로 추적한다.",
    url: "https://www.inflearn.com/search?s=AI%20%EC%BD%94%EB%94%A9",
    sourceIds: [
      "inflearn-github-copilot",
      "inflearn-cursor",
      "inflearn-jetbrains-ai",
      "inflearn-amazon-q",
      "inflearn-coderabbit",
      "inflearn-trae",
      "inflearn-cline",
      "inflearn-v0",
      "inflearn-lovable",
    ],
    providerIds: ["cursor", "openai", "anthropic", "google"],
    tags: ["한국어", "인프런", "AI IDE", "PR 리뷰", "강좌"],
  },
  {
    id: "res-pr-review-ai-tools",
    type: "공식 문서",
    title: "AI PR 리뷰 도구 공식 문서",
    author: "CodeRabbit, GitHub, Cursor",
    language: "영어",
    level: "실무",
    summary:
      "CodeRabbit, GitHub Copilot code review, Cursor Bugbot처럼 PR 리뷰와 코드 검토에 특화된 AI 도구를 비교한다.",
    url: "https://docs.coderabbit.ai/",
    sourceIds: [
      "coderabbit-docs",
      "coderabbit-pricing",
      "github-copilot-docs",
      "github-copilot-plans",
      "cursor-changelog",
    ],
    providerIds: ["cursor", "openai", "anthropic"],
    tags: ["PR 리뷰", "CodeRabbit", "Copilot", "Bugbot", "공식 문서"],
  },
  {
    id: "res-cloud-coding-agents",
    type: "공식 문서",
    title: "클라우드 코딩 에이전트 공식 문서",
    author: "Google, Cognition, Replit, Manus",
    language: "영어",
    level: "실무",
    summary:
      "Jules, Devin, Replit Agent, Manus처럼 로컬 PC 밖에서 repo/task를 실행하는 클라우드 에이전트 문서 묶음.",
    url: "https://jules.google/docs",
    sourceIds: [
      "google-jules-docs",
      "devin-docs",
      "replit-agent-docs",
      "manus-home",
      "manus-api",
      "youtube-hermes-agent-video",
    ],
    providerIds: ["google", "manus", "openai", "anthropic"],
    tags: ["Cloud agent", "Jules", "Devin", "Replit", "Manus"],
  },
  {
    id: "res-benchmark-hubs-coding-agent",
    type: "공식 문서",
    title: "코딩/에이전트 벤치마크 허브",
    author:
      "SWE-bench, SWE-Bench Pro, Dialogue-SWEBench, Claw-SWE-Bench, SWE-Lancer, KernelBench, EVMbench, SWE Context Bench, SWE-Bench Mobile, SWE-MERA, LiveCodeBench, Aider, BigCodeBench, BFCL, Terminal-Bench, OSWorld",
    language: "영어",
    level: "고급",
    summary:
      "SWE-bench, 장기 기업형 SWE, 대화형 SWE, harness 비교, freelance engineering, GPU kernel, smart contract security, 경험 재사용, 모바일 앱 개발, 동적 평가, LiveCodeBench, Aider Polyglot, BigCodeBench, BFCL, Terminal-Bench, OSWorld, WebArena를 코딩/에이전트 평가 근거로 묶어 추적한다.",
    url: "https://www.swebench.com/",
    sourceIds: [
      "swebench-leaderboard",
      "dialogue-swebench-paper",
      "swe-contextbench-paper",
      "swebench-mobile-leaderboard",
      "swebench-mobile-paper",
      "swe-mera-paper",
      "swebench-pro-paper",
      "claw-swebench-paper",
      "swelancer-paper",
      "openai-frontier-evals",
      "kernelbench-paper",
      "evmbench-paper",
      "livecodebench-leaderboard",
      "aider-polyglot-leaderboard",
      "bigcodebench-leaderboard",
      "bfcl-leaderboard",
      "terminal-bench",
      "osworld-benchmark",
      "webarena-benchmark",
    ],
    providerIds: ["openai", "anthropic", "google", "xai", "qwen"],
    tags: [
      "Benchmark",
      "Coding",
      "Agent",
      "Tool use",
      "SWE-bench",
      "SWE-Lancer",
      "KernelBench",
      "Security",
    ],
  },
  {
    id: "res-benchmark-hubs-research-ml",
    type: "공식 문서",
    title: "리서치/ML 엔지니어링 벤치마크 허브",
    author:
      "PaperBench, MLE-bench, RE-Bench, ScienceAgentBench, SciVisAgentBench, BrowseComp, BrowseComp-V3, HCAST",
    language: "영어",
    level: "고급",
    summary:
      "AI 논문 재현, Kaggle형 ML engineering, frontier AI R&D, 데이터 기반 scientific discovery, scientific visualization, deep web browsing, multimodal browsing, 사람 소요 시간 기반 autonomy 평가를 묶어 리서치/ML 작업 추천 근거로 추적한다.",
    url: "https://arxiv.org/abs/2504.01848",
    sourceIds: [
      "paperbench-paper",
      "openai-frontier-evals",
      "mlebench-paper",
      "mlebench-github",
      "rebench-paper",
      "scienceagentbench-paper",
      "scivisagentbench-paper",
      "scivisagentbench-site",
      "browsecomp-paper",
      "browsecomp-v3-paper",
      "openai-simple-evals",
      "hcast-paper",
    ],
    providerIds: ["openai", "anthropic", "google", "xai", "qwen"],
    tags: [
      "Benchmark",
      "Research",
      "ML engineering",
      "BrowseComp",
      "PaperBench",
      "RE-Bench",
      "ScienceAgentBench",
      "리서치",
    ],
  },
  {
    id: "res-benchmark-hubs-security",
    type: "공식 문서",
    title: "보안/스마트컨트랙트 에이전트 벤치마크 허브",
    author: "EVMbench, Re-EVMbench, Cybench, SecureWebArena",
    language: "영어",
    level: "고급",
    summary:
      "스마트컨트랙트 취약점 탐지·패치·exploit, CTF 기반 cybersecurity agent, LVLM web agent 보안 공격/실패 분석, scaffold/오염 재평가 자료를 보안/자체배포 추천 근거로 추적한다.",
    url: "https://arxiv.org/abs/2603.04915",
    sourceIds: [
      "evmbench-paper",
      "reevmbench-paper",
      "openai-frontier-evals",
      "cybench-paper",
      "cybench-site",
      "securewebarena-paper",
    ],
    providerIds: ["openai", "anthropic", "google", "qwen"],
    tags: [
      "Benchmark",
      "Security",
      "Cybersecurity",
      "Smart contract",
      "SecureWebArena",
      "자체배포",
      "보안",
    ],
  },
  {
    id: "res-benchmark-hubs-web-os-agents",
    type: "공식 문서",
    title: "웹/OS 에이전트 벤치마크 허브",
    author:
      "GAIA, Mind2Web, WebArena, OSWorld, Windows Agent Arena, BrowseComp, SecureWebArena",
    language: "영어",
    level: "고급",
    summary:
      "브라우징, 실제 웹사이트 조작, 데스크톱/Windows OS 작업, 스크린 이해, tool-use, 웹 보안 공격 내성을 함께 비교해 AI 에이전트와 바이브 코딩 도구의 자동화 범위를 판단한다.",
    url: "https://arxiv.org/abs/2311.12983",
    sourceIds: [
      "gaia-paper",
      "gaia-leaderboard",
      "mind2web-paper",
      "mind2web-site",
      "webarena-benchmark",
      "osworld-benchmark",
      "windows-agent-arena-paper",
      "windows-agent-arena-site",
      "browsecomp-paper",
      "browsecomp-v3-paper",
      "securewebarena-paper",
    ],
    providerIds: ["openai", "anthropic", "google", "xai", "qwen"],
    tags: [
      "Benchmark",
      "Web agent",
      "OS agent",
      "BrowseComp",
      "GAIA",
      "Mind2Web",
      "웹 에이전트",
    ],
  },
  {
    id: "res-benchmark-hubs-work-office",
    type: "공식 문서",
    title: "업무/PPT/스프레드시트 벤치마크 허브",
    author: "OpenAI GDPval, SpreadsheetBench, BlueFin, OfficeBench, τ²-Bench",
    language: "영어",
    level: "고급",
    summary:
      "PPT, 문서, 다이어그램, 스프레드시트, 금융 workbook, 다중 office app 자동화, 고객지원 대화처럼 실제 업무 산출물을 평가하는 벤치마크를 묶어 추적한다.",
    url: "https://openai.com/index/gdpval/",
    sourceIds: [
      "gdpval-openai",
      "gdpval-paper",
      "spreadsheetbench-paper",
      "bluefin-paper",
      "officebench-paper",
      "tau2-bench-paper",
    ],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: [
      "Benchmark",
      "PPT",
      "문서",
      "스프레드시트",
      "Office automation",
      "업무 자동화",
    ],
  },
  {
    id: "res-benchmark-hubs-multimodal-docs",
    type: "공식 문서",
    title: "멀티모달/PPT/문서 벤치마크 허브",
    author: "MMMU, DocVQA, ChartQA",
    language: "영어",
    level: "고급",
    summary:
      "PPT, 리포트, 차트, 문서 이미지, 인포그래픽, 디자인/기술 도면 이해력을 평가할 때 MMMU, DocVQA, ChartQA를 보조 지표로 연결한다.",
    url: "https://mmmu-benchmark.github.io/",
    sourceIds: ["mmmu-benchmark", "docvqa-benchmark", "chartqa-benchmark"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["Benchmark", "PPT", "문서 이해", "차트", "멀티모달"],
  },
  {
    id: "res-benchmark-hubs-overall",
    type: "공식 문서",
    title: "종합 모델 벤치마크 허브",
    author: "Artificial Analysis, LMArena, Scale Labs, Stanford HELM",
    language: "영어",
    level: "실무",
    summary:
      "Artificial Analysis, LMArena, Scale Labs, Stanford HELM을 종합 성능·가격·선호도·안전성·효율 평가 근거로 함께 추적한다.",
    url: "https://artificialanalysis.ai/leaderboards/models",
    sourceIds: [
      "aa-leaderboard",
      "lmarena-leaderboard",
      "scale-leaderboard",
      "helm-leaderboard",
    ],
    providerIds: ["openai", "anthropic", "google", "xai", "mistral"],
    tags: ["Benchmark", "리더보드", "가격", "선호도", "안전성"],
  },
  {
    id: "res-ai-engineering-book",
    type: "도서",
    title: "AI Engineering",
    author: "Chip Huyen",
    language: "영어",
    level: "고급",
    summary:
      "LLM 애플리케이션을 제품 수준으로 만들 때 필요한 평가, 데이터, 운영, 시스템 설계를 폭넓게 다룬다.",
    url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
    sourceIds: ["oreilly-ai-engineering"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["AI Engineering", "Evaluation", "Production"],
  },
  {
    id: "res-hands-on-llm-book",
    type: "도서",
    title: "Hands-On Large Language Models",
    author: "Jay Alammar, Maarten Grootendorst",
    language: "영어",
    level: "입문",
    summary:
      "임베딩, 검색, RAG, 파인튜닝 등 LLM 실무 기초를 시각적으로 이해하기 좋다.",
    url: "https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/",
    sourceIds: ["oreilly-hands-on-llm"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["LLM", "Embedding", "RAG"],
  },
  {
    id: "res-udemy-ai-coding-agents",
    type: "강좌/영상",
    title: "Udemy AI Coding Agents 강좌 검색",
    author: "Udemy",
    language: "영어",
    level: "입문",
    summary:
      "AI coding agents, Claude Code, Cursor, agentic coding 관련 해외 강좌 후보를 계속 찾는 검색 허브.",
    url: "https://www.udemy.com/courses/search/?q=ai%20coding%20agents",
    sourceIds: ["udemy-ai-coding-agents"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["English", "Course", "AI Coding Agents", "Vibe Coding"],
  },
  {
    id: "res-coursera-ai-coding-agents",
    type: "강좌/영상",
    title: "Coursera AI Coding Agents 강좌 검색",
    author: "Coursera",
    language: "영어",
    level: "입문",
    summary:
      "AI coding agents, software engineering with AI, 개발 생산성 관련 해외 강좌 후보를 찾는 검색 허브.",
    url: "https://www.coursera.org/search?query=ai%20coding%20agents",
    sourceIds: ["coursera-ai-coding-agents"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["English", "Course", "Software Engineering", "AI Agents"],
  },
  {
    id: "res-deeplearning-ai-courses",
    type: "강좌/영상",
    title: "DeepLearning.AI Short Courses",
    author: "DeepLearning.AI",
    language: "영어",
    level: "실무",
    summary:
      "프롬프트, 에이전트, LLM 앱 개발 단기 강좌를 주제별로 추적하는 해외 강좌 허브.",
    url: "https://www.deeplearning.ai/short-courses/",
    sourceIds: ["deeplearning-ai-courses"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["English", "Short Course", "Agents", "LLM Apps"],
  },
  {
    id: "res-oreilly-ai-coding-books",
    type: "도서",
    title: "O'Reilly AI Coding Agents 도서 검색",
    author: "O'Reilly",
    language: "영어",
    level: "실무",
    summary:
      "AI coding agents, agentic software development, LLM application engineering 관련 해외 도서 후보를 찾는 O'Reilly 검색 허브.",
    url: "https://www.oreilly.com/search/?q=AI%20coding%20agents&type=book",
    sourceIds: ["oreilly-ai-coding-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["English", "Books", "AI Coding Agents", "AI Engineering"],
  },
  {
    id: "res-manning-llm-agent-books",
    type: "도서",
    title: "Manning LLM Agents 도서 검색",
    author: "Manning",
    language: "영어",
    level: "실무",
    summary:
      "LLM agents, AI engineering, agentic application development 관련 해외 도서 후보를 찾는 Manning 검색 허브.",
    url: "https://www.manning.com/search?q=LLM%20agents",
    sourceIds: ["manning-llm-agent-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["English", "Books", "LLM Agents", "AI Engineering"],
  },
  {
    id: "res-yes24-llm-books",
    type: "도서",
    title: "YES24 LLM 도서 검색",
    author: "YES24",
    language: "한국어",
    level: "입문",
    summary:
      "한국어 LLM, 생성형 AI, 프롬프트 엔지니어링, RAG 도서 후보를 계속 찾는 도서 검색 허브.",
    url: "https://www.yes24.com/Product/Search?domain=BOOK&query=LLM",
    sourceIds: ["yes24-llm-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "도서", "LLM", "생성형 AI"],
  },
  {
    id: "res-yes24-langchain-books",
    type: "도서",
    title: "YES24 LangChain 도서 검색",
    author: "YES24",
    language: "한국어",
    level: "실무",
    summary:
      "LangChain, RAG, LLM 앱 개발 실무 도서를 별도로 찾는 한국어 도서 검색 링크.",
    url: "https://www.yes24.com/Product/Search?domain=BOOK&query=LangChain",
    sourceIds: ["yes24-langchain-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "도서", "LangChain", "RAG"],
  },
  {
    id: "res-yes24-vibe-coding-books",
    type: "도서",
    title: "YES24 바이브 코딩 도서 검색",
    author: "YES24",
    language: "한국어",
    level: "입문",
    summary:
      "바이브 코딩, AI 코딩, 코딩 자동화 관련 한국어 도서 후보를 계속 찾는 YES24 검색 허브.",
    url: "https://www.yes24.com/Product/Search?domain=BOOK&query=%EB%B0%94%EC%9D%B4%EB%B8%8C%20%EC%BD%94%EB%94%A9",
    sourceIds: ["yes24-vibe-coding-books"],
    providerIds: ["openai", "anthropic", "google"],
    tags: ["한국어", "도서", "바이브 코딩", "AI 코딩"],
  },
  {
    id: "res-aladin-llm-books",
    type: "도서",
    title: "알라딘 LLM 도서 검색",
    author: "Aladin",
    language: "한국어",
    level: "입문",
    summary:
      "LLM, 생성형 AI, 프롬프트 엔지니어링, AI 앱 개발 도서 후보를 찾는 알라딘 검색 허브.",
    url: "https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=Book&SearchWord=LLM",
    sourceIds: ["aladin-llm-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "도서", "LLM", "생성형 AI"],
  },
  {
    id: "res-kyobo-llm-books",
    type: "도서",
    title: "교보문고 LLM 도서 검색",
    author: "Kyobo Book Centre",
    language: "한국어",
    level: "입문",
    summary: "LLM과 생성형 AI 관련 국내 도서 후보를 찾는 교보문고 검색 허브.",
    url: "https://search.kyobobook.co.kr/search?keyword=LLM&target=total&gbCode=TOT",
    sourceIds: ["kyobo-llm-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "도서", "LLM", "생성형 AI"],
  },
  {
    id: "res-gilbut-llm-books",
    type: "도서",
    title: "길벗 LLM 도서 검색",
    author: "Gilbut",
    language: "한국어",
    level: "입문",
    summary:
      "길벗 출판사의 LLM, AI 개발, 데이터/자동화 관련 도서 후보를 찾는 검색 링크.",
    url: "https://www.gilbut.co.kr/search?keyword=LLM",
    sourceIds: ["gilbut-llm-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "도서", "LLM", "AI 개발"],
  },
  {
    id: "res-wikibook-llm-books",
    type: "도서",
    title: "위키북스 LLM 도서 검색",
    author: "Wikibook",
    language: "한국어",
    level: "입문",
    summary: "위키북스의 LLM, 생성형 AI, 개발 실무 도서 후보를 찾는 검색 링크.",
    url: "https://wikibook.co.kr/?s=LLM",
    sourceIds: ["wikibook-llm-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "도서", "LLM", "개발 실무"],
  },
  {
    id: "res-korean-publisher-llm-books",
    type: "도서",
    title: "국내 출판사 LLM/AI 신간 검색",
    author: "Hanbit, JPub, Acorn Publishing",
    language: "한국어",
    level: "입문",
    summary:
      "한빛미디어, 제이펍, 에이콘출판사의 LLM, 생성형 AI, 데이터/개발 실무 신간 후보를 계속 찾는 검색 허브.",
    url: "https://www.hanbit.co.kr/search/search_list.html?keyword=LLM",
    sourceIds: ["hanbit-llm-books", "jpub-llm-books", "acornpub-llm-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["한국어", "도서", "신간", "출판사"],
  },
  {
    id: "res-packt-llm-agent-books",
    type: "도서",
    title: "Packt LLM Agent 도서 검색",
    author: "Packt",
    language: "영어",
    level: "실무",
    summary:
      "LLM agents, AI coding, LangChain/LangGraph, agentic development 관련 해외 실무 도서 후보를 찾는 검색 허브.",
    url: "https://www.packtpub.com/search?query=LLM%20agents",
    sourceIds: ["packt-llm-agent-books"],
    providerIds: ["openai", "anthropic", "google", "qwen", "mistral"],
    tags: ["English", "Books", "LLM Agents", "신간"],
  },
  {
    id: "res-wikidocs-ai",
    type: "커뮤니티",
    title: "WikiDocs AI/개발 전자책",
    author: "WikiDocs",
    language: "한국어",
    level: "입문",
    summary:
      "한국어 무료 전자책과 튜토리얼을 검색해 Python, 데이터, AI 기초 학습 경로를 찾는 커뮤니티 문서 허브.",
    url: "https://wikidocs.net/",
    sourceIds: ["wikidocs"],
    providerIds: ["openai", "google", "qwen", "mistral"],
    tags: ["한국어", "무료 문서", "전자책", "커뮤니티"],
  },
];

export const curationMonitors: CurationMonitor[] = [
  {
    id: "monitor-openai-models",
    sourceId: "openai-models",
    providerId: "openai",
    cadence: "매일",
    priority: "P0",
    status: "자동화 후보",
    owner: "모델 스펙",
    nextCheck: "2026-06-18",
    nextAction:
      "모델 목록 diff를 생성하고 GPT-5.5, GPT-5.4 mini/nano 가격 변경 여부를 확인",
    automationHint:
      "공식 models 페이지를 스냅샷 저장 후 modelId, context, price, tools 필드를 비교한다.",
  },
  {
    id: "monitor-anthropic-models",
    sourceId: "anthropic-models",
    providerId: "anthropic",
    cadence: "매일",
    priority: "P0",
    status: "정상",
    owner: "모델 스펙",
    nextCheck: "2026-06-18",
    nextAction: "Fable/Mythos/Opus/Sonnet 제공 범위와 fallback 문서 변경 확인",
    automationHint:
      "모델 overview와 Fable 5 소개 문서를 함께 크롤링해 status, context, output limit을 비교한다.",
  },
  {
    id: "monitor-gemini-models",
    sourceId: "google-models",
    providerId: "google",
    cadence: "매일",
    priority: "P0",
    status: "확인 필요",
    owner: "모델 스펙",
    nextCheck: "2026-06-18",
    nextAction:
      "Preview 모델명, Live API, 이미지/비디오 생성 모델의 지원 기능 분리 확인",
    automationHint:
      "Gemini 모델 목록에서 model slug, supported generation methods, input/output modality를 추출한다.",
  },
  {
    id: "monitor-xai-models",
    sourceId: "xai-models",
    providerId: "xai",
    cadence: "주 2회",
    priority: "P1",
    status: "정상",
    owner: "모델 스펙",
    nextCheck: "2026-06-19",
    nextAction:
      "Grok alias가 최신 모델을 가리키는지와 검색 도구 정책 변경 확인",
    automationHint:
      "models 페이지와 grok-4.3 세부 페이지의 alias, price, context 필드를 비교한다.",
  },
  {
    id: "monitor-manus-api",
    sourceId: "manus-api",
    providerId: "manus",
    cadence: "주 2회",
    priority: "P1",
    status: "자동화 후보",
    owner: "에이전트",
    nextCheck: "2026-06-19",
    nextAction:
      "Tasks, Projects, Files, Webhooks, Skills, Agents 섹션 변경 여부 확인",
    automationHint:
      "문서 목차와 endpoint 목록을 JSON으로 저장하고 새 endpoint를 업데이트 후보로 만든다.",
  },
  {
    id: "monitor-aa-leaderboard",
    sourceId: "aa-leaderboard",
    providerId: "market",
    cadence: "매일",
    priority: "P0",
    status: "확인 필요",
    owner: "벤치마크",
    nextCheck: "2026-06-18",
    nextAction:
      "상위 20개 모델의 Intelligence Index, blended price, speed, latency 변동 확인",
    automationHint:
      "리더보드 데이터를 CSV/JSON으로 추출해 이전 스냅샷 대비 rank delta를 계산한다.",
  },
  {
    id: "monitor-kimi-models",
    sourceId: "kimi-models",
    providerId: "kimi",
    cadence: "매일",
    priority: "P0",
    status: "자동화 후보",
    owner: "모델 스펙",
    nextCheck: "2026-06-19",
    nextAction:
      "Kimi K2.7 Code, HighSpeed, K2.6/K2.5 모델명과 지원 중단 모델 변경 확인",
    automationHint:
      "models 페이지의 모델 slug, context, deprecation notice를 스냅샷으로 저장한다.",
  },
  {
    id: "monitor-deepseek-pricing",
    sourceId: "deepseek-pricing",
    providerId: "deepseek",
    cadence: "매일",
    priority: "P0",
    status: "자동화 후보",
    owner: "모델 스펙",
    nextCheck: "2026-06-19",
    nextAction:
      "V4 Flash/Pro 가격, context, output limit, 레거시 중단 일정 확인",
    automationHint:
      "가격표의 cache hit/miss 입력 단가와 output 단가를 구조화해 비용 계산기와 diff한다.",
  },
  {
    id: "monitor-qwen-docs",
    sourceId: "qwen-docs",
    providerId: "qwen",
    cadence: "주 2회",
    priority: "P1",
    status: "자동화 후보",
    owner: "모델 스펙",
    nextCheck: "2026-06-20",
    nextAction:
      "Qwen3-2507, Coder, VL, 로컬 실행/배포 프레임워크 문서 변경 확인",
    automationHint:
      "Qwen docs 목차와 모델명 문자열을 추출해 신규 모델과 배포 가이드를 후보로 만든다.",
  },
  {
    id: "monitor-mistral-models",
    sourceId: "mistral-models",
    providerId: "mistral",
    cadence: "매일",
    priority: "P0",
    status: "정상",
    owner: "모델 스펙",
    nextCheck: "2026-06-19",
    nextAction:
      "Medium 3.5, Small 4, Ministral 3, Devstral 2 모델 카드와 가격 변경 확인",
    automationHint:
      "models overview에서 featured/frontier/specialist 모델 목록과 deprecation 표를 diff한다.",
  },
  {
    id: "monitor-vibe-coding-channels",
    sourceId: "youtube-teddynote",
    providerId: "market",
    cadence: "주 1회",
    priority: "P1",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "Codex, Claude Code, Gemini CLI, Kimi, DeepSeek, Qwen, Mistral 관련 한국어 신규 영상 후보 확인",
    automationHint:
      "YouTube 채널 RSS와 검색 링크를 함께 돌려 모델명 + '코딩', 'RAG', 'CLI', 'PPT' 키워드로 분류한다.",
  },
  {
    id: "monitor-vibe-coding-search",
    sourceId: "youtube-vibe-coding-search",
    providerId: "market",
    cadence: "주 1회",
    priority: "P1",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "바이브 코딩, Claude Code, Codex, Cursor 한국어 신규 영상 후보 확인",
    automationHint:
      "YouTube 검색 결과를 직접 게시하지 않고 제목, 채널명, URL, 업로드일 후보만 편집 큐에 넣는다.",
  },
  {
    id: "monitor-inflearn-vibe-coding",
    sourceId: "inflearn-vibe-coding",
    providerId: "market",
    cadence: "주 1회",
    priority: "P2",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "인프런 바이브 코딩, AI 코딩, Claude Code, Codex, Cursor 강좌 후보 확인",
    automationHint:
      "인프런 검색 허브별 결과를 강좌명, 강사, 무료/유료, 난이도 태그로 분류해 수동 검토 큐에 저장한다.",
  },
  {
    id: "monitor-korean-creator-hubs",
    sourceId: "youtube-codefactory-search",
    providerId: "market",
    cadence: "주 1회",
    priority: "P2",
    status: "확인 필요",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "코드팩토리, 개발동생, 코딩 알려주는 누나, 메타코드M 관련 AI 코딩 신규 자료 후보를 검색 허브 기준으로 확인",
    automationHint:
      "크리에이터명 검색 링크는 정확한 채널 URL이 확인되기 전까지 검색 후보로만 유지하고, 확정 후 단일 채널 sourceId를 추가한다.",
  },
  {
    id: "monitor-korean-dev-youtube-direct",
    sourceId: "youtube-nomadcoders-channel",
    providerId: "market",
    cadence: "주 1회",
    priority: "P2",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "노마드코더, 드림코딩, 코딩애플, 나도코딩, 얄코, 생활코딩, 빵형의 개발도상국 신규 AI/개발 생산성 영상 후보 확인",
    automationHint:
      "직접 채널은 RSS/영상 목록에서 AI, Cursor, Claude Code, Codex, Copilot, 자동화, LangChain, RAG 키워드를 추출해 한국어 강좌 후보로 보낸다.",
  },
  {
    id: "monitor-korean-ai-books",
    sourceId: "yes24-vibe-coding-books",
    providerId: "market",
    cadence: "월 1회",
    priority: "P2",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-07-01",
    nextAction:
      "YES24, 알라딘, 교보, 길벗, 위키북스의 LLM/AI 코딩 신간 후보 확인",
    automationHint:
      "서점 검색 허브는 ISBN/제목/출간일이 확인된 항목만 도서 리소스로 승격한다.",
  },
  {
    id: "monitor-ai-coding-tool-docs",
    sourceId: "cursor-docs",
    providerId: "market",
    cadence: "주 1회",
    priority: "P1",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "Cursor, Windsurf, Cline, Roo Code, Aider, Continue, OpenHands, Lovable, Bolt, v0, Replit Agent, Copilot, Devin 문서 변경 확인",
    automationHint:
      "도구 공식 문서의 릴리스/설정/MCP/agent mode 변경을 감지해 바이브 코딩 도구 섹션 후보로 보낸다.",
  },
  {
    id: "monitor-ai-coding-tool-directory",
    sourceId: "github-copilot-plans",
    providerId: "market",
    cadence: "주 2회",
    priority: "P1",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-20",
    nextAction:
      "Copilot, JetBrains Junie, Amazon Q, Gemini Code Assist, Amp, Zed, Augment, Tabnine, TRAE의 공식 문서와 플랜 변경 확인",
    automationHint:
      "도구별 category, pricing, eventSignal, sourceIds를 diff해 AI 코딩 도구 디렉터리 업데이트 후보로 보낸다.",
  },
  {
    id: "monitor-code-review-ai-tools",
    sourceId: "coderabbit-docs",
    providerId: "market",
    cadence: "주 2회",
    priority: "P1",
    status: "자동화 후보",
    owner: "에이전트",
    nextCheck: "2026-06-20",
    nextAction:
      "CodeRabbit, Copilot code review, Cursor Bugbot의 PR 리뷰/Autofix/UTG/pre-merge 기능 변경 확인",
    automationHint:
      "PR review, Autofix, unit test, pre-merge, OSS free 키워드를 추출해 리뷰 도구 비교 섹션에 반영한다.",
  },
  {
    id: "monitor-gemini-code-assist-jules",
    sourceId: "gemini-code-assist-ko",
    providerId: "google",
    cadence: "주 2회",
    priority: "P1",
    status: "확인 필요",
    owner: "에이전트",
    nextCheck: "2026-06-20",
    nextAction:
      "Gemini Code Assist 가격, 30일 trial, Gemini CLI 연동, Jules usage/limits/API/CLI 변경 확인",
    automationHint:
      "Code Assist 제품 페이지와 Jules docs의 pricing, usage limits, CLI, GitHub integration 섹션을 구조화한다.",
  },
  {
    id: "monitor-trae-ai-ide-events",
    sourceId: "trae-pricing",
    providerId: "market",
    cadence: "주 2회",
    priority: "P2",
    status: "확인 필요",
    owner: "학습 리소스",
    nextCheck: "2026-06-20",
    nextAction:
      "TRAE 7일 trial, SOLO mode, Basic usage, concurrent cloud tasks, model early access 변경 확인",
    automationHint:
      "가격표의 Free/Lite/Pro/Pro+/Ultra 필드를 파싱해 이벤트 비용 비교 섹션 후보로 보낸다.",
  },
  {
    id: "monitor-jetbrains-amazon-q-korean",
    sourceId: "jetbrains-junie",
    providerId: "market",
    cadence: "주 1회",
    priority: "P2",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "JetBrains Junie, Amazon Q Developer, AWS/JetBrains 한국어 강좌와 학생/교육 혜택 후보 확인",
    automationHint:
      "YouTube/Inflearn 검색 허브에서 JetBrains Junie, Amazon Q Developer 키워드 신규 후보를 수동 검토 큐로 보낸다.",
  },
  {
    id: "monitor-cursor-changelog",
    sourceId: "cursor-changelog",
    providerId: "cursor",
    cadence: "주 2회",
    priority: "P1",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-20",
    nextAction:
      "Cursor Cloud agents, Bugbot, CLI, Design Mode, SDK 변경과 바이브 코딩 추천 영향 확인",
    automationHint:
      "Cursor changelog에서 Agent, Bugbot, CLI, Cloud, MCP, pricing 키워드를 추출해 추천 매트릭스와 이벤트 카드 후보로 보낸다.",
  },
  {
    id: "monitor-cursor-students",
    sourceId: "cursor-students",
    providerId: "cursor",
    cadence: "주 2회",
    priority: "P2",
    status: "확인 필요",
    owner: "학습 리소스",
    nextCheck: "2026-06-20",
    nextAction:
      "Cursor 학생 1년 Pro 무료 혜택, .edu 인증, 포함 사용량, 지역/학교 조건 변경 확인",
    automationHint:
      "학생 혜택 페이지의 free year, Pro features, included usage, verification 조건을 구조화해 이벤트 섹션에 반영한다.",
  },
  {
    id: "monitor-korean-education-hubs",
    sourceId: "kmooc-ai",
    providerId: "market",
    cadence: "주 1회",
    priority: "P2",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "K-MOOC, 부스트코스, 엘리스, 프로그래머스, 구름EDU, 패스트캠퍼스, 코드잇, 스파르타 신규 AI 강좌 후보 확인",
    automationHint:
      "교육기관 허브는 강좌명, 운영기관, 온라인/오프라인, 무료/유료, 시작일을 수동 검토 큐에 넣는다.",
  },
  {
    id: "monitor-korean-ai-blogs",
    sourceId: "upstage-blog",
    providerId: "market",
    cadence: "주 1회",
    priority: "P2",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "Upstage, NAVER Cloud, LY Corporation, Superb AI, OKKY, Velog, Brunch의 LLM/AI 최신 글 후보 확인",
    automationHint:
      "블로그 후보는 발행일, 제품명, 모델명, 한국어 여부를 추출해 웹진 섹션 후보로 만든다.",
  },
  {
    id: "monitor-korean-new-books",
    sourceId: "hanbit-llm-books",
    providerId: "market",
    cadence: "월 1회",
    priority: "P2",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-07-01",
    nextAction:
      "한빛, 제이펍, 에이콘, Packt의 LLM/AI agent/AI coding 신간 후보 확인",
    automationHint:
      "신간 후보는 ISBN, 출간일, 저자, 원서/번역서 여부를 확인한 뒤 도서 카드로 승격한다.",
  },
  {
    id: "monitor-llm-event-promotions",
    sourceId: "google-gemini-pricing",
    providerId: "market",
    cadence: "주 2회",
    priority: "P1",
    status: "확인 필요",
    owner: "모델 스펙",
    nextCheck: "2026-06-20",
    nextAction:
      "OpenAI, Claude, Gemini, Grok, Manus, Kimi, DeepSeek, Qwen, Mistral의 2배 크레딧, 무료 quota, 할인 이벤트 확인",
    automationHint:
      "가격/뉴스 페이지에서 credit, referral, invite, free, discount, student, promo 키워드를 추출하되 자동 게시하지 않는다.",
  },
  {
    id: "monitor-referral-events",
    sourceId: "manus-pricing",
    providerId: "market",
    cadence: "주 2회",
    priority: "P1",
    status: "확인 필요",
    owner: "에이전트",
    nextCheck: "2026-06-20",
    nextAction:
      "친구 초대, 추천 보상, 신규 가입 크레딧, 팀 플랜 이벤트 후보 확인",
    automationHint:
      "추천 이벤트는 적용 국가, 계정 조건, 만료일, 보상 단위를 확인한 뒤 이벤트 섹션에 게시한다.",
  },
  {
    id: "monitor-ai-news",
    sourceId: "ap-g7-ai-sovereignty",
    providerId: "market",
    cadence: "매일",
    priority: "P1",
    status: "확인 필요",
    owner: "학습 리소스",
    nextCheck: "2026-06-19",
    nextAction: "AI 주권, 규제, 오픈웨이트, 모델 접근 제한 관련 최신 뉴스 확인",
    automationHint:
      "publisher/news source는 자동 게시하지 않고 headline, date, source URL만 후보로 저장한 뒤 편집 검토한다.",
  },
  {
    id: "monitor-learning",
    sourceId: "youtube-teddynote",
    providerId: "market",
    cadence: "주 1회",
    priority: "P2",
    status: "정상",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction: "한국어 RAG/AI 코딩 강좌 신규 업로드를 강좌 섹션 후보로 분류",
    automationHint:
      "YouTube 채널 RSS를 구독하고 title에 RAG, LangChain, Claude, Gemini, Codex 키워드를 매칭한다.",
  },
  {
    id: "monitor-expanded-benchmark-sources",
    sourceId: "swebench-leaderboard",
    providerId: "market",
    cadence: "주 2회",
    priority: "P1",
    status: "확인 필요",
    owner: "벤치마크",
    nextCheck: "2026-06-20",
    nextAction:
      "SWE-bench, SWE-Bench Pro, Dialogue-SWEBench, Claw-SWE-Bench, SWE-Lancer, SWE Context Bench, SWE-Bench Mobile, SWE-MERA, SWE-Gym, KernelBench, EVMbench, LiveCodeBench, Aider, BigCodeBench, BFCL, Terminal-Bench, OSWorld, WebArena, GAIA, Mind2Web, Windows Agent Arena, SecureWebArena, MMMU, DocVQA, ChartQA의 신규 리더보드/평가 버전 확인",
    automationHint:
      "벤치마크별 domain, metric, score, 비용/latency 유무, 데이터셋 규모를 분리해 코딩/PPT/에이전트 필터 후보로 보낸다.",
  },
  {
    id: "monitor-research-ml-security-benchmarks",
    sourceId: "paperbench-paper",
    providerId: "market",
    cadence: "주 2회",
    priority: "P1",
    status: "확인 필요",
    owner: "벤치마크",
    nextCheck: "2026-06-20",
    nextAction:
      "PaperBench, MLE-bench, RE-Bench, ScienceAgentBench, SciVisAgentBench, BrowseComp, BrowseComp-V3, HCAST, EVMbench, Re-EVMbench, Cybench, SecureWebArena의 task 수, 공개 subset, human baseline, cost/run 변경 확인",
    automationHint:
      "research, ML engineering, browsing, security, GPU kernel, smart contract, CTF 차원을 분리해 모델 추천 근거와 벤치마크 필터 후보로 보낸다.",
  },
  {
    id: "monitor-web-os-agent-benchmarks",
    sourceId: "gaia-paper",
    providerId: "market",
    cadence: "주 2회",
    priority: "P1",
    status: "확인 필요",
    owner: "벤치마크",
    nextCheck: "2026-06-20",
    nextAction:
      "GAIA, Mind2Web, WebArena, OSWorld, Windows Agent Arena, BrowseComp, SecureWebArena의 web/OS task 변화와 leaderboard 공개 여부 확인",
    automationHint:
      "web navigation, desktop/OS operation, browsing, screen understanding, tool-use, security attack robustness 필드를 분리해 에이전트 자동화 추천에 반영한다.",
  },
  {
    id: "monitor-office-work-benchmarks",
    sourceId: "gdpval-openai",
    providerId: "market",
    cadence: "주 2회",
    priority: "P1",
    status: "확인 필요",
    owner: "벤치마크",
    nextCheck: "2026-06-20",
    nextAction:
      "GDPval, SpreadsheetBench, BlueFin, OfficeBench, τ²-Bench의 PPT/문서/스프레드시트/고객지원/업무 자동화 평가 항목과 공개 subset 변경 확인",
    automationHint:
      "office benchmark는 deliverable type, public/private split, grading 방식, 사람 전문가 비교 여부를 분리해 디자인/PPT와 업무 자동화 필터 후보로 보낸다.",
  },
  {
    id: "monitor-korean-course-platforms-expanded",
    sourceId: "nomadcoders",
    providerId: "market",
    cadence: "주 1회",
    priority: "P2",
    status: "자동화 후보",
    owner: "학습 리소스",
    nextCheck: "2026-06-24",
    nextAction:
      "노마드코더, 드림코딩, CLASS101, 콜로소, 원티드, 멋쟁이사자처럼, AIFFEL, 오픈튜토리얼스, 에드위드, KOCW, 제로베이스, 오즈코딩, 멀티캠퍼스의 AI 코딩/LLM 강좌 후보 확인",
    automationHint:
      "강좌명, 언어, 가격/무료 여부, 온라인 여부, 최신 등록일, AI 코딩 관련 키워드를 추출해 한국어 자료실 후보로 보낸다.",
  },
];

export const updatePipeline: UpdatePipelineItem[] = [
  {
    id: "pipe-official-model-diff",
    title: "공식 모델 문서 diff 자동 생성",
    providerId: "market",
    stage: "검토",
    priority: "높음",
    sourceIds: [
      "openai-models",
      "anthropic-models",
      "google-models",
      "xai-models",
      "kimi-models",
      "deepseek-pricing",
      "qwen-docs",
      "mistral-models",
    ],
    summary:
      "주요 모델 문서의 모델명, 컨텍스트, 출력 한도, 가격, 도구 지원 변경점을 매일 비교해 업데이트 후보를 만든다.",
    acceptance: [
      "변경된 sourceId와 필드명이 기록된다.",
      "한국어 요약 초안과 원문 URL이 함께 생성된다.",
      "가격/벤치마크 값은 자동 게시 전 수동 검토가 필요하다고 표시된다.",
    ],
  },
  {
    id: "pipe-benchmark-rank-delta",
    title: "벤치마크 순위 변동 리포트",
    providerId: "market",
    stage: "수집",
    priority: "높음",
    sourceIds: [
      "aa-leaderboard",
      "lmarena-leaderboard",
      "scale-leaderboard",
      "helm-leaderboard",
      "swebench-leaderboard",
      "swebench-pro-paper",
      "dialogue-swebench-paper",
      "claw-swebench-paper",
      "swelancer-paper",
      "openai-frontier-evals",
      "paperbench-paper",
      "mlebench-paper",
      "mlebench-github",
      "rebench-paper",
      "browsecomp-paper",
      "browsecomp-v3-paper",
      "openai-simple-evals",
      "kernelbench-paper",
      "hcast-paper",
      "evmbench-paper",
      "reevmbench-paper",
      "cybench-paper",
      "cybench-site",
      "scienceagentbench-paper",
      "scivisagentbench-paper",
      "scivisagentbench-site",
      "swe-contextbench-paper",
      "swebench-mobile-leaderboard",
      "swebench-mobile-paper",
      "swe-mera-paper",
      "swegym-paper",
      "livecodebench-leaderboard",
      "aider-polyglot-leaderboard",
      "bigcodebench-leaderboard",
      "bfcl-leaderboard",
      "terminal-bench",
      "osworld-benchmark",
      "webarena-benchmark",
      "gaia-paper",
      "gaia-leaderboard",
      "mind2web-paper",
      "mind2web-site",
      "windows-agent-arena-paper",
      "windows-agent-arena-site",
      "securewebarena-paper",
      "mmmu-benchmark",
      "docvqa-benchmark",
      "chartqa-benchmark",
      "gdpval-openai",
      "gdpval-paper",
      "spreadsheetbench-paper",
      "bluefin-paper",
      "officebench-paper",
      "tau2-bench-paper",
    ],
    summary:
      "종합, 코딩, 장기 SWE, 대화형/harness/freelance/경험 재사용 SWE, 모바일 개발, 동적 SWE, 연구 재현, ML engineering, AI R&D, scientific discovery, GPU kernel, browsing, web/OS agent, 스마트컨트랙트/CTF/web security, 함수 호출, 터미널/브라우저 에이전트, 문서/PPT/스프레드시트/업무 자동화 벤치마크의 rank, score, price, speed, latency, 데이터셋 규모 변동을 요약한다.",
    acceptance: [
      "상위 모델과 평가 버전 변화가 있는 항목만 강조한다.",
      "가격과 latency가 동시에 나빠진 모델은 주의 라벨을 붙인다.",
      "벤치마크 출처, 확인일, 평가 분야를 UI에 표시한다.",
    ],
  },
  {
    id: "pipe-ai-coding-tool-directory",
    title: "AI 코딩 도구 디렉터리",
    providerId: "market",
    stage: "검토",
    priority: "높음",
    sourceIds: [
      "cursor-docs",
      "cursor-changelog",
      "cursor-students",
      "github-copilot-plans",
      "github-education-pack",
      "jetbrains-ai",
      "jetbrains-junie",
      "amazon-q-developer-docs",
      "amazon-q-developer-pricing",
      "gemini-code-assist-ko",
      "google-jules-docs",
      "sourcegraph-amp-manual",
      "sourcegraph-pricing",
      "zed-ai",
      "augment-docs",
      "augment-pricing",
      "tabnine-docs",
      "tabnine-pricing",
      "coderabbit-docs",
      "coderabbit-pricing",
      "trae-docs",
      "trae-pricing",
    ],
    summary:
      "Cursor, Copilot, Junie, Amazon Q, Gemini Code Assist/Jules, Amp, Zed, Augment, Tabnine, CodeRabbit, TRAE, 오픈소스 에이전트 스택을 가격/이벤트/한국어 자료/통합 방식으로 비교한다.",
    acceptance: [
      "모델 제공사와 도구 제공사를 분리해 표시한다.",
      "무료/학생/체험/엔터프라이즈/오픈소스 조건이 검색 가능하다.",
      "공식 문서와 한국어 강좌 검색 허브를 동시에 노출한다.",
    ],
  },
  {
    id: "pipe-korean-learning-roundup",
    title: "한국어 강좌/도서 주간 큐레이션",
    providerId: "market",
    stage: "한국어 요약",
    priority: "보통",
    sourceIds: [
      "youtube-teddynote",
      "youtube-jocoding",
      "youtube-google-developers-korea",
      "youtube-aws-korea",
      "youtube-ms-dev-korea",
      "youtube-hermes-agent-video",
      "youtube-vibe-coding-search",
      "youtube-codefactory-search",
      "youtube-dev-dongsaeng-search",
      "youtube-codingnoona-search",
      "youtube-metacodem-search",
      "teddynote-blog",
      "inflearn-vibe-coding",
      "inflearn-ai-coding",
      "inflearn-codefactory",
      "inflearn-dev-dongsaeng",
      "inflearn-github-copilot",
      "inflearn-cursor",
      "inflearn-windsurf",
      "youtube-cursor-korean-search",
      "youtube-windsurf-korean-search",
      "youtube-cline-roo-korean-search",
      "youtube-jetbrains-junie-korean-search",
      "youtube-amazon-q-korean-search",
      "youtube-augment-korean-search",
      "youtube-tabnine-korean-search",
      "youtube-coderabbit-korean-search",
      "youtube-trae-korean-search",
      "youtube-nomadcoders-channel",
      "youtube-dreamcoding-channel",
      "youtube-codingapple-channel",
      "youtube-nadocoding-channel",
      "youtube-yalco-channel",
      "youtube-opentutorials-channel",
      "youtube-bbanghyong-channel",
      "kmooc-ai",
      "boostcourse-ai",
      "elice-ai",
      "modulabs-ai",
      "nomadcoders",
      "dreamcoding-academy",
      "class101-dev-ai",
      "coloso-dev-ai",
      "wanted-events",
      "likelion-school",
      "aiffel-ai",
      "opentutorials",
      "edwith",
      "kocw",
      "okky-community",
      "velog-ai-coding-search",
      "brunch-ai-coding-search",
      "zerobase",
      "ozcoding",
      "multicampus",
      "yes24-llm-books",
      "yes24-vibe-coding-books",
      "hanbit-llm-books",
      "openai-videos",
      "anthropic-courses",
    ],
    summary:
      "한국어 유튜브 강좌와 공식 학습 자료를 난이도와 주제별로 분류해 강좌/도서 섹션을 갱신한다.",
    acceptance: [
      "한국어/영어, 입문/실무/고급 난이도가 누락되지 않는다.",
      "도서와 영상은 서로 다른 컬럼에 유지된다.",
      "채널 추천은 과장 없이 “따라가기 좋은” 수준의 설명으로 제한한다.",
    ],
  },
  {
    id: "pipe-vibe-coding-command-matrix",
    title: "AI 바이브 코딩 명령어 매트릭스",
    providerId: "market",
    stage: "검토",
    priority: "높음",
    sourceIds: [
      "openai-codex-cli",
      "claude-code-docs",
      "claude-code-setup",
      "gemini-cli-github",
      "kimi-k27-code",
      "deepseek-pricing",
      "qwen-quickstart",
      "mistral-api",
    ],
    summary:
      "Codex, Claude Code, Gemini CLI, Kimi/DeepSeek OpenAI 호환, Qwen 로컬 배포, Mistral SDK 명령어를 실제 사용 표면별로 비교한다.",
    acceptance: [
      "전용 CLI, OpenAI 호환 API, 공식 SDK, 로컬 배포를 같은 축으로 분류한다.",
      "각 명령어 옆에 설정 변수, 적합 업무, 주의점을 붙인다.",
      "공식 문서에서 확인되지 않은 커뮤니티 채널은 '확인 필요'로 표시한다.",
    ],
  },
  {
    id: "pipe-task-recommendation-matrix",
    title: "사용자 작업별 LLM/도구 추천 매트릭스",
    providerId: "market",
    stage: "게시 준비",
    priority: "높음",
    sourceIds: [
      "cursor-docs",
      "cursor-pricing",
      "openai-codex-cli",
      "claude-code-docs",
      "google-gemini31",
      "manus-api",
      "deepseek-pricing",
      "qwen-docs",
      "mistral-models",
    ],
    summary:
      "사용자가 하려는 작업을 코딩, PPT/문서, 최신 리서치, 업무 자동화, 저비용, 학습, 보안/자체배포로 분류해 추천 모델과 CLI를 연결한다.",
    acceptance: [
      "추천 이유와 tradeoff가 모델 광고처럼 보이지 않게 같이 표시된다.",
      "Cursor 같은 IDE/도구는 기저 LLM과 별도 축으로 설명한다.",
      "각 추천은 관련 명령어, 벤치마크 분야, 학습 자료 링크를 함께 제공한다.",
    ],
  },
  {
    id: "pipe-llm-event-watch",
    title: "LLM 이벤트/프로모션 확인 큐",
    providerId: "market",
    stage: "수집",
    priority: "높음",
    sourceIds: [
      "anthropic-pricing",
      "anthropic-news",
      "google-gemini-pricing",
      "google-ai-blog",
      "manus-pricing",
      "kimi-pricing",
      "deepseek-pricing",
      "qwen-billing",
      "mistral-pricing",
      "mistral-news",
    ],
    summary:
      "2배 크레딧, 친구 초대, 무료 quota, 학생/교육 혜택, 플랜 할인 이벤트 후보를 제공사별로 수집한다.",
    acceptance: [
      "이벤트명, 제공사, 적용 국가, 시작일/만료일, 보상 단위가 확인된다.",
      "공식 근거 없는 커뮤니티 제보는 자동 게시하지 않는다.",
      "확정 이벤트는 비용 계산기의 이벤트 비용 비교 섹션에 반영한다.",
    ],
  },
  {
    id: "pipe-ai-news-webzine",
    title: "AI 뉴스/커뮤니티 웹진 큐레이션",
    providerId: "market",
    stage: "한국어 요약",
    priority: "높음",
    sourceIds: [
      "ap-g7-ai-sovereignty",
      "axios-anthropic-oversight",
      "google-dev-blog-ko",
      "naver-d2",
      "kakao-tech-blog",
      "toss-tech-blog",
      "woowahan-ai-blog",
      "okky-community",
      "velog-ai-coding-search",
      "brunch-ai-coding-search",
    ],
    summary:
      "최신 AI 뉴스, 국내 기술 블로그, OKKY/Velog/Brunch 커뮤니티 학습 자료를 웹진형 카드로 묶어 뉴스/커뮤니티 섹션을 갱신한다.",
    acceptance: [
      "뉴스는 발행일과 출처를 표시하고 자동 게시하지 않는다.",
      "블로그/커뮤니티 자료는 한국어 여부와 형식을 필터링할 수 있다.",
      "바이브 코딩, 오픈웨이트, PPT/디자인 같은 주제 태그를 붙인다.",
    ],
  },
  {
    id: "pipe-agent-platform-notes",
    title: "에이전트 플랫폼 비교 노트",
    providerId: "manus",
    stage: "게시 준비",
    priority: "보통",
    sourceIds: ["manus-home", "manus-api"],
    summary:
      "Manus를 일반 LLM 모델표가 아니라 태스크 실행형 플랫폼 관점으로 비교하는 설명을 유지한다.",
    acceptance: [
      "기저 모델 스펙을 추정해 쓰지 않는다.",
      "Tasks, Projects, Files, Webhooks, Skills, Agents 기능을 별도 축으로 보여준다.",
      "보안/권한/감사 로그 검토 필요성을 주의점으로 남긴다.",
    ],
  },
];

export const featureBacklog: FeatureBacklogItem[] = [
  {
    id: "feature-source-crawler",
    title: "공식 소스 스냅샷 크롤러",
    priority: "P0",
    status: "구현됨",
    rationale:
      "최신 모델명과 가격은 변동성이 높아 수동 갱신만으로는 포털 신뢰도를 유지하기 어렵다.",
    acceptance: [
      "공식 문서 URL별 마지막 스냅샷과 현재 스냅샷을 저장한다.",
      "변경 필드와 원문 URL을 업데이트 후보로 만든다.",
      "네트워크 실패는 기존 콘텐츠를 깨지 않고 “확인 필요” 상태로 표시한다.",
    ],
  },
  {
    id: "feature-editor-workbench",
    title: "한국어 편집 워크벤치",
    priority: "P0",
    status: "구현됨",
    rationale:
      "자동 수집 결과를 바로 게시하지 않고 원문 확인, 번역, 요약, 태그 부여를 거치는 운영 화면이 필요하다.",
    acceptance: [
      "업데이트 후보를 수집/검토/한국어 요약/게시 준비/게시 단계로 옮길 수 있다.",
      "각 후보에는 sourceIds, 확인일, 작성자 메모가 남는다.",
      "게시 전 품질 체크리스트가 모두 통과해야 한다.",
    ],
  },
  {
    id: "feature-model-cost-calculator",
    title: "모델 비용 계산기",
    priority: "P1",
    status: "구현됨",
    rationale:
      "사용자는 벤치마크 점수보다 실제 월 비용과 latency를 함께 보고 모델을 고르는 경우가 많다.",
    acceptance: [
      "입력/출력 토큰량과 호출 수를 넣으면 월 비용을 비교한다.",
      "Grok, Gemini Flash, mini/nano 같은 저비용 모델을 별도 추천한다.",
      "가격 출처와 확인일을 계산 결과 옆에 표시한다.",
    ],
  },
  {
    id: "feature-persona-guides",
    title: "직군별 사용법 플레이북",
    priority: "P1",
    status: "구현됨",
    rationale:
      "개발자, PM, 마케터, 연구자별로 필요한 모델 선택 기준과 프롬프트 흐름이 다르다.",
    acceptance: [
      "직군별 추천 모델, 주의점, 예시 워크플로를 한 페이지에서 보여준다.",
      "사용법은 특정 모델 광고처럼 보이지 않게 대체 후보를 같이 제시한다.",
      "한국어 예시 프롬프트와 검증 체크리스트를 포함한다.",
    ],
  },
  {
    id: "feature-newsletter-export",
    title: "주간 뉴스레터 내보내기",
    priority: "P2",
    status: "구현됨",
    rationale:
      "포털 업데이트를 이메일/블로그/슬랙 요약으로 재사용하려면 구조화된 export가 필요하다.",
    acceptance: [
      "이번 주 주요 업데이트, 벤치마크 변화, 추천 강좌를 Markdown으로 내보낸다.",
      "각 항목 아래에 원문 URL을 유지한다.",
      "중복 출처는 하단 참고 링크로 묶는다.",
    ],
  },
  {
    id: "feature-webzine-news-community",
    title: "뉴스/커뮤니티 웹진 섹션",
    priority: "P1",
    status: "구현됨",
    rationale:
      "최신 AI 뉴스, 한국어 기술 블로그, 유튜브 강좌가 모델 비교표와 분리되어야 사용자가 탐색 목적에 맞게 읽을 수 있다.",
    acceptance: [
      "news 카테고리 업데이트와 커뮤니티/블로그 자료를 웹진형 카드로 보여준다.",
      "각 카드에는 출처 성격, 언어, 형식, 확인일이 드러난다.",
      "과장된 자동 수집 대신 편집 검토 파이프라인과 연결된다.",
    ],
  },
  {
    id: "feature-vibe-coding-hub",
    title: "AI 바이브 코딩 허브",
    priority: "P0",
    status: "구현됨",
    rationale:
      "코딩용 AI 선택은 모델명보다 CLI, repo 접근, 테스트 실행, OpenAI 호환 API, 자체 배포 여부가 더 직접적인 판단 기준이다.",
    acceptance: [
      "모델별 명령어, 적합 업무, setup notes, caveats를 비교한다.",
      "코딩/PPT/리서치 등 분야별 벤치마크 필터를 제공한다.",
      "사이트맵에서 바이브 코딩과 디자인/PPT 섹션으로 바로 이동할 수 있다.",
    ],
  },
  {
    id: "feature-task-recommendations",
    title: "사용자 작업별 LLM 추천",
    priority: "P0",
    status: "구현됨",
    rationale:
      "사용자는 모델명을 먼저 고르기보다 “내가 하려는 작업”에 맞는 모델, 도구, 명령어, 비용 tradeoff를 알고 싶어 한다.",
    acceptance: [
      "코딩, PPT/문서, 최신 리서치, 자동화, 저비용, 학습, 보안/자체배포 프리셋을 제공한다.",
      "각 프리셋은 추천 모델, 대체 모델, CLI/IDE 명령어, 관련 강좌/문서를 연결한다.",
      "Cursor 같은 도구형 실행 표면은 LLM 제공사와 별도로 표시한다.",
    ],
  },
  {
    id: "feature-ai-coding-tool-directory",
    title: "AI 코딩 도구 디렉터리",
    priority: "P0",
    status: "구현됨",
    rationale:
      "바이브 코딩 도구는 모델 성능만으로 판단하기 어렵기 때문에 IDE, CLI, PR 리뷰, 웹앱 제작, 클라우드 에이전트를 별도 축으로 비교해야 한다.",
    acceptance: [
      "Cursor, GitHub Copilot, JetBrains Junie, Amazon Q, Gemini Code Assist/Jules, Amp, Zed, Augment, Tabnine, CodeRabbit, TRAE와 오픈소스 스택을 비교한다.",
      "가격, 이벤트/학생 혜택, 한국어 자료, 연동 방식, 주의점을 필터링할 수 있다.",
      "도구 디렉터리는 바이브 코딩 명령어와 벤치마크 섹션으로 이어진다.",
    ],
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const pipelineStages: PipelineStage[] = [
  "수집",
  "검토",
  "한국어 요약",
  "게시 준비",
  "게시",
];

export function formatUsd(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  }
  if (value >= 100) {
    return `$${value.toLocaleString("en-US", {
      maximumFractionDigits: 1,
    })}`;
  }
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateModelCosts(
  scenario: CostScenario,
  profiles: readonly ModelCostProfile[] = modelCostProfiles,
) {
  const safeInputTokens = Math.max(0, scenario.inputTokensPerRun);
  const safeOutputTokens = Math.max(0, scenario.outputTokensPerRun);
  const safeRuns = Math.max(0, scenario.runsPerMonth);

  return profiles
    .map((profile): ModelCostEstimate => {
      const inputCost =
        (safeInputTokens * safeRuns * profile.inputUsdPer1M) / 1_000_000;
      const outputCost =
        (safeOutputTokens * safeRuns * profile.outputUsdPer1M) / 1_000_000;
      const totalCost = inputCost + outputCost;

      return {
        profile,
        inputCost,
        outputCost,
        totalCost,
        totalTokens: (safeInputTokens + safeOutputTokens) * safeRuns,
        formattedTotal: formatUsd(totalCost),
      };
    })
    .toSorted((a, b) => a.totalCost - b.totalCost);
}

export function movePipelineStage(
  stage: PipelineStage,
  direction: "next" | "previous",
): PipelineStage {
  const index = pipelineStages.indexOf(stage);
  if (index < 0) return stage;
  const offset = direction === "next" ? 1 : -1;
  const nextIndex = Math.min(
    pipelineStages.length - 1,
    Math.max(0, index + offset),
  );
  return pipelineStages[nextIndex] ?? stage;
}

function duplicateIds(items: readonly { id: string }[]) {
  const seen = new Set<string>();
  const duplicated = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) duplicated.add(item.id);
    seen.add(item.id);
  }
  return [...duplicated];
}

function collectReferencedSourceIds() {
  const referenced = new Set<string>();
  const addMany = (ids: readonly string[]) => {
    for (const id of ids) referenced.add(id);
  };

  for (const model of modelProfiles) addMany(model.sourceIds);
  for (const update of updates) addMany(update.sourceIds);
  for (const benchmark of benchmarkEntries) addMany(benchmark.sourceIds);
  for (const command of vibeCodingCommands) addMany(command.sourceIds);
  for (const tool of aiCodingTools) addMany(tool.sourceIds);
  for (const guide of manualGuides) addMany(guide.sourceIds);
  for (const guide of personaGuides) addMany(guide.sourceIds);
  for (const recommendation of taskRecommendations)
    addMany(recommendation.sourceIds);
  for (const resource of learningResources) addMany(resource.sourceIds);
  for (const monitor of curationMonitors) referenced.add(monitor.sourceId);
  for (const item of updatePipeline) addMany(item.sourceIds);
  for (const profile of modelCostProfiles) addMany(profile.sourceIds);

  return [...referenced];
}

export function getMissingSourceReferences() {
  return collectReferencedSourceIds().filter((id) => !sourceById.has(id));
}

export function runContentAudit(): ContentAuditResult {
  const missingSources = getMissingSourceReferences();
  const duplicateSourceIds = duplicateIds(sources);
  const duplicateModelIds = duplicateIds(modelProfiles);
  const duplicateUpdateIds = duplicateIds(updates);
  const duplicateCommandIds = duplicateIds(vibeCodingCommands);
  const duplicateAiCodingToolIds = duplicateIds(aiCodingTools);
  const duplicatePersonaIds = duplicateIds(personaGuides);
  const duplicateTaskRecommendationIds = duplicateIds(taskRecommendations);
  const duplicateResourceIds = duplicateIds(learningResources);
  const monitoredP0Count = curationMonitors.filter(
    (monitor) => monitor.priority === "P0",
  ).length;
  const automationCandidateCount = curationMonitors.filter(
    (monitor) => monitor.status === "자동화 후보",
  ).length;
  const hasKoreanLearning = learningResources.some(
    (resource) => resource.language === "한국어",
  );
  const hasAllProviders = providerCatalog.every((provider) =>
    modelProfiles.some((model) => model.providerId === provider.id),
  );

  const checks: ContentAuditCheck[] = [
    {
      id: "source-refs",
      label: "출처 참조 무결성",
      status: missingSources.length === 0 ? "pass" : "fail",
      detail:
        missingSources.length === 0
          ? "모델, 업데이트, 벤치마크, 사용법, 직군별 플레이북, 리소스, 운영 항목의 sourceIds가 모두 등록된 출처를 가리킵니다."
          : `누락된 출처 참조: ${missingSources.join(", ")}`,
    },
    {
      id: "duplicate-ids",
      label: "ID 중복 검사",
      status:
        duplicateSourceIds.length +
          duplicateModelIds.length +
          duplicateUpdateIds.length +
          duplicateCommandIds.length +
          duplicateAiCodingToolIds.length +
          duplicatePersonaIds.length +
          duplicateTaskRecommendationIds.length +
          duplicateResourceIds.length ===
        0
          ? "pass"
          : "fail",
      detail:
        duplicateSourceIds.length +
          duplicateModelIds.length +
          duplicateUpdateIds.length +
          duplicateCommandIds.length +
          duplicateAiCodingToolIds.length +
          duplicatePersonaIds.length +
          duplicateTaskRecommendationIds.length +
          duplicateResourceIds.length ===
        0
          ? "핵심 카탈로그 ID에 중복이 없습니다."
          : `중복 ID가 있습니다: ${[
              ...duplicateSourceIds,
              ...duplicateModelIds,
              ...duplicateUpdateIds,
              ...duplicateCommandIds,
              ...duplicateAiCodingToolIds,
              ...duplicatePersonaIds,
              ...duplicateTaskRecommendationIds,
              ...duplicateResourceIds,
            ].join(", ")}`,
    },
    {
      id: "provider-coverage",
      label: "주요 제공사 커버리지",
      status: hasAllProviders ? "pass" : "fail",
      detail: hasAllProviders
        ? "GPT, Claude, Gemini, Grok, Manus, Kimi, DeepSeek, Qwen, Mistral이 모두 모델 비교 표면에 포함되어 있습니다."
        : "필수 제공사 중 누락된 모델 프로필이 있습니다.",
    },
    {
      id: "p0-monitoring",
      label: "P0 소스 모니터링",
      status: monitoredP0Count >= 4 ? "pass" : "warn",
      detail: `P0 모니터 ${monitoredP0Count}개가 등록되어 있습니다.`,
    },
    {
      id: "automation-readiness",
      label: "자동화 후보",
      status: automationCandidateCount >= 2 ? "pass" : "warn",
      detail: `자동화 후보 ${automationCandidateCount}개가 정의되어 다음 개발 단계로 바로 넘길 수 있습니다.`,
    },
    {
      id: "korean-learning",
      label: "한국어 학습 자료",
      status: hasKoreanLearning ? "pass" : "warn",
      detail: hasKoreanLearning
        ? "한국어 유튜브, 공식 문서, 블로그, 도서 자료가 포함되어 있습니다."
        : "한국어 학습 자료가 부족합니다.",
    },
  ];

  return {
    passed: checks.every((check) => check.status !== "fail"),
    checks,
  };
}

export function getSources(ids: readonly string[]) {
  return ids
    .map((id) => sourceById.get(id))
    .filter((source): source is SourceRef => Boolean(source));
}

export function getProviderLabel(providerId: ProviderId | "market" | "other") {
  const provider = providerCatalog.find((item) => item.id === providerId);
  if (provider) return provider.label;

  switch (providerId) {
    case "market":
      return "시장";
    case "other":
      return "기타";
  }
}

export function getBenchmarkDomainLabel(domain: BenchmarkDomain | "all") {
  switch (domain) {
    case "all":
      return "전체";
    case "overall":
      return "종합";
    case "coding":
      return "코딩";
    case "ppt":
      return "PPT/문서";
    case "research":
      return "리서치";
    case "multimodal":
      return "멀티모달";
    case "cost":
      return "비용";
    case "agent":
      return "에이전트";
  }
}

export function getTaskRecommendationCategoryLabel(
  category: TaskRecommendationCategory | "all",
) {
  switch (category) {
    case "all":
      return "전체";
    case "coding":
      return "코딩";
    case "ppt":
      return "PPT/문서";
    case "research":
      return "최신 리서치";
    case "automation":
      return "업무 자동화";
    case "cost":
      return "저비용";
    case "learning":
      return "학습";
    case "security":
      return "보안/자체배포";
  }
}

export function getAiCodingToolCategoryLabel(
  category: AiCodingToolCategory | "all",
) {
  switch (category) {
    case "all":
      return "전체";
    case "AI IDE":
      return "AI IDE";
    case "IDE 확장":
      return "IDE 확장";
    case "CLI/터미널":
      return "CLI/터미널";
    case "PR 리뷰":
      return "PR 리뷰";
    case "웹앱 제작":
      return "웹앱 제작";
    case "클라우드 에이전트":
      return "클라우드 에이전트";
    case "오픈소스 스택":
      return "오픈소스";
  }
}

export function getModelById(id: string) {
  return modelProfiles.find((profile) => profile.id === id);
}

function normalizeText(value: string) {
  return value.toLocaleLowerCase("ko-KR").replace(/\s+/g, " ").trim();
}

function matchesQuery(query: string, values: readonly string[]) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return values.some((value) => normalizeText(value).includes(normalizedQuery));
}

function matchesProvider(
  providerId: ProviderId | "market" | "other",
  selectedProvider: ProviderId | "all",
) {
  return selectedProvider === "all" || providerId === selectedProvider;
}

export function searchCatalog(
  query: string,
  selectedProvider: ProviderId | "all" = "all",
  selectedCategory: ContentCategory | "all" = "all",
): SearchResults {
  const models =
    selectedCategory === "all" || selectedCategory === "comparison"
      ? modelProfiles.filter(
          (model) =>
            matchesProvider(model.providerId, selectedProvider) &&
            matchesQuery(query, [
              model.providerName,
              model.productName,
              model.modelName,
              model.modelId,
              model.oneLine,
              model.summary,
              ...model.strengths,
              ...model.caveats,
              ...model.bestFor,
              ...model.aliases,
            ]),
        )
      : [];

  const filteredUpdates =
    selectedCategory === "all" ||
    selectedCategory === "news" ||
    selectedCategory === "events" ||
    selectedCategory === "recommendations" ||
    selectedCategory === "updates" ||
    selectedCategory === "vibe" ||
    selectedCategory === "tools" ||
    selectedCategory === "design" ||
    selectedCategory === "benchmarks"
      ? updates.filter(
          (update) =>
            (selectedCategory === "all" ||
              update.category === selectedCategory ||
              selectedCategory === "updates") &&
            matchesProvider(update.providerId, selectedProvider) &&
            matchesQuery(query, [
              update.title,
              update.summary,
              update.impact,
              ...update.tags,
            ]),
        )
      : [];

  const filteredTaskRecommendations =
    selectedCategory === "all" ||
    selectedCategory === "recommendations" ||
    selectedCategory === "vibe" ||
    selectedCategory === "design" ||
    selectedCategory === "benchmarks" ||
    selectedCategory === "learning"
      ? taskRecommendations.filter(
          (recommendation) =>
            (selectedProvider === "all" ||
              recommendation.primaryModelIds.some(
                (modelId) =>
                  getModelById(modelId)?.providerId === selectedProvider,
              ) ||
              recommendation.alternateModelIds.some(
                (modelId) =>
                  getModelById(modelId)?.providerId === selectedProvider,
              )) &&
            matchesQuery(query, [
              recommendation.title,
              recommendation.userIntent,
              recommendation.category,
              recommendation.promptStarter,
              ...recommendation.rationale,
              ...recommendation.tradeoffs,
              ...recommendation.primaryModelIds,
              ...recommendation.alternateModelIds,
              ...recommendation.commandIds,
              ...recommendation.benchmarkDomains,
              ...recommendation.resourceIds,
            ]),
        )
      : [];

  const benchmarks =
    selectedCategory === "all" || selectedCategory === "benchmarks"
      ? benchmarkEntries.filter(
          (entry) =>
            matchesProvider(entry.providerId, selectedProvider) &&
            matchesQuery(query, [
              entry.modelName,
              entry.metric,
              entry.score,
              entry.price,
              entry.speed,
              entry.context,
            ]),
        )
      : [];

  const filteredVibeCodingCommands =
    selectedCategory === "all" ||
    selectedCategory === "vibe" ||
    selectedCategory === "tools"
      ? vibeCodingCommands.filter(
          (command) =>
            matchesProvider(command.providerId, selectedProvider) &&
            matchesQuery(query, [
              command.modelName,
              command.modelId,
              command.surface,
              command.installCommand,
              command.command,
              command.useCase,
              command.vibeCodingFit,
              ...command.setupNotes,
              ...command.caveats,
            ]),
        )
      : [];

  const filteredAiCodingTools =
    selectedCategory === "all" ||
    selectedCategory === "tools" ||
    selectedCategory === "vibe" ||
    selectedCategory === "learning"
      ? aiCodingTools.filter(
          (tool) =>
            (selectedProvider === "all" ||
              tool.providerIds?.includes(selectedProvider)) &&
            matchesQuery(query, [
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
            ]),
        )
      : [];

  const manuals =
    selectedCategory === "all" || selectedCategory === "manuals"
      ? manualGuides.filter(
          (guide) =>
            matchesProvider(guide.providerId, selectedProvider) &&
            matchesQuery(query, [
              guide.title,
              guide.summary,
              guide.level,
              ...guide.steps,
            ]),
        )
      : [];

  const filteredPersonaGuides =
    selectedCategory === "all" || selectedCategory === "personas"
      ? personaGuides.filter(
          (guide) =>
            (selectedProvider === "all" ||
              guide.providerIds.includes(selectedProvider)) &&
            matchesQuery(query, [
              guide.role,
              guide.title,
              guide.summary,
              ...guide.workflow,
              ...guide.promptExamples,
              ...guide.checklist,
            ]),
        )
      : [];

  const resources =
    selectedCategory === "all" ||
    selectedCategory === "news" ||
    selectedCategory === "vibe" ||
    selectedCategory === "design" ||
    selectedCategory === "learning" ||
    selectedCategory === "books"
      ? learningResources.filter(
          (resource) =>
            (selectedCategory !== "books" || resource.type === "도서") &&
            (selectedProvider === "all" ||
              resource.providerIds?.includes(selectedProvider) ||
              resource.providerIds === undefined) &&
            matchesQuery(query, [
              resource.title,
              resource.author,
              resource.language,
              resource.level,
              resource.summary,
              resource.type,
              ...resource.tags,
            ]),
        )
      : [];

  const filteredCurationMonitors =
    selectedCategory === "all" || selectedCategory === "ops"
      ? curationMonitors.filter(
          (monitor) =>
            matchesProvider(monitor.providerId, selectedProvider) &&
            matchesQuery(query, [
              monitor.id,
              monitor.owner,
              monitor.status,
              monitor.priority,
              monitor.nextAction,
              monitor.automationHint,
              getSources([monitor.sourceId])[0]?.title ?? monitor.sourceId,
            ]),
        )
      : [];

  const filteredPipelineItems =
    selectedCategory === "all" || selectedCategory === "ops"
      ? updatePipeline.filter(
          (item) =>
            matchesProvider(item.providerId, selectedProvider) &&
            matchesQuery(query, [
              item.title,
              item.stage,
              item.priority,
              item.summary,
              ...item.acceptance,
            ]),
        )
      : [];

  const filteredFeatureBacklog =
    selectedCategory === "all" || selectedCategory === "ops"
      ? featureBacklog.filter((item) =>
          matchesQuery(query, [
            item.title,
            item.priority,
            item.status,
            item.rationale,
            ...item.acceptance,
          ]),
        )
      : [];

  const matchedSourceIds = new Set<string>();
  for (const item of [
    ...models,
    ...filteredUpdates,
    ...filteredTaskRecommendations,
    ...benchmarks,
    ...filteredVibeCodingCommands,
    ...filteredAiCodingTools,
    ...manuals,
    ...filteredPersonaGuides,
    ...resources,
    ...filteredPipelineItems,
  ]) {
    for (const sourceId of item.sourceIds) matchedSourceIds.add(sourceId);
  }
  for (const monitor of filteredCurationMonitors)
    matchedSourceIds.add(monitor.sourceId);

  const matchedSources =
    selectedCategory === "sources"
      ? sources.filter((source) =>
          matchesQuery(query, [
            source.title,
            source.publisher,
            source.note,
            source.kind,
            source.url,
          ]),
        )
      : sources.filter((source) => matchedSourceIds.has(source.id));

  return {
    models,
    updates: filteredUpdates,
    taskRecommendations: filteredTaskRecommendations,
    aiCodingTools: filteredAiCodingTools,
    benchmarks,
    manuals,
    personaGuides: filteredPersonaGuides,
    resources,
    vibeCodingCommands: filteredVibeCodingCommands,
    curationMonitors: filteredCurationMonitors,
    pipelineItems: filteredPipelineItems,
    featureBacklog: filteredFeatureBacklog,
    sources: matchedSources,
  };
}

export function getCatalogStats() {
  const audit = runContentAudit();
  return {
    providers: new Set(modelProfiles.map((profile) => profile.providerId)).size,
    updates: updates.length,
    benchmarkRows: benchmarkEntries.length,
    vibeCommands: vibeCodingCommands.length,
    aiCodingTools: aiCodingTools.length,
    personaGuides: personaGuides.length,
    taskRecommendations: taskRecommendations.length,
    resources: learningResources.length,
    sources: sources.length,
    monitors: curationMonitors.length,
    pipelineItems: updatePipeline.length,
    backlogItems: featureBacklog.length,
    costProfiles: modelCostProfiles.length,
    auditChecks: audit.checks.length,
    auditPassed: audit.passed,
  };
}
