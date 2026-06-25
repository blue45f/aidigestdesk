import {
  currentTrackName,
  isBgmPlaying,
  isSoundMuted,
  setSoundMuted,
  startBgm,
  stopBgm,
} from '@aidigestdesk/content/shared'
import { useEffect, useState } from 'react'

/**
 * 오디오 컨트롤(플로팅) — 효과음 on/off + 배경음악 on/off.
 * 토스와 동일한 @aidigestdesk/content/shared 엔진. 자동재생 안 함(autoplay 정책).
 */
export function MusicToggle() {
  const [muted, setMuted] = useState(() => isSoundMuted())
  const [on, setOn] = useState(() => isBgmPlaying())
  const [track, setTrack] = useState('')

  useEffect(() => {
    if (!on) return
    const update = () => setTrack(currentTrackName())
    update()
    const id = window.setInterval(update, 4000)
    return () => clearInterval(id)
  }, [on])

  const toggleSound = () => {
    const next = !muted
    setSoundMuted(next)
    setMuted(next)
  }

  const toggleMusic = () => {
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

  const cls = (active: boolean) =>
    `flex size-11 items-center justify-center rounded-full border text-lg shadow-md transition-transform active:scale-95 ${
      active ? 'border-accent bg-accent/12 text-accent' : 'border-border bg-surface text-text-muted'
    }`

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
        onClick={toggleSound}
        aria-label={muted ? '효과음 켜기' : '효과음 끄기'}
        aria-pressed={!muted}
        className={cls(!muted)}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={on ? '배경음악 끄기' : '배경음악 켜기'}
        aria-pressed={on}
        className={cls(on)}
      >
        {on ? '🎶' : '🎵'}
      </button>
    </div>
  )
}
