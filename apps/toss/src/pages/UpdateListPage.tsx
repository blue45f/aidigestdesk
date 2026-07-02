import { burstAt } from '@aidigestdesk/content/shared';
import { Top } from '@toss/tds-mobile';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AnimatedTitle } from '../components/AnimatedTitle';
import { BannerAd } from '../components/BannerAd';
import { getUpdates, type Update } from '../lib/api';
import { AD_GROUPS } from '../lib/ads';
import { haptic } from '../lib/haptic';
import { navigate } from '../router';
import { theme, pageShell } from '../theme';
import { SearchBar, Chips, Badge, BrandIcon } from '../ui';

const ALL = '전체';

/** 풀다운이 "새로고침"으로 인정되는 당김 거리(px, 감쇠 적용 후). */
const PULL_THRESHOLD = 64;
/** 시각 인디케이터의 최대 당김 거리(px). */
const PULL_MAX = 96;

/**
 * 풀다운 리프레시 연출 — 터치 전용. 데이터는 번들 스냅샷이라 재요청이 없으므로
 * 문구는 "최신 상태 확인" 톤으로 정직하게 두고, 임계 통과 시 스파클+햅틱+리스트
 * 재진입 애니메이션(refreshKey)을 재생한다. 스크롤 최상단에서 아래로 당길 때만 반응.
 */
function usePullToRefresh(onRefresh: () => void) {
  const [pull, setPull] = useState(0);
  const [done, setDone] = useState(false);
  const startYRef = useRef<number | null>(null);
  const pullRef = useRef(0);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      startYRef.current = window.scrollY <= 0 ? (e.touches[0]?.clientY ?? null) : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const startY = startYRef.current;
      const y = e.touches[0]?.clientY;
      if (startY == null || y == null) return;
      if (window.scrollY > 0) {
        startYRef.current = null;
        pullRef.current = 0;
        setPull(0);
        return;
      }
      const raw = y - startY;
      const next = raw > 0 ? Math.min(PULL_MAX, raw * 0.42) : 0;
      pullRef.current = next;
      setPull(next);
    };
    const onTouchEnd = () => {
      const reached = pullRef.current >= PULL_THRESHOLD;
      startYRef.current = null;
      pullRef.current = 0;
      setPull(0);
      if (!reached) return;
      haptic('confetti');
      burstAt(window.innerWidth / 2, 96, undefined, 18);
      setDone(true);
      onRefresh();
      window.setTimeout(() => setDone(false), 1400);
    };
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('touchstart', onTouchStart, opts);
    window.addEventListener('touchmove', onTouchMove, opts);
    window.addEventListener('touchend', onTouchEnd, opts);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onRefresh]);

  return { pull, done };
}

export function UpdateListPage() {
  const items = getUpdates();
  const [q, setQ] = useState('');
  const [provider, setProvider] = useState(ALL);
  const [refreshKey, setRefreshKey] = useState(0);
  const { pull, done } = usePullToRefresh(() => setRefreshKey((k) => k + 1));

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
      {/* 풀다운 인디케이터 — 당김 진행률에 따라 내려오고, 임계 통과 후 놓으면 확인 문구. */}
      {(pull > 6 || done) && (
        <div aria-hidden={!done} role={done ? 'status' : undefined}
          style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 10px)', left: '50%', zIndex: 40,
            transform: `translate(-50%, ${done ? 0 : Math.min(pull, PULL_MAX) - 34}px) scale(${done ? 1 : 0.82 + Math.min(pull / PULL_THRESHOLD, 1) * 0.18})`,
            opacity: done ? 1 : Math.min(pull / 28, 1),
            display: 'flex', alignItems: 'center', gap: 7, height: 34, padding: '0 14px', borderRadius: 999,
            background: theme.surface, border: `1px solid ${pull >= PULL_THRESHOLD || done ? theme.accent : theme.border}`,
            color: pull >= PULL_THRESHOLD || done ? theme.accent : theme.textMuted,
            fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            transition: done ? 'transform .25s cubic-bezier(.22,1,.36,1)' : 'none', pointerEvents: 'none' }}>
          {done ? '✓ 최신 소식이에요' : pull >= PULL_THRESHOLD ? '↻ 놓으면 새로고침 연출' : '↓ 아래로 당기기'}
        </div>
      )}
      <Top title={<Top.TitleParagraph size={22}>📰 <AnimatedTitle size={22}>AI다이제스트</AnimatedTitle></Top.TitleParagraph>}
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
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                      <BrandIcon src={u.iconUrl} size={14} />
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

        {/* refreshKey — 풀다운 완료 시 리스트 재진입 애니메이션(list-swap) 재생 */}
        <div key={refreshKey} className={refreshKey > 0 ? 'list-swap' : undefined}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((u, i) => (
            <button key={u.id} type="button" onClick={() => open(u)} className="pressable rise"
              style={{ animationDelay: `${90 + i * 22}ms`, display: 'block', width: '100%', textAlign: 'left',
                background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 16, color: theme.text, cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <BrandIcon src={u.iconUrl} size={15} />
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

        {/* 인앱 배너 광고 — 홈 피드(가장 자주 보는 목록)에 인라인 배치. 토스 5.241.0+ 에서만 노출. */}
        <BannerAd adGroupId={AD_GROUPS.feedList} marginTop={18} />

        {/* 내 정보(익명 회원 프로필) 진입 — 닉네임·아바타·저장·문의 허브. 로그인 없이 기기 기반. */}
        <button type="button" onClick={() => navigate('/profile')} className="pressable"
          style={{ width: '100%', marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 16,
            color: theme.text, cursor: 'pointer' }}>
          <span aria-hidden style={{ fontSize: 22 }}>👤</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>내 정보</span>
            <span style={{ display: 'block', fontSize: 12.5, color: theme.textMuted, marginTop: 2 }}>닉네임·아바타·저장한 항목 관리</span>
          </span>
          <span aria-hidden style={{ fontSize: 20, color: theme.textMuted }}>›</span>
        </button>

        {/* 커뮤니티는 하단 탭바 1차 메뉴로 승격(웹 GNB와 동일) — 피드 허브 카드는 제거. */}

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
