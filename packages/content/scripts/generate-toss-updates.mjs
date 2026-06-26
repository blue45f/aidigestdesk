#!/usr/bin/env node
// 토스 인앱(apps/toss) "소식" 피드 생성기 — 웹과 동일한 단일 소스(content.updates)에서 파생.
// 기존 수기 sample-data.json 포크를 제거하고, providerId→라벨·sourceIds→url 만 해석해 내보낸다.
// 토스는 거대 catalog 를 번들하지 않으므로 빌드 시 이 산출물(JSON)을 사용한다(drift-proof: predata).

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getProviderLabel, getSources, SNAPSHOT_DATE, updates } from '../dist/index.js'

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

const items = updates
  .map((u) => ({
    id: u.id,
    title: u.title,
    provider: providerLabel(u.providerId),
    date: u.date,
    summary: u.summary,
    impact: u.impact,
    tags: Array.isArray(u.tags) ? u.tags.slice(0, 4) : [],
    url: firstSourceUrl(u.sourceIds),
  }))
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

const payload = { generatedAt: SNAPSHOT_DATE, items }

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

const withUrl = items.filter((i) => i.url).length
console.log(`toss updates → ${outputPath}\n  items: ${items.length} (url 해석 ${withUrl}/${items.length})`)
