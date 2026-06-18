// 회원 인증 — 클라이언트 전용(데모). 백엔드가 없으므로 계정과 세션을
// localStorage에만 저장하고, 비밀번호는 Web Crypto(SHA-256 + per-user salt)로
// 해시해 평문을 보관하지 않는다. 어떤 데이터도 브라우저를 벗어나지 않는다.
//
// 이 시스템은 포트폴리오/데모용이며 실제 서버 인증을 대체하지 않는다.

const ACCOUNTS_KEY = "aidigestdesk.members.v1";
const SESSION_KEY = "aidigestdesk.memberSession.v1";

export type MemberRole = "member" | "admin";

export type MemberAccount = {
  id: string;
  email: string;
  displayName: string;
  role: MemberRole;
  salt: string;
  passwordHash: string;
  createdAt: string;
};

export type MemberSession = {
  id: string;
  email: string;
  displayName: string;
  role: MemberRole;
  signedInAt: string;
};

export type AuthResult =
  | { ok: true; session: MemberSession }
  | { ok: false; error: string };

function hasWindow() {
  return typeof window !== "undefined";
}

function readAccounts(): MemberAccount[] {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as MemberAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: MemberAccount[]) {
  if (!hasWindow()) return;
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function randomHex(bytes = 16) {
  if (hasWindow() && window.crypto?.getRandomValues) {
    const array = new Uint8Array(bytes);
    window.crypto.getRandomValues(array);
    return [...array].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  // SSR/비보안 컨텍스트 폴백 — 빌드 타임에만 도달, 런타임 보안엔 영향 없음.
  let out = "";
  for (let index = 0; index < bytes * 2; index += 1) {
    out += Math.floor(Math.random() * 16).toString(16);
  }
  return out;
}

async function hashPassword(password: string, salt: string) {
  if (!hasWindow() || !window.crypto?.subtle) {
    // 폴백: 약한 해시(데모). 실제 보안엔 사용하지 않는다.
    let hash = 0;
    const input = `${salt}:${password}`;
    for (let index = 0; index < input.length; index += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(index);
      hash |= 0;
    }
    return `weak-${hash >>> 0}`;
  }
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toSession(account: MemberAccount): MemberSession {
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    signedInAt: new Date().toISOString(),
  };
}

export function getInitialMemberSession(): MemberSession | null {
  if (!hasWindow()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MemberSession>;
    if (!parsed.id || !parsed.email) return null;
    // 계정이 실제로 존재하는지 확인(탈퇴 후 잔존 세션 방지).
    const account = readAccounts().find((item) => item.id === parsed.id);
    if (!account) return null;
    return {
      id: account.id,
      email: account.email,
      displayName: account.displayName,
      role: account.role,
      signedInAt: parsed.signedInAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function saveSession(session: MemberSession | null) {
  if (!hasWindow()) return;
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function signUp(input: {
  email: string;
  displayName: string;
  password: string;
}): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const displayName = input.displayName.trim();

  if (!email.includes("@") || email.length < 5) {
    return { ok: false, error: "올바른 이메일 형식을 입력하세요." };
  }
  if (displayName.length < 2) {
    return { ok: false, error: "닉네임은 2자 이상이어야 합니다." };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "비밀번호는 8자 이상이어야 합니다." };
  }

  const accounts = readAccounts();
  if (accounts.some((account) => account.email === email)) {
    return { ok: false, error: "이미 가입된 이메일입니다. 로그인해 주세요." };
  }

  const salt = randomHex(16);
  const passwordHash = await hashPassword(input.password, salt);
  // 첫 가입자는 데모 편의를 위해 admin 권한을 받는다.
  const role: MemberRole = accounts.length === 0 ? "admin" : "member";
  const account: MemberAccount = {
    id: randomHex(12),
    email,
    displayName,
    role,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  writeAccounts([...accounts, account]);
  const session = toSession(account);
  saveSession(session);
  return { ok: true, session };
}

export async function logIn(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const account = readAccounts().find((item) => item.email === email);
  if (!account) {
    return { ok: false, error: "가입된 계정을 찾을 수 없습니다." };
  }
  const passwordHash = await hashPassword(input.password, account.salt);
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: "비밀번호가 일치하지 않습니다." };
  }
  const session = toSession(account);
  saveSession(session);
  return { ok: true, session };
}

export function logOut() {
  saveSession(null);
}

/** 회원 탈퇴 — 계정과 세션을 영구 삭제한다. */
export function withdraw(memberId: string) {
  const accounts = readAccounts().filter((account) => account.id !== memberId);
  writeAccounts(accounts);
  saveSession(null);
}

/** 어드민용 — 가입 회원 목록(비밀번호 제외). */
export function listMembers(): Array<Omit<MemberAccount, "salt" | "passwordHash">> {
  return readAccounts().map(({ salt: _salt, passwordHash: _passwordHash, ...rest }) => rest);
}

export function getMemberCount() {
  return readAccounts().length;
}

/** 어드민용 — 회원 강제 삭제. */
export function removeMember(memberId: string) {
  writeAccounts(readAccounts().filter((account) => account.id !== memberId));
}
