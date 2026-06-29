// 회원 인증 — 우선순위가 명확한 단일 경로.
//   1) DeskCloud AuthDesk 연동(VITE_AUTHDESK_URL/PK 설정 시): 실제 서버 인증으로
//      위임하고 end-user JWT 로 세션을 유지한다.
//   2) Firebase 설정 시: Firebase Auth의 persistence와 상태 구독을 사용한다.
//   3) 모두 미설정 시 로컬 데모: 계정·세션을 localStorage 에만 저장하고 비밀번호는
//      Web Crypto(SHA-256 + per-user salt)로 해시해 평문을 보관하지 않는다.
// 정적 SPA 라 publishable(pk_) 키만 사용한다. 공개 클라이언트엔 self-delete 가 없어
// 원격 탈퇴는 로컬 세션 정리 + 로그아웃으로 처리한다(서버 삭제는 관리자 영역).

import { DeskError } from '@heejun/deskcloud'

import { deskcloudEnabled, getAuthClient } from '@/components/app/deskcloud'
import { isFirebaseAuthConfigured } from '@/lib/firebaseAuth/config'

const ACCOUNTS_KEY = 'aidigestdesk.members.v1'
const SESSION_KEY = 'aidigestdesk.memberSession.v1'
const TOKEN_KEY = 'aidigestdesk.memberToken.v1'
const SESSION_EVENT = 'aidigestdesk:member-session'

export type MemberAuthProvider = 'authdesk' | 'firebase' | 'local'

export function getMemberAuthProvider(): MemberAuthProvider {
  if (deskcloudEnabled.auth) return 'authdesk'
  if (isFirebaseAuthConfigured) return 'firebase'
  return 'local'
}

function readToken(): string | null {
  if (!hasWindow()) return null
  return window.localStorage.getItem(TOKEN_KEY)
}

function writeToken(token: string | null) {
  if (!hasWindow()) return
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY)
    return
  }
  window.localStorage.setItem(TOKEN_KEY, token)
}

function remoteError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}

export type MemberRole = 'member' | 'admin'

export type MemberAccount = {
  id: string
  email: string
  displayName: string
  role: MemberRole
  salt: string
  passwordHash: string
  createdAt: string
}

export type MemberSession = {
  id: string
  email: string
  displayName: string
  role: MemberRole
  signedInAt: string
  provider: MemberAuthProvider
  isGuest?: boolean
}

export type AuthResult = { ok: true; session: MemberSession } | { ok: false; error: string }

function hasWindow() {
  return typeof window !== 'undefined'
}

function readAccounts(): MemberAccount[] {
  if (!hasWindow()) return []
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as MemberAccount[]) : []
  } catch {
    return []
  }
}

