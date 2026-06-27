import * as fs from 'node:fs'
import * as path from 'node:path'

import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { eq } from 'drizzle-orm'

import { db, pool } from '../../db'
import * as schema from '../../db/schema'

/**
 * 회원/계정 영속 모델.
 * 비밀(passwordHash·salt)은 내부 권한 판정 전용 — 응답(UserProfile)에는 절대 싣지 않는다.
 */
export interface DatabaseUser {
  id: string
  email: string
  passwordHash: string
  salt: string
  nickname: string
  avatar: string
  createdAt: string
  isGuest: boolean
}

/** 프로필 수정 가능한 필드만 추린 패치 타입(닉네임·아바타). */
export type UserProfilePatch = Partial<Pick<DatabaseUser, 'nickname' | 'avatar'>>

interface DatabaseState {
  users: DatabaseUser[]
}

/**
 * 사용자 저장소.
 * - DATABASE_URL 이 있으면 PostgreSQL(Drizzle) 경로를 쓴다.
 * - 없으면 JSON 파일 폴백(AIDIGEST_DB_PATH 또는 ./.data/db.json)으로 동작해, DB 없이도
 *   로컬에서 API 가 그대로 뜬다(개발 편의). 단일 프로세스 가정의 best-effort 영속.
 */
@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name)
  private readonly useSqlDb = Boolean(process.env.DATABASE_URL?.trim())
  private readonly filePath = path.resolve(
    process.env.AIDIGEST_DB_PATH?.trim() || path.resolve(process.cwd(), '.data', 'db.json')
  )
  private data: DatabaseState = { users: [] }

  async onModuleInit(): Promise<void> {
    if (this.useSqlDb) {
      await this.ensureSqlSchema()
      return
    }
    this.loadFromFile()
  }

  /**
   * 라이브 부팅마다 멱등하게 users 테이블과 부분 유니크 인덱스를 보장한다.
   * - email 에 전역 UNIQUE 를 두지 않는다(익명 다중 '' 허용).
   * - 기존 라이브 테이블에 남아 있을 수 있는 email UNIQUE 제약을 제거하고,
   *   email <> '' 부분 유니크 인덱스로 교체한다(실제 이메일만 유일).
   * - avatar 컬럼을 비파괴 ALTER 로 추가한다(구 테이블 호환).
   */
  private async ensureSqlSchema(): Promise<void> {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL DEFAULT '',
          password_hash TEXT NOT NULL DEFAULT '',
          salt TEXT NOT NULL DEFAULT '',
          nickname TEXT NOT NULL,
          avatar TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          is_guest BOOLEAN DEFAULT FALSE NOT NULL
        );
      `)
      // 구 테이블 호환 — 신규 컬럼/기본값을 비파괴·멱등으로 보강한다.
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT NOT NULL DEFAULT '';
        ALTER TABLE users ALTER COLUMN email SET DEFAULT '';
        ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '';
        ALTER TABLE users ALTER COLUMN salt SET DEFAULT '';
      `)
      // 기존 email UNIQUE 제약(있으면) 제거 — 익명 다중 '' 가 충돌하던 문제를 닫는다.
      await pool.query(`
        DO $$
        DECLARE c text;
        BEGIN
          FOR c IN
            SELECT conname FROM pg_constraint
            WHERE conrelid = 'users'::regclass AND contype = 'u'
          LOOP
            EXECUTE 'ALTER TABLE users DROP CONSTRAINT ' || quote_ident(c);
          END LOOP;
        END $$;
      `)
      // 실제 이메일만 유일성 보장하는 부분 유니크 인덱스.
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
        ON users (email) WHERE email <> '';
      `)
      this.logger.log('PostgreSQL users 테이블/인덱스 확인·생성 완료.')
    } catch (err) {
      // 부팅을 막지 않는다 — 일시적 DB 장애 시에도 프로세스는 떠 있고, 이후 쿼리에서 에러가 표면화된다.
      this.logger.error('PostgreSQL 스키마 초기화 실패', err as Error)
    }
  }

  // ── JSON 파일 폴백 ──────────────────────────────────────────────

  private loadFromFile(): void {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.data = { users: [] }
        return
      }
      const parsed: unknown = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'))
      this.data = this.sanitize(parsed)
    } catch (err) {
      this.logger.error('JSON 폴백 DB 로드 실패 — 빈 상태로 시작합니다.', err as Error)
      this.data = { users: [] }
    }
  }

  private saveToFile(): void {
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true })
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (err) {
      this.logger.error('JSON 폴백 DB 저장 실패', err as Error)
    }
  }

  private sanitize(candidate: unknown): DatabaseState {
    const raw = candidate as { users?: unknown } | null
    const rows: unknown[] = Array.isArray(raw?.users) ? raw.users : []
    const users: DatabaseUser[] = rows
      .filter((u): u is Record<string, unknown> => typeof u === 'object' && u !== null)
      .filter((u) => typeof u.id === 'string')
      .map((u) => ({
        id: String(u.id),
        email: String(u.email ?? ''),
        passwordHash: String(u.passwordHash ?? ''),
        salt: String(u.salt ?? ''),
        nickname: String(u.nickname ?? ''),
        avatar: String(u.avatar ?? ''),
        createdAt: String(u.createdAt ?? new Date().toISOString()),
        isGuest: Boolean(u.isGuest),
      }))
    return { users }
  }

  // ── 공통 헬퍼 ──────────────────────────────────────────────────

  private normalizeEmail(value: string): string {
    return (value || '').trim().toLowerCase()
  }

  private mapRow(row: schema.UserRow): DatabaseUser {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      salt: row.salt,
      nickname: row.nickname,
      avatar: row.avatar,
      createdAt: row.createdAt.toISOString(),
      isGuest: row.isGuest,
    }
  }

  // ── 공개 API ───────────────────────────────────────────────────

  async getUserById(id: string): Promise<DatabaseUser | undefined> {
    if (this.useSqlDb) {
      const rows = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1)
      const row = rows[0]
      return row ? this.mapRow(row) : undefined
    }
    return this.data.users.find((u) => u.id === id)
  }

  async getUserByEmail(email: string): Promise<DatabaseUser | undefined> {
    const target = this.normalizeEmail(email)
    if (!target) {
      return undefined
    }
    if (this.useSqlDb) {
      const rows = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, target))
        .limit(1)
      const row = rows[0]
      return row ? this.mapRow(row) : undefined
    }
    return this.data.users.find((u) => this.normalizeEmail(u.email) === target)
  }

  async createUser(user: DatabaseUser): Promise<DatabaseUser> {
    const normalized: DatabaseUser = { ...user, email: this.normalizeEmail(user.email) }
    if (this.useSqlDb) {
      await db.insert(schema.users).values({
        id: normalized.id,
        email: normalized.email,
        passwordHash: normalized.passwordHash,
        salt: normalized.salt,
        nickname: normalized.nickname,
        avatar: normalized.avatar,
        createdAt: new Date(normalized.createdAt),
        isGuest: normalized.isGuest,
      })
      return normalized
    }
    this.data.users.push(normalized)
    this.saveToFile()
    return normalized
  }

  /** 프로필(닉네임/아바타)만 갱신한다. 비밀(passwordHash/salt/email/id)은 건드리지 않는다. */
  async updateUser(id: string, patch: UserProfilePatch): Promise<DatabaseUser | undefined> {
    const changes: UserProfilePatch = {}
    if (typeof patch.nickname === 'string') {
      changes.nickname = patch.nickname
    }
    if (typeof patch.avatar === 'string') {
      changes.avatar = patch.avatar
    }

    if (this.useSqlDb) {
      if (Object.keys(changes).length > 0) {
        await db.update(schema.users).set(changes).where(eq(schema.users.id, id))
      }
      return this.getUserById(id)
    }

    const target = this.data.users.find((u) => u.id === id)
    if (!target) {
      return undefined
    }
    Object.assign(target, changes)
    this.saveToFile()
    return target
  }
}
