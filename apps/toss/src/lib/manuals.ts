import data from '../manuals.json';

export interface ManualCommand {
  command: string;
  description: string;
  example: string;
  category: string;
}
export interface ManualFeature {
  title: string;
  body: string;
}
export interface CliManual {
  id: string;
  slug: string;
  platform: string;
  overview: string;
  install: string;
  auth: string;
  commands: ManualCommand[];
  features: ManualFeature[];
  tips: string[];
  sourceUrls: string[];
}
interface ManualData {
  snapshotDate: string;
  manuals: CliManual[];
}

const parsed = data as ManualData;

export const manualSnapshotDate = parsed.snapshotDate;
export const cliManuals = parsed.manuals;

export function getManualBySlug(slug: string): CliManual | undefined {
  return cliManuals.find((m) => m.slug === slug);
}

/** 한 매뉴얼의 명령 카테고리 목록(전체 + 등장 순서). */
export function manualCategories(manual: CliManual): string[] {
  const seen: string[] = [];
  for (const c of manual.commands) if (c.category && !seen.includes(c.category)) seen.push(c.category);
  return ['전체', ...seen];
}
