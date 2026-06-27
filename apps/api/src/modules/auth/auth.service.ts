import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as https from 'node:https'

import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { DatabaseService, type DatabaseUser } from '../database/database.service'

import { isAdminEmail } from './admin'

import type {
  AuthResult,
  GuestRegisterInput,
  JwtPayload,
  LoginInput,
  ProfileUpdateInput,
  RegisterInput,
  TossIdentityInput,
  TossLoginInput,
  UserProfile,
} from './auth.schema'

const APPS_IN_TOSS_API_BASE = 'https://apps-in-toss-api.toss.im'

/**
 * 환경변수로 넣은 PEM 본문 정규화. env 의 PEM 은 줄바꿈이 "\n" 리터럴로 저장되는 경우가
 * 많아 실제 개행으로 되돌린다. 빈 값이면 null.
 */
const normalizeMtlsPem = (value: string | undefined): string | null => {
  const trimmed = value?.trim()
  return trimmed ? trimmed.replace(/\\n/g, '\n') : null
}

/** 파일 경로에서 PEM 을 읽는다(폴백 경로). 없거나 읽기 실패 시 null. */
const readMtlsPemFile = (filePath: string | undefined): string | null => {
  const trimmed = filePath?.trim()
  if (!trimmed) {
    return null
  }
  try {
    return fs.readFileSync(trimmed, 'utf8')
  } catch {
    return null
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  // ── 비밀번호/토큰/프로필 헬퍼 ──────────────────────────────────

  /** PBKDF2-SHA512, 1000 iters, 64 bytes → hex. */
  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  }

  private generateSalt(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  private signPayload(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload)
  }

  /** DB 사용자 → 응답 프로필. 비밀(passwordHash/salt)은 절대 싣지 않는다. */
  private toProfile(user: DatabaseUser): UserProfile {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: user.createdAt,
      isGuest: user.isGuest,
      isAdmin: isAdminEmail(user.email),
    }
  }

  private async issue(user: DatabaseUser): Promise<AuthResult> {
    const accessToken = await this.signPayload({
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
      isGuest: user.isGuest,
    })
    return { accessToken, user: this.toProfile(user) }
  }

  // ── 가입/로그인 ────────────────────────────────────────────────

  async register(input: RegisterInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase()
    const nickname = input.nickname.trim()

    if (await this.db.getUserByEmail(email)) {
      throw new BadRequestException('이미 등록된 이메일 주소입니다.')
    }

    const salt = this.generateSalt()
    const newUser: DatabaseUser = {
      id: crypto.randomUUID(),
      email,
      passwordHash: this.hashPassword(input.password, salt),
      salt,
      nickname,
      avatar: '',
      createdAt: new Date().toISOString(),
      isGuest: false,
    }

    await this.db.createUser(newUser)
    return this.issue(newUser)
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase()
    const user = await this.db.getUserByEmail(email)
    if (!user || user.isGuest || !user.passwordHash) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.')
    }

    // 타이밍 사이드채널을 막기 위해 상수 시간 비교를 쓴다(단순 !== 비교 금지).
    const expected = Buffer.from(user.passwordHash, 'hex')
    const actual = Buffer.from(this.hashPassword(input.password, user.salt), 'hex')
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.')
    }

    return this.issue(user)
  }

  async registerGuest(input: GuestRegisterInput): Promise<AuthResult> {
    const guestUser: DatabaseUser = {
      id: `guest-${crypto.randomUUID()}`,
      email: '',
      passwordHash: '',
      salt: '',
      nickname: input.nickname.trim(),
      avatar: '',
      createdAt: new Date().toISOString(),
      isGuest: true,
    }

    await this.db.createUser(guestUser)
    return this.issue(guestUser)
  }

  /**
   * 앱인토스 getAnonymousKey(hash) 기반 식별 로그인.
   * anonymousKey 로 결정적 userId(toss-<sha256(key)[:32]>)를 만들어 멱등 get-or-create 한다.
   * 같은 사용자는 항상 같은 계정이 된다. 서버 mTLS·동의 없이 동작한다(승인 전에도 쓰는 경로).
   */
  async loginWithTossIdentity(input: TossIdentityInput): Promise<AuthResult> {
    const fingerprint = crypto
      .createHash('sha256')
      .update(input.anonymousKey)
      .digest('hex')
      .slice(0, 32)
    const userId = `toss-${fingerprint}`
    const nickname = (input.nickname?.trim() || '토스 사용자').slice(0, 20)

    const user =
      (await this.db.getUserById(userId)) ??
      (await this.db.createUser({
        id: userId,
        email: '',
        passwordHash: '',
        salt: '',
        nickname,
        avatar: '',
        createdAt: new Date().toISOString(),
        isGuest: false,
      }))

    return this.issue(user)
  }

  /**
   * 앱인토스 토스 로그인(appLogin) 인가 코드 → 서버 mTLS 토큰 교환 → 사용자 조회.
   * mTLS 인증서(콘솔 발급)가 환경변수로 설정돼야 동작한다. 미설정 시 503 으로 안내한다.
   */
  async loginWithTossAuthCode(input: TossLoginInput): Promise<AuthResult> {
    const agent = this.createMtlsAgent()

    const tokenResponse = await this.requestTossApi<{ success?: { accessToken?: string } }>(
      'POST',
      '/api-partner/v1/apps-in-toss/user/oauth2/generate-token',
      agent,
      {
        body: { authorizationCode: input.authorizationCode, referrer: input.referrer ?? 'DEFAULT' },
      }
    )

    const tossAccessToken = tokenResponse?.success?.accessToken
    if (!tossAccessToken) {
      throw new UnauthorizedException('토스 로그인 토큰 발급에 실패했어요.')
    }

    const meResponse = await this.requestTossApi<{ success?: { userKey?: number } }>(
      'GET',
      '/api-partner/v1/apps-in-toss/user/oauth2/login-me',
      agent,
      { bearer: tossAccessToken }
    )

    const userKey = meResponse?.success?.userKey
    if (userKey == null) {
      throw new UnauthorizedException('토스 사용자 정보를 가져오지 못했어요.')
    }

    const userId = `toss-user-${userKey}`
    const user =
      (await this.db.getUserById(userId)) ??
      (await this.db.createUser({
        id: userId,
        email: '',
        passwordHash: '',
        salt: '',
        nickname: '토스 사용자',
        avatar: '',
        createdAt: new Date().toISOString(),
        isGuest: false,
      }))

    return this.issue(user)
  }

  private createMtlsAgent(): https.Agent {
    // 서버리스 환경엔 고정 경로 인증서 파일이 없을 수 있어, PEM 본문(env)을 우선 지원하고
    // 파일 경로는 폴백으로 둔다.
    const cert =
      normalizeMtlsPem(process.env.APPS_IN_TOSS_MTLS_CERT) ??
      readMtlsPemFile(process.env.APPS_IN_TOSS_MTLS_CERT_PATH)
    const key =
      normalizeMtlsPem(process.env.APPS_IN_TOSS_MTLS_KEY) ??
      readMtlsPemFile(process.env.APPS_IN_TOSS_MTLS_KEY_PATH)
    if (!cert || !key) {
      throw new ServiceUnavailableException(
        '토스 로그인(서버 mTLS) 인증서가 설정되지 않았어요. ' +
          '콘솔에서 mTLS 인증서를 발급해 APPS_IN_TOSS_MTLS_CERT/KEY(PEM 본문) 또는 ' +
          'APPS_IN_TOSS_MTLS_CERT_PATH/KEY_PATH(파일 경로) 환경변수에 설정하거나, ' +
          'getAnonymousKey 기반 식별 로그인(/auth/toss)을 사용해 주세요.'
      )
    }
    return new https.Agent({ cert, key })
  }

  private requestTossApi<T>(
    method: 'GET' | 'POST',
    apiPath: string,
    agent: https.Agent,
    options: { body?: unknown; bearer?: string } = {}
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const url = new URL(`${APPS_IN_TOSS_API_BASE}${apiPath}`)
      const payload = options.body == null ? undefined : JSON.stringify(options.body)
      const request = https.request(
        url,
        {
          method,
          agent,
          headers: {
            'Content-Type': 'application/json',
            ...(options.bearer ? { Authorization: `Bearer ${options.bearer}` } : {}),
            ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          },
        },
        (response) => {
          let raw = ''
          response.on('data', (chunk) => {
            raw += chunk
          })
          response.on('end', () => {
            try {
              resolve(raw ? (JSON.parse(raw) as T) : ({} as T))
            } catch {
              reject(new UnauthorizedException('토스 API 응답을 해석하지 못했어요.'))
            }
          })
        }
      )
      request.on('error', (error) => reject(error))
      if (payload) {
        request.write(payload)
      }
      request.end()
    })
  }

  // ── 프로필 ─────────────────────────────────────────────────────

  /**
   * 토큰 페이로드(sub)로 DB 최신 프로필을 재구성한다(/auth/me).
   * 닉네임/아바타/권한 변경이 즉시 반영되고, 탈퇴/삭제된 계정은 401 로 막는다.
   */
  async validateUser(userId: string): Promise<UserProfile> {
    const user = await this.db.getUserById(userId)
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.')
    }
    return this.toProfile(user)
  }

  /** 서버 동기화 프로필 수정(닉네임/아바타). 변경 후 최신 프로필을 반환한다. */
  async updateProfile(userId: string, input: ProfileUpdateInput): Promise<UserProfile> {
    const user = await this.db.getUserById(userId)
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.')
    }

    const patch: ProfileUpdateInput = {}
    if (typeof input.nickname === 'string') {
      patch.nickname = input.nickname.trim()
    }
    if (typeof input.avatar === 'string') {
      patch.avatar = input.avatar.trim()
    }

    const updated = await this.db.updateUser(userId, patch)
    return this.toProfile(updated ?? user)
  }
}
