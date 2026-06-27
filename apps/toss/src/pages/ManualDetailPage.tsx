import { useMemo, useState } from 'react';

import { onExternalClick } from '../lib/links';
import { getManualBySlug, manualCategories, manualSnapshotDate } from '../lib/manuals';
import { goBack } from '../router';
import { theme, pageShell } from '../theme';
import { Badge, BackBar, BookmarkButton, Chips, MetaChip, SearchBar, SortChip } from '../ui';

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

/**
 * 설치·인증처럼 설명 문장 + 인라인 `명령`이 섞인 텍스트를 읽기 쉽게 렌더(monospace 코드블록 대신).
 * 본문은 일반 글꼴(고대비), 백틱 명령만 인라인 코드 칩으로 강조. 웹 RichProse 와 동일 표현.
 */
function RichProse({ text }: { text: string }) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 14,
        lineHeight: 1.75,
        color: theme.text,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
      }}
    >
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code
            key={i}
            style={{
              margin: '0 2px',
              padding: '2px 6px',
              borderRadius: 6,
              border: `1px solid ${theme.border}`,
              background: theme.surfaceAlt,
              color: theme.accent,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        )
      )}
    </p>
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
        {manual.tagline && (
          <p style={{ fontSize: 14, fontWeight: 700, color: theme.accent, marginTop: 6, lineHeight: 1.5 }}>{manual.tagline}</p>
        )}
        {manual.overview && (
          <p style={{ fontSize: 14.5, color: theme.text, lineHeight: 1.7, marginTop: 12 }}>{manual.overview}</p>
        )}
        <div style={{ marginTop: 14 }}>
          <BookmarkButton item={{ type: 'manual', id: manual.slug, title: manual.platform, subtitle: 'CLI 매뉴얼', route: `/manual/${encodeURIComponent(manual.slug)}` }} />
        </div>

        {manual.install && (
          <Section title="📥 설치"><RichProse text={manual.install} /></Section>
        )}
        {manual.auth && (
          <Section title="🔑 인증 · 로그인"><RichProse text={manual.auth} /></Section>
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
                  <code style={{ background: theme.text, padding: '3px 8px', borderRadius: 6,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13.5, fontWeight: 800,
                    color: theme.bg }}>{c.command}</code>
                  <MetaChip>{c.category}</MetaChip>
                </div>
                <p style={{ fontSize: 13.5, color: theme.text, marginTop: 8, lineHeight: 1.6 }}>{c.description}</p>
                {c.example && (
                  <code style={{ display: 'block', marginTop: 8, overflowX: 'auto', whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere', background: theme.surfaceAlt, borderRadius: 8, padding: '8px 10px',
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
                <a key={url} href={url} target="_blank" rel="noreferrer" onClick={onExternalClick(url)} className="pressable">
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
