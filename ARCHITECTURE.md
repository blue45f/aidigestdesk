# AIDigestDesk 아키텍처 — 웹·토스 코드/데이터 공유 구조

웹(`apps/web`)과 토스 미니앱(`apps/toss`)은 **데이터와 로직을 단일 소스로 공유**하고,
**플랫폼 정책상 불가피한 경우(스타일 메커니즘·토스 네이티브 API)에만 분기**한다.

```
packages/content                ← 단일 진실의 원천(SSOT)
├── src/catalog.ts 등           ← 모든 작품/콘텐츠 데이터(모델·벤치마크·updates·deals·extensions·glossary…)
├── src/cliManuals.ts           ← CLI 매뉴얼(catalog 를 type 으로만 참조 → 런타임 의존 0)
└── src/shared/*                ← 순수 로직·계약(의존성 0, 뷰 없음)
        sound·bgm·burst·clipboard·dragScroll·tokens   (효과/오디오/이펙트)
        createBookmarkStore·favorites·sort·parse·time  (상태·정렬·파싱)
        inquiry·community                              (도메인 로직)

apps/web    ← Tailwind 렌더 셸(웹 UX)        apps/toss ← 인라인 스타일+TDS 렌더 셸(토스 UX)
   components/app/*  (Tailwind className)        pages/*, ui.tsx  (theme.ts 인라인 + TDS Top/Button)
```

## 데이터 공유 (이원화 금지)

`packages/content` 가 **유일한 데이터 소스**다. 토스는 거대 catalog 를 번들하지 않으므로 두 경로로 가져온다.

| 데이터 | 토스 접근 방식 | 드리프트 방지 |
|---|---|---|
| CLI 매뉴얼 | `@aidigestdesk/content/cliManuals` **직접 import**(self-contained 서브패스) | 컴파일 타임 동일 소스 |
| 랭킹·extras·소식 | 빌드 시 content 에서 **생성**(`generate-toss-*` → `*.json`) | `build:ait` 의 `predata` 훅이 매 빌드 재생성 → 스테일 포크 불가능 |

> 새 데이터를 토스에 노출할 때: catalog 직접 import 가능하면(서브패스가 self-contained) 그렇게,
> 아니면 `packages/content/scripts/generate-toss-*.mjs` 에 생성기를 추가하고 `generate:toss-data` 에 연결한다.
> **토스에 데이터를 수기로 복제하지 말 것**(드리프트 발생).

## 코드 공유 원칙

1. **로직·계약·view-model 은 전부 `content/shared`** — 정렬·필터·파싱·상태·CRUD·도메인 규칙.
   `if (isToss)` 분기를 로직에 넣지 않는다. 한 번 고치면 양쪽 반영.
2. **뷰는 플랫폼별 얇은 셸** — 같은 shared 데이터/로직을 웹은 Tailwind 로, 토스는 인라인+TDS 로 *렌더만* 다르게.
   (웹 컴포넌트를 토스에 그대로 못 쓰는 이유: Tailwind 런타임 부재 + 비게임 미니앱의 TDS UX 기대 + catalog 번들.)
3. **효과/오디오/이펙트도 shared** — `sound`·`bgm`·`burst`·`tapRipple`·`dragScroll`·`clipboard` 는 순수 DOM/Web Audio 라
   양쪽이 동일 함수를 호출하고, 각 앱은 트리거만 연결(웹=전역 리스너, 토스=전역 리스너+`haptic`).

## 토스 정책 분기(불가피한 경우만)

아래만 토스 전용 코드를 둔다. 그 외에는 공유한다.

- **스타일 메커니즘** — 토스는 `theme.ts` 인라인 + TDS(`Top`·`Button`). 비게임 미니앱은 TDS UX 를 따른다.
- **네이티브 API** — `lib/ads`(TossAds)·`lib/haptic`(generateHapticFeedback)·`lib/links`(openURL)·`lib/toss`(env·share).
- **번들 제약** — catalog 직접 import 대신 생성 JSON(위 표).

## CI

- `apps/web`·`deskcloud` 모두 PR/푸시에서 CI(typecheck·lint·test·번들예산) 통과 필수.
- 토스 데이터 변경 시 `pnpm --filter @aidigestdesk/toss run build:ait` 가 `predata` 로 자동 재생성하므로
  커밋된 `*.json` 은 항상 content 와 동기 상태여야 한다(재생성 후 diff 0).
