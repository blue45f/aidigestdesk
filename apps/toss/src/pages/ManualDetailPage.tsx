import { useMemo, useState } from 'react';

import { getManualBySlug, manualCategories, manualSnapshotDate } from '../lib/manuals';
import { goBack } from '../router';
import { theme, pageShell } from '../theme';
import { Badge, BackBar, Chips, MetaChip, SearchBar, SortChip } from '../ui';

type CmdSort = 'default' | 'command' | 'category';
type Dir = 'asc' | 'desc';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 22 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, color: theme.text, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{ margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 10, padding: '11px 12px',
      fontSize: 12.5, lineHeight: 1.6, color: theme.text,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{children}</pre>
  );
}

export function ManualDetailPage({ slug }: { slug: string }) {
  const manual = getManualBySlug(slug);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [sort, setSort] = useState<CmdSort>('default');
  const [dir, setDir] = useState<Dir>('asc');

  const back = () => goBack('/manuals');

  const categories = useMemo(() => (manual ? manualCategories(manual) : []), [manual]);
  const commands = useMemo(() => {
    if (!manual) return [];
    const q = query.trim().toLowerCase();
    const base = manual.commands.filter((c) => {
      const okCat = category === '전체' || c.category === category;
      const okQ = !q || [c.command, c.description, c.example, c.category].join(' ').toLowerCase().includes(q);
      return okCat && okQ;
    });
    if (sort === 'default') return base;
    const mul = dir === 'asc' ? 1 : -1;
    return [...base].sort((a, b) => {
      if (sort === 'command') return a.command.localeCompare(b.command) * mul;
      const c = a.category.localeCompare(b.category) * mul;
      return c !== 0 ? c : a.command.localeCompare(b.command);
    });
  }, [manual, query, category, sort, dir]);

  const toggle = (next: CmdSort) => {
    if (next === sort) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSort(next); setDir('asc'); }
  };

  if (!manual) {
    return (
      <div style={{ minHeight: '100dvh', background: theme.bg }}>
        <BackBar onBack={back} />
        <div style={pageShell}>
          <p style={{ textAlign: 'center', color: theme.textMuted, padding: '60px 0' }}>매뉴얼을 찾을 수 없어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <BackBar onBack={back} label="매뉴얼" />
      <div style={pageShell}>
        <h1 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.3, wordBreak: 'keep-all' }}>{manual.platform}</h1>
        {manual.overview && (
          <p style={{ fontSize: 14.5, color: theme.text, lineHeight: 1.7, marginTop: 12 }}>{manual.overview}</p>
        )}

        {manual.install && (
          <Section title="📥 설치"><CodeBlock>{manual.install}</CodeBlock></Section>
        )}
        {manual.auth && (
          <Section title="🔑 인증 · 로그인"><CodeBlock>{manual.auth}</CodeBlock></Section>
        )}

        <Section title={`⌨️ 명령어 · 옵션 ${manual.commands.length}개`}>
          <div style={{ marginBottom: 12 }}>
            <SearchBar value={query} onChange={setQuery} placeholder="명령·설명 검색" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Chips items={categories} active={category} onPick={setCategory} />
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14 }}>
            <SortChip label="기본순" active={sort === 'default'} dir={dir} onToggle={() => toggle('default')} />
            <SortChip label="명령순" active={sort === 'command'} dir={dir} onToggle={() => toggle('command')} />
            <SortChip label="카테고리순" active={sort === 'category'} dir={dir} onToggle={() => toggle('category')} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {commands.map((c, i) => (
              <div key={`${c.command}-${i}`} style={{ background: theme.surface, border: `1px solid ${theme.border}`,
                borderRadius: theme.radius, padding: '12px 14px' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <code style={{ background: theme.surfaceAlt, padding: '2px 7px', borderRadius: 6,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, fontWeight: 700,
                    color: theme.accent }}>{c.command}</code>
                  <MetaChip>{c.category}</MetaChip>
                </div>
                <p style={{ fontSize: 13.5, color: theme.textMuted, marginTop: 8, lineHeight: 1.55 }}>{c.description}</p>
                {c.example && (
                  <code style={{ display: 'block', marginTop: 8, overflowX: 'auto', whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word', background: theme.surfaceAlt, borderRadius: 8, padding: '8px 10px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: theme.textMuted }}>{c.example}</code>
                )}
              </div>
            ))}
            {commands.length === 0 && (
              <p style={{ textAlign: 'center', color: theme.textMuted, padding: '32px 0' }}>‘{query || category}’ 결과가 없어요.</p>
            )}
          </div>
        </Section>

        {manual.features.length > 0 && (
          <Section title="✨ 핵심 기능">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {manual.features.map((f) => (
                <div key={f.title} style={{ background: theme.surface, border: `1px solid ${theme.border}`,
                  borderRadius: theme.radius, padding: '12px 14px' }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{f.title}</div>
                  <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 6, lineHeight: 1.6 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {manual.tips.length > 0 && (
          <Section title="💡 실전 팁">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {manual.tips.map((tip, i) => (
                <li key={i} style={{ display: 'flex', gap: 9, fontSize: 13.5, color: theme.text, lineHeight: 1.55 }}>
                  <span aria-hidden style={{ color: theme.accent, fontWeight: 800, flexShrink: 0 }}>✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {manual.sourceUrls.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 22, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
            {manual.sourceUrls.map((url) => {
              let host = url;
              try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* keep raw */ }
              return (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="pressable">
                  <Badge>{host} ↗</Badge>
                </a>
              );
            })}
          </div>
        )}

        <p style={{ fontSize: 11.5, color: theme.textMuted, textAlign: 'center', marginTop: 22, lineHeight: 1.6 }}>
          {manualSnapshotDate} 기준
        </p>
      </div>
    </div>
  );
}
