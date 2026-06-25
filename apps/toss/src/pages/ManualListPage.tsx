import { Top } from '@toss/tds-mobile';

import { cliManuals, manualSnapshotDate } from '../lib/manuals';
import { navigate } from '../router';
import { theme, pageShell } from '../theme';
import { MetaChip } from '../ui';

export function ManualListPage() {
  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <Top title={<Top.TitleParagraph size={22}>📘 코딩 CLI 매뉴얼</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>설치·인증·명령어·기능·팁을 한국어로</Top.SubtitleParagraph>} />
      <div style={pageShell}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cliManuals.map((m, i) => (
            <button key={m.slug} type="button" onClick={() => navigate(`/manual/${encodeURIComponent(m.slug)}`)}
              className="pressable rise"
              style={{ animationDelay: `${i * 24}ms`, display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%',
                textAlign: 'left', cursor: 'pointer', background: theme.surface, border: `1px solid ${theme.border}`,
                borderRadius: theme.radius, padding: 16, color: theme.text }}
              aria-label={`${m.platform} 매뉴얼 보기`}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}>{m.platform}</div>
                <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 6, lineHeight: 1.55,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.overview}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  <MetaChip>명령 {m.commands.length}개</MetaChip>
                  <MetaChip>기능 {m.features.length}개</MetaChip>
                </div>
              </div>
              <span aria-hidden style={{ flexShrink: 0, alignSelf: 'center', fontSize: 20, color: theme.textMuted }}>›</span>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: theme.textMuted, textAlign: 'center', marginTop: 22, lineHeight: 1.6 }}>
          {manualSnapshotDate} 기준 · 공식 문서 정리
        </p>
      </div>
    </div>
  );
}
