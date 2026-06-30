import { useEffect, useRef, useState } from 'react';

import { adsSupported, attachBannerSafe } from '../lib/ads';

import type {
  TossAdsAttachBannerOptions,
  TossAdsAttachBannerResult,
} from '@apps-in-toss/web-framework';

/**
 * 앱인토스 인앱 배너. 토스 5.241.0+ 에서만 노출되고, 미지원 환경(샌드박스·웹·구버전)에선
 * 아무것도 렌더하지 않는다(빈 박스 방지). 언마운트 시 destroy()로 슬롯을 정리한다.
 */
export function BannerAd({
  adGroupId,
  variant = 'card',
  tone = 'blackAndWhite',
  marginTop = 0,
}: {
  adGroupId: string;
  variant?: TossAdsAttachBannerOptions['variant'];
  tone?: TossAdsAttachBannerOptions['tone'];
  marginTop?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [supported] = useState(() => adsSupported());

  useEffect(() => {
    if (!adGroupId || !supported || !ref.current) return;
    let result: TossAdsAttachBannerResult | null = null;
    let cancelled = false;
    // 라이트/다크 자동 — index.css의 prefers-color-scheme와 광고 테마를 맞춘다(하드코딩 금지).
    const scheme =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)')?.matches
        ? 'light'
        : 'dark';
    void attachBannerSafe(adGroupId, ref.current, { theme: scheme, tone, variant }).then((r) => {
      if (cancelled) {
        r?.destroy();
        return;
      }
      result = r;
    });
    return () => {
      cancelled = true;
      result?.destroy();
    };
  }, [supported, adGroupId, tone, variant]);

  if (!adGroupId || !supported) return null;
  // 너비는 항상 100%(고정 px 금지). 높이는 variant에 맞춰 자동.
  return <div ref={ref} style={{ width: '100%', marginTop }} />;
}
