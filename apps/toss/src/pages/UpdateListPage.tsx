import { Top } from '@toss/tds-mobile';
import { useMemo, useState } from 'react';

import { getUpdates, type Update } from '../lib/api';
import { navigate } from '../router';
import { theme, pageShell } from '../theme';
import { SearchBar, Chips, Badge } from '../ui';

const ALL = '전체';

export function UpdateListPage() {
  const items = getUpdates();
  const [q, setQ] = useState('');
  const [provider, setProvider] = useState(ALL);

  const providers = useMemo(() => {
    const c = new Map<string, number>();
    for (const u of items) if (u.provider) c.set(u.provider, (c.get(u.provider) || 0) + 1);
    return [ALL, ...[...c.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).map(([p]) => p).slice(0, 7)];
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((u) => {
      const okP = provider === ALL || u.provider === provider;
      const okQ = !query || [u.title, u.summary, u.impact, u.provider, ...(u.tags || [])].filter(Boolean).join(' ').toLowerCase().includes(query);
      return okP && okQ;
    });
  }, [items, q, provider]);

  const open = (u: Update) => navigate(`/update/${encodeURIComponent(u.id)}`);

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <Top title={<Top.TitleParagraph size={22}>📰 AI다이제스트</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>주요 AI 모델 업데이트를 한국어로 빠르게</Top.SubtitleParagraph>} />
      <div style={pageShell}>
        <div className="rise" style={{ marginBottom: 12 }}><SearchBar value={q} onChange={setQ} placeholder="모델·키워드 검색" /></div>
        <div className="rise" style={{ animationDelay: '60ms', marginBottom: 18 }}><Chips items={providers} active={provider} onPick={setProvider} /></div>

        {/* 오늘의 브리핑 — 검색·필터 미적용 시 최신 3건 하이라이트(웹 Briefing 패턴) */}
        {!q.trim() && provider === ALL && items.length > 0 && (
          <div className="rise" style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 10 }}>⚡ 오늘의 브리핑</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.slice(0, 3).map((u) => (
                <button key={`brief-${u.id}`} type="button" onClick={() => open(u)} className="pressable"
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%', textAlign: 'left', cursor: 'pointer',
                    background: theme.accentSoft, border: `1px solid ${theme.accent}`, borderRadius: theme.radius, padding: '12px 14px', color: theme.text }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>{u.provider}</span>
                      {u.date && <span style={{ fontSize: 11.5, color: theme.textMuted }}>{u.date}</span>}
                    </div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{u.title}</div>
                  </div>
                  <span aria-hidden style={{ fontSize: 18, color: theme.accent, alignSelf: 'center' }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((u, i) => (
            <button key={u.id} type="button" onClick={() => open(u)} className="pressable rise"
              style={{ animationDelay: `${90 + i * 22}ms`, display: 'block', width: '100%', textAlign: 'left',
                background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 16, color: theme.text, cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Badge accent>{u.provider}</Badge>
                {u.date && <span style={{ fontSize: 12, color: theme.textMuted }}>{u.date}</span>}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{u.title}</div>
              {u.summary && <div style={{ fontSize: 13.5, color: theme.textMuted, marginTop: 6, lineHeight: 1.55,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{u.summary}</div>}
              {u.tags?.length ? <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>{u.tags.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}</div> : null}
            </button>
          ))}
          {filtered.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>‘{q || provider}’ 결과가 없어요.</p>}
        </div>

        {/* 커뮤니티(채팅·게시판·카페) 진입 — 웹과 동일 기능, shared 스토어 공용. 1차 기능이라 강조. */}
        <button type="button" onClick={() => navigate('/community')} className="pressable"
          style={{ width: '100%', marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            background: theme.accentSoft, border: `1px solid ${theme.accent}`, borderRadius: theme.radius, padding: 16,
            color: theme.text, cursor: 'pointer' }}>
          <span aria-hidden style={{ fontSize: 22 }}>👥</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>커뮤니티</span>
            <span style={{ display: 'block', fontSize: 12.5, color: theme.textMuted, marginTop: 2 }}>채팅방·게시판·카페에서 함께 이야기해요</span>
          </span>
          <span aria-hidden style={{ fontSize: 20, color: theme.textMuted }}>›</span>
        </button>

        {/* 저장한 항목(즐겨찾기) 진입 */}
        <button type="button" onClick={() => navigate('/saved')} className="pressable"
          style={{ width: '100%', marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 16,
            color: theme.text, cursor: 'pointer' }}>
          <span aria-hidden style={{ fontSize: 22 }}>★</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>저장한 항목</span>
            <span style={{ display: 'block', fontSize: 12.5, color: theme.textMuted, marginTop: 2 }}>즐겨찾기한 모델·확장·매뉴얼 모아보기</span>
          </span>
          <span aria-hidden style={{ fontSize: 20, color: theme.textMuted }}>›</span>
        </button>

        {/* 문의·의견(desk-platform 연동) 진입 */}
        <button type="button" onClick={() => navigate('/support')} className="pressable"
          style={{ width: '100%', marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 16,
            color: theme.text, cursor: 'pointer' }}>
          <span aria-hidden style={{ fontSize: 22 }}>💬</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>문의 · 의견 보내기</span>
            <span style={{ display: 'block', fontSize: 12.5, color: theme.textMuted, marginTop: 2 }}>제휴·버그·이용 문의나 사이트 의견</span>
          </span>
          <span aria-hidden style={{ fontSize: 20, color: theme.textMuted }}>›</span>
        </button>
      </div>
    </div>
  );
}
