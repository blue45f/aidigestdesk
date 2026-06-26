// 이 파일은 scripts로 생성된 데이터입니다(LLM 코딩 CLI 상세 한글 매뉴얼).
// 생성기: packages/content(.. research 워크플로 산출물) → cliManuals.ts
import type { ProviderId } from './catalog'

export type CliManualCommand = {
  command: string
  description: string
  example: string
  category: string
}

export type CliManualFeature = {
  title: string
  body: string
}

/** 코딩 CLI/에이전트별 상세 한글 매뉴얼(명령·기능·팁 레퍼런스). */
export type CliToolManual = {
  id: string
  slug: string
  platform: string
  tagline: string
  overview: string
  install: string
  auth: string
  commands: CliManualCommand[]
  features: CliManualFeature[]
  tips: string[]
  sourceUrls: string[]
  providerId?: ProviderId
}

export const cliToolManuals: CliToolManual[] = [
  {
    "id": "cli-manual-crush",
    "slug": "crush",
    "platform": "Crush",
    "tagline": "터미널에서 바로 쓰는 Charm의 화려한 에이전트형 AI 코딩 도구",
    "overview": "Crush는 Charm(charmbracelet)이 만든 터미널 우선 AI 코딩 에이전트로, 화려한 TUI 안에서 코드를 읽고 수정하고 명령을 실행한다. Anthropic, OpenAI, Google Gemini, Groq, OpenRouter, Amazon Bedrock, Azure, Vertex AI 등 거의 모든 주요 LLM 프로바이더를 지원하며 세션 도중 모델을 자유롭게 전환할 수 있다. MCP(stdio/http/sse)와 LSP를 결합해 도구와 코드 인텔리전스를 확장하고, 권한 시스템으로 위험한 작업을 통제한다. 대화형 TUI뿐 아니라 `crush run`으로 파이프·스크립트·CI에서 비대화형으로도 쓸 수 있어 자동화에 적합하다. macOS/Linux/Windows를 모두 지원하고 brew, npm, go 등 다양한 경로로 설치된다.",
    "install": "Homebrew로 설치하는 것이 가장 간편하다: `brew install charmbracelet/tap/crush`. npm 사용자는 `npm install -g @charmland/crush`, Go 사용자는 `go install github.com/charmbracelet/crush@latest`로 설치할 수 있다. Windows는 `winget install charmbracelet.crush` 또는 Scoop(`scoop bucket add charm https://github.com/charmbracelet/scoop-bucket.git` 후 `scoop install crush`)을 쓴다. Nix는 `nix run github:numtide/nix-ai-tools#crush`, Arch는 `yay -S crush-bin`, FreeBSD는 `pkg install crush`로 설치한다. Debian/Ubuntu·Fedora/RHEL은 Charm의 공식 apt/yum 저장소(repo.charm.sh)를 등록한 뒤 `sudo apt install crush` 또는 `sudo yum install crush`로 설치할 수 있다.",
    "auth": "Crush는 프로바이더별 API 키를 환경변수로 읽는다. 예: `export ANTHROPIC_API_KEY=...`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `VERCEL_API_KEY`(AI Gateway), `HF_TOKEN`(Hugging Face), `CEREBRAS_API_KEY`, `HYPER_API_KEY`(Charm Hyper). Amazon Bedrock은 `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`/`AWS_REGION`, Azure는 `AZURE_OPENAI_API_ENDPOINT`/`AZURE_OPENAI_API_KEY`, Vertex AI는 `VERTEXAI_PROJECT`/`VERTEXAI_LOCATION`을 사용한다. 키는 `crush.json`의 `providers`에 직접 넣거나 셸 변수 확장(`$VAR`, `${VAR:-기본값}`, `$(명령)`)으로 주입할 수도 있다. OAuth 기반 플랫폼인 Charm Hyper와 GitHub Copilot은 환경변수 대신 `crush login copilot`처럼 로그인하면 토큰이 저장된다. 모델은 TUI에서 `/models`로 전환하거나 비대화형 모드에서 `crush run -m provider/model`로 지정한다.",
    "commands": [
      {
        "command": "crush",
        "description": "서브커맨드 없이 실행하면 대화형 TUI 세션이 시작된다(기본 사용 방식).",
        "example": "crush",
        "category": "실행"
      },
      {
        "command": "crush run [prompt...]",
        "description": "단일 프롬프트를 비대화형으로 실행하고 결과를 stdout으로 출력한 뒤 종료한다.",
        "example": "crush run \"Explain what this repo does\"",
        "category": "실행"
      },
      {
        "command": "crush run (stdin)",
        "description": "프롬프트를 인자 대신 표준입력(stdin)으로 파이프해 넘길 수 있어 스크립트·CI에 적합하다.",
        "example": "curl https://charm.land | crush run \"Summarize this website\"",
        "category": "실행"
      },
      {
        "command": "-y, --yolo",
        "description": "모든 권한 프롬프트를 건너뛰고 도구 실행을 자동 승인한다(위험 모드, 신뢰된 환경에서만 사용).",
        "example": "crush -y",
        "category": "실행"
      },
      {
        "command": "-s, --session <id>",
        "description": "지정한 ID의 이전 세션을 이어서 진행한다(루트·run 공통, --continue와 동시 사용 불가).",
        "example": "crush -s 4f3a2b1c",
        "category": "세션"
      },
      {
        "command": "-C, --continue",
        "description": "가장 최근 세션을 이어서 진행한다(루트·run 공통).",
        "example": "crush -C",
        "category": "세션"
      },
      {
        "command": "-c, --cwd <dir>",
        "description": "현재 작업 디렉터리를 재정의한다(모든 명령에 적용되는 전역 플래그).",
        "example": "crush -c ./my-project",
        "category": "설정"
      },
      {
        "command": "-D, --data-dir <dir>",
        "description": "DB와 로그가 저장되는 Crush 데이터 디렉터리를 재정의한다(전역 플래그).",
        "example": "crush -D ./.crush-data",
        "category": "설정"
      },
      {
        "command": "-d, --debug",
        "description": "디버그 로깅을 활성화한다(전역 플래그).",
        "example": "crush -d",
        "category": "로그"
      },
      {
        "command": "-H, --host <host>",
        "description": "특정 Crush 서버 호스트에 연결한다(원격 워크스페이스 관리용 고급 옵션).",
        "example": "crush -H localhost:7070",
        "category": "기타"
      },
      {
        "command": "-h, --help",
        "description": "도움말과 사용법을 출력한다.",
        "example": "crush --help",
        "category": "기타"
      },
      {
        "command": "--version",
        "description": "설치된 Crush 버전을 출력한다.",
        "example": "crush --version",
        "category": "기타"
      },
      {
        "command": "-q, --quiet",
        "description": "crush run에서 진행 스피너를 숨긴다(출력 리디렉션에 유용).",
        "example": "crush run -q \"Generate a README for this project\"",
        "category": "실행"
      },
      {
        "command": "-v, --verbose",
        "description": "crush run에서 로그를 stderr로 출력한다.",
        "example": "crush run -v \"Refactor this function\"",
        "category": "로그"
      },
      {
        "command": "-m, --model <model>",
        "description": "crush run에서 사용할 대형 모델을 지정한다. 'model' 또는 'provider/model' 형식 모두 허용.",
        "example": "crush run -m openai/gpt-4o \"Add tests\"",
        "category": "모델"
      },
      {
        "command": "--small-model <model>",
        "description": "crush run에서 보조(소형) 모델을 지정한다. 미지정 시 프로바이더 기본 소형 모델 사용.",
        "example": "crush run --small-model openai/gpt-4o-mini \"Summarize this file\"",
        "category": "모델"
      },
      {
        "command": "crush logs",
        "description": "Crush가 생성한 로그를 본다(기본으로 마지막 1000줄 출력).",
        "example": "crush logs",
        "category": "로그"
      },
      {
        "command": "-f, --follow",
        "description": "crush logs에서 로그 출력을 실시간으로 팔로우한다.",
        "example": "crush logs -f",
        "category": "로그"
      },
      {
        "command": "-t, --tail <N>",
        "description": "crush logs에서 마지막 N줄만 표시한다(기본 1000).",
        "example": "crush logs --tail 500",
        "category": "로그"
      },
      {
        "command": "crush session list",
        "description": "모든 세션을 ID·제목과 함께 나열한다(별칭: crush session ls, crush sessions).",
        "example": "crush session list",
        "category": "세션"
      },
      {
        "command": "crush session show <id>",
        "description": "특정 세션의 전체 메시지 기록을 표시한다.",
        "example": "crush session show 4f3a2b1c",
        "category": "세션"
      },
      {
        "command": "crush session last",
        "description": "가장 최근 세션을 표시한다.",
        "example": "crush session last",
        "category": "세션"
      },
      {
        "command": "crush session delete <id>",
        "description": "DB에서 세션을 삭제한다(별칭: crush session rm).",
        "example": "crush session delete 4f3a2b1c",
        "category": "세션"
      },
      {
        "command": "crush session rename <id> <title>",
        "description": "세션 제목을 변경한다.",
        "example": "crush session rename 4f3a2b1c \"Refactor auth\"",
        "category": "세션"
      },
      {
        "command": "--json",
        "description": "session·projects 명령의 출력을 JSON으로 내보낸다(자동화·파싱용).",
        "example": "crush session list --json",
        "category": "세션"
      },
      {
        "command": "crush projects",
        "description": "Crush 프로젝트 데이터가 존재하는 디렉터리 목록을 표시한다(--json 지원).",
        "example": "crush projects --json",
        "category": "기타"
      },
      {
        "command": "crush update-providers [path-or-url]",
        "description": "Catwalk에서 프로바이더 정보를 원격으로 갱신한다. 커스텀 URL이나 로컬 파일 경로도 인자로 받는다.",
        "example": "crush update-providers",
        "category": "모델"
      },
      {
        "command": "crush update-providers embedded",
        "description": "프로바이더 정보를 바이너리에 내장된 버전으로 되돌린다.",
        "example": "crush update-providers embedded",
        "category": "모델"
      },
      {
        "command": "--source <catwalk|hyper>",
        "description": "update-providers에서 갱신할 프로바이더 소스를 선택한다(기본 catwalk).",
        "example": "crush update-providers --source=hyper",
        "category": "모델"
      },
      {
        "command": "crush login [platform]",
        "description": "플랫폼에 로그인한다. 사용 가능 플랫폼: hyper, copilot(인자 없으면 Charm Hyper).",
        "example": "crush login copilot",
        "category": "인증"
      },
      {
        "command": "-f, --force (login)",
        "description": "login에서 이미 로그인돼 있어도 강제로 재인증한다(logout에서는 확인 프롬프트 건너뜀).",
        "example": "crush login -f copilot",
        "category": "인증"
      },
      {
        "command": "crush logout [platform]",
        "description": "플랫폼에서 로그아웃하고 저장된 자격증명을 제거한다(인자 없으면 로그인된 플랫폼 목록 표시).",
        "example": "crush logout copilot",
        "category": "인증"
      },
      {
        "command": "crush stats",
        "description": "토큰 사용량·비용·활동 패턴 등 로컬 사용 통계를 생성·표시한다.",
        "example": "crush stats",
        "category": "기타"
      },
      {
        "command": "crush dirs",
        "description": "Crush가 설정과 데이터를 저장하는 디렉터리 경로(발견된 프로젝트 설정 포함)를 보여준다.",
        "example": "crush dirs",
        "category": "설정"
      },
      {
        "command": "crush schema",
        "description": "crush.json 설정 파일의 JSON 스키마를 생성한다(숨김 명령).",
        "example": "crush schema > crush.schema.json",
        "category": "설정"
      }
    ],
    "features": [
      {
        "title": "화려한 터미널 TUI 에이전트",
        "body": "Charm 특유의 미려한 TUI 안에서 AI가 파일을 읽고 편집하며 셸 명령을 실행한다. 터미널을 떠나지 않고 에이전트형 코딩 워크플로를 수행할 수 있다."
      },
      {
        "title": "멀티 모델·멀티 프로바이더",
        "body": "Anthropic, OpenAI, Gemini, Groq, OpenRouter, Vercel AI Gateway, Bedrock, Azure, Vertex AI, Cerebras, Hugging Face, Charm Hyper, GitHub Copilot을 지원하고 세션 도중 /models로 모델을 전환할 수 있다."
      },
      {
        "title": "비대화형 run 모드",
        "body": "`crush run`으로 단일 프롬프트를 실행해 stdout으로 결과를 받는다. stdin 파이프, 파일 입력, 출력 리디렉션을 지원해 스크립트와 CI 파이프라인에 통합하기 좋다."
      },
      {
        "title": "영속 세션 관리",
        "body": "대화가 DB에 저장되어 list/show/last/delete/rename으로 관리하고 -s/-C로 이어갈 수 있다. --json 출력으로 자동화 파이프라인에서 파싱하기 쉽다."
      },
      {
        "title": "MCP(Model Context Protocol) 지원",
        "body": "stdio·http·sse 전송 방식으로 외부 MCP 서버를 연결해 도구를 확장한다. 설정 전반에서 $VAR·${VAR:-default}·$(command) 셸 변수 확장을 사용할 수 있다."
      },
      {
        "title": "LSP 통합",
        "body": "언어 서버(LSP)를 연동해 코드 인텔리전스를 제공하므로 에이전트가 더 정확하게 코드를 이해하고 수정한다."
      },
      {
        "title": "권한 시스템과 YOLO 모드",
        "body": "도구 실행 전 권한을 확인하며 permissions.allowed_tools로 허용 도구를 화이트리스트할 수 있다. 신뢰 환경에서는 -y/--yolo로 모든 승인을 건너뛴다."
      },
      {
        "title": "유연한 설정 파일",
        "body": "프로젝트 로컬 `.crush.json`/`crush.json`과 전역 `~/.config/crush/crush.json`을 계층적으로 병합한다. `crush schema`로 스키마를 생성하고 `crush dirs`로 경로를 확인한다."
      },
      {
        "title": "Catwalk 프로바이더 카탈로그",
        "body": "모델·프로바이더 메타데이터를 Charm의 Catwalk에서 가져오며 `crush update-providers`로 최신 목록을 동기화하거나 내장 버전으로 되돌릴 수 있다."
      }
    ],
    "tips": [
      "프로젝트 루트에 `.crush.json`을 두면 그 프로젝트 전용 설정이 적용된다. 경로가 헷갈리면 `crush dirs`로 설정·데이터 위치를 바로 확인하자.",
      "CI나 스크립트에서는 `curl ... | crush run \"...\"`처럼 stdin 파이프로 비대화형 실행을 활용하면 좋다. 출력은 `>`로 파일에 바로 저장할 수 있다.",
      "세션을 자동화로 다룰 때는 `--json`을 붙여 기계가 읽기 좋은 출력을 받자(예: `crush session list --json`).",
      "`-y/--yolo`는 모든 권한 확인을 건너뛰므로 반드시 신뢰할 수 있는 디렉터리·환경에서만 사용한다.",
      "문제 추적 시 `crush -d`로 디버그 로깅을 켜고 `crush logs -f`로 실시간 로그를 따라가면 원인을 빠르게 찾을 수 있다.",
      "세션 ID는 전체 UUID 대신 해시 접두어만으로도 매칭되므로 `crush session show 4f3a`처럼 짧게 입력해도 된다.",
      "모델 비교가 필요하면 TUI에서 `/models`로 전환하거나, 비대화형에서는 `crush run -m provider/model`로 모델을 직접 지정한다.",
      "새 모델이 안 보이면 `crush update-providers`로 Catwalk 카탈로그를 갱신하고, 오프라인이면 `crush update-providers embedded`로 내장 버전을 쓴다.",
      "API 키는 환경변수 또는 `crush.json`에 넣되, 민감정보는 `${VAR}`나 `$(...)` 확장으로 주입해 평문 노출을 줄이자.",
      "GitHub Copilot이나 Charm Hyper는 키 대신 `crush login copilot`/`crush login`으로 OAuth 인증하면 토큰이 안전하게 저장된다."
    ],
    "sourceUrls": [
      "https://github.com/charmbracelet/crush",
      "https://github.com/charmbracelet/crush/blob/main/README.md",
      "https://charmbracelet-crush.mintlify.app/quickstart"
    ]
  },
  {
    "id": "cli-manual-goose",
    "slug": "goose",
    "platform": "Goose",
    "tagline": "코드와 워크플로를 자동화하는 오픈소스 로컬 AI 에이전트 (데스크톱·CLI·API)",
    "overview": "Goose는 Block에서 시작해 현재 Linux Foundation 산하 Agentic AI Foundation(AAIF, aaif-goose)이 관리하는 오픈소스 AI 에이전트다. 데스크톱 앱·CLI·API 형태로 로컬에서 동작하며 Rust로 작성되어 빠르고 이식성이 좋다. 단순 코드 제안을 넘어 코드 작성·실행·수정·테스트는 물론 리서치, 자동화, 데이터 분석 같은 범용 작업까지 직접 수행한다. Anthropic, OpenAI, Google, Ollama 등 40여 개 LLM 프로바이더와 MCP(Model Context Protocol) 기반 확장 생태계를 지원한다. 레시피(Recipes)로 워크플로를 패키징·공유하고, 스케줄로 무인 자동화까지 구성할 수 있다.",
    "install": "macOS/Linux에서는 공식 설치 스크립트로 CLI를 설치한다: `curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash`. 설치 중 대화형 설정을 건너뛰려면 `CONFIGURE=false`를 붙인다. Homebrew를 쓰면 CLI는 `brew install block-goose-cli`, 데스크톱 앱은 `brew install --cask block-goose`로 설치한다. Windows는 PowerShell에서 `download_cli.ps1`을 받아 실행하거나 Git Bash/WSL에서 동일한 curl 명령을 사용한다. (저장소는 block/goose에서 AAIF의 aaif-goose/goose로, 문서는 block.github.io/goose에서 goose-docs.ai로 이전되었다.)",
    "auth": "설치 후 `goose configure`를 실행해 LLM 프로바이더를 설정한다. 메뉴에서 'Configure Providers'를 선택한 뒤 프로바이더(Anthropic, OpenAI, Google Gemini, Ollama, OpenRouter, Azure OpenAI, Amazon Bedrock 등 40+)를 고르고 API 키와 모델을 입력하면 자동 저장된다. 같은 메뉴의 'Add Extension'으로 MCP 확장도 추가/토글할 수 있다. 환경변수로도 지정 가능하다: `export GOOSE_PROVIDER=anthropic`, `export GOOSE_MODEL=claude-sonnet-4-0`. 실행 단위로는 `goose run --provider anthropic --model claude-sonnet-4-0`처럼 덮어쓴다. API 키는 시스템 키체인 또는 설정 파일에 저장되며, 현재 설정 파일 위치는 `goose info`로 확인할 수 있다.",
    "commands": [
      {
        "command": "goose configure",
        "description": "프로바이더·모델·확장 등 Goose 설정을 대화형 메뉴로 구성한다.",
        "example": "goose configure",
        "category": "설정"
      },
      {
        "command": "goose session",
        "description": "대화형 채팅 세션을 새로 시작한다. -n으로 이름을 지정한다.",
        "example": "goose session -n my-project",
        "category": "세션"
      },
      {
        "command": "goose session -r, --resume",
        "description": "이전 세션을 이어서 재개한다(이름 또는 --session-id로 지정).",
        "example": "goose session --resume -n my-project",
        "category": "세션"
      },
      {
        "command": "goose session --fork",
        "description": "기존 세션을 복제(분기)해 원본을 보존한 채 새 갈래로 진행한다.",
        "example": "goose session --resume --fork --name my-project",
        "category": "세션"
      },
      {
        "command": "goose session list",
        "description": "저장된 세션 목록을 표시한다(-f json, -w 작업 디렉터리 필터, -l 개수 제한).",
        "example": "goose session list --format json",
        "category": "세션"
      },
      {
        "command": "goose session remove",
        "description": "저장된 세션을 하나 이상 삭제한다(-n 이름, --session-id, -r 정규식).",
        "example": "goose session remove --session-id 20251108_3",
        "category": "세션"
      },
      {
        "command": "goose session export",
        "description": "세션 내용을 markdown/json/yaml 파일로 내보낸다.",
        "example": "goose session export -n my-session --format json -o session-backup.json",
        "category": "세션"
      },
      {
        "command": "goose session diagnostics",
        "description": "문제 해결용 진단 JSON 리포트를 생성한다.",
        "example": "goose session diagnostics -n my-session -o report.json",
        "category": "세션"
      },
      {
        "command": "goose run",
        "description": "비대화형(헤드리스)으로 작업을 실행한다. 텍스트·파일·레시피 입력을 지원한다.",
        "example": "goose run --instructions plan.md",
        "category": "실행"
      },
      {
        "command": "goose run -i, --instructions <FILE>",
        "description": "지시문 파일의 내용을 실행한다.",
        "example": "goose run -i plan.md",
        "category": "실행"
      },
      {
        "command": "goose run -t, --text <TEXT>",
        "description": "인라인 텍스트 지시를 바로 실행한다.",
        "example": "goose run -t \"list all TODOs in this repo\"",
        "category": "실행"
      },
      {
        "command": "goose run --recipe <FILE>",
        "description": "레시피 파일을 실행한다. --interactive와 함께 대화형으로 진입할 수 있다.",
        "example": "goose run --recipe recipe.yaml --interactive",
        "category": "실행"
      },
      {
        "command": "goose run --params <KEY=VALUE>",
        "description": "레시피 실행 시 파라미터를 주입한다.",
        "example": "goose run --recipe recipe.yaml --params environment=production",
        "category": "실행"
      },
      {
        "command": "goose run --provider <P> --model <M>",
        "description": "이번 실행에 사용할 프로바이더·모델을 덮어쓴다.",
        "example": "goose run -t \"hi\" --provider anthropic --model claude-sonnet-4-0",
        "category": "실행"
      },
      {
        "command": "goose session --with-builtin <ids>",
        "description": "내장 확장(developer, computercontroller 등)을 세션에 즉시 로드한다.",
        "example": "goose session --with-builtin \"developer,computercontroller\"",
        "category": "확장(MCP)"
      },
      {
        "command": "goose session --with-extension <cmd>",
        "description": "외부 MCP 서버(stdio 명령)를 일회성으로 연결한다. 환경변수도 앞에 붙일 수 있다.",
        "example": "goose session --with-extension \"uvx mcp-server-fetch\"",
        "category": "확장(MCP)"
      },
      {
        "command": "goose session --with-streamable-http-extension <url>",
        "description": "원격 Streamable HTTP MCP 확장을 연결한다.",
        "example": "goose session --with-streamable-http-extension \"https://example.com/streamable\"",
        "category": "확장(MCP)"
      },
      {
        "command": "goose mcp <name>",
        "description": "활성화된 내장 확장을 MCP 서버로 실행해 다른 클라이언트에서 사용한다.",
        "example": "goose mcp developer",
        "category": "확장(MCP)"
      },
      {
        "command": "goose recipe list",
        "description": "사용 가능한 레시피를 나열한다(-v 상세, --format 지정).",
        "example": "goose recipe list --verbose",
        "category": "레시피"
      },
      {
        "command": "goose recipe validate <FILE>",
        "description": "레시피 파일의 형식·필드 유효성을 검사한다.",
        "example": "goose recipe validate my-recipe.yaml",
        "category": "레시피"
      },
      {
        "command": "goose recipe deeplink <FILE>",
        "description": "레시피로 세션을 바로 여는 공유용 딥링크 URL을 생성한다(-p 파라미터).",
        "example": "goose recipe deeplink my-recipe.yaml",
        "category": "레시피"
      },
      {
        "command": "goose recipe open <FILE>",
        "description": "레시피를 열어 해당 설정으로 세션을 시작한다.",
        "example": "goose recipe open my-recipe.yaml",
        "category": "레시피"
      },
      {
        "command": "goose schedule add",
        "description": "cron 식으로 레시피 자동 실행 일정을 등록한다.",
        "example": "goose schedule add --schedule-id daily --cron \"0 0 9 * * *\" --recipe-source ./recipes/daily.yaml",
        "category": "스케줄"
      },
      {
        "command": "goose schedule list",
        "description": "등록된 스케줄 목록을 표시한다.",
        "example": "goose schedule list",
        "category": "스케줄"
      },
      {
        "command": "goose schedule remove",
        "description": "등록된 스케줄을 삭제한다.",
        "example": "goose schedule remove --schedule-id daily",
        "category": "스케줄"
      },
      {
        "command": "goose schedule sessions",
        "description": "특정 스케줄이 생성한 세션들을 조회한다.",
        "example": "goose schedule sessions --schedule-id daily",
        "category": "스케줄"
      },
      {
        "command": "goose schedule run-now",
        "description": "스케줄을 기다리지 않고 즉시 한 번 실행한다.",
        "example": "goose schedule run-now --schedule-id daily",
        "category": "스케줄"
      },
      {
        "command": "goose project",
        "description": "마지막 프로젝트를 이어서 시작하거나 새 프로젝트를 만든다(별칭 p).",
        "example": "goose project",
        "category": "프로젝트"
      },
      {
        "command": "goose projects",
        "description": "저장된 프로젝트 중 하나를 골라 시작한다(별칭 ps).",
        "example": "goose projects",
        "category": "프로젝트"
      },
      {
        "command": "goose plugin install <URL>",
        "description": "git 저장소 기반 Goose 플러그인을 설치한다(--auto-update 지원).",
        "example": "goose plugin install https://github.com/example/my-goose-plugin.git",
        "category": "플러그인"
      },
      {
        "command": "goose plugin update <NAME>",
        "description": "설치된 플러그인을 최신으로 갱신한다.",
        "example": "goose plugin update my-goose-plugin",
        "category": "플러그인"
      },
      {
        "command": "goose acp",
        "description": "stdio로 Agent Client Protocol 서버를 실행해 에디터(예: Zed)와 통합한다.",
        "example": "goose acp",
        "category": "통합"
      },
      {
        "command": "@goose, @g",
        "description": "셸 프롬프트에서 명령 히스토리를 포함해 Goose에게 바로 질문한다(터미널 통합).",
        "example": "@goose why did the last command fail?",
        "category": "통합"
      },
      {
        "command": "goose info",
        "description": "버전·설정 파일 위치·세션 저장소·로그 경로를 표시한다(-v 상세).",
        "example": "goose info -v",
        "category": "정보·유지보수"
      },
      {
        "command": "goose update",
        "description": "Goose CLI를 최신 버전으로 갱신한다(-c 카나리 개발판, -r 재설정).",
        "example": "goose update --canary",
        "category": "정보·유지보수"
      },
      {
        "command": "goose completion <SHELL>",
        "description": "셸 자동완성 스크립트를 생성한다(bash/zsh/fish/powershell/elvish/nu).",
        "example": "goose completion zsh",
        "category": "정보·유지보수"
      },
      {
        "command": "goose --help",
        "description": "전체 명령·옵션 도움말을 표시한다.",
        "example": "goose --help",
        "category": "정보·유지보수"
      },
      {
        "command": "goose --version",
        "description": "설치된 Goose 버전을 출력한다.",
        "example": "goose --version",
        "category": "정보·유지보수"
      }
    ],
    "features": [
      {
        "title": "멀티 인터페이스 로컬 에이전트",
        "body": "데스크톱 앱·CLI·API를 모두 제공하며 Rust로 작성되어 빠르고 이식성이 높다. 작업이 사용자 머신에서 로컬로 실행된다."
      },
      {
        "title": "40+ LLM 프로바이더",
        "body": "Anthropic, OpenAI, Google Gemini, Ollama, OpenRouter, Azure OpenAI, Amazon Bedrock, Groq, Databricks 등 40여 개 프로바이더를 지원해 모델을 자유롭게 교체한다."
      },
      {
        "title": "MCP 확장 생태계",
        "body": "Model Context Protocol 기반으로 developer·computercontroller·memory 같은 내장 확장과 외부 MCP 서버(stdio/Streamable HTTP)를 연결해 기능을 확장한다."
      },
      {
        "title": "레시피(Recipes)",
        "body": "확장·프롬프트·설정을 하나로 묶은 재사용 워크플로다. 파라미터·서브레시피를 지원하고 딥링크 URL로 팀과 공유·재현할 수 있다."
      },
      {
        "title": "스케줄 자동화",
        "body": "cron 식으로 레시피를 정기 실행하도록 등록하고, 실행 이력 조회나 즉시 실행(run-now)도 가능하다."
      },
      {
        "title": "헤드리스 실행",
        "body": "goose run으로 지시문 파일·인라인 텍스트·레시피를 비대화형으로 실행해 CI나 스크립트에 통합한다."
      },
      {
        "title": "도구 실행 모드 제어",
        "body": "auto/approve/chat/smart_approve 모드(GOOSE_MODE)로 에이전트의 도구 실행 승인 방식을 세밀하게 통제한다."
      },
      {
        "title": "플랜 모드와 플래너 모델",
        "body": "계획 단계와 실행 단계를 분리하고, GOOSE_PLANNER_PROVIDER/MODEL로 계획 전용 모델을 따로 지정할 수 있다."
      },
      {
        "title": "세션/프로젝트 관리",
        "body": "세션 재개(--resume)·분기(--fork)·내보내기(export)·진단(diagnostics)과 프로젝트 단위 작업 전환을 지원한다."
      },
      {
        "title": "에디터·셸 통합",
        "body": "ACP 서버(goose acp)로 Zed 같은 에디터와 연동하고, @goose/@g로 셸에서 곧바로 질문할 수 있다."
      }
    ],
    "tips": [
      "설치 중 대화형 설정을 건너뛰려면 설치 스크립트에 `CONFIGURE=false`를 전달한다.",
      "프로바이더·확장 관리는 `goose configure`로, 현재 설정 파일·로그·세션 저장 위치 확인은 `goose info`로 한다.",
      "긴 작업은 `--resume`로 이어가고, 분기 실험이 필요하면 `--fork`로 원본 세션을 보존한다.",
      "기본 모델을 고정하려면 `GOOSE_PROVIDER`, `GOOSE_MODEL` 환경변수를 쓰고, 일회성 변경은 run의 --provider/--model로 덮어쓴다.",
      "도구 실행 승인 방식은 `GOOSE_MODE=auto|approve|chat|smart_approve`로 조정한다(예: 무인 자동화는 auto).",
      "컨텍스트 한도 초과 처리는 `GOOSE_CONTEXT_STRATEGY`(summarize/truncate/clear/prompt)로 제어한다.",
      "확장을 영구 등록 없이 그 세션에만 쓰려면 `--with-builtin`/`--with-extension`를 활용한다.",
      "반복 워크플로는 레시피로 패키징하고 `goose recipe deeplink`로 공유 URL을 만들어 팀과 재현한다.",
      "무인 자동화는 schedule + recipe 조합으로 구성하고, 등록 전 `goose recipe validate`로 레시피를 검증한다.",
      "`GOOSE_CLI_THEME`(light/dark/ansi)와 `GOOSE_PROMPT_EDITOR`로 CLI 사용 경험을 커스터마이즈한다."
    ],
    "sourceUrls": [
      "https://github.com/aaif-goose/goose",
      "https://goose-docs.ai/",
      "https://goose-docs.ai/docs/guides/goose-cli-commands/"
    ]
  },
  {
    "id": "cli-manual-amazon-q-cli",
    "slug": "amazon-q-cli",
    "platform": "Amazon Q Developer CLI",
    "tagline": "터미널에서 동작하는 AWS의 AI 코딩 에이전트 — 자연어로 셸 명령을 만들고 MCP 도구까지 연결하는 q 커맨드",
    "overview": "Amazon Q Developer CLI(`q`)는 터미널에서 바로 쓰는 생성형 AI 어시스턴트로, Amazon Bedrock을 기반으로 동작한다. 핵심 명령 `q chat`은 에이전트형 환경으로, 파일을 읽고 쓰고 bash 명령을 실행하며 AWS API를 호출해 작업을 자율적으로 수행한다(작업 전 승인 가능). `q translate`로 자연어를 셸 명령으로 변환하고, MCP 서버를 연결해 외부 도구를 확장할 수 있다. 무료 AWS Builder ID 또는 조직용 IAM Identity Center(Pro)로 로그인하며, 채팅 세션 안에서는 `/`로 시작하는 슬래시 명령으로 컨텍스트·도구·모델을 제어한다. 참고로 이 오픈소스 프로젝트는 현재 유지보수 모드이며 최신 기능은 후속 제품 Kiro CLI로 이전되고 있다.",
    "install": "macOS에서는 Homebrew로 `brew install --cask amazon-q`를 실행하거나 공식 DMG를 내려받아 설치한다. Linux는 Ubuntu/Debian용 `.deb` 패키지, 배포판 독립 `AppImage`, zip 기반 대체 빌드를 제공한다(공식 설치 문서 참고). 설치 후 `q --version`으로 확인하고, 셸 자동완성·인라인 기능이 필요하면 `q integrations install dotfiles`로 셸 통합을 추가한 뒤 `q login`으로 인증한다.",
    "auth": "Amazon Q는 무료 AWS Builder ID 또는 조직용 IAM Identity Center(Pro)로 로그인한다. `q login`을 실행하면 로그인 방식 선택 프롬프트가 뜨고 브라우저가 열려 PKCE 인증을 진행한다. 무료는 `q login --license free`, 조직 SSO는 `q login --license pro --identity-provider <start-url> --region <region>` 형태로 지정하며, 원격/헤드리스 환경은 `q login --use-device-flow`로 디바이스 코드 방식을 쓴다. 현재 로그인 상태는 `q whoami`, 로그아웃은 `q logout`, Pro 프로필 전환은 `q profile`로 처리한다.",
    "commands": [
      {
        "command": "q chat",
        "description": "터미널에서 Amazon Q AI 에이전트와 대화를 시작한다. 파일 읽기·쓰기, bash 실행, 코드 생성을 수행한다. 주요 옵션: -r/--resume, --model, --agent, --trust-all-tools, --no-interactive.",
        "example": "q chat \"Explain the error in app.log and fix it\"",
        "category": "대화"
      },
      {
        "command": "q translate",
        "description": "자연어 설명을 셸 명령으로 변환한다(별칭 q ai). 생성된 명령을 검토 후 실행할 수 있다.",
        "example": "q translate \"find files larger than 100MB modified this week\"",
        "category": "자연어 변환"
      },
      {
        "command": "q login",
        "description": "Builder ID(무료) 또는 IAM Identity Center(Pro)로 로그인한다. --use-device-flow로 디바이스 코드 방식도 쓸 수 있다.",
        "example": "q login --license pro --identity-provider https://my-sso.awsapps.com/start --region us-east-1",
        "category": "인증"
      },
      {
        "command": "q logout",
        "description": "현재 계정에서 로그아웃하고 저장된 인증 토큰을 제거한다.",
        "example": "q logout",
        "category": "인증"
      },
      {
        "command": "q whoami",
        "description": "현재 로그인 세션 정보(계정 유형, start URL, 리전)를 출력한다. --format json 지원.",
        "example": "q whoami --format json",
        "category": "인증"
      },
      {
        "command": "q profile",
        "description": "IAM Identity Center(Pro) 사용자의 Q Developer 프로필을 조회·전환한다.",
        "example": "q profile",
        "category": "인증"
      },
      {
        "command": "q settings",
        "description": "CLI 외형과 동작 설정값을 읽고 쓴다. `q settings open`으로 설정 파일을 열고, `q settings list --all`로 전체 설정을 본다.",
        "example": "q settings chat.enableKnowledge true",
        "category": "설정"
      },
      {
        "command": "q mcp add",
        "description": "MCP 서버를 설정에 추가한다. --name, --command 필수이며 --args, --env, --scope, --agent, --timeout, --force를 지원한다.",
        "example": "q mcp add --name git --command uvx --args git-mcp-server",
        "category": "MCP 관리"
      },
      {
        "command": "q mcp list",
        "description": "설정된 MCP 서버 목록을 스코프별로 출력한다.",
        "example": "q mcp list global",
        "category": "MCP 관리"
      },
      {
        "command": "q mcp import",
        "description": "다른 파일에서 MCP 서버 구성을 가져온다. --force로 동일 이름 서버를 덮어쓴다.",
        "example": "q mcp import --file servers.json",
        "category": "MCP 관리"
      },
      {
        "command": "q mcp remove",
        "description": "설정에서 지정한 MCP 서버를 제거한다(별칭 rm).",
        "example": "q mcp remove --name git",
        "category": "MCP 관리"
      },
      {
        "command": "q agent",
        "description": "재사용 가능한 에이전트(도구·컨텍스트·권한·모델 묶음)를 관리한다. 하위: list, create, edit, validate, migrate, set-default.",
        "example": "q agent create --name backend-dev",
        "category": "에이전트 관리"
      },
      {
        "command": "q doctor",
        "description": "설치·통합과 관련된 일반적인 문제를 자동으로 진단하고 수정한다.",
        "example": "q doctor",
        "category": "진단·유지보수"
      },
      {
        "command": "q diagnostic",
        "description": "환경·설치 상태 진단 정보를 수집해 출력한다(별칭 diagnostics). --format json 지원.",
        "example": "q diagnostic",
        "category": "진단·유지보수"
      },
      {
        "command": "q update",
        "description": "Amazon Q 애플리케이션을 최신 버전으로 업데이트한다(별칭 upgrade).",
        "example": "q update",
        "category": "진단·유지보수"
      },
      {
        "command": "q inline",
        "description": "셸 입력 중 실시간 인라인 자동완성 기능을 제어한다. 하위: enable, disable, status.",
        "example": "q inline status",
        "category": "셸 통합"
      },
      {
        "command": "q integrations install",
        "description": "셸 dotfile, 입력기 등 시스템 통합을 설치한다. uninstall/reinstall/status도 지원한다.",
        "example": "q integrations install dotfiles",
        "category": "셸 통합"
      },
      {
        "command": "q issue",
        "description": "Amazon Q CLI GitHub 저장소에 새 이슈(버그·기능 요청)를 생성한다.",
        "example": "q issue \"Bug: chat hangs on large files\"",
        "category": "기타 CLI"
      },
      {
        "command": "q --version",
        "description": "설치된 CLI 버전을 출력한다. `q version --changelog`로 변경 이력도 본다.",
        "example": "q --version",
        "category": "기타 CLI"
      },
      {
        "command": "q --help",
        "description": "전체 명령·옵션 도움말을 출력한다. 모든 하위 명령 도움말은 `q --help-all`.",
        "example": "q chat --help",
        "category": "기타 CLI"
      },
      {
        "command": "/help",
        "description": "채팅 세션에서 사용할 수 있는 모든 슬래시 명령과 단축키 목록을 표시한다.",
        "example": "/help",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/quit",
        "description": "채팅 세션을 종료한다(별칭 /q, /exit).",
        "example": "/quit",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/clear",
        "description": "현재 대화 기록을 모두 지운다.",
        "example": "/clear",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/editor",
        "description": "$EDITOR(기본 vi)를 열어 긴 프롬프트를 작성한다.",
        "example": "/editor",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/compact",
        "description": "대화 내용을 AI 요약으로 압축해 컨텍스트 공간을 확보한다.",
        "example": "/compact",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/usage",
        "description": "현재 세션의 컨텍스트 윈도우 사용량(토큰)을 항목별로 표시한다.",
        "example": "/usage",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/context",
        "description": "세션에 포함되는 컨텍스트 파일/규칙을 관리한다. 하위: show, add, rm, clear.",
        "example": "/context add README.md",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/tools",
        "description": "사용 가능한 도구와 권한을 확인·관리한다. 하위: trust, untrust, reset, schema.",
        "example": "/tools trust fs_read",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/model",
        "description": "현재 대화에 사용할 모델을 선택한다.",
        "example": "/model",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/save",
        "description": "현재 대화를 파일로 저장한다. -f/--force로 덮어쓰기.",
        "example": "/save my-conversation.json",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/load",
        "description": "이전에 저장한 대화 파일을 불러온다.",
        "example": "/load my-conversation.json",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/agent",
        "description": "세션 내 에이전트를 관리·전환한다. 하위: list, create, edit, generate, schema, set-default, swap.",
        "example": "/agent list",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/prompts",
        "description": "저장된 프롬프트(프롬프트 라이브러리)를 조회·사용한다.",
        "example": "/prompts list",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/mcp",
        "description": "현재 세션에 로드된 MCP 서버와 도구 상태를 표시한다.",
        "example": "/mcp",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/knowledge",
        "description": "영구 컨텍스트 저장용 지식 베이스를 관리한다(Beta, 설정 활성화 필요). 하위: show, add, update, remove, clear.",
        "example": "/knowledge show",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/subscribe",
        "description": "쿼리 한도를 늘리기 위해 Amazon Q Developer Pro 구독으로 업그레이드한다.",
        "example": "/subscribe",
        "category": "채팅 슬래시 명령"
      },
      {
        "command": "/todos",
        "description": "에이전트가 만든 to-do 리스트를 보고 관리하거나 이어서 재개한다.",
        "example": "/todos",
        "category": "채팅 슬래시 명령"
      }
    ],
    "features": [
      {
        "title": "에이전트형 코딩",
        "body": "`q chat`이 파일 읽기·쓰기, bash 명령 실행, AWS API 호출, 코드 작성을 자율적으로 수행한다. 각 동작 전 승인 프롬프트 또는 --trust-all-tools 자동 실행이 가능하다."
      },
      {
        "title": "자연어 → 셸 변환",
        "body": "`q translate`(별칭 ai)로 평범한 설명을 정확한 셸 명령으로 바꿔, 복잡한 옵션·파이프 문법을 외우지 않고도 명령을 만들고 실행한다."
      },
      {
        "title": "MCP 도구 확장",
        "body": "`q mcp` 명령과 mcpServers 구성으로 Model Context Protocol 서버를 표준 방식으로 연결해 외부 데이터·도구를 채팅 세션의 도구로 끌어온다."
      },
      {
        "title": "정밀한 컨텍스트 관리",
        "body": "/context로 파일·규칙을 주입하고, /compact·/usage로 컨텍스트 윈도우 사용량을 압축·점검한다."
      },
      {
        "title": "재사용 가능한 에이전트",
        "body": "`q agent`/`/agent`로 도구·권한·컨텍스트·모델을 묶은 에이전트를 JSON으로 정의해 작업 유형별로 전환한다."
      },
      {
        "title": "도구 권한 모델",
        "body": "/tools로 도구별 신뢰(trust/untrust)와 스키마를 관리해 위험한 동작을 통제하고, 비대화 실행 시 --trust-all-tools로 허용 범위를 지정한다."
      },
      {
        "title": "유연한 인증",
        "body": "무료 AWS Builder ID와 조직용 IAM Identity Center(Pro)를 모두 지원하며, 브라우저 PKCE와 헤드리스용 디바이스 코드 흐름을 제공한다."
      },
      {
        "title": "대화 영속성",
        "body": "/save·/load로 대화를 파일로 저장·복원하고, `q chat --resume`(-r)로 디렉터리의 직전 세션을 그대로 이어간다."
      },
      {
        "title": "셸 통합과 자동완성",
        "body": "`q inline`의 인라인 완성과 `q integrations install`의 dotfile·입력기 통합으로 기존 터미널 워크플로에 자연스럽게 들어간다."
      },
      {
        "title": "지식 베이스 (Beta)",
        "body": "/knowledge로 파일·디렉터리를 인덱싱해 시맨틱 검색이 가능한 영구 컨텍스트를 만들고 세션을 넘어 재사용한다."
      }
    ],
    "tips": [
      "스크립트·CI에서는 `q chat --no-interactive \"...\"`로 비대화 실행하고 출력을 파이프로 활용하라.",
      "위험한 자동 실행을 막으려면 /tools로 현재 권한을 확인하고 필요한 도구만 trust 하라(--trust-all-tools는 신중히).",
      "긴 세션에서 응답 품질이 떨어지면 /compact로 대화를 요약 압축하고 /usage로 토큰 사용량을 점검하라.",
      "자주 쓰는 프롬프트는 `~/.aws/amazonq/prompts`에 Markdown으로 저장해 /prompts로 재사용하라.",
      "프로젝트별 규칙·문서는 에이전트 resources나 /context add로 주입하면 답변 정확도가 올라간다.",
      "원격 서버·헤드리스 환경에서 로그인이 안 되면 `q login --use-device-flow`를 사용하라.",
      "설치·통합 문제는 우선 `q doctor`와 `q diagnostic`으로 자가 진단하라.",
      "무료 한도를 넘으면 /subscribe로 Pro 업그레이드가 가능하며, 한도·사용량은 /usage로 확인한다.",
      "MCP 서버는 워크스페이스(--scope workspace)와 전역(--scope global)을 구분해 관리하면 충돌을 피한다.",
      "이 오픈소스 q CLI는 유지보수 모드이고 최신 기능은 Kiro CLI로 이전 중이므로, 신규 도입 시 후속 제품도 함께 검토하라."
    ],
    "sourceUrls": [
      "https://github.com/aws/amazon-q-developer-cli",
      "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html",
      "https://aws.amazon.com/q/developer/"
    ]
  },
  {
    "id": "cli-manual-qwen-code",
    "slug": "qwen-code",
    "platform": "Qwen Code",
    "tagline": "터미널에서 동작하는 Qwen 모델 기반 오픈소스 AI 코딩 에이전트 (Gemini CLI 포크)",
    "overview": "Qwen Code는 터미널에서 동작하는 오픈소스 AI 코딩 에이전트로, Google의 Gemini CLI를 포크하여 Qwen3-Coder 등 Qwen 계열 모델에 맞게 파서·프롬프트·도구 호출을 최적화한 도구다. 대화형 TUI와 헤드리스(`qwen -p`) 실행을 모두 지원하며, JSON·stream-json 출력으로 스크립트와 CI 자동화에 활용할 수 있다. OpenAI 호환·Anthropic·Gemini·Vertex AI 등 여러 모델 프로토콜을 settings.json의 modelProviders로 구성하고 `/model`로 런타임 전환한다. 계층형 메모리(QWEN.md), MCP 도구 연결, 서브에이전트·스킬, 세션 체크포인트/되감기, 커스텀 슬래시 명령 등을 제공한다. 기존 Qwen OAuth 무료 등급은 2026-04-15에 종료되어, 현재는 Alibaba ModelStudio 또는 서드파티 API 키로 인증한다.",
    "install": "Node.js 22 이상이 필요하다. npm으로 전역 설치하는 것이 기본이다: `npm install -g @qwen-code/qwen-code@latest`. macOS/Linux는 Homebrew(`brew install qwen-code`)나 설치 스크립트로 standalone 설치할 수 있고, Windows는 PowerShell 설치 스크립트를 사용한다. 설치 후 프로젝트 폴더에서 `qwen`으로 실행한다.",
    "auth": "첫 실행 시 또는 세션 안에서 `/auth`로 인증을 설정한다(별칭 `/connect`, `/login`). 메뉴는 세 가지다: Alibaba ModelStudio(Coding Plan·Token Plan·Standard API Key), 서드파티 프로바이더(DeepSeek·MiniMax·Z.AI·ModelScope·OpenRouter·Requesty 등), Custom Provider(OpenAI·Anthropic·Gemini 호환 엔드포인트). 키는 환경변수로 주입한다: OpenAI 호환은 `OPENAI_API_KEY`/`OPENAI_BASE_URL`/`OPENAI_MODEL`, Dashscope는 `DASHSCOPE_API_KEY`, Anthropic은 `ANTHROPIC_API_KEY`, Gemini는 `GEMINI_API_KEY`. settings.json의 modelProviders로 프로토콜·모델을 정의하고 `/model`로 전환하며, 우선순위는 CLI 플래그 > 시스템 env > .env > settings.json env 순이다. 현재 인증·환경 상태는 `/doctor`로 확인한다. 참고: 기존 `qwen auth` CLI 명령은 제거되었고 Qwen OAuth 무료 등급은 2026-04-15에 종료되었다.",
    "commands": [
      {
        "command": "qwen",
        "description": "대화형 세션을 시작한다. 프로젝트 폴더에서 실행하면 환영 화면과 최근 대화가 표시되고 `/help`로 명령을 볼 수 있다.",
        "example": "qwen",
        "category": "실행"
      },
      {
        "command": "qwen -p / --prompt",
        "description": "헤드리스(비대화) 모드로 단일 프롬프트를 실행한다. 스크립트·CI·배치 처리에 적합하며 stdin 파이프 입력도 지원한다.",
        "example": "qwen -p \"Explain this code\"",
        "category": "실행"
      },
      {
        "command": "qwen --output-format / -o",
        "description": "출력 형식을 지정한다(text 기본, json, stream-json). json/stream-json은 프로그램적 파싱과 실시간 모니터링에 쓴다.",
        "example": "qwen -p \"query\" --output-format json",
        "category": "실행"
      },
      {
        "command": "qwen --model",
        "description": "이번 실행에 사용할 모델 ID를 지정한다.",
        "example": "qwen --model \"qwen3-coder-plus\"",
        "category": "실행"
      },
      {
        "command": "qwen --continue",
        "description": "현재 프로젝트의 가장 최근 세션을 이어받아 실행한다(헤드리스에서도 사용 가능).",
        "example": "qwen --continue -p \"Run the tests again and summarize failures\"",
        "category": "세션·체크포인트"
      },
      {
        "command": "qwen --resume [sessionId]",
        "description": "특정 세션 ID를 재개한다(미지정 시 대화형 선택). 대화 기록·도구 출력·압축 체크포인트를 복원한다.",
        "example": "qwen --resume 123e4567 -p \"Apply the follow-up refactor\"",
        "category": "세션·체크포인트"
      },
      {
        "command": "qwen --yolo / -y",
        "description": "모든 도구 호출(셸·쓰기·편집 포함)을 자동 승인한다. 샌드박스를 켜지 않으므로 신뢰·격리 환경에서만 사용한다.",
        "example": "qwen -p \"Migrate callbacks to async/await in src/\" --yolo",
        "category": "실행"
      },
      {
        "command": "qwen --approval-mode",
        "description": "도구 승인 모드를 설정한다(plan/default/auto_edit/auto/yolo).",
        "example": "qwen -p \"query\" --approval-mode auto_edit",
        "category": "실행"
      },
      {
        "command": "qwen --include-directories",
        "description": "컨텍스트에 추가 디렉터리를 포함한다(쉼표 구분).",
        "example": "qwen -p \"Explain this schema\" --include-directories src,docs",
        "category": "실행"
      },
      {
        "command": "qwen --max-session-turns / --max-wall-time / --max-tool-calls",
        "description": "무인 실행 예산을 건다. 각각 턴 수, 벽시계 시간, 누적 도구 호출 수를 제한해 폭주를 방지한다.",
        "example": "qwen -p \"...\" --max-session-turns 30 --max-wall-time 10m",
        "category": "실행"
      },
      {
        "command": "qwen sessions list",
        "description": "최근 대화 세션을 메타데이터와 함께 나열한다. JSON Lines 출력과 개수 제한을 지원한다.",
        "example": "qwen sessions list --json --limit 50",
        "category": "세션·체크포인트"
      },
      {
        "command": "qwen serve",
        "description": "HTTP+SSE로 공유 에이전트를 띄우는 데몬을 실행한다(실험적).",
        "example": "qwen serve",
        "category": "실행"
      },
      {
        "command": "/help",
        "description": "사용 가능한 명령에 대한 도움말을 표시한다(별칭 `/?`).",
        "example": "/help",
        "category": "도움말·정보"
      },
      {
        "command": "/mcp",
        "description": "구성된 MCP 서버와 도구를 나열한다. 설명 표시/숨김과 스키마 보기를 지원한다.",
        "example": "/mcp desc",
        "category": "도구·모델"
      },
      {
        "command": "/tools",
        "description": "현재 사용 가능한 도구 목록을 표시한다. `desc`로 각 도구 설명을 함께 본다.",
        "example": "/tools desc",
        "category": "도구·모델"
      },
      {
        "command": "/model",
        "description": "현재 세션의 모델을 전환한다. `--fast`는 프롬프트 제안용 경량 모델, `--voice`는 음성 전사 모델을 지정한다.",
        "example": "/model --fast qwen3-coder-flash",
        "category": "도구·모델"
      },
      {
        "command": "/approval-mode",
        "description": "현재 세션의 도구 승인 모드를 변경한다(plan/default/auto-edit/auto/yolo).",
        "example": "/approval-mode auto-edit",
        "category": "도구·모델"
      },
      {
        "command": "/agents",
        "description": "서브에이전트를 관리한다(생성·관리). 작업을 위임할 보조 에이전트를 다룬다.",
        "example": "/agents manage",
        "category": "도구·모델"
      },
      {
        "command": "/skills",
        "description": "사용 가능한 번들 스킬을 나열하고 실행한다.",
        "example": "/skills",
        "category": "도구·모델"
      },
      {
        "command": "/plan",
        "description": "플랜 모드로 전환하거나 종료한다. 분석·계획만 하고 실행은 하지 않는 안전 검토 모드다.",
        "example": "/plan",
        "category": "도구·모델"
      },
      {
        "command": "/memory",
        "description": "메모리 매니저 다이얼로그를 연다. QWEN.md 계층 메모리에서 로드된 지침 컨텍스트를 관리한다.",
        "example": "/memory",
        "category": "메모리·컨텍스트"
      },
      {
        "command": "/init",
        "description": "현재 디렉터리를 분석해 초기 컨텍스트 파일(QWEN.md)을 생성한다.",
        "example": "/init",
        "category": "메모리·컨텍스트"
      },
      {
        "command": "/context",
        "description": "컨텍스트 윈도우 사용량 내역을 보여준다. `detail`로 항목별 사용량을 본다.",
        "example": "/context detail",
        "category": "메모리·컨텍스트"
      },
      {
        "command": "/directory",
        "description": "멀티 디렉터리 워크스페이스를 관리한다(별칭 `/dir`).",
        "example": "/dir add ./src,./tests",
        "category": "설정"
      },
      {
        "command": "/settings",
        "description": "설정 편집기를 연다(.qwen/settings.json).",
        "example": "/settings",
        "category": "설정"
      },
      {
        "command": "/compress",
        "description": "대화 기록을 요약으로 치환해 토큰을 절약한다(별칭 `/summarize`, 파괴적).",
        "example": "/compress",
        "category": "세션·체크포인트"
      },
      {
        "command": "/clear",
        "description": "대화 기록을 초기화하고 컨텍스트를 비운다(별칭 `/reset`, `/new`).",
        "example": "/clear",
        "category": "세션·체크포인트"
      },
      {
        "command": "/restore",
        "description": "도구 호출이 실행되기 직전 체크포인트로 프로젝트 파일을 되돌린다.",
        "example": "/restore",
        "category": "세션·체크포인트"
      },
      {
        "command": "/rewind",
        "description": "대화를 이전 턴으로 되감는다(별칭 `/rollback`).",
        "example": "/rewind",
        "category": "세션·체크포인트"
      },
      {
        "command": "/export",
        "description": "세션 기록을 파일로 내보낸다(html·md·json·jsonl).",
        "example": "/export md",
        "category": "세션·체크포인트"
      },
      {
        "command": "/stats",
        "description": "인터랙티브 사용 통계 대시보드를 연다(별칭 `/usage`).",
        "example": "/stats model",
        "category": "도움말·정보"
      },
      {
        "command": "/status",
        "description": "버전 정보를 표시한다(별칭 `/about`). `/status paths`로 세션 파일·로그 경로를 본다.",
        "example": "/status",
        "category": "도움말·정보"
      },
      {
        "command": "/theme",
        "description": "Qwen Code 비주얼 테마를 변경한다.",
        "example": "/theme",
        "category": "인터페이스"
      },
      {
        "command": "/vim",
        "description": "입력창의 Vim 편집 모드를 켜고 끈다.",
        "example": "/vim",
        "category": "인터페이스"
      },
      {
        "command": "/language",
        "description": "언어 설정을 보거나 변경한다(ui 인터페이스 언어, output LLM 출력 언어).",
        "example": "/language output Chinese",
        "category": "인터페이스"
      },
      {
        "command": "/auth",
        "description": "인증 방식을 대화형으로 변경한다(별칭 `/connect`, `/login`).",
        "example": "/auth",
        "category": "인증"
      },
      {
        "command": "/doctor",
        "description": "설치·환경·인증 상태를 진단한다. memory, cpu-profile, rollback 하위 명령을 지원한다.",
        "example": "/doctor",
        "category": "인증"
      },
      {
        "command": "/quit",
        "description": "Qwen Code를 즉시 종료한다(별칭 `/exit`).",
        "example": "/quit",
        "category": "도움말·정보"
      },
      {
        "command": "@<path>",
        "description": "지정한 파일 내용을 주입하거나 디렉터리 내 텍스트 파일을 재귀적으로 읽어 대화에 추가한다.",
        "example": "@src/main.py Please explain this code",
        "category": "컨텍스트 주입"
      },
      {
        "command": "!<command>",
        "description": "하위 셸에서 시스템 명령을 실행한다. 단독 `!`는 셸 모드를 토글한다.",
        "example": "!git status",
        "category": "셸"
      }
    ],
    "features": [
      {
        "title": "대화형 + 헤드리스 실행",
        "body": "리치 렌더링 TUI와 `qwen -p` 헤드리스 모드를 모두 지원한다. text·json·stream-json 출력과 stdin 파이프, 일관된 종료 코드로 스크립트·CI/CD 파이프라인에 통합할 수 있다."
      },
      {
        "title": "다중 모델 프로바이더",
        "body": "OpenAI 호환·Anthropic·Gemini·Vertex AI 프로토콜을 settings.json의 modelProviders로 정의하고, OpenAI·OpenRouter·ModelScope·Requesty·Azure 등 다양한 엔드포인트를 연결해 `/model`로 런타임 전환한다."
      },
      {
        "title": "계층형 메모리(QWEN.md)",
        "body": "전역·프로젝트 컨텍스트 파일을 자동 로드하는 계층 메모리를 제공한다. `/init`로 초기 파일을 만들고 `/memory`로 관리한다."
      },
      {
        "title": "MCP 통합",
        "body": "Model Context Protocol로 외부 도구·DB·API를 연결한다. `/mcp`로 서버·도구·연결 상태를 확인하고, MCP가 노출한 프롬프트를 슬래시 명령으로 호출할 수 있다."
      },
      {
        "title": "세션·체크포인트",
        "body": "세션 재개(`--continue`/`--resume`), 도구 실행 전 파일 복원(`/restore`), 대화 되감기(`/rewind`), 내보내기(`/export`), 세션 목록(`qwen sessions list`)을 제공한다."
      },
      {
        "title": "승인 모드 & 샌드박스",
        "body": "plan·default·auto-edit·auto·yolo 5단계 승인 모드와 샌드박스(`--sandbox`) 격리 실행을 지원해 자동화 수준과 안전성을 상황에 맞게 조절한다."
      },
      {
        "title": "서브에이전트·스킬",
        "body": "`/agents` 서브에이전트와 `/skills` 번들 스킬로 작업을 위임·확장한다."
      },
      {
        "title": "커스텀 슬래시 명령",
        "body": "`~/.qwen/commands`(전역) 또는 프로젝트 `.qwen/commands`에 Markdown 파일로 슬래시 명령을 정의한다. {{args}} 파라미터, !{cmd} 셸 실행, @{file} 파일 주입을 지원한다."
      },
      {
        "title": "무인 실행 안전장치",
        "body": "`--max-session-turns`·`--max-wall-time`·`--max-tool-calls` 예산으로 폭주를 제한해 장기 CI 작업을 안전하게 지킨다."
      }
    ],
    "tips": [
      "Qwen OAuth 무료 등급은 2026-04-15에 종료됐다. `/auth`에서 Alibaba ModelStudio나 서드파티 프로바이더(OpenRouter 등)로 전환하라.",
      "헤드리스 자동화는 `--output-format json`으로 받은 뒤 jq로 파싱하고, 실시간 모니터링은 `--output-format stream-json`을 쓴다.",
      "비밀키는 settings.json의 env(평문)보다 `.qwen/.env`나 셸 export를 권장한다. 우선순위는 CLI 플래그 > 시스템 env > .env > settings.json env 순이다.",
      "`--yolo`는 샌드박스를 켜지 않으므로, 신뢰 환경이 아니면 `--sandbox`와 턴·시간 예산을 함께 지정해 안전하게 돌려라.",
      "`/model --fast qwen3-coder-flash`처럼 빠르고 저렴한 보조 모델을 지정하면 프롬프트 제안이 빨라진다.",
      "`/compress`(=`/summarize`)는 대화 기록을 파괴적으로 압축하니, 보존이 필요하면 내보내기(`/export`) 후 사용하라.",
      "Qwen Code는 필요한 파일을 알아서 읽으므로, 특정 파일만 강조하려면 `@경로`로 주입한다.",
      "Node.js 22 이상이 필요하다. standalone 설치본은 문제가 생기면 `/doctor rollback`으로 이전 버전으로 되돌릴 수 있다.",
      "`qwen auth` CLI는 제거됐다. 인증 설정은 세션 안에서 `/auth`, 상태 점검은 `/doctor`로 한다.",
      "Tab 자동완성, `/` 입력 시 전체 슬래시 명령 표시, ↑로 명령 히스토리, `?`로 단축키 목록을 빠르게 확인할 수 있다."
    ],
    "sourceUrls": [
      "https://github.com/QwenLM/qwen-code",
      "https://qwenlm.github.io/qwen-code-docs/en/users/features/commands/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/configuration/auth/"
    ]
  },

  {
    "id": "cli-manual-claude-code",
    "slug": "claude-code",
    "platform": "Claude Code",
    "tagline": "터미널에서 코드베이스를 직접 다루는 Anthropic 공식 AI 코딩 에이전트",
    "overview": "Claude Code는 Anthropic의 공식 터미널 기반 AI 코딩 에이전트(CLI)다. 자연어로 지시하면 코드베이스를 직접 읽고, 파일을 수정하고, 셸 명령과 테스트를 실행하며, git/PR까지 처리하는 에이전트 루프를 갖췄다. CLAUDE.md 메모리, hooks, MCP 서버, subagents, skills, plan mode로 깊게 커스터마이즈할 수 있어, 큰 코드베이스를 다루는 개발자나 CI/스크립트에 AI를 끼워 넣으려는 팀에게 적합하다.",
    "install": "권장 설치는 네이티브 인스톨러(백그라운드 자동 업데이트 지원)다.\n\nmacOS / Linux / WSL:\n  curl -fsSL https://claude.ai/install.sh | bash\n\nWindows PowerShell:\n  irm https://claude.ai/install.ps1 | iex\n\nHomebrew(macOS): brew install --cask claude-code  (수동 업데이트: brew upgrade claude-code)\nWinGet(Windows): winget install Anthropic.ClaudeCode\nnpm(Node.js 18+): npm install -g @anthropic-ai/claude-code   (sudo 금지)\nLinux 패키지: apt / dnf / apk 서명 저장소 제공\n\n요구사항: macOS 13+, Windows 10 1809+, Ubuntu 20.04+/Debian 10+/Alpine 3.19+, RAM 4GB+, x64 또는 ARM64. 설치 후 `claude --version`과 `claude doctor`로 확인. 업데이트는 `claude update`. 네이티브 설치는 자동 업데이트되며 `autoUpdatesChannel`을 \"latest\"(기본)나 \"stable\"로 둘 수 있다.",
    "auth": "Claude Code는 Pro, Max, Team, Enterprise, 또는 Console(API) 계정이 필요하다(무료 Claude.ai 플랜은 사용 불가). 설치 후 `claude`를 실행하면 브라우저 로그인 흐름이 뜬다. 또는 `claude auth login`(이메일 미리채움 --email, SSO 강제 --sso, API 종량과금은 --console), 세션 안에서는 슬래시 명령 `/login`을 쓴다. 인증 상태는 `claude auth status`, 로그아웃은 `claude auth logout` 또는 `/logout`.\n\nCI/스크립트용으로는 `claude setup-token`으로 장기 OAuth 토큰을 발급하거나 ANTHROPIC_API_KEY 환경변수를 쓴다. Amazon Bedrock(CLAUDE_CODE_USE_BEDROCK=1), Google Vertex AI(CLAUDE_CODE_USE_VERTEX=1), Microsoft Foundry 같은 서드파티 프로바이더도 지원하며 각각 `/setup-bedrock`, `/setup-vertex` 마법사가 있다. MCP 서버의 OAuth 인증은 세션 내 `/mcp` 또는 `claude mcp login <name>`으로 처리한다.",
    "commands": [
      {
        "command": "claude",
        "description": "대화형 세션 시작. 뒤에 \"질문\"을 붙이면 초기 프롬프트와 함께 시작한다.",
        "example": "claude \"이 프로젝트 구조 설명해줘\"",
        "category": "세션"
      },
      {
        "command": "claude -p, --print",
        "description": "비대화형(헤드리스) 모드: 한 번 실행하고 결과만 출력 후 종료. CI·스크립트·파이프에 사용.",
        "example": "claude -p \"auth.py의 버그를 찾아 고쳐줘\" --allowedTools \"Read,Edit,Bash\"",
        "category": "자동화"
      },
      {
        "command": "claude -c, --continue",
        "description": "현재 디렉터리의 가장 최근 대화를 이어서 시작.",
        "example": "claude -c -p \"이제 DB 쿼리에 집중해줘\"",
        "category": "세션"
      },
      {
        "command": "claude -r, --resume [session]",
        "description": "세션 ID 또는 이름으로 특정 대화 재개. 인자가 없으면 선택 picker를 연다.",
        "example": "claude --resume auth-refactor \"이 PR 마무리해줘\"",
        "category": "세션"
      },
      {
        "command": "claude update",
        "description": "최신 버전으로 즉시 업데이트(백그라운드 자동 업데이트를 기다리지 않음).",
        "example": "claude update",
        "category": "자동화"
      },
      {
        "command": "claude mcp",
        "description": "MCP 서버 추가/조회/삭제 등 관리. add/list/get/remove/add-json 서브명령 제공.",
        "example": "claude mcp add --transport http notion https://mcp.notion.com/mcp",
        "category": "MCP"
      },
      {
        "command": "claude doctor",
        "description": "설치·설정 상태를 진단하고 문제를 점검. 세션 내 `/doctor`와 동일.",
        "example": "claude doctor",
        "category": "자동화"
      },
      {
        "command": "claude --permission-mode <mode>",
        "description": "권한 모드로 시작: default, acceptEdits, plan, auto, dontAsk, bypassPermissions.",
        "example": "claude --permission-mode plan",
        "category": "승인/권한"
      },
      {
        "command": "claude --dangerously-skip-permissions",
        "description": "모든 권한 프롬프트를 건너뜀(=bypassPermissions). 컨테이너·VM 등 격리 환경에서만 사용. root/sudo로는 거부됨.",
        "example": "claude --dangerously-skip-permissions",
        "category": "승인/권한"
      },
      {
        "command": "claude --allowedTools \"...\"",
        "description": "프롬프트 없이 실행 허용할 도구 지정. 권한 규칙 문법(예: Bash(git diff *)) 지원.",
        "example": "claude -p \"테스트 돌리고 실패 고쳐\" --allowedTools \"Bash,Read,Edit\"",
        "category": "승인/권한"
      },
      {
        "command": "claude --output-format <fmt>",
        "description": "헤드리스 출력 형식: text(기본), json(세션ID·비용 메타 포함), stream-json(NDJSON 실시간 스트리밍).",
        "example": "claude -p \"이 프로젝트 요약\" --output-format json | jq -r '.result'",
        "category": "자동화"
      },
      {
        "command": "claude --json-schema '<schema>'",
        "description": "JSON Schema에 맞춘 구조화 출력을 받음(헤드리스 전용). 결과는 structured_output 필드에 담김.",
        "example": "claude -p \"함수명 추출\" --output-format json --json-schema '{\"type\":\"object\",...}'",
        "category": "자동화"
      },
      {
        "command": "claude --bare",
        "description": "hooks·skills·plugins·MCP·auto memory·CLAUDE.md 자동 탐색을 건너뛰어 빠르게 시작. CI에서 재현성 확보용.",
        "example": "claude --bare -p \"이 파일 요약\" --allowedTools \"Read\"",
        "category": "자동화"
      },
      {
        "command": "claude --model <model>, --effort <level>",
        "description": "세션 모델(sonnet/opus/haiku/fable 또는 풀네임)과 추론 강도(low/medium/high/xhigh/max) 지정.",
        "example": "claude --model opus --effort high",
        "category": "세션"
      },
      {
        "command": "claude --mcp-config <file|json>, --strict-mcp-config",
        "description": "JSON 파일/문자열에서 MCP 서버 로드. --strict-mcp-config면 다른 MCP 설정을 무시하고 이것만 사용.",
        "example": "claude --strict-mcp-config --mcp-config ./mcp.json",
        "category": "MCP"
      },
      {
        "command": "claude --append-system-prompt \"...\"",
        "description": "기본 시스템 프롬프트 뒤에 추가 지시 덧붙임. --system-prompt는 전체 교체, *-file 변형은 파일에서 로드.",
        "example": "gh pr diff 123 | claude -p --append-system-prompt \"보안 엔지니어로서 취약점 검토\"",
        "category": "자동화"
      },
      {
        "command": "claude -w, --worktree [name]",
        "description": "격리된 git worktree(<repo>/.claude/worktrees/<name>)에서 시작. #번호나 PR URL을 주면 해당 PR을 가져옴.",
        "example": "claude -w feature-auth",
        "category": "자동화"
      },
      {
        "command": "/init",
        "description": "코드베이스를 분석해 시작용 CLAUDE.md를 생성. CLAUDE_CODE_NEW_INIT=1이면 skills·hooks까지 안내하는 대화형 흐름.",
        "example": "/init",
        "category": "메모리"
      },
      {
        "command": "/memory",
        "description": "CLAUDE.md·CLAUDE.local.md·rules 파일을 보고 편집, auto memory 토글 및 항목 확인.",
        "example": "/memory",
        "category": "메모리"
      },
      {
        "command": "/clear [name]",
        "description": "컨텍스트를 비우고 새 대화 시작(프로젝트 메모리는 유지). 이전 대화는 /resume에 남음. 별칭 /reset, /new.",
        "example": "/clear",
        "category": "세션"
      },
      {
        "command": "/compact [instructions]",
        "description": "지금까지의 대화를 요약해 컨텍스트를 확보. 요약 초점 지시를 붙일 수 있음.",
        "example": "/compact 인증 관련만 남겨줘",
        "category": "세션"
      },
      {
        "command": "/context [all]",
        "description": "컨텍스트 윈도우 사용량을 색상 그리드로 시각화하고 최적화 제안을 표시.",
        "example": "/context",
        "category": "세션"
      },
      {
        "command": "/resume [session]",
        "description": "ID·이름으로 대화 재개하거나 picker를 엶. 백그라운드 세션은 bg 표시. 별칭 /continue.",
        "example": "/resume",
        "category": "세션"
      },
      {
        "command": "/rewind",
        "description": "코드·대화를 이전 체크포인트로 되돌리거나 특정 메시지부터 요약. 별칭 /checkpoint, /undo.",
        "example": "/rewind",
        "category": "세션"
      },
      {
        "command": "/agents",
        "description": "subagent 구성을 관리하는 탭형 인터페이스(생성·편집·도구/모델 설정, 실행 중 목록).",
        "example": "/agents",
        "category": "도구"
      },
      {
        "command": "/mcp [reconnect|enable|disable]",
        "description": "MCP 서버 연결·OAuth 인증 관리. 인자 없이 대화형 목록, reconnect <서버>로 재연결.",
        "example": "/mcp",
        "category": "MCP"
      },
      {
        "command": "/hooks",
        "description": "도구 이벤트에 대한 hook 구성을 확인.",
        "example": "/hooks",
        "category": "도구"
      },
      {
        "command": "/skills",
        "description": "사용 가능한 skill 목록. t로 토큰순 정렬, Space로 노출 토글 후 Enter로 저장.",
        "example": "/skills",
        "category": "도구"
      },
      {
        "command": "/permissions",
        "description": "allow/ask/deny 권한 규칙을 대화형으로 관리(스코프별 조회, 작업 디렉터리, 최근 거부 검토). 별칭 /allowed-tools.",
        "example": "/permissions",
        "category": "승인/권한"
      },
      {
        "command": "/plan [description]",
        "description": "plan mode로 진입(편집 없이 조사·계획 제시). 설명을 붙이면 그 작업으로 바로 시작.",
        "example": "/plan 인증 버그 고쳐",
        "category": "승인/권한"
      },
      {
        "command": "/model [model]",
        "description": "모델을 전환하고 새 세션 기본값으로 저장. 인자 없으면 picker, 행에서 s를 누르면 현재 세션만 변경.",
        "example": "/model opus",
        "category": "세션"
      },
      {
        "command": "/config [key=value]",
        "description": "설정 UI를 열거나(테마·모델·output style 등) key=value로 직접 설정. -p에서도 동작. 별칭 /settings.",
        "example": "/config theme=dark",
        "category": "세션"
      },
      {
        "command": "/usage",
        "description": "세션 비용·플랜 사용량 한도·활동 통계 표시(스킬/서브에이전트/플러그인/MCP별 분해 포함). 별칭 /cost, /stats.",
        "example": "/usage",
        "category": "세션"
      },
      {
        "command": "/code-review [level] [--fix] [--comment] [target]",
        "description": "현재 diff를 정확성 버그·정리 관점에서 리뷰(번들 skill). --fix로 적용, --comment로 PR 인라인 코멘트, ultra로 클라우드 멀티에이전트 리뷰.",
        "example": "/code-review high --fix",
        "category": "도구"
      },
      {
        "command": "/review [PR]",
        "description": "GitHub PR을 번호로 읽기전용 리뷰(code-review와 같은 엔진). 인자 없으면 열린 PR 목록.",
        "example": "/review 456",
        "category": "도구"
      },
      {
        "command": "/security-review",
        "description": "현재 브랜치의 미커밋 변경을 보안 취약점(인젝션·인증·데이터 노출) 관점에서 분석.",
        "example": "/security-review",
        "category": "도구"
      },
      {
        "command": "/add-dir <path>",
        "description": "현재 세션에 파일 접근용 작업 디렉터리 추가(해당 디렉터리의 .claude/skills는 예외적으로 로드됨).",
        "example": "/add-dir ../shared-lib",
        "category": "도구"
      },
      {
        "command": "/diff",
        "description": "미커밋 변경과 턴별 diff를 보는 대화형 뷰어를 엶.",
        "example": "/diff",
        "category": "도구"
      },
      {
        "command": "/doctor",
        "description": "설치·설정을 진단하고 상태 아이콘으로 표시. f를 누르면 Claude가 보고된 문제를 고침.",
        "example": "/doctor",
        "category": "자동화"
      },
      {
        "command": "/plugin [subcommand]",
        "description": "플러그인 관리. 인자 없이 메뉴, list/install/enable/disable 직접 실행.",
        "example": "/plugin install code-review@claude-plugins-official",
        "category": "도구"
      },
      {
        "command": "/background [prompt], /fork <directive>",
        "description": "/background는 현재 세션을 백그라운드 에이전트로 분리(별칭 /bg). /fork는 대화 전체를 상속한 포크 서브에이전트를 스폰해 병렬 진행.",
        "example": "/fork 테스트 커버리지 올려줘",
        "category": "자동화"
      },
      {
        "command": "claude --add-dir <paths...>",
        "description": "메인 작업 디렉터리 외 추가 디렉터리에 읽기/편집 권한 부여. 영구 적용은 permissions.additionalDirectories 설정.",
        "example": "claude --add-dir ../apps ../lib",
        "category": "도구"
      }
    ],
    "features": [
      {
        "title": "CLAUDE.md 메모리와 자동 메모리",
        "body": "CLAUDE.md는 매 세션 시작에 로드되는 영구 지시 파일이다. 스코프는 관리정책(OS별 시스템 경로) > 사용자(~/.claude/CLAUDE.md) > 프로젝트(./CLAUDE.md 또는 ./.claude/CLAUDE.md) > 로컬(./CLAUDE.local.md, .gitignore 권장) 순으로 누적된다. `@path/to/file` 문법으로 다른 파일(예: @AGENTS.md, @package.json)을 최대 4단계까지 임포트할 수 있고, 채팅에서 '이거 기억해'라고 하면 Claude가 알아서 저장한다. v2.1.59+의 auto memory는 Claude가 빌드 명령·디버깅 인사이트·선호를 ~/.claude/projects/<project>/memory/MEMORY.md에 스스로 적어 둔다. 팁: 200줄 이하로 유지하고 구체적으로 쓸수록('Format properly' 대신 '2-space indent') 준수율이 높다. 특정 파일 타입에만 적용할 규칙은 .claude/rules/ 디렉터리에 paths frontmatter로 분리하면 컨텍스트를 아낀다."
      },
      {
        "title": "Hooks - 라이프사이클 이벤트 자동화",
        "body": "hooks는 settings.json의 hooks 키에 이벤트별로 등록하는 셸/HTTP/MCP/prompt/agent 콜백이다. 주요 이벤트: PreToolUse(도구 실행 전, 차단 가능), PostToolUse/PostToolUseFailure(후처리), UserPromptSubmit, Stop/SubagentStop, PreCompact/PostCompact, SessionStart/SessionEnd/Setup, Notification, FileChanged 등. PreToolUse는 matcher(예: \"Bash\", \"Edit|Write\", 정규식)로 필터하고, exit code 2(stderr를 Claude에 보여주며 차단)나 JSON 출력의 permissionDecision: \"allow\"/\"deny\"/\"ask\"로 결정을 제어한다. CLAUDE.md는 '권고'지만 hook은 Claude의 판단과 무관하게 강제 실행되므로, '커밋 전 항상 lint' 같은 결정적 규칙은 반드시 hook으로 구현하라. 보안 주의: hook은 당신의 셸·환경변수·자격증명을 그대로 상속하므로 신뢰하는 스크립트만 등록한다. 조직은 allowManagedHooksOnly로 사용자/플러그인 hook을 차단할 수 있다."
      },
      {
        "title": "MCP 서버 연동",
        "body": "MCP(Model Context Protocol)로 GitHub·Sentry·Postgres·Figma·Notion 등 외부 도구를 연결한다. 추가는 `claude mcp add --transport http|sse|stdio <name> <url|-- command>` 형식이며 stdio는 `--` 뒤에 실행 명령을 둔다(예: `claude mcp add --transport stdio db -- npx -y @bytebase/dbhub --dsn ...`). 스코프는 local(기본, ~/.claude.json·나만), project(.mcp.json·팀 공유, 첫 사용 시 승인 필요), user(전 프로젝트). OAuth 인증은 세션 내 `/mcp` 또는 `claude mcp login <name>`. MCP 리소스는 `@server:protocol://resource/path`로 참조하고, 서버가 노출한 프롬프트는 `/mcp__<서버>__<프롬프트>` 슬래시 명령으로 쓴다. 기본으로 Tool Search가 켜져 있어 도구 정의를 지연 로드하므로 서버를 많이 붙여도 컨텍스트 부담이 적다. .mcp.json은 ${VAR}/${VAR:-default} 환경변수 확장을 지원해 API 키를 안전하게 공유할 수 있다."
      },
      {
        "title": "Subagents - 격리된 전문 에이전트",
        "body": "subagent는 별도 컨텍스트 윈도우·시스템 프롬프트·도구 권한을 가진 보조 에이전트로, 검색·로그·파일 내용으로 메인 대화를 더럽히지 않고 요약만 돌려준다. 내장 에이전트로 Explore(Haiku 기반 읽기전용 코드 탐색), Plan(plan mode 조사), general-purpose(전 도구·복합 작업)가 있다. 커스텀은 `/agents`로 만들거나 .claude/agents/<name>.md(프로젝트) 또는 ~/.claude/agents/(사용자)에 YAML frontmatter(name, description, tools, model, permissionMode, hooks, skills, isolation 등)+마크다운 본문으로 정의한다. tools 필드로 도구를 제한하고 model로 Haiku 같은 빠른/저렴한 모델에 라우팅해 비용을 줄인다. Claude는 description을 보고 위임 시점을 판단하므로 설명을 명확히 쓰는 게 핵심. isolation: worktree로 저장소 사본에서 독립 작업도 가능하다."
      },
      {
        "title": "Skills와 커스텀 슬래시 명령",
        "body": "skill은 SKILL.md(YAML frontmatter + 마크다운)로 정의하는 재사용 절차로, 같은 지시·체크리스트를 반복 붙여넣을 때 만든다. 위치는 개인(~/.claude/skills/), 프로젝트(.claude/skills/), 플러그인. 디렉터리명이 곧 `/skill-name` 명령이 되고, description으로 Claude가 자동 호출 시점을 판단한다. 커스텀 커맨드(.claude/commands/*.md)도 skill로 통합되어 동일하게 동작한다. frontmatter로 disable-model-invocation(수동 전용), user-invocable(메뉴 노출), allowed-tools(무프롬프트 도구), context: fork(서브에이전트에서 실행), paths(특정 파일에서만 활성)를 제어한다. $ARGUMENTS·$1·$name으로 인자를, `` !`command` ``로 셸 출력을 프롬프트에 미리 주입한다. CLAUDE.md와 달리 본문은 호출될 때만 로드되어 평소엔 토큰을 거의 안 먹는다. 번들 skill로 /code-review, /debug, /loop, /run, /verify, /batch 등이 기본 제공된다."
      },
      {
        "title": "Plan mode와 권한 모드",
        "body": "권한 모드는 Claude가 행동 전 묻는 빈도를 정한다. default(읽기만 무프롬프트), acceptEdits(파일 편집·mkdir/mv/cp 등 자동 승인), plan(읽기만 하며 편집 없이 조사·계획 제시), auto(분류기 모델이 백그라운드로 안전성 검사하며 대부분 자동 실행), dontAsk(미리 허용한 도구만, CI 잠금용), bypassPermissions(전부 건너뜀, 격리 환경 전용). 전환은 세션 중 Shift+Tab 순환(default→acceptEdits→plan)이나 시작 시 --permission-mode, 영구 적용은 settings.json의 permissions.defaultMode. plan mode는 큰 변경 전에 추천: Claude가 계획을 내면 'auto로 승인/편집 수락하며 승인/수동 검토하며 승인/계속 계획'을 고를 수 있고 Ctrl+G로 계획을 에디터에서 직접 편집한다. bypassPermissions에서도 .git·.claude 등 protected paths 쓰기와 명시적 ask 규칙은 여전히 막힌다."
      },
      {
        "title": "헤드리스 모드(claude -p)로 자동화",
        "body": "`claude -p \"질문\"`은 비대화형으로 한 번 실행 후 종료해 CI·스크립트·파이프에 적합하다. stdin을 읽으므로 `git diff main | claude -p \"오타 린터로 검토\"`처럼 파이프하고 `> out.txt`로 리다이렉트한다. --output-format json이면 result·session_id·total_cost_usd 메타가 붙고, --json-schema로 스키마 강제 구조화 출력을 받는다(jq로 파싱). --allowedTools나 --permission-mode acceptEdits/dontAsk로 무프롬프트 실행을, --max-turns·--max-budget-usd로 안전 상한을 건다. CI에서는 --bare로 로컬 hooks/MCP/CLAUDE.md를 무시해 머신 간 동일 결과를 보장하라(인증은 ANTHROPIC_API_KEY 필요). 대화 이어가기는 --continue, 특정 세션은 `session_id=$(claude -p ... --output-format json | jq -r .session_id)` 후 --resume \"$session_id\"."
      },
      {
        "title": "세션·체크포인트·백그라운드 작업",
        "body": "모든 세션은 디스크에 저장되어 `/resume`·`claude -r`로 재개되고 `--name`/`/rename`으로 라벨을 단다. `/rewind`(별칭 /undo, /checkpoint)는 코드와 대화를 이전 지점으로 롤백해 잘못된 변경을 안전하게 되돌린다. `/branch`는 현재 대화를 분기해 다른 방향을 실험하고 원본은 보존한다. 긴 작업은 `/background`(또는 claude --bg)로 백그라운드 에이전트로 분리해 터미널을 비우고 `claude agents`로 모니터링한다. `/batch`는 큰 변경을 5~30개 독립 단위로 쪼개 각각 git worktree에서 병렬 실행하고 PR을 연다. `/context`로 컨텍스트 사용처를 점검하고, 길어지면 `/compact`로 요약해 윈도우를 확보한다(프로젝트 루트 CLAUDE.md는 compaction 후 자동 재주입됨)."
      }
    ],
    "tips": [
      "plan mode부터 시작하라: 큰 변경은 Shift+Tab으로 plan mode에 들어가 Claude가 계획을 내게 하고, 검토 후 승인하면 그때부터 편집을 시작한다. 잘못된 방향으로 코드를 갈아엎는 사고를 막는다.",
      "결정적 규칙은 CLAUDE.md가 아니라 hook으로 박아라. CLAUDE.md는 '권고'라 항상 지켜지지 않는다. '커밋 전 lint', 'rm -rf 차단' 같은 강제 규칙은 PreToolUse hook에 두면 Claude 판단과 무관하게 실행된다.",
      "컨텍스트가 길어지면 /context로 어디서 토큰이 새는지 보고, 작업 전환 시 /clear(메모리 유지하며 새 대화), 같은 작업 계속이면 /compact(요약)로 정리하라. 탐색이 많은 작업은 Explore 서브에이전트에 맡겨 메인 대화를 깨끗하게 유지한다.",
      "처음 프로젝트에 들어가면 /init으로 CLAUDE.md 초안을 만들고, Claude가 같은 실수를 두 번 하거나 같은 정정을 반복 입력하게 되면 그 내용을 CLAUDE.md(또는 .claude/rules/)에 추가하라 — 그게 메모리를 키우는 신호다.",
      "CI·스크립트에서는 claude -p에 --bare를 붙여 로컬 hooks/MCP/CLAUDE.md 자동 탐색을 끄고 머신 간 동일 결과를 보장하라. 출력은 --output-format json + jq로 파싱하고, --json-schema로 구조를 강제하면 후속 파이프가 안정적이다.",
      "권한 프롬프트가 잦으면 /permissions로 자주 쓰는 읽기전용 명령을 allow 규칙에 추가하거나 /fewer-permission-prompts 스킬로 트랜스크립트를 스캔해 자동 allowlist를 생성하라. bypassPermissions(--dangerously-skip-permissions)는 컨테이너·VM 등 격리 환경에서만.",
      "반복 작업은 skill로 만들어라(.claude/skills/<name>/SKILL.md). 본문은 호출될 때만 로드되어 평소 토큰 비용이 거의 없고, 팀과 공유하려면 .claude/를 버전 관리에 커밋하면 된다.",
      "MCP 서버를 붙일 땐 stdio 명령 앞에 반드시 `--`를 두어 Claude 옵션과 서버 인자를 구분하고, .mcp.json에는 ${API_KEY} 환경변수 확장을 써서 비밀값을 커밋하지 마라. project 스코프 서버는 팀이 공유하되 첫 사용 시 승인 단계를 거친다."
    ],
    "sourceUrls": [
      "https://code.claude.com/docs/en/cli-reference",
      "https://code.claude.com/docs/en/commands",
      "https://code.claude.com/docs/en/skills",
      "https://code.claude.com/docs/en/memory",
      "https://code.claude.com/docs/en/hooks",
      "https://code.claude.com/docs/en/mcp",
      "https://code.claude.com/docs/en/sub-agents",
      "https://code.claude.com/docs/en/permission-modes",
      "https://code.claude.com/docs/en/headless",
      "https://code.claude.com/docs/en/setup"
    ],
    "providerId": "anthropic"
  },
  {
    "id": "cli-manual-openai-codex-cli",
    "slug": "openai-codex-cli",
    "platform": "OpenAI Codex CLI",
    "tagline": "터미널에서 실행되는 OpenAI의 로컬 코딩 에이전트 (Rust 기반, 오픈소스)",
    "overview": "Codex CLI는 OpenAI가 만든, 터미널에서 바로 돌아가는 로컬 코딩 에이전트다. 지정한 디렉터리 안에서 코드를 읽고 수정하고 직접 명령을 실행할 수 있으며, Rust로 작성되어 빠르고 가벼우며 오픈소스(Apache-2.0)다. 대화형 TUI로 페어 프로그래밍을 하고 싶은 개발자, codex exec로 CI/스크립트에 에이전트를 끼워 넣고 싶은 팀, 승인/샌드박스로 자율성과 안전을 정밀하게 통제하고 싶은 사람에게 적합하다.",
    "install": "두 가지 주요 설치 경로가 있다.\n\n1) npm (권장, 크로스 플랫폼):\n   npm install -g @openai/codex\n\n2) Homebrew (macOS):\n   brew install --cask codex\n\n3) 독립 설치 스크립트 (macOS/Linux):\n   curl -fsSL https://chatgpt.com/codex/install.sh | sh\n   비대화형(CI 등) 설치: curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh\n\nWindows는 PowerShell에서 네이티브로 실행하거나 WSL2를 권장한다. 설치 후 codex --version 으로 확인하고, codex update 로 최신 버전을 받을 수 있다.",
    "auth": "처음 codex 를 실행하면 로그인 프롬프트가 뜬다. 두 가지 인증 방식이 있다.\n\n1) ChatGPT 계정 로그인(권장): codex login 을 실행하면 브라우저 OAuth가 열린다. ChatGPT Plus/Pro/Business/Edu/Enterprise 요금제가 필요하다. SSH 등 브라우저가 없는 환경에서는 codex login --device-auth 로 디바이스 코드 플로우를 사용한다.\n\n2) API 키: echo $OPENAI_API_KEY | codex login --with-api-key 처럼 stdin으로 키를 전달하거나, OPENAI_API_KEY 환경변수를 설정한다. 액세스 토큰은 codex login --with-access-token 으로 주입한다.\n\n상태 확인은 codex login status, 로그아웃은 codex logout(세션 내에서는 /logout). 자격증명은 $CODEX_HOME(기본 ~/.codex)에 저장된다.",
    "commands": [
      {
        "command": "codex [PROMPT]",
        "description": "대화형 터미널 UI(TUI)를 실행한다. 프롬프트를 인자로 주면 바로 작업을 시작한다.",
        "example": "codex \"이 레포의 테스트를 통과시켜줘\"",
        "category": "세션"
      },
      {
        "command": "codex exec [PROMPT]",
        "description": "비대화형으로 1회 실행하고 끝나면 종료한다. CI/스크립트/자동화의 핵심. 별칭은 codex e.",
        "example": "codex exec \"changelog를 업데이트해줘\"",
        "category": "자동화"
      },
      {
        "command": "codex exec --json",
        "description": "실행 이벤트를 줄단위 JSON(JSONL)으로 출력해 파이프라인에서 파싱하기 좋다.",
        "example": "codex exec --json \"빌드 고쳐줘\" > events.jsonl",
        "category": "자동화"
      },
      {
        "command": "codex exec --output-last-message, -o PATH",
        "description": "에이전트의 마지막 메시지(최종 요약)를 파일로 기록한다. CI 요약에 유용.",
        "example": "codex exec -o result.md \"PR 요약 작성\"",
        "category": "자동화"
      },
      {
        "command": "codex exec --output-schema PATH",
        "description": "최종 출력이 지정한 JSON Schema를 만족하도록 강제·검증한다.",
        "example": "codex exec --output-schema schema.json \"항목 추출\"",
        "category": "자동화"
      },
      {
        "command": "codex exec --skip-git-repo-check",
        "description": "Git 저장소가 아닌 디렉터리에서도 exec 실행을 허용한다.",
        "example": "codex exec --skip-git-repo-check \"스크립트 작성\"",
        "category": "자동화"
      },
      {
        "command": "codex resume [SESSION_ID]",
        "description": "이전 세션을 ID로 이어서 재개한다. 후속 프롬프트를 함께 줄 수 있다.",
        "example": "codex resume 7f3a... \"방금 작업 이어가\"",
        "category": "세션"
      },
      {
        "command": "codex resume --last",
        "description": "현재 디렉터리의 가장 최근 세션을 재개한다. --all 을 붙이면 모든 디렉터리의 세션을 대상으로 한다.",
        "example": "codex resume --last",
        "category": "세션"
      },
      {
        "command": "codex exec resume -s [SESSION_ID]",
        "description": "비대화형 exec 모드에서 세션을 재개한다(-s/resume). --last, --all, --image도 지원해 자동화에서 상태를 이어간다.",
        "example": "codex exec resume --last \"테스트도 추가해줘\"",
        "category": "자동화"
      },
      {
        "command": "codex fork [SESSION_ID]",
        "description": "기존 세션을 새 스레드로 분기(branch)한다. --last/--all 지원.",
        "example": "codex fork --last",
        "category": "세션"
      },
      {
        "command": "codex archive / unarchive / delete SESSION",
        "description": "세션을 보관(숨김)/복원/영구삭제한다. delete --force 로 확인 없이 삭제.",
        "example": "codex archive 7f3a...",
        "category": "세션"
      },
      {
        "command": "--ask-for-approval, -a {untrusted|on-request|never}",
        "description": "승인 시점을 제어한다. on-request는 필요 시 물어보고, never는 자동 진행, untrusted는 신뢰되지 않은 동작마다 확인.",
        "example": "codex -a on-request \"리팩터링\"",
        "category": "승인/권한"
      },
      {
        "command": "--sandbox, -s {read-only|workspace-write|danger-full-access}",
        "description": "파일/네트워크 권한 경계를 정한다. read-only(suggest), workspace-write(auto-edit), danger-full-access(full-auto)에 대응.",
        "example": "codex -s workspace-write -a on-request \"빌드 수정\"",
        "category": "승인/권한"
      },
      {
        "command": "--dangerously-bypass-approvals-and-sandbox, --yolo",
        "description": "승인과 샌드박스를 모두 건너뛴다(매우 위험). 신뢰하는 레포/일회성 작업에만.",
        "example": "codex --yolo \"전체 포맷팅\"",
        "category": "승인/권한"
      },
      {
        "command": "--add-dir PATH",
        "description": "작업 디렉터리 외의 추가 경로에 쓰기 권한을 부여한다. danger-full-access보다 안전한 범위 확장.",
        "example": "codex --add-dir ../shared \"공유 모듈 수정\"",
        "category": "승인/권한"
      },
      {
        "command": "--model, -m STRING",
        "description": "설정된 기본 모델을 이번 실행에 한해 덮어쓴다.",
        "example": "codex -m gpt-5.5 \"복잡한 버그 조사\"",
        "category": "모델"
      },
      {
        "command": "--config, -c KEY=VALUE",
        "description": "config.toml 값을 일회성으로 오버라이드한다(반복 사용 가능).",
        "example": "codex -c model_reasoning_effort=high \"설계 검토\"",
        "category": "모델"
      },
      {
        "command": "--profile, -p STRING",
        "description": "명명된 설정 프로파일($CODEX_HOME/profile-name.config.toml)을 기본 설정 위에 레이어링한다.",
        "example": "codex -p ci \"테스트 실행\"",
        "category": "모델"
      },
      {
        "command": "--cd, -C PATH",
        "description": "처리 전에 작업 디렉터리를 변경한다.",
        "example": "codex -C ./apps/web \"컴포넌트 추가\"",
        "category": "도구"
      },
      {
        "command": "--image, -i PATH",
        "description": "이미지(스크린샷/디자인 시안)를 프롬프트에 첨부한다. 콤마로 여러 개.",
        "example": "codex -i mock.png \"이 화면 구현\"",
        "category": "도구"
      },
      {
        "command": "--search",
        "description": "라이브 웹 검색을 활성화한다(config의 web_search로도 제어).",
        "example": "codex --search \"최신 API로 마이그레이션\"",
        "category": "도구"
      },
      {
        "command": "--oss",
        "description": "로컬 오픈소스 프로바이더(Ollama)를 사용한다.",
        "example": "codex --oss -m llama3 \"리뷰\"",
        "category": "모델"
      },
      {
        "command": "codex mcp add NAME -- COMMAND...",
        "description": "MCP 서버를 등록한다. stdio는 -- 뒤에 명령, HTTP는 --url, 환경변수는 --env KEY=VALUE.",
        "example": "codex mcp add fs -- npx -y @modelcontextprotocol/server-filesystem .",
        "category": "MCP"
      },
      {
        "command": "codex mcp list / get / remove NAME",
        "description": "등록된 MCP 서버를 나열/조회/삭제한다. HTTP 서버는 mcp login/logout으로 OAuth 인증.",
        "example": "codex mcp list",
        "category": "MCP"
      },
      {
        "command": "codex mcp-server",
        "description": "Codex 자체를 stdio MCP 서버로 노출해 다른 에이전트가 도구로 호출하게 한다.",
        "example": "codex mcp-server",
        "category": "MCP"
      },
      {
        "command": "codex doctor",
        "description": "진단 리포트를 출력해 설정/인증/환경 문제를 점검한다. --json, --summary, --all 지원.",
        "example": "codex doctor --summary",
        "category": "도구"
      },
      {
        "command": "codex features list / enable / disable FEATURE",
        "description": "기능 플래그를 나열하고 config.toml에 영구적으로 켜거나 끈다.",
        "example": "codex features enable goal_mode",
        "category": "도구"
      },
      {
        "command": "codex plugin add / list / remove PLUGIN",
        "description": "플러그인(스킬+앱+MCP 묶음)을 설치/조회/삭제한다. plugin marketplace로 소스 관리.",
        "example": "codex plugin add my-plugin@marketplace",
        "category": "도구"
      },
      {
        "command": "codex cloud [QUERY] / codex apply TASK_ID",
        "description": "Codex Cloud에 작업을 제출/조회하고, 클라우드 작업의 diff를 로컬에 적용한다.",
        "example": "codex apply task_123",
        "category": "자동화"
      },
      {
        "command": "codex completion SHELL",
        "description": "셸 자동완성 스크립트를 생성한다(bash/zsh/fish 등).",
        "example": "codex completion zsh > _codex",
        "category": "도구"
      },
      {
        "command": "/init",
        "description": "세션 내 슬래시 명령. 현재 디렉터리에 AGENTS.md 스캐폴드를 생성한다.",
        "example": "/init",
        "category": "메모리"
      },
      {
        "command": "/model",
        "description": "세션 도중 모델을 전환한다.",
        "example": "/model gpt-5.5",
        "category": "모델"
      },
      {
        "command": "/permissions",
        "description": "세션 중 승인 모드(Auto/Read Only/Full Access 등)를 전환한다.",
        "example": "/permissions",
        "category": "승인/권한"
      },
      {
        "command": "/review",
        "description": "현재 워킹 트리/브랜치/특정 커밋에 대해 코드 리뷰를 요청한다.",
        "example": "/review",
        "category": "도구"
      },
      {
        "command": "/diff",
        "description": "추적되지 않은 파일을 포함한 git diff를 표시한다.",
        "example": "/diff",
        "category": "도구"
      },
      {
        "command": "/compact",
        "description": "대화를 요약·압축해 토큰을 절약하고 컨텍스트를 유지한다.",
        "example": "/compact",
        "category": "세션"
      },
      {
        "command": "/plan",
        "description": "플랜 모드로 전환해 실행 전 계획을 먼저 세운다(선택적 프롬프트 동반).",
        "example": "/plan 마이그레이션 단계 정리",
        "category": "세션"
      },
      {
        "command": "/mcp",
        "description": "구성된 MCP 서버와 도구 목록을 표시한다.",
        "example": "/mcp",
        "category": "MCP"
      },
      {
        "command": "/skills",
        "description": "작업별 스킬을 탐색하고 사용한다($skill-name 형태로도 호출).",
        "example": "/skills",
        "category": "도구"
      },
      {
        "command": "/hooks",
        "description": "라이프사이클 훅(PreToolUse/PostToolUse/SessionStart 등)을 조회·관리한다.",
        "example": "/hooks",
        "category": "도구"
      },
      {
        "command": "/status / /usage",
        "description": "세션 설정·토큰 사용량과 계정 사용량/레이트리밋 리셋을 표시한다.",
        "example": "/status",
        "category": "세션"
      },
      {
        "command": "/new / /clear / /resume",
        "description": "같은 CLI 세션에서 새 대화 시작, 터미널 초기화, 저장된 대화 복원.",
        "example": "/new",
        "category": "세션"
      }
    ],
    "features": [
      {
        "title": "승인 모드 3단계 (suggest / auto-edit / full-auto)",
        "body": "자율성과 안전을 한 축으로 묶어 제어한다. suggest는 읽기 전용(--sandbox read-only)으로 계획만 제안하고, auto-edit는 작업 디렉터리 내 파일 편집은 자동이되 셸 명령은 승인을 요구하며, full-auto는 네트워크 포함 전권을 위임한다. --ask-for-approval(-a)과 --sandbox(-s)를 조합해 표현하고, 세션 중에는 /permissions로 즉시 전환한다. 실무 기본값은 -s workspace-write -a on-request 조합이 가장 균형 잡혀 있다."
      },
      {
        "title": "codex exec 헤드리스 자동화",
        "body": "codex exec(별칭 e)는 TUI 없이 1회 실행 후 종료하므로 CI/크론/스크립트에 그대로 끼울 수 있다. --json으로 이벤트를 JSONL 스트림으로 받고 --output-last-message로 최종 요약을 파일에 저장하면 파이프라인에서 진행상황과 결과를 함께 다룰 수 있다. --output-schema로 출력 구조를 강제하면 후속 단계에서 안전하게 파싱된다. Git 저장소가 아니면 --skip-git-repo-check가 필요하다."
      },
      {
        "title": "AGENTS.md 계층형 커스텀 지시",
        "body": "Codex는 작업 전에 AGENTS.md를 읽어 일관된 규칙을 주입한다. 전역(~/.codex/AGENTS.md)부터 Git 루트 → 현재 디렉터리까지 각 레벨의 파일을 루트에서 아래로 빈 줄로 이어붙여 병합하므로, 작업 디렉터리에 가까운 파일이 뒤에 와서 앞 지침을 덮어쓴다. 같은 레벨에서 AGENTS.override.md가 AGENTS.md보다 우선해, 공유 규칙을 지우지 않고 임시 오버라이드를 둘 수 있다. 합산 크기는 project_doc_max_bytes(기본 32 KiB)에서 잘린다. /init로 스캐폴드를 만들 수 있다."
      },
      {
        "title": "MCP(Model Context Protocol) 연동",
        "body": "외부 도구를 MCP 서버로 붙여 Codex의 능력을 확장한다. codex mcp add NAME -- COMMAND...로 stdio 서버를, --url로 HTTP 서버를 등록하고, HTTP 서버는 codex mcp login NAME으로 OAuth 인증한다. config.toml의 [mcp_servers.<id>] 테이블에서 command/args/env/url과 enabled_tools/disabled_tools 허용·차단 목록을 세밀하게 지정할 수 있다. 반대로 codex mcp-server로 Codex 자체를 다른 에이전트의 MCP 도구로 노출하는 양방향 통합도 가능하다."
      },
      {
        "title": "세션 resume / fork / 자동 컴팩션",
        "body": "긴 작업을 끊김 없이 이어간다. codex resume [ID] 또는 --last로 직전 세션을 복원하고(--all은 디렉터리 무관), codex exec resume -s로 자동화에서도 상태를 잇는다. codex fork는 기존 대화를 새 스레드로 분기해 실험적 변형을 안전하게 시도하게 한다. 컨텍스트 한계에 가까워지면 자동 컴팩션이 작동하며, 수동으로 /compact를 호출해 토큰을 절약할 수도 있다."
      },
      {
        "title": "config.toml 중심 설정 + 프로파일",
        "body": "대부분의 기본값은 ~/.codex/config.toml에서 상속된다. model, model_reasoning_effort(minimal~xhigh), approval_policy, sandbox_mode, sandbox_workspace_write(network_access·writable_roots 등), web_search, [mcp_servers.*], [model_providers.*]를 선언한다. -c KEY=VALUE로 일회성 오버라이드하고, --profile(-p)로 $CODEX_HOME/profile-name.config.toml을 레이어링해 작업 맥락(예: ci, review)별 설정을 분리한다."
      },
      {
        "title": "라이프사이클 훅 & 플러그인/스킬",
        "body": "config.toml의 [hooks]에 PreToolUse/PostToolUse/SessionStart 같은 이벤트 매처를 걸어 도구 실행 전후에 자동 동작을 끼울 수 있고, 세션 중 /hooks로 조회·관리한다. 플러그인은 스킬·앱 통합·MCP 설정을 한 번에 묶은 설치형 번들로 codex plugin add로 설치하고 marketplace로 소스를 관리한다. 재사용 가능한 스킬은 $skill-name 구문으로 호출하며 /skills에서 탐색한다."
      },
      {
        "title": "플랜 모드 · 코드 리뷰 · 멀티모달",
        "body": "/plan으로 실행 전에 계획을 먼저 세우는 플랜 모드를 켜면 큰 변경의 방향을 잡기 좋다. /review는 워킹 트리·베이스 브랜치·특정 커밋을 별도 리뷰 에이전트로 점검한다. 이미지 입력(-i 또는 --image)으로 스크린샷·디자인 시안을 첨부해 UI 작업을 지시하고, --search로 라이브 웹 검색을 켜 최신 API 변경에 대응할 수 있다. 컴포저에서 @로 워크스페이스 파일을 퍼지 검색해 빠르게 첨부한다."
      }
    ],
    "tips": [
      "가장 안전하고 실용적인 기본 조합은 codex -s workspace-write -a on-request 다. full-auto/--yolo는 신뢰하는 레포의 일회성 작업에만 쓰고, 디렉터리 확장이 필요하면 danger-full-access 대신 --add-dir로 범위를 좁혀라.",
      "팀 규칙은 프로젝트 루트 AGENTS.md에, 개인 선호는 ~/.codex/AGENTS.md에 두고, 임시 변경은 AGENTS.override.md로 분리하라. 지침이 의도대로 로드되는지는 codex --ask-for-approval never \"Summarize the current instructions.\"로 검증할 수 있다.",
      "CI에서는 codex exec --json --output-last-message result.md 조합이 좋다. JSONL로 진행 이벤트를 로깅하고 마지막 메시지를 요약 파일로 받아 PR 코멘트나 알림에 그대로 쓸 수 있다.",
      "컨텍스트가 길어지면 자동 컴팩션을 기다리지 말고 적절한 시점에 /compact를 직접 호출하라. 긴 멀티스텝 작업은 codex resume --last로 이어가면 토큰과 맥락을 모두 아낄 수 있다.",
      "모델/추론 강도는 작업에 맞춰 -m과 -c model_reasoning_effort=high(또는 xhigh)로 일회성 조정하고, 반복되는 설정은 --profile로 ci·review 같은 프로파일로 분리해 관리하라.",
      "설정이나 인증이 꼬이면 codex doctor --summary로 먼저 진단하라. MCP 서버는 codex mcp list로 상태를 확인하고, HTTP 서버는 codex mcp login NAME으로 OAuth를 다시 태워라.",
      "실험적 변형이 필요하면 메인 대화를 망치지 말고 codex fork(또는 /fork)로 분기해서 시도하라. 가벼운 곁다리 질문은 /side(/btw)로 임시 대화에서 처리하면 본 세션 컨텍스트가 오염되지 않는다."
    ],
    "sourceUrls": [
      "https://developers.openai.com/codex/cli",
      "https://developers.openai.com/codex/cli/reference",
      "https://developers.openai.com/codex/cli/features",
      "https://developers.openai.com/codex/cli/slash-commands",
      "https://developers.openai.com/codex/guides/agents-md",
      "https://developers.openai.com/codex/config-reference",
      "https://developers.openai.com/codex/changelog?type=codex-cli",
      "https://github.com/openai/codex"
    ],
    "providerId": "openai"
  },
  {
    "id": "cli-manual-gemini-cli",
    "slug": "gemini-cli",
    "platform": "Gemini CLI",
    "tagline": "터미널에서 바로 쓰는 구글의 오픈소스 AI 코딩 에이전트",
    "overview": "Gemini CLI는 구글이 만든 오픈소스 AI 에이전트로, Gemini 모델을 터미널에서 직접 사용해 코드 작성·디버깅·리팩터링·파일 조작·쉘 명령 실행을 수행한다. ReAct 루프와 내장 도구(파일 읽기/쓰기, grep, 쉘, 웹 검색/가져오기)에 더해 MCP 서버, 확장(extensions), 서브에이전트, 스킬, 훅으로 무한 확장된다. 개인 구글 계정 로그인만으로 넉넉한 무료 한도를 제공하므로 터미널 중심 개발자, CI 자동화 엔지니어, MCP/에이전트 워크플로를 구축하려는 팀에 특히 적합하다.",
    "install": "Node.js 20 이상이 필요하다. 영구 설치 없이 바로 실행하려면 `npx https://github.com/google-gemini/gemini-cli` 또는 `npx @google/gemini-cli`. npm 전역 설치는 `npm install -g @google/gemini-cli`, macOS Homebrew는 `brew install gemini-cli`, MacPorts는 `sudo port install gemini-cli`. 설치 후 프로젝트 폴더에서 `gemini`를 실행하면 대화형 세션이 시작된다. Google Cloud Shell/Cloud Workstations에는 기본 탑재되어 있다. npm 전역 설치 후 `command not found`가 나면 npm 전역 bin 경로를 PATH에 추가한다.",
    "auth": "세 가지 인증 방식을 지원한다. (1) Login with Google(권장): `gemini` 실행 후 \"Login with Google\"을 선택하면 브라우저 OAuth 창이 열리고, 개인 구글 계정으로 로그인하면 자격증명이 로컬 캐시되며 무료 한도를 즉시 사용할 수 있다. 회사/학교(Workspace) 계정, Gemini Code Assist 라이선스, AI Ultra for Business는 `GOOGLE_CLOUD_PROJECT` 지정이 필요하다. (2) Gemini API Key: Google AI Studio(aistudio.google.com/app/apikey)에서 키를 발급받아 `export GEMINI_API_KEY=\"...\"`로 설정. (3) Vertex AI: `export GOOGLE_CLOUD_PROJECT=\"...\"`와 `export GOOGLE_CLOUD_LOCATION=\"us-central1\"`을 설정한 뒤 ADC(`gcloud auth application-default login`), 서비스 계정 키(`GOOGLE_APPLICATION_CREDENTIALS=/path/keyfile.json`), 또는 `GOOGLE_API_KEY` 중 하나를 사용한다. 환경변수는 `~/.gemini/.env`에 넣어 영구 적용할 수 있고, 실행 중 인증 방식 전환은 `/auth` 명령으로 한다.",
    "commands": [
      {
        "command": "gemini",
        "description": "대화형 세션 시작. 현재 디렉터리를 작업 컨텍스트로 삼는다.",
        "example": "gemini",
        "category": "세션"
      },
      {
        "command": "gemini -p \"<프롬프트>\"",
        "description": "비대화형(헤드리스) 실행. 결과만 출력하고 종료해 스크립트/CI에 적합하다.",
        "example": "gemini -p \"이 레포의 README를 요약해줘\"",
        "category": "자동화"
      },
      {
        "command": "gemini -i \"<프롬프트>\"",
        "description": "프롬프트를 먼저 실행한 뒤 대화형 모드로 이어간다(--prompt-interactive).",
        "example": "gemini -i \"버그 원인부터 찾아줘\"",
        "category": "세션"
      },
      {
        "command": "cat file | gemini -p \"<프롬프트>\"",
        "description": "stdin으로 파이프 입력을 받아 처리한다(로그 분석, 코드 리뷰 자동화).",
        "example": "git diff | gemini -p \"이 diff를 리뷰해줘\"",
        "category": "자동화"
      },
      {
        "command": "gemini -o json|stream-json",
        "description": "출력 형식 지정. json은 response/stats/error 단일 객체, stream-json은 JSONL 이벤트 스트림(--output-format).",
        "example": "gemini -p \"버전 올려줘\" -o json",
        "category": "자동화"
      },
      {
        "command": "gemini --approval-mode <mode>",
        "description": "승인 정책 설정: default(매번 확인), auto_edit(편집 자동 승인), yolo(전부 자동), plan(읽기 전용 계획).",
        "example": "gemini --approval-mode auto_edit",
        "category": "승인/권한"
      },
      {
        "command": "gemini -y",
        "description": "모든 액션 자동 승인(YOLO). --approval-mode yolo로 대체 권장. 격리 환경에서만 사용.",
        "example": "gemini -y -p \"테스트 통과시켜줘\"",
        "category": "승인/권한"
      },
      {
        "command": "gemini -m <model>",
        "description": "사용할 모델 지정(기본 auto). gemini-2.5-pro, gemini-2.5-flash 등.",
        "example": "gemini -m gemini-2.5-flash",
        "category": "세션"
      },
      {
        "command": "gemini -s",
        "description": "샌드박스 환경에서 도구 실행(파일/쉘 작업 격리, --sandbox).",
        "example": "gemini -s -p \"의존성 업데이트해줘\"",
        "category": "승인/권한"
      },
      {
        "command": "gemini --include-directories <경로,...>",
        "description": "작업 컨텍스트에 추가 디렉터리를 포함(멀티 디렉터리 워크스페이스).",
        "example": "gemini --include-directories ../shared,../api",
        "category": "도구"
      },
      {
        "command": "gemini -e <ext,...> / -l",
        "description": "사용할 확장 지정(--extensions), -l/--list-extensions로 설치된 확장 목록 출력.",
        "example": "gemini -l",
        "category": "확장"
      },
      {
        "command": "gemini -r / --resume",
        "description": "이전 세션을 이어서 재개한다. --list-sessions로 목록, --session-id로 특정 세션 지정.",
        "example": "gemini --list-sessions",
        "category": "세션"
      },
      {
        "command": "gemini -w",
        "description": "새 git worktree에서 실행해 작업을 격리한다(--worktree).",
        "example": "gemini -w -p \"리팩터링 시도\"",
        "category": "자동화"
      },
      {
        "command": "gemini mcp add <name> <cmd|url> [args]",
        "description": "MCP 서버 등록. --transport(stdio/sse/http), --env, --header, --trust, --include-tools, --exclude-tools 옵션.",
        "example": "gemini mcp add github npx -y @modelcontextprotocol/server-github",
        "category": "MCP"
      },
      {
        "command": "gemini mcp list | remove | enable | disable",
        "description": "등록된 MCP 서버 조회/삭제/활성화/비활성화.",
        "example": "gemini mcp list",
        "category": "MCP"
      },
      {
        "command": "gemini extensions install <git-url|--path>",
        "description": "확장 설치. Git URL 또는 로컬 경로에서 MCP/명령/컨텍스트/서브에이전트 등을 묶어 설치.",
        "example": "gemini extensions install https://github.com/gemini-cli-extensions/workspace",
        "category": "확장"
      },
      {
        "command": "/help 또는 /?",
        "description": "사용 가능한 명령과 도움말 표시.",
        "example": "/help",
        "category": "세션"
      },
      {
        "command": "/auth",
        "description": "인증 방식(Google/API key/Vertex)을 세션 중 변경.",
        "example": "/auth",
        "category": "승인/권한"
      },
      {
        "command": "/chat save|resume|list|delete|share <tag>",
        "description": "대화 체크포인트 저장/복원/목록/삭제, share로 Markdown·JSON 내보내기.",
        "example": "/chat save refactor-wip",
        "category": "세션"
      },
      {
        "command": "/clear",
        "description": "터미널 화면과 스크롤백을 지운다(Ctrl+L).",
        "example": "/clear",
        "category": "세션"
      },
      {
        "command": "/compress",
        "description": "전체 대화 컨텍스트를 요약본으로 치환해 토큰 사용량을 줄인다.",
        "example": "/compress",
        "category": "메모리"
      },
      {
        "command": "/memory show|refresh|add",
        "description": "GEMINI.md로 로드된 계층 메모리 확인(show)/재로딩(refresh)/내용 추가(add).",
        "example": "/memory refresh",
        "category": "메모리"
      },
      {
        "command": "/init",
        "description": "현재 디렉터리를 분석해 맞춤형 GEMINI.md 컨텍스트 파일을 생성한다.",
        "example": "/init",
        "category": "메모리"
      },
      {
        "command": "/mcp list|auth|schema|enable|disable|refresh",
        "description": "MCP 서버/도구 목록, OAuth 인증(auth <서버>), 스키마 보기, 활성화 토글, 도구 재탐색.",
        "example": "/mcp auth github",
        "category": "MCP"
      },
      {
        "command": "/tools [desc|nodesc]",
        "description": "현재 사용 가능한 도구 목록 표시(상세 설명 토글).",
        "example": "/tools desc",
        "category": "도구"
      },
      {
        "command": "/extensions list|install|update|enable|disable|uninstall",
        "description": "세션 내 확장 관리.",
        "example": "/extensions list",
        "category": "확장"
      },
      {
        "command": "/restore [tool_call_id]",
        "description": "도구 실행 직전 스냅샷으로 파일과 대화 상태를 되돌린다(checkpointing 활성화 필요).",
        "example": "/restore",
        "category": "도구"
      },
      {
        "command": "/plan [copy]",
        "description": "읽기 전용 Plan Mode로 전환해 실행 전 계획을 검토(copy로 승인된 계획 복사).",
        "example": "/plan",
        "category": "승인/권한"
      },
      {
        "command": "/agents list|reload|enable|disable|config",
        "description": "서브에이전트 관리. 특정 작업을 전담시켜 메인 컨텍스트를 보호한다.",
        "example": "/agents list",
        "category": "도구"
      },
      {
        "command": "/skills list|enable|disable|reload",
        "description": "Agent Skills 활성화/비활성화 및 재탐색.",
        "example": "/skills list",
        "category": "도구"
      },
      {
        "command": "/hooks list|enable|disable|panel",
        "description": "라이프사이클 이벤트 훅(자동 검사/포맷/정책 강제) 관리.",
        "example": "/hooks list",
        "category": "자동화"
      },
      {
        "command": "/directory add|show (/dir)",
        "description": "멀티 디렉터리 워크스페이스에 디렉터리 추가/목록 표시.",
        "example": "/directory add ../shared",
        "category": "도구"
      },
      {
        "command": "/stats [session|model|tools]",
        "description": "세션 통계: 사용 시간, 토큰 수/쿼터, 도구별 메트릭.",
        "example": "/stats model",
        "category": "세션"
      },
      {
        "command": "/settings",
        "description": "설정 편집기를 열어 settings.json 구성을 관리한다.",
        "example": "/settings",
        "category": "세션"
      },
      {
        "command": "/permissions trust [경로]",
        "description": "폴더 신뢰(folder trust) 관리. 신뢰 폴더는 확인 절차를 완화한다.",
        "example": "/permissions trust .",
        "category": "승인/권한"
      },
      {
        "command": "/copy",
        "description": "마지막 출력을 클립보드로 복사(Linux는 xclip/xsel, macOS pbcopy, Windows clip 필요).",
        "example": "/copy",
        "category": "세션"
      },
      {
        "command": "@<경로>",
        "description": "파일/디렉터리 내용을 프롬프트에 주입. git-ignore된 파일은 기본 제외.",
        "example": "@src/index.ts 이 파일 리팩터링해줘",
        "category": "도구"
      },
      {
        "command": "!<command> 또는 ! (단독)",
        "description": "쉘 명령 직접 실행 / 단독 입력 시 쉘 모드 토글.",
        "example": "!git status",
        "category": "도구"
      },
      {
        "command": "/quit 또는 /exit [--delete]",
        "description": "CLI 종료. --delete는 세션 기록과 임시 파일을 영구 삭제.",
        "example": "/quit",
        "category": "세션"
      },
      {
        "command": "/vim",
        "description": "vim 모드(NORMAL/INSERT, count 접두) 토글.",
        "example": "/vim",
        "category": "세션"
      },
      {
        "command": "/bug",
        "description": "Gemini CLI 관련 GitHub 이슈를 작성한다.",
        "example": "/bug",
        "category": "세션"
      }
    ],
    "features": [
      {
        "title": "GEMINI.md 계층형 컨텍스트 메모리",
        "body": "GEMINI.md 파일을 전역(~/.gemini/GEMINI.md), 프로젝트 루트와 상위 디렉터리, 하위 디렉터리의 3계층으로 자동 로드해 코딩 컨벤션·아키텍처·페르소나를 모델에 주입한다. `@./file.md` import 문법으로 큰 규칙을 모듈로 쪼개 재사용할 수 있고, `/init`로 현재 코드베이스에 맞는 초안을 자동 생성한 뒤 다듬는 것이 효율적이다. `/memory show`로 실제 주입된 내용을 검증하고, 파일 수정 후엔 `/memory refresh`로 재로딩한다. settings.json의 `context.fileName`을 `[\"AGENTS.md\", \"GEMINI.md\"]`처럼 지정하면 표준 AGENTS.md와도 호환된다."
      },
      {
        "title": "MCP 서버로 도구 생태계 확장",
        "body": "settings.json의 `mcpServers` 블록 또는 `gemini mcp add`로 외부 도구를 연결한다. 로컬은 command/args/cwd(stdio), 원격은 httpUrl/url과 headers를 쓰며, `trust: true`로 확인 절차를 생략하거나 `includeTools`/`excludeTools`로 노출 도구를 필터링한다. 원격 서버는 401 응답을 감지해 자동 OAuth를 시작하고 토큰을 `~/.gemini/mcp-oauth-tokens.json`에 안전 저장한다(`/mcp auth <서버>`). MCP 서버가 제공하는 Prompt는 `/poem-writer --title=\"...\"`처럼 슬래시 명령으로 바로 노출된다."
      },
      {
        "title": "체크포인트와 /restore 안전 되돌리기",
        "body": "checkpointing을 켜면 AI 도구가 파일을 수정하기 직전에 작업 디렉터리의 Git 스냅샷과 대화 상태를 함께 저장한다. 실험이 잘못되면 `/restore`로 파일과 대화 메모리를 스냅샷 시점으로 즉시 되돌리고 원래 도구 프롬프트가 다시 나타난다. v0.11.0부터 `--checkpointing` 플래그가 제거되어 settings.json에서만 활성화하며, 스냅샷은 shadow repository에, 대화 기록은 `~/.gemini/tmp/<project_hash>/checkpoints`의 JSON에 로컬 저장된다. 위험한 대규모 리팩터링 전에 반드시 켜두는 것을 권장한다."
      },
      {
        "title": "확장(Extensions)으로 워크플로 패키징",
        "body": "확장은 MCP 서버, 커스텀 명령, 컨텍스트 파일, 테마, 훅, 서브에이전트, 스킬, 도구 제외 규칙을 gemini-extension.json 매니페스트 하나로 묶어 배포한다. `gemini extensions install <git-url>` 또는 `--path`로 로컬에서 설치하고, list/update/enable/disable/uninstall로 관리한다. geminicli.com/extensions의 갤러리에서 공식·커뮤니티 확장을 탐색할 수 있어 팀 표준 도구 세트를 한 번에 배포하기 좋다."
      },
      {
        "title": "Plan Mode 읽기 전용 계획 수립",
        "body": "`/plan` 또는 `--approval-mode plan`으로 읽기 전용 모드에 진입하면 codebase_investigator·cli_help 같은 내장 리서치 서브에이전트가 코드베이스를 조사해 실행 계획만 제시하고 파일은 건드리지 않는다. 도구 제약은 정책 엔진의 내장 plan.toml(Tier 1)로 강제되며, `~/.gemini/policies/`에 사용자 정책(Tier 2)을 추가해 규칙을 커스터마이즈할 수 있다. 계획을 검토·승인한 뒤 실행 모드로 전환하면 안전하게 변경을 적용할 수 있어, 위험도 높은 작업의 사전 합의에 유용하다."
      },
      {
        "title": "서브에이전트·스킬·훅 자동화",
        "body": "서브에이전트는 깊은 코드베이스 분석, 문서 조회, 도메인 추론 같은 복잡한 작업을 메인 컨텍스트를 어지럽히지 않고 전담한다(`/agents`). Agent Skills(`/skills`)는 특정 작업 유형에 대한 접근 방식을 커스터마이즈하고, 훅(`/hooks`)은 특정 라이프사이클 이벤트(예: Plan Mode 진입/이탈, 도구 실행 전후)를 가로채 포맷팅·검증·정책 강제 같은 동작을 자동 삽입한다. 이 셋을 조합하면 팀 규칙을 코드로 강제하는 자율 워크플로를 구성할 수 있다."
      },
      {
        "title": "헤드리스 모드와 CI 자동화",
        "body": "`-p`로 비대화형 실행하거나 비-TTY 환경에서 자동 진입하며, stdin 파이프(`git diff | gemini -p \"리뷰해줘\"`)를 받는다. `-o json`은 response/stats/error 단일 객체, `-o stream-json`은 init·message·tool_use·tool_result·result 이벤트의 JSONL을 반환해 파이프라인 파싱이 쉽다. 종료 코드(0 성공, 1 일반 오류, 42 입력 오류, 53 턴 한도 초과)로 CI에서 분기할 수 있고, `--approval-mode auto_edit`와 `-s` 샌드박스를 조합하면 자동 수정 잡을 안전하게 돌릴 수 있다."
      },
      {
        "title": "커스텀 슬래시 명령(TOML)",
        "body": "`~/.gemini/commands/`(전역) 또는 `<project>/.gemini/commands/`(프로젝트)에 .toml 파일을 두면 새 슬래시 명령이 된다. `test.toml`은 `/test`, `git/commit.toml`은 네임스페이스 명령 `/git:commit`이 되며, prompt 안에서 인자 치환을 지원한다. 자주 쓰는 프롬프트(릴리스 노트 생성, 컨벤셔널 커밋 메시지 작성 등)를 명령으로 박제해 팀과 git으로 공유하면 일관된 워크플로를 강제할 수 있다. `/commands reload`로 변경을 즉시 반영한다."
      },
      {
        "title": "내장 도구와 @ 파일·! 쉘 통합",
        "body": "파일 읽기/쓰기/편집, grep, glob, 쉘 실행, 웹 검색·웹 가져오기, 메모리 저장 등의 내장 도구를 ReAct 루프로 자동 조합한다. `@src/`로 파일·디렉터리를 컨텍스트에 주입하면 git-ignore된 파일은 기본 제외되고, `!git status`로 쉘 명령을 직접 실행하거나 단독 `!`로 쉘 모드를 토글한다. `/tools desc`로 사용 가능한 도구와 설명을 확인하고, 위험 도구는 settings.json의 정책이나 확장의 excludeTools로 차단할 수 있다."
      }
    ],
    "tips": [
      "위험한 대규모 변경 전엔 settings.json에서 checkpointing을 켜고 `/restore`로 언제든 되돌릴 수 있게 해둔다. v0.11.0부터 `--checkpointing` 플래그는 제거되어 설정 파일에서만 활성화된다.",
      "토큰을 아끼려면 긴 세션에서 `/compress`로 대화를 요약본으로 치환하고, `/stats model`로 토큰·쿼터를 주기적으로 확인한다.",
      "팀 컨벤션은 GEMINI.md에 정리하고 `@./rules/*.md` import로 모듈화한다. settings.json의 `context.fileName`에 AGENTS.md를 추가하면 다른 에이전트 도구와 규칙 파일을 공유할 수 있다.",
      "CI에선 `-o json`/`-o stream-json`으로 구조화 출력을 받고 종료 코드(42=입력 오류, 53=턴 한도)로 분기한다. 자동 수정 잡은 `--approval-mode auto_edit`에 `-s` 샌드박스를 함께 써 격리한다.",
      "원격 MCP 서버는 401을 만나면 자동 OAuth가 뜨므로 `/mcp auth <서버>`로 한 번만 로그인하면 토큰이 캐시된다. 신뢰할 수 있는 내부 서버만 `trust: true`로 확인 절차를 생략한다.",
      "처음 보는 코드베이스는 `--approval-mode plan`(또는 `/plan`)으로 읽기 전용 계획부터 받아 검토한 뒤 실행 모드로 전환하면 사고를 막을 수 있다.",
      "자주 쓰는 프롬프트는 `~/.gemini/commands/*.toml`로 커스텀 슬래시 명령을 만들어 두고, 프로젝트 `.gemini/commands/`에 두면 git으로 팀과 공유된다.",
      "`-y`(전면 자동 승인)는 반드시 샌드박스나 일회용 컨테이너에서만 사용하고, 평소엔 default 또는 auto_edit 승인 모드를 권장한다."
    ],
    "sourceUrls": [
      "https://github.com/google-gemini/gemini-cli",
      "https://geminicli.com/docs/",
      "https://geminicli.com/docs/get-started/installation/",
      "https://geminicli.com/docs/get-started/authentication/",
      "https://geminicli.com/docs/reference/commands/",
      "https://geminicli.com/docs/cli/gemini-md/",
      "https://geminicli.com/docs/cli/checkpointing/",
      "https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md",
      "https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/index.md",
      "https://geminicli.com/docs/cli/plan-mode/",
      "https://geminicli.com/docs/core/subagents/",
      "https://geminicli.com/docs/cli/custom-commands/",
      "https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/headless.md",
      "https://www.npmjs.com/package/@google/gemini-cli",
      "https://toolsbase.dev/en/reference/gemini-cli-commands"
    ],
    "providerId": "google"
  },
  {
    "id": "cli-manual-cursor",
    "slug": "cursor",
    "platform": "Cursor",
    "tagline": "AI 에이전트로 소프트웨어를 만드는 AI 코드 에디터",
    "overview": "Cursor는 VS Code를 기반으로 만들어진 AI 네이티브 코드 에디터로, Tab 자동완성, Cmd+K 인라인 편집, 그리고 멀티파일을 자율적으로 수정하는 Agent(Composer)를 한 화면에 통합한다. 2026년 기준 Cursor 2.0/3.x 라인은 에이전트 중심 UI, git worktree 기반 병렬 에이전트, 격리 VM에서 도는 Cloud Agent, 터미널/CI에서 쓰는 cursor-agent CLI까지 갖췄다. 기존 코드베이스를 빠르게 이해하고 리팩터링하거나, 여러 작업을 병렬로 위임하고 싶은 실무 개발자/팀에게 특히 잘 맞는다.",
    "install": "에디터는 cursor.com에서 macOS/Windows/Linux 설치 파일을 받아 설치한다(VS Code 설정/확장 자동 임포트 지원). 터미널/CI용 cursor-agent CLI는 별도 설치한다.\n\nmacOS / Linux / WSL:\n  curl https://cursor.com/install -fsS | bash\n\nWindows PowerShell:\n  irm 'https://cursor.com/install?win32=true' | iex\n\n설치 후 `agent` 로 대화형 세션을, `agent update` 로 최신 버전 갱신을 실행한다.",
    "auth": "에디터: 처음 실행 시 우상단 또는 Settings에서 Cursor 계정으로 로그인(이메일/Google/GitHub). 로그인하면 Pro/Team 등 플랜에 따른 모델 사용량과 클라우드 기능이 활성화된다.\n\nCLI: `cursor-agent login` 으로 브라우저 인증을 거치고, `cursor-agent status`(또는 `whoami`)로 인증 상태를 확인한다. 로그아웃은 `cursor-agent logout`.\n\n자동화/CI: 대시보드(cursor.com/dashboard)에서 발급한 API 키를 `CURSOR_API_KEY` 환경변수로 주입하거나 `--api-key <key>` 플래그로 전달하면 비대화형 실행이 가능하다.",
    "commands": [
      {
        "command": "cursor-agent login",
        "description": "브라우저 기반으로 Cursor 계정에 인증한다.",
        "example": "cursor-agent login",
        "category": "인증"
      },
      {
        "command": "cursor-agent logout",
        "description": "로그아웃하고 저장된 인증 정보를 삭제한다.",
        "example": "",
        "category": "인증"
      },
      {
        "command": "cursor-agent status / whoami",
        "description": "현재 인증 상태와 계정/엔드포인트 정보를 확인한다. --format json 지원.",
        "example": "cursor-agent status --format json",
        "category": "인증"
      },
      {
        "command": "agent [prompt...]",
        "description": "기본(Agent) 모드로 대화형 세션을 시작한다. 프롬프트를 함께 주면 바로 작업을 시작한다.",
        "example": "agent \"refactor the auth module to use JWT\"",
        "category": "세션"
      },
      {
        "command": "agent ls",
        "description": "이전 채팅 세션 목록을 열어 골라서 재개한다.",
        "example": "agent ls",
        "category": "세션"
      },
      {
        "command": "agent resume / --resume [chatId]",
        "description": "가장 최근(또는 특정 ID) 채팅 세션을 이어간다.",
        "example": "agent --resume=\"chat-id\"",
        "category": "세션"
      },
      {
        "command": "--continue",
        "description": "직전 세션을 이어간다(--resume=-1의 별칭).",
        "example": "agent --continue \"keep going\"",
        "category": "세션"
      },
      {
        "command": "create-chat",
        "description": "빈 채팅을 새로 만들고 그 ID를 반환한다(자동화용).",
        "example": "agent create-chat",
        "category": "세션"
      },
      {
        "command": "-p, --print",
        "description": "비대화형(헤드리스) 모드로 응답을 콘솔에 출력한다. 스크립트/CI용.",
        "example": "agent -p \"Review code changes\"",
        "category": "자동화"
      },
      {
        "command": "--output-format <text|json|stream-json>",
        "description": "출력 형식을 지정한다. 프로그램 파싱은 json/stream-json 사용.",
        "example": "agent -p --output-format json \"summarize diff\"",
        "category": "자동화"
      },
      {
        "command": "--stream-partial-output",
        "description": "텍스트 델타 단위로 부분 출력을 실시간 스트리밍한다.",
        "example": "agent -p --output-format stream-json --stream-partial-output \"...\"",
        "category": "자동화"
      },
      {
        "command": "-f, --force / --yolo",
        "description": "명시적으로 거부된 것 외 모든 명령 실행을 자동 허용한다(확인 프롬프트 없음).",
        "example": "agent -p --force \"fix the failing test\"",
        "category": "승인/권한"
      },
      {
        "command": "--sandbox <enabled|disabled>",
        "description": "샌드박스 모드로 명령 실행을 제한할지 설정한다.",
        "example": "agent --sandbox enabled",
        "category": "승인/권한"
      },
      {
        "command": "--trust",
        "description": "헤드리스 모드에서 워크스페이스를 프롬프트 없이 신뢰한다.",
        "example": "",
        "category": "승인/권한"
      },
      {
        "command": "--approve-mcps",
        "description": "모든 MCP 서버를 자동 승인한다(비대화형용).",
        "example": "",
        "category": "MCP"
      },
      {
        "command": "-m, --model <model>",
        "description": "사용할 모델을 지정한다(예: sonnet-4, gpt-5, composer 등).",
        "example": "agent -m gpt-5 \"explain this file\"",
        "category": "도구"
      },
      {
        "command": "--list-models",
        "description": "이 계정에서 사용 가능한 모델 목록을 출력한다.",
        "example": "agent --list-models",
        "category": "도구"
      },
      {
        "command": "--mode <plan|ask> / --plan",
        "description": "시작 모드를 설정한다(설계용 Plan, 읽기전용 Ask).",
        "example": "agent --plan \"design a migration strategy\"",
        "category": "세션"
      },
      {
        "command": "--workspace <path>",
        "description": "작업 워크스페이스(리포 루트) 디렉터리를 명시한다.",
        "example": "agent --workspace ./my-repo \"run tests\"",
        "category": "도구"
      },
      {
        "command": "-w, --worktree [name]",
        "description": "~/.cursor/worktrees/ 아래 새 git worktree에서 에이전트를 실행해 격리한다. --worktree-base로 기준 브랜치 지정.",
        "example": "agent -w feature-x --worktree-base main \"...\"",
        "category": "자동화"
      },
      {
        "command": "mcp [list|list-tools|login|enable|disable]",
        "description": "MCP 서버를 관리한다(목록/도구목록/인증/활성·비활성).",
        "example": "cursor-agent mcp list-tools github",
        "category": "MCP"
      },
      {
        "command": "sandbox [enable|disable|reset|run]",
        "description": "샌드박스 모드를 설정하거나 한 명령을 샌드박스에서 실행한다.",
        "example": "cursor-agent sandbox run --network npm test",
        "category": "승인/권한"
      },
      {
        "command": "generate-rule / rule",
        "description": "대화형 프롬프트로 새 Cursor Rule(.mdc) 파일을 생성한다.",
        "example": "cursor-agent generate-rule",
        "category": "메모리"
      },
      {
        "command": "worker [start|debug]",
        "description": "내 환경에서 에이전트를 돌리는 프라이빗 클라우드 워커를 시작/진단한다.",
        "example": "cursor-agent worker start --pool",
        "category": "자동화"
      },
      {
        "command": "install-shell-integration",
        "description": "셸 통합 스크립트를 ~/.zshrc에 설치한다(uninstall로 제거).",
        "example": "cursor-agent install-shell-integration",
        "category": "도구"
      },
      {
        "command": "update / about / models",
        "description": "최신 버전 갱신 / 버전·시스템·계정 정보 / 사용 가능 모델 목록.",
        "example": "cursor-agent update",
        "category": "도구"
      },
      {
        "command": "/model [filter]",
        "description": "(에디터·CLI 대화형) 사용할 모델을 선택한다.",
        "example": "/model gpt-5",
        "category": "도구"
      },
      {
        "command": "/plan, /ask, /debug",
        "description": "Plan(설계)·Ask(읽기전용)·Debug 모드로 전환한다. Shift+Tab으로 순환도 가능.",
        "example": "/plan add OAuth login",
        "category": "세션"
      },
      {
        "command": "/summarize (alias /compress)",
        "description": "대화를 요약해 컨텍스트 윈도우 공간을 확보한다.",
        "example": "/summarize",
        "category": "메모리"
      },
      {
        "command": "/context",
        "description": "컨텍스트 윈도우 사용량(시스템 프롬프트·규칙·도구·스킬 토큰 분해)을 표시한다.",
        "example": "/context",
        "category": "메모리"
      },
      {
        "command": "/clear / /fork / /rename <name>",
        "description": "새 채팅 시작 / 현재 채팅을 새 세션으로 분기 / 세션 이름 변경.",
        "example": "/rename auth-refactor",
        "category": "세션"
      },
      {
        "command": "/rewind",
        "description": "대화의 이전 메시지 시점으로 되돌아간다(체크포인트 복원).",
        "example": "/rewind",
        "category": "세션"
      },
      {
        "command": "/run-everything [on|off|status]",
        "description": "명령 자동 실행(YOLO 성격)을 켜고 끄거나 상태를 본다.",
        "example": "/run-everything on",
        "category": "승인/권한"
      },
      {
        "command": "/mcp [list|list-tools]",
        "description": "MCP 서버를 관리하고 사용 가능한 도구를 나열한다.",
        "example": "/mcp list-tools",
        "category": "MCP"
      },
      {
        "command": "/vim / /show-thinking / /line-numbers",
        "description": "Vim 키 토글 / 사고 과정 표시 토글 / 코드블록 줄번호 토글.",
        "example": "/vim",
        "category": "도구"
      }
    ],
    "features": [
      {
        "title": "Agent / Composer — 자율 멀티파일 코딩",
        "body": "Agent 모드는 여러 파일을 순차적으로 수정하고, 터미널 명령을 실행하며, 에러 출력을 읽고 스스로 교정한다. 2.0에서 도입된 Composer는 코드베이스 전역 시맨틱 검색으로 학습된 전용 코딩 모델로 비슷한 지능의 모델보다 약 4배 빠르고 대부분의 턴을 30초 안에 끝낸다. 모든 변경은 diff로 검토·롤백할 수 있어 하루치 수동 리팩터링을 한 번의 프롬프트로 줄인다. 큰 작업일수록 먼저 Plan 모드로 계획을 잡고 실행 모드로 넘기면 결과가 안정적이다."
      },
      {
        "title": "Tab 자동완성 — 다음 편집 예측",
        "body": "Tab은 최근 편집·주변 코드·린터 에러를 종합해 다음에 칠 코드를 회색 텍스트로 미리 보여준다. Tab으로 전체 수락, Cmd+→(Win/Linux는 Ctrl+→)로 다음 단어만 부분 수락한다. 단순 자동완성을 넘어 커서를 다음 수정 지점으로 점프시키는 멀티라인/다중 위치 편집을 제안하므로, 반복 변경(이름 바꾸기, 패턴 적용)에서 가속 효과가 크다."
      },
      {
        "title": "Cmd+K 인라인 편집 & 터미널 명령 생성",
        "body": "코드를 선택하고 Cmd+K(Win/Linux Ctrl+K)로 프롬프트 바를 열어 변경을 자연어로 지시한 뒤 Enter로 생성, Cmd+Enter로 diff를 수락한다. 선택 없이 호출하면 새 코드를 생성한다. 터미널 안에서도 Ctrl+K로 프롬프트 바가 열려 자연어를 셸 명령으로 변환해주므로, 복잡한 git/도커/awk 명령을 외우지 않아도 된다."
      },
      {
        "title": "@ 심볼 — 정밀 컨텍스트 주입",
        "body": "프롬프트에 @를 입력해 컨텍스트를 명시적으로 붙인다. @Files/@Folders(파일·폴더), @Code(특정 함수·클래스·심볼), @Docs(크롤링·인덱싱된 서드파티 문서, Add new doc로 커스텀 추가), @Web(실시간 웹 검색), @Git(커밋·diff·PR), @Past Chats, @Cursor Rules, @Recent Changes 등이 있다. 위치를 알 때는 @Files/@Code로 좁히고, 위치가 모호하면 @Codebase(코드베이스 시맨틱 검색)에 맡기는 식으로 토큰을 아끼는 것이 핵심 전략이다."
      },
      {
        "title": "Rules — .cursor/rules/*.mdc 영속 지침",
        "body": ".cursor/rules 디렉터리의 .mdc 파일(YAML frontmatter + 마크다운)로 에이전트 행동을 코드베이스에 고정한다. 적용 방식은 네 가지다: alwaysApply:true(항상), globs로 파일 패턴 매칭 시 자동 첨부, description 기반으로 에이전트가 판단해 첨부(Apply Intelligently), 둘 다 비우면 @rule-name 수동 호출. 항상 적용 규칙은 매 요청 토큰을 먹으므로 200단어 이내로 짧게 유지하고, 팀은 .cursor/rules/를 리포에 커밋한다. /generate-rule(또는 Cmd+Shift+P → New Cursor Rule)로 생성하며, frontmatter 없는 AGENTS.md(루트/하위 디렉터리 중첩 가능)나 레거시 .cursorrules도 지원한다. 우선순위는 Team → Project → User Rules."
      },
      {
        "title": "MCP — 외부 도구·데이터 연결",
        "body": "Model Context Protocol로 DB·API·서드파티 서비스를 에이전트의 도구로 연결한다. 설정은 Settings → Tools & MCP의 New MCP Server UI 또는 mcp.json 파일로 한다. 전역은 ~/.cursor/mcp.json, 프로젝트는 <root>/.cursor/mcp.json이며 같은 이름이 겹치면 프로젝트 설정이 우선한다. stdio(로컬 프로세스)와 streamable HTTP 서버를 지원하고, 서버는 시작 시점에만 로드되므로 추가 후 Cursor를 완전히 종료·재시작해야 한다. CLI는 mcp.json을 자동 감지하며 `cursor-agent mcp list-tools`로 노출 도구를 확인한다."
      },
      {
        "title": "Cloud Agent — 격리 VM에서 도는 자율 에이전트",
        "body": "구 Background Agent. cursor.com/agents(웹·PWA), 데스크톱 입력창의 'Cloud' 드롭다운, Slack/GitHub/Bitbucket/Linear에서 @cursor 멘션, 또는 API로 실행한다. 클론된 리포·의존성·시크릿·네트워크가 갖춰진 격리 VM에서 동작하며, 여러 작업·여러 리포를 병렬로 처리하고 스크린샷·영상·로그가 첨부된 머지 준비된 PR을 만든다. 효과의 핵심은 환경 설정이라 .cursor/environment.json으로 개발 환경을 정의하고, 시크릿은 대시보드에서 관리한다. GitHub/GitLab/Azure DevOps/Bitbucket 읽기·쓰기 권한 연결이 선행되어야 한다."
      },
      {
        "title": "병렬 에이전트 & git worktree 격리",
        "body": "Cursor 2.0의 에이전트 중심 UI는 여러 에이전트를 서로 간섭 없이 동시에 돌린다. 로컬에서는 git worktree로, 또는 원격 머신으로 격리하며, 같은 문제를 여러 모델에 동시에 풀게 해 더 나은 결과를 고르는 워크플로를 권장한다. CLI에서도 `-w/--worktree`로 ~/.cursor/worktrees/ 아래 격리 작업트리를 띄울 수 있고, 네이티브 브라우저 도구로 에이전트가 자기 변경을 직접 테스트·반복한다."
      },
      {
        "title": "Headless CLI — CI/CD 자동화",
        "body": "cursor-agent를 -p/--print로 비대화형 실행하면 스크립트·파이프라인에 그대로 넣을 수 있다. --output-format json|stream-json으로 결과를 구조화하고 jq로 파싱하며, --stream-partial-output으로 진행 상황을 실시간 추적한다. 파일 수정이 필요하면 --force(--yolo), 인증은 CURSOR_API_KEY 환경변수를 쓴다. find로 파일을 순회하며 일괄 처리하거나 GitHub Actions에서 코드 리뷰·문서 생성·테스트 수선을 자동화하는 패턴이 흔하다."
      },
      {
        "title": "Customize 허브 — 스킬·플러그인·서브에이전트 통합 관리",
        "body": "2026년 6월(v3.9) 도입된 Customize 페이지는 plugins, skills, MCPs, subagents, rules, commands, hooks를 한곳에서 user·team·workspace 레벨로 관리한다. Skills는 Agent Skills 오픈 표준을 따르며 동적 컨텍스트 탐색과 절차적 'how-to'에 적합하고, 설치하면 / 슬래시 메뉴에 자동 등록된다. 항상 로드되는 Rules와 달리 필요할 때 호출되는 Skills를 함께 쓰면 토큰을 아끼면서 역량을 확장할 수 있다. Context Usage Report로 토큰 분포를 시각적으로 점검할 수 있다."
      }
    ],
    "tips": [
      "Plan → Agent 흐름을 습관화하라. 복잡한 작업은 /plan(또는 Shift+Tab으로 모드 순환)으로 먼저 계획을 검토·수정한 뒤 실행 모드로 넘기면 엉뚱한 대규모 수정과 롤백을 크게 줄일 수 있다.",
      "alwaysApply 규칙은 200단어 이내로 짧게. 매 요청·매 자동완성마다 토큰이 실리므로, 파일 타입별 규칙은 globs 자동 첨부로, 특수 작업 규칙은 수동(@rule-name)으로 분리하고 항상-적용은 한두 개만 둔다.",
      "@Codebase와 @Files를 용도에 맞게 섞어라. 위치를 모를 때만 @Codebase 시맨틱 검색에 맡기고, 정확히 아는 파일·심볼은 @Files/@Code로 좁혀야 컨텍스트 낭비와 환각이 준다. 최신 정보가 필요하면 @Web.",
      "MCP 서버를 추가·수정했으면 Cursor를 완전히 종료 후 재시작해야 로드된다. CLI 자동화에서는 --approve-mcps와 mcp.json 자동 감지를 활용하고, 권한이 넓은 서버는 신뢰할 수 있는 출처만 연결한다.",
      "병렬 에이전트는 git worktree로 격리하라. 같은 워킹트리에서 여러 에이전트를 돌리면 서로 충돌하므로, 에디터의 병렬 에이전트나 CLI의 -w/--worktree로 분리하고 같은 문제를 여러 모델에 풀려 best-of-N으로 고른다.",
      "CI에서는 -p --output-format json --force + CURSOR_API_KEY 조합으로 헤드리스 실행하고 jq로 결과를 파싱한다. 위험 명령이 걱정되면 --force 대신 --sandbox enabled로 실행 범위를 제한한다.",
      "Cloud Agent는 .cursor/environment.json 설정에 투자하라. 의존성·빌드·테스트 환경이 제대로 정의돼 있어야 에이전트가 스스로 테스트하고 머지 준비된 PR을 만든다. 반복 작업은 Slack에서 @cursor 멘션으로 위임하고 'list my agents'로 현황을 본다.",
      "터미널에서 Ctrl+K로 자연어를 셸 명령으로 변환하면 복잡한 git/도커 명령을 외울 필요가 없다. Tab은 Cmd+→로 단어 단위 부분 수락이 가능해, 제안 전체가 맞지 않을 때 일부만 받아 쓰면 빠르다."
    ],
    "sourceUrls": [
      "https://cursor.com/docs/cli/overview",
      "https://cursor.com/docs/cli/reference/parameters",
      "https://cursor.com/docs/cli/reference/slash-commands",
      "https://cursor.com/docs/cli/using",
      "https://cursor.com/docs/cli/headless",
      "https://cursor.com/docs/rules",
      "https://cursor.com/docs/mcp",
      "https://cursor.com/docs/cli/mcp",
      "https://cursor.com/docs/cloud-agent",
      "https://cursor.com/docs/integrations/slack",
      "https://cursor.com/docs/context/mentions",
      "https://docs.cursor.com/en/context/@-symbols/overview",
      "https://cursor.com/help/ai-features/tab",
      "https://cursor.com/docs/inline-edit/terminal",
      "https://cursor.com/blog/2-0",
      "https://cursor.com/blog/cloud-agents",
      "https://cursor.com/blog/cli",
      "https://cursor.com/changelog"
    ],
    "providerId": "cursor"
  },
  {
    "id": "cli-manual-github-copilot-cli",
    "slug": "github-copilot-cli",
    "platform": "GitHub Copilot CLI",
    "tagline": "터미널에서 작동하는 GitHub Copilot 코딩 에이전트 — 계획·실행·위임을 한 곳에서",
    "overview": "GitHub Copilot CLI는 Copilot 코딩 에이전트를 터미널에 직접 가져온 에이전틱 CLI 도구로, 자연어로 코드를 작성·디버그·리팩터링하고 GitHub(이슈·PR)와 상호작용하며 다단계 작업을 자율 수행한다. `@github/copilot` npm 패키지로 설치하는 `copilot` 명령(에이전트 모드)과, 명령어 추천·설명에 특화된 구형 `gh copilot` 확장(`gh copilot suggest`/`explain`)으로 나뉜다. 터미널 중심으로 일하며 IDE를 떠나지 않고 AI에 작업을 위임하고 싶은 개발자에게 적합하며, 활성 Copilot 구독이 필요하다.",
    "install": "에이전틱 CLI(권장, npm 전역 설치):\n\n```bash\nnpm install -g @github/copilot\n# 프리릴리스(베타) 채널:\nnpm install -g @github/copilot@prerelease\n```\n\n설치 후 `copilot` 명령으로 실행한다. macOS / Linux / Windows를 지원하며 Windows에서는 PowerShell v6 이상이 필요하다. 자동 업데이트는 `--no-auto-update`로 끌 수 있고, CLI 내부에서 `/update`(또는 `copilot update`)로 수동 업그레이드한다.\n\n구형 명령어 추천 도구(gh CLI 확장):\n\n```bash\ngh extension install github/gh-copilot --force\n```\n\n전제: 활성 GitHub Copilot 구독, GitHub CLI(`gh`) 설치, 그리고 Node.js 환경(에이전틱 CLI 기준). 기본 모델은 Claude Sonnet 4.5이며 `/model`로 GPT-5.1, Claude Opus 4.5, Gemini 3 Pro 등으로 전환할 수 있다.",
    "auth": "에이전틱 CLI(`copilot`)는 두 가지 방식으로 인증한다.\n\n1) 대화형 로그인(권장): `copilot login`을 실행하거나 세션 안에서 `/login` 슬래시 명령을 입력하면 OAuth device flow로 브라우저 인증을 진행한다. GitHub Enterprise는 `copilot login --host HOST`로 연결한다.\n\n2) 토큰 인증(CI/자동화): https://github.com/settings/personal-access-tokens/new 에서 fine-grained PAT를 만들고 \"Copilot Requests\" 권한을 부여한 뒤 `export GH_TOKEN=\"...\"`(또는 `GITHUB_TOKEN`) 환경변수로 전달한다.\n\n로그아웃은 `copilot logout` 또는 `/logout`, 여러 계정 전환은 `/user switch`로 한다.\n\n구형 `gh copilot` 확장은 GitHub CLI OAuth 앱을 통해 인증해야 한다(`gh auth login --web`). 주의: classic/fine-grained PAT(`GH_TOKEN`)만으로는 `gh copilot`이 동작하지 않으며 반드시 OAuth 로그인이 필요하다.",
    "commands": [
      {
        "command": "copilot",
        "description": "대화형 에이전트 세션을 시작한다. 코드 폴더로 이동한 뒤 실행하면 대화하며 작업을 진행할 수 있다.",
        "example": "cd my-project && copilot",
        "category": "세션"
      },
      {
        "command": "copilot -p \"<프롬프트>\"",
        "description": "프롬프트를 비대화형으로 1회 실행한다(헤드리스). 스크립트·CI 자동화에 사용한다.",
        "example": "copilot -p \"이 레포의 lint 에러를 모두 고쳐줘\" --allow-all-tools",
        "category": "자동화"
      },
      {
        "command": "copilot --autopilot",
        "description": "각 단계 승인 없이 다단계 작업을 자율 완료하는 오토파일럿 모드로 시작한다.",
        "example": "copilot --autopilot --max-autopilot-continues=20",
        "category": "자동화"
      },
      {
        "command": "copilot --plan",
        "description": "플랜 모드로 시작한다. 코드를 쓰기 전에 범위·요구사항을 묻고 구현 계획을 먼저 세운다.",
        "example": "copilot --plan",
        "category": "세션"
      },
      {
        "command": "copilot --model <MODEL>",
        "description": "사용할 AI 모델을 지정한다.",
        "example": "copilot --model claude-opus-4.5",
        "category": "세션"
      },
      {
        "command": "copilot --resume / --continue",
        "description": "이전 세션을 재개한다. `--continue`는 가장 최근 세션을 바로 잇는다.",
        "example": "copilot --continue",
        "category": "세션"
      },
      {
        "command": "copilot --add-dir <PATH>",
        "description": "기본 작업 폴더 외에 접근을 허용할 디렉터리를 추가한다.",
        "example": "copilot --add-dir ../shared-lib",
        "category": "도구"
      },
      {
        "command": "copilot --allow-tool / --deny-tool <TOOL>",
        "description": "특정 도구를 허용/차단한다. 세밀한 권한 제어에 사용한다.",
        "example": "copilot --allow-tool=shell --deny-tool=write",
        "category": "승인/권한"
      },
      {
        "command": "copilot --allow-all-tools / --yolo",
        "description": "모든 도구 사용을 자동 승인한다(`--yolo`는 `--allow-all` 단축). 신뢰된 샌드박스에서만 사용 권장.",
        "example": "copilot -p \"테스트 통과시켜줘\" --yolo",
        "category": "승인/권한"
      },
      {
        "command": "copilot mcp",
        "description": "MCP 서버 구성을 관리한다(추가·편집·삭제).",
        "example": "copilot mcp",
        "category": "MCP"
      },
      {
        "command": "copilot --additional-mcp-config <JSON>",
        "description": "세션 한정으로 MCP 서버를 추가한다.",
        "example": "copilot --additional-mcp-config='{\"mcpServers\":{...}}'",
        "category": "MCP"
      },
      {
        "command": "copilot init",
        "description": "프로젝트용 커스텀 인스트럭션(AGENTS.md 등) 초기 설정을 생성한다.",
        "example": "copilot init",
        "category": "메모리"
      },
      {
        "command": "copilot --output-format json -s",
        "description": "응답만 JSON으로 출력한다. 파이프라인에서 결과 파싱에 유용하다.",
        "example": "copilot -p \"버전 올려줘\" --output-format json -s",
        "category": "자동화"
      },
      {
        "command": "/plan [PROMPT]",
        "description": "구현 계획을 먼저 수립한다. Shift+Tab으로도 플랜 모드를 토글할 수 있다.",
        "example": "/plan 결제 모듈에 재시도 로직 추가",
        "category": "세션"
      },
      {
        "command": "/model [MODEL]",
        "description": "세션 도중 모델을 전환한다. 출력 비교나 비용 최적화에 사용한다.",
        "example": "/model gpt-5.1",
        "category": "세션"
      },
      {
        "command": "/agent",
        "description": "내장/커스텀 에이전트(Explore, Task, Code Review, Research, Rubber Duck 등)를 선택해 호출한다.",
        "example": "/agent",
        "category": "도구"
      },
      {
        "command": "/delegate <PROMPT>",
        "description": "작업을 Copilot 코딩 에이전트(비동기 백그라운드)에 위임한다. 변경을 새 브랜치에 커밋하고 draft PR을 연다.",
        "example": "/delegate 다크 모드 지원 추가",
        "category": "자동화"
      },
      {
        "command": "/fleet [PROMPT]",
        "description": "여러 서브에이전트를 병렬 실행해 다단계 구현 계획을 빠르게 처리한다.",
        "example": "/fleet 모든 모듈에 단위 테스트 추가",
        "category": "자동화"
      },
      {
        "command": "/pr [view|create|fix|auto]",
        "description": "터미널에서 PR을 보고·생성·수정한다.",
        "example": "/pr create",
        "category": "자동화"
      },
      {
        "command": "/review [PROMPT] · /security-review [PROMPT]",
        "description": "코드 리뷰 또는 보안 취약점 점검을 전용 에이전트로 수행한다.",
        "example": "/security-review",
        "category": "도구"
      },
      {
        "command": "/mcp [show|add|edit|delete|enable|disable]",
        "description": "MCP 서버를 세션 내에서 관리한다. GitHub MCP 서버는 기본 구성되어 있다.",
        "example": "/mcp add",
        "category": "MCP"
      },
      {
        "command": "/context",
        "description": "토큰 사용량을 상세 분석해 보여준다.",
        "example": "/context",
        "category": "메모리"
      },
      {
        "command": "/compact [FOCUS]",
        "description": "대화를 요약·압축해 컨텍스트 여유를 확보한다. 95% 도달 시 자동 압축도 동작.",
        "example": "/compact 결제 흐름 중심으로 요약",
        "category": "메모리"
      },
      {
        "command": "/clear · /new · /reset",
        "description": "현재 세션 대화 기록을 지우고 새로 시작한다.",
        "example": "/clear",
        "category": "세션"
      },
      {
        "command": "/add-dir <PATH> · /list-dirs",
        "description": "파일 접근을 허용할 디렉터리를 추가하거나 허용된 목록을 본다.",
        "example": "/add-dir ./packages/core",
        "category": "승인/권한"
      },
      {
        "command": "/permissions [show|reset] · /allow-all [on|off] · /yolo",
        "description": "도구 승인 상태를 보거나 초기화하고, 전체 자동 승인을 토글한다.",
        "example": "/allow-all on",
        "category": "승인/권한"
      },
      {
        "command": "/sandbox [enable|disable]",
        "description": "로컬 샌드박스를 켜고 끈다. 파일·네트워크 접근을 제한해 민감 작업을 보호한다.",
        "example": "/sandbox enable",
        "category": "승인/권한"
      },
      {
        "command": "/after [DELAY PROMPT] · /every [INTERVAL PROMPT]",
        "description": "프롬프트를 미래에 실행 예약한다. `/after`는 1회, `/every`는 반복.",
        "example": "/every 1h 의존성 보안 점검 실행",
        "category": "자동화"
      },
      {
        "command": "/skills [list|info|add|remove|reload]",
        "description": "특정 작업 역량을 강화하는 스킬을 관리한다.",
        "example": "/skills list",
        "category": "도구"
      },
      {
        "command": "/diff · /undo · /rewind",
        "description": "로컬 변경을 검토하고(diff), 마지막 동작을 되돌린다.",
        "example": "/diff",
        "category": "도구"
      },
      {
        "command": "/research <TOPIC> · /ask <QUESTION>",
        "description": "GitHub·웹을 활용한 심층 조사를 하거나 빠른 사이드 질문을 던진다.",
        "example": "/research React 19 동시성 변경점",
        "category": "도구"
      },
      {
        "command": "/usage · /session",
        "description": "세션 지표·사용량 통계를 표시한다.",
        "example": "/usage",
        "category": "메모리"
      },
      {
        "command": "gh copilot suggest \"<설명>\"",
        "description": "(구형 확장) 자연어 설명으로 셸/gh/git 명령을 추천받는다. `-t shell|gh|git`로 대상 지정.",
        "example": "gh copilot suggest -t git \"undo my last commit\"",
        "category": "도구"
      },
      {
        "command": "gh copilot explain '<명령>'",
        "description": "(구형 확장) 기존 명령이 무엇을 하는지 설명받는다.",
        "example": "gh copilot explain 'tar -xzvf archive.tar.gz'",
        "category": "도구"
      },
      {
        "command": "gh copilot alias -- <shell>",
        "description": "(구형 확장) `ghcs`(suggest)·`ghce`(explain) 단축 별칭 셸 설정을 생성한다.",
        "example": "echo 'eval \"$(gh copilot alias -- zsh)\"' >> ~/.zshrc",
        "category": "도구"
      }
    ],
    "features": [
      {
        "title": "에이전트 모드와 오토파일럿",
        "body": "기본 ask/execute 모드는 도구 실행마다 승인을 받지만, 오토파일럿 모드(`--autopilot`)는 각 단계 승인 없이 다단계 작업을 자율 완료한다. 세션 안에서는 Shift+Tab으로 standard → plan → autopilot 모드를 순환 전환할 수 있다. `--max-autopilot-continues=N`으로 자동 진행 횟수에 상한을 두면 폭주를 막으면서 자율성을 활용할 수 있다."
      },
      {
        "title": "플랜 모드(Plan Mode)",
        "body": "코드를 작성하기 전에 Copilot이 요청을 분석하고 범위·요구사항에 대해 되묻고 구현 계획을 먼저 세운다. `--plan`으로 시작하거나 `/plan`, 혹은 Shift+Tab으로 진입한다. 큰 리팩터링이나 모호한 요구사항일수록 플랜 모드로 계획을 확정한 뒤 실행에 들어가면 헛작업을 크게 줄인다."
      },
      {
        "title": "커스텀 에이전트와 코딩 에이전트 위임",
        "body": "Explore·Task·Code Review·Research·Rubber Duck 등 내장 에이전트 외에, Markdown 에이전트 프로필로 팀 컨벤션에 맞춘 커스텀 에이전트를 정의할 수 있다. 정의 위치는 사용자 레벨 `~/.copilot/agents`, 레포 레벨 `.github/agents`, 조직 레벨 `{org}/.github`이며 각 에이전트에 프롬프트·도구·MCP를 지정한다. `/delegate`는 작업을 비동기 Copilot 코딩 에이전트에 넘겨 변경을 새 브랜치에 커밋하고 draft PR을 열어 백그라운드로 진행시킨다."
      },
      {
        "title": "MCP(Model Context Protocol) 통합",
        "body": "MCP 서버를 추가해 외부 데이터·도구로 Copilot 역량을 확장한다. GitHub MCP 서버는 기본 내장되어 있어 이슈·PR 작업이 바로 가능하다. `/mcp add`로 대화형 추가, `copilot mcp`로 영구 구성 관리, `--additional-mcp-config`로 세션 한정 추가를 한다. `--add-github-mcp-toolset`이나 `--enable-all-github-mcp-tools`로 GitHub MCP 도구셋 노출 범위를 세밀하게 제어할 수 있다."
      },
      {
        "title": "커스텀 인스트럭션과 메모리(규칙 파일)",
        "body": "레포 전역 규칙은 `.github/copilot-instructions.md`, 경로별 규칙은 `.github/instructions/**/*.instructions.md`에 두며, `AGENTS.md`는 자동으로 추가 컨텍스트로 로드된다. `copilot init`으로 초기 설정을 생성하고, `--no-custom-instructions`로 로딩을 끌 수 있다. Copilot Memory는 레포에 대한 지속적 이해를 저장해 세션을 거듭할수록 맥락을 유지한다."
      },
      {
        "title": "권한·샌드박스 보안 모델",
        "body": "도구 승인 시스템으로 어떤 도구·경로·URL을 쓸지 세밀하게 통제한다. `--allow-tool`/`--deny-tool`, `--allow-url`/`--deny-url`, `--add-dir`로 화이트리스트를 구성하고, `/sandbox enable`로 파일·네트워크 접근을 제한한 로컬 샌드박스에서 민감 작업을 수행한다. 자동화 시 편의를 위해 `--yolo`/`--allow-all`이 있으나 신뢰된 환경에서만 쓰고, `--secret-env-vars`로 민감 환경변수를 출력에서 가린다."
      },
      {
        "title": "헤드리스 자동화와 예약 실행",
        "body": "`-p \"프롬프트\"`로 비대화형 1회 실행이 가능하며 `--output-format json`과 `-s`(silent)를 결합하면 CI 파이프라인에서 결과를 파싱하기 좋다. 스크립트 출력을 파이프로 넘겨 자동화할 수도 있다. 세션 내에서는 `/after`(1회)·`/every`(반복)로 프롬프트를 미래 시점에 예약 실행해 정기 점검·릴리스 작업을 무인화할 수 있다."
      },
      {
        "title": "병렬 실행(Fleet)과 PR 워크플로",
        "body": "`/fleet`은 여러 서브에이전트를 병렬로 돌려 다단계 구현 계획을 빠르게 끝낸다. `/pr view|create|fix|auto`로 터미널을 떠나지 않고 PR을 조회·생성·수정하며, `/review`·`/security-review` 전용 에이전트로 머지 전 코드 리뷰와 보안 점검을 자동화한다. 세션은 `--share`(파일) 또는 `--share-gist`로 공유할 수 있어 협업·재현에 유용하다."
      }
    ],
    "tips": [
      "구형 `gh copilot` 확장과 신형 `copilot`(에이전틱 CLI)은 다른 도구다. 단순 명령어 추천/설명만 필요하면 `gh copilot suggest/explain`, 실제 코드 작성·PR·자율 작업이면 `@github/copilot`를 쓴다.",
      "큰 작업은 먼저 플랜 모드(Shift+Tab 또는 `/plan`)로 계획을 확정한 뒤 실행하라. 오토파일럿은 신뢰된 작업에만 쓰고 `--max-autopilot-continues`로 상한을 두는 것이 안전하다.",
      "CI/스크립트에서는 `copilot -p \"...\" --allow-all-tools --output-format json -s` 조합으로 헤드리스 실행하되, 인증은 OAuth 대신 `GH_TOKEN`(fine-grained PAT, Copilot Requests 권한)을 쓴다.",
      "프로젝트 규칙은 `.github/copilot-instructions.md`와 `AGENTS.md`에 적어두면 매 세션 자동 로드되어 컨벤션 일관성이 유지된다. 경로별 규칙은 `*.instructions.md`로 세분화하라.",
      "토큰이 부족해지면 `/context`로 사용량을 확인하고 `/compact`로 대화를 요약 압축하라. 95%에서 자동 압축이 동작하지만 중요한 작업 전엔 수동 압축으로 여유를 만드는 편이 안정적이다.",
      "모델은 작업 성격에 맞춰 `/model`로 바꿔라. 복잡한 설계엔 Claude Opus 4.5나 GPT-5.1, 빠른 반복엔 Haiku 4.5처럼 비용·속도·정확도를 트레이드오프한다.",
      "권한은 최소화가 원칙이다. `--allow-all`/`--yolo`를 상시 쓰지 말고, `--add-dir`로 필요한 디렉터리만 열고 `/sandbox enable`로 민감 작업을 격리하라.",
      "반복 점검 작업(보안 스캔, 의존성 업데이트 등)은 `/every`로 예약하고, 무거운 다파일 작업은 `/fleet`이나 `/delegate`로 백그라운드/병렬 처리해 대기 시간을 줄여라."
    ],
    "sourceUrls": [
      "https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference",
      "https://docs.github.com/copilot/concepts/agents/about-copilot-cli",
      "https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview",
      "https://github.com/github/copilot-cli",
      "https://github.blog/ai-and-ml/github-copilot/a-cheat-sheet-to-slash-commands-in-github-copilot-cli/",
      "https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/",
      "https://github.com/github/gh-copilot"
    ]
  },
  {
    "id": "cli-manual-aider",
    "slug": "aider",
    "platform": "Aider",
    "tagline": "터미널에서 LLM과 페어프로그래밍하는 git-우선 오픈소스 AI 코딩 도구",
    "overview": "Aider는 터미널에서 동작하는 오픈소스 AI 페어프로그래밍 도구로, 저장소 전체를 repo map으로 이해하고 여러 파일에 걸친 변경을 수행한 뒤 git에 자동 커밋한다. Claude, GPT, Gemini, DeepSeek 등 거의 모든 클라우드/로컬 LLM에 연결할 수 있어 모델 선택의 자유가 크다. IDE나 GUI에 갇히지 않고 터미널과 git 워크플로를 그대로 유지하면서 AI를 쓰고 싶은 개발자, 그리고 변경 이력을 git 커밋 단위로 투명하게 관리하고 싶은 사람에게 특히 잘 맞는다.",
    "install": "권장 설치(aider-install):\n```bash\npython -m pip install aider-install\naider-install\n```\n\n원라인 설치 스크립트(Mac/Linux):\n```bash\ncurl -LsSf https://aider.chat/install.sh | sh\n```\n\nWindows(PowerShell):\n```powershell\npowershell -ExecutionPolicy ByPass -c \"irm https://aider.chat/install.ps1 | iex\"\n```\n\npipx 또는 uv로 격리 설치:\n```bash\npipx install aider-chat\n# 또는\nuv tool install --force --python python3.12 --with pip aider-chat@latest\n```\n\n업그레이드는 설치 방식에 맞춰 진행한다(예: `pipx upgrade aider-chat`, `uv tool install ... aider-chat@latest`). 설치 후 프로젝트 git 디렉터리로 이동해 `aider`를 실행한다.",
    "auth": "Aider는 LLM API 키로 인증한다. 환경변수, 플래그, .env 파일 세 가지 방식이 있다.\n\n1) 환경변수(가장 일반적): `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` 등을 셸에 설정.\n\n2) 실행 시 플래그: `aider --model sonnet --api-key anthropic=<key>`, `aider --model o3-mini --api-key openai=<key>`, `aider --model deepseek --api-key deepseek=<key>` 형태. `--anthropic-api-key`, `--openai-api-key` 같은 공급사별 플래그도 있음.\n\n3) `.env` 파일: 프로젝트 루트나 홈 디렉터리에 키를 두면 자동 로드됨(커밋 금지, .gitignore 권장).\n\n2026년 6월 기준 추천 상위 모델은 Gemini 2.5 Pro, DeepSeek R1/V3, Claude 3.7 Sonnet, OpenAI o3/o4-mini/GPT-4.1 등이며, 최신 순위는 Aider LLM leaderboards에서 확인한다.",
    "commands": [
      {
        "command": "/add",
        "description": "파일을 채팅에 추가해 aider가 편집·검토할 수 있게 한다. repo map만으로 부족할 때 대상 파일을 명시적으로 올린다.",
        "example": "/add src/api/users.py src/api/auth.py",
        "category": "세션"
      },
      {
        "command": "/drop",
        "description": "채팅에서 파일을 제거해 컨텍스트 토큰을 확보한다. 인자 없이 쓰면 모든 추가 파일을 내린다.",
        "example": "/drop src/api/auth.py",
        "category": "세션"
      },
      {
        "command": "/read-only",
        "description": "참조 파일을 읽기 전용으로 추가하거나 기존 파일을 읽기 전용으로 전환한다. 편집은 막고 컨텍스트로만 활용(예: CONVENTIONS.md).",
        "example": "/read-only CONVENTIONS.md",
        "category": "세션"
      },
      {
        "command": "/architect",
        "description": "architect 모드로 단발 메시지를 보낸다. 강한 추론 모델이 변경을 설계하고 editor 모델이 실제 파일 편집을 만든다.",
        "example": "/architect 결제 모듈을 멱등성 보장하도록 리팩터링해줘",
        "category": "도구"
      },
      {
        "command": "/code",
        "description": "코드 변경을 요청하는 기본 모드. 명시적으로 코드 편집을 지시할 때 사용한다.",
        "example": "/code add input validation to the signup form",
        "category": "도구"
      },
      {
        "command": "/ask",
        "description": "파일을 수정하지 않고 코드베이스에 대해 질문/탐색한다. 전략을 먼저 합의한 뒤 /code로 넘어가는 흐름에 유용.",
        "example": "/ask 이 서비스의 동시성 병목은 어디야?",
        "category": "도구"
      },
      {
        "command": "/chat-mode",
        "description": "채팅 모드를 영구 전환한다(code/architect/ask/help/context). 프롬프트 접두사로 현재 모드가 표시된다.",
        "example": "/chat-mode ask",
        "category": "도구"
      },
      {
        "command": "/commit",
        "description": "채팅 밖에서 만든 변경을 적절한 커밋 메시지로 git에 커밋한다.",
        "example": "/commit",
        "category": "자동화"
      },
      {
        "command": "/undo",
        "description": "aider가 만든 마지막 git 커밋을 되돌린다. 결과가 마음에 안 들 때 안전하게 롤백.",
        "example": "/undo",
        "category": "자동화"
      },
      {
        "command": "/diff",
        "description": "마지막 메시지 이후의 변경 diff를 보여준다. 커밋 전 검토에 사용.",
        "example": "/diff",
        "category": "자동화"
      },
      {
        "command": "/git",
        "description": "임의의 git 명령을 실행한다(출력은 채팅에 포함되지 않음).",
        "example": "/git log --oneline -5",
        "category": "자동화"
      },
      {
        "command": "/model",
        "description": "메인 모델(Main Model)을 다른 LLM으로 전환한다.",
        "example": "/model anthropic/claude-3-7-sonnet",
        "category": "메모리"
      },
      {
        "command": "/editor-model",
        "description": "editor 역할에 쓸 LLM을 변경한다(architect 모드에서 실제 편집 담당).",
        "example": "/editor-model gpt-4o",
        "category": "메모리"
      },
      {
        "command": "/weak-model",
        "description": "weak 모델 역할(커밋 메시지·히스토리 요약)에 쓸 LLM을 지정한다.",
        "example": "/weak-model gpt-4o-mini",
        "category": "메모리"
      },
      {
        "command": "/models",
        "description": "사용 가능한 모델을 검색한다.",
        "example": "/models gemini",
        "category": "메모리"
      },
      {
        "command": "/reasoning-effort",
        "description": "추론 모델의 thinking 토큰 예산을 조절한다(난도에 맞춰 추론 깊이 조정).",
        "example": "/reasoning-effort high",
        "category": "메모리"
      },
      {
        "command": "/run",
        "description": "셸 명령을 실행하고 그 출력을 선택적으로 채팅에 추가한다.",
        "example": "/run pytest -q",
        "category": "도구"
      },
      {
        "command": "/test",
        "description": "테스트 명령을 실행하고 에러가 나면 출력을 채팅에 포함시켜 aider가 고치게 한다.",
        "example": "/test pytest",
        "category": "자동화"
      },
      {
        "command": "/lint",
        "description": "린트를 실행하고 코드 문제를 수정한다.",
        "example": "/lint",
        "category": "자동화"
      },
      {
        "command": "/map",
        "description": "현재 repository map을 출력한다. 모델이 보는 코드베이스 요약을 직접 확인.",
        "example": "/map",
        "category": "세션"
      },
      {
        "command": "/map-refresh",
        "description": "repository map을 강제로 재생성한다(구조 변경 후 갱신).",
        "example": "/map-refresh",
        "category": "세션"
      },
      {
        "command": "/tokens",
        "description": "현재 채팅 컨텍스트의 토큰 사용량을 보고한다. 비용·컨텍스트 관리에 필수.",
        "example": "/tokens",
        "category": "세션"
      },
      {
        "command": "/clear",
        "description": "대화의 이전 메시지를 모두 제거한다(파일은 유지).",
        "example": "/clear",
        "category": "세션"
      },
      {
        "command": "/reset",
        "description": "모든 파일을 내리고 채팅 히스토리를 비운다(완전 초기화).",
        "example": "/reset",
        "category": "세션"
      },
      {
        "command": "/web",
        "description": "웹페이지를 스크랩해 마크다운으로 변환한 뒤 메시지로 보낸다(레퍼런스 문서 주입).",
        "example": "/web https://docs.example.com/api",
        "category": "도구"
      },
      {
        "command": "/paste",
        "description": "클립보드의 이미지/텍스트를 채팅에 붙여넣는다(스크린샷 등 시각 컨텍스트).",
        "example": "/paste",
        "category": "도구"
      },
      {
        "command": "/voice",
        "description": "음성을 녹음·전사해 입력으로 사용한다.",
        "example": "/voice",
        "category": "도구"
      },
      {
        "command": "/copy-context",
        "description": "채팅 컨텍스트를 마크다운으로 내보내 웹 LLM 인터페이스에 붙여넣을 수 있게 한다.",
        "example": "/copy-context",
        "category": "도구"
      },
      {
        "command": "/ls",
        "description": "파일 목록과 채팅 포함 상태를 보여준다.",
        "example": "/ls",
        "category": "세션"
      },
      {
        "command": "/settings",
        "description": "현재 설정을 표시한다.",
        "example": "/settings",
        "category": "세션"
      },
      {
        "command": "/help",
        "description": "aider 자체의 사용법·설정에 대해 질문한다(help 모드).",
        "example": "/help architect 모드 어떻게 켜?",
        "category": "도구"
      },
      {
        "command": "aider --model",
        "description": "[CLI] 메인 채팅에 쓸 모델 지정.",
        "example": "aider --model sonnet src/",
        "category": "자동화"
      },
      {
        "command": "aider --architect",
        "description": "[CLI] architect 편집 포맷으로 시작.",
        "example": "aider --architect --model o3 --editor-model gpt-4o",
        "category": "자동화"
      },
      {
        "command": "aider --read",
        "description": "[CLI] 읽기 전용 파일 지정(여러 번 가능). 규칙 파일 주입에 사용.",
        "example": "aider --read CONVENTIONS.md",
        "category": "자동화"
      },
      {
        "command": "aider --watch-files",
        "description": "[CLI] 파일을 감시하다가 AI 코멘트(AI!/AI?)를 만나면 동작. IDE 병행에 사용.",
        "example": "aider --watch-files",
        "category": "자동화"
      },
      {
        "command": "aider --message",
        "description": "[CLI] 단일 메시지를 보내고 종료(헤드리스 1회 실행).",
        "example": "aider --message \"add docstrings\" utils.py",
        "category": "자동화"
      },
      {
        "command": "aider --commit",
        "description": "[CLI] 대기 중인 변경을 적절한 메시지로 커밋하고 종료.",
        "example": "aider --commit",
        "category": "자동화"
      },
      {
        "command": "aider --no-auto-commits",
        "description": "[CLI] LLM 변경의 자동 커밋을 끈다.",
        "example": "aider --no-auto-commits",
        "category": "자동화"
      },
      {
        "command": "aider --yes-always",
        "description": "[CLI] 모든 확인 프롬프트에 항상 yes(배치/스크립트용).",
        "example": "aider --yes-always --message \"fix lints\"",
        "category": "자동화"
      },
      {
        "command": "aider --config",
        "description": "[CLI] 사용할 설정 파일을 명시 지정.",
        "example": "aider --config ./team.aider.conf.yml",
        "category": "자동화"
      }
    ],
    "features": [
      {
        "title": "Architect/Editor 2단계 모델 페어링",
        "body": "architect 모드는 요청을 두 모델로 나눠 처리한다. 메인(architect) 모델이 강한 추론으로 변경 방안을 설계하고, editor 모델이 그 방안을 실제 파일 편집(diff)으로 변환한다. o3/o1 같은 추론 모델을 architect로, GPT-4o처럼 편집에 강한 모델을 editor로 두는 조합이 어려운 리팩터링에서 효과적이다. LLM 요청이 2회 발생해 시간·비용이 늘 수 있으니, 난도 높은 작업에 선택적으로 쓰는 게 좋다."
      },
      {
        "title": "Repository Map으로 코드베이스 전체 이해",
        "body": "Aider는 tree-sitter로 각 파일의 핵심 클래스·함수와 시그니처를 추출해 저장소 요약(repo map)을 만들고, 변경 요청마다 모델에 함께 보낸다. 파일 간 의존성 그래프에 랭킹 알고리즘을 적용해 토큰 예산 안에서 가장 관련 높은 부분만 노출한다. 기본 예산은 `--map-tokens 1000`이며 채팅 상태에 따라 동적으로 크기를 조절한다. 구조를 크게 바꾼 뒤에는 `/map-refresh`로 갱신하고, `/map`으로 모델이 보는 요약을 직접 점검할 수 있다."
      },
      {
        "title": "git 자동 커밋과 안전한 롤백",
        "body": "Aider는 변경을 적용할 때마다 의미 있는 커밋 메시지로 자동 커밋해, 모든 AI 변경이 git 이력에 투명하게 남는다. 마음에 안 들면 `/undo`로 마지막 커밋을 즉시 되돌릴 수 있어 시도-검토-롤백 루프가 빠르다. 자동 커밋이 부담되면 `--no-auto-commits`로 끄고 `/diff`로 검토 후 `/commit`을 수동 호출하는 워크플로로 전환할 수 있다. dirty 상태 커밋을 막으려면 `--no-dirty-commits`를 쓴다."
      },
      {
        "title": "Watch 모드: IDE 안에서 AI 코멘트로 지시",
        "body": "`--watch-files`로 실행하면 aider가 저장소를 감시하다가 코드에 단 한 줄짜리 특수 코멘트를 인식한다. `AI!`(느낌표)는 변경을 트리거하고, `AI?`(물음표)는 질문에 답하며, `AI`(부호 없음)는 즉시 동작 없이 지시만 표시한다. 예: `function factorial(n) // Implement this. AI!`. 어떤 언어의 한 줄 주석 문법(#, //, --)이든 지원하므로, 평소 쓰던 에디터에서 코멘트만 달고 저장하면 터미널의 aider가 작업한다. 이후 터미널로 옮겨 `/undo`, `/clear` 등으로 다듬을 수 있다."
      },
      {
        "title": ".aider.conf.yml로 팀/프로젝트 설정 표준화",
        "body": "설정은 홈 디렉터리 → git 루트 → 현재 디렉터리 순으로 로드되며 뒤에 로드된 파일이 우선한다(홈에 전역 기본값, 레포에 프로젝트 오버라이드). YAML로 `model`, `weak-model`, `editor-model`, `auto-commits`, `dark-mode`, `read` 등을 지정한다. `read: [CONVENTIONS.md]`처럼 규칙 파일을 자동 주입할 수 있고, `--config team.aider.conf.yml`로 특정 파일만 단독 로드할 수도 있다. 거의 모든 CLI 플래그가 동일 키로 설정 가능하다."
      },
      {
        "title": "CONVENTIONS.md로 코딩 규칙 일관성 유지",
        "body": "코딩 가이드라인을 마크다운으로 적어 `--read CONVENTIONS.md`(또는 `/read-only`)로 읽기 전용 추가하면, 그 내용이 세션 내내 컨텍스트에 포함돼 생성 코드에 반영된다. 예컨대 'requests 대신 httpx 사용', '가능한 곳엔 타입 명시' 같은 규칙을 적어두면 모델이 일관되게 따른다. 읽기 전용이라 prompt caching이 가능해 비용 면에서도 유리하다. `.aider.conf.yml`의 `read` 키에 넣으면 매 세션 자동 적용된다."
      },
      {
        "title": "헤드리스/배치 자동화와 Python API",
        "body": "`--message \"...\"`로 단발 지시 후 종료하거나 `--message-file`로 긴 지시를 파일에서 읽어 CI나 스크립트에 통합할 수 있다. 셸 루프로 다수 파일을 일괄 처리(예: `for f in *.py; do aider --message \"add docstrings\" \"$f\"; done`)하고, `--yes-always`, `--no-stream`, `--dry-run` 등으로 비대화형 동작을 제어한다. 더 세밀한 제어가 필요하면 `aider.coders.Coder`와 `aider.models.Model`을 import해 프로그래밍 방식으로 구동한다(단, Python API는 비공식이라 호환성 보장 없음)."
      },
      {
        "title": "내장 테스트·린트 자동 수정 루프",
        "body": "`--auto-test`와 `--test-cmd`, `--lint-cmd`를 설정하면 aider가 변경 후 자동으로 테스트·린트를 돌리고 실패를 스스로 고친다. 채팅 중에는 `/test pytest`로 실패 출력을 컨텍스트에 넣어 수정시키거나, `/lint`로 린트 문제를 일괄 정리할 수 있다. `/run`으로 임의 셸 명령 결과를 채팅에 붙여 디버깅 컨텍스트를 즉석에서 제공하는 것도 흔한 패턴이다. 변경→검증→자동수정이 한 루프로 돌아간다."
      },
      {
        "title": "멀티모달·웹 컨텍스트 주입",
        "body": "`/web <url>`로 외부 문서를 스크랩해 마크다운으로 채팅에 넣고, `/paste`로 클립보드의 스크린샷·이미지를 시각 컨텍스트로 추가한다. `/voice`로 음성 지시를 전사해 입력할 수도 있다. API 레퍼런스, 디자인 스펙, 에러 화면 등 코드 밖의 맥락을 끌어와 모델이 더 정확히 작업하게 만드는 데 유용하다. `/copy-context`는 현재 컨텍스트를 마크다운으로 내보내 다른 웹 LLM에 이어서 쓸 때 활용한다."
      }
    ],
    "tips": [
      "ask → code 흐름을 습관화하라: 먼저 /ask로 접근 방식을 논의·합의한 뒤 /code(또는 '그대로 진행해')로 실행하면 헛수고와 토큰 낭비가 크게 준다.",
      "채팅에 파일을 너무 많이 올리지 마라. repo map이 전체 구조를 보여주므로, 실제로 편집할 파일만 /add 하고 끝나면 /drop으로 내려 컨텍스트를 가볍게 유지한다. /tokens로 수시로 사용량을 확인하라.",
      "어려운 작업엔 architect 모드 + 모델 분리를 써라: 추론 강한 모델을 메인(architect), 편집 잘하는 빠른 모델을 --editor-model로 두면 정확도와 비용 효율이 함께 올라간다.",
      "팀 규칙은 CONVENTIONS.md에 적고 .aider.conf.yml의 read 키로 자동 주입하라. 매번 같은 지시를 반복하지 않아도 라이브러리 선호·타입 정책 등이 일관되게 적용된다.",
      "자동 커밋을 신뢰하되 /undo와 /diff를 안전망으로 써라. 결과가 어긋나면 /undo로 즉시 마지막 커밋을 롤백하고, 커밋 전 /diff로 변경을 검토하는 습관을 들인다.",
      "IDE를 계속 쓰고 싶다면 aider --watch-files를 백그라운드로 띄우고 코드에 'AI!'/'AI?' 코멘트만 달아라. 에디터를 떠나지 않고 변경을 트리거할 수 있다.",
      "CI나 일괄 작업은 --message / --message-file + --yes-always 조합으로 헤드리스 실행하고, 위험한 변경은 먼저 --dry-run으로 확인한 뒤 적용하라.",
      "모델·플래그가 헷갈리면 /settings로 현재 설정을 확인하고, 어떤 모델이 좋은지 모를 땐 Aider LLM leaderboards에서 최신 순위를 보고 고른다."
    ],
    "sourceUrls": [
      "https://aider.chat/",
      "https://aider.chat/docs/",
      "https://aider.chat/docs/install.html",
      "https://aider.chat/docs/usage/commands.html",
      "https://aider.chat/docs/config/options.html",
      "https://aider.chat/docs/config/aider_conf.html",
      "https://aider.chat/docs/usage/modes.html",
      "https://aider.chat/docs/repomap.html",
      "https://aider.chat/docs/usage/watch.html",
      "https://aider.chat/docs/llms.html",
      "https://aider.chat/docs/scripting.html",
      "https://aider.chat/docs/usage/conventions.html",
      "https://aider.chat/docs/leaderboards/",
      "https://github.com/aider-ai/aider"
    ]
  },
  {
    "id": "cli-manual-opencode",
    "slug": "opencode",
    "platform": "opencode",
    "tagline": "터미널을 위한 오픈소스 AI 코딩 에이전트 (모델 무관, TUI 기반)",
    "overview": "opencode는 터미널에서 동작하는 오픈소스 AI 코딩 에이전트로, Go로 만든 TUI(터미널 UI)를 통해 코드 작성, 디버깅, 리팩터링, 탐색을 대화형으로 수행한다. 특정 벤더에 종속되지 않는 \"모델 무관(provider-agnostic)\" 설계가 핵심이라 Models.dev 기반 75개 이상의 프로바이더(Anthropic Claude, OpenAI, Google, GitHub Copilot, OpenCode Zen, Ollama 등 로컬 모델 포함)를 자유롭게 갈아끼울 수 있다. 터미널 중심 워크플로를 선호하고, 자신의 구독/API 키로 여러 모델을 비교하며 쓰고 싶거나, MCP·서브에이전트·헤드리스 자동화까지 깊게 커스터마이즈하려는 개발자에게 특히 잘 맞는다.",
    "install": "설치 스크립트(권장):\n  curl -fsSL https://opencode.ai/install | bash\n\n패키지 매니저:\n  brew install sst/tap/opencode      # macOS / Linux (Homebrew)\n  npm i -g opencode-ai@latest        # npm\n  pnpm add -g opencode-ai@latest     # pnpm\n  bun add -g opencode-ai@latest      # bun\n\n설치 후 프로젝트 디렉터리에서 `opencode`만 입력하면 TUI가 실행된다. 업데이트는 `opencode upgrade`, 제거는 `opencode uninstall`. 참고로 npm/스크립트로 설치할 때 설치 방식을 고정하려면 `opencode upgrade --method npm` 처럼 지정할 수 있다.",
    "auth": "opencode는 사용자 본인의 구독/API 키로 동작한다(자체 종량제 없음, OpenCode Zen 제외).\n\nTUI 안에서: `/connect` 슬래시 명령으로 프로바이더를 추가한다. Anthropic을 고르면 Claude Pro/Max OAuth(브라우저 로그인)로 구독을 그대로 쓸 수 있고, OpenAI는 ChatGPT Plus/Pro OAuth 또는 API 키, GitHub Copilot은 device code 플로우, xAI Grok은 OAuth를 지원한다. OpenCode Zen은 `/connect`에서 선택 후 opencode.ai/auth 에서 키를 발급받는다.\n\n터미널에서: `opencode auth login` 으로 대화형 설정, `opencode auth list`로 등록된 프로바이더 확인, `opencode auth logout`으로 자격 증명 삭제. 자격 증명은 로컬 `~/.local/share/opencode/auth.json`에 저장된다. 기본 모델은 opencode.json의 `\"model\": \"provider/model-name\"`로 지정한다.",
    "commands": [
      {
        "command": "opencode",
        "description": "프로젝트 디렉터리에서 대화형 TUI를 실행한다(기본 동작).",
        "example": "cd my-project && opencode",
        "category": "세션"
      },
      {
        "command": "opencode -c / --continue",
        "description": "직전 세션을 이어서 시작한다. `-s <id>`로 특정 세션, `--fork`로 분기.",
        "example": "opencode -c",
        "category": "세션"
      },
      {
        "command": "opencode run \"<prompt>\"",
        "description": "TUI 없이 한 번의 프롬프트를 비대화형으로 실행한다(헤드리스/스크립트용).",
        "example": "opencode run \"이 함수에 단위 테스트 추가해줘\"",
        "category": "자동화"
      },
      {
        "command": "opencode run --format json",
        "description": "run 출력을 JSON으로 받아 파이프라인/CI에서 파싱한다.",
        "example": "opencode run \"버그 요약\" --format json",
        "category": "자동화"
      },
      {
        "command": "opencode run --dangerously-skip-permissions",
        "description": "모든 권한 프롬프트를 자동 승인한다. 무인 자동화 전용, 신뢰된 환경에서만.",
        "example": "opencode run \"lint 자동 수정\" --dangerously-skip-permissions",
        "category": "승인/권한"
      },
      {
        "command": "opencode -m / --model <provider/model>",
        "description": "이번 세션/실행에 사용할 모델을 지정한다(run/TUI 공통).",
        "example": "opencode -m anthropic/claude-sonnet-4-20250514",
        "category": "도구"
      },
      {
        "command": "opencode --agent <name>",
        "description": "시작 시 사용할 에이전트(예: plan, build)를 선택한다.",
        "example": "opencode --agent plan",
        "category": "도구"
      },
      {
        "command": "opencode auth login",
        "description": "프로바이더 API 키/OAuth를 대화형으로 설정한다. `-p`로 프로바이더 지정.",
        "example": "opencode auth login -p anthropic",
        "category": "승인/권한"
      },
      {
        "command": "opencode auth list / logout",
        "description": "인증된 프로바이더 목록 확인 / 자격 증명 삭제.",
        "example": "opencode auth list",
        "category": "승인/권한"
      },
      {
        "command": "opencode agent create",
        "description": "커스텀 에이전트를 대화형으로 생성한다(--mode, --model, --permissions, --description).",
        "example": "opencode agent create --mode subagent --description \"코드 리뷰어\"",
        "category": "도구"
      },
      {
        "command": "opencode agent list",
        "description": "사용 가능한 에이전트(빌트인+커스텀) 목록을 출력한다.",
        "example": "opencode agent list",
        "category": "도구"
      },
      {
        "command": "opencode models [provider]",
        "description": "사용 가능한 모델 목록을 보여준다. `--refresh`로 캐시 갱신, `--verbose` 상세.",
        "example": "opencode models anthropic --refresh",
        "category": "도구"
      },
      {
        "command": "opencode mcp add",
        "description": "MCP 서버를 등록한다. `mcp list`로 목록, `mcp auth <name>`로 OAuth 인증.",
        "example": "opencode mcp list",
        "category": "MCP"
      },
      {
        "command": "opencode mcp debug <name>",
        "description": "MCP 서버의 OAuth/연결 문제를 진단한다.",
        "example": "opencode mcp debug github",
        "category": "MCP"
      },
      {
        "command": "opencode serve",
        "description": "헤드리스 API 서버를 띄운다. `--port`/`--hostname`/`--cors`로 노출 제어.",
        "example": "opencode serve --port 4096",
        "category": "자동화"
      },
      {
        "command": "opencode attach",
        "description": "실행 중인 opencode 서버에 TUI를 원격으로 연결한다.",
        "example": "opencode attach --dir ~/proj -s <session>",
        "category": "세션"
      },
      {
        "command": "opencode session list / delete",
        "description": "세션 목록(`-n` 개수 제한, `--format json`) 조회 / 삭제.",
        "example": "opencode session list -n 20 --format json",
        "category": "세션"
      },
      {
        "command": "opencode export [sessionID]",
        "description": "세션을 JSON으로 내보낸다. `--sanitize`로 민감정보 마스킹.",
        "example": "opencode export --sanitize > session.json",
        "category": "메모리"
      },
      {
        "command": "opencode import <file>",
        "description": "파일이나 URL에서 세션을 가져온다.",
        "example": "opencode import session.json",
        "category": "메모리"
      },
      {
        "command": "opencode stats",
        "description": "토큰 사용량/비용 통계. `--days`, `--tools`, `--models`, `--project` 필터.",
        "example": "opencode stats --days 7 --models",
        "category": "자동화"
      },
      {
        "command": "opencode github install / run",
        "description": "GitHub 에이전트를 설치/실행한다. 이슈·PR에서 opencode를 호출하게 한다.",
        "example": "opencode github install",
        "category": "자동화"
      },
      {
        "command": "opencode upgrade [target]",
        "description": "지정 버전(또는 최신)으로 업데이트한다. `--method`로 설치 방식 지정.",
        "example": "opencode upgrade --method brew",
        "category": "자동화"
      },
      {
        "command": "/init",
        "description": "(TUI) 리포지토리를 스캔해 AGENTS.md 규칙 파일을 생성/보강한다.",
        "example": "/init",
        "category": "메모리"
      },
      {
        "command": "/connect",
        "description": "(TUI) 프로바이더를 추가하고 API 키/OAuth를 설정한다.",
        "example": "/connect",
        "category": "승인/권한"
      },
      {
        "command": "/sessions",
        "description": "(TUI) 세션 목록을 보고 전환한다(별칭 /resume, /continue).",
        "example": "/sessions",
        "category": "세션"
      },
      {
        "command": "/new",
        "description": "(TUI) 새 세션을 시작한다(별칭 /clear). 컨텍스트를 깨끗이 비운다.",
        "example": "/new",
        "category": "세션"
      },
      {
        "command": "/compact",
        "description": "(TUI) 현재 세션 대화를 요약·압축해 컨텍스트를 줄인다(별칭 /summarize).",
        "example": "/compact",
        "category": "메모리"
      },
      {
        "command": "/undo, /redo",
        "description": "(TUI) 마지막 메시지/파일 변경을 git 기반으로 되돌리거나 다시 적용한다.",
        "example": "/undo",
        "category": "도구"
      },
      {
        "command": "/share, /unshare",
        "description": "(TUI) 세션을 공개 URL로 공유하거나 공유를 해제한다.",
        "example": "/share",
        "category": "자동화"
      },
      {
        "command": "/models, /agent",
        "description": "(TUI) 모델 목록을 열거나 에이전트를 전환한다. Tab으로도 에이전트 전환.",
        "example": "/models",
        "category": "도구"
      },
      {
        "command": "/editor, /export",
        "description": "(TUI) 외부 편집기로 메시지 작성 / 대화를 Markdown으로 내보내 편집기로 연다.",
        "example": "/export",
        "category": "메모리"
      },
      {
        "command": "@<agent>",
        "description": "(TUI) 서브에이전트를 직접 호출한다(예: @general, @explore).",
        "example": "@explore 인증 로직이 어디 있는지 찾아줘",
        "category": "도구"
      }
    ],
    "features": [
      {
        "title": "모델 무관 프로바이더 (75+ via Models.dev)",
        "body": "opencode는 AI SDK와 Models.dev 카탈로그를 통해 75개 이상의 프로바이더를 지원한다. Anthropic Claude(Pro/Max OAuth), OpenAI, Google, GitHub Copilot, xAI Grok은 물론 Ollama·LM Studio·llama.cpp 같은 로컬 모델까지 OpenAI 호환 API로 붙인다. opencode.json의 `model`로 기본 모델을, `small_model`로 제목 생성·요약 같은 가벼운 작업용 저렴한 모델을 따로 지정하면 비용을 아낄 수 있다. TUI에서 ctrl+t로 모델 variant(예: 추론 강도)도 순환할 수 있다."
      },
      {
        "title": "Build / Plan 빌트인 에이전트 + 서브에이전트",
        "body": "기본 primary 에이전트는 두 개다. Build는 모든 도구가 켜진 표준 개발용, Plan은 파일 편집과 bash가 기본 ask 권한으로 묶여 의도치 않은 변경을 막는 분석/설계 전용이다. 큰 변경 전에는 `--agent plan` 또는 Tab으로 Plan에 먼저 들어가 계획을 잡고 Build로 전환하는 흐름이 안전하다. 빌트인 서브에이전트로 General(병렬 다단계 작업), Explore(읽기 전용 코드 탐색), Scout(외부 문서·의존성 조사)가 있고, `@general` 처럼 멘션해 직접 호출하거나 primary가 Task 도구로 자동 위임한다."
      },
      {
        "title": "커스텀 에이전트 (markdown + frontmatter)",
        "body": "에이전트는 `.opencode/agents/`(프로젝트) 또는 `~/.config/opencode/agents/`(전역)에 markdown 파일로 정의하며 파일명이 곧 에이전트 ID가 된다. frontmatter에 `description`, `mode`(primary/subagent/all), `model`, `temperature`, `top_p`, `steps`(최대 반복), `permission`, `color`, `hidden`, `disable`를 지정하고 본문에 시스템 프롬프트를 적는다. `opencode agent create`로 대화형 생성도 가능하며, opencode.json의 `agent` 객체에 JSON으로도 선언할 수 있다. 코드 리뷰어, 문서 작성기처럼 역할별로 권한과 모델을 분리해 두면 작업 안정성이 크게 올라간다."
      },
      {
        "title": "세분화된 권한 시스템",
        "body": "도구 접근은 `allow`(바로 실행) / `ask`(승인 요청) / `deny`(비활성) 세 상태로 게이팅된다. read, edit, bash, glob, grep, webfetch, websearch, task, todowrite, lsp, skill, external_directory 등 카테고리별로 제어하고, bash는 패턴 단위로 잠글 수 있다. 예: `\"bash\": { \"*\": \"ask\", \"git status *\": \"allow\", \"git push\": \"deny\" }`. `permission.task`에 glob을 줘서 어떤 서브에이전트를 호출할 수 있는지도 제한한다. 무인 자동화에서는 `opencode run --dangerously-skip-permissions`로 전부 자동 승인하되 신뢰된 환경에서만 쓴다."
      },
      {
        "title": "MCP 서버 (local stdio / remote http)",
        "body": "opencode.json(또는 .jsonc)의 `mcp` 객체에 서버를 등록한다. local 타입은 `command: [\"npx\", \"-y\", \"...\"]`로 stdio 프로세스를 띄우고 `environment`·`cwd`·`timeout`을 지정할 수 있으며, remote 타입은 `url`과 `headers`(예: Authorization, `{env:VAR}` 치환 지원)로 HTTP/SSE 엔드포인트에 붙는다. 등록된 MCP 도구는 LLM과 에이전트에 자동 노출되고, 최상위 `tools` 또는 에이전트별 `tools`에서 glob(`*`, `?`)으로 켜고 끌 수 있다. OAuth가 필요한 서버는 `opencode mcp auth <name>`로 인증하고 문제 시 `opencode mcp debug <name>`로 진단한다."
      },
      {
        "title": "AGENTS.md 규칙 파일 + /init",
        "body": "프로젝트 루트의 `AGENTS.md`에 빌드/테스트 명령, 아키텍처, 컨벤션, 함정 등을 적어두면 매 세션 컨텍스트에 자동 주입된다. `/init`을 실행하면 리포를 스캔해 이 파일을 생성하거나 기존 파일을 제자리에서 보강한다. 전역 규칙은 `~/.config/opencode/AGENTS.md`에 두며, 검색 우선순위는 로컬 AGENTS.md/CLAUDE.md → 전역 AGENTS.md → `~/.claude/CLAUDE.md`(Claude Code 호환) 순이다. opencode.json의 `instructions` 배열로 `docs/guidelines.md`나 `packages/*/AGENTS.md` 같은 외부 파일(glob·로컬·원격 URL)을 추가로 끌어올 수 있다."
      },
      {
        "title": "커스텀 슬래시 명령",
        "body": "자주 쓰는 프롬프트를 `.opencode/commands/`(또는 전역 `~/.config/opencode/commands/`)에 markdown으로 만들면 파일명이 그대로 슬래시 명령이 된다(test.md → /test). frontmatter로 `description`, `agent`, `model`, `subtask`(서브에이전트 강제)를 지정하고, 본문에서 `$ARGUMENTS`/`$1`·`$2` 인자, ``!`git log --oneline -10` `` 셸 출력 주입, `@src/foo.ts` 파일 참조를 쓸 수 있다. 빌트인 `/init`, `/undo` 같은 명령도 덮어쓸 수 있어 팀 워크플로를 표준화하기 좋다."
      },
      {
        "title": "헤드리스 자동화 (run / serve / acp)",
        "body": "`opencode run \"<prompt>\"`은 TUI 없이 한 번의 작업을 실행하는 비대화형 모드로, `--format json`으로 출력을 파싱하고 `--continue`/`--session`으로 세션을 이어가 CI·스크립트·cron에 넣기 좋다. `opencode serve`는 헤드리스 HTTP API 서버를 띄워 외부 클라이언트가 프로그램적으로 세션을 다루게 하고, `opencode attach`로 실행 중인 서버에 TUI를 원격 연결한다. `opencode acp`(Agent Client Protocol)와 `opencode github` 통합으로 에디터·GitHub 이슈/PR 워크플로에 에이전트를 임베드할 수 있다."
      },
      {
        "title": "세션 관리·공유·되돌리기",
        "body": "모든 작업은 세션으로 저장되어 `/sessions`(또는 `opencode session list`)로 전환·재개하고, `/compact`로 긴 대화를 요약 압축해 컨텍스트 한도를 관리한다. 파일 변경은 git 기반으로 추적되어 `/undo`·`/redo`로 안전하게 되돌릴 수 있다. `/share`는 세션을 `opncd.ai/s/<id>` 공개 URL로 공유하고 `/unshare`로 해제·삭제하며, opencode.json의 `share`를 `manual`(기본)/`auto`/`disabled`로 설정한다. 민감 코드가 있는 리포는 `share: \"disabled\"`로 잠그거나 엔터프라이즈 self-host 공유 서버를 쓰는 게 안전하다."
      },
      {
        "title": "생산성 높은 TUI",
        "body": "TUI는 leader 키(기본 ctrl+x) 기반 단축키 체계를 갖췄다. ctrl+x n(새 세션), c(압축), u/r(undo/redo), m(모델), t(테마), ctrl+p(명령 팔레트), ctrl+t(모델 variant 순환). 입력창에서 `@`로 파일 퍼지 검색·서브에이전트 멘션, `!` 접두로 bash 명령 직접 실행이 가능하다. 외부 편집기(`EDITOR` 환경변수)로 긴 메시지를 작성하고, 데스크톱 알림·사운드·테마·키바인드를 모두 커스터마이즈할 수 있다."
      }
    ],
    "tips": [
      "Plan 에이전트로 먼저 설계를 받고 검토한 뒤 Tab으로 Build로 전환해 실행하면, 의도치 않은 파일 편집/명령 실행을 구조적으로 막을 수 있다.",
      "`small_model`을 저렴한 모델로 지정하면 세션 제목 생성·요약 같은 잡일에 비싼 모델을 쓰지 않아 비용이 크게 줄어든다.",
      "긴 작업 중 응답이 느려지거나 컨텍스트가 가득 차면 `/compact`로 대화를 압축하거나 `/new`로 세션을 새로 열어 토큰을 절약하라.",
      "bash 권한은 `{ \"*\": \"ask\", \"git push\": \"deny\" }` 식 패턴으로 잠가두면, 자동화 중에도 위험한 명령(push, rm 등)만 선별 차단할 수 있다.",
      "Claude Code를 쓰던 리포라면 기존 `CLAUDE.md`가 그대로 규칙으로 인식되므로 마이그레이션 없이 바로 시작할 수 있다(검색 우선순위에 포함됨).",
      "무인 CI 작업은 `opencode run \"...\" --format json --dangerously-skip-permissions`로 돌리되, 반드시 신뢰된 격리 환경(컨테이너 등)에서만 실행하라.",
      "자주 반복하는 지시는 `.opencode/commands/`에 커스텀 슬래시 명령으로 만들고 `$ARGUMENTS`·``!`shell` ``·`@file`을 조합하면 팀 전체가 같은 워크플로를 재사용할 수 있다.",
      "민감한 코드베이스에서는 opencode.json에 `\"share\": \"disabled\"`를 박아 실수로 외부에 세션이 노출되는 것을 원천 차단하라."
    ],
    "sourceUrls": [
      "https://opencode.ai/docs/",
      "https://opencode.ai/docs/cli/",
      "https://opencode.ai/docs/tui/",
      "https://opencode.ai/docs/agents/",
      "https://opencode.ai/docs/mcp-servers/",
      "https://opencode.ai/docs/rules/",
      "https://opencode.ai/docs/providers/",
      "https://opencode.ai/docs/commands/",
      "https://opencode.ai/docs/share/"
    ]
  },
  {
    "id": "cli-manual-windsurf",
    "slug": "windsurf",
    "platform": "Windsurf",
    "tagline": "Cascade 에이전트를 중심에 둔 AI 네이티브 IDE (구 Codeium, 현 Cognition/Devin Desktop)",
    "overview": "Windsurf는 Codeium이 만든 AI 네이티브 IDE로, 핵심에는 멀티파일 편집과 터미널 명령 실행을 코드베이스 전체 맥락에서 자율적으로 수행하는 에이전트 Cascade가 있다. 2024년 Codeium에서 Windsurf로 리브랜딩됐고 이후 Cognition(Devin 제작사)에 인수되어 현재는 'Devin Desktop'으로도 불리며, 공식 문서가 docs.windsurf.com에서 docs.devin.ai로 리다이렉트된다. VS Code 기반이라 기존 워크플로를 그대로 쓰면서 자율 에이전트를 도입하려는 개인 개발자부터, Rules/Hooks/MCP로 팀 규약과 가드레일을 강제하려는 엔터프라이즈 팀까지에게 적합하다.",
    "install": "macOS/Windows/Linux용 공식 데스크톱 앱을 windsurf.com에서 내려받아 설치한다. 명령줄에서 프로젝트를 열려면 앱 내 Command Palette에서 \"Shell Command: Install 'windsurf' command in PATH\"를 실행해 `windsurf` 명령을 PATH에 등록한 뒤, `windsurf .` 처럼 사용한다. (참고: 일부 환경에서는 `curl -sSf https://get.windsurf.com/install.sh | bash` 형태의 설치 스크립트도 제공된다.) 데스크톱 앱은 헤드리스/CI 환경은 지원하지 않으며, 완전 자동화가 필요하면 Cognition의 Devin 자동화 제품 라인을 별도로 검토해야 한다.",
    "auth": "앱을 처음 실행하면 Windsurf(Codeium/Devin) 계정으로 로그인하라는 화면이 뜬다. 브라우저 기반 OAuth 흐름으로 로그인하면 자동으로 에디터로 토큰이 전달되어 인증이 완료된다. 계정은 무료(Free), Pro, Teams, Enterprise 플랜으로 나뉘며 사용 가능한 모델과 크레딧, 관리자 기능(조직 단위 Allow/Deny 리스트, 대화 공유 등)이 플랜에 따라 달라진다. MCP 서버 인증은 별도로 stdio의 `env`/`headers` 또는 OAuth를 통해 처리한다.",
    "commands": [
      {
        "command": "windsurf .",
        "description": "현재 디렉터리를 Windsurf 에디터로 연다. PATH에 windsurf 명령을 먼저 설치해야 한다.",
        "example": "windsurf .",
        "category": "세션"
      },
      {
        "command": "windsurf <path>",
        "description": "지정한 파일이나 프로젝트 폴더를 Windsurf로 연다.",
        "example": "windsurf ~/projects/my-app",
        "category": "세션"
      },
      {
        "command": "Cmd/Ctrl+L",
        "description": "Cascade 패널을 연다(에디터에서 에이전트 대화 시작).",
        "example": "Cmd+L",
        "category": "세션"
      },
      {
        "command": "Cmd/Ctrl+I",
        "description": "Command(인라인) 모드 호출. 에디터에서는 자연어로 코드 생성/수정, 터미널에서는 자연어를 CLI 명령으로 변환. 프리미엄 크레딧을 소모하지 않는다.",
        "example": "# 터미널에서 Cmd+I 후: \"clone this repo and install deps\"",
        "category": "도구"
      },
      {
        "command": "Cmd/Ctrl+Enter",
        "description": "Command가 생성한 인라인 변경을 수락(Accept)하거나 Command 프롬프트를 제출한다.",
        "example": "Cmd+Enter",
        "category": "승인/권한"
      },
      {
        "command": "Cmd/Ctrl+Delete",
        "description": "Command가 생성한 인라인 변경을 거절(Reject)한다.",
        "example": "Cmd+Delete",
        "category": "승인/권한"
      },
      {
        "command": "/<workflow-name>",
        "description": "Cascade에서 워크플로(슬래시 명령)를 실행한다. .windsurf/workflows/<name>.md 파일이 슬래시 명령이 된다. 자동 실행은 절대 되지 않고 사용자가 직접 호출해야 한다.",
        "example": "/deploy-staging",
        "category": "자동화"
      },
      {
        "command": "@<rule-name>",
        "description": "trigger: manual로 설정된 Rule을 명시적으로 활성화해 현재 프롬프트에 주입한다.",
        "example": "@typescript-strict 이 모듈 리팩터해줘",
        "category": "메모리"
      },
      {
        "command": "@<terminal>",
        "description": "활성 터미널을 @-멘션으로 참조해 해당 터미널 출력에 대해 Cascade와 대화한다.",
        "example": "@terminal 이 에러 원인 찾아줘",
        "category": "도구"
      },
      {
        "command": "@<past-conversation>",
        "description": "이전 대화/체크포인트를 @-멘션으로 참조해 요약 맥락을 현재 대화로 가져온다.",
        "example": "@conversation 어제 인증 작업",
        "category": "세션"
      },
      {
        "command": "create a memory of ...",
        "description": "Cascade에게 현재 맥락을 메모리로 저장하도록 요청한다. 자동 생성 메모리와 함께 ~/.codeium/windsurf/memories/ 에 저장되며 크레딧을 소모하지 않는다.",
        "example": "create a memory of: 이 레포는 pnpm을 쓰고 frozen-lockfile 필수",
        "category": "메모리"
      },
      {
        "command": "Revert / Checkpoint",
        "description": "대화 중 특정 시점으로 코드베이스를 되돌린다(Revert, 비가역). Named Checkpoint로 상태 스냅샷을 만들어 탐색/복원에 쓸 수 있다.",
        "example": "Cascade 메시지 위의 Revert 버튼 클릭",
        "category": "세션"
      },
      {
        "command": "windsurf.cascadeCommandsAllowList",
        "description": "자동 실행을 항상 허용할 터미널 명령 목록. Command Palette > Settings 에서 검색해 설정한다(예: git 추가 시 모든 git 하위명령 자동 실행).",
        "example": "setting에 \"git\", \"pnpm\" 추가",
        "category": "승인/권한"
      },
      {
        "command": "windsurf.cascadeCommandsDenyList",
        "description": "절대 자동 실행하지 않을 터미널 명령 목록. Deny가 Allow보다 우선한다(예: rm 추가 시 삭제는 항상 승인 요구).",
        "example": "setting에 \"rm\", \"curl\" 추가",
        "category": "승인/권한"
      },
      {
        "command": "Auto-Execution Level: Disabled",
        "description": "모든 명령이 수동 승인 필요(가장 보수적).",
        "example": "Settings(우측 하단) > Auto-execution: Disabled",
        "category": "승인/권한"
      },
      {
        "command": "Auto-Execution Level: Allowlist Only",
        "description": "Allow 리스트에 있는 명령만 자동 실행, 나머지는 승인 필요.",
        "example": "Settings > Auto-execution: Allowlist Only",
        "category": "승인/권한"
      },
      {
        "command": "Auto-Execution Level: Auto",
        "description": "Cascade가 안전성을 판단해 실행, 위험 명령은 여전히 승인 요구(프리미엄 모델 전용).",
        "example": "Settings > Auto-execution: Auto",
        "category": "승인/권한"
      },
      {
        "command": "Auto-Execution Level: Turbo",
        "description": "Deny 리스트를 제외한 모든 명령을 즉시 실행(가장 자율적, 주의 필요).",
        "example": "Settings > Auto-execution: Turbo",
        "category": "승인/권한"
      },
      {
        "command": "MCP 추가 (deeplink)",
        "description": "windsurf:// 딥링크로 MCP 서버를 원클릭 설치한다.",
        "example": "windsurf://windsurf-mcp-registry?serverName=github",
        "category": "MCP"
      },
      {
        "command": "@docs / Web Search",
        "description": "Cascade가 웹을 검색해 최신 정보를 답변에 참조하도록 한다.",
        "example": "@web 최신 Next.js 15 라우팅 변경점 반영해줘",
        "category": "도구"
      }
    ],
    "features": [
      {
        "title": "Cascade 에이전트 (Write/Chat 모드)",
        "body": "Cascade는 코드베이스 전체를 인지하는 자율 에이전트로, Code(Write) 모드는 멀티파일 생성·수정과 도구 호출까지 직접 수행하고 Chat 모드는 코드/원리 질문에 답하며 변경안을 제안만 한다. 프롬프트당 최대 20개 도구 호출을 지원하고, 한도에 닿으면 Auto-Continue로 작업을 이어간다. Real-time Awareness 덕분에 직전에 사용자가 한 편집/이동을 별도 설명 없이 인지하므로, 매번 맥락을 다시 설명할 필요가 없다."
      },
      {
        "title": "Plan Mode와 자동 계획 수립",
        "body": "복잡한 작업에서는 백그라운드의 전용 플래닝 에이전트가 장기 계획을 지속적으로 다듬고, 선택한 모델은 그 계획에 맞춰 단기 행동을 수행한다. Plan Mode를 켜면 코드 생성 전에 단계별 계획을 먼저 검토·수정할 수 있어 잘못된 방향에 토큰을 낭비하지 않는다. 파일 3개 이상을 건드리거나 아키텍처 결정이 얽힌 작업은 Plan Mode부터 시작하는 것이 정석이고, 대화 안의 Todo 리스트로 진행 상황을 추적한다."
      },
      {
        "title": "Workflows (재사용 슬래시 명령)",
        "body": "Workflows는 PR 리뷰·배포·테스트 같은 반복 절차를 마크다운으로 정의한 재사용 레시피로, .windsurf/workflows/*.md(워크스페이스, 레포 커밋) 또는 ~/.codeium/windsurf/global_workflows/*.md(전역)에 저장된다. Cascade에서 /workflow-name 슬래시 명령으로만 호출되며 절대 자동 실행되지 않고, 워크플로 안에서 다른 워크플로를 부를 수도 있다. 파일당 12,000자 제한이 있으니 길어지면 워크플로를 잘게 쪼개 서로 호출하게 구성하라. 우선순위는 System > Workspace > Global > Built-in."
      },
      {
        "title": "Rules (규약·가드레일)",
        "body": "Rules는 Cascade의 행동을 강제하는 수동 지시문으로, 워크스페이스는 .windsurf/rules/*.md(또는 .windsurfrules, 신형은 .devin/rules/*.md), 전역은 ~/.codeium/windsurf/memories/global_rules.md에 둔다. 프런트매터의 trigger 값으로 활성화 방식을 고른다: always_on(항상), model_decision(모델이 필요 판단), glob(파일 패턴 매칭 시), manual(@rule-name 멘션 시). 전역 규칙은 6,000자, 워크스페이스 규칙은 파일당 12,000자 제한이며, 늘 켜둘 규칙만 always_on으로 두고 나머지는 glob/manual로 두어야 컨텍스트 비용이 폭증하지 않는다."
      },
      {
        "title": "Memories (자동 기억)",
        "body": "Cascade는 유용하다고 판단한 맥락을 자동으로 메모리로 저장하고 관련 상황에서 다시 불러온다. \"create a memory of ...\"로 사용자가 직접 저장을 지시할 수도 있다. 메모리는 ~/.codeium/windsurf/memories/ 에 로컬·워크스페이스 단위로 저장되어 프로젝트 간 이동이나 버전 관리 동기화는 되지 않는다. 자동 생성 메모리는 크레딧을 소모하지 않으니, 팀 공유가 필요한 규약은 Memories가 아니라 레포에 커밋되는 Rules로 관리하는 게 맞다."
      },
      {
        "title": "MCP (Model Context Protocol) 연동",
        "body": "외부 도구·데이터 소스를 Cascade 맥락에 직접 연결한다. 설정 파일은 ~/.codeium/windsurf/mcp_config.json이며 stdio(로컬 프로세스), Streamable HTTP(원격), SSE 세 가지 전송 방식과 OAuth 인증을 지원한다. Cascade의 가용 도구는 동시 최대 100개로 제한되므로 MCP Marketplace에서 필요한 서버만 설치하고 도구를 개별 토글해 한도를 관리해야 한다. 설정 파일은 ${env:VAR_NAME}, ${file:/path}(~ 지원) 보간을 지원해 토큰을 평문으로 박지 않고 환경변수/파일로 주입할 수 있다."
      },
      {
        "title": "Cascade Hooks (생애주기 자동화)",
        "body": "Hooks는 에이전트 워크플로의 핵심 시점에 실행되는 셸 명령으로, 로깅·가드레일·검증·외부 연동에 쓴다. .windsurf/hooks.json(워크스페이스), ~/.codeium/windsurf/hooks.json(유저), OS별 시스템 경로(엔터프라이즈)에 두며 system→user→workspace 순으로 병합된다. pre_read_code/post_read_code, pre_write_code/post_write_code, pre_run_command/post_run_command, pre_mcp_tool_use/post_mcp_tool_use, pre_user_prompt, post_cascade_response 등 12개 이벤트를 지원한다. pre_* 훅이 종료 코드 2를 반환하면 해당 행동을 차단할 수 있어, 예컨대 민감 파일 읽기/위험 명령 실행을 코드로 막을 수 있다."
      },
      {
        "title": "터미널 통합과 명령 실행 제어",
        "body": "터미널에서 Cmd/Ctrl+I를 누르면 자연어를 올바른 CLI 구문으로 변환하고, Cascade는 사용자 권한 하에 직접 명령을 실행한다. 스택 트레이스를 드래그해 Cmd/Ctrl+L로 보내거나 @terminal 멘션으로 활성 터미널에 대해 대화할 수 있다. 자동 실행은 Disabled / Allowlist Only / Auto / Turbo 4단계로 제어하고, windsurf.cascadeCommandsAllowList와 DenyList로 명령 단위 화이트/블랙리스트를 건다(Deny가 항상 우선). 팀/엔터프라이즈는 관리자 포털에서 조직 전체 리스트를 강제할 수 있다."
      },
      {
        "title": "병렬 Cascade와 Git Worktree 격리",
        "body": "여러 Cascade 인스턴스를 동시에 띄워 서로 다른 작업을 병렬로 진행할 수 있고, 각 에이전트가 독립된 Git worktree에서 동작해 파일 편집이 충돌하지 않는다. post_setup_worktree 훅으로 worktree 생성 직후 의존성 설치 같은 초기화를 자동화할 수 있다. 큰 리팩터와 버그 수정을 동시에 돌릴 때 worktree 격리를 켜두면 한쪽 변경이 다른 쪽을 오염시키지 않는다."
      },
      {
        "title": "모델 선택과 Arena Mode",
        "body": "입력창 아래 드롭다운에서 모델을 고르며, 자체 에이전트 모델 SWE-1.5/1.6(Claude 4.5급 성능을 훨씬 빠른 속도로 제공, 기본값)과 Claude(Opus/Sonnet 계열), GPT-5 계열 등을 플랜에 따라 쓸 수 있다. Arena Mode는 같은 프롬프트에 두 모델이 응답하게 한 뒤 블라인드로 더 나은 결과에 투표하는 비교 기능으로, 브랜드 선입견 없이 작업별 최적 모델을 고르는 데 유용하다. 빠른 반복(바이브 코딩)에는 SWE-1.x Fast, 까다로운 아키텍처 판단에는 프런티어 모델로 갈아타는 식으로 운용하라."
      },
      {
        "title": "Command 인라인 편집과 Linter 연동",
        "body": "Cmd/Ctrl+I로 부르는 Command는 선택 영역이 있으면 그 코드를 수정, 없으면 커서 위치에 새 코드를 생성하는 파일 단위 인라인 편집기다. 핵심은 프리미엄 모델 크레딧을 전혀 소모하지 않는다는 점이라, 작은 수정은 Cascade 대신 Command로 처리하면 크레딧을 아낀다. 또한 Linter Integration이 기본 켜져 있어 Cascade가 만든 코드의 린트 오류를 자동으로 고치고, 에디터 Problems 패널의 오류를 'Send to Cascade'로 바로 넘겨 수정시킬 수 있다."
      }
    ],
    "tips": [
      "팀 공유가 필요한 규약은 로컬·비동기화인 Memories가 아니라 레포에 커밋되는 .windsurf/rules/*.md(Rules)로 관리하라. always_on은 컨텍스트 비용이 매 메시지마다 들어가므로 정말 항상 필요한 규칙만 always_on으로, 나머지는 glob/manual로 둔다.",
      "Turbo 자동 실행을 켤 거라면 반드시 DenyList에 rm, curl, git push --force 같은 파괴적/네트워크 명령을 먼저 등록하라. Deny는 Allow보다 우선하므로 안전망이 된다. 더 확실하게는 pre_run_command 훅에서 종료 코드 2로 위험 명령을 코드로 차단할 수 있다.",
      "작은 인라인 수정은 Cascade(크레딧 소모) 대신 Cmd/Ctrl+I Command로 처리하면 프리미엄 크레딧을 아낄 수 있다. 자동 생성 메모리와 Command는 크레딧을 소모하지 않는다.",
      "파일 3개 이상이나 아키텍처가 걸린 작업은 곧장 코딩시키지 말고 Plan Mode로 단계 계획을 먼저 검토·수정한 뒤 실행시켜 잘못된 방향의 토큰 낭비를 막아라.",
      "워크플로 파일은 12,000자 제한이 있으니, 긴 절차는 작은 워크플로로 쪼개고 /sub-workflow 호출로 조립하라. 워크플로는 절대 자동 실행되지 않으니 CI 같은 자동화가 필요하면 Hooks(post_cascade_response 등)나 외부 트리거를 써야 한다.",
      "MCP 가용 도구는 동시 최대 100개 제한이므로 안 쓰는 서버/도구는 토글로 꺼라. mcp_config.json에 토큰을 평문으로 박지 말고 ${env:VAR_NAME} 또는 ${file:~/path} 보간으로 주입하라.",
      "큰 작업을 병렬로 돌릴 때는 Git worktree 격리를 켠 다중 Cascade를 쓰고, post_setup_worktree 훅으로 의존성 설치 등 초기화를 자동화하면 충돌 없이 동시 작업이 가능하다.",
      "어떤 모델을 쓸지 애매하면 Arena Mode로 두 모델을 블라인드 비교해 해당 작업 유형에 강한 모델을 데이터로 정하라."
    ],
    "sourceUrls": [
      "https://docs.windsurf.com/windsurf/cascade/cascade",
      "https://docs.devin.ai/desktop/cascade/cascade",
      "https://docs.devin.ai/desktop/cascade/workflows",
      "https://docs.devin.ai/desktop/cascade/memories",
      "https://docs.devin.ai/desktop/cascade/mcp",
      "https://docs.devin.ai/desktop/cascade/hooks",
      "https://docs.devin.ai/desktop/terminal",
      "https://docs.devin.ai/desktop/command/windsurf-overview",
      "https://docs.windsurf.com/plugins/cascade/models",
      "https://windsurf.com/cascade",
      "https://www.digitalapplied.com/blog/windsurf-wave-13-arena-mode-plan-mode-swe-1-5-guide"
    ]
  }
]

/** 명령 카테고리 목록(데이터에 등장하는 순서 보존, 중복 제거). */
export function getCliManualBySlug(slug: string): CliToolManual | undefined {
  return cliToolManuals.find((manual) => manual.slug === slug)
}
