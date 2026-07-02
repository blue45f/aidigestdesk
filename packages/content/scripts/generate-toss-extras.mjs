#!/usr/bin/env node
// 토스 인앱(apps/toss)용 컴팩트 부가 콘텐츠 생성기 — 웹 기능 파리티용.
// 혜택(deals)·이벤트(events)·용어집(glossary)·강좌(learning)·AI 도구(tools)를
// content 소스에서 추려 apps/toss/src/extras.json 으로 내보낸다(토스는 content 미의존).

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  aiCodingTools,
  eventScheduleItems,
  getBrandIconUrl,
  getDealStatus,
  getDomainFromUrl,
  getProviderIconUrl,
  getProviderLabel,
  glossaryTerms,
  learningResources,
  llmDeals,
  SNAPSHOT_DATE,
  translatedArticles,
} from '../dist/index.js'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, '../../..')
const outputPath = resolve(repoRoot, 'apps/toss/src/extras.json')

const cap = (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : [])

function periodLabel(period) {
  if (!period || period.alwaysOn || (!period.start && !period.end)) return '상시'
  if (period.start && period.end) return `${period.start} ~ ${period.end}`
  if (period.end) return `~ ${period.end}`
  if (period.start) return `${period.start} ~`
  return '상시'
}

// 제공사 브랜드 아이콘 URL — providerId면 제공사 favicon, 아니면(market 등) URL 도메인 favicon.
// 웹은 BrandMark(providerId/domain)로 렌더하므로 토스도 같은 소스로 베이크해 시각 싱크한다.
function brandIcon(provider, url) {
  if (provider && provider !== 'market') return getProviderIconUrl(provider) ?? null
  const domain = url ? getDomainFromUrl(url) : null
  return domain ? (getBrandIconUrl(domain) ?? null) : null
}

const deals = llmDeals.map((d) => ({
  id: d.id,
  provider: d.provider === 'market' ? d.providerName : (getProviderLabel(d.provider) ?? d.providerName),
  iconUrl: brandIcon(d.provider, d.url),
  dealType: d.dealType,
  audience: d.audience,
  region: d.region,
  title: d.title,
  summary: d.summary,
  discountLabel: d.discountLabel,
  status: getDealStatus(d, SNAPSHOT_DATE),
  periodLabel: periodLabel(d.period),
  eligibility: d.eligibility,
  howToClaim: d.howToClaim,
  koreanNote: d.koreanNote ?? null,
  url: d.url,
  tags: cap(d.tags, 4),
}))

const events = eventScheduleItems.map((e) => ({
  id: e.id,
  title: e.title,
  organizer: e.organizer,
  iconUrl: brandIcon(null, e.url),
  type: e.type,
  startDate: e.startDate,
  endDate: e.endDate ?? null,
  timeLabel: e.timeLabel ?? null,
  status: e.status,
  format: e.format,
  region: e.region,
  language: e.language,
  location: e.location,
  summary: e.summary,
  url: e.url,
  tags: cap(e.tags, 4),
}))

const glossary = glossaryTerms.map((g) => ({
  id: g.id,
  term: g.term,
  koName: g.koName,
  category: g.category,
  definition: g.definition,
  note: g.note ?? null,
  tags: cap(g.tags, 4),
}))

const learning = learningResources.map((r) => ({
  id: r.id,
  type: r.type,
  title: r.title,
  author: r.author,
  iconUrl: brandIcon(null, r.url),
  language: r.language,
  level: r.level,
  summary: r.summary,
  url: r.url,
  tags: cap(r.tags, 3),
}))

const tools = aiCodingTools.map((t) => ({
  id: t.id,
  toolName: t.toolName,
  vendor: t.vendor,
  category: t.category,
  pricing: t.pricing,
  eventSignal: t.eventSignal,
  bestFor: cap(t.bestFor, 4),
  integrations: cap(t.integrations, 5),
  tags: cap(t.tags, 4),
}))

// 해외 소식 번역(웹 TranslatedNewsSection 대응) — 소량이라 요점·한국 시사점까지 전체 유지.
const news = translatedArticles.map((n) => ({
  id: n.id,
  koTitle: n.koTitle,
  originalTitle: n.originalTitle,
  publisher: n.publisher,
  iconUrl: brandIcon(null, n.sourceUrl),
  region: n.region,
  originalLanguage: n.originalLanguage,
  publishedAt: n.publishedAt,
  koSummary: n.koSummary,
  keyPoints: cap(n.keyPoints, 4),
  koreanAngle: n.koreanAngle,
  sourceUrl: n.sourceUrl,
  tags: cap(n.tags, 4),
}))

const payload = { snapshotDate: SNAPSHOT_DATE, deals, events, glossary, learning, tools, news }

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

console.log(
  `toss extras → ${outputPath}\n  deals: ${deals.length}, events: ${events.length}, glossary: ${glossary.length}, learning: ${learning.length}, tools: ${tools.length}, news: ${news.length}`
)