function writeAccounts(accounts: MemberAccount[]) {
  if (!hasWindow()) return
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function randomHex(bytes = 16) {
  if (hasWindow() && window.crypto?.getRandomValues) {
    const array = new Uint8Array(bytes)
    window.crypto.getRandomValues(array)
    return [...array].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  // SSR/비보안 컨텍스트 폴백 — 빌드 타임에만 도달, 런타임 보안엔 영향 없음.
  let out = ''
  for (let index = 0; index < bytes * 2; index += 1) {
    out += Math.floor(Math.random() * 16).toString(16)
  }
  return out
}

async function hashPassword(password: string, salt: string) {
  if (!hasWindow() || !window.crypto?.subtle) {
    // 폴백: 약한 해시(데모). 실제 보안엔 사용하지 않는다.
    let hash = 0
    const input = `${salt}:${password}`
    for (let index = 0; index < input.length; index += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(index)
      hash |= 0
    }
    return `weak-${hash >>> 0}`
  }
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return toHex(digest)
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function toSession(account: MemberAccount): MemberSession {
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    signedInAt: new Date().toISOString(),
    provider: 'local',
  }
}

type StoredSession = Pick<MemberSession, 'id' | 'email'> & Partial<MemberSession>

function readStoredSession(): StoredSession | null {
  if (!hasWindow()) return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<MemberSession>
    if (!parsed.id || !parsed.email) return null
    return parsed as StoredSession
  } catch {
    return null
  }
}

function emitSessionChange(session: MemberSession | null) {
  if (!hasWindow()) return
  window.dispatchEvent(new CustomEvent<MemberSession | null>(SESSION_EVENT, { detail: session }))
}

export function getInitialMemberSession(): MemberSession | null {
  if (!hasWindow()) return null
  const provider = getMemberAuthProvider()

  // Firebase는 자체 persistence와 onAuthStateChanged가 초기 세션을 복구한다.
  if (provider === 'firebase') return null

  const parsed = readStoredSession()
  if (!parsed) return null

  if (provider === 'authdesk') {
    // 서버 토큰이 있을 때만 캐시를 먼저 복원하고, 앱 마운트 후 /me로 재검증한다.
    if (!readToken()) return null
    return {
      id: parsed.id,
      email: parsed.email,
      displayName: parsed.displayName?.trim() || parsed.email.split('@')[0] || '회원',
      role: 'member',
      signedInAt: parsed.signedInAt ?? new Date().toISOString(),
      provider: 'authdesk',
    }
  }

  try {
    // 계정이 실제로 존재하는지 확인(탈퇴 후 잔존 세션 방지).
    const account = readAccounts().find((item) => item.id === parsed.id)
    if (!account) return null
    return {
      id: account.id,
      email: account.email,
      displayName: account.displayName,
      role: account.role,
      signedInAt: parsed.signedInAt ?? new Date().toISOString(),
      provider: 'local',
    }
  } catch {
    return null
  }
}

function saveSession(session: MemberSession | null) {
  if (!hasWindow()) return
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY)
  } else {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
  emitSessionChange(session)
}

/**
 * AuthDesk 캐시를 서버의 현재 사용자와 대조한다. 만료·폐기된 토큰은 제거하고,
 * 일시적인 네트워크 장애면 마지막 검증 세션을 유지해 새로고침만으로 로그아웃되지 않게 한다.
 */
export async function restoreMemberSession(): Promise<MemberSession | null> {
  if (getMemberAuthProvider() !== 'authdesk') return getInitialMemberSession()
  const auth = getAuthClient()
  const token = readToken()
  if (!auth || !token) return null

  try {
    const user = await auth.me(token, { signal: AbortSignal.timeout(12_000) })
    const previous = readStoredSession()
    const session: MemberSession = {
      id: user.id,
      email: user.email,
      displayName: user.name,
      role: 'member',
      signedInAt: previous?.signedInAt ?? new Date().toISOString(),
      provider: 'authdesk',
    }
    saveSession(session)
    return session
  } catch (err) {
    if (err instanceof DeskError && (err.status === 401 || err.status === 403)) {
      writeToken(null)
      saveSession(null)
      return null
    }
    return getInitialMemberSession()
  }
}

/** 같은 탭의 인증 액션과 다른 탭의 localStorage 변경을 한 구독으로 동기화한다. */
export function subscribeMemberSession(
  listener: (session: MemberSession | null) => void
): () => void {
  if (!hasWindow()) return () => undefined
  const onSession = (event: Event) => {
    listener((event as CustomEvent<MemberSession | null>).detail)
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === SESSION_KEY || event.key === TOKEN_KEY || event.key === ACCOUNTS_KEY) {
      listener(getInitialMemberSession())
    }
  }
  window.addEventListener(SESSION_EVENT, onSession)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(SESSION_EVENT, onSession)
    window.removeEventListener('storage', onStorage)
  }
}

