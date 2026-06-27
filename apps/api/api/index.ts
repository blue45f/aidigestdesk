/**
 * Vercel 서버리스 진입점 — @aidigestdesk/api(NestJS)를 람다에서 부팅한다.
 *
 * nest build 산출물(../dist)을 1회 부팅해 express 인스턴스를 캐시한다(콜드스타트 시 1회만).
 * dist 를 쓰는 이유: 데코레이터가 이미 컴파일돼 있어 @vercel/node 의 재컴파일 이슈를 피한다.
 * vercel.json 의 includeFiles 로 dist/** 를 번들에 포함시킨다.
 *
 * 참고: 실제 배포는 사용자 승인 후 `vercel deploy --prod --scope blue45fs-projects` 로 진행하며,
 * 프로덕션 env(DATABASE_URL·JWT_SECRET)를 콘솔/CLI 로 먼저 설정해야 한다(README 참고).
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

type NodeHandler = (req: IncomingMessage, res: ServerResponse) => void;

let cached: NodeHandler | null = null;

async function bootstrap(): Promise<NodeHandler> {
  const { NestFactory } = await import('@nestjs/core');
  const { ExpressAdapter } = await import('@nestjs/platform-express');
  const express = (await import('express')).default;
  // 컴파일된 산출물에서 AppModule 을 가져온다(데코레이터 메타데이터 보존).
  const { AppModule } = await import('../dist/app.module.js');

  const instance = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(instance));
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');
  await app.init();
  return instance as unknown as NodeHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!cached) cached = await bootstrap();
  cached(req, res);
}
