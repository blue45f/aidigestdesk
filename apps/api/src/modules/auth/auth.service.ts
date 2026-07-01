import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as https from 'node:https'

import {
  BadGatewayException,
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
  TossUnlinkInput,
  UserProfile,
} from './auth.schema'

const APPS_IN_TOSS_API_BASE = 'https://apps-in-toss-api.toss.im'
const TOSS_API_TIMEOUT_MS = 12_000

type TossApiError = string | { errorCode?: string; reason?: string }

const isInvalidGrant = (error: TossApiError | undefined): boolean => {
  if (typeof error === 'string') {
    return error.toLowerCase() === 'invalid_grant'
  }
  return Boolean(
    error &&
    (error.errorCode?.toLowerCase() === 'invalid_grant' ||
      /\binvalid_grant\b/i.test(error.reason ?? ''))
  )
}

/**
 * login-me 응답의 userKey 를 안전하게 정규화한다. 문서상 number 지만 파트너 API 응답을
 * 신뢰하지 않고 방어적으로 받는다:
 * - 유한 정수 number → 십진 문자열 (안전 정수 범위를 벗어나 지수 표기가 되면 거부)
 * - 숫자로만 이뤄진 문자열(trim 후) → 그대로 사용 — number 변환 시 정밀도 손실이 생길 수
 *   있어 ID(`toss-user-${key}`)는 문자열 기준으로 구성한다.
 * - 그 외(빈 문자열/NaN/음수/소수/객체 등) → null (호출부에서 401 처리)
 */
const normalizeTossUserKey = (value: unknown): string | null => {
  const raw =
    typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : ''
  return /^\d+$/.test(raw) ? raw : null
}

/**
 * 토스 OAuth 응답의 scope 를 안전하게 파싱한다. 현재 로직에서 쓰진 않지만, 미래 사용을
 * 대비한 파서다. 문서상 콤마 구분이지만 실제 예시 응답엔 공백이 섞여 오고
 * ("...,user_gender, user_key"), 2026-01-02부터 user_key 처럼 기존에 정의되지 않은 항목이
 * 예고 없이 추가될 수 있다(문서: "scope 처리 시 예외가 발생하지 않도록 주의").
 * 그래서 콤마/공백을 모두 구분자로 취급해 trim·빈 항목 제거만 하고, 미지의 항목은 에러
 * 없이 그대로 통과시킨다(호출부가 아는 항목만 골라 쓰고 나머지는 무시). string 이 아니면
 * 빈 배열을 반환해 어떤 형태가 와도 예외가 나지 않는다.
 */
