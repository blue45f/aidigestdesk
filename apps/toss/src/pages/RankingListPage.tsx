import { Top } from '@toss/tds-mobile';
import { useMemo, useState } from 'react';

import {
  compareNullsLast,
  extensionEntries,
  extensionKinds,
  extensionPlatforms,
  GRADE_PALETTE,
  modelDomains,
  parseNum,
  snapshotDate,
  type ExtensionRankEntry,
  type ModelRankEntry,
} from '../lib/rankings';
import { BannerAd } from '../components/BannerAd';
import { AD_GROUPS } from '../lib/ads';
import { navigate } from '../router';
import { theme, pageShell } from '../theme';
import { Badge, Chips, MetaChip, RankBadge, Segmented, SortChip } from '../ui';

type Scope = 'models' | 'extensions';
type Dir = 'asc' | 'desc';

const SCOPES: { id: Scope; label: string }[] = [
  { id: 'models', label: 'AI 모델' },
  { id: 'extensions', label: '확장 도구' },
];

/** 모델 정렬 키 — 표의 모든 항목에 오름/내림 정렬을 제공한다. */
const MODEL_SORTS: { id: string; label: string; pick: (e: ModelRankEntry) => number | null }[] = [
  { id: 'rank', label: '순위', pick: () => null }, // 원본(순위) 순서 사용
  { id: 'score', label: '점수', pick: (e) => e.score },
  { id: 'price', label: '가격', pick: (e) => parseNum(e.price) },
  { id: 'speed', label: '속도', pick: (e) => parseNum(e.speed) },
];

const EXT_SORTS: { id: string; label: string; pick: (e: ExtensionRankEntry) => number | string }[] = [
  { id: 'rank', label: '추천순위', pick: (e) => e.rank },
  { id: 'name', label: '이름', pick: (e) => e.name.toLowerCase() },
];

function sortBy<T>(items: T[], pick: (x: T) => number | string | null, dir: Dir): T[] {
  // 빈 값은 방향 무관 항상 뒤로 — 웹 RankingBoard 와 같은 shared comparator(중복 제거).
  // 동률은 원본 인덱스로 안정 정렬.
  return items
    .map((item, index) => ({ item, index, key: pick(item) }))
    .sort((a, b) => {
      const cmp = compareNullsLast(a.key, b.key, dir);
      return cmp !== 0 ? cmp : a.index - b.index;
    })
    .map((x) => x.item);
}

const rowStyle: React.CSSProperties = {
  display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%', textAlign: 'left', cursor: 'pointer',
  background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: '14px 14px',
  color: theme.text,
};

function Chevron() {
  return <span aria-hidden style={{ flexShrink: 0, alignSelf: 'center', fontSize: 20, color: theme.textMuted, lineHeight: 1 }}>›</span>;
}

function MoreButton({ expanded, total, visible, onToggle }: { expanded: boolean; total: number; visible: number; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="pressable"
      style={{ width: '100%', marginTop: 12, height: 46, borderRadius: theme.radius, cursor: 'pointer',
        background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 14, fontWeight: 700 }}>
      {expanded ? '접기' : `더 보기 (${total - visible}개)`}
    </button>
  );
}

