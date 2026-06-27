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
import { getStableUserKey } from './toss';

/** 배포된 API 베이스 URL. 미설정('')이면 서버 연동을 건너뛰고 로컬로만 동작한다. */
const API_URL = (import.meta.env.VITE_AIDIGEST_API_URL ?? '').replace(/\/$/, '');
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

/**
 * 익명키로 서버 계정을 보장(get-or-create)하고 JWT 를 저장한다.
 * @returns 서버 사용자(프로필 포함) 또는 null(API 미설정·도달 불가·토스 외 환경).
 */
export async function ensureSession(nickname?: string): Promise<ServerUser | null> {
  if (!API_URL) return null;
  try {
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
