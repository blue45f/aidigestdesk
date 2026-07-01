import { UnauthorizedException } from '@nestjs/common'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DatabaseService, type DatabaseUser } from '../database/database.service'

import { TossLoginSchema, TossUnlinkSchema } from './auth.schema'
import { AuthService, parseTossScope } from './auth.service'

import type { JwtService } from '@nestjs/jwt'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('Toss auth contracts', () => {
  it('accepts only the appLogin referrer values and defaults to DEFAULT', () => {
    expect(TossLoginSchema.parse({ authorizationCode: 'one-time-code' }).referrer).toBe('DEFAULT')
    expect(
      TossLoginSchema.parse({ authorizationCode: 'one-time-code', referrer: 'SANDBOX' }).referrer
    ).toBe('SANDBOX')
    expect(
      TossLoginSchema.safeParse({ authorizationCode: 'one-time-code', referrer: 'UNLINK' }).success
    ).toBe(false)
  })

  it('coerces callback userKey and rejects unknown unlink reasons', () => {
    expect(TossUnlinkSchema.parse({ userKey: '443731104', referrer: 'UNLINK' })).toEqual({
      userKey: 443731104,
      referrer: 'UNLINK',
    })
    expect(TossUnlinkSchema.safeParse({ userKey: 1, referrer: 'UNKNOWN' }).success).toBe(false)
  })
})

describe('parseTossScope', () => {
  it('splits comma/space separated scopes and keeps unknown items like user_key', () => {
    expect(parseTossScope('user_ci,user_birthday,user_name,user_gender, user_key')).toEqual([
      'user_ci',
      'user_birthday',
      'user_name',
      'user_gender',
      'user_key',
    ])
  })

  it('returns an empty array for non-string or empty scopes', () => {
    expect(parseTossScope(undefined)).toEqual([])
    expect(parseTossScope(123)).toEqual([])
    expect(parseTossScope(['user_name'])).toEqual([])
    expect(parseTossScope('  ,  ')).toEqual([])
  })
})

describe('AuthService.loginWithTossAuthCode', () => {
  // 문서 예시 형태의 generate-token 성공 응답 — accessToken 외 신규 필드가 섞여 온다.
  const tokenSuccessResponse = {
    resultType: 'SUCCESS',
    success: {
      accessToken: 'toss-access-token',
      refreshToken: 'toss-refresh-token',
      tokenType: 'Bearer',
      expiresIn: 3599,
      scope: 'user_name user_key',
    },
  }

  const createService = (meResponse: unknown) => {
    const getUserById = vi.fn().mockResolvedValue(null)
    const createUser = vi.fn(async (user: DatabaseUser) => user)
    const db = { getUserById, createUser } as unknown as DatabaseService
    const jwt = { signAsync: vi.fn().mockResolvedValue('signed-jwt') } as unknown as JwtService
    const service = new AuthService(db, jwt)

    // 실제 https 호출·mTLS 인증서 없이 응답 파싱 로직만 검증한다.
    const internals = service as unknown as {
      createMtlsAgent: () => unknown
      requestTossApi: (method: 'GET' | 'POST', apiPath: string) => Promise<unknown>
    }
    vi.spyOn(internals, 'createMtlsAgent').mockReturnValue({})
    vi.spyOn(internals, 'requestTossApi').mockImplementation(async (method) =>
      method === 'POST' ? tokenSuccessResponse : meResponse
    )

    return { createUser, service }
  }

  it('accepts a numeric-string userKey and derives the same user id', async () => {
    const { createUser, service } = createService({
      resultType: 'SUCCESS',
      success: { userKey: '443731104' },
    })

    const result = await service.loginWithTossAuthCode({
      authorizationCode: 'one-time-code',
      referrer: 'DEFAULT',
    })

    expect(result.user.id).toBe('toss-user-443731104')
    expect(createUser).toHaveBeenCalledWith(expect.objectContaining({ id: 'toss-user-443731104' }))
  })

  it('tolerates doc-example login-me responses with user_key scope, unknown items, and new fields', async () => {
    const { service } = createService({
      resultType: 'SUCCESS',
      success: {
        userKey: 443731104,
        scope: 'user_ci,user_birthday,user_name,user_phone,user_gender, user_key, future_scope',
        agreedTerms: [{ termsType: 'PERSONAL_INFO', agreed: true }],
        name: 'encrypted-name',
        phone: 'encrypted-phone',
        birthday: null,
        ci: null,
        di: null,
        gender: 'encrypted-gender',
        nationality: null,
        email: null,
      },
    })

    const result = await service.loginWithTossAuthCode({
      authorizationCode: 'one-time-code',
      referrer: 'SANDBOX',
    })

    expect(result.user.id).toBe('toss-user-443731104')
  })

  it.each([
    ['missing', {}],
    ['empty-string', { userKey: '' }],
    ['non-numeric string', { userKey: 'abc' }],
    ['object', { userKey: { nested: true } }],
  ])('rejects a %s userKey with UnauthorizedException', async (_label, success) => {
    const { createUser, service } = createService({ resultType: 'SUCCESS', success })

    await expect(
      service.loginWithTossAuthCode({ authorizationCode: 'one-time-code', referrer: 'DEFAULT' })
    ).rejects.toBeInstanceOf(UnauthorizedException)
    expect(createUser).not.toHaveBeenCalled()
  })
})

describe('AuthService.unlinkTossLogin', () => {
  const createService = () => {
    const deleteUser = vi.fn().mockResolvedValue(true)
    const db = { deleteUser } as unknown as DatabaseService
    const service = new AuthService(db, {} as JwtService)
    return { deleteUser, service }
  }

  it('verifies Basic Auth and deletes the app-scoped Toss user idempotently', async () => {
    vi.stubEnv('APPS_IN_TOSS_UNLINK_USERNAME', 'callback-user')
    vi.stubEnv('APPS_IN_TOSS_UNLINK_PASSWORD', 'long-random-password')
    const { deleteUser, service } = createService()
    const authorization = `Basic ${Buffer.from('callback-user:long-random-password').toString('base64')}`

    await expect(
      service.unlinkTossLogin({ userKey: 443731104, referrer: 'WITHDRAWAL_TERMS' }, authorization)
    ).resolves.toEqual({ ok: true })
    expect(deleteUser).toHaveBeenCalledOnce()
    expect(deleteUser).toHaveBeenCalledWith('toss-user-443731104')
  })

  it('rejects callbacks with mismatched credentials', async () => {
    vi.stubEnv('APPS_IN_TOSS_UNLINK_USERNAME', 'callback-user')
    vi.stubEnv('APPS_IN_TOSS_UNLINK_PASSWORD', 'long-random-password')
    const { deleteUser, service } = createService()
    const authorization = `Basic ${Buffer.from('callback-user:wrong-password').toString('base64')}`

    await expect(
      service.unlinkTossLogin({ userKey: 443731104, referrer: 'UNLINK' }, authorization)
    ).rejects.toBeInstanceOf(UnauthorizedException)
    expect(deleteUser).not.toHaveBeenCalled()
  })
})
