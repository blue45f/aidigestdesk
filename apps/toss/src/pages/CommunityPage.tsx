import { Top } from '@toss/tds-mobile';
import { useMemo, useRef, useState, useSyncExternalStore } from 'react';

import { AnimatedTitle } from '../components/AnimatedTitle';
import { BannerAd } from '../components/BannerAd';
import { ShareButton } from '../components/ShareButton';
import { AD_GROUPS } from '../lib/ads';
import { haptic } from '../lib/haptic';

import {
  addBoardPost,
  addComment,
  addPost,
  boardCategories,
  deleteBoardPost,
  deleteComment,
  deletePost,
  editBoardPost,
  editComment,
  editPost,
  formatRelativeTime,
  getAvatar,
  getCafeMemberCount,
  getCommunitySnapshot,
  getNickname,
  isCafeMember,
  isOwner,
  joinCafe,
  leaveCafe,
  listCafes,
  listChannels,
  selectBoardPosts,
  selectChannelPosts,
  selectCommentCount,
  selectComments,
  setNickname,
  subscribeCommunity,
  burstParticles,
  type BoardPost,
  type Cafe,
  type Channel,
  type Post,
} from '@aidigestdesk/content/shared';

import { navigate } from '../router';
import { theme, pageShell } from '../theme';
import { Chips, MetaChip, Segmented } from '../ui';

// 웹 CommunityRoute와 동일한 로직(@aidigestdesk/content/shared/community) 위에
// 토스 TDS 렌더만 얹은 화면. 편집은 shared 한 곳 → 웹·토스 동시 반영.

type Scope = 'chat' | 'board' | 'cafe';
const SCOPES: { id: Scope; label: string }[] = [
  { id: 'chat', label: '채팅방' },
  { id: 'board', label: '게시판' },
  { id: 'cafe', label: '카페' },
];

function useCommunity() {
  return useSyncExternalStore(subscribeCommunity, getCommunitySnapshot, getCommunitySnapshot);
}

/** 전송/작성 성공 연출 — 버튼 좌표에서 파티클 + 햅틱(reduced-motion 은 shared 가 존중). */
function celebrate(el: HTMLElement | null, strong = false) {
  burstParticles(el);
  haptic(strong ? 'confetti' : 'tickWeak');
}

const card: React.CSSProperties = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radius,
  padding: 14,
};
const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: 'var(--r-md)',
  color: theme.text,
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
};
const primaryBtn = (enabled: boolean): React.CSSProperties => ({
  height: 44,
  padding: '0 16px',
  borderRadius: theme.radius,
  border: 'none',
  cursor: enabled ? 'pointer' : 'not-allowed',
  background: enabled ? theme.accent : theme.surfaceAlt,
  color: enabled ? theme.accentInk : theme.textMuted,
  fontSize: 14.5,
  fontWeight: 700,
});
const linkBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: theme.textMuted,
  fontSize: 12.5,
  fontWeight: 700,
  cursor: 'pointer',
  padding: 0,
};

