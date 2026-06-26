import type { HapticType, PlatformBridge } from '@aidigestdesk/client';
import { copyText } from '@aidigestdesk/content/shared';

import { haptic as nativeHaptic } from '../lib/haptic';
import { openExternal as nativeOpenExternal } from '../lib/links';
import { getMiniAppSchemeUri, getStableUserKey, getTossEnv, isInToss, shareMessage } from '../lib/toss';

// 공유 햅틱 종류 → 토스 네이티브 종류 매핑(토스는 tickWeak/confetti 사용).
const HAPTIC_MAP: Record<HapticType, 'tickWeak' | 'confetti'> = {
  tickWeak: 'tickWeak',
  confetti: 'confetti',
  success: 'confetti',
  error: 'tickWeak',
};

/**
 * 토스 PlatformBridge 구현 — 기존 lib/{toss,haptic,links} 래퍼에 위임한다(동작 동일).
 * 네이티브 의존(@apps-in-toss/web-framework)은 이 파일과 lib/* 안에만 존재한다.
 */
export const tossPlatformBridge: PlatformBridge = {
  env: getTossEnv(),
  isInToss: isInToss(),
  async share(input) {
    const message = [input.title, input.text, input.url].filter(Boolean).join('\n') || (input.url ?? '');
    const r = await shareMessage(message);
    if (r === 'toss' || r === 'web-share') return 'shared';
    if (r === 'clipboard') return 'copied';
    return 'unsupported';
  },
  haptic(type = 'tickWeak') {
    nativeHaptic(HAPTIC_MAP[type]);
  },
  copyText,
  openExternal: nativeOpenExternal,
  getStableUserKey,
  getEntryRoute: getMiniAppSchemeUri,
};
