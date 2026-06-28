/**
 * Vercel 서버리스 진입점 — @aidigestdesk/api(NestJS)를 람다에서 부팅한다.
 *
 * nest build 산출물(../dist)을 1회 부팅해 express 인스턴스를 캐시한다(콜드스타트 시 1회만).
 * dist 를 쓰는 이유: 데코레이터가 이미 컴파일돼 있어 @vercel/node 의 재컴파일 이슈를 피한다.
 * vercel.json 의 includeFiles 로 dist/** 를 번들에 포함시킨다.
 *
 * express 인스턴스는 ExpressAdapter 가 내부에서 생성한다(express 를 직접 import 하지 않음).
 * 이유: pnpm 모노레포에서 express 는 @nestjs/platform-express 의 전이 의존성이라
 * 최상위(api 패키지)에서 직접 resolve 되지 않는다 — 어댑터를 통해 받아 번들 누락/해상도 실패를 피한다.
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
  // 컴파일된 산출물에서 AppModule 을 가져온다(데코레이터 메타데이터 보존).
  const { AppModule } = await import('../dist/app.module.js');

  // ExpressAdapter 가 인스턴스 미지정 시 내부에서 express() 를 생성한다.
  const adapter = new ExpressAdapter();
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');
  await app.init();
  return adapter.getInstance() as NodeHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!cached) cached = await bootstrap();
  cached(req, res);
}