function ModelRow({ entry, position, onOpen, medal }: { entry: ModelRankEntry; position: number; onOpen: () => void; medal: boolean }) {
  return (
    <button type="button" onClick={onOpen} className="pressable" style={rowStyle}
      aria-label={medal ? `${position}위 ${entry.name} 상세 보기` : `${entry.name} 상세 보기`}>
      <RankBadge position={position} medal={medal} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}>{entry.name}</span>
          {entry.score !== null && (
            <span style={{ fontSize: 16, fontWeight: 800, color: theme.accent, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
              {(entry.scoreLabel?.trim().startsWith('≈') ? '≈' : '') + entry.score.toLocaleString()}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 3 }}>{entry.provider}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>
          <MetaChip>{entry.metric}</MetaChip>
          {entry.price && <MetaChip>{entry.price}</MetaChip>}
          {entry.speed && <MetaChip>{entry.speed}</MetaChip>}
          {entry.context && <MetaChip>ctx {entry.context}</MetaChip>}
        </div>
      </div>
      <Chevron />
    </button>
  );
}

function ExtensionRow({ entry, position, onOpen, medal }: { entry: ExtensionRankEntry; position: number; onOpen: () => void; medal: boolean }) {
  const grade = GRADE_PALETTE[entry.grade] ?? GRADE_PALETTE.C;
  return (
    <button type="button" onClick={onOpen} className="pressable" style={rowStyle}
      aria-label={medal ? `${position}위 ${entry.name} 상세 보기` : `${entry.name} 상세 보기`}>
      <RankBadge position={position} medal={medal} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}>{entry.name}</span>
          <span aria-label={`등급 ${entry.grade}`} style={{ flexShrink: 0, display: 'grid', placeItems: 'center',
            width: 24, height: 24, borderRadius: 7, fontSize: 12.5, fontWeight: 800,
            background: grade.bg, color: grade.fg }}>{entry.grade}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
          <Badge accent>{entry.kind}</Badge>
          <Badge>{entry.platform}</Badge>
        </div>
        {entry.summary && (
          <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 9, lineHeight: 1.55,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{entry.summary}</p>
        )}
      </div>
      <Chevron />
    </button>
  );
}

