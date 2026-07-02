import {
  currentTrackCredit,
  currentTrackName,
  isBgmPlaying,
  isSoundMuted,
  setSoundMuted,
  startBgm,
  stopBgm,
} from '@aidigestdesk/content/shared';
import { useEffect, useRef, useState } from 'react';

import { openExternal } from '../lib/links';
import { theme } from '../theme';

/**
 * 오디오 컨트롤(플로팅) — 효과음 on/off + 배경음악 on/off.
 * 효과음(클릭 틱·타이틀 스파클)은 isSoundMuted, 배경음악은 호스티드 mp3(+절차생성 폴백).
 * 둘 다 기본 ON(효과음)/OFF(음악·자동재생 정책). shared 엔진 공용.
 * 호스티드 트랙이면 pill에 아티스트 크레딧 표기 + 탭 시 출처(Pixabay) 열기.
 */
export function MusicToggle() {
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [on, setOn] = useState(() => isBgmPlaying());
  const [track, setTrack] = useState('');
  const [credit, setCredit] = useState<ReturnType<typeof currentTrackCredit>>(null);
  const [visible, setVisible] = useState(true);
  // 좁은 화면(≤380px)에선 FAB를 살짝 축소해 콘텐츠 가림을 줄인다(라이브 QA).
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 380,
  );
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(max-width: 380px)');
    const onChange = () => setCompact(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // 거슬리지 않게 — 몇 초 뒤 자동 숨김(투명), 스크롤·터치 등 활동하면 다시 나타남.
  useEffect(() => {
    let t = 0;
    const reveal = () => {
      setVisible(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setVisible(false), 3500);
    };
    reveal();
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', reveal, opts);
    window.addEventListener('touchstart', reveal, opts);
    window.addEventListener('pointerdown', reveal, opts);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', reveal);
      window.removeEventListener('touchstart', reveal);
      window.removeEventListener('pointerdown', reveal);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    const update = () => {
      setTrack(currentTrackName());
      setCredit(currentTrackCredit());
    };
    update();
    const id = window.setInterval(update, 4000);
    return () => clearInterval(id);
  }, [on]);

  const toggleSound = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  };

  const toggleMusic = () => {
    if (on) {
      stopBgm();
      setOn(false);
      setTrack('');
      setCredit(null);
    } else {
      startBgm();
      setOn(true);
      setTrack(currentTrackName());
      setCredit(currentTrackCredit());
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setTrack(''), 3200);
    }
  };

  const btn = (active: boolean): React.CSSProperties => ({
    width: compact ? 40 : 46,
    height: compact ? 40 : 46,
    borderRadius: '50%',
    background: active ? theme.accentSoft : theme.surface,
    border: `1px solid ${active ? theme.accent : theme.border}`,
    color: active ? theme.accent : theme.textMuted,
    fontSize: compact ? 17 : 19,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
  });

  const pillStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: theme.accent,
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 999,
    padding: '6px 12px',
    whiteSpace: 'nowrap',
    maxWidth: '46vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  const pillLabel = `♪ ${track}${credit?.artist ? ` — ${credit.artist}` : ''}`;
  const creditUrl = credit?.creditUrl;

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 78px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.45s ease',
      }}
    >
      {on && track && (
        creditUrl ? (
          <button
            type="button"
            className="rise"
            onClick={() => openExternal(creditUrl)}
            aria-label={`배경음악 출처 보기: ${track}`}
            style={{ ...pillStyle, cursor: 'pointer', font: 'inherit', fontSize: 12, fontWeight: 700 }}
          >
            {pillLabel}
          </button>
        ) : (
          <span className="rise" style={pillStyle}>
            {pillLabel}
          </span>
        )
      )}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? '효과음 켜기' : '효과음 끄기'}
        aria-pressed={!muted}
        className="pressable"
        style={btn(!muted)}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={on ? '배경음악 끄기' : '배경음악 켜기'}
        aria-pressed={on}
        className="pressable"
        style={btn(on)}
      >
        {on ? '🎶' : '🎵'}
      </button>
    </div>
  );
}
