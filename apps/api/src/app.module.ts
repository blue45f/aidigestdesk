import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { HealthController } from './health.controller'
import { AuthModule } from './modules/auth/auth.module'
import { JWT_SECRET } from './modules/auth/jwt.constant'
import { DatabaseModule } from './modules/database/database.module'

@Module({
  imports: [
    // @Global — 전역에서 DatabaseService 주입.
    DatabaseModule,
    // JWT 를 전역 등록(global: true) — 가드/서비스가 JwtService 를 어디서나 주입받는다.
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
