/**
 * 자체 백엔드(@aidigestdesk/api) 인증 클라이언트.
 *
 * 익명 식별키(getStableUserKey) → 서버 계정(get-or-create) + JWT, 그리고 프로필(닉네임·아바타)
 * 서버 동기화로 기기 간 회원 정체성을 일관되게 만든다.
 *
 * graceful-degradation 원칙: API URL 미설정이거나 서버 도달 불가 시 모든 함수가 조용히
 * null/false 를 반환한다 → 호출부는 기존 로컬(shared/community) 프로필로 폴백한다.
 * 즉 API 가 없어도 앱은 그대로 동작하고, 배포되면 자동으로 고도화된다.
 */
import { getProfile, setAvatar, setNickname } from '@aidigestdesk/content/shared';

import { getStableUserKey, tossAppLogin } from './toss';

/**
 * 배포된 API 베이스 URL. 공개 URL이라 default로 라이브 주소를 둔다(desk-platform 패턴과 동일).
 * env로 override 가능(dev=localhost:4350). 빈 값으로 두면 서버 연동을 건너뛰고 로컬로만 동작.
 */
const API_URL = (import.meta.env.VITE_AIDIGEST_API_URL ?? 'https://aidigestdesk-api.vercel.app').replace(
  /\/$/,
  '',
);
const TOKEN_KEY = 'aid-auth-token.v1';

export interface ServerUser {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  isGuest: boolean;
  isAdmin?: boolean;
}

export const isApiConfigured = (): boolean => Boolean(API_URL);

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // 토큰 저장 실패는 치명적이지 않다 — 다음 호출에서 재발급한다.
  }
}

function clearToken(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // 저장소 접근 실패는 이후 익명 세션 폴백으로 처리한다.
  }
}

type CurrentSession =
  | { status: 'valid'; user: ServerUser }
  | { status: 'missing' }
  | { status: 'unreachable' };

async function getCurrentSession(): Promise<CurrentSession> {
  const token = getToken();
  if (!token) return { status: 'missing' };
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401 || res.status === 403) {
      clearToken();
      return { status: 'missing' };
    }
    if (!res.ok) return { status: 'unreachable' };
    return { status: 'valid', user: (await res.json()) as ServerUser };
  } catch {
    return { status: 'unreachable' };
  }
}

/**
 * 익명키로 서버 계정을 보장(get-or-create)하고 JWT 를 저장한다.
 * @returns 서버 사용자(프로필 포함) 또는 null(API 미설정·도달 불가·토스 외 환경).
 */
export async function ensureSession(nickname?: string): Promise<ServerUser | null> {
  if (!API_URL) return null;
  try {
    const current = await getCurrentSession();
    if (current.status === 'valid') return current.user;
    // /me가 일시적으로 실패했을 때 익명 토큰으로 덮어쓰면 연결된 토스 계정을 잃는다.
    if (current.status === 'unreachable') return null;

    const anonymousKey = await getStableUserKey();
    if (!anonymousKey) return null;
    const res = await fetch(`${API_URL}/api/auth/toss`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nickname ? { anonymousKey, nickname } : { anonymousKey }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken?: string; user?: ServerUser };
    if (data.accessToken) setToken(data.accessToken);
    return data.user ?? null;
  } catch {
    return null;
  }
}

/**
 * 앱 시작 시 세션·프로필 복구(웹 restoreMemberSession 대응) — 서버 세션을 보장하고,
 * 로컬 프로필이 기본값(게스트)인데 서버에 실제 프로필이 있으면 로컬로 끌어온다.
 * ProfilePage 진입 전에도 커뮤니티 닉네임·아바타가 기기 간 일관되게 복구된다.
 * @returns 서버 사용자 또는 null(API 미설정·도달 불가 — 로컬 프로필로 동작).
 */
export async function restoreServerProfile(): Promise<ServerUser | null> {
  const initial = getProfile();
  const user = await ensureSession(initial.nickname === '게스트' ? undefined : initial.nickname);
  if (!user) return null;
  if (initial.nickname === '게스트' && user.nickname && user.nickname !== '게스트') {
    setNickname(user.nickname);
    if (user.avatar) setAvatar(user.avatar);
  }
  return user;
}

/**
 * 토스 로그인 인가 코드를 자체 백엔드에서 교환하고 서비스 세션으로 저장한다.
 * 콘솔 설정·mTLS 인증서가 완료되지 않은 경우 null을 반환해 기존 익명 세션을 유지한다.
 */
export type TossLoginConnectionResult =
  | { ok: true; user: ServerUser }
  | { ok: false; message: string };

export async function connectTossLogin(): Promise<TossLoginConnectionResult> {
  if (!API_URL) return { ok: false, message: '로그인 서버가 설정되지 않았어요.' };
  try {
    const authorization = await tossAppLogin();
    if (!authorization) {
      return { ok: false, message: '토스 로그인이 취소되었거나 로그인 창을 열지 못했어요.' };
    }
    const res = await fetch(`${API_URL}/api/auth/toss/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authorization),
    });
    const data = (await res.json().catch(() => null)) as
      | { accessToken?: string; user?: ServerUser; message?: string }
      | null;
    if (!res.ok) {
      return {
        ok: false,
        message:
          data?.message ||
          (res.status === 503
            ? '토스 로그인 서버 인증서가 설정되지 않았어요.'
            : '토스 로그인 서버 처리에 실패했어요.'),
      };
    }
    if (!data?.accessToken || !data.user) {
      return { ok: false, message: '로그인 서버 응답이 올바르지 않아요.' };
    }
    if (data.accessToken) setToken(data.accessToken);
    return { ok: true, user: data.user };
  } catch {
    return { ok: false, message: '로그인 서버에 연결하지 못했어요.' };
  }
}

export function isTossLoginUser(user: ServerUser | null): boolean {
  return Boolean(user?.id.startsWith('toss-user-'));
}

/** 현재 서비스 JWT만 제거한다. 토스 계정 자체 또는 앱 동의는 해제하지 않는다. */
export function disconnectServiceSession(): void {
  clearToken();
}

/**
 * 서버 프로필(닉네임·아바타) 갱신. 세션이 없으면 먼저 보장한다.
 * @returns 성공 여부(실패해도 로컬 저장은 호출부가 이미 했으므로 무해).
 */
export async function syncProfile(patch: { nickname?: string; avatar?: string }): Promise<boolean> {
  if (!API_URL) return false;
  let token = getToken();
  if (!token) {
    await ensureSession(patch.nickname);
    token = getToken();
  }
  if (!token) return false;
  try {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    });
    return res.ok;
  } catch {
    return false;
  }
}
