import { currentTrackName, isBgmPlaying, startBgm, stopBgm } from '@aidigestdesk/content/shared'
import { useEffect, useState } from 'react'

/**
 * 배경음악 토글 — 플로팅 버튼(기본 OFF). 절차생성 앰비언트(4트랙 로테이션) 재생/정지.
 * 이펙트·사운드는 토스와 동일한 @aidigestdesk/content/shared 엔진. 자동재생 안 함(autoplay 정책).
 */
export function MusicToggle() {
  const [on, setOn] = useState(() => isBgmPlaying())
  const [track, setTrack] = useState('')

  useEffect(() => {
    if (!on) return
    const update = () => setTrack(currentTrackName())
    update()
    const id = window.setInterval(update, 4000)
    return () => clearInterval(id)
  }, [on])

  const toggle = () => {
    if (on) {
      stopBgm()
      setOn(false)
      setTrack('')
    } else {
      startBgm()
      setOn(true)
      setTrack(currentTrackName())
    }
  }

  return (
    <div
      className="fixed right-4 z-40 flex items-center gap-2"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)' }}
    >
      {on && track && (
        <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-accent shadow-sm">
          ♪ {track}
        </span>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={on ? '배경음악 끄기' : '배경음악 켜기'}
        aria-pressed={on}
        className={`flex size-11 items-center justify-center rounded-full border text-lg shadow-md transition-transform active:scale-95 ${
          on ? 'border-accent bg-accent/12 text-accent' : 'border-border bg-surface text-text-muted'
        }`}
      >
        {on ? '🎶' : '🎵'}
      </button>
    </div>
  )
}
