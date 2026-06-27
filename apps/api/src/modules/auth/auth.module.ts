import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { AuthGuard, OptionalAuthGuard } from './auth.guard'
import { AuthService } from './auth.service'

// JwtModule 은 AppModule 에서 global: true 로 등록하므로 여기서 다시 import 하지 않는다.
// DatabaseModule 도 @Global 이라 자동으로 주입 가능하다.
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, OptionalAuthGuard],
  exports: [AuthService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
