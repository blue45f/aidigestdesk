import { Button } from '@toss/tds-mobile';
import { useEffect, useState } from 'react';

import { getSource } from '../lib/api';
import { shareMessage } from '../lib/toss';
import { navigate } from '../router';
import { theme } from '../theme';
import { Badge } from '../ui';

export function SourceDetailPage({ id = '' }: { id?: string }) {
  const s = getSource(id);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const x = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(x);
  }, [toast]);

  const Header = (
    <header style={{ display: 'flex', alignItems: 'center', height: 56, padding: '0 8px', paddingTop: 'env(safe-area-inset-top)',
      position: 'sticky', top: 0, zIndex: 5, background: `color-mix(in oklab, ${theme.bg} 84%, transparent)`, backdropFilter: 'blur(12px)' }}>
      <button type="button" aria-label="뒤로" onClick={() => navigate('/')} className="pressable"
        style={{ width: 44, height: 44, background: 'none', border: 'none', color: theme.text, fontSize: 24, cursor: 'pointer' }}>←</button>
    </header>
  );
  if (!s) return <div style={{ background: theme.bg, minHeight: '100dvh' }}>{Header}<p style={{ textAlign: 'center', color: theme.textMuted, paddingTop: 40 }}>소스를 찾을 수 없어요.</p></div>;

  const share = async () => {
    const r = await shareMessage(`[AI다이제스트] ${s.title} — ${s.publisher}\n${s.url}`);
    if (r === 'clipboard') setToast('클립보드에 복사했어요.');
  };

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      {Header}
      <div className="rise" style={{ padding: '4px 20px 110px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          <Badge accent>{s.kindLabel}</Badge>{s.priority && <Badge>{s.priority}</Badge>}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.32 }}>{s.title}</h1>
        <p style={{ margin: '8px 0 0', color: theme.textMuted, fontSize: 14 }}>{s.publisher}</p>
        {s.excerpt && <p style={{ fontSize: 15, lineHeight: 1.75, color: theme.text, margin: '20px 0 0', maxWidth: '72ch' }}>{s.excerpt}</p>}
        <div style={{ marginTop: 24 }}><button type="button" onClick={share} className="pressable" style={{ width: '100%', minHeight: 52, borderRadius: 14, border: `1px solid ${theme.border}`, background: 'transparent', color: theme.text, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>공유하기</button></div>
      </div>
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom))',
        background: `linear-gradient(to top, ${theme.bg} 72%, transparent)`, zIndex: 20 }}>
        <a href={s.url} target="_blank" rel="noopener noreferrer"><Button style={{ width: '100%' }}>원문 보기</Button></a>
      </div>
      {toast && <div role="status" style={{ position: 'fixed', bottom: 'calc(84px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.82)', color: theme.text, padding: '10px 18px', borderRadius: 999, fontSize: 14 }}>{toast}</div>}
    </div>
  );
}
