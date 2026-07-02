import { useEffect } from "react";

const BASE = "AIDigestDesk";
const DEFAULT_TITLE = `${BASE} · 한국어 AI/LLM 큐레이션 포털`;

/** 라우트별로 갱신하는 메타 셀렉터 목록 — index.html 의 기본 태그를 직접 갱신한다. */
const META_SELECTORS = {
  description: 'meta[name="description"]',
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  ogUrl: 'meta[property="og:url"]',
  twitterTitle: 'meta[name="twitter:title"]',
  twitterDescription: 'meta[name="twitter:description"]',
} as const;

type MetaKey = keyof typeof META_SELECTORS;

/** index.html 이 출하한 원본 기본값 — 최초 1회만 읽어 보관하고, 복원 시 그대로 되돌린다. */
let metaDefaults: Record<MetaKey, string> | null = null;

function getMetaElement(key: MetaKey): HTMLMetaElement | null {
  return document.querySelector<HTMLMetaElement>(META_SELECTORS[key]);
}

function readMetaDefaults(): Record<MetaKey, string> {
  if (!metaDefaults) {
    metaDefaults = {
      description: getMetaElement("description")?.content ?? "",
      ogTitle: getMetaElement("ogTitle")?.content ?? "",
      ogDescription: getMetaElement("ogDescription")?.content ?? "",
      ogUrl: getMetaElement("ogUrl")?.content ?? "",
      twitterTitle: getMetaElement("twitterTitle")?.content ?? "",
      twitterDescription: getMetaElement("twitterDescription")?.content ?? "",
    };
  }
  return metaDefaults;
}

function setMetaContent(key: MetaKey, content: string) {
  const element = getMetaElement(key);
  if (element && content) element.content = content;
}

function applyMeta(values: Record<MetaKey, string>, title: string) {
  document.title = title;
  (Object.keys(META_SELECTORS) as MetaKey[]).forEach((key) => {
    setMetaContent(key, values[key]);
  });
}

/**
 * 라우트별 document.title + SEO/공유 메타(description·og·twitter·og:url) 동기화.
 * SPA 라 서버 렌더 없이 DOM 을 직접 갱신한다(라이브러리 없음).
 *
 * - title/description 이 비면 index.html 의 원본 기본값으로 복원한다(기본 라우트).
 * - og:url 은 항상 현재 origin+pathname — pushState 이후 라우트 state 변경 시
 *   이 훅이 다시 실행되므로 주소 반영이 보장된다.
 * - 언마운트 시 전부 기본값으로 되돌려 잔존을 막는다.
 */
export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    const defaults = readMetaDefaults();
    const nextTitle = title ? `${title} · ${BASE}` : DEFAULT_TITLE;
    const nextDescription = description || defaults.description;
    applyMeta(
      {
        description: nextDescription,
        ogTitle: nextTitle,
        ogDescription: nextDescription,
        ogUrl: `${window.location.origin}${window.location.pathname}`,
        twitterTitle: nextTitle,
        twitterDescription: nextDescription,
      },
      nextTitle
    );
    return () => {
      applyMeta({ ...defaults }, DEFAULT_TITLE);
    };
  }, [title, description]);
}

/**
 * 페이지(라우트)별 document.title 설정 — SPA 에서 탭·북마크·공유 타이틀을 화면 내용에 맞춘다.
 * title 이 비면 기본 타이틀로 둔다. 언마운트 시 기본값으로 복원해 잔존을 막는다.
 */
export function useDocumentTitle(title?: string) {
  useDocumentMeta(title);
}
