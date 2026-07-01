/**
 * 앱인토스 WebView 브릿지 래퍼.
 * 토스 환경이 아닐 때(일반 브라우저/개발)도 안전하게 폴백하도록 모두 try/catch로 감싸요.
 */
import {
  appLogin,
  getAnonymousKey,
  getIsTossLoginIntegratedService,
  getOperationalEnvironment,
  getSchemeUri,
  getTossShareLink,
  share,
} from '@apps-in-toss/web-framework';

export type TossEnv = 'toss' | 'sandbox' | 'web';

/** 'toss'(실기기/앱) | 'sandbox'(샌드박스) | 'web'(브릿지 없음). */
export function getTossEnv(): TossEnv {
  try {
    return getOperationalEnvironment();
  } catch {
    return 'web';
  }
}

export const isInToss = (): boolean => getTossEnv() !== 'web';

const TOSS_OG_IMAGE_URL = 'https://aidigestdesk.vercel.app/og-toss.png';

/**
 * 비게임 미니앱 사용자 식별키(hash). 서버/동의 없이 미니앱 내 고유 사용자 식별.
 * 샌드박스에서는 mock, 미지원/실패 시 null.
 */
export async function getStableUserKey(): Promise<string | null> {
  try {
    const result = await getAnonymousKey();
    if (result && typeof result === 'object' && result.type === 'HASH') {
      return result.hash;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 토스 로그인 인가 코드 획득. 토큰 교환/사용자 조회는 서버에서 처리해야 해요(mTLS).
 * 인가 코드는 10분 유효·일회성.
 */
export async function tossAppLogin(): Promise<{
  authorizationCode: string;
  referrer: 'DEFAULT' | 'SANDBOX';
} | null> {
  try {
    const result = await appLogin();
    return result ?? null;
  } catch {
    return null;
  }
}

/** 콘솔에서 토스 로그인 설정이 완료됐는지 확인한다. 미지원 환경은 false. */
export async function isTossLoginAvailable(): Promise<boolean> {
  if (!isInToss()) return false;
  if (getTossEnv() === 'sandbox') return true; // 샌드박스 환경에서는 테스트 가능하도록 항상 노출
  try {
    return Boolean(await getIsTossLoginIntegratedService());
  } catch {
    return false;
  }
}

/** 이 미니앱으로 돌아오는 딥링크 스킴(intoss://pickflow ...). */
export function getMiniAppSchemeUri(): string | null {
  try {
    return getSchemeUri();
  } catch {
    return null;
  }
}

/** 공식 앱인토스 공유 링크 + 1200×600 OG 이미지를 생성한다. */
export async function buildTossShareLink(): Promise<string | null> {
  if (!isInToss()) return null;
  try {
    const link = await getTossShareLink('intoss://aidigestdesk', TOSS_OG_IMAGE_URL);
    return typeof link === 'string' && link.length > 0 ? link : null;
  } catch {
    return null;
  }
}

/**
 * 메시지 공유. 토스 네이티브 공유 → navigator.share → 클립보드 순으로 폴백.
 * @returns 공유/복사 성공 여부
 */
export async function shareMessage(
  message: string,
): Promise<'toss' | 'web-share' | 'clipboard' | null> {
  if (isInToss()) {
    try {
      await share({ message });
      return 'toss';
    } catch {
      // fall through to web fallbacks
    }
  }

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ text: message });
      return 'web-share';
    }
  } catch {
    return null; // 사용자가 공유 시트를 닫은 경우 등
  }

  try {
    await navigator.clipboard.writeText(message);
    return 'clipboard';
  } catch {
    return null;
  }
}
