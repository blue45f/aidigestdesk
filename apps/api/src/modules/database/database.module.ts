import { Module, Global } from '@nestjs/common'

import { DatabaseService } from './database.service'

// 전역 모듈 — 어디서나 DatabaseService 를 주입받을 수 있게 한다(AuthModule 등).
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
