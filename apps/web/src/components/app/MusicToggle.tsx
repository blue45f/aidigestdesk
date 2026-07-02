import {
  currentTrackCredit,
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
 * 호스티드 트랙이면 pill에 아티스트 크레딧 + 출처 링크(Pixabay) 표기.
 */
export function MusicToggle() {
  const [muted, setMuted] = useState(() => isSoundMuted())
  const [on, setOn] = useState(() => isBgmPlaying())
  const [track, setTrack] = useState('')
  const [credit, setCredit] = useState<ReturnType<typeof currentTrackCredit>>(null)
  // 거슬리지 않게 — 몇 초 뒤 자동 숨김(투명), 스크롤·마우스·터치 등 활동하면 다시 나타남.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let hideTimer = 0
    const reveal = () => {
      setVisible(true)
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => setVisible(false), 3500)
    }
    reveal()
    const opts: AddEventListenerOptions = { passive: true }
    window.addEventListener('mousemove', reveal, opts)
    window.addEventListener('scroll', reveal, opts)
    window.addEventListener('touchstart', reveal, opts)
    window.addEventListener('keydown', reveal)
    return () => {
      window.clearTimeout(hideTimer)
      window.removeEventListener('mousemove', reveal)
      window.removeEventListener('scroll', reveal)
      window.removeEventListener('touchstart', reveal)
      window.removeEventListener('keydown', reveal)
    }
  }, [])

  useEffect(() => {
    if (!on) return
    const update = () => {
      setTrack(currentTrackName())
      setCredit(currentTrackCredit())
    }
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
      setCredit(null)
    } else {
      startBgm()
      setOn(true)
      setTrack(currentTrackName())
      setCredit(currentTrackCredit())
    }
  }

  // 좁은 화면(≤380px)에선 FAB를 살짝 축소해 콘텐츠 가림을 줄인다(라이브 QA).
  const cls = (active: boolean) =>
    `flex size-11 items-center justify-center rounded-full border text-lg shadow-md transition-transform active:scale-95 max-[380px]:size-10 ${
      active ? 'border-accent bg-accent/12 text-accent-text' : 'border-border bg-surface text-text-muted'
    }`

  const pillCls =
    'max-w-[46vw] truncate rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-accent shadow-sm'
  const pillLabel = `♪ ${track}${credit?.artist ? ` — ${credit.artist}` : ''}`

  return (
    <div
      className="fixed right-4 z-40 flex items-center gap-2"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.45s ease',
      }}
    >
      {on && track && (
        credit?.creditUrl ? (
          <a
            href={credit.creditUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`배경음악 출처 보기: ${track}`}
            className={pillCls}
          >
            {pillLabel}
          </a>
        ) : (
          <span className={pillCls}>{pillLabel}</span>
        )
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
