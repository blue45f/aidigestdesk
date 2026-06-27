import { useEffect, useState } from 'react';

import {
  INQUIRY_CATEGORIES,
  INQUIRY_CATEGORY_LABELS,
  INQUIRY_STATUS_LABELS,
  listInquiries,
  submitInquiry,
  type Inquiry,
  type InquiryCategory,
} from '../lib/inquiry';
import { goBack } from '../router';
import { theme, pageShell } from '../theme';
import { BackBar, Chips, MetaChip } from '../ui';

const CATEGORY_VALUE_BY_LABEL = new Map(INQUIRY_CATEGORIES.map((c) => [INQUIRY_CATEGORY_LABELS[c], c]));

// 상태→색 시맨틱은 웹(SupportRoute statusTone)과 정렬: new=파랑(accent), in_progress=앰버,
// resolved=초록, closed=중립. (DealsPage 와 동일한 앰버 토큰 #f5c842 사용.)
function statusColor(status: string): { bg: string; fg: string } {
  if (status === 'resolved') return { bg: 'rgba(116,214,163,0.16)', fg: '#74d6a3' };
  if (status === 'in_progress') return { bg: 'rgba(245,200,66,0.16)', fg: '#f5c842' };
  if (status === 'closed') return { bg: 'var(--c-mute)', fg: theme.textMuted };
  return { bg: theme.accentSoft, fg: theme.accent }; // new
}

