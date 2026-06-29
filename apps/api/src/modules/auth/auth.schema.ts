import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

// 회원/계정 요청 바디의 zod 스키마 + DTO.
// nestjs-zod 의 ZodValidationPipe(컨트롤러에 적용)가 이 스키마로 입력을 검증/정규화한다.

// 닉네임 공통 규칙(2~20자, trim).
const nicknameField = z
  .string()
  .trim()
  .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
  .max(20, '닉네임은 최대 20자 이하이어야 합니다.')

const emailField = z
  .string({ required_error: '이메일은 필수입니다.' })
  .trim()
  .email('올바른 이메일 형식이 아닙니다.')

const passwordField = z
  .string({ required_error: '비밀번호는 필수입니다.' })
  .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')

/**
 * 회원가입 — { email, password(min6), nickname(2~20) }.
 * 형제 앱과의 호환을 위해 nickname 대신 name 으로 와도 받아들이고, canonical 한
 * { email, password, nickname } 으로 정규화한다.
 */
export const RegisterSchema = z
  .object({
    email: emailField,
    password: passwordField,
    nickname: nicknameField.optional(),
    name: nicknameField.optional(),
  })
  .superRefine((value, ctx) => {
    const resolved = value.nickname ?? value.name
    if (!resolved?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: '닉네임은 최소 2자 이상이어야 합니다.',
        path: ['nickname'],
      })
    }
  })
  .transform(({ email, password, nickname, name }) => ({
    email,
    password,
    nickname: (nickname ?? name ?? '').trim(),
  }))

export type RegisterInput = z.infer<typeof RegisterSchema>

/** 로그인 — { email, password }. */
export const LoginSchema = z.object({
  email: emailField,
  password: passwordField,
})

export type LoginInput = z.infer<typeof LoginSchema>

/** 게스트(비회원) 등록 — { nickname }. */
export const GuestRegisterSchema = z.object({
  nickname: nicknameField,
})

export type GuestRegisterInput = z.infer<typeof GuestRegisterSchema>

/**
 * 앱인토스 getAnonymousKey(hash) 기반 식별 로그인. 서버 mTLS·사용자 동의 불필요.
 * anonymousKey 로 결정적 userId 를 만들어 멱등 get-or-create 한다.
 */
export const TossIdentitySchema = z.object({
  anonymousKey: z
    .string({ required_error: '토스 사용자 식별키가 필요합니다.' })
    .trim()
    .min(8, '유효하지 않은 식별키입니다.')
    .max(256, '유효하지 않은 식별키입니다.'),
  nickname: nicknameField.optional().nullable(),
})

export type TossIdentityInput = z.infer<typeof TossIdentitySchema>

/** 앱인토스 토스 로그인(appLogin) 인가 코드 기반(서버 mTLS 토큰 교환). */
export const TossLoginSchema = z.object({
  authorizationCode: z
    .string({ required_error: '인가 코드가 필요합니다.' })
    .trim()
    .min(1, '인가 코드가 필요합니다.')
    .max(4096, '유효하지 않은 인가 코드입니다.'),
  referrer: z.enum(['DEFAULT', 'SANDBOX']).default('DEFAULT'),
})

export type TossLoginInput = z.infer<typeof TossLoginSchema>

/** 토스 앱에서 서비스 연결을 해제했을 때 수신하는 서버 콜백. */
export const TossUnlinkSchema = z.object({
  userKey: z.coerce.number().int().positive(),
  referrer: z.enum(['UNLINK', 'WITHDRAWAL_TERMS', 'WITHDRAWAL_TOSS']),
})

export type TossUnlinkInput = z.infer<typeof TossUnlinkSchema>

/**
 * 프로필 수정 — { nickname?, avatar? }. 둘 다 선택. 아바타는 URL 또는 data URI 를 허용하되,
 * 남용 방지를 위해 길이 상한을 둔다(본문 파서 한도 2mb 와 함께 이중 가드). 빈 문자열은 아바타 해제.
 */
export const ProfileUpdateSchema = z.object({
  nickname: nicknameField.optional(),
  avatar: z.string().trim().max(1_000_000, '아바타 데이터가 너무 큽니다.').optional(),
})

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>

// nestjs-zod DTO — 컨트롤러 @Body() 타입으로 사용한다.
export class RegisterDto extends createZodDto(RegisterSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
export class GuestRegisterDto extends createZodDto(GuestRegisterSchema) {}
export class TossIdentityDto extends createZodDto(TossIdentitySchema) {}
export class TossLoginDto extends createZodDto(TossLoginSchema) {}
export class TossUnlinkDto extends createZodDto(TossUnlinkSchema) {}
export class ProfileUpdateDto extends createZodDto(ProfileUpdateSchema) {}

/** 클라이언트에 노출하는 사용자 프로필(비밀 필드 제외). */
export interface UserProfile {
  id: string
  email: string
  nickname: string
  avatar: string
  createdAt: string
  isGuest: boolean
  /** 운영자(어드민) 여부 — ADMIN_EMAILS 환경변수로 지정된 계정이면 true. */
  isAdmin: boolean
}

/** 인증 성공 응답 — JWT + 프로필. */
export interface AuthResult {
  accessToken: string
  user: UserProfile
}

/** JWT 페이로드 클레임. */
export interface JwtPayload {
  sub: string
  email: string
  nickname: string
  isGuest: boolean
}
