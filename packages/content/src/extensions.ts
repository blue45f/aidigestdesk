// AI 코딩 에이전트 확장 디렉터리 데이터 계약.
//
// 플러그인·훅·스킬·슬래시 명령·서브에이전트·MCP 서버·워크플로우·룰셋을
// 플랫폼(Claude Code, Cursor, Copilot, Codex, Gemini CLI 등)과 도메인 카테고리로
// 세분화해 검색 가능하게 구조화한다. 국내 사용자가 바로 적용하도록 설치/사용
// 한 줄과 한국어 팁(koreanNote)을 포함한다.

export type ExtensionKind =
  | "플러그인"
  | "훅"
  | "스킬"
  | "슬래시 명령"
  | "서브에이전트"
  | "MCP 서버"
  | "워크플로우"
  | "룰셋/지침"
  | "템플릿";

export type ExtensionPlatform =
  | "Claude Code"
  | "Cursor"
  | "GitHub Copilot"
  | "Codex CLI"
  | "Gemini CLI"
  | "Windsurf"
  | "범용";

/** 도메인 카테고리 — 세분화 검색의 핵심 축. */
export type ExtensionCategory =
  | "코드 리뷰"
  | "테스트/품질"
  | "문서화"
  | "Git/PR"
  | "보안"
  | "디자인/UI"
  | "데이터베이스"
  | "브라우저 자동화"
  | "검색/리서치"
  | "생산성"
  | "배포/DevOps"
  | "컨텍스트 관리";

export type ExtensionMaturity = "공식" | "커뮤니티";

export type AgentExtension = {
  id: string;
  name: string;
  kind: ExtensionKind;
  platform: ExtensionPlatform;
  category: ExtensionCategory;
  maturity: ExtensionMaturity;
  summary: string;
  /** 무엇을 하는지 핵심 항목. */
  whatItDoes: string[];
  /** 설치/활성화 한 줄. */
  install: string;
  /** 사용 한 줄(슬래시 명령, 설정 키 등). */
  usage: string;
  koreanNote?: string;
  url: string;
  sourceIds: string[];
  tags: string[];
};

