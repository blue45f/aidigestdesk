import { Body, Controller, Get, Post, Put, Request, UseGuards, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'

import { AuthGuard, type AuthenticatedRequest } from './auth.guard'
import {
  GuestRegisterDto,
  LoginDto,
  ProfileUpdateDto,
  RegisterDto,
  TossIdentityDto,
  TossLoginDto,
} from './auth.schema'
import { AuthService } from './auth.service'

@Controller('auth')
@UsePipes(ZodValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 이메일/비밀번호 회원가입 → { accessToken, user }. */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  /** 이메일/비밀번호 로그인 → { accessToken, user }. */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  /** 게스트(비회원) 등록 → { accessToken, user }. */
  @Post('guest')
  async registerGuest(@Body() dto: GuestRegisterDto) {
    return this.authService.registerGuest(dto)
  }

  /** 앱인토스 getAnonymousKey 기반 식별 로그인(서버 mTLS 불필요). */
  @Post('toss')
  async loginWithTossIdentity(@Body() dto: TossIdentityDto) {
    return this.authService.loginWithTossIdentity(dto)
  }

  /** 앱인토스 토스 로그인(appLogin) 인가 코드 → 서버 mTLS 토큰 교환. */
  @Post('toss/login')
  async loginWithTossAuthCode(@Body() dto: TossLoginDto) {
    return this.authService.loginWithTossAuthCode(dto)
  }

  /** 현재 로그인 사용자의 최신 프로필. */
  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Request() req: AuthenticatedRequest) {
    return this.authService.validateUser(req.user.sub)
  }

  /** 서버 동기화 프로필 수정(닉네임/아바타) → 최신 프로필. */
  @Put('profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Request() req: AuthenticatedRequest, @Body() dto: ProfileUpdateDto) {
    return this.authService.updateProfile(req.user.sub, dto)
  }
}
