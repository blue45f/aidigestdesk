export type ProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "manus"
  | "kimi"
  | "deepseek"
  | "qwen"
  | "mistral";

export type ContentCategory =
  | "news"
  | "updates"
  | "vibe"
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
  status: "일반 제공" | "프리뷰" | "제한 제공" | "서비스/API";
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
    | "OpenAI 호환 API"
    | "공식 SDK"
    | "서드파티 CLI"
    | "웹/에이전트";
  command: string;
  useCase: string;
  vibeCodingFit: "매우 높음" | "높음" | "보통" | "제한적";
  setupNotes: string[];
  caveats: string[];
  sourceIds: string[];
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

export type SearchResults = {
  models: ModelProfile[];
  updates: UpdateItem[];
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
    id: "inflearn-langchain",
    title: "Inflearn LangChain Search",
    publisher: "Inflearn",
    kind: "publisher",
    url: "https://www.inflearn.com/search?s=langchain",
    lastChecked: SNAPSHOT_DATE,
    note: "LangChain, RAG, LLM 앱 개발 관련 한국어 유료/무료 강좌를 찾는 강좌 검색 허브.",
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
      "youtube-google-developers-korea",
    ],
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
];

export const vibeCodingCommands: VibeCodingCommand[] = [
  {
    id: "cmd-openai-codex",
    providerId: "openai",
    modelId: "gpt-55",
    modelName: "OpenAI Codex / GPT",
    surface: "전용 CLI",
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
      "anthropic-fable5",
      "anthropic-docs-ko",
      "youtube-anthropic",
    ],
  },
  {
    id: "cmd-gemini-cli",
    providerId: "google",
    modelId: "gemini-31-pro",
    modelName: "Gemini CLI / Gemini",
    surface: "전용 CLI",
    command:
      'npx https://github.com/google-gemini/gemini-cli "이 앱의 라우팅과 상태 흐름을 설명하고 리팩터링 후보를 정리해줘"',
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
    sourceIds: ["aa-leaderboard"],
    summary:
      "Artificial Analysis 상위 모델의 rank, score, price, speed, latency 변동을 요약한다.",
    acceptance: [
      "상위 20개 모델 중 rank 변화가 있는 항목만 강조한다.",
      "가격과 latency가 동시에 나빠진 모델은 주의 라벨을 붙인다.",
      "벤치마크 출처와 확인일을 UI에 표시한다.",
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
      "teddynote-blog",
      "yes24-llm-books",
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
    ],
    summary:
      "최신 AI 뉴스, 국내 기술 블로그, 커뮤니티 학습 자료를 웹진형 카드로 묶어 뉴스/커뮤니티 섹션을 갱신한다.",
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
  for (const guide of manualGuides) addMany(guide.sourceIds);
  for (const guide of personaGuides) addMany(guide.sourceIds);
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
  const duplicatePersonaIds = duplicateIds(personaGuides);
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
          duplicatePersonaIds.length +
          duplicateResourceIds.length ===
        0
          ? "pass"
          : "fail",
      detail:
        duplicateSourceIds.length +
          duplicateModelIds.length +
          duplicateUpdateIds.length +
          duplicateCommandIds.length +
          duplicatePersonaIds.length +
          duplicateResourceIds.length ===
        0
          ? "핵심 카탈로그 ID에 중복이 없습니다."
          : `중복 ID가 있습니다: ${[
              ...duplicateSourceIds,
              ...duplicateModelIds,
              ...duplicateUpdateIds,
              ...duplicateCommandIds,
              ...duplicatePersonaIds,
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
    selectedCategory === "updates" ||
    selectedCategory === "vibe" ||
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
    selectedCategory === "all" || selectedCategory === "vibe"
      ? vibeCodingCommands.filter(
          (command) =>
            matchesProvider(command.providerId, selectedProvider) &&
            matchesQuery(query, [
              command.modelName,
              command.modelId,
              command.surface,
              command.command,
              command.useCase,
              command.vibeCodingFit,
              ...command.setupNotes,
              ...command.caveats,
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
    ...benchmarks,
    ...filteredVibeCodingCommands,
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
    personaGuides: personaGuides.length,
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
