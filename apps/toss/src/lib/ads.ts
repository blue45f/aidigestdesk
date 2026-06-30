/**
 * 앱인토스 인앱 배너 광고 가드 래퍼.
 * 배너는 토스 앱 5.241.0+ 에서만 동작한다. 미만/비토스(샌드박스·웹)에선 모두 no-op →
 * 빈 화면 대신 미노출(컴포넌트가 null 반환). lib/toss.ts 의 try/catch 폴백 원칙을 그대로 따른다.
 */
import {
  TossAds,
  isMinVersionSupported,
  type TossAdsAttachBannerOptions,
  type TossAdsAttachBannerResult,
} from '@apps-in-toss/web-framework';

import { isInToss } from './toss';

/** 배너 최소 토스 앱 버전(문서: 미만은 빈 화면). */
const MIN_VERSION = '5.241.0' as const;

/**
 * 콘솔에서 발급한 운영 광고 그룹 ID만 사용한다.
 *
 * 출시 번들에 테스트 ID가 포함되면 심사가 반려되므로 환경변수가 없을 때 테스트 ID로
 * 폴백하지 않는다. 운영 ID가 준비되지 않은 환경에서는 BannerAd가 광고를 렌더하지 않는다.
 */
export const AD_GROUPS = {
  /** 목록·피드형 배너. 미설정 시 광고 미노출. */
  feedList: import.meta.env.VITE_TOSS_AD_GROUP_FEED?.trim() ?? '',
  /** 상세(매뉴얼·랭킹·소식 상세) 본문 하단 배너. 미설정 시 광고 미노출. */
  detail: import.meta.env.VITE_TOSS_AD_GROUP_DETAIL?.trim() ?? '',
} as const;

/** 이 환경에서 배너를 띄울 수 있는지. false면 컴포넌트는 아무것도 렌더하지 않아야 한다. */
export function adsSupported(): boolean {
  try {
    if (!isInToss()) return false;
    if (!TossAds.attachBanner.isSupported()) return false;
    return isMinVersionSupported({ android: MIN_VERSION, ios: MIN_VERSION });
  } catch {
    return false;
  }
}

let initialized = false;
let initPromise: Promise<boolean> | null = null;

/** SDK 1회 초기화(멱등 싱글톤) — StrictMode 이중 마운트·동시 호출에도 1회만 실행. */
function ensureInitialized(): Promise<boolean> {
  if (initialized) return Promise.resolve(true);
  if (initPromise) return initPromise;
  if (!adsSupported() || !TossAds.initialize.isSupported()) return Promise.resolve(false);
  initPromise = new Promise<boolean>((resolve) => {
    try {
      TossAds.initialize({
        callbacks: {
          onInitialized: () => {
            initialized = true;
            resolve(true);
          },
          onInitializationFailed: () => resolve(false),
        },
      });
    } catch {
      resolve(false);
    }
  });
  return initPromise;
}

/** 안전 attach. 미지원/실패 시 null. 반환된 destroy는 언마운트 시 반드시 호출. */
export async function attachBannerSafe(
  adGroupId: string,
  el: HTMLElement,
  options?: TossAdsAttachBannerOptions,
): Promise<TossAdsAttachBannerResult | null> {
  if (!adGroupId) return null;
  const ok = await ensureInitialized();
  if (!ok) return null;
  try {
    return TossAds.attachBanner(adGroupId, el, options);
  } catch {
    return null;
  }
}
