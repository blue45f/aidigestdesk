import { burstParticles, playPop } from '@aidigestdesk/content/shared';
import { useCallback, useRef, type KeyboardEvent, type ReactNode } from 'react';

import { haptic } from '../lib/haptic';

/**
 * 화려한 타이틀 — 연속 그라데이션 시머(.aid-shimmer-title) + 탭하면 "팡" 파티클 + 스파클 사운드.
 * 이펙트·사운드 로직은 @aidigestdesk/content/shared 공용(웹과 동일). 접근성: 버튼 역할.
 */
export function AnimatedTitle({ children, size = 22 }: { children: ReactNode; size?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  const fire = useCallback(() => {
    playPop();
    haptic('confetti');
    burstParticles(ref.current);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fire();
      }
    },
    [fire],
  );

  return (
    <span
      ref={ref}
      className="aid-shimmer-title"
      role="button"
      tabIndex={0}
      aria-label={typeof children === 'string' ? children : undefined}
      onClick={fire}
      onKeyDown={onKeyDown}
      style={{ fontSize: size }}
    >
      {children}
    </span>
  );
}