export const agentExtensions: AgentExtension[] = [
  {
    id: "ext-cc-plugins",
    name: "Claude Code 플러그인 + 마켓플레이스",
    kind: "플러그인",
    platform: "Claude Code",
    category: "생산성",
    maturity: "공식",
    summary: "슬래시 명령·서브에이전트·훅·MCP를 하나로 묶어 배포하는 플러그인 시스템과 마켓플레이스.",
    whatItDoes: [
      "명령/에이전트/훅/MCP를 단일 플러그인으로 패키징",
      "팀·커뮤니티 마켓플레이스에서 설치/공유",
      "프로젝트별로 활성 플러그인 구성",
    ],
    install: "/plugin marketplace add <owner/repo> 후 /plugin install <name>",
    usage: "/plugin 메뉴에서 설치·관리",
    koreanNote: "사내 표준 명령·훅을 플러그인으로 묶어 팀 전체에 배포하면 온보딩이 빨라집니다.",
    url: "https://docs.claude.com/en/docs/claude-code/plugins",
    sourceIds: ["claude-code-docs"],
    tags: ["plugin", "marketplace", "claude-code", "팀"],
  },
  {
    id: "ext-cc-hooks-format",
    name: "PostToolUse 포맷/린트 훅",
    kind: "훅",
    platform: "Claude Code",
    category: "테스트/품질",
    maturity: "공식",
    summary: "파일 편집 직후 자동으로 prettier/eslint를 실행해 일관된 코드 스타일을 강제하는 훅.",
    whatItDoes: [
      "Edit/Write 후 변경 파일에 포매터 실행",
      "린트 실패를 에이전트에 피드백으로 반환",
      "수동 정리 단계 제거",
    ],
    install: "settings.json의 hooks.PostToolUse에 matcher + command 등록",
    usage: "Edit|Write matcher → `prettier --write $FILE` 류 명령",
    koreanNote: "커밋 훅과 분리해 에이전트 편집 즉시 정리되므로 verify 게이트 실패가 줄어듭니다.",
    url: "https://docs.claude.com/en/docs/claude-code/hooks",
    sourceIds: ["claude-code-docs"],
    tags: ["hook", "lint", "format", "품질"],
  },
  {
    id: "ext-cc-secret-scan-hook",
    name: "시크릿 스캔 PostToolUse 훅",
    kind: "훅",
    platform: "Claude Code",
    category: "보안",
    maturity: "커뮤니티",
    summary: "에이전트가 파일을 쓸 때마다 gitleaks류 스캐너로 비밀키 노출을 차단하는 훅.",
    whatItDoes: [
      "쓰기 작업마다 변경분 시크릿 스캔",
      "탐지 시 차단/경고 반환",
      "공개 레포 사고를 사전 방지",
    ],
    install: "PostToolUse 훅에서 scan-secret 스크립트 실행",
    usage: "Write|Edit matcher → gitleaks detect 호출",
    koreanNote: "공개 레포·이력서/포트폴리오성 저장소에 특히 유효합니다.",
    url: "https://docs.claude.com/en/docs/claude-code/hooks",
    sourceIds: ["claude-code-docs"],
    tags: ["hook", "security", "secret", "gitleaks"],
  },
  {
    id: "ext-cc-skill-pdf",
    name: "Agent Skills (스킬)",
    kind: "스킬",
    platform: "Claude Code",
    category: "생산성",
    maturity: "공식",
    summary: "특정 작업 절차·도구를 SKILL.md로 정의해 필요할 때만 로드하는 모델 확장 능력.",
    whatItDoes: [
      "도메인 절차를 SKILL.md로 캡슐화",
      "관련 작업에서 자동 트리거",
      "토큰 효율적으로 전문 지식 주입",
    ],
    install: ".claude/skills/<name>/SKILL.md 작성",
    usage: "관련 요청 시 자동 로드 또는 /<skill> 호출",
    koreanNote: "사내 배포/검증 절차, 디자인 컨벤션을 스킬로 만들면 반복 지시가 줄어듭니다.",
    url: "https://docs.claude.com/en/docs/claude-code/skills",
    sourceIds: ["claude-code-docs"],
    tags: ["skill", "claude-code", "절차"],
  },
  {
    id: "ext-cc-subagent-review",
    name: "코드 리뷰 서브에이전트",
    kind: "서브에이전트",
    platform: "Claude Code",
    category: "코드 리뷰",
    maturity: "공식",
    summary: "독립 컨텍스트에서 변경분을 리뷰하는 전용 서브에이전트로 메인 작업과 분리.",
    whatItDoes: [
      "git diff 기준 스타일·버그 점검",
      "별도 컨텍스트로 메인 토큰 절약",
      "PR 전 자체 리뷰 루프",
    ],
    install: ".claude/agents/<name>.md에 system prompt + tools 정의",
    usage: "작업 후 서브에이전트로 리뷰 위임",
    koreanNote: "적대적 리뷰(refute) 패턴과 결합하면 거짓 양성을 걸러내기 좋습니다.",
    url: "https://docs.claude.com/en/docs/claude-code/sub-agents",
    sourceIds: ["claude-code-docs"],
    tags: ["subagent", "review", "PR"],
  },
  {
    id: "ext-cc-slash-commands",
    name: "커스텀 슬래시 명령",
    kind: "슬래시 명령",
    platform: "Claude Code",
    category: "생산성",
    maturity: "공식",
    summary: "자주 쓰는 프롬프트·절차를 /command로 저장해 반복 작업을 한 번에 호출.",
    whatItDoes: [
      "프롬프트 템플릿을 명령으로 저장",
      "인자($ARGUMENTS) 지원",
      "프로젝트/사용자 스코프 분리",
    ],
    install: ".claude/commands/<name>.md 작성",
    usage: "/<name> 인자 입력",
    koreanNote: "배포·릴리스 체크리스트를 명령으로 만들면 휴먼 에러가 줄어듭니다.",
    url: "https://docs.claude.com/en/docs/claude-code/slash-commands",
    sourceIds: ["claude-code-docs"],
    tags: ["slash", "command", "템플릿"],
  },
  {
    id: "ext-mcp-playwright",
    name: "Playwright MCP",
    kind: "MCP 서버",
    platform: "범용",
    category: "브라우저 자동화",
    maturity: "공식",
    summary: "에이전트가 실제 브라우저를 제어해 클릭·입력·스크린샷·접근성 스냅샷을 수행하는 MCP.",
    whatItDoes: [
      "실DOM 탐색·폼 입력·스크린샷",
      "E2E 검증/시각 회귀 보조",
      "접근성 스냅샷으로 액션 결정",
    ],
    install: "claude mcp add 또는 클라이언트 설정에 서버 등록",
    usage: "navigate/click/snapshot 도구 호출",
    koreanNote: "UI 변경을 실제로 띄워 확인하는 검증 루프에 적합합니다.",
    url: "https://github.com/microsoft/playwright-mcp",
    sourceIds: ["claude-code-docs"],
    tags: ["mcp", "browser", "playwright", "e2e"],
  },
  {
    id: "ext-mcp-chrome-devtools",
    name: "Chrome DevTools MCP",
    kind: "MCP 서버",
    platform: "범용",
    category: "테스트/품질",
    maturity: "공식",
    summary: "Lighthouse 감사·퍼포먼스 트레이스·네트워크 로그를 에이전트가 직접 수집하는 MCP.",
    whatItDoes: [
      "Lighthouse 데스크톱/모바일 감사",
      "성능 트레이스·인사이트 분석",
      "콘솔/네트워크 로그 수집",
    ],
    install: "클라이언트 MCP 설정에 chrome-devtools 서버 등록",
    usage: "lighthouse_audit/performance_trace 호출",
    koreanNote: "데스크톱·모바일을 모두 감사해 한국 사용자 체감 성능을 점검하세요.",
    url: "https://github.com/ChromeDevTools/chrome-devtools-mcp",
    sourceIds: ["claude-code-docs"],
    tags: ["mcp", "lighthouse", "성능", "audit"],
  },
  {
    id: "ext-mcp-github",
    name: "GitHub MCP",
    kind: "MCP 서버",
    platform: "범용",
    category: "Git/PR",
    maturity: "공식",
    summary: "이슈·PR·리뷰·코드 검색을 에이전트가 GitHub API로 직접 다루는 MCP 서버.",
    whatItDoes: [
      "PR 생성/리뷰/머지, 이슈 관리",
      "코드/커밋 검색",
      "릴리스·태그 조회",
    ],
    install: "원격 MCP 등록 + GitHub 토큰 헤더 인증",
    usage: "create_pull_request/issue_write 등 호출",
    koreanNote: "DCR 미지원이라 순수 OAuth가 막히면 gh 토큰 헤더로 등록하세요.",
    url: "https://github.com/github/github-mcp-server",
    sourceIds: ["github-copilot-docs"],
    tags: ["mcp", "github", "PR", "issue"],
  },
  {
    id: "ext-mcp-postgres",
    name: "Postgres/DB MCP",
    kind: "MCP 서버",
    platform: "범용",
    category: "데이터베이스",
    maturity: "커뮤니티",
    summary: "스키마 탐색·쿼리 실행·마이그레이션 점검을 에이전트가 안전하게 수행하는 DB MCP.",
    whatItDoes: [
      "테이블/스키마 조회",
      "읽기 쿼리·분석 실행",
      "마이그레이션 비교/튜닝 보조",
    ],
    install: "env 게이트된 연결 문자열로 MCP 서버 등록",
    usage: "execute_query/describe_table 호출",
    koreanNote: "연결 문자열은 env로 주입하고 쓰기 권한은 분리하세요.",
    url: "https://github.com/modelcontextprotocol/servers",
    sourceIds: ["claude-code-docs"],
    tags: ["mcp", "postgres", "database", "sql"],
  },
  {
    id: "ext-mcp-context7",
    name: "Context7 MCP",
    kind: "MCP 서버",
    platform: "범용",
    category: "검색/리서치",
    maturity: "커뮤니티",
    summary: "라이브러리/프레임워크 최신 공식 문서를 에이전트가 실시간으로 가져오는 문서 MCP.",
    whatItDoes: [
      "버전별 API 문서 조회",
      "마이그레이션 가이드 검색",
      "훈련 데이터 이후 변경 보완",
    ],
    install: "MCP 설정에 context7 서버 등록",
    usage: "resolve-library-id → query-docs",
    koreanNote: "최신 버전 API 변경을 기억에 의존하지 않고 확인할 때 유용합니다.",
    url: "https://github.com/upstash/context7",
    sourceIds: ["claude-code-docs"],
    tags: ["mcp", "docs", "research", "context7"],
  },
  {
    id: "ext-coderabbit",
    name: "CodeRabbit PR 리뷰",
    kind: "워크플로우",
    platform: "범용",
    category: "코드 리뷰",
    maturity: "공식",
    summary: "PR마다 자동 AI 리뷰 코멘트를 달아 머지 게이트로 활용하는 리뷰 워크플로우.",
    whatItDoes: [
      "PR diff 자동 리뷰·요약",
      "인라인 제안/보안 점검",
      "리뷰 게이트로 머지 통제",
    ],
    install: "GitHub App 설치 후 레포 연동",
    usage: "@coderabbitai review 트리거 / 자동 실행",
    koreanNote: "게이트가 교착(소진)되면 owner --admin bypass 정책을 미리 정해두세요.",
    url: "https://www.coderabbit.ai/",
    sourceIds: ["coderabbit-pricing"],
    tags: ["review", "PR", "gate", "coderabbit"],
  },
  {
    id: "ext-cursor-rules",
    name: "Cursor Rules (.cursor/rules)",
    kind: "룰셋/지침",
    platform: "Cursor",
    category: "컨텍스트 관리",
    maturity: "공식",
    summary: "프로젝트 규칙·컨벤션을 규칙 파일로 정의해 Cursor가 항상 따르도록 하는 룰셋.",
    whatItDoes: [
      "코딩 컨벤션/금지 패턴 명문화",
      "경로별 규칙 스코프",
      "에이전트 일탈 감소",
    ],
    install: ".cursor/rules/*.mdc 작성",
    usage: "규칙 파일에 globs + 지침 기술",
    koreanNote: "한국어로 규칙을 적어도 동작하며, 팀 컨벤션 공유에 효과적입니다.",
    url: "https://docs.cursor.com/context/rules",
    sourceIds: ["cursor-docs"],
    tags: ["cursor", "rules", "convention", "context"],
  },
  {
    id: "ext-cursor-agent",
    name: "Cursor Agent / Background Agents",
    kind: "워크플로우",
    platform: "Cursor",
    category: "생산성",
    maturity: "공식",
    summary: "멀티파일 변경을 자율 수행하고 백그라운드로 작업을 위임하는 Cursor 에이전트.",
    whatItDoes: [
      "자율 멀티파일 편집/실행",
      "백그라운드 작업 위임",
      "터미널·테스트 통합",
    ],
    install: "Cursor 최신 버전 사용",
    usage: "Agent 패널에서 작업 지시",
    koreanNote: "학생은 Cursor for Students로 Pro를 1년 무료로 쓸 수 있습니다.",
    url: "https://cursor.com/docs",
    sourceIds: ["cursor-docs"],
    tags: ["cursor", "agent", "background"],
  },
  {
    id: "ext-copilot-custom-instructions",
    name: "Copilot 커스텀 인스트럭션",
    kind: "룰셋/지침",
    platform: "GitHub Copilot",
    category: "컨텍스트 관리",
    maturity: "공식",
    summary: "레포의 .github/copilot-instructions.md로 Copilot 응답에 항상 적용할 지침을 정의.",
    whatItDoes: [
      "레포 전역 응답 지침 주입",
      "기술 스택/스타일 고정",
      "반복 설명 제거",
    ],
    install: ".github/copilot-instructions.md 작성",
    usage: "자동 적용",
    koreanNote: "한국어 응답을 원하면 지침에 명시하세요.",
    url: "https://docs.github.com/en/copilot/customizing-copilot",
    sourceIds: ["github-copilot-docs", "github-copilot-docs-ko"],
    tags: ["copilot", "instructions", "context"],
  },
  {
    id: "ext-copilot-coding-agent",
    name: "Copilot Coding Agent",
    kind: "워크플로우",
    platform: "GitHub Copilot",
    category: "Git/PR",
    maturity: "공식",
    summary: "이슈를 할당하면 브랜치를 만들고 PR을 올리는 클라우드 코딩 에이전트.",
    whatItDoes: [
      "이슈 → 브랜치 → PR 자동화",
      "CI 통과까지 반복",
      "리뷰어 지정 협업",
    ],
    install: "GitHub Copilot 구독에서 활성화",
    usage: "이슈를 Copilot에 할당",
    koreanNote: "무료 등급/학생 팩으로 Copilot 기능 진입이 가능합니다.",
    url: "https://docs.github.com/en/copilot",
    sourceIds: ["github-copilot-docs", "github-copilot-plans"],
    tags: ["copilot", "agent", "PR", "cloud"],
  },
  {
    id: "ext-codex-agents-md",
    name: "Codex AGENTS.md",
    kind: "룰셋/지침",
    platform: "Codex CLI",
    category: "컨텍스트 관리",
    maturity: "공식",
    summary: "AGENTS.md로 Codex/OpenAI 에이전트에 프로젝트 규칙·명령을 전달하는 표준 지침 파일.",
    whatItDoes: [
      "빌드/테스트 명령 명시",
      "코딩 규칙·금지사항 정의",
      "에이전트 일관성 확보",
    ],
    install: "레포 루트에 AGENTS.md 작성",
    usage: "자동 로드",
    koreanNote: "Claude의 CLAUDE.md와 병행해 멀티 에이전트 환경을 정렬할 수 있습니다.",
    url: "https://github.com/openai/codex",
    sourceIds: ["openai-codex-cli"],
    tags: ["codex", "agents-md", "context"],
  },
  {
    id: "ext-gemini-cli-extensions",
    name: "Gemini CLI 확장/도구",
    kind: "플러그인",
    platform: "Gemini CLI",
    category: "생산성",
    maturity: "공식",
    summary: "Gemini CLI에 MCP 서버·커스텀 도구를 연결해 워크플로우를 확장.",
    whatItDoes: [
      "MCP 도구 연결",
      "커스텀 명령 추가",
      "오픈소스 기반 확장",
    ],
    install: "Gemini CLI 설치 후 설정에서 도구 등록",
    usage: "CLI 내 도구 호출",
    koreanNote: "한국어 안내가 늘고 있어 진입 장벽이 낮습니다.",
    url: "https://github.com/google-gemini/gemini-cli",
    sourceIds: ["gemini-cli-github"],
    tags: ["gemini", "cli", "mcp", "extension"],
  },
  {
    id: "ext-cline-mcp",
    name: "Cline (오픈소스 에이전트)",
    kind: "플러그인",
    platform: "범용",
    category: "생산성",
    maturity: "커뮤니티",
    summary: "VS Code에서 동작하는 오픈소스 코딩 에이전트로 MCP·다중 모델을 자유롭게 연결.",
    whatItDoes: [
      "VS Code 통합 자율 편집",
      "임의 모델/MCP 연결",
      "오픈소스로 투명한 동작",
    ],
    install: "VS Code 마켓플레이스에서 Cline 설치",
    usage: "사이드패널에서 작업 지시",
    koreanNote: "DeepSeek 오프피크 할인 등 저비용 모델과 결합하면 운영비를 낮출 수 있습니다.",
    url: "https://github.com/cline/cline",
    sourceIds: ["cline-github"],
    tags: ["opensource", "vscode", "mcp", "agent"],
  },
  {
    id: "ext-agents-sdk-workflow",
    name: "OpenAI Agents SDK 워크플로우",
    kind: "워크플로우",
    platform: "범용",
    category: "생산성",
    maturity: "공식",
    summary: "도구 호출·핸드오프·가드레일을 갖춘 멀티 에이전트 파이프라인을 코드로 구성.",
    whatItDoes: [
      "에이전트 간 핸드오프 구성",
      "가드레일/트레이싱",
      "도구 호출 오케스트레이션",
    ],
    install: "openai-agents 패키지 설치",
    usage: "Agent/Runner로 파이프라인 정의",
    koreanNote: "Batch API와 결합해 비실시간 파이프라인 비용을 낮추세요.",
    url: "https://github.com/openai/openai-agents-python",
    sourceIds: ["openai-agents-sdk"],
    tags: ["sdk", "agents", "workflow", "openai"],
  },
  {
    id: "ext-claude-skill-design",
    name: "디자인 시스템 스킬",
    kind: "스킬",
    platform: "Claude Code",
    category: "디자인/UI",
    maturity: "커뮤니티",
    summary: "디자인 토큰·컴포넌트 규칙·접근성 기준을 스킬로 묶어 일관된 UI 작업을 유도.",
    whatItDoes: [
      "토큰/컴포넌트 규약 주입",
      "접근성·대비 기준 강제",
      "프로덕트 레지스터 가이드",
    ],
    install: ".claude/skills/<design>/SKILL.md 작성",
    usage: "UI 작업 시 자동 로드",
    koreanNote: "리빙 스타일가이드(/design) 페이지와 함께 쓰면 컨벤션이 코드와 동기화됩니다.",
    url: "https://docs.claude.com/en/docs/claude-code/skills",
    sourceIds: ["claude-code-docs"],
    tags: ["skill", "design", "a11y", "ui"],
  },
  {
    id: "ext-cc-test-runner-hook",
    name: "테스트 자동 실행 워크플로우",
    kind: "워크플로우",
    platform: "범용",
    category: "테스트/품질",
    maturity: "커뮤니티",
    summary: "변경 후 관련 테스트를 자동 실행하고 실패를 에이전트에 되먹여 자가 수선하는 루프.",
    whatItDoes: [
      "변경 범위 테스트 선택 실행",
      "실패 로그 자동 피드백",
      "통과까지 수선 반복",
    ],
    install: "Stop/PostToolUse 훅 또는 명령으로 테스트 실행 연결",
    usage: "verify 게이트 명령에 테스트 포함",
    koreanNote: "pnpm verify처럼 lint+typecheck+test+build를 한 게이트로 묶으면 회귀를 막습니다.",
    url: "https://docs.claude.com/en/docs/claude-code/hooks",
    sourceIds: ["claude-code-docs"],
    tags: ["test", "ci", "self-heal", "verify"],
  },
  {
    id: "ext-docs-skill",
    name: "문서 자동 생성 스킬/명령",
    kind: "슬래시 명령",
    platform: "범용",
    category: "문서화",
    maturity: "커뮤니티",
    summary: "코드에서 README·CHANGELOG·API 문서를 일관 포맷으로 생성하는 명령.",
    whatItDoes: [
      "변경분 기반 문서 갱신",
      "일관 포맷/한국어 요약",
      "PR에 문서 동기화",
    ],
    install: ".claude/commands/docs.md 또는 스킬로 작성",
    usage: "/docs 호출",
    koreanNote: "한국어 사용자 대상 문서는 명령 템플릿에 한글 출력 규칙을 명시하세요.",
    url: "https://docs.claude.com/en/docs/claude-code/slash-commands",
    sourceIds: ["claude-code-docs"],
    tags: ["docs", "readme", "changelog", "command"],
  },
];

