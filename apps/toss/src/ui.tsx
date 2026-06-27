import { burstAt } from '@aidigestdesk/content/shared';

import { toggleBookmark, useIsBookmarked, type Bookmark } from './lib/bookmarks';
import { theme } from './theme';

import type { ReactNode } from 'react';

/** 즐겨찾기 토글 버튼(★). 상세 페이지 헤더 등에서 사용. */
export function BookmarkButton({ item }: { item: Bookmark }) {
  const saved = useIsBookmarked(item.type, item.id);
  return (
    <button type="button"
      onClick={(e) => {
        const wasSaved = saved;
        toggleBookmark(item);
        if (!wasSaved) burstAt(e.clientX, e.clientY, ['#f5c842', '#ff6b6b', '#6ea8fe', '#74d6a3'], 14);
      }}
      aria-pressed={saved}
      aria-label={saved ? '즐겨찾기 해제' : '즐겨찾기 추가'} className="pressable"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 38, padding: '0 14px', flexShrink: 0,
        borderRadius: 999, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, transition: 'border-color .18s, background-color .18s, color .18s',
        border: saved ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
        background: saved ? theme.accentSoft : 'transparent', color: saved ? theme.accent : theme.textMuted }}>
      <span aria-hidden style={{ fontSize: 15 }}>{saved ? '★' : '☆'}</span>
      {saved ? '저장됨' : '저장'}
    </button>
  );
}

export function Badge({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return <span style={{ display:'inline-flex', alignItems:'center', height:22, padding:'0 8px', borderRadius:6,
    fontSize:12, fontWeight:600, lineHeight:1, color: accent?theme.accent:theme.textMuted,
    background: accent?theme.accentSoft:'rgba(255,255,255,0.07)' }}>{children}</span>;
}

export function SearchBar({ value, onChange, placeholder }: { value:string; onChange:(v:string)=>void; placeholder?:string }) {
  return <div style={{ position:'relative' }}>
    <span aria-hidden style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:theme.textMuted }}>🔍</span>
    <input className="field" value={value} placeholder={placeholder||'검색'} onChange={(e)=>onChange(e.target.value)} aria-label="검색" />
  </div>;
}

export function Chips({ items, active, onPick }: { items:string[]; active:string; onPick:(v:string)=>void }) {
  return <div className="chips">
    {items.map((c)=>{ const on=c===active; return (
      <button key={c} type="button" onClick={()=>onPick(c)} className="pressable" style={{ flexShrink:0, height:34, padding:'0 14px',
        borderRadius:999, fontSize:14, fontWeight:600, cursor:'pointer', border: on?'none':'1px solid rgba(255,255,255,0.1)',
        transition:'background-color .18s, color .18s, border-color .18s',
        background: on?theme.accent:'transparent', color: on?theme.accentInk:theme.textMuted }}>{c}</button>); })}
  </div>;
}

export function Cover({ gradient, src, alt, height=150, radius=12 }: { gradient?: string[]; src?: string|null; alt:string; height?:number; radius?:number }) {
  const grad = gradient && gradient.length>=2 ? `linear-gradient(140deg, ${gradient[0]}, ${gradient[1]})` : theme.surfaceAlt;
  return <div style={{ height, borderRadius:radius, overflow:'hidden', background:grad, flexShrink:0 }}>
    {src ? <img src={src} alt={alt} loading="lazy" decoding="async" style={{ width:'100%', height:'100%', objectFit:'cover' }}
      onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }} /> : null}
  </div>;
}

/** 1·2·3위 메달 뱃지. 색만으로 전달하지 않도록 숫자를 항상 병기.
 *  medal=false(가격·속도·이름 등 비순위 정렬)면 중립색 — 표시 순서를 순위로 오인 방지. */
export function RankBadge({ position, medal = true }: { position: number; medal?: boolean }) {
  const neutral = { bg: 'rgba(255,255,255,0.05)', bd: theme.border, fg: theme.textMuted };
  const palette = !medal
    ? neutral
    : position === 1
      ? { bg: 'rgba(245,200,66,0.16)', bd: 'rgba(245,200,66,0.5)', fg: '#f5c842' }
      : position === 2
        ? { bg: 'rgba(180,196,224,0.16)', bd: 'rgba(180,196,224,0.5)', fg: '#b4c4e0' }
        : position === 3
          ? { bg: 'rgba(232,150,90,0.16)', bd: 'rgba(232,150,90,0.5)', fg: '#e8965a' }
          : neutral;
  return (
    <span aria-hidden style={{ display:'grid', placeItems:'center', width:30, height:30, flexShrink:0,
      borderRadius:999, border:`1px solid ${palette.bd}`, background:palette.bg, color:palette.fg,
      fontSize:14, fontWeight:800, fontVariantNumeric:'tabular-nums' }}>{position}</span>
  );
}

/** 정렬 토글 칩 — 누를 때마다 오름/내림 전환. 활성 시 방향 화살표. */
export function SortChip({ label, active, dir, onToggle }: { label:string; active:boolean; dir:'asc'|'desc'; onToggle:()=>void }) {
  const arrow = !active ? '↕' : dir === 'asc' ? '↑' : '↓';
  return (
    <button type="button" onClick={onToggle} aria-pressed={active} className="pressable"
      style={{ flexShrink:0, height:34, padding:'0 12px', borderRadius:999, fontSize:13.5, fontWeight:700, cursor:'pointer',
        display:'inline-flex', alignItems:'center', gap:5,
        border: active ? `1px solid ${theme.accent}` : '1px solid rgba(255,255,255,0.1)',
        background: active ? theme.accentSoft : 'transparent', color: active ? theme.accent : theme.textMuted }}>
      {label}<span aria-hidden style={{ fontSize:12 }}>{arrow}</span>
    </button>
  );
}

