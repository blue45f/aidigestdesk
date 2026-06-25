import { burstParticles, playPop } from '@aidigestdesk/content/shared'
import { useCallback, useRef, type KeyboardEvent, type ReactNode } from 'react'

/**
 * 화려한 타이틀 — 연속 그라데이션 시머(.aid-shimmer-title) + 탭하면 "팡" 파티클 + 스파클 사운드.
 * 이펙트·사운드는 @aidigestdesk/content/shared 공용(토스와 동일). 폰트 크기는 부모에서 상속.
 */
export function AnimatedTitle({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  const fire = useCallback(() => {
    playPop()
    burstParticles(ref.current)
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        fire()
      }
    },
    [fire],
  )

  return (
    <span
      ref={ref}
      className={`aid-shimmer-title${className ? ` ${className}` : ''}`}
      role="button"
      tabIndex={0}
      aria-label={typeof children === 'string' ? children : undefined}
      onClick={fire}
      onKeyDown={onKeyDown}
    >
      {children}
    </span>
  )
}
