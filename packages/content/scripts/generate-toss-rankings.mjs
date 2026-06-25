#!/usr/bin/env node
// 토스 인앱(apps/toss)용 컴팩트 랭킹 데이터 생성기.
// 거대한 catalog 전체를 미니앱 번들에 넣지 않도록, 웹과 동일한 content 소스에서
// 분야별 모델 랭킹 + 확장(스킬/훅/플러그인) 랭킹만 추려 작은 JSON으로 내보낸다.
// 사용: node scripts/generate-toss-rankings.mjs  (content 빌드 후 실행)

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  agentExtensions,
  benchmarkEntries,
  getBenchmarkDomainLabel,
  getExtensionRankGrade,
  getProviderLabel,
  modelProfiles,
  SNAPSHOT_DATE,
} from '../dist/index.js'
import { looksContext, looksPrice, looksSpeed, parseNum, parseRank } from '../dist/shared.js'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, '../../..')
const outputPath = resolve(repoRoot, 'apps/toss/src/rankings.json')

const DOMAINS = ['overall', 'coding', 'ppt', 'research', 'multimodal', 'agent', 'cost']

const modelDomains = DOMAINS.map((id) => {
  const entries = benchmarkEntries
    // reference(벤치마크 카탈로그) 행은 랭킹에서 제외, leaderboard 행만 사용
    .filter((entry) => entry.domain === id && entry.tier !== 'reference')
    .toSorted((a, b) => {
      const ra = parseRank(a.rankLabel) ?? 999
      const rb = parseRank(b.rankLabel) ?? 999
      if (ra !== rb) return ra - rb
      return (parseNum(b.score) ?? -Infinity) - (parseNum(a.score) ?? -Infinity)
    })
    .map((entry) => ({
      id: entry.id,
      name: entry.modelName,
      provider: entry.providerId === 'other' ? '기타' : (getProviderLabel(entry.providerId) ?? entry.providerId),
      metric: entry.metric,
      score: parseNum(entry.score),
      scoreLabel: entry.score,
      price: looksPrice(entry.price) ? entry.price : null,
      speed: looksSpeed(entry.speed) ? entry.speed : null,
      context: looksContext(entry.context) ? entry.context : null,
    }))
  return { id, label: getBenchmarkDomainLabel(id), entries }
}).filter((domain) => domain.entries.length > 0)

const cap = (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : [])

const extensions = agentExtensions
  .filter((entry) => typeof entry.rank === 'number')
  .toSorted((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
  .map((entry) => ({
    id: entry.id,
    name: entry.name,
    kind: entry.kind,
    platform: entry.platform,
    category: entry.category ?? null,
    maturity: entry.maturity ?? null,
    summary: entry.summary,
    whatItDoes: cap(entry.whatItDoes, 5),
    install: entry.install ?? null,
    usage: entry.usage ?? null,
    koreanNote: entry.koreanNote ?? null,
    bestFor: cap(entry.bestFor, 4),
    url: entry.url ?? null,
    rank: entry.rank,
    grade: getExtensionRankGrade(entry),
  }))

// 상세 페이지용 컴팩트 모델 프로필. 벤치마크 엔트리의 modelName/별칭과 매칭해
// '분야별 성적 + 한 줄 설명/강점/주의점'을 보여주기 위한 최소 데이터.
const profiles = modelProfiles.map((p) => ({
  id: p.id,
  modelName: p.modelName,
  productName: p.productName,
  provider: getProviderLabel(p.providerId) ?? p.providerName,
  status: p.status,
  lastUpdate: p.lastUpdate,
  oneLine: p.oneLine,
  summary: p.summary,
  strengths: cap(p.strengths, 4),
  caveats: cap(p.caveats, 3),
  bestFor: cap(p.bestFor, 4),
  aliases: cap(p.aliases, 8),
}))

const payload = {
  snapshotDate: SNAPSHOT_DATE,
  modelDomains,
  extensions,
  profiles,
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

console.log(
  `toss rankings → ${outputPath}\n  domains: ${modelDomains.length}, models: ${modelDomains.reduce(
    (sum, d) => sum + d.entries.length,
    0
  )}, extensions: ${extensions.length}`
)
