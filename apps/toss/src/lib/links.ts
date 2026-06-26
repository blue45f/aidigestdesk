import { openURL } from '@apps-in-toss/web-framework';

import type { MouseEvent } from 'react';

import { isInToss } from './toss';

/**
 * 외부 링크 열기 — 토스 인앱에선 openURL(기기 기본 브라우저)로 안정적으로 열고,
 * 웹/샌드박스에선 새 탭으로 폴백. WebView에서 raw `<a target=_blank>`가 안 열리는 문제 해결.
 */
export function openExternal(url: string): void {
  if (isInToss()) {
    openURL(url).catch(() => {});
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/** `<a onClick>`에 부착 — 토스에선 기본 이동을 막고 openURL을 사용(웹은 그대로 새 탭). */
export function onExternalClick(url: string) {
  return (e: MouseEvent) => {
    if (isInToss()) {
      e.preventDefault();
      openExternal(url);
    }
  };
}
