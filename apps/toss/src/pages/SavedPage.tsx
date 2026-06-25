import { removeBookmark, useBookmarks, type BookmarkType } from '../lib/bookmarks';
import { goBack, navigate } from '../router';
import { theme, pageShell } from '../theme';
import { BackBar, MetaChip } from '../ui';

const TYPE_LABEL: Record<BookmarkType, string> = {
  model: '모델',
  extension: '확장',
  manual: '매뉴얼',
  deal: '혜택',
};

export function SavedPage() {
  const items = useBookmarks();

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <BackBar onBack={() => goBack('/')} label="소식" />
      <div style={pageShell}>
        <h1 style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.3 }}>★ 저장한 항목</h1>
        <p style={{ fontSize: 14, color: theme.textMuted, marginTop: 8, lineHeight: 1.6 }}>
          관심 있는 모델·확장·매뉴얼을 모아봤어요. 이 기기에만 저장돼요.
        </p>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 16px', color: theme.textMuted }}>
            <div style={{ fontSize: 36 }}>☆</div>
            <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>아직 저장한 항목이 없어요.<br />상세 화면에서 “저장”을 눌러 모아보세요.</p>
            <button type="button" onClick={() => navigate('/rankings')} className="pressable"
              style={{ marginTop: 14, height: 46, padding: '0 18px', borderRadius: theme.radius, cursor: 'pointer',
                background: theme.accent, color: theme.accentInk, border: 'none', fontSize: 15, fontWeight: 700 }}>
              랭킹 둘러보기
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            {items.map((b) => (
              <div key={`${b.type}-${b.id}`} style={{ display: 'flex', gap: 10, alignItems: 'center',
                background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius, padding: '12px 14px' }}>
                <button type="button" onClick={() => navigate(b.route)} className="pressable"
                  style={{ flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: theme.text }}
                  aria-label={`${b.title} 열기`}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <MetaChip>{TYPE_LABEL[b.type]}</MetaChip>
                    {b.subtitle && <span style={{ fontSize: 12, color: theme.textMuted }}>{b.subtitle}</span>}
                  </div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35, wordBreak: 'keep-all' }}>{b.title}</div>
                </button>
                <button type="button" onClick={() => removeBookmark(b.type, b.id)} aria-label="저장 해제"
                  className="pressable" style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 999, cursor: 'pointer',
                    background: theme.accentSoft, border: 'none', color: theme.accent, fontSize: 16 }}>
                  ★
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
