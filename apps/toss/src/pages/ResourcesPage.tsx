import { Top } from '@toss/tds-mobile';
import { useMemo, useState } from 'react';

import { AnimatedTitle } from '../components/AnimatedTitle';
import { BannerAd } from '../components/BannerAd';
import { ProfileButton } from '../components/ProfileButton';
import { AD_GROUPS } from '../lib/ads';
import { onExternalClick } from '../lib/links';

import {
  extrasSnapshotDate,
  glossary,
  glossaryCategories,
  learning,
  learningTypes,
  tools,
} from '../lib/extras';
import { theme, pageShell } from '../theme';
import { Badge, BrandIcon, Chips, MetaChip, SearchBar, Segmented } from '../ui';

type Scope = 'glossary' | 'learning' | 'tools';
const SCOPES = [
  { id: 'glossary', label: '용어집' },
  { id: 'learning', label: '강좌·자료' },
  { id: 'tools', label: 'AI 도구' },
];

const VISIBLE = 20;

function MoreButton({ expanded, total, onToggle }: { expanded: boolean; total: number; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="pressable"
      style={{ width: '100%', marginTop: 12, height: 46, borderRadius: theme.radius, cursor: 'pointer',
        background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 14, fontWeight: 700 }}>
      {expanded ? '접기' : `더 보기 (${total - VISIBLE}개)`}
    </button>
  );
}

export function ResourcesPage() {
  const [scope, setScope] = useState<Scope>('glossary');
  const [q, setQ] = useState('');
  const [gCat, setGCat] = useState('전체');
  const [lType, setLType] = useState('전체');
  const [showAllLearning, setShowAllLearning] = useState(false);

  const query = q.trim().toLowerCase();

  const filteredGlossary = useMemo(() => {
    return glossary.filter((g) => {
      const okCat = gCat === '전체' || g.category === gCat;
      const okQ = !query || [g.term, g.koName, g.definition, g.note, ...g.tags].filter(Boolean).join(' ').toLowerCase().includes(query);
      return okCat && okQ;
    });
  }, [gCat, query]);

  const filteredLearning = useMemo(() => {
    return learning.filter((l) => {
      const okType = lType === '전체' || l.type === lType;
      const okQ = !query || [l.title, l.author, l.summary, ...l.tags].filter(Boolean).join(' ').toLowerCase().includes(query);
      return okType && okQ;
    });
  }, [lType, query]);

  const filteredTools = useMemo(() => {
    return tools.filter((t) => !query || [t.toolName, t.vendor, t.category, ...t.bestFor, ...t.tags].join(' ').toLowerCase().includes(query));
  }, [query]);

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, position: 'relative' }}>
      <ProfileButton />
      <Top title={<Top.TitleParagraph size={22}>📚 <AnimatedTitle size={22}>자료</AnimatedTitle></Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>용어집·강좌·AI 도구를 한국어로</Top.SubtitleParagraph>} />
      <div style={pageShell}>
        <div className="rise" style={{ marginBottom: 14 }}>
          <Segmented options={SCOPES} value={scope} onChange={(v) => { setScope(v as Scope); setShowAllLearning(false); }} />
        </div>
        <div className="rise" style={{ animationDelay: '40ms', marginBottom: 12 }}>
          <SearchBar value={q} onChange={setQ} placeholder={scope === 'glossary' ? '용어 검색' : scope === 'learning' ? '강좌·자료 검색' : '도구 검색'} />
        </div>

        {scope === 'glossary' && (
          <>
            <div className="rise" style={{ animationDelay: '70ms', marginBottom: 12 }}>
              <Chips items={glossaryCategories} active={gCat} onPick={setGCat} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredGlossary.map((g, i) => (
                <div key={g.id} className="rise" style={{ animationDelay: `${90 + i * 12}ms`, background: theme.surface,
                  border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 16 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 16, fontWeight: 800 }}>{g.term}</span>
                    {g.koName && g.koName !== g.term && <span style={{ fontSize: 13, color: theme.textMuted }}>{g.koName}</span>}
                    <span style={{ marginLeft: 'auto' }}><MetaChip>{g.category}</MetaChip></span>
                  </div>
                  <p style={{ fontSize: 14, color: theme.text, marginTop: 8, lineHeight: 1.6 }}>{g.definition}</p>
                  {g.note && <p style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 6, lineHeight: 1.55 }}>💡 {g.note}</p>}
                </div>
              ))}
              {filteredGlossary.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>‘{q || gCat}’ 결과가 없어요.</p>}
            </div>
          </>
        )}

        {scope === 'learning' && (
          <>
            <div className="rise" style={{ animationDelay: '70ms', marginBottom: 12 }}>
              <Chips items={learningTypes} active={lType} onPick={(t) => { setLType(t); setShowAllLearning(false); }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(showAllLearning ? filteredLearning : filteredLearning.slice(0, VISIBLE)).map((l, i) => (
                <a key={l.id} href={l.url} target="_blank" rel="noreferrer" onClick={onExternalClick(l.url)} className="pressable rise"
                  style={{ animationDelay: `${90 + Math.min(i, 10) * 10}ms`, display: 'block', background: theme.surface,
                    border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 16, color: theme.text }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    <Badge accent>{l.type}</Badge>
                    <Badge>{l.level}</Badge>
                    <Badge>{l.language}</Badge>
                  </div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.4 }}>{l.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                    <BrandIcon src={l.iconUrl} size={14} />
                    <span style={{ fontSize: 12.5, color: theme.textMuted }}>{l.author}</span>
                  </div>
                  {l.summary && <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 8, lineHeight: 1.55,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.summary}</p>}
                  <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: theme.accent }}>열기 ↗</div>
                </a>
              ))}
              {filteredLearning.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>‘{q || lType}’ 결과가 없어요.</p>}
            </div>
            {filteredLearning.length > VISIBLE && (
              <MoreButton expanded={showAllLearning} total={filteredLearning.length} onToggle={() => setShowAllLearning((v) => !v)} />
            )}
          </>
        )}

        {scope === 'tools' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredTools.map((t, i) => (
              <div key={t.id} className="rise" style={{ animationDelay: `${70 + i * 14}ms`, background: theme.surface,
                border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: 16 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{t.toolName}</span>
                  <span style={{ fontSize: 12.5, color: theme.textMuted }}>{t.vendor}</span>
                  <span style={{ marginLeft: 'auto' }}><MetaChip>{t.category}</MetaChip></span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <MetaChip>{t.pricing}</MetaChip>
                </div>
                {t.bestFor.length > 0 && (
                  <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 8, lineHeight: 1.55 }}>
                    <span style={{ color: theme.text, fontWeight: 600 }}>좋은 점</span> {t.bestFor.join(' · ')}
                  </p>
                )}
                {t.integrations.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {t.integrations.map((x) => <Badge key={x}>{x}</Badge>)}
                  </div>
                )}
              </div>
            ))}
            {filteredTools.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>‘{q}’ 결과가 없어요.</p>}
          </div>
        )}

        <BannerAd adGroupId={AD_GROUPS.feedList} marginTop={18} />

        <p style={{ fontSize: 11.5, color: theme.textMuted, textAlign: 'center', marginTop: 22, lineHeight: 1.6 }}>
          {extrasSnapshotDate} 기준
        </p>
      </div>
    </div>
  );
}
