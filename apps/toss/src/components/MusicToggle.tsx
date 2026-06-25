import {
  currentTrackName,
  isBgmPlaying,
  isSoundMuted,
  setSoundMuted,
  startBgm,
  stopBgm,
} from '@aidigestdesk/content/shared';
import { useEffect, useRef, useState } from 'react';

import { theme } from '../theme';

/**
 * 오디오 컨트롤(플로팅) — 효과음 on/off + 배경음악 on/off.
 * 효과음(클릭 틱·타이틀 스파클)은 isSoundMuted, 배경음악은 절차생성 4트랙 로테이션.
 * 둘 다 기본 ON(효과음)/OFF(음악·자동재생 정책). shared 엔진 공용.
 */
export function MusicToggle() {
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [on, setOn] = useState(() => isBgmPlaying());
  const [track, setTrack] = useState('');
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<number | null>(null);

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
    const update = () => setTrack(currentTrackName());
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
    } else {
      startBgm();
      setOn(true);
      setTrack(currentTrackName());
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setTrack(''), 3200);
    }
  };

  const btn = (active: boolean): React.CSSProperties => ({
    width: 46,
    height: 46,
    borderRadius: '50%',
    background: active ? theme.accentSoft : theme.surface,
    border: `1px solid ${active ? theme.accent : theme.border}`,
    color: active ? theme.accent : theme.textMuted,
    fontSize: 19,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
  });

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
        <span
          className="rise"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: theme.accent,
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 999,
            padding: '6px 12px',
            whiteSpace: 'nowrap',
          }}
        >
          ♪ {track}
        </span>
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
