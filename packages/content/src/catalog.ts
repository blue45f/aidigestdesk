export type ProviderId = "openai" | "anthropic" | "google" | "xai" | "manus";

export type ContentCategory =
  | "updates"
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
  metric: string;
  score: string;
  price: string;
  speed: string;
  latency: string;
  context: string;
  sourceIds: string[];
};

export type ComparisonRow = {
  id: string;
  axis: string;
  openai: string;
  anthropic: string;
  google: string;
  xai: string;
  manus: string;
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
  type: "공식 문서" | "강좌/영상" | "도서" | "커뮤니티";
  title: string;
  author: string;
  language: "한국어" | "영어";
  level: "입문" | "실무" | "고급";
  summary: string;
  url: string;
  sourceIds: string[];
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
  curationMonitors: CurationMonitor[];
  pipelineItems: UpdatePipelineItem[];
  featureBacklog: FeatureBacklogItem[];
  sources: SourceRef[];
};

export const SNAPSHOT_DATE = "2026-06-17";

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
    metric: "AA Intelligence Index",
    score: "38",
    price: "$0.64 blended / 1M",
    speed: "165 tok/s",
    latency: "13.61s first chunk",
    context: "1M",
    sourceIds: ["aa-leaderboard", "xai-grok43"],
  },
];