/* ── 댓글 섹션 ──────────────────────────────────────────────────────── */
function Comments({ postId, nickname }: { postId: string; nickname: string }) {
  const state = useCommunity();
  const comments = useMemo(() => selectComments(state, postId), [state, postId]);
  const [body, setBody] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ marginTop: 12, borderTop: `1px solid ${theme.border}`, paddingTop: 12 }}>
      {comments.length === 0 ? (
        <p style={{ fontSize: 12.5, color: theme.textMuted }}>첫 댓글을 남겨보세요.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {comments.map((c) => {
            const mine = isOwner(c.authorId);
            const editing = editId === c.id;
            return (
              <li key={c.id} style={{ background: theme.surfaceAlt, borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: theme.textMuted }}>
                    <b style={{ color: theme.text }}>{c.author}</b> · {formatRelativeTime(c.createdAt)}
                    {c.editedAt ? ' · 수정됨' : ''}
                  </span>
                  {mine && !editing && (
                    <span style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button type="button" style={linkBtn} onClick={() => { setEditId(c.id); setEditBody(c.body); }}>수정</button>
                      <button type="button" style={{ ...linkBtn, color: theme.danger }} onClick={() => deleteComment(c.id)}>삭제</button>
                    </span>
                  )}
                </div>
                {editing ? (
                  <div style={{ marginTop: 6 }}>
                    <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={2}
                      aria-label="댓글 수정" style={{ ...fieldStyle, padding: 8, resize: 'vertical', lineHeight: 1.5 }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <button type="button" disabled={!editBody.trim()} style={{ ...primaryBtn(!!editBody.trim()), height: 36 }}
                        onClick={() => { if (editBody.trim()) { editComment(c.id, editBody.trim()); setEditId(null); } }}>저장</button>
                      <button type="button" style={{ ...primaryBtn(false), height: 36, background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, cursor: 'pointer' }}
                        onClick={() => setEditId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 13.5, color: theme.text, marginTop: 4, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{c.body}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <form style={{ display: 'flex', gap: 8, marginTop: 10 }}
        onSubmit={(e) => { e.preventDefault(); if (body.trim()) { addComment({ postId, author: nickname, body: body.trim() }); setBody(''); celebrate(submitRef.current, true); } }}>
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="댓글 달기…" aria-label="댓글 입력"
          style={{ ...fieldStyle, flex: 1, height: 40, paddingLeft: 12 }} />
        <button ref={submitRef} type="submit" disabled={!body.trim()} style={{ ...primaryBtn(!!body.trim()), height: 40 }}>등록</button>
      </form>
    </div>
  );
}

/* ── 게시판 글 행 ───────────────────────────────────────────────────── */
function BoardRow({ post, nickname }: { post: BoardPost; nickname: string }) {
  const state = useCommunity();
  const count = useMemo(() => selectCommentCount(state, post.id), [state, post.id]);
  const mine = isOwner(post.authorId);
  const showCat = !post.category.startsWith('cafe:');
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [open, setOpen] = useState(false);

  return (
    <li style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {showCat && <MetaChip>{post.category}</MetaChip>}
            {!editing && <span style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{post.title}</span>}
          </div>
          <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
            <b style={{ color: theme.text }}>{post.author}</b> · {formatRelativeTime(post.createdAt)}{post.editedAt ? ' · 수정됨' : ''}
          </p>
        </div>
        {!editing && (
          <span style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <ShareButton variant="link"
              text={`${post.title}\n${post.body.length > 80 ? `${post.body.slice(0, 80)}…` : post.body}`} />
            {mine && (
              <>
                <button type="button" style={linkBtn} onClick={() => { setTitle(post.title); setBody(post.body); setEditing(true); }}>수정</button>
                <button type="button" style={{ ...linkBtn, color: theme.danger }} onClick={() => deleteBoardPost(post.id)}>삭제</button>
              </>
            )}
          </span>
        )}
      </div>
      {editing ? (
        <div style={{ marginTop: 8 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" aria-label="제목 수정"
            style={{ ...fieldStyle, height: 40, paddingLeft: 12, marginBottom: 8 }} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} aria-label="내용 수정"
            style={{ ...fieldStyle, padding: 10, resize: 'vertical', lineHeight: 1.5 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="button" disabled={!title.trim() || !body.trim()} style={{ ...primaryBtn(!!title.trim() && !!body.trim()), height: 38 }}
              onClick={() => { if (title.trim() && body.trim()) { editBoardPost(post.id, { title: title.trim(), body: body.trim() }); setEditing(false); } }}>저장</button>
            <button type="button" style={{ height: 38, padding: '0 16px', borderRadius: theme.radius, background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              onClick={() => setEditing(false)}>취소</button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 13.5, color: theme.textMuted, marginTop: 8, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{post.body}</p>
      )}
      {!editing && (
        <button type="button" style={{ ...linkBtn, marginTop: 8 }} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          💬 댓글 {count}{open ? ' 접기' : ''}
        </button>
      )}
      {open && !editing && <Comments postId={post.id} nickname={nickname} />}
    </li>
  );
}

/* ── 채팅 메시지 행 ─────────────────────────────────────────────────── */
function MessageRow({ post }: { post: Post }) {
  const mine = isOwner(post.authorId);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(post.body);
  return (
    <li style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 12.5, color: theme.textMuted }}>
          <b style={{ color: theme.text }}>{post.author}</b> · {formatRelativeTime(post.createdAt)}{post.editedAt ? ' · 수정됨' : ''}
        </span>
        {mine && !editing && (
          <span style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button type="button" style={linkBtn} onClick={() => { setBody(post.body); setEditing(true); }}>수정</button>
            <button type="button" style={{ ...linkBtn, color: theme.danger }} onClick={() => deletePost(post.id)}>삭제</button>
          </span>
        )}
      </div>
      {editing ? (
        <div style={{ marginTop: 6 }}>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} aria-label="메시지 수정"
            style={{ ...fieldStyle, padding: 8, resize: 'vertical', lineHeight: 1.5 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button type="button" disabled={!body.trim()} style={{ ...primaryBtn(!!body.trim()), height: 36 }}
              onClick={() => { if (body.trim()) { editPost(post.id, body.trim()); setEditing(false); } }}>저장</button>
            <button type="button" style={{ height: 36, padding: '0 14px', borderRadius: theme.radius, background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}
              onClick={() => setEditing(false)}>취소</button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 14, color: theme.text, marginTop: 6, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{post.body}</p>
      )}
    </li>
  );
}

/* ── 채팅 뷰 ────────────────────────────────────────────────────────── */
function ChatView({ nickname }: { nickname: string }) {
  const channels = useMemo<Channel[]>(() => listChannels(), []);
  const [active, setActive] = useState(channels[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const state = useCommunity();
  const channel = channels.find((c) => c.id === active) ?? channels[0] ?? null;
  const posts = useMemo<Post[]>(() => (channel ? selectChannelPosts(state, channel.id) : []), [state, channel]);
  const sendRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Chips items={channels.map((c) => c.name)} active={channel?.name ?? ''}
        onPick={(name) => { const c = channels.find((x) => x.name === name); if (c) setActive(c.id); }} />
      {channel && <p style={{ fontSize: 12.5, color: theme.textMuted }}>{channel.topic}</p>}
      {/* key=채널 — 채널 전환 시 목록 스왑 애니메이션(.list-swap) 재트리거 */}
      <ul key={channel?.id ?? 'none'} className="list-swap"
        style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts.map((p) => <MessageRow key={p.id} post={p} />)}
        {posts.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: '24px 0' }}>첫 메시지를 남겨보세요.</p>}
      </ul>
      <form style={{ display: 'flex', gap: 8 }}
        onSubmit={(e) => { e.preventDefault(); if (channel && draft.trim()) { addPost({ channelId: channel.id, author: nickname, body: draft.trim() }); setDraft(''); celebrate(sendRef.current); } }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="메시지 입력" aria-label="메시지 입력"
          style={{ ...fieldStyle, flex: 1, height: 44, paddingLeft: 12 }} />
        <button ref={sendRef} type="submit" disabled={!draft.trim()} style={primaryBtn(!!draft.trim())}>전송</button>
      </form>
    </div>
  );
}

/* ── 게시판 뷰 ──────────────────────────────────────────────────────── */
function BoardView({ nickname }: { nickname: string }) {
  const [cat, setCat] = useState('전체');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [writeCat, setWriteCat] = useState<string>(boardCategories[0]);
  const state = useCommunity();
  const posts = useMemo(() => selectBoardPosts(state, cat === '전체' ? undefined : cat), [state, cat]);
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Chips items={['전체', ...boardCategories]} active={cat} onPick={setCat} />
      {/* key=카테고리 — 필터 전환 시 목록 스왑 애니메이션 재트리거 */}
      <ul key={cat} className="list-swap"
        style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts.map((p) => <BoardRow key={p.id} post={p} nickname={nickname} />)}
        {posts.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: '24px 0' }}>아직 글이 없어요. 첫 글을 남겨보세요.</p>}
      </ul>
      <form style={{ ...card, display: 'flex', flexDirection: 'column', gap: 8 }}
        onSubmit={(e) => { e.preventDefault(); if (title.trim() && body.trim()) { addBoardPost({ category: writeCat, title: title.trim(), body: body.trim(), author: nickname }); setTitle(''); setBody(''); setCat('전체'); celebrate(submitRef.current, true); } }}>
        <Chips items={[...boardCategories]} active={writeCat} onPick={setWriteCat} />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" aria-label="제목"
          style={{ ...fieldStyle, height: 42, paddingLeft: 12 }} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="내용" aria-label="내용"
          style={{ ...fieldStyle, padding: 10, resize: 'vertical', lineHeight: 1.5 }} />
        <button ref={submitRef} type="submit" disabled={!title.trim() || !body.trim()} style={{ ...primaryBtn(!!title.trim() && !!body.trim()), alignSelf: 'flex-start' }}>글 작성</button>
      </form>
    </div>
  );
}

/* ── 카페 뷰 ────────────────────────────────────────────────────────── */
function CafeCard({ cafe, nickname }: { cafe: Cafe; nickname: string }) {
  const cafeCat = `cafe:${cafe.id}`;
  const state = useCommunity();
  const { joined, members, posts } = useMemo(() => ({
    joined: isCafeMember(cafe.id),
    members: getCafeMemberCount(cafe.id),
    posts: selectBoardPosts(state, cafeCat),
  }), [state, cafe.id, cafeCat]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <article style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{cafe.emoji ?? '☕'} {cafe.name}</div>
          <p style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 3, lineHeight: 1.5 }}>{cafe.description}</p>
          <p style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 4 }}>멤버 {members.toLocaleString('ko-KR')}명</p>
        </div>
        <button type="button" onClick={() => (joined ? leaveCafe(cafe.id) : joinCafe(cafe.id))}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', borderRadius: theme.radius, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            background: joined ? 'transparent' : theme.accent, color: joined ? theme.textMuted : theme.accentInk,
            border: joined ? `1px solid ${theme.border}` : 'none' }}>
          {joined ? '탈퇴' : '가입'}
        </button>
      </div>
      {joined && (
        <div style={{ marginTop: 12, borderTop: `1px solid ${theme.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map((p) => <BoardRow key={p.id} post={p} nickname={nickname} />)}
            {posts.length === 0 && <p style={{ fontSize: 12.5, color: theme.textMuted }}>이 카페의 첫 글을 남겨보세요.</p>}
          </ul>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            onSubmit={(e) => { e.preventDefault(); if (title.trim() && body.trim()) { addBoardPost({ category: cafeCat, title: title.trim(), body: body.trim(), author: nickname }); setTitle(''); setBody(''); celebrate(submitRef.current, true); } }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" aria-label="카페 글 제목"
              style={{ ...fieldStyle, height: 40, paddingLeft: 12 }} />
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} placeholder="내용" aria-label="카페 글 내용"
              style={{ ...fieldStyle, padding: 10, resize: 'vertical', lineHeight: 1.5 }} />
            <button ref={submitRef} type="submit" disabled={!title.trim() || !body.trim()} style={{ ...primaryBtn(!!title.trim() && !!body.trim()), height: 38, alignSelf: 'flex-start' }}>글 작성</button>
          </form>
        </div>
      )}
    </article>
  );
}

function CafeView({ nickname }: { nickname: string }) {
  const cafes = useMemo<Cafe[]>(() => listCafes(), []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {cafes.map((c) => <CafeCard key={c.id} cafe={c} nickname={nickname} />)}
      {cafes.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: '24px 0' }}>표시할 카페가 없어요.</p>}
    </div>
  );
}

/* ── 커뮤니티 페이지 ────────────────────────────────────────────────── */
export function CommunityPage() {
  const [scope, setScope] = useState<Scope>('chat');
  const [nickname, setNick] = useState(() => getNickname());
  const [avatar] = useState(() => getAvatar());
  const current = nickname.trim() || '게스트';

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <Top title={<Top.TitleParagraph size={22}>💬 <AnimatedTitle size={22}>커뮤니티</AnimatedTitle></Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph size={15}>채팅·게시판·카페 — 서버에 저장, 기기·웹과 공유</Top.SubtitleParagraph>} />
      <div style={pageShell}>
        <div style={{ marginBottom: 14 }}>
          <Segmented options={SCOPES} value={scope} onChange={(v) => setScope(v as Scope)} />
        </div>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" onClick={() => navigate('/profile')} aria-label="내 정보" className="pressable"
            style={{ width: 42, height: 42, borderRadius: 999, flexShrink: 0, display: 'grid', placeItems: 'center',
              fontSize: 22, background: theme.accentSoft, border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            {avatar}
          </button>
          <input value={nickname} onChange={(e) => { setNick(e.target.value); setNickname(e.target.value); }}
            placeholder="닉네임(게스트)" aria-label="닉네임" style={{ ...fieldStyle, height: 42, paddingLeft: 12, flex: 1 }} />
        </div>
        {/* key=스코프 — Segmented 전환 시 뷰 스왑 애니메이션 */}
        <div key={scope} className="list-swap">
          {scope === 'chat' ? <ChatView nickname={current} />
            : scope === 'board' ? <BoardView nickname={current} />
            : <CafeView nickname={current} />}
        </div>

        {/* 인앱 배너 — 커뮤니티 콘텐츠 하단. */}
        <BannerAd adGroupId={AD_GROUPS.feedList} marginTop={18} />
      </div>
    </div>
  );
}
