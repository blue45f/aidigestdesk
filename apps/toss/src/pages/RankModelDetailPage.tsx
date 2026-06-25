import { useMemo } from 'react';

import {
  getModelEntryById,
  getModelStandingsByName,
  getProfileForName,
  snapshotDate,
} from '../lib/rankings';
import { navigate } from '../router';
import { theme, pageShell } from '../theme';
import { BackBar, MetaChip, RankBadge } from '../ui';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 22 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, color: theme.text, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

function PointList({ items, tone }: { items: string[]; tone: 'good' | 'warn' | 'info' }) {
  const mark = tone === 'good' ? '✓' : tone === 'warn' ? '!' : '·';
  const color = tone === 'good' ? '#74d6a3' : tone === 'warn' ? '#f5c842' : theme.accent;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: 'flex', gap: 9, fontSize: 13.5, color: theme.text, lineHeight: 1.55 }}>
          <span aria-hidden style={{ color, fontWeight: 800, flexShrink: 0 }}>{mark}</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function RankModelDetailPage({ id }: { id: string }) {
  const found = getModelEntryById(id);
  const name = found?.entry.name ?? '';
  const standings = useMemo(() => (name ? getModelStandingsByName(name) : []), [name]);
  const profile = useMemo(() => (name ? getProfileForName(name) : undefined), [name]);

  const back = () => navigate('/rankings');

  if (!found) {
    return (
      <div style={{ minHeight: '100dvh', background: theme.bg }}>
        <BackBar onBack={back} />
        <div style={pageShell}>
          <p style={{ textAlign: 'center', color: theme.textMuted, padding: '60px 0' }}>모델을 찾을 수 없어요.</p>
        </div>
      </div>
    );
  }

  const provider = profile?.provider ?? found.entry.provider;

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <BackBar onBack={back} label="랭킹" />
      <div style={pageShell}>
        {/* 헤더 */}
        <div className="rise">
          <h1 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.3, wordBreak: 'keep-all' }}>{name}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 14, color: theme.textMuted }}>{provider}</span>
            {profile?.status && <MetaChip>{profile.status}</MetaChip>}
            {profile?.lastUpdate && <MetaChip>업데이트 {profile.lastUpdate}</MetaChip>}
          </div>
          {profile?.oneLine && (
            <p style={{ fontSize: 15, color: theme.text, lineHeight: 1.6, marginTop: 14,
              background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 14 }}>
              {profile.oneLine}
            </p>
          )}
        </div>

        {/* 분야별 성적 */}
        <Section title="📊 분야별 성적">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {standings.map((s) => (
              <div key={s.domainId} style={{ display: 'flex', gap: 12, alignItems: 'center', background: theme.surface,
                border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: '12px 14px' }}>
                <RankBadge position={s.position} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{s.domainLabel}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <MetaChip>{s.entry.metric}</MetaChip>
                    {s.entry.price && <MetaChip>{s.entry.price}</MetaChip>}
                    {s.entry.speed && <MetaChip>{s.entry.speed}</MetaChip>}
                    {s.entry.context && <MetaChip>ctx {s.entry.context}</MetaChip>}
                  </div>
                </div>
                {s.entry.score !== null && (
                  <span style={{ fontSize: 18, fontWeight: 800, color: theme.accent, fontVariantNumeric: 'tabular-nums' }}>
                    {(s.entry.scoreLabel?.trim().startsWith('≈') ? '≈' : '') + s.entry.score.toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 10, lineHeight: 1.6 }}>
            순위는 각 분야 내 상대 순위예요. 점수는 분야별 지표 기준이라 서로 직접 비교하지 마세요.
          </p>
        </Section>

        {profile?.summary && (
          <Section title="🧭 한눈 요약">
            <p style={{ fontSize: 14, color: theme.text, lineHeight: 1.7 }}>{profile.summary}</p>
          </Section>
        )}
        {profile?.strengths?.length ? (
          <Section title="💪 강점"><PointList items={profile.strengths} tone="good" /></Section>
        ) : null}
        {profile?.caveats?.length ? (
          <Section title="⚠️ 주의할 점"><PointList items={profile.caveats} tone="warn" /></Section>
        ) : null}
        {profile?.bestFor?.length ? (
          <Section title="🎯 이럴 때 좋아요"><PointList items={profile.bestFor} tone="info" /></Section>
        ) : null}

        {!profile && (
          <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, marginTop: 22,
            background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 14 }}>
            이 항목은 벤치마크 순위 데이터예요. 상세 모델 프로필이 아직 연결되지 않았습니다.
          </p>
        )}

        <p style={{ fontSize: 11.5, color: theme.textMuted, textAlign: 'center', marginTop: 26, lineHeight: 1.6 }}>
          {snapshotDate} 기준 · 공개 벤치마크 출처 기반
        </p>
      </div>
    </div>
  );
}
