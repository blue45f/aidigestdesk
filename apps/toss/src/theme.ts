import { brandTokens, semanticTokens, shapeTokens } from '@aidigestdesk/content/shared';

// 중립 색(bg/surface/text/border/알파)은 index.css의 CSS 변수로 위임 → prefers-color-scheme 로
// 라이트/다크 자동 전환(토스 앱 테마 반영). 브랜드·형태 토큰은 공유 소스(웹과 동일 정체성).
export const theme = {
  bg: 'var(--c-bg)',
  surface: 'var(--c-surface)',
  surfaceAlt: 'var(--c-surface-2)',
  border: 'var(--c-border)',
  borderStrong: 'var(--c-border-2)',
  text: 'var(--c-text)',
  textMuted: 'var(--c-text-muted)',
  faint: 'var(--c-faint)',
  mute: 'var(--c-mute)',
  soft: 'var(--c-soft)',
  accent: brandTokens.accent,
  accentSoft: brandTokens.accentSoft,
  accentInk: brandTokens.accentInk,
  danger: semanticTokens.danger,
  radius: shapeTokens.radius,
} as const;
export const pageShell: React.CSSProperties = { maxWidth: 520, margin: '0 auto', padding: '4px 16px 40px' };
