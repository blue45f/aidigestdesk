import { existsSync } from 'node:fs'
import * as path from 'node:path'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema'

// 로컬 개발 편의 — DATABASE_URL 이 셸 env 에 없으면 .env / .env.local 을 찾아 로드한다.
// (프로덕션은 플랫폼 env 로 주입되므로 이 블록을 타지 않는다.)
if (!process.env.DATABASE_URL) {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../.env.local'),
  ]
  for (const envPath of envPaths) {
    if (existsSync(envPath)) {
      try {
        process.loadEnvFile(envPath)
        if (process.env.DATABASE_URL) {
          break
        }
      } catch {
        // 무시 — env 파일이 없거나 읽기 실패해도 폴백 저장소로 동작한다.
      }
    }
  }
}

const databaseUrl = process.env.DATABASE_URL?.trim()
const isLocalhost = databaseUrl?.includes('localhost') || databaseUrl?.includes('127.0.0.1')

// DATABASE_URL 이 없으면 connectionString 은 undefined — 풀은 만들어지되 실제 쿼리는
// 하지 않는다(DatabaseService 가 JSON 파일 폴백 경로로만 동작). 비로컬은 SSL 사용.
export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
  max: 8,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
})

export const db = drizzle(pool, { schema })
