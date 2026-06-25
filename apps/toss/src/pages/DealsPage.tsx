import { Top } from '@toss/tds-mobile';
import { useMemo, useState } from 'react';

import {
  deals,
  dealTypes,
  events,
  eventStatuses,
  extrasSnapshotDate,
  type DealEntry,
  type EventEntry,
} from '../lib/extras';
import { theme, pageShell } from '../theme';
import { Badge, Chips, MetaChip, Segmented } from '../ui';

type Scope = 'deals' | 'events';
const SCOPES = [
  { id: 'deals', label: '혜택·할인' },
  { id: 'events', label: '이벤트' },
];

// 상태 시맨틱(웹·토스 공통): 진행중=green · 진행예정=blue · 상시=amber · 종료=neutral
function statusColors(status: string): { bg: string; fg: string } {
  if (status === '진행중' || status === '모집중') return { bg: 'rgba(116,214,163,0.16)', fg: '#74d6a3' };
  if (status === '진행예정') return { bg: 'rgba(110,168,254,0.16)', fg: '#6ea8fe' };
  if (status === '상시' || status === '상시 확인') return { bg: 'rgba(245,200,66,0.16)', fg: '#f5c842' };
  return { bg: 'rgba(255,255,255,0.06)', fg: theme.textMuted }; // 종료 등
}

function StatusBadge({ status }: { status: string }) {
  const c = statusColors(status);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 700, background: c.bg, color: c.fg }}>{status}</span>
  );
}

function DealCard({ deal }: { deal: DealEntry }) {
  return (
    <a href={deal.url} target="_blank" rel="noreferrer" className="pressable"
      style={{ display: 'block', background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: theme.radius, padding: 16, color: theme.text }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        <StatusBadge status={deal.status} />
        <span style={{ fontSize: 13, fontWeight: 800, color: theme.accent }}>{deal.discountLabel}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: theme.textMuted }}>{deal.provider}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{deal.title}</div>
      {deal.summary && (
        <p style={{ fontSize: 13.5, color: theme.textMuted, marginTop: 6, lineHeight: 1.55 }}>{deal.summary}</p>
      )}
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        <MetaChip>{deal.dealType}</MetaChip>
        <MetaChip>{deal.audience}</MetaChip>
        <MetaChip>{deal.periodLabel}</MetaChip>
      </div>
      {deal.howToClaim && (
        <p style={{ fontSize: 12.5, color: theme.text, marginTop: 10, lineHeight: 1.5 }}>
          <span style={{ color: theme.textMuted }}>받는 법 </span>{deal.howToClaim}
        </p>
      )}
      {deal.koreanNote && (
        <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 6, lineHeight: 1.5 }}>💡 {deal.koreanNote}</p>
      )}
      <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: theme.accent }}>공식 확인 ↗</div>
    </a>
  );
}

function EventCard({ event }: { event: EventEntry }) {
  const date = event.endDate && event.endDate !== event.startDate
    ? `${event.startDate} ~ ${event.endDate}` : event.startDate;
  return (
    <a href={event.url} target="_blank" rel="noreferrer" className="pressable"
      style={{ display: 'block', background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: theme.radius, padding: 16, color: theme.text }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        <StatusBadge status={event.status} />
        <Badge accent>{event.type}</Badge>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: theme.textMuted, fontVariantNumeric: 'tabular-nums' }}>{date}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{event.title}</div>
      <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 4 }}>{event.organizer}</div>
      {event.summary && (
        <p style={{ fontSize: 13.5, color: theme.textMuted, marginTop: 8, lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.summary}</p>
      )}
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        <MetaChip>{event.format}</MetaChip>
        <MetaChip>{event.region}</MetaChip>
        <MetaChip>{event.language}</MetaChip>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: theme.accent }}>자세히 보기 ↗</div>
    </a>
  );
}

export function DealsPage() {
  const [scope, setScope] = useState<Scope>('deals');
  const [dealType, setDealType] = useState('전체');
  const [eventStatus, setEventStatus] = useState('전체');

  const filteredDeals = useMemo(
    () => (dealType === '전체' ? deals : deals.filter((d) => d.dealType === dealType)),
    [dealType]
  );
  const filteredEvents = useMemo(
    () => (eventStatus === '전체' ? events : events.filter((e) => e.status === eventStatus)),
    [eventStatus]
  );

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <Top title={<Top.TitleParagraph size={22}>🎁 혜택 · 이벤트</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>AI 할인·크레딧·해커톤을 한곳에서</Top.SubtitleParagraph>} />
      <div style={pageShell}>
        <div className="rise" style={{ marginBottom: 16 }}>
          <Segmented options={SCOPES} value={scope} onChange={(v) => setScope(v as Scope)} />
        </div>

        {scope === 'deals' ? (
          <>
            <div className="rise" style={{ animationDelay: '50ms', marginBottom: 14 }}>
              <Chips items={dealTypes} active={dealType} onPick={setDealType} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredDeals.map((d, i) => (
                <div key={d.id} className="rise" style={{ animationDelay: `${70 + i * 16}ms` }}><DealCard deal={d} /></div>
              ))}
              {filteredDeals.length === 0 && (
                <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>해당 혜택이 없어요.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="rise" style={{ animationDelay: '50ms', marginBottom: 14 }}>
              <Chips items={eventStatuses} active={eventStatus} onPick={setEventStatus} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredEvents.map((e, i) => (
                <div key={e.id} className="rise" style={{ animationDelay: `${70 + i * 16}ms` }}><EventCard event={e} /></div>
              ))}
              {filteredEvents.length === 0 && (
                <p style={{ textAlign: 'center', color: theme.textMuted, padding: '40px 0' }}>해당 이벤트가 없어요.</p>
              )}
            </div>
          </>
        )}

        <p style={{ fontSize: 11.5, color: theme.textMuted, textAlign: 'center', marginTop: 22, lineHeight: 1.6 }}>
          {extrasSnapshotDate} 기준 · 신청 전 공식 페이지에서 조건을 꼭 확인하세요
        </p>
      </div>
    </div>
  );
}
