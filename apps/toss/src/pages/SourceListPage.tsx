import { Top } from '@toss/tds-mobile';
import { useMemo, useState } from 'react';

import { getSources, type Source } from '../lib/api';
import { navigate } from '../router';
import { theme, pageShell } from '../theme';
import { SearchBar, Chips, Badge } from '../ui';

const ALL = '전체';

export function SourceListPage() {
  const items = getSources();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState(ALL);

  const kinds = useMemo(() => {
    const order = ['공식', '벤치마크', '미디어', '커뮤니티'];
    const present = new Set(items.map((s) => s.kindLabel));
    return [ALL, ...order.filter((k) => present.has(k))];
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((s) => {
      const okK = kind === ALL || s.kindLabel === kind;
      const okQ = !query || [s.title, s.publisher, s.excerpt].filter(Boolean).join(' ').toLowerCase().includes(query);
      return okK && okQ;
    });
  }, [items, q, kind]);

  const open = (s: Source) => navigate(`/source/${encodeURIComponent(s.id)}`);

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <Top title={<Top.TitleParagraph size={22}>📰 AI다이제스트</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>매일 확인하는 AI 공식·벤치마크·미디어 소스</Top.SubtitleParagraph>} />
      <div style={pageShell}>
        <div className="rise" style={{ marginBottom: 12 }}><SearchBar value={q} onChange={setQ} placeholder="제목·매체 검색" /></div>
        <div className="rise" style={{ animationDelay: '60ms', marginBottom: 18 }}><Chips items={kinds} active={kind} onPick={setKind} /></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((s, i) => (
            <button key={s.id} type="button" onClick={() => open(s)} className="pressable rise"
              style={{ animationDelay: `${90 + i * 22}ms`, display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%', textAlign: 'left',
                background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 14, color: theme.text, cursor: 'pointer' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 3 }}>{s.publisher}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>
                  <Badge accent>{s.kindLabel}</Badge>
                  {s.priority && <Badge>{s.priority}</Badge>}
                </div>
              </div>
              <span aria-hidden style={{ color: theme.textMuted, fontSize: 20, opacity: .5 }}>›</span>
            </button>
          ))}
          {filtered.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>‘{q || kind}’ 결과가 없어요.</p>}
        </div>
      </div>
    </div>
  );
}