export type ExtensionKindFilter = ExtensionKind | "all";
export type ExtensionPlatformFilter = ExtensionPlatform | "all";
export type ExtensionCategoryFilter = ExtensionCategory | "all";

export const extensionKinds: ExtensionKind[] = [
  "플러그인",
  "훅",
  "스킬",
  "슬래시 명령",
  "서브에이전트",
  "MCP 서버",
  "워크플로우",
  "룰셋/지침",
  "템플릿",
];

export const extensionPlatforms: ExtensionPlatform[] = [
  "Claude Code",
  "Cursor",
  "GitHub Copilot",
  "Codex CLI",
  "Gemini CLI",
  "Windsurf",
  "범용",
];

export const extensionCategories: ExtensionCategory[] = [
  "코드 리뷰",
  "테스트/품질",
  "문서화",
  "Git/PR",
  "보안",
  "디자인/UI",
  "데이터베이스",
  "브라우저 자동화",
  "검색/리서치",
  "생산성",
  "배포/DevOps",
  "컨텍스트 관리",
];

export function getExtensionSearchText(extension: AgentExtension): string {
  return [
    extension.name,
    extension.kind,
    extension.platform,
    extension.category,
    extension.maturity,
    extension.summary,
    ...extension.whatItDoes,
    extension.install,
    extension.usage,
    extension.koreanNote ?? "",
    ...extension.tags,
  ].join(" ");
}

export function getExtensionStats() {
  return {
    total: agentExtensions.length,
    kinds: new Set(agentExtensions.map((e) => e.kind)).size,
    platforms: new Set(agentExtensions.map((e) => e.platform)).size,
    categories: new Set(agentExtensions.map((e) => e.category)).size,
    official: agentExtensions.filter((e) => e.maturity === "공식").length,
  };
}
