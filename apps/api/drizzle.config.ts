import { defineConfig } from 'drizzle-kit'

// Drizzle Kit 설정 — `db:generate`(마이그레이션 SQL 생성) / `db:push`(스키마 동기화)용.
// 런타임 테이블 보장은 DatabaseService.onModuleInit 의 멱등 raw SQL 이 담당하므로,
// 이 설정은 선택적 마이그레이션 도구 경로에서만 쓰인다(DATABASE_URL 미설정 시 로컬 폴백).
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/aidigestdesk',
  },
})
