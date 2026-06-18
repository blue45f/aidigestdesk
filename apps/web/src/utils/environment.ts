export type BrowserLocaleContext = {
  isDomestic: boolean;
  locale: string;
  timeZone: string;
};

export type LocaleAwareFilterDefaults = {
  eventAreaScope: "all" | "국내" | "국외";
  eventRegion: "all" | "국내" | "북미" | "유럽" | "글로벌";
  eventLanguage: "all" | "한국어" | "영어" | "다국어";
  communityLanguage: "all" | "한국어" | "영어";
  resourceLanguage: "koreanOrCaption" | "all" | "한국어" | "영어";
};

const DOMESTIC_LANGUAGE_PREFIXES = ["ko", "ko-kr", "ko_kr"] as const;
const DOMESTIC_TIMEZONE_HINTS = ["asia/seoul", "asia/pyongyang", "asia/jeju"] as const;

export function getBrowserLocaleContext(): BrowserLocaleContext {
  if (typeof Intl === "undefined") {
    return { isDomestic: false, locale: "", timeZone: "" };
  }

  const localeFromNavigator =
    typeof navigator !== "undefined"
      ? (navigator.languages?.[0] || navigator.language || "")
      : "";
  const locale = (
    localeFromNavigator ||
    Intl.DateTimeFormat().resolvedOptions().locale ||
    ""
  ).toLowerCase();

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

export function getLocaleAwareFilterDefaults(
  browserContext: BrowserLocaleContext = getBrowserLocaleContext(),
): LocaleAwareFilterDefaults {
  const isDomesticUser = browserContext.isDomestic;

  return {
    eventAreaScope: isDomesticUser ? "국내" : "국외",
    eventRegion: isDomesticUser ? "국내" : "all",
    eventLanguage: isDomesticUser ? "한국어" : "영어",
    communityLanguage: isDomesticUser ? "한국어" : "영어",
    resourceLanguage: isDomesticUser ? "koreanOrCaption" : "영어",
  };
}
