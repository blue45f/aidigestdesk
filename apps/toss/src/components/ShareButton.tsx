import { usePlatform } from '@heejun/platform-bridge';
import { useEffect, useState } from 'react';

import { buildTossShareLink } from '../lib/toss';
import { theme } from '../theme';

/**
 * 공용 공유 버튼 — UpdateDetailPage 의 share 패턴(usePlatform().share + 토스 공유 링크 첨부,
 * 'copied' 면 토스트) 재사용. variant:
 * - compact: BookmarkButton 과 나란히 놓는 pill
 * - full: 폭 100% 큰 버튼(상세 하단)
 * - link: 게시글 행 등의 작은 텍스트 링크 버튼
 */
export function ShareButton({
  text,
  title = '[AI다이제스트]',
  variant = 'compact',
  label,
}: {
  /** 공유 본문(토스 공유 링크가 자동으로 뒤에 붙는다). */
  text: string;
  title?: string;
  variant?: 'compact' | 'full' | 'link';
  label?: string;
}) {
  const platform = usePlatform();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const share = async () => {
    const tossLink = await buildTossShareLink();
    const r = await platform.share({ title, text: `${text}${tossLink ? `\n${tossLink}` : ''}` });
    if (r === 'copied') setToast('클립보드에 복사했어요.');
  };

  const caption = label ?? (variant === 'full' ? '공유하기' : '공유');

  const style: React.CSSProperties =
    variant === 'full'
      ? { width: '100%', minHeight: 52, borderRadius: 14, border: `1px solid ${theme.border}`,
          background: 'transparent', color: theme.text, fontSize: 16, fontWeight: 700, cursor: 'pointer' }
      : variant === 'link'
        ? { background: 'transparent', border: 'none', color: theme.textMuted, fontSize: 12.5,
            fontWeight: 700, cursor: 'pointer', padding: 0 }
        : { display: 'inline-flex', alignItems: 'center', gap: 5, height: 38, padding: '0 14px', flexShrink: 0,
            borderRadius: 999, cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
            border: `1px solid ${theme.border}`, background: 'transparent', color: theme.textMuted };

  return (
    <>
      <button type="button" onClick={share} aria-label="공유하기" className="pressable" style={style}>
        {variant === 'link' ? (
          <>공유</>
        ) : (
          <>
            <span aria-hidden style={{ fontSize: variant === 'full' ? 16 : 14 }}>📤</span> {caption}
          </>
        )}
      </button>
      {toast && (
        <div role="status" className="toast-pop"
          style={{ position: 'fixed', bottom: 'calc(84px + env(safe-area-inset-bottom))', left: '50%',
            transform: 'translateX(-50%)', zIndex: 60, background: 'rgba(10,15,26,0.88)', color: '#eaf1ff',
            padding: '10px 18px', borderRadius: 999, fontSize: 14, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}
    </>
  );
}