export const comparisonRows: ComparisonRow[] = [
  {
    id: "positioning",
    axis: "포지셔닝",
    openai: "범용 프런티어 모델 + 가장 넓은 도구/개발자 생태계",
    anthropic: "장기 추론·고자율 업무와 안전/fallback 설계 중심",
    google: "멀티모달 입력, 검색 grounding, Google 생태계 연계",
    xai: "빠른 응답, X/Web 검색 결합, 저렴한 고속 API",
    manus: "모델 API보다 태스크 실행형 에이전트 플랫폼",
  },
  {
    id: "input",
    axis: "입력 모달리티",
    openai: "텍스트, 이미지",
    anthropic: "텍스트, 이미지",
    google: "텍스트, 이미지, 비디오, 오디오, PDF",
    xai: "텍스트, 이미지",
    manus: "태스크 메시지, 파일, 프로젝트 컨텍스트",
  },
  {
    id: "tools",
    axis: "도구/액션",
    openai: "웹 검색, 파일 검색, 코드, 컴퓨터 사용, MCP",
    anthropic: "fallback, 플랫폼별 Claude 도구/연동",
    google: "검색 grounding, Maps, 코드 실행, URL context",
    xai: "Web Search, X Search, Code Execution, RAG Collections",
    manus: "Tasks, Files, Webhooks, Skills, Agents",
  },
  {
    id: "korean-workflow",
    axis: "한국어 실무 추천",
    openai: "기획·코딩·문서 자동화의 기본 기준선",
    anthropic: "긴 문서, 정책 민감한 업무, 에이전트 안정성",
    google: "영상/PDF/검색 기반 자료 조사",
    xai: "최신 이슈·X 여론·저비용 대량 요약",
    manus: "비개발자 업무 자동화와 브라우저 조작형 태스크",
  },
  {
    id: "risk",
    axis: "주의점",
    openai: "긴 입력 고가 과금과 전용 멀티미디어 모델 구분",
    anthropic: "Fable 5 refusal 처리를 성공 응답으로 처리",
    google: "Preview 모델 품질 변동과 모델별 지원 기능 차이",
    xai: "검색 도구 없이는 최신 이벤트 접근 불가",
    manus: "기저 모델 스펙 대신 서비스 SLA·권한·보안 검토 필요",
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
      "대량 처리라면 Grok, Flash, mini/nano 계열의 blended cost를 비교한다.",
    ],
    sourceIds: [
      "openai-models",
      "anthropic-models",
      "google-models",
      "xai-models",
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
];

export const personaGuides: PersonaGuide[] = [
  {
    id: "persona-developer",
    role: "개발자",
    title: "코드 리뷰와 구현 보조 플레이북",
    summary:
      "코드베이스 맥락, 테스트 실패 로그, 변경 범위를 함께 넣고 구현/리뷰/검증을 분리해 모델을 운용한다.",
    providerIds: ["openai", "anthropic", "google"],
    recommendedModelIds: ["gpt-55", "claude-fable-5", "gemini-31-pro"],
    alternateModelIds: ["grok-43"],
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
    ],
  },
  {
    id: "persona-product-manager",
    role: "PM/기획자",
    title: "요구사항 정리와 의사결정 플레이북",
    summary:
      "긴 문서 요약, 사용자 시나리오, 선택지 비교는 Claude와 GPT를 기준선으로 두고 최신 시장 확인은 검색 모델로 보강한다.",
    providerIds: ["anthropic", "openai", "google"],
    recommendedModelIds: ["claude-fable-5", "gpt-55", "gemini-31-pro"],
    alternateModelIds: ["manus-agent"],
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
    ],
  },
  {
    id: "persona-marketer",
    role: "마케터",
    title: "캠페인 기획과 콘텐츠 변형 플레이북",
    summary:
      "브랜드 톤과 금지 표현을 먼저 고정하고, 고품질 초안은 GPT/Claude, 대량 변형은 Gemini Flash와 Grok 비용을 비교한다.",
    providerIds: ["openai", "anthropic", "google", "xai"],
    recommendedModelIds: ["gpt-55", "gemini-31-pro", "grok-43"],
    alternateModelIds: ["claude-fable-5"],
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
    ],
  },
  {
    id: "persona-researcher",
    role: "리서처",
    title: "근거 기반 조사와 문헌 요약 플레이북",
    summary:
      "출처가 중요한 조사는 Gemini 검색 grounding과 긴 문서 처리 모델을 조합하고, 주장·근거·불확실성을 분리해 기록한다.",
    providerIds: ["google", "anthropic", "openai", "xai"],
    recommendedModelIds: ["gemini-31-pro", "claude-fable-5", "gpt-55"],
    alternateModelIds: ["grok-43"],
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
    tags: ["Manus", "Agents", "Automation"],
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
    tags: ["한국어", "AI 코딩", "자동화"],
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
    tags: ["LLM", "Embedding", "RAG"],
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
  const hasAllProviders = (
    ["openai", "anthropic", "google", "xai", "manus"] as const
  ).every((providerId) =>
    modelProfiles.some((model) => model.providerId === providerId),
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
          duplicatePersonaIds.length +
          duplicateResourceIds.length ===
        0
          ? "pass"
          : "fail",
      detail:
        duplicateSourceIds.length +
          duplicateModelIds.length +
          duplicateUpdateIds.length +
          duplicatePersonaIds.length +
          duplicateResourceIds.length ===
        0
          ? "핵심 카탈로그 ID에 중복이 없습니다."
          : `중복 ID가 있습니다: ${[
              ...duplicateSourceIds,
              ...duplicateModelIds,
              ...duplicateUpdateIds,
              ...duplicatePersonaIds,
              ...duplicateResourceIds,
            ].join(", ")}`,
    },
    {
      id: "provider-coverage",
      label: "주요 제공사 커버리지",
      status: hasAllProviders ? "pass" : "fail",
      detail: hasAllProviders
        ? "GPT, Claude, Gemini, Grok, Manus가 모두 모델 비교 표면에 포함되어 있습니다."
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
        ? "한국어 유튜브/학습 자료가 포함되어 있습니다."
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
  switch (providerId) {
    case "openai":
      return "OpenAI";
    case "anthropic":
      return "Anthropic";
    case "google":
      return "Google";
    case "xai":
      return "xAI";
    case "manus":
      return "Manus";
    case "market":
      return "시장";
    case "other":
      return "기타";
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
    selectedCategory === "updates" ||
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
    selectedCategory === "learning" ||
    selectedCategory === "books"
      ? learningResources.filter(
          (resource) =>
            (selectedCategory !== "books" || resource.type === "도서") &&
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
    curationMonitors: filteredCurationMonitors,
    pipelineItems: filteredPipelineItems,
    featureBacklog: filteredFeatureBacklog,
    sources: matchedSources,
  };
}

export function getCatalogStats() {
  const audit = runContentAudit();
  return {
    providers: modelProfiles.length,
    updates: updates.length,
    benchmarkRows: benchmarkEntries.length,
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
