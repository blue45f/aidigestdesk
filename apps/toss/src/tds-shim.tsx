/**
 * 브라우저 프리뷰 전용 TDS 대체 컴포넌트.
 * @toss/tds-mobile은 앱인토스(토스 WebView) 밖에서 런타임 가드로 예외를 던져 일반 브라우저에서
 * 마운트가 막혀요. PREVIEW_NO_TDS=1 빌드에서만 vite alias로 이 파일을 대신 사용해 미니앱 UI를
 * 브라우저에서 미리 볼 수 있게 해요. 실제 .ait(앱인토스) 빌드는 진짜 TDS를 그대로 사용합니다.
 */
import type { CSSProperties, ReactNode } from 'react';

// 브랜드 토큰(@aidigestdesk/content/shared brandTokens)과 동일 값 — 프리뷰 색이
// 프로덕션(.ait) 브랜드와 어긋나지 않게 한다(shim은 alias 대상이라 하드코딩 유지).
const ACCENT = '#6ea8fe';
const ACCENT_INK = '#06122a';

export function TDSMobileAITProvider({
  children,
}: {
  children: ReactNode;
  brandPrimaryColor?: string;
}) {
  return <>{children}</>;
}

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  variant?: 'weak' | string;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ children, onClick, style, variant, loading, disabled }: ButtonProps) {
  const weak = variant === 'weak';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        minHeight: 52,
        padding: '0 18px',
        borderRadius: 14,
        border: weak ? '1px solid var(--c-border-2)' : 'none',
        background: weak ? 'transparent' : ACCENT,
        color: weak ? 'var(--c-text)' : ACCENT_INK,
        fontSize: 16,
        fontWeight: 700,
        cursor: disabled || loading ? 'default' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        ...style,
      }}
    >
      {loading ? '처리 중…' : children}
    </button>
  );
}

function TitleParagraph({ children, size = 22 }: { children: ReactNode; size?: number }) {
  return <strong style={{ fontSize: size, fontWeight: 800, display: 'block' }}>{children}</strong>;
}

function SubtitleParagraph({ children, size = 15 }: { children: ReactNode; size?: number }) {
  return (
    <span style={{ fontSize: size, color: 'var(--c-text-muted)', display: 'block', marginTop: 6 }}>
      {children}
    </span>
  );
}

interface TopProps {
  title?: ReactNode;
  subtitleBottom?: ReactNode;
}

type TopComponent = ((props: TopProps) => ReactNode) & {
  TitleParagraph: typeof TitleParagraph;
  SubtitleParagraph: typeof SubtitleParagraph;
};

export const Top = (({ title, subtitleBottom }: TopProps) => (
  <header
    style={{ padding: '28px 20px 12px', paddingTop: 'calc(28px + env(safe-area-inset-top))' }}
  >
    {title}
    {subtitleBottom}
  </header>
)) as TopComponent;

Top.TitleParagraph = TitleParagraph;
Top.SubtitleParagraph = SubtitleParagraph;
