#!/usr/bin/env node
// 토스 인앱(apps/toss) "소식" 피드 생성기 — 웹과 동일한 단일 소스(content.updates)에서 파생.
// 기존 수기 sample-data.json 포크를 제거하고, providerId→라벨·sourceIds→url 만 해석해 내보낸다.
// 토스는 거대 catalog 를 번들하지 않으므로 빌드 시 이 산출물(JSON)을 사용한다(drift-proof: predata).

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  getBrandIconUrl,
  getDomainFromUrl,
  getProviderIconUrl,
  getProviderLabel,
  getSources,
  SNAPSHOT_DATE,
  updates,
} from '../dist/index.js'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, '../../..')
const outputPath = resolve(repoRoot, 'apps/toss/src/sample-data.json')

function providerLabel(providerId) {
  // 웹과 동일하게 getProviderLabel 사용(market → "시장").
  return getProviderLabel(providerId) ?? providerId
}

function firstSourceUrl(sourceIds) {
  const refs = getSources(Array.isArray(sourceIds) ? sourceIds : [])
  const ref = refs.find((r) => r && r.url)
  return ref?.url ?? ''
}

// 제공사 아이콘 — providerId면 제공사 favicon, 아니면(market 등) 출처 URL 도메인 favicon.
// 웹 PortalNewsSections(BrandMark)와 동일 소스로 베이크해 소식 피드 시각을 싱크한다.
function updateIcon(providerId, url) {
  if (providerId && providerId !== 'market') return getProviderIconUrl(providerId) ?? null
  const domain = url ? getDomainFromUrl(url) : null
  return domain ? (getBrandIconUrl(domain) ?? null) : null
}

const items = updates
  .map((u) => {
    const url = firstSourceUrl(u.sourceIds)
    return {
      id: u.id,
      title: u.title,
      provider: providerLabel(u.providerId),
      iconUrl: updateIcon(u.providerId, url),
      date: u.date,
      summary: u.summary,
      impact: u.impact,
      tags: Array.isArray(u.tags) ? u.tags.slice(0, 4) : [],
      url,
    }
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

const payload = { generatedAt: SNAPSHOT_DATE, items }

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

const withUrl = items.filter((i) => i.url).length
console.log(`toss updates → ${outputPath}\n  items: ${items.length} (url 해석 ${withUrl}/${items.length})`)
