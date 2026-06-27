import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import compression from 'compression'
import helmet from 'helmet'

import { AppModule } from './app.module'

import type { NestExpressApplication } from '@nestjs/platform-express'

export async function createApiServer(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 아바타(data URI) 동기화를 위해 본문 한도를 넉넉히 둔다.
  app.useBodyParser('json', { limit: '2mb' })
  app.useBodyParser('urlencoded', { extended: true, limit: '2mb' })

  // 프론트(웹/토스) 통합을 위한 CORS.
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  // 보안 헤더(API 라우트라 CSP 는 비활성).
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(compression())

  // 우아한 종료 훅.
  app.enableShutdownHooks()

  // 모든 라우트 프리픽스 /api.
  app.setGlobalPrefix('api')

  return app
}

async function bootstrap(): Promise<void> {
  const app = await createApiServer()
  const port = process.env.PORT || 4350
  await app.listen(port)
  console.log(`AIDigestDesk API 가 http://localhost:${port}/api 에서 실행 중입니다.`)
}

if (require.main === module) {
  void bootstrap()
}
