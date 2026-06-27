import { sql } from 'drizzle-orm'
import { pgTable, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

// 회원/계정 테이블.
// 익명/게스트/토스 사용자는 email='' 로 생성되므로 email 에 전역 UNIQUE 를 걸지 않는다
// (두 번째 익명 사용자부터 충돌 방지). 실제 이메일의 유일성은 email <> '' 부분 유니크
// 인덱스로 보장한다 — 이 인덱스는 DatabaseService.onModuleInit 의 멱등 raw SQL 에서도
// 동일하게 생성해, 라이브 부팅마다 안전하게 보장된다.
export const users = pgTable(
  'users',
  {
    // UUID(회원) / guest-* / toss-* / toss-user-* 형태의 식별자.
    id: text('id').primaryKey(),
    // 익명·게스트·토스 1차 로그인은 빈 문자열. notNull + default('') 로 INSERT 단순화.
    email: text('email').notNull().default(''),
    // PBKDF2-SHA512 해시(hex). 비회원은 빈 문자열.
    passwordHash: text('password_hash').notNull().default(''),
    // 16바이트 랜덤 salt(hex). 비회원은 빈 문자열.
    salt: text('salt').notNull().default(''),
    nickname: text('nickname').notNull(),
    // 서버 동기화 프로필 — 아바타(URL 또는 data URI). 미설정이면 빈 문자열.
    avatar: text('avatar').notNull().default(''),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    isGuest: boolean('is_guest').default(false).notNull(),
  },
  (table) => [
    // 실제 이메일(빈 문자열 제외)만 유일성 보장. 다중 익명('') 사용자는 허용된다.
    uniqueIndex('users_email_unique_idx')
      .on(table.email)
      .where(sql`${table.email} <> ''`),
  ]
)

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert
