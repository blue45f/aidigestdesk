import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { DatabaseService } from '../database/database.service'

import { isAdminEmail } from './admin'
import { JWT_SECRET } from './jwt.constant'

import type { JwtPayload } from './auth.schema'

/** 검증된 토큰 + 요청 시점 어드민 재판정 결과를 합친, 라우트 핸들러가 보는 사용자. */
export interface AuthenticatedUser extends JwtPayload {
  isAdmin: boolean
}

/** AuthGuard 통과 후의 요청 — req.user 가 채워져 있음(컨트롤러에서 사용). */
export interface AuthenticatedRequest {
  user: AuthenticatedUser
}

/** 토큰을 읽기 위해 가드가 보는 최소 요청 형태. */
interface GuardRequest {
  headers: { authorization?: string }
  user?: AuthenticatedUser
}

const extractTokenFromHeader = (request: GuardRequest): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}

/**
 * 로그인 필수 가드.
 * 1) Bearer 토큰 서명/만료 검증.
 * 2) 토큰이 유효해도 탈퇴/삭제된 계정의 토큰은 막기 위해 DB 존재를 항상 재확인한다.
 * isAdmin 은 토큰 클레임을 믿지 않고 요청 시점 ADMIN_EMAILS 로 재판정한다(권한 변경 즉시 반영).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<GuardRequest>()
    const token = extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('로그인이 필요합니다.')
    }

    let payload: JwtPayload
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret: JWT_SECRET })
    } catch {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다.')
    }

    if (typeof payload?.sub !== 'string' || !(await this.db.getUserById(payload.sub))) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.')
    }

    request.user = { ...payload, isAdmin: isAdminEmail(payload.email) }
    return true
  }
}

/**
 * 선택적 인증 가드.
 * 토큰이 유효하고 계정이 살아 있으면 req.user 를 채우고, 아니면 에러 없이 익명으로 통과한다.
 * (공개 읽기/혼합 경로에서 회원이면 개인화하고 비회원도 그대로 진행하게 한다.)
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<GuardRequest>()
    const token = extractTokenFromHeader(request)
    if (!token) {
      return true
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret: JWT_SECRET })
      if (typeof payload?.sub === 'string' && (await this.db.getUserById(payload.sub))) {
        request.user = { ...payload, isAdmin: isAdminEmail(payload.email) }
      }
    } catch {
      // Optional 이므로 에러를 던지지 않고 익명으로 진행한다.
    }
    return true
  }
}