/** 큰 두 갈래 토글(예: AI 모델 / 확장 도구). */
export function Segmented({ options, value, onChange }: { options:{id:string;label:string}[]; value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{ display:'flex', gap:8 }}>
      {options.map((o)=>{ const on=o.id===value; return (
        <button key={o.id} type="button" onClick={()=>onChange(o.id)} aria-pressed={on} className="pressable"
          style={{ flex:1, height:46, borderRadius:'var(--r-md)', fontSize:15, fontWeight:700, cursor:'pointer',
            transition:'background-color .22s ease, color .22s ease, border-color .22s ease',
            border: on ? 'none' : `1px solid ${theme.border}`,
            background: on ? theme.accent : theme.surface, color: on ? theme.accentInk : theme.textMuted }}>
          {o.label}
        </button>); })}
    </div>
  );
}

/** 하단 탭바 — 소식 / 랭킹 / 혜택 / 자료 / 매뉴얼 전환. */
export type TabId = 'feed' | 'rank' | 'deals' | 'resources' | 'manual';
export function TabBar({ active, onPick }: { active:TabId; onPick:(t:TabId)=>void }) {
  const items:{id:TabId;label:string;icon:string}[] = [
    { id:'feed', label:'소식', icon:'📰' },
    { id:'rank', label:'랭킹', icon:'🏆' },
    { id:'deals', label:'혜택', icon:'🎁' },
    { id:'resources', label:'자료', icon:'📚' },
    { id:'manual', label:'매뉴얼', icon:'📘' },
  ];
  return (
    <nav aria-label="주요 메뉴" style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:30,
      display:'flex', borderTop:`1px solid ${theme.border}`,
      background:`color-mix(in oklab, ${theme.bg} 88%, transparent)`, backdropFilter:'blur(12px)',
      paddingBottom:'env(safe-area-inset-bottom)' }}>
      {items.map((it)=>{ const on=it.id===active; return (
        <button key={it.id} type="button" onClick={()=>onPick(it.id)} aria-current={on?'page':undefined} className="pressable"
          style={{ flex:1, height:56, position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
            background:'none', border:'none', cursor:'pointer', color: on ? theme.accent : theme.textMuted, fontWeight:700,
            transition:'color .18s ease' }}>
          {on && <span aria-hidden style={{ position:'absolute', top:0, width:22, height:3, borderRadius:3, background:theme.accent }} />}
          <span aria-hidden style={{ fontSize:18, transition:'transform .18s cubic-bezier(.22,1,.36,1), filter .18s ease',
            transform: on ? 'scale(1.14)' : 'scale(1)', filter: on ? 'none' : 'grayscale(0.4) opacity(0.8)' }}>{it.icon}</span>
          <span style={{ fontSize:11.5 }}>{it.label}</span>
        </button>); })}
    </nav>
  );
}

/** 메타 정보용 작은 회색 칩(지표/가격/속도/컨텍스트 등). */
export function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', height:22, padding:'0 8px', borderRadius:7,
      fontSize:11.5, fontWeight:600, color:theme.textMuted, background:'rgba(255,255,255,0.05)',
      fontVariantNumeric:'tabular-nums' }}>{children}</span>
  );
}

/**
 * 제공사/브랜드 favicon — 랭킹·혜택 등 카드에서 공용으로 쓰는 작은 로고.
 * iconUrl 은 content 생성기에서 베이크(웹 BrandMark 와 동일 소스)라 웹↔토스 시각이 싱크된다.
 */
export function BrandIcon({ src, size = 16 }: { src: string | null; size?: number }) {
  if (!src) return null;
  return (
    <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async"
      style={{ borderRadius: 4, flexShrink: 0 }} />
  );
}

/** 상세 페이지 상단 뒤로가기 바. */
export function BackBar({ onBack, label='뒤로' }: { onBack:()=>void; label?:string }) {
  return (
    <div style={{ position:'sticky', top:0, zIndex:20, display:'flex', alignItems:'center', height:52,
      padding:'0 8px', background:`color-mix(in oklab, ${theme.bg} 86%, transparent)`, backdropFilter:'blur(12px)',
      paddingTop:'env(safe-area-inset-top)' }}>
      <button type="button" onClick={onBack} aria-label={label} className="pressable"
        style={{ display:'inline-flex', alignItems:'center', gap:4, height:40, padding:'0 12px 0 8px',
          background:'none', border:'none', color:theme.text, fontSize:15, fontWeight:600, cursor:'pointer' }}>
        <span aria-hidden style={{ fontSize:20, lineHeight:1 }}>‹</span>{label}
      </button>
    </div>
  );
}

export function StatStrip({ stats }: { stats: { label:string; value:string }[] }) {
  if (!stats.length) return null;
  return <div style={{ display:'flex', gap:10, padding:'14px 0', borderTop:`1px solid ${theme.border}`, borderBottom:`1px solid ${theme.border}` }}>
    {stats.map((s)=>(<div key={s.label} style={{ flex:1, textAlign:'center' }}>
      <div style={{ fontSize:18, fontWeight:800 }}>{s.value}</div>
      <div style={{ fontSize:12, color:theme.textMuted, marginTop:3 }}>{s.label}</div>
    </div>))}
  </div>;
}