export function SupportPage() {
  const [category, setCategory] = useState<InquiryCategory>('usage');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setListError(null);
    listInquiries(20, 0)
      .then((res) => setItems(res.items))
      .catch((e: unknown) => setListError(e instanceof Error ? e.message : '목록을 불러오지 못했어요.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const canSubmit = title.trim().length >= 2 && body.trim().length >= 5 && !submitting;

  const onSubmit = async () => {
    if (!canSubmit) return;
    // 이메일은 선택이지만, 입력했다면 웹과 동일한 형식 규칙으로 검증한다.
    const email = contactEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('이메일 형식이 올바르지 않아요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitInquiry({
        category,
        title: title.trim(),
        body: body.trim(),
        authorName: authorName.trim() || undefined,
        contactEmail: email || undefined,
      });
      setDone(true);
      setTitle('');
      setBody('');
      setContactEmail('');
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '문의 등록에 실패했어요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <BackBar onBack={() => goBack('/')} label="소식" />
      <div style={pageShell}>
        <h1 style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.3 }}>문의 · 의견</h1>
        <p style={{ fontSize: 14, color: theme.textMuted, marginTop: 8, lineHeight: 1.6 }}>
          제휴·버그·이용 문의나 사이트 의견을 남겨주세요. 등록한 글은 아래 공개 게시판에 표시돼요.
        </p>

        {done ? (
          <div className="rise" style={{ marginTop: 18, background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: theme.radius, padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>✅</div>
            <p style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>문의가 등록됐어요</p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 6, lineHeight: 1.6 }}>빠르게 확인하고 처리할게요. 추가 문의는 아래 버튼으로요.</p>
            <button type="button" onClick={() => setDone(false)} className="pressable"
              style={{ marginTop: 14, height: 46, padding: '0 18px', borderRadius: theme.radius, cursor: 'pointer',
                background: theme.accent, color: theme.accentInk, border: 'none', fontSize: 15, fontWeight: 700 }}>
              새 문의 작성
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Chips
              items={INQUIRY_CATEGORIES.map((c) => INQUIRY_CATEGORY_LABELS[c])}
              active={INQUIRY_CATEGORY_LABELS[category]}
              onPick={(label) => { const v = CATEGORY_VALUE_BY_LABEL.get(label); if (v) setCategory(v); }}
            />
            <input className="field" style={{ paddingLeft: 14 }} value={title} maxLength={80}
              placeholder="제목 (2자 이상)" aria-label="제목" onChange={(e) => setTitle(e.target.value)} />
            <textarea value={body} maxLength={2000} placeholder="내용 (5자 이상)" aria-label="내용"
              onChange={(e) => setBody(e.target.value)}
              style={{ width: '100%', minHeight: 120, padding: 14, borderRadius: 'var(--r-md)', resize: 'vertical',
                background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 15,
                fontFamily: 'inherit', lineHeight: 1.6, outline: 'none' }} />
            <input className="field" style={{ paddingLeft: 14 }} value={authorName} maxLength={40}
              placeholder="이름 (선택)" aria-label="이름" onChange={(e) => setAuthorName(e.target.value)} />
            <input className="field" style={{ paddingLeft: 14 }} value={contactEmail} maxLength={120}
              type="email" inputMode="email" placeholder="이메일 (선택, 비공개)" aria-label="이메일"
              onChange={(e) => setContactEmail(e.target.value)} />
            {error && <p style={{ fontSize: 13, color: theme.danger, lineHeight: 1.5 }}>{error}</p>}
            <button type="button" onClick={onSubmit} disabled={!canSubmit} className="pressable"
              style={{ height: 50, borderRadius: theme.radius, cursor: canSubmit ? 'pointer' : 'not-allowed',
                background: canSubmit ? theme.accent : theme.surfaceAlt, color: canSubmit ? theme.accentInk : theme.textMuted,
                border: 'none', fontSize: 15.5, fontWeight: 700 }}>
              {submitting ? '등록 중…' : '문의 등록'}
            </button>
          </div>
        )}

        <h2 style={{ fontSize: 15, fontWeight: 800, marginTop: 28, marginBottom: 12 }}>📋 공개 문의 게시판</h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: theme.textMuted, padding: '24px 0' }}>불러오는 중…</p>
        ) : listError ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ color: theme.textMuted }}>{listError}</p>
            <button type="button" onClick={load} className="pressable"
              style={{ marginTop: 10, height: 40, padding: '0 16px', borderRadius: theme.radius, cursor: 'pointer',
                background: 'transparent', border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, fontWeight: 700 }}>
              다시 시도
            </button>
          </div>
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center', color: theme.textMuted, padding: '24px 0' }}>아직 등록된 문의가 없어요. 첫 문의를 남겨보세요.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((it) => {
              const sc = statusColor(it.status);
              return (
                <div key={it.id} style={{ background: theme.surface, border: `1px solid ${theme.border}`,
                  borderRadius: theme.radius, padding: 14 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px', borderRadius: 999,
                      fontSize: 11.5, fontWeight: 700, background: sc.bg, color: sc.fg }}>
                      {INQUIRY_STATUS_LABELS[it.status] ?? it.status}
                    </span>
                    <MetaChip>{INQUIRY_CATEGORY_LABELS[it.category] ?? it.category}</MetaChip>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: theme.textMuted }}>{it.createdAt.slice(0, 10)}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{it.title}</div>
                  <p style={{ fontSize: 13.5, color: theme.textMuted, marginTop: 6, lineHeight: 1.55,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.body}</p>
                  {it.authorName && <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>— {it.authorName}</div>}
                </div>
              );
            })}
          </div>
        )}
        <details style={{ marginTop: 26, border: `1px solid ${theme.border}`, borderRadius: 'var(--r-md)', background: theme.surface, padding: '0 16px' }}>
          <summary style={{ padding: '14px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: theme.text }}>
            약관 · 개인정보 처리방침
          </summary>
          <div style={{ paddingBottom: 16, fontSize: 13, color: theme.textMuted, lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: theme.text }}>서비스</strong> · AI다이제스트는 AI/LLM 소식·랭킹·매뉴얼·혜택을 모아
              보여주는 정보 큐레이션 미니앱이에요. 정보 제공 목적이며 정확성을 보증하지 않으니, 최종 확인은 각 공식
              출처에서 해주세요.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: theme.text }}>데이터</strong> · 랭킹 점수는 공개 벤치마크 기반 추정치(≈)이고, 모든
              정보는 스냅샷 기준이라 실제와 다를 수 있어요. 외부 링크·혜택은 각 제공사 정책을 따라요.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: theme.text }}>개인정보</strong> · 닉네임·화면 설정은 이 기기에만 저장돼요. 문의(제목·내용·이름·이메일)는
              운영 서버(desk-platform)로 전송·저장되며, 이메일을 제외한 내용은 공개 문의 목록에 표시될 수 있어요.
              마케팅·판매 목적의 제3자 제공은 없어요.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