export async function signUp(input: {
  email: string
  displayName: string
  password: string
}): Promise<AuthResult> {
  const email = normalizeEmail(input.email)
  const displayName = input.displayName.trim()

  if (!email.includes('@') || email.length < 5) {
    return { ok: false, error: '올바른 이메일 형식을 입력하세요.' }
  }
  if (displayName.length < 2) {
    return { ok: false, error: '닉네임은 2자 이상이어야 합니다.' }
  }
  if (input.password.length < 8) {
    return { ok: false, error: '비밀번호는 8자 이상이어야 합니다.' }
  }

  // DeskCloud AuthDesk 연동 경로.
  const auth = getAuthClient()
  if (auth) {
    try {
      const result = await auth.register({ email, password: input.password, name: displayName })
      writeToken(result.token)
      const session: MemberSession = {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.name,
        role: 'member',
        signedInAt: new Date().toISOString(),
        provider: 'authdesk',
      }
      saveSession(session)
      return { ok: true, session }
    } catch (err) {
      return { ok: false, error: remoteError(err, '가입에 실패했습니다.') }
    }
  }

  const accounts = readAccounts()
  if (accounts.some((account) => account.email === email)) {
    return { ok: false, error: '이미 가입된 이메일입니다. 로그인해 주세요.' }
  }

  const salt = randomHex(16)
  const passwordHash = await hashPassword(input.password, salt)
  // 첫 가입자는 데모 편의를 위해 admin 권한을 받는다.
  const role: MemberRole = accounts.length === 0 ? 'admin' : 'member'
  const account: MemberAccount = {
    id: randomHex(12),
    email,
    displayName,
    role,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  writeAccounts([...accounts, account])
  const session = toSession(account)
  saveSession(session)
  return { ok: true, session }
}

export async function logIn(input: { email: string; password: string }): Promise<AuthResult> {
  const email = normalizeEmail(input.email)

  // DeskCloud AuthDesk 연동 경로.
  const auth = getAuthClient()
  if (auth) {
    try {
      const result = await auth.login({ email, password: input.password })
      writeToken(result.token)
      const session: MemberSession = {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.name,
        role: 'member',
        signedInAt: new Date().toISOString(),
        provider: 'authdesk',
      }
      saveSession(session)
      return { ok: true, session }
    } catch (err) {
      return { ok: false, error: remoteError(err, '로그인에 실패했습니다.') }
    }
  }

  const account = readAccounts().find((item) => item.email === email)
  if (!account) {
    return { ok: false, error: '가입된 계정을 찾을 수 없습니다.' }
  }
  const passwordHash = await hashPassword(input.password, account.salt)
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: '비밀번호가 일치하지 않습니다.' }
  }
  const session = toSession(account)
  saveSession(session)
  return { ok: true, session }
}

export function logOut() {
  // 원격 세션이면 best-effort 로 서버 세션도 폐기.
  const auth = getAuthClient()
  const token = readToken()
  if (auth && token) {
    void auth.logout(token).catch(() => {
      /* 비치명적 — 로컬 세션은 아래에서 정리 */
    })
  }
  writeToken(null)
  saveSession(null)
}

/** 회원 탈퇴 — 로컬 계정·세션을 삭제한다. 원격(AuthDesk)은 공개 클라이언트에
 *  self-delete 가 없어 로컬 세션 정리 + 로그아웃으로 처리한다(서버 삭제는 관리자 영역). */
export function withdraw(memberId: string) {
  if (getAuthClient()) {
    logOut()
    return
  }
  const accounts = readAccounts().filter((account) => account.id !== memberId)
  writeAccounts(accounts)
  saveSession(null)
}

/** 어드민용 — 가입 회원 목록(비밀번호 제외). */
export function listMembers(): Array<Omit<MemberAccount, 'salt' | 'passwordHash'>> {
  return readAccounts().map(({ salt: _salt, passwordHash: _passwordHash, ...rest }) => rest)
}

export function getMemberCount() {
  return readAccounts().length
}

/** 어드민용 — 회원 강제 삭제. */
export function removeMember(memberId: string) {
  writeAccounts(readAccounts().filter((account) => account.id !== memberId))
}