export const parseTossScope = (scope: unknown): string[] => {
  if (typeof scope !== 'string') {
    return []
  }
  return scope.split(/[\s,]+/).filter((item) => item.length > 0)
}

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
    // 샌드박스도 공식 문서상 mTLS 서버 교환이 필수다. 인가 코드에서 가짜 userKey를 만드는
    // 폴백은 실제 토스 계정이 아닌 사용자를 로그인시켜 계정 정합성을 깨므로 허용하지 않는다.
    const agent = this.createMtlsAgent()

    // success 에는 accessToken 외에 scope(공백 구분)/tokenType/expiresIn/refreshToken 등이
    // 함께 오지만, 여기선 accessToken 만 쓰므로 필요한 필드만 unknown 으로 좁혀 받는다.
    const tokenResponse = await this.requestTossApi<{
      resultType?: 'SUCCESS' | 'FAIL'
      success?: { accessToken?: unknown }
      error?: TossApiError
    }>('POST', '/api-partner/v1/apps-in-toss/user/oauth2/generate-token', agent, {
      body: { authorizationCode: input.authorizationCode, referrer: input.referrer },
    })

    const tossAccessToken = tokenResponse?.success?.accessToken
    if (
      tokenResponse.resultType !== 'SUCCESS' ||
      typeof tossAccessToken !== 'string' ||
      !tossAccessToken
    ) {
      throw new UnauthorizedException('토스 로그인 토큰 발급에 실패했어요.')
    }

    // success 에는 userKey 외에 scope(콤마+공백 혼합 구분, 2026-01-02부터 user_key 항목
    // 추가)·agreedTerms·동의 항목별 암호화 필드(name/phone/email 등, null 가능)가 함께
    // 오고 앞으로도 늘어날 수 있다. 여기선 userKey 만 쓰므로 나머지는 형태와 무관하게
    // 무시하고, userKey 도 unknown 으로 받아 normalizeTossUserKey 로 방어적으로 좁힌다.
    const meResponse = await this.requestTossApi<{
      resultType?: 'SUCCESS' | 'FAIL'
      success?: { userKey?: unknown }
      error?: TossApiError
    }>('GET', '/api-partner/v1/apps-in-toss/user/oauth2/login-me', agent, {
      bearer: tossAccessToken,
    })

    // 기존 `userKey == null` 체크만으론 ''/‘abc’/객체 같은 비정상 값이
    // `toss-user-`(빈/오염 ID) 계정을 만들 수 있어 정규화 실패 시 전부 401 로 막는다.
    const userKey = normalizeTossUserKey(meResponse?.success?.userKey)
    if (meResponse.resultType !== 'SUCCESS' || userKey == null) {
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

  /**
   * 토스 앱의 연결 해제 콜백을 검증하고 해당 앱 전용 userKey 계정을 제거한다.
   * DB 존재 여부와 무관하게 성공시키는 멱등 처리라 토스의 중복 콜백에도 안전하다.
   */
  async unlinkTossLogin(
    input: TossUnlinkInput,
    authorization: string | undefined
  ): Promise<{ ok: true }> {
    this.assertTossUnlinkAuthorization(authorization)
    await this.db.deleteUser(`toss-user-${input.userKey}`)
    return { ok: true }
  }

  private assertTossUnlinkAuthorization(authorization: string | undefined): void {
    const expectedUsername = process.env.APPS_IN_TOSS_UNLINK_USERNAME?.trim()
    const expectedPassword = process.env.APPS_IN_TOSS_UNLINK_PASSWORD?.trim()
    if (!expectedUsername || !expectedPassword) {
      throw new ServiceUnavailableException('토스 로그인 연결 해제 콜백 인증이 설정되지 않았어요.')
    }

    const encoded = authorization?.startsWith('Basic ') ? authorization.slice(6).trim() : ''
    let actual: string
    try {
      actual = Buffer.from(encoded, 'base64').toString('utf8')
    } catch {
      throw new UnauthorizedException('콜백 인증에 실패했어요.')
    }

    const expected = `${expectedUsername}:${expectedPassword}`
    const expectedBytes = Buffer.from(expected)
    const actualBytes = Buffer.from(actual)
    if (
      expectedBytes.length !== actualBytes.length ||
      !crypto.timingSafeEqual(expectedBytes, actualBytes)
    ) {
      throw new UnauthorizedException('콜백 인증에 실패했어요.')
    }
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
    try {
      return new https.Agent({ cert, key, keepAlive: true })
    } catch {
      throw new ServiceUnavailableException(
        '토스 로그인 mTLS 인증서 또는 개인키 형식이 올바르지 않아요.'
      )
    }
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
            Accept: 'application/json',
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
              const parsed = raw ? (JSON.parse(raw) as T) : ({} as T)
              const status = response.statusCode ?? 500
              if (status >= 400 && status < 500) {
                reject(
                  new UnauthorizedException('토스 로그인 인가 코드 또는 토큰이 유효하지 않아요.')
                )
                return
              }
              if (status < 200 || status >= 300) {
                reject(new BadGatewayException('토스 로그인 서버가 요청을 처리하지 못했어요.'))
                return
              }
              if (
                parsed &&
                typeof parsed === 'object' &&
                'resultType' in parsed &&
                (parsed as { resultType?: string }).resultType === 'FAIL'
              ) {
                const error = (parsed as { error?: TossApiError }).error
                reject(
                  isInvalidGrant(error)
                    ? new UnauthorizedException(
                        '토스 로그인 인가 코드가 만료되었거나 이미 사용됐어요.'
                      )
                    : new BadGatewayException('토스 로그인 서버가 실패 응답을 반환했어요.')
                )
                return
              }
              resolve(parsed)
            } catch {
              reject(new BadGatewayException('토스 로그인 서버 응답을 해석하지 못했어요.'))
            }
          })
        }
      )
      request.setTimeout(TOSS_API_TIMEOUT_MS, () => {
        request.destroy(new Error('Toss login API timeout'))
      })
      request.on('error', () => {
        reject(new ServiceUnavailableException('토스 로그인 서버에 연결하지 못했어요.'))
      })
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
