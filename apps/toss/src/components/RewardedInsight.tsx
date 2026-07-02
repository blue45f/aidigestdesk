import { burstAt } from '@aidigestdesk/content/shared';
import { useEffect, useRef, useState } from 'react';

import { useTossFullScreenAd } from '../lib/ads';
import { deals, extrasSnapshotDate, type DealEntry } from '../lib/extras';
import { haptic } from '../lib/haptic';
import { onExternalClick } from '../lib/links';
import { theme } from '../theme';
import { MetaChip } from '../ui';

/**
 * 오늘의 프리미엄 인사이트 — 보상형 광고 옵트인 카드(DealsPage 딜 목록 하단).
 *
 * - 보상 지급은 오직 onReward(userEarnedReward)에서만: 24시간 잠금해제.
 * - 광고 미구성/미지원 환경(웹·env 미설정 프로덕션)에서는 잠금 카드를 렌더하지 않는다.
 * - "프리미엄" = 공개 extras 데이터에서 날짜 시드로 결정적으로 고른 에디터 큐레이션 요약.
 *   데이터에 없는 내용을 지어내지 않는다.
 */
const STORAGE_KEY = 'aid-premium-insight-until';
const UNLOCK_MS = 24 * 60 * 60 * 1000;
const TOP_COUNT = 3;

function readUnlockUntil(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function writeUnlockUntil(until: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(until));
  } catch {
    /* 저장 실패 시에도 세션 내 상태로는 해제 유지 */
  }
}

/** 날짜 문자열 시드 → 결정적 인덱스 선택. 같은 날은 항상 같은 TOP 3. */
function seededPick(dateKey: string, pool: DealEntry[], count: number): DealEntry[] {
  if (pool.length <= count) return pool.slice(0, count);
  let seed = 0;
  for (let i = 0; i < dateKey.length; i += 1) seed = (seed * 31 + dateKey.charCodeAt(i)) >>> 0;
  const picked: DealEntry[] = [];
  const taken = new Set<number>();
  while (picked.length < count) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const idx = seed % pool.length;
    if (!taken.has(idx)) {
      taken.add(idx);
      picked.push(pool[idx]);
    }
  }
  return picked;
}

function remainLabel(until: number, now: number): string {
  const ms = Math.max(0, until - now);
  const h = Math.floor(ms / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return h > 0 ? `${h}시간 ${m}분 남음` : `${Math.max(1, m)}분 남음`;
}

export function RewardedInsight() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [until, setUntil] = useState(readUnlockUntil);
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<string | null>(null);

  const hook = useTossFullScreenAd('rewarded', {
    onReward: () => {
      const next = Date.now() + UNLOCK_MS;
      writeUnlockUntil(next);
      setUntil(next);
      setNotice(null);
      haptic('confetti');
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) burstAt(rect.left + rect.width / 2, rect.top + Math.min(rect.height / 2, 140), undefined, 26);
    },
    onError: () => {
      setNotice('광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    },
  });

  const unlocked = until > now;

  // 남은 시간 표기 갱신(1분 주기) — 해제 상태일 때만.
  useEffect(() => {
    if (!unlocked) return;
    const t = window.setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => window.clearInterval(t);
  }, [unlocked]);

  // 잠금 상태에서 광고를 띄울 수 없는 환경이면 카드 자체를 렌더하지 않는다(빈 약속 금지).
  if (!unlocked && !(hook.configured && hook.supported)) return null;

  const onWatch = () => {
    setNotice(null);
    if (!hook.show()) {
      setNotice('광고를 준비하고 있어요. 잠시 후 다시 시도해 주세요.');
      hook.reload();
    }
  };

  const dateKey = new Date(now).toISOString().slice(0, 10);
  const activePool = deals.filter((d) => d.status !== '종료');
  const pool = activePool.length >= TOP_COUNT ? activePool : deals;
  const top = seededPick(dateKey, pool, TOP_COUNT);
  const tipPool = pool.filter((d) => d.koreanNote);
  const tip = tipPool.length > 0 ? seededPick(dateKey + ':tip', tipPool, 1)[0] : null;

  return (
    <section
      ref={cardRef}
      aria-label="오늘의 프리미엄 인사이트"
      style={{
        marginTop: 18,
        borderRadius: theme.radius,
        border: `1px solid ${unlocked ? theme.accent : theme.border}`,
        background: unlocked ? theme.accentSoft : theme.surface,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>✨ 오늘의 프리미엄 인사이트</span>
        {unlocked ? (
          <span style={{ marginLeft: 'auto' }}>
            <MetaChip>{remainLabel(until, now)}</MetaChip>
          </span>
        ) : (
          <span style={{ marginLeft: 'auto' }}>
            <MetaChip>광고 · 24시간 이용</MetaChip>
          </span>
        )}
      </div>

      {unlocked ? (
        <>
          <p style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 6, lineHeight: 1.55 }}>
            {dateKey} 추천 딜 TOP {top.length} — 에디터 큐레이션 요약이에요.
          </p>
          <ol style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {top.map((d, i) => (
              <li key={d.id}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onExternalClick(d.url)}
                  className="pressable"
                  style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start', borderRadius: 12, padding: '10px 12px',
                    background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text,
                  }}
                >
                  <span aria-hidden style={{ flexShrink: 0, display: 'grid', placeItems: 'center', width: 24, height: 24,
                    borderRadius: 999, background: theme.accentSoft, color: theme.accent, fontSize: 12.5, fontWeight: 800 }}>
                    {i + 1}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: theme.accent }}>
                      {d.provider} · {d.discountLabel}
                    </span>
                    <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, lineHeight: 1.4, marginTop: 2 }}>{d.title}</span>
                    {d.howToClaim && (
                      <span style={{ display: '-webkit-box', fontSize: 12, color: theme.textMuted, marginTop: 3, lineHeight: 1.5,
                        overflow: 'hidden', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        받는 법 · {d.howToClaim}
                      </span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          {tip?.koreanNote && (
            <p style={{ fontSize: 12.5, color: theme.text, marginTop: 12, lineHeight: 1.6,
              background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: '10px 12px' }}>
              💡 절약 팁 · <b>{tip.provider}</b> — {tip.koreanNote}
            </p>
          )}
          <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 10, lineHeight: 1.6 }}>
            {extrasSnapshotDate} 기준 공개 데이터에서 고른 큐레이션이에요. 신청 전 공식 페이지에서 조건을 꼭 확인하세요.
          </p>
        </>
      ) : (
        <>
          <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            광고 1편을 보면 오늘 날짜 기준 추천 딜 TOP 3와 절약 팁을 24시간 동안 볼 수 있어요.
          </p>
          <button
            type="button"
            onClick={onWatch}
            className="pressable"
            style={{ width: '100%', marginTop: 12, minHeight: 48, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: theme.accent, color: theme.accentInk, fontSize: 14.5, fontWeight: 700 }}
          >
            광고 보고 오늘의 프리미엄 인사이트 잠금해제 ✨
          </button>
          {notice && (
            <p role="status" style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 8, lineHeight: 1.5 }}>{notice}</p>
          )}
          <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            프리미엄 인사이트는 공개 혜택 데이터에서 고른 에디터 큐레이션 요약이에요.
          </p>
        </>
      )}
    </section>
  );
}
