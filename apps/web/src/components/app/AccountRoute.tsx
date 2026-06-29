import { Home, LogIn, LogOut, ShieldCheck, UserPlus, UserRound } from 'lucide-react'
import { useState } from 'react'

import type { AppRoute } from '@/components/app/appRoutes'
import type { MemberSession } from '@/components/app/memberAuth'
import type { FormEvent } from 'react'

import { Chip, SectionHeader } from '@/components/app/CommonUi'
import { getMemberAuthProvider, logIn, signUp, withdraw } from '@/components/app/memberAuth'
import { useAuth } from '@/lib/firebaseAuth'

type AuthTab = 'login' | 'signup'

const inputClass =
  'mt-1.5 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-accent'

function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  minLength?: number
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-text-subtle">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  )
}

function AuthPanel({ onAuthed }: { onAuthed: (session: MemberSession) => void }) {
  const provider = getMemberAuthProvider()
  const firebaseAuth = useAuth()
  const [tab, setTab] = useState<AuthTab>('login')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const passwordMinLength = tab === 'signup' ? 8 : 6

  const reset = () => {
    setError('')
    setPassword('')
    firebaseAuth.clearError()
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    firebaseAuth.clearError()
    setBusy(true)
    try {
      if (provider === 'firebase') {
        if (tab === 'signup') {
          if (displayName.trim().length < 2) {
            setError('닉네임은 2자 이상이어야 합니다.')
            return
          }
          if (password.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.')
            return
          }
          await firebaseAuth.signUp(email, password, displayName)
        } else {
          await firebaseAuth.signIn(email, password)
        }
        return
      }
      const result =
        tab === 'signup'
          ? await signUp({ email, displayName, password })
          : await logIn({ email, password })
      if (result.ok) {
        onAuthed(result.session)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 요청을 처리하지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const signInAsGuest = async () => {
    if (busy) return
    setError('')
    firebaseAuth.clearError()
    setBusy(true)
    try {
      await firebaseAuth.signInAsGuest()
    } catch (err) {
      setError(err instanceof Error ? err.message : '게스트 로그인을 처리하지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const tabButton = (target: AuthTab, label: string, Icon: typeof LogIn) => (
    <button
      type="button"
      onClick={() => {
        setTab(target)
        reset()
      }}
      aria-pressed={tab === target}
      className={
        tab === target
          ? 'inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-ink bg-ink px-3 py-2 text-sm font-semibold text-ink-fg'
          : 'inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text'
      }
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </button>
  )

  return (
    <section className="rounded-lg border border-border bg-surface p-6">
      <div className="flex gap-2">
        {tabButton('login', '로그인', LogIn)}
        {tabButton('signup', '회원가입', UserPlus)}
      </div>
      <form className="mt-5 space-y-4" onSubmit={submit}>
        <Field
          label="이메일"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />
        {tab === 'signup' ? (
          <Field
            label="닉네임"
            value={displayName}
            onChange={setDisplayName}
            placeholder="커뮤니티에서 보일 이름"
            autoComplete="nickname"
            minLength={2}
          />
        ) : null}
        <Field
          label="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder={tab === 'signup' ? '8자 이상' : '비밀번호'}
          autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
          minLength={passwordMinLength}
        />
        {error || firebaseAuth.error ? (
          <p className="rounded-md border border-accent-4/30 bg-accent-4/10 px-3 py-2 text-xs font-semibold text-accent-4-text">
            {error || firebaseAuth.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={
            busy ||
            !email.trim() ||
            password.length < passwordMinLength ||
            (tab === 'signup' && displayName.trim().length < 2)
          }
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-ink bg-ink px-4 text-sm font-semibold text-ink-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {tab === 'signup' ? '가입하고 시작하기' : '로그인'}
        </button>
      </form>
      {provider === 'firebase' ? (
        <>
          <div className="my-3 flex items-center gap-3 text-text-subtle">
            <span className="h-px flex-1 bg-border" aria-hidden />
            <span className="text-xs">또는</span>
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
          <button
            type="button"
            onClick={() => void signInAsGuest()}
            disabled={busy}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-bg px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            게스트로 시작하기
          </button>
        </>
      ) : null}
      <p className="mt-4 text-xs leading-5 text-text-subtle">
        {provider === 'firebase'
          ? '안전한 서버 인증으로 세션이 유지되며, 비밀번호는 이 사이트가 직접 저장하지 않습니다.'
          : provider === 'authdesk'
            ? 'AuthDesk 서버 인증으로 세션을 검증하고 로그아웃 시 서버 세션도 폐기합니다.'
            : '데모 인증입니다. 계정 정보는 이 브라우저(localStorage)에만 저장되며 비밀번호는 해시로 보관됩니다.'}{' '}
        자세한 내용은 약관·정책에서 확인하세요.
      </p>
    </section>
  )
}

function ProfilePanel({
  session,
  onLogout,
  onWithdraw,
  onNavigate,
}: {
  session: MemberSession
  onLogout: () => void
  onWithdraw: () => Promise<void>
  onNavigate: (route: AppRoute) => void
}) {
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const [withdrawPending, setWithdrawPending] = useState(false)
  const [withdrawError, setWithdrawError] = useState('')

  const confirmDelete = async () => {
    if (withdrawPending) return
    setWithdrawError('')
    setWithdrawPending(true)
    try {
      await onWithdraw()
    } catch (err) {
      setWithdrawError(err instanceof Error ? err.message : '회원 탈퇴를 처리하지 못했습니다.')
    } finally {
      setWithdrawPending(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-md bg-ink text-ink-fg">
            <UserRound className="size-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-text">{session.displayName}</h2>
              {session.isGuest ? (
                <Chip tone="blue">게스트</Chip>
              ) : session.role === 'admin' ? (
                <Chip tone="accent" icon={ShieldCheck}>
                  관리자
                </Chip>
              ) : (
                <Chip tone="blue">회원</Chip>
              )}
            </div>
            <p className="truncate text-sm text-text-muted">
              {session.email || '이메일 없이 이용 중'}
            </p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-bg p-3">
            <dt className="text-xs font-semibold text-text-subtle">권한</dt>
            <dd className="mt-1 text-sm font-semibold text-text">
              {session.isGuest
                ? '게스트 회원'
                : session.role === 'admin'
                  ? '관리자 (콘텐츠/회원 관리)'
                  : '일반 회원'}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-bg p-3">
            <dt className="text-xs font-semibold text-text-subtle">로그인 시각</dt>
            <dd className="mt-1 text-sm font-semibold text-text">
              {new Date(session.signedInAt).toLocaleString('ko-KR')}
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate('community')}
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text"
          >
            커뮤니티 가기
          </button>
          {session.role === 'admin' ? (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text"
            >
              <ShieldCheck className="size-4" aria-hidden />
              관리자 콘솔
            </button>
          ) : null}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text"
          >
            <LogOut className="size-4" aria-hidden />
            로그아웃
          </button>
        </div>
      </div>

      {session.provider === 'authdesk' ? (
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-sm font-semibold text-text">계정 삭제</h3>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            서버 계정 삭제는 본인 확인이 필요한 작업입니다. 고객지원에서 삭제를 요청해 주세요.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('support')}
            className="mt-4 inline-flex h-10 items-center rounded-md border border-border bg-bg px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text"
          >
            고객지원으로 이동
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-accent-4/30 bg-accent-4/5 p-6">
          <h3 className="text-sm font-semibold text-text">회원 탈퇴</h3>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            {session.provider === 'firebase'
              ? '탈퇴하면 서버의 로그인 계정이 영구 삭제됩니다. 최근 로그인 확인이 필요할 수 있습니다.'
              : '탈퇴하면 이 브라우저에 저장된 계정 정보가 영구 삭제됩니다.'}{' '}
            되돌릴 수 없습니다.
          </p>
          {withdrawError ? (
            <p role="alert" className="mt-3 text-sm font-semibold text-accent-4-text">
              {withdrawError}
            </p>
          ) : null}
          {confirmWithdraw ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={withdrawPending}
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-accent-4 bg-accent-4 px-4 text-sm font-semibold text-ink-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {withdrawPending ? '삭제 중…' : '영구 삭제 확인'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmWithdraw(false)}
                disabled={withdrawPending}
                className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm font-semibold text-text-muted transition hover:text-text disabled:opacity-60"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmWithdraw(true)}
              className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-md border border-accent-4/40 bg-accent-4/10 px-4 text-sm font-semibold text-accent-4-text transition hover:bg-accent-4/20"
            >
              회원 탈퇴
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export function AccountRoute({
  session,
  loading,
  onAuthed,
  onLogout,
  onWithdraw,
  onNavigate,
}: {
  session: MemberSession | null
  loading: boolean
  onAuthed: (session: MemberSession) => void
  onLogout: () => void
  onWithdraw: () => void
  onNavigate: (route: AppRoute) => void
}) {
  const firebaseAuth = useAuth()

  const handleWithdraw = async () => {
    if (!session) return
    if (session.provider === 'firebase') {
      await firebaseAuth.deleteAccount()
    } else {
      withdraw(session.id)
    }
    onWithdraw()
  }

  return (
    <main id="main-content" tabIndex={-1} className="px-4 py-8 outline-none lg:px-6">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            icon={UserRound}
            title={session ? '내 계정' : '로그인 / 회원가입'}
            description={
              session
                ? '계정 정보와 권한을 확인하고 커뮤니티에 참여하세요.'
                : '회원으로 로그인하면 커뮤니티 토론에 닉네임으로 참여할 수 있습니다.'
            }
          />
          <button
            type="button"
            onClick={() => onNavigate('portal')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-muted transition hover:text-text"
          >
            <Home className="size-3.5" aria-hidden />
            포털로
          </button>
        </div>
        {loading ? (
          <section
            aria-busy="true"
            aria-label="로그인 상태 확인 중"
            className="rounded-lg border border-border bg-surface p-6"
          >
            <div className="h-5 w-32 animate-pulse rounded bg-surface-2" />
            <div className="mt-4 h-10 w-full animate-pulse rounded bg-surface-2" />
          </section>
        ) : session ? (
          <ProfilePanel
            session={session}
            onLogout={onLogout}
            onWithdraw={handleWithdraw}
            onNavigate={onNavigate}
          />
        ) : (
          <AuthPanel onAuthed={onAuthed} />
        )}
      </div>
    </main>
  )
}
