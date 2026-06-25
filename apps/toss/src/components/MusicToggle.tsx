import { currentTrackName, isBgmPlaying, startBgm, stopBgm } from '@aidigestdesk/content/shared';
import { useEffect, useRef, useState } from 'react';

import { theme } from '../theme';

/**
 * 배경음악 토글 — 플로팅 버튼(기본 OFF). 탭하면 절차생성 앰비언트(4트랙 로테이션) 재생/정지.
 * 자동재생 안 함(autoplay 정책). 재생 중엔 현재 트랙명을 잠깐 보여준다.
 */
export function MusicToggle() {
  const [on, setOn] = useState(() => isBgmPlaying());
  const [track, setTrack] = useState('');
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!on) return;
    const update = () => setTrack(currentTrackName());
    update();
    const id = window.setInterval(update, 4000);
    return () => clearInterval(id);
  }, [on]);

  const toggle = () => {
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
        onClick={toggle}
        aria-label={on ? '배경음악 끄기' : '배경음악 켜기'}
        aria-pressed={on}
        className="pressable"
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: on ? theme.accentSoft : theme.surface,
          border: `1px solid ${on ? theme.accent : theme.border}`,
          color: on ? theme.accent : theme.textMuted,
          fontSize: 19,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
        }}
      >
        {on ? '🎶' : '🎵'}
      </button>
    </div>
  );
}
