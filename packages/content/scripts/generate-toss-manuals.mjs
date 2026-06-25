#!/usr/bin/env node
// 토스 인앱(apps/toss)용 컴팩트 CLI 매뉴얼 데이터 생성기.
// 토스는 content 패키지를 의존하지 않으므로(번들 경량화), cliManuals 엔트리에서
// 필요한 필드만 추려 apps/toss/src/manuals.json 으로 내보낸다.
// 사용: node scripts/generate-toss-manuals.mjs  (content 빌드 후 실행)

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { cliToolManuals } from '../dist/cliManuals.js'
import { SNAPSHOT_DATE } from '../dist/index.js'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, '../../..')
const outputPath = resolve(repoRoot, 'apps/toss/src/manuals.json')

const manuals = cliToolManuals.map((m) => ({
  id: m.id,
  slug: m.slug,
  platform: m.platform,
  overview: m.overview,
  install: m.install,
  auth: m.auth,
  commands: m.commands.map((c) => ({
    command: c.command,
    description: c.description,
    example: c.example || '',
    category: c.category || '기타',
  })),
  features: m.features.map((f) => ({ title: f.title, body: f.body })),
  tips: m.tips,
  sourceUrls: m.sourceUrls,
}))

const payload = { snapshotDate: SNAPSHOT_DATE, manuals }

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

const totalCmds = manuals.reduce((s, m) => s + m.commands.length, 0)
console.log(`toss manuals → ${outputPath}\n  manuals: ${manuals.length}, commands: ${totalCmds}`)
