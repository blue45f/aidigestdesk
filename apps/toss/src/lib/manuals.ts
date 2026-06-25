// CLI 매뉴얼 — 웹과 동일한 단일 소스(@aidigestdesk/content/cliManuals)를 직접 사용한다.
// cliManuals 서브패스는 catalog 를 type 으로만 참조해 런타임 의존이 0이라 토스가 직접 import 가능.
// 더 이상 생성 JSON(이원화·필드 손실)을 쓰지 않는다 — tagline·providerId 등 전체 필드 보존.
import { cliToolManuals, getCliManualBySlug, type CliToolManual } from '@aidigestdesk/content/cliManuals';

import { snapshotDate } from './rankings';

export type ManualCommand = CliToolManual['commands'][number];
export type ManualFeature = CliToolManual['features'][number];
/** 웹과 100% 동일한 매뉴얼 타입(전체 필드). */
export type CliManual = CliToolManual;

export const manualSnapshotDate = snapshotDate;
export const cliManuals = cliToolManuals;

export function getManualBySlug(slug: string): CliManual | undefined {
  return getCliManualBySlug(slug);
}

/** 한 매뉴얼의 명령 카테고리 목록(전체 + 등장 순서). */
export function manualCategories(manual: CliManual): string[] {
  const seen: string[] = [];
  for (const c of manual.commands) if (c.category && !seen.includes(c.category)) seen.push(c.category);
  return ['전체', ...seen];
}
