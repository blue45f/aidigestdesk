import data from '../rankings.json';

export interface ModelRankEntry {
  id: string;
  name: string;
  provider: string;
  metric: string;
  score: number | null;
  scoreLabel: string;
  price: string | null;
  speed: string | null;
  context: string | null;
}
export interface ModelDomain {
  id: string;
  label: string;
  entries: ModelRankEntry[];
}
export interface ExtensionRankEntry {
  id: string;
  name: string;
  kind: string;
  platform: string;
  category: string | null;
  maturity: string | null;
  summary: string;
  whatItDoes: string[];
  install: string | null;
  usage: string | null;
  koreanNote: string | null;
  bestFor: string[];
  url: string | null;
  rank: number;
  grade: string;
}
export interface ModelProfile {
  id: string;
  modelName: string;
  productName: string;
  provider: string;
  status: string;
  lastUpdate: string;
  oneLine: string;
  summary: string;
  strengths: string[];
  caveats: string[];
  bestFor: string[];
  aliases: string[];
}
interface RankingData {
  snapshotDate: string;
  modelDomains: ModelDomain[];
  extensions: ExtensionRankEntry[];
  profiles: ModelProfile[];
}

const rankings = data as RankingData;

export const snapshotDate = rankings.snapshotDate;
export const modelDomains = rankings.modelDomains;
export const extensionEntries = rankings.extensions;
export const modelProfileEntries = rankings.profiles;

/** 확장 종류 칩 목록(전체 + 데이터에 실제 존재하는 종류, 보기 좋은 순서). */
const KIND_ORDER = ['스킬', '훅', '플러그인', 'MCP 서버', '슬래시 명령', '서브에이전트', '워크플로우'];
export const extensionKinds: string[] = [
  '전체',
  ...KIND_ORDER.filter((kind) => extensionEntries.some((entry) => entry.kind === kind)),
];

export function parseNum(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const match = raw.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

/** 확장 단건 조회. */
export function getExtensionById(id: string): ExtensionRankEntry | undefined {
  return extensionEntries.find((entry) => entry.id === id);
}

/** 벤치마크 엔트리(분야별) 단건 조회 + 소속 도메인. */
export function getModelEntryById(
  id: string
): { entry: ModelRankEntry; domain: ModelDomain } | undefined {
  for (const domain of modelDomains) {
    const entry = domain.entries.find((e) => e.id === id);
    if (entry) return { entry, domain };
  }
  return undefined;
}

export interface ModelDomainStanding {
  domainId: string;
  domainLabel: string;
  position: number; // 해당 분야 내 순위(1-base)
  entry: ModelRankEntry;
}

/** 같은 모델명이 등장하는 모든 분야의 성적을 모은다. */
export function getModelStandingsByName(name: string): ModelDomainStanding[] {
  const target = norm(name);
  const standings: ModelDomainStanding[] = [];
  for (const domain of modelDomains) {
    const idx = domain.entries.findIndex((e) => norm(e.name) === target);
    if (idx >= 0) {
      standings.push({
        domainId: domain.id,
        domainLabel: domain.label,
        position: idx + 1,
        entry: domain.entries[idx],
      });
    }
  }
  return standings;
}

/** 모델명/별칭으로 상세 프로필을 찾는다(없으면 undefined). */
export function getProfileForName(name: string): ModelProfile | undefined {
  const target = norm(name);
  return modelProfileEntries.find(
    (p) => norm(p.modelName) === target || p.aliases.some((a) => norm(a) === target)
  );
}
