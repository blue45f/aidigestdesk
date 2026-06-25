import { generateHapticFeedback, type HapticFeedbackType } from '@apps-in-toss/web-framework';
import { isSoundMuted } from '@aidigestdesk/content/shared';

import { isInToss } from './toss';

/**
 * 네이티브 햅틱 진동 — 토스 인앱에서만 동작(웹/샌드박스 no-op). 효과음 음소거(🔇) 시 함께 꺼진다.
 * tickWeak=가벼운 탭, confetti=축하(타이틀 팡). 실패는 조용히 무시.
 */
export function haptic(type: HapticFeedbackType = 'tickWeak'): void {
  try {
    if (!isInToss() || isSoundMuted()) return;
    generateHapticFeedback({ type });
  } catch {
    /* 미지원 환경 무시 */
  }
}