export function RankingListPage() {
  const [scope, setScope] = useState<Scope>('models');

  // 모델
  const [domainId, setDomainId] = useState(() => modelDomains[0]?.id ?? 'overall');
  const [modelSort, setModelSort] = useState('rank');
  const [modelDir, setModelDir] = useState<Dir>('asc');

  // 확장
  const [kind, setKind] = useState('전체');
  const [platform, setPlatform] = useState('전체 LLM');
  const [extSort, setExtSort] = useState('rank');
  const [extDir, setExtDir] = useState<Dir>('asc');

  // 한눈에 보이도록 기본 15개만, '더 보기'로 확장
  const VISIBLE = 15;
  const [showAllModels, setShowAllModels] = useState(false);
  const [showAllExt, setShowAllExt] = useState(false);

  const domainLabels = useMemo(() => modelDomains.map((d) => d.label), []);
  const activeDomain = useMemo(
    () => modelDomains.find((d) => d.id === domainId) ?? modelDomains[0],
    [domainId]
  );

  const sortedModels = useMemo(() => {
    const entries = activeDomain?.entries ?? [];
    if (modelSort === 'rank') return modelDir === 'asc' ? entries : [...entries].reverse();
    const conf = MODEL_SORTS.find((s) => s.id === modelSort);
    return conf ? sortBy(entries, conf.pick, modelDir) : entries;
  }, [activeDomain, modelSort, modelDir]);

  const sortedExtensions = useMemo(() => {
    const base = extensionEntries.filter(
      (e) => (kind === '전체' || e.kind === kind) && (platform === '전체 LLM' || e.platform === platform)
    );
    const conf = EXT_SORTS.find((s) => s.id === extSort);
    return conf ? sortBy(base, conf.pick, extDir) : base;
  }, [kind, platform, extSort, extDir]);

  const toggle = (
    id: string,
    activeId: string,
    setId: (v: string) => void,
    dir: Dir,
    setDir: (v: Dir) => void,
    defaultDir: Dir
  ) => {
    if (id === activeId) setDir(dir === 'asc' ? 'desc' : 'asc');
    else { setId(id); setDir(defaultDir); }
  };

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <Top title={<Top.TitleParagraph size={22}>🏆 분야별 랭킹</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>AI 모델·확장 도구를 분야별로 한눈에</Top.SubtitleParagraph>} />
      <div style={pageShell}>
        <div className="rise" style={{ marginBottom: 16 }}>
          <Segmented options={SCOPES} value={scope} onChange={(v) => setScope(v as Scope)} />
        </div>

        {scope === 'models' ? (
          <>
            <div className="rise" style={{ animationDelay: '50ms', marginBottom: 12 }}>
              <Chips items={domainLabels} active={activeDomain?.label ?? ''}
                onPick={(label) => { const d = modelDomains.find((x) => x.label === label); if (d) { setDomainId(d.id); setShowAllModels(false); setModelSort('rank'); setModelDir('asc'); } }} />
            </div>
            <div className="rise" style={{ animationDelay: '90ms', marginBottom: 16, display: 'flex', gap: 8, overflowX: 'auto' }}>
              {MODEL_SORTS.filter(
                (s) => s.id === 'rank' || s.id === 'score' || (activeDomain?.entries ?? []).some((e) => s.pick(e) != null)
              ).map((s) => (
                <SortChip key={s.id} label={s.label} active={modelSort === s.id}
                  dir={modelSort === s.id ? modelDir : s.id === 'rank' || s.id === 'price' ? 'asc' : 'desc'}
                  onToggle={() => toggle(s.id, modelSort, setModelSort, modelDir, setModelDir, s.id === 'rank' || s.id === 'price' ? 'asc' : 'desc')} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(showAllModels ? sortedModels : sortedModels.slice(0, VISIBLE)).map((e, i) => (
                <div key={e.id} className="rise" style={{ animationDelay: `${110 + i * 18}ms` }}>
                  <ModelRow entry={e} position={i + 1} medal={modelSort === 'rank'} onOpen={() => navigate(`/rank/m/${encodeURIComponent(e.id)}`)} />
                </div>
              ))}
              {sortedModels.length === 0 && (
                <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>이 분야의 데이터가 아직 없어요.</p>
              )}
            </div>
            {sortedModels.length > VISIBLE && (
              <MoreButton expanded={showAllModels} total={sortedModels.length} visible={VISIBLE}
                onToggle={() => setShowAllModels((v) => !v)} />
            )}
          </>
        ) : (
          <>
            <div className="rise" style={{ marginBottom: 10 }}>
              <Chips items={extensionPlatforms} active={platform} onPick={(p) => { setPlatform(p); setShowAllExt(false); }} />
            </div>
            <div className="rise" style={{ animationDelay: '50ms', marginBottom: 12 }}>
              <Chips items={extensionKinds} active={kind} onPick={(k) => { setKind(k); setShowAllExt(false); }} />
            </div>
            <div className="rise" style={{ animationDelay: '90ms', marginBottom: 16, display: 'flex', gap: 8, overflowX: 'auto' }}>
              {EXT_SORTS.map((s) => (
                <SortChip key={s.id} label={s.label} active={extSort === s.id}
                  dir={extSort === s.id ? extDir : 'asc'}
                  onToggle={() => toggle(s.id, extSort, setExtSort, extDir, setExtDir, 'asc')} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(showAllExt ? sortedExtensions : sortedExtensions.slice(0, VISIBLE)).map((e, i) => (
                <div key={e.id} className="rise" style={{ animationDelay: `${110 + i * 14}ms` }}>
                  <ExtensionRow entry={e} position={i + 1} medal={extSort === 'rank'} onOpen={() => navigate(`/rank/x/${encodeURIComponent(e.id)}`)} />
                </div>
              ))}
              {sortedExtensions.length === 0 && (
                <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>해당 종류의 확장이 없어요.</p>
              )}
            </div>
            {sortedExtensions.length > VISIBLE && (
              <MoreButton expanded={showAllExt} total={sortedExtensions.length} visible={VISIBLE}
                onToggle={() => setShowAllExt((v) => !v)} />
            )}
          </>
        )}

        {/* 인앱 배너 광고 — 랭킹(자주 보는 목록) 하단. 토스 5.241.0+ 에서만 노출, 그 외 미노출. */}
        <BannerAd adGroupId={AD_GROUPS.feedList} marginTop={18} />

        <p style={{ fontSize: 11.5, color: theme.textMuted, textAlign: 'center', marginTop: 22, lineHeight: 1.6 }}>
          {snapshotDate} 기준 · 점수는 공개 벤치마크 출처 기반 추정치예요
        </p>
      </div>
    </div>
  );
}
