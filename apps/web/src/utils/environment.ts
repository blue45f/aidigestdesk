export type BrowserLocaleContext = {
  isDomestic: boolean;
  locale: string;
  timeZone: string;
};

const DOMESTIC_LANGUAGE_PREFIXES = ["ko", "ko-kr", "ko_kr"] as const;
const DOMESTIC_TIMEZONE_HINTS = ["asia/seoul", "asia/pyongyang", "asia/jeju"] as const;

export function getBrowserLocaleContext(): BrowserLocaleContext {
  if (typeof navigator === "undefined" || typeof Intl === "undefined") {
    return { isDomestic: false, locale: "", timeZone: "" };
  }

  const locale = (navigator.languages?.[0] || navigator.language || "").toLowerCase();

  let timeZone = "";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
  } catch {
    timeZone = "";
  }

  const isKoreanLocale = DOMESTIC_LANGUAGE_PREFIXES.some((prefix) =>
    locale === prefix || locale.startsWith(`${prefix}-`),
  );
  const isKoreanTimeZone = DOMESTIC_TIMEZONE_HINTS.some((tzHint) =>
    timeZone.includes(tzHint),
  );

  return {
    isDomestic: isKoreanLocale || isKoreanTimeZone,
    locale,
    timeZone,
  };
}
