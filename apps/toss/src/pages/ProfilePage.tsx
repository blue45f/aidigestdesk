import { AVATAR_PALETTE, getProfile, setAvatar, setNickname } from '@aidigestdesk/content/shared';
import { useEffect, useState } from 'react';

import { ensureSession, syncProfile } from '../lib/auth';
import { useBookmarks } from '../lib/bookmarks';
import { goBack, navigate } from '../router';
import { theme, pageShell } from '../theme';
import { BackBar } from '../ui';

/**
 * 내 정보 — 익명 회원 프로필. 별도 로그인 없이 기기 기반(getProfile: memberId·닉네임·아바타·가입일).
 * 토스 로그인(mTLS)은 앱 승인 후 제공 예정이라, 지금은 익명 정체성을 다듬는 데 집중한다.
 * 닉네임·아바타는 공유 커널(shared/community)에 저장돼 커뮤니티와 동일 정체성을 쓴다.
 */
export function ProfilePage() {
  const [profile, setProfile] = useState(() => getProfile());
  const [connected, setConnected] = useState(false);
  const bookmarks = useBookmarks();
  const nick = profile.nickname;

  // 자체 API 세션 보장 + 저장소를 비운 기기 복구(서버에 실제 프로필이 있으면 끌어온다).
  // API 미배포/도달 불가 시 graceful — 아무 일도 안 일어나고 로컬 프로필로 동작한다.
  useEffect(() => {
    let alive = true;
    const initial = getProfile();
    void ensureSession(initial.nickname === '게스트' ? undefined : initial.nickname).then((user) => {
      if (!alive || !user) return;
      setConnected(true);
      if (initial.nickname === '게스트' && user.nickname && user.nickname !== '게스트') {
        setNickname(user.nickname);
        if (user.avatar) setAvatar(user.avatar);
        setProfile((p) => ({ ...p, nickname: user.nickname, avatar: user.avatar || p.avatar }));
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const onNick = (v: string) => {
    setNickname(v);
    setProfile((p) => ({ ...p, nickname: v.trim() || '게스트' }));
    void syncProfile({ nickname: v.trim() || '게스트' });
  };
  const onAvatar = (emoji: string) => {
    setAvatar(emoji);
    setProfile((p) => ({ ...p, avatar: emoji }));
    void syncProfile({ avatar: emoji });
  };

  const shortId = profile.memberId.replace(/^anon:/, '').slice(0, 8);
  const links = [
    { label: '저장한 항목', sub: `${bookmarks.length}개`, route: '/saved', icon: '★' },
    { label: '커뮤니티', sub: '채팅·게시판·카페', route: '/community', icon: '💬' },
    { label: '문의', sub: '1:1 문의·내역', route: '/support', icon: '📮' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg }}>
      <BackBar onBack={() => goBack('/')} label="소식" />
      <div style={pageShell}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, display: 'grid', placeItems: 'center',
            fontSize: 34, background: theme.accentSoft, border: `1px solid ${theme.border}`, flexShrink: 0 }}>
            {profile.avatar}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>{nick}</div>
            <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 4 }}>익명 회원 · 가입 {profile.joinedAt}</div>
          </div>
        </div>

        <label htmlFor="aid-nick" style={{ display: 'block', marginTop: 22, fontSize: 13, fontWeight: 700, color: theme.textMuted }}>닉네임</label>
        <input id="aid-nick" value={nick === '게스트' ? '' : nick} onChange={(e) => onNick(e.target.value)}
          placeholder="닉네임(게스트)" aria-label="닉네임"
          style={{ width: '100%', marginTop: 8, height: 46, borderRadius: theme.radius, padding: '0 14px',
            background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 15 }} />

        <div style={{ marginTop: 18, fontSize: 13, fontWeight: 700, color: theme.textMuted }}>아바타</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {AVATAR_PALETTE.map((emoji) => {
            const on = emoji === profile.avatar;
            return (
              <button key={emoji} type="button" onClick={() => onAvatar(emoji)} aria-pressed={on}
                aria-label={`아바타 ${emoji}`} className="pressable"
                style={{ width: 46, height: 46, borderRadius: 12, fontSize: 24, cursor: 'pointer',
                  background: on ? theme.accentSoft : theme.surface,
                  border: on ? `2px solid ${theme.accent}` : `1px solid ${theme.border}` }}>
                {emoji}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 22, padding: 14, borderRadius: theme.radius, background: theme.surface,
          border: `1px solid ${theme.border}`, fontSize: 12.5, color: theme.textMuted, lineHeight: 1.7 }}>
          별도 회원가입·로그인 없이 <strong style={{ color: theme.text }}>익명 회원</strong>으로 활동 중이에요.
          {connected
            ? ' 닉네임·아바타는 이 기기와 서버에 백업돼 저장소를 비워도 복구돼요.'
            : ' 닉네임·아바타는 이 기기에 저장돼요.'}{' '}토스 계정·개인정보는 받지 않아요.
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
              background: connected ? 'rgba(116,214,163,0.16)' : 'var(--c-faint)',
              color: connected ? '#74d6a3' : theme.textMuted }}>
              {connected ? '☁️ 서버 백업됨' : '기기 저장'}
            </span>
            <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11.5 }}>ID {shortId}</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          {links.map((l) => (
            <button key={l.route} type="button" onClick={() => navigate(l.route)} className="pressable"
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
                background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radius,
                padding: 14, color: theme.text, cursor: 'pointer' }}>
              <span aria-hidden style={{ fontSize: 20 }}>{l.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>{l.label}</span>
                <span style={{ display: 'block', fontSize: 12.5, color: theme.textMuted, marginTop: 2 }}>{l.sub}</span>
              </span>
              <span aria-hidden style={{ fontSize: 18, color: theme.textMuted }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
