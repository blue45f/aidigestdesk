import { brandTokens, semanticTokens, shapeTokens } from '@aidigestdesk/content/shared';

// 브랜드·시맨틱·형태 토큰은 공유(웹과 동일 정체성). bg/surface 등 다크 중립은
// 토스 모바일 폼팩터 전용이라 여기서만 정의한다.
export const theme = {
  bg: '#0a0f1a',
  surface: '#141c2c',
  surfaceAlt: '#1c2740',
  border: 'rgba(255,255,255,0.08)',
  text: '#eaf1ff',
  textMuted: semanticTokens.neutral,
  accent: brandTokens.accent,
  accentSoft: brandTokens.accentSoft,
  accentInk: brandTokens.accentInk,
  danger: semanticTokens.danger,
  radius: shapeTokens.radius,
} as const;
export const pageShell: React.CSSProperties = { maxWidth: 520, margin: '0 auto', padding: '4px 16px 40px' };
