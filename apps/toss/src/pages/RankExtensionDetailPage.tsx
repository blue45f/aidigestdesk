import { onExternalClick } from '../lib/links';
import { getExtensionById, GRADE_PALETTE, snapshotDate } from '../lib/rankings';
import { goBack } from '../router';
import { theme, pageShell } from '../theme';
import { Badge, BackBar, BookmarkButton, MetaChip } from '../ui';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 22 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, color: theme.text, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

function CodeLine({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ display: 'block', fontSize: 12.5, color: theme.text, background: theme.surfaceAlt,
      border: `1px solid ${theme.border}`, borderRadius: 10, padding: '11px 12px', lineHeight: 1.5,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-all' }}>{children}</code>
  );
}

export function RankExtensionDetailPage({ id }: { id: string }) {
  const entry = getExtensionById(id);
  const back = () => goBack('/rankings');

  if (!entry) {
    return (
      <div style={{ minHeight: '100dvh', background: theme.bg }}>
        <BackBar onBack={back} />
        <div style={pageShell}>
          <p style={{ textAlign: 'center', color: theme.textMuted, padding: '60px 0' }}>확장을 찾을 수 없어요.</p>
        </div>
      </div>
    );
  }

  const grade = GRADE_PALETTE[entry.grade] ?? GRADE_PALETTE.C;

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <BackBar onBack={back} label="랭킹" />
      <div style={pageShell}>
        <div className="rise">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <h1 style={{ flex: 1, fontSize: 23, fontWeight: 800, lineHeight: 1.3, wordBreak: 'keep-all' }}>{entry.name}</h1>
            <span aria-label={`등급 ${entry.grade}`} style={{ flexShrink: 0, display: 'grid', placeItems: 'center',
              width: 34, height: 34, borderRadius: 10, fontSize: 16, fontWeight: 800, background: grade.bg, color: grade.fg }}>
              {entry.grade}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
            <Badge accent>{entry.kind}</Badge>
            <Badge>{entry.platform}</Badge>
            {entry.category && <MetaChip>{entry.category}</MetaChip>}
            {entry.maturity && <MetaChip>{entry.maturity}</MetaChip>}
            <MetaChip>추천 #{entry.rank}</MetaChip>
          </div>
          {entry.summary && (
            <p style={{ fontSize: 15, color: theme.text, lineHeight: 1.6, marginTop: 14,
              background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 14 }}>
              {entry.summary}
            </p>
          )}
          <div style={{ marginTop: 14 }}>
            <BookmarkButton item={{ type: 'extension', id: entry.id, title: entry.name, subtitle: entry.platform, route: `/rank/x/${encodeURIComponent(entry.id)}` }} />
          </div>
        </div>

        {entry.whatItDoes?.length ? (
          <Section title="✨ 무엇을 해주나요">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {entry.whatItDoes.map((it, i) => (
                <li key={i} style={{ display: 'flex', gap: 9, fontSize: 13.5, color: theme.text, lineHeight: 1.55 }}>
                  <span aria-hidden style={{ color: theme.accent, fontWeight: 800, flexShrink: 0 }}>✓</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {(entry.install || entry.usage) && (
          <Section title="🛠️ 설치 · 사용">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {entry.install && (
                <div>
                  <div style={{ fontSize: 12.5, color: theme.textMuted, marginBottom: 6 }}>설치</div>
                  <CodeLine>{entry.install}</CodeLine>
                </div>
              )}
              {entry.usage && (
                <div>
                  <div style={{ fontSize: 12.5, color: theme.textMuted, marginBottom: 6 }}>사용</div>
                  <CodeLine>{entry.usage}</CodeLine>
                </div>
              )}
            </div>
          </Section>
        )}

        {entry.koreanNote && (
          <Section title="💡 활용 팁">
            <p style={{ fontSize: 14, color: theme.text, lineHeight: 1.7 }}>{entry.koreanNote}</p>
          </Section>
        )}

        {entry.bestFor?.length ? (
          <Section title="🎯 이럴 때 좋아요">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {entry.bestFor.map((b, i) => <Badge key={i}>{b}</Badge>)}
            </div>
          </Section>
        ) : null}

        {entry.url && (
          <a href={entry.url} target="_blank" rel="noreferrer" onClick={onExternalClick(entry.url)} className="pressable"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 26,
              height: 50, borderRadius: theme.radius, background: theme.accent, color: theme.accentInk,
              fontSize: 15, fontWeight: 700 }}>
            공식 문서 보기 ↗
          </a>
        )}

        <p style={{ fontSize: 11.5, color: theme.textMuted, textAlign: 'center', marginTop: 22, lineHeight: 1.6 }}>
          {snapshotDate} 기준 · 추천 순위는 편집자 큐레이션이에요
        </p>
      </div>
    </div>
  );
}
