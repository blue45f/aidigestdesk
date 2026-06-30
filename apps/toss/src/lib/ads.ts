import {
  TossAds,
  isMinVersionSupported,
  loadFullScreenAd,
  showFullScreenAd,
  type TossAdsAttachBannerOptions,
  type TossAdsAttachBannerResult,
} from '@apps-in-toss/web-framework';
import {
  startBgm,
  stopBgm,
  isBgmPlaying,
  getAudioContext,
} from '@aidigestdesk/content/shared';
import { useEffect, useRef, useState } from 'react';

import { isInToss } from './toss';

/** 배너 최소 토스 앱 버전(문서: 미만은 빈 화면). */
const MIN_VERSION = '5.241.0' as const;

/** Full screen test ad ID from Toss docs. */
const TEST_FULLSCREEN_AD_GROUP_ID = 'ait.dev.43daa14da3ae487b';

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

export type FullScreenAdFormat = 'interstitial' | 'rewarded';

/** 전면/보상형 광고 그룹 ID를 가져와요. */
export function getFullScreenAdGroupId(format: FullScreenAdFormat): string | null {
  const value =
    format === 'rewarded'
      ? import.meta.env.VITE_TOSS_REWARDED_AD_GROUP_ID
      : import.meta.env.VITE_TOSS_INTERSTITIAL_AD_GROUP_ID;
  if (value?.trim()) return value.trim();
  return import.meta.env.DEV ? TEST_FULLSCREEN_AD_GROUP_ID : null;
}

function isFullScreenAdSupported(): boolean {
  try {
    return Boolean(loadFullScreenAd.isSupported() && showFullScreenAd.isSupported());
  } catch {
    return false;
  }
}

let pausedForAd = false;
let bgmWasPlayingBeforeAd = false;

function pauseAudioForAd(): void {
  if (pausedForAd) return;
  pausedForAd = true;

  bgmWasPlayingBeforeAd = isBgmPlaying();
  if (bgmWasPlayingBeforeAd) {
    stopBgm();
  }

  const ctx = getAudioContext();
  if (ctx && ctx.state === 'running') {
    void ctx.suspend().catch(() => {});
  }
}

function resumeAudioAfterAd(): void {
  if (!pausedForAd) return;
  pausedForAd = false;

  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume()
      .then(() => {
        if (bgmWasPlayingBeforeAd) {
          startBgm();
        }
      })
      .catch(() => {
        if (bgmWasPlayingBeforeAd) {
          startBgm();
        }
      });
  } else {
    if (bgmWasPlayingBeforeAd) {
      startBgm();
    }
  }
}

type FullScreenAdCallbacks = Readonly<{
  onReward?: (reward: { unitType: string; unitAmount: number }) => void;
  onError?: (error: Error) => void;
}>;

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

/** 통합 광고 전면/보상형 훅 */
export function useTossFullScreenAd(
  format: FullScreenAdFormat,
  callbacks: FullScreenAdCallbacks = {},
) {
  const adGroupId = getFullScreenAdGroupId(format);
  const supported = isFullScreenAdSupported();
  const [ready, setReady] = useState(false);
  const loadUnregisterRef = useRef<(() => void) | null>(null);
  const showUnregisterRef = useRef<(() => void) | null>(null);
  const loadRef = useRef<() => void>(() => undefined);
  const onRewardRef = useRef(callbacks.onReward);
  const onErrorRef = useRef(callbacks.onError);

  onRewardRef.current = callbacks.onReward;
  onErrorRef.current = callbacks.onError;

  const unregisterLoad = () => {
    loadUnregisterRef.current?.();
    loadUnregisterRef.current = null;
  };

  const unregisterShow = () => {
    showUnregisterRef.current?.();
    showUnregisterRef.current = null;
  };

  loadRef.current = () => {
    unregisterLoad();
    setReady(false);
    if (!adGroupId || !supported) return;

    try {
      loadUnregisterRef.current = loadFullScreenAd({
        options: { adGroupId },
        onEvent: ({ type }) => {
          if (type !== 'loaded') return;
          unregisterLoad();
          setReady(true);
        },
        onError: (error) => {
          unregisterLoad();
          setReady(false);
          onErrorRef.current?.(toError(error));
        },
      });
    } catch (error) {
      setReady(false);
      onErrorRef.current?.(toError(error));
    }
  };

  useEffect(() => {
    loadRef.current();
    return () => {
      unregisterLoad();
      unregisterShow();
    };
  }, [adGroupId, supported]);

  const show = (): boolean => {
    if (!ready || !adGroupId || !supported) return false;

    unregisterShow();
    setReady(false);
    let finished = false;
    const finishAndReload = () => {
      if (finished) return;
      finished = true;
      unregisterShow();
      resumeAudioAfterAd();
      loadRef.current();
    };

    try {
      pauseAudioForAd();
      showUnregisterRef.current = showFullScreenAd({
        options: { adGroupId },
        onEvent: (event) => {
          if (event.type === 'userEarnedReward') {
            onRewardRef.current?.(event.data);
          }
          if (event.type === 'dismissed' || event.type === 'failedToShow') {
            finishAndReload();
          }
        },
        onError: (error) => {
          onErrorRef.current?.(toError(error));
          finishAndReload();
        },
      });
      return true;
    } catch (error) {
      onErrorRef.current?.(toError(error));
      finishAndReload();
      return false;
    }
  };

  return {
    configured: Boolean(adGroupId),
    ready,
    reload: () => loadRef.current(),
    show,
    supported,
  };
}

