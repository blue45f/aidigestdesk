import { flushSync } from 'react-dom'

/** View Transitions API 는 아직 lib.dom 미보장 브라우저 케이스가 있어 로컬 선언으로 안전하게 좁힌다. */
type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => unknown
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return true
  }
}

/**
 * 라우트 전환을 View Transition 으로 감싼다(지원 + 모션 허용 시).
 * commit 은 flushSync 로 동기 커밋되어 old/new 스냅숏이 정확히 라우트 전환 전후가 된다.
 *
 * @returns 트랜지션을 시작했으면 true. false 면 호출부가 즉시 전환(현행 동작)을 수행해야 한다.
 */
export function withRouteTransition(commit: () => void): boolean {
  if (typeof document === 'undefined') return false
  const doc = document as DocumentWithViewTransition
  if (typeof doc.startViewTransition !== 'function' || prefersReducedMotion()) return false
  doc.startViewTransition(() => {
    flushSync(commit)
  })
  return true
}
