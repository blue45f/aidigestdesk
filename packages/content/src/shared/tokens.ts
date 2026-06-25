// 캐노니컬 디자인 토큰 — 웹·토스가 같은 브랜드 시각 정체성을 갖게 하는 단일 소스.
// 브랜드/시맨틱 색은 여기서 정의하고, 토스(theme.ts)는 직접 import,
// 웹(styles/index.css @theme)은 같은 색 계열(블루 hue~250·앰버·그린·레드)을 미러한다.
// 의존성 0. (라이트/다크·플랫폼 폼팩터에 따라 명도는 각 앱이 보정하되 hue·시맨틱은 공유.)

/** 브랜드 액센트 — AI/사이버 블루(토스 콘솔 등록색 #6EA8FE, 양 앱 IntroSplashScreen과 동일 계열). */
export const brandTokens = {
  /** 1차 액센트(토스 다크 기준 hex). 웹은 라이트/다크 명도에 맞춘 같은 블루 계열. */
  accent: '#6ea8fe',
  /** 액센트 위 텍스트(딥 네이비). */
  accentInk: '#06122a',
  /** 액센트 연한 배경(hover/active pill 등). */
  accentSoft: 'rgba(110,168,254,0.16)',
} as const;

/** 시맨틱 색 — 상태/등급에 공유(웹 accent-3/4·토스 등급팔레트와 같은 계열). */
export const semanticTokens = {
  success: '#74d6a3', // 그린 — 진행중/해결됨
  warn: '#f5c842', // 앰버 — 예정/처리중/B등급
  danger: '#ff6b6b', // 레드 — 종료/오류
  neutral: '#94a6c4', // 블루그레이 — 보조 텍스트/C등급
} as const;

/** 공유 형태 토큰. */
export const shapeTokens = {
  /** 카드/버튼 라운드(px). */
  radius: 16,
} as const;
