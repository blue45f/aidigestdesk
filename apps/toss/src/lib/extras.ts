import data from '../extras.json';

export interface DealEntry {
  id: string;
  provider: string;
  /** 제공사/브랜드 아이콘 URL(생성기 베이크). 웹 BrandMark와 시각 싱크. */
  iconUrl: string | null;
  dealType: string;
  audience: string;
  region: string;
  title: string;
  summary: string;
  discountLabel: string;
  status: string;
  periodLabel: string;
  eligibility: string;
  howToClaim: string;
  koreanNote: string | null;
  url: string;
  tags: string[];
}
export interface EventEntry {
  id: string;
  title: string;
  organizer: string;
  type: string;
  startDate: string;
  endDate: string | null;
  timeLabel: string | null;
  status: string;
  format: string;
  region: string;
  language: string;
  location: string;
  summary: string;
  url: string;
  tags: string[];
}
export interface GlossaryEntry {
  id: string;
  term: string;
  koName: string;
  category: string;
  definition: string;
  note: string | null;
  tags: string[];
}
export interface LearningEntry {
  id: string;
  type: string;
  title: string;
  author: string;
  language: string;
  level: string;
  summary: string;
  url: string;
  tags: string[];
}
export interface ToolEntry {
  id: string;
  toolName: string;
  vendor: string;
  category: string;
  pricing: string;
  eventSignal: string;
  bestFor: string[];
  integrations: string[];
  tags: string[];
}
interface ExtrasData {
  snapshotDate: string;
  deals: DealEntry[];
  events: EventEntry[];
  glossary: GlossaryEntry[];
  learning: LearningEntry[];
  tools: ToolEntry[];
}

const parsed = data as ExtrasData;

export const extrasSnapshotDate = parsed.snapshotDate;
export const deals = parsed.deals;
export const events = parsed.events;
export const glossary = parsed.glossary;
export const learning = parsed.learning;
export const tools = parsed.tools;

/** 데이터에 실제 존재하는 값으로 칩 목록 구성(전체 + 순서 보존). */
function chipList(values: string[], all = '전체'): string[] {
  const seen: string[] = [];
  for (const v of values) if (v && !seen.includes(v)) seen.push(v);
  return [all, ...seen];
}

export const dealTypes = chipList(deals.map((d) => d.dealType));
export const eventStatuses = chipList(events.map((e) => e.status));
export const glossaryCategories = chipList(glossary.map((g) => g.category));
export const learningTypes = chipList(learning.map((l) => l.type));
