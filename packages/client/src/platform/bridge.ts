import { createContext, useContext } from "react";

/**
 * 플랫폼 능력 추상화 (PlatformBridge).
 *
 * 웹과 토스인앱의 **유일한 본질적 차이는 프레젠테이션(웹=Tailwind/Radix, 토스=TDS)과
 * 네이티브 기능**이다. 이 인터페이스는 후자(공유·햅틱·클립보드·외부링크·식별키·딥링크)를
 * 단일 계약으로 묶어, 공유 코드(packages/client)가 `usePlatform()`만 호출하고
 * 각 앱이 구현을 주입하도록 한다. 토스 네이티브 API(@apps-in-toss/web-framework)는
 * 토스 구현체(apps/toss/src/platform)에만 존재하며, 공유 코드는 환경 분기(`if (isInToss)`)를
 * 하지 않는다.
 *
 * 표준 문서: heejun/docs/TOSS-MINIAPP-PLAYBOOK.md §4
 */

/** 공유 결과 — 네이티브 공유 완료 | 클립보드 복사 폴백 | 사용자 취소 | 둘 다 불가. */
export type ShareResult = "shared" | "copied" | "dismissed" | "unsupported";

export interface ShareInput {
  /** 공유 제목(미지원 시 복사 텍스트에 포함). */
  title?: string;
  /** 공유 설명. */
  text?: string;
  /** 공유 URL. 생략 시 현재 location.href. */
  url?: string;
}

/** 플랫폼 무관 햅틱 종류. 토스에서만 실제 진동, 웹은 no-op. */
export type HapticType = "tickWeak" | "confetti" | "success" | "error";

/** 'toss'(실기기/앱) | 'sandbox'(샌드박스) | 'web'(브리지 없음). */
export type PlatformEnv = "toss" | "sandbox" | "web";

export interface PlatformBridge {
  /** 현재 실행 환경. */
  readonly env: PlatformEnv;
  /** 토스(앱/샌드박스) 환경 여부. */
  readonly isInToss: boolean;
  /** 콘텐츠 공유. 네이티브 공유 → 웹 공유 → 클립보드 순으로 폴백. */
  share(input: ShareInput): Promise<ShareResult>;
  /** 햅틱 진동(토스 전용, 웹은 no-op). */
  haptic(type?: HapticType): void;
  /** 클립보드 복사. 성공 여부 반환. */
  copyText(text: string): Promise<boolean>;
  /** 외부 링크 열기(토스=기기 브라우저, 웹=새 탭). */
  openExternal(url: string): void;
  /** 비게임 미니앱 익명 식별키(토스 hash). 웹은 null. */
  getStableUserKey(): Promise<string | null>;
  /** 미니앱 진입 딥링크 스킴(토스). 웹은 null. */
  getEntryRoute(): string | null;
}

/** 클립보드 복사 — navigator.clipboard 우선, 미지원/거부 시 textarea+execCommand 폴백. */
async function webCopyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 폴백으로 진행 */
  }
  try {
    if (typeof document === "undefined") return false;
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * 웹 표준 구현. 토스 의존성이 전혀 없어 클라이언트 패키지에 둘 수 있고,
 * apps/web 은 이 구현을 그대로 주입한다(웹 보일러플레이트 0).
 */
export const webPlatformBridge: PlatformBridge = {
  env: "web",
  isInToss: false,
  async share(input) {
    if (typeof navigator === "undefined") return "unsupported";
    const url = input.url ?? (typeof location !== "undefined" ? location.href : "");
    const data: ShareData = { title: input.title, text: input.text, url };
    if (typeof navigator.share === "function") {
      try {
        if (typeof navigator.canShare !== "function" || navigator.canShare(data)) {
          await navigator.share(data);
          return "shared";
        }
      } catch (err) {
        // 사용자가 시트를 닫음 → 정상 흐름.
        if (err instanceof DOMException && err.name === "AbortError") return "dismissed";
        // 그 외 오류는 클립보드 폴백으로.
      }
    }
    const copyStr = [input.title, input.text, url].filter(Boolean).join(" — ") || url;
    return (await webCopyText(copyStr)) ? "copied" : "unsupported";
  },
  haptic() {
    /* 웹은 햅틱 없음 */
  },
  copyText: webCopyText,
  openExternal(url) {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  },
  async getStableUserKey() {
    return null;
  },
  getEntryRoute() {
    return null;
  },
};

/** 기본값 = 웹 브리지. 토스 앱은 Provider 로 tossPlatformBridge 를 주입한다. */
export const PlatformContext = createContext<PlatformBridge>(webPlatformBridge);

/** 공유 코드에서 플랫폼 능력에 접근하는 유일한 진입점. */
export function usePlatform(): PlatformBridge {
  return useContext(PlatformContext);
}
