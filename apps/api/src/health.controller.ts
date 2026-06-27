import { Controller, Get } from '@nestjs/common'

// 배포/헬스 체크용 경량 엔드포인트. 전역 프리픽스 'api' 와 합쳐 GET /api/health 로 노출된다.
@Controller()
export class HealthController {
  @Get('health')
  health(): { ok: true; service: string; ts: string } {
    return { ok: true, service: 'aidigestdesk-api', ts: new Date().toISOString() }
  }
}
