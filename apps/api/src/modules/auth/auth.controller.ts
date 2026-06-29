import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'

import { AuthGuard, type AuthenticatedRequest } from './auth.guard'
import {
  GuestRegisterDto,
  LoginDto,
  ProfileUpdateDto,
  RegisterDto,
  TossIdentityDto,
  TossLoginDto,
  TossUnlinkDto,
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

  /** 토스 앱에서 로그인 연결 해제/약관 철회/토스 탈퇴 시 받는 Basic Auth 콜백. */
  @Post('toss/unlink')
  @HttpCode(HttpStatus.OK)
  async unlinkTossLogin(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: TossUnlinkDto
  ) {
    return this.authService.unlinkTossLogin(dto, authorization)
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
