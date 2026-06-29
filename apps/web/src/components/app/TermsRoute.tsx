import { CloudCheck, FileText, Home, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { AppRoute } from '@/components/app/appRoutes'
import type { PublicPolicy } from '@heejun/deskcloud'
import type { ReactNode } from 'react'

import { Chip, SegmentBar } from '@/components/app/CommonUi'
import { getTermsClient } from '@/components/app/deskcloud'

const EFFECTIVE_DATE = '2026-06-29'

type DocumentId = 'terms' | 'privacy'

const documentTabs: Array<{ id: DocumentId; label: string }> = [
  { id: 'terms', label: '이용약관' },
  { id: 'privacy', label: '개인정보처리방침' },
]

/**
 * 문서 토글 ID → TermsDesk 정책 slug. 'terms'/'privacy'는 TermsDesk의 관례적 slug이며,
 * 이 매핑으로 활성 문서에 해당하는 게시본을 조회한다.
 */
const TERMS_DESK_SLUGS: Record<DocumentId, string> = {
  terms: 'terms',
  privacy: 'privacy',
}

const documentTitles: Record<DocumentId, string> = {
  terms: '이용약관',
  privacy: '개인정보처리방침',
}

/** 약관·방침에서 중요한 적용 범위를 강조하는 콜아웃 박스. */
function PolicyNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="rounded-md border border-accent-3/30 bg-accent-3/10 p-4 text-sm leading-6 text-accent-3-text"
    >
      {children}
    </div>
  )
}

/** 약관/방침 본문의 조(條) 단위 블록. 번호와 제목, 본문을 함께 묶는다. */
function Article({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold text-text">
        제{number}조 ({title})
      </h3>
      <div className="space-y-2 text-sm leading-7 text-text-muted">{children}</div>
    </section>
  )
}

function TermsDocument({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-6">
      <header className="space-y-2 border-b border-border pb-5">
        <h2 className="text-xl font-semibold text-text">이용약관</h2>
        <p className="text-sm leading-7 text-text-muted">
          본 약관은 AIDigestDesk(이하 &ldquo;서비스&rdquo;)의 이용 조건과 절차, 이용자와 운영자의
          권리·의무 및 책임 사항을 규정합니다.
        </p>
      </header>

      <PolicyNotice>
        본 약관은 시행일부터 AIDigestDesk 웹 서비스와 토스 미니앱에 적용됩니다. 서비스를 이용하면 본
        약관과 개인정보처리방침에 동의한 것으로 봅니다. 회원가입 또는 토스 로그인 과정에서 별도
        동의가 필요한 항목은 해당 화면에서 구분해 안내합니다.
      </PolicyNotice>

      <div className="mt-6 space-y-7">
        <Article number={1} title="목적">
          <p>
            이 약관은 서비스가 제공하는 AI/LLM 업데이트·벤치마크·기능 비교·학습 자료 큐레이션의
            이용과 관련하여 운영자와 이용자 간의 권리, 의무 및 책임 사항을 정하는 것을 목적으로
            합니다.
          </p>
        </Article>

        <Article number={2} title="정의">
          <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              &ldquo;서비스&rdquo;란 운영자가 제공하는 AIDigestDesk 포털과 그에 포함된 모든
              기능·콘텐츠를 말합니다.
            </li>
            <li>
              &ldquo;이용자&rdquo;란 본 약관에 동의하고 서비스를 이용하는 모든 방문자 및 회원을
              말합니다.
            </li>
            <li>
              &ldquo;콘텐츠&rdquo;란 서비스가 큐레이션·게시하는 텍스트, 표, 링크, 요약, 벤치마크
              수치 등 일체의 자료를 말합니다.
            </li>
          </ul>
        </Article>

        <Article number={3} title="약관의 효력 및 변경">
          <p>
            이 약관은 서비스 화면에 게시함으로써 효력이 발생합니다. 운영자는 관련 법령을 위반하지
            않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용 일자와 변경 사유를 명시하여 사전에
            공지합니다. 이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.
          </p>
        </Article>

        <Article number={4} title="서비스의 제공 및 변경">
          <p>
            운영자는 서비스의 내용을 큐레이션 정책에 따라 추가·수정·삭제할 수 있습니다. 서비스는
            원칙적으로 무료로 제공되며, 유료 기능을 도입하는 경우 가격·결제·환불 조건을 결제 전에
            별도로 고지합니다. 점검, 장애, 정책 변경 등으로 제공 내용이 변경되거나 일시 중단될 수
            있으며 중요한 변경은 서비스 화면을 통해 사전에 안내합니다.
          </p>
        </Article>

        <Article number={5} title="이용자의 의무">
          <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>서비스의 정상적인 운영을 방해하거나 자동화된 수단으로 과도하게 수집하는 행위</li>
            <li>타인의 권리를 침해하거나 관련 법령을 위반하는 행위</li>
            <li>타인의 계정이나 식별정보를 도용하거나 허위 정보를 입력하는 행위</li>
            <li>서비스가 제공하는 정보를 출처 표기 없이 상업적으로 무단 재배포하는 행위</li>
          </ul>
        </Article>

        <Article number={6} title="콘텐츠의 출처와 정확성">
          <p>
            서비스의 모든 콘텐츠는 특정 시점의 스냅샷을 기준으로 큐레이션되며, 각 항목에는 가능한 한
            출처 링크를 제공합니다. 제품 사양은 공식 문서를 우선하고, 외부 벤치마크 수치는 별도의
            평가 결과로 구분하여 표시합니다.
          </p>
          <p>
            AI/LLM 분야는 변화가 빠르므로 게시된 수치·기능·가격은 실제와 다를 수 있습니다. 이용자는
            중요한 의사결정 전 반드시 원문(공식 문서·외부 출처)을 직접 확인해야 하며, 운영자는
            콘텐츠의 부정확성·지연으로 발생한 손해에 대해 책임을 지지 않습니다.
          </p>
        </Article>

        <Article number={7} title="지식재산권">
          <p>
            서비스가 직접 작성한 한국어 요약·편집물에 대한 권리는 운영자에게 있습니다. 외부 출처에서
            인용한 자료의 권리는 각 권리자에게 귀속되며, 서비스는 출처를 표기하고 원문을 장문으로
            복제하지 않습니다.
          </p>
        </Article>

        <Article number={8} title="면책조항">
          <p>
            서비스는 정보 제공을 목적으로 하며, 특정 모델·도구의 구매나 투자, 도입 전에 이용자가
            원문과 최신 조건을 직접 확인해야 합니다. 운영자는 고의 또는 중대한 과실이 없는 한 외부
            출처의 변경, 이용자 귀책사유, 불가항력으로 발생한 손해에 대해 책임을 지지 않으며, 관련
            법령상 배제할 수 없는 책임은 본 조항으로 제한되지 않습니다.
          </p>
        </Article>

        <Article number={9} title="준거법 및 분쟁해결">
          <p>
            이 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련하여 분쟁이 발생할 경우
            운영자와 이용자는 우선 상호 협의하여 해결하도록 노력합니다. 협의로 해결되지 않는 분쟁은
            민사소송법 등 관계 법령에 따른 관할 법원에서 해결합니다.
          </p>
        </Article>

        <Article number={10} title="문의">
          <p>
            약관을 비롯한 모든 문의는 포털 내{' '}
            <button
              type="button"
              onClick={() => onNavigate('support')}
              className="inline-flex min-h-9 items-center rounded-md px-1 font-semibold text-accent-text underline-offset-2 hover:underline"
            >
              문의 페이지
            </button>
            를 통해 접수합니다. 운영 주체는 <strong>AIDigestDesk 운영팀</strong>이며, 접수된 문의의
            제목·내용·이름은 공개 문의 게시판에 표시될 수 있으므로 비밀번호, 인증 토큰, 주민등록번호
            등 민감한 정보를 작성하지 마세요. 회신용 이메일은 공개하지 않습니다.
          </p>
        </Article>
      </div>
    </article>
  )
}

function PrivacyDocument({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-6">
      <header className="space-y-2 border-b border-border pb-5">
        <h2 className="text-xl font-semibold text-text">개인정보처리방침</h2>
        <p className="text-sm leading-7 text-text-muted">
          AIDigestDesk의 웹·토스 미니앱에서 처리하는 정보의 항목과 이용 방식을 안내합니다.
        </p>
      </header>

      <PolicyNotice>
        배포 환경에 따라 웹은 Firebase Auth 또는 AuthDesk 인증을 사용하고, 토스 미니앱은 익명
        식별키를 기본으로 사용하며 이용자가 선택한 경우 토스 로그인 식별자를 연결합니다. 비밀번호와
        토스의 이름·전화번호는 AIDigestDesk 서버에 저장하지 않습니다.
      </PolicyNotice>

      <div className="mt-6 space-y-7">
        <Article number={1} title="수집하는 개인정보 항목">
          <p>
            <strong>(가) 회원 인증 및 프로필</strong> — 웹 회원가입 시 이메일 주소, 닉네임, 인증
            서비스가 발급한 사용자 식별자와 로그인 메타데이터를 처리합니다. 로컬 폴백 환경에서는
            해당 정보가 브라우저에만 저장될 수 있습니다.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>웹: 이메일 주소, 닉네임, 인증 서비스 사용자 식별자</li>
            <li>인증 보안: 접속 IP, 사용자 에이전트, 로그인 시각과 오류 기록</li>
            <li>토스 미니앱: 익명 식별키의 단방향 해시 기반 식별자</li>
            <li>토스 로그인 선택 시: 해당 앱 전용 userKey와 사용자가 설정한 닉네임·아바타</li>
          </ul>
          <p className="mt-3">
            <strong>(나) 기기 저장 정보</strong> — 로그인 토큰, 다크 모드, 필터·북마크 등 화면
            설정이 브라우저 또는 앱 WebView 저장소에 보관될 수 있습니다.
          </p>
          <p className="mt-3">
            <strong>(다) 문의 시 서버로 전송되는 정보</strong> — 문의하기 이용 시 다음 항목이 운영
            서버(desk-platform)로 전송·저장됩니다. 이메일을 제외한 제목·내용·이름은 공개 문의
            게시판에 표시될 수 있습니다.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>문의 제목·내용</li>
            <li>이름(닉네임)</li>
            <li>회신용 이메일 주소 (공개되지 않음)</li>
            <li>접속 URL (어느 화면에서 문의했는지 파악용)</li>
          </ul>
        </Article>

        <Article number={2} title="개인정보의 수집 목적">
          <p>
            회원 식별과 로그인 상태 유지, 기기 변경 시 계정 연결, 닉네임·아바타 등 화면 개인화, 문의
            접수·회신과 서비스 보안 운영을 위해 처리합니다. 별도 동의 없이 개인정보를 광고 판매
            목적으로 제공하지 않습니다.
          </p>
        </Article>

        <Article number={3} title="보유 및 이용기간">
          <ul className="list-disc space-y-1 pl-5">
            <li>웹·서버 회원 정보: 회원 탈퇴 또는 계정 삭제 완료 시까지</li>
            <li>토스 로그인 정보: 연결 해제, 약관 철회 또는 토스 탈퇴 콜백 처리 시까지</li>
            <li>기기 저장 정보: 로그아웃 또는 앱·브라우저 저장소 삭제 시까지</li>
            <li>문의 정보: 문의 접수일부터 3년 또는 이용자의 삭제 요청 처리 시까지</li>
            <li>Firebase 인증 IP 기록: 수 주, 그 밖의 인증 정보: 계정 삭제 요청 시까지</li>
          </ul>
          <p>
            계정 삭제 후 Firebase의 활성·백업 시스템에서 관련 인증 정보가 완전히 제거되기까지 최대
            180일이 걸릴 수 있습니다. 관계 법령이 별도 보관을 요구하면 해당 정보만 법정 기간 동안
            분리해 보관합니다.
          </p>
        </Article>

        <Article number={4} title="제3자 제공 및 처리 위탁">
          <p>
            서비스는 개인정보를 판매하지 않으며 법령상 근거 또는 이용자 동의 없이 제3자에게 제공하지
            않습니다. 서비스 제공을 위해 다음 업무를 위탁할 수 있고, 각 수탁자에는 필요한 최소
            정보만 전달합니다.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Google LLC(Firebase Authentication): 웹 회원 인증과 계정 보안</li>
            <li>AuthDesk: 환경 설정에 따른 웹 회원 인증과 서버 세션 관리</li>
            <li>비바리퍼블리카: 토스 미니앱 식별키·토스 로그인 제공</li>
            <li>Vercel·Neon 및 서비스 API 인프라: 웹·API 제공과 회원 프로필 저장</li>
            <li>desk-platform: 문의 접수, 공개 문의 게시판과 처리 상태 관리</li>
          </ul>
        </Article>

        <Article number={5} title="쿠키 및 로컬스토리지 사용">
          <p>
            서비스는 로그인 상태와 화면 설정을 유지하기 위해 브라우저 localStorage, IndexedDB 또는
            앱 WebView 저장소를 사용할 수 있습니다. 이용자는 로그아웃하거나 브라우저·앱 설정에서
            저장된 데이터를 삭제할 수 있습니다.
          </p>
        </Article>

        <Article number={6} title="이용자의 권리">
          <p>
            이용자는 계정 화면에서 본인의 프로필을 조회·수정하고 로그아웃 또는 회원 탈퇴를 요청할 수
            있습니다. AuthDesk 계정처럼 본인 확인이 필요한 삭제 요청은 문의 페이지에서 접수합니다.
            토스 앱에서 로그인 연결이나 약관 동의를 철회하면 해당 콜백을 통해 연결 계정을
            삭제합니다.
          </p>
        </Article>

        <Article number={7} title="개인정보 보호 책임">
          <p>
            인증 토큰은 전송 구간 암호화를 사용하고, 비밀번호는 인증 제공자가 처리하며 서비스 응답에
            비밀번호 해시나 mTLS 개인키를 포함하지 않습니다. 토스 로그인에서는 앱 전용 userKey만
            계정 연결에 사용하고 암호화된 이름·전화번호 등 추가 개인정보는 요청·저장하지 않습니다.
            공용 기기에서는 이용 후 로그아웃을 권장합니다.
          </p>
        </Article>

        <Article number={8} title="개인정보의 국외 이전">
          <p>
            웹에서 Firebase Authentication을 이용하면 인증 정보가 다음과 같이 국외에서 처리됩니다.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>이전받는 자: Google LLC</li>
            <li>이전 국가: 미국</li>
            <li>이전 항목: 이메일, 비밀번호, 사용자 식별자, 닉네임, IP, 사용자 에이전트</li>
            <li>목적: 회원가입·로그인·계정 관리, 부정 이용 방지와 인증 보안</li>
            <li>시점·방법: 회원가입 또는 로그인 시 암호화된 네트워크를 통한 전송</li>
            <li>보유기간: 제3조의 Firebase 인증 정보 보유기간과 동일</li>
          </ul>
          <p>
            국외 이전을 원하지 않으면 웹 회원가입·로그인을 이용하지 않고 공개 콘텐츠를 열람할 수
            있습니다. 이미 가입한 이용자는 회원 탈퇴로 이전된 인증 정보의 삭제를 요청할 수 있습니다.
          </p>
        </Article>

        <Article number={9} title="보호책임자 및 권리구제">
          <p>
            개인정보 보호책임자는 <strong>AIDigestDesk 운영팀</strong>입니다.
            열람·정정·삭제·처리정지, 동의 철회와 개인정보 관련 문의는{' '}
            <button
              type="button"
              onClick={() => onNavigate('support')}
              className="inline-flex min-h-9 items-center rounded-md px-1 font-semibold text-accent-text underline-offset-2 hover:underline"
            >
              문의 페이지
            </button>
            에서 접수할 수 있으며, 본인 확인 후 지체 없이 처리합니다.
          </p>
          <p>
            개인정보 침해에 대한 상담·신고는 한국인터넷진흥원 개인정보침해 신고센터(국번 없이 118),
            분쟁조정은 개인정보분쟁조정위원회(1833-6972)를 이용할 수 있습니다.
          </p>
        </Article>

        <Article number={10} title="처리방침의 변경 고지">
          <p>
            본 처리방침이 변경될 경우 적용 일자와 변경 내용을 서비스 화면에 게시하여 안내합니다.
            중요한 변경 사항은 시행 전 충분한 기간을 두고 공지합니다.
          </p>
        </Article>

        <Article number={11} title="시행일">
          <p>본 개인정보처리방침은 {EFFECTIVE_DATE}부터 적용됩니다.</p>
        </Article>
      </div>
    </article>
  )
}

/** 정적 폴백 문서. 원격 클라이언트가 없거나 조회에 실패하면 이 본문을 그대로 보여준다. */
function StaticDocument({
  document,
  onNavigate,
}: {
  document: DocumentId
  onNavigate: (route: AppRoute) => void
}) {
  return document === 'terms' ? (
    <TermsDocument onNavigate={onNavigate} />
  ) : (
    <PrivacyDocument onNavigate={onNavigate} />
  )
}

/**
 * TermsDesk(DeskCloud) 게시본을 불러와 렌더한다.
 * - 클라이언트가 null(미설정)이면 즉시 정적 폴백을 보여준다.
 * - 활성 문서가 바뀔 때마다 AbortController로 이전 요청을 취소하고 다시 조회한다.
 * - 조회 실패 시에도 정적 폴백으로 폴백하여 회귀가 없도록 한다.
 * - 본문(body)은 플레인 텍스트로 취급해 whitespace-pre-wrap으로 렌더한다(XSS 방지).
 */
function RemoteTermsDocument({
  document,
  onNavigate,
}: {
  document: DocumentId
  onNavigate: (route: AppRoute) => void
}) {
  const [policy, setPolicy] = useState<PublicPolicy | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const client = getTermsClient()
    if (!client) return
    // 동기 setState 금지(react-hooks/set-state-in-effect): 상태 변경은 비동기
    // 콜백에서만 한다. 문서 전환 시 초기 상태는 호출부 key 리마운트로 리셋된다.
    const controller = new AbortController()
    client
      .getCurrent({ slug: TERMS_DESK_SLUGS[document], signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setPolicy(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFailed(true)
          setLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [document])

  if (loading) {
    return (
      <article className="rounded-lg border border-border bg-surface p-6">
        <p className="text-sm leading-7 text-text-muted">게시본을 불러오는 중…</p>
      </article>
    )
  }

  // 미설정 또는 조회 실패 → 기존 정적 본문(회귀 없음).
  if (failed || !policy) {
    return <StaticDocument document={document} onNavigate={onNavigate} />
  }

  return (
    <article className="rounded-lg border border-border bg-surface p-6">
      <header className="space-y-3 border-b border-border pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="blue" icon={CloudCheck}>
            TermsDesk 게시본 · {policy.versionLabel}
            {policy.effectiveAt ? ` · 시행 ${policy.effectiveAt}` : ''}
          </Chip>
        </div>
        <h2 className="text-xl font-semibold text-text">
          {policy.name || documentTitles[document]}
        </h2>
        {policy.changeSummary ? (
          <p className="text-sm leading-7 text-text-muted">{policy.changeSummary}</p>
        ) : null}
      </header>

      <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-text-muted">
        {policy.body}
      </div>
    </article>
  )
}

export function TermsRoute({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  const [activeDocument, setActiveDocument] = useState<DocumentId>('terms')
  // env로 게이트: TermsDesk가 설정되면 게시본을, 미설정이면 정적 운영 본문을 렌더한다.
  const remoteEnabled = getTermsClient() !== null

  return (
    <main id="main-content" tabIndex={-1} className="px-4 py-5 outline-none lg:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-accent-text">약관·정책 · /terms</p>
              <h1 className="mt-1 text-2xl font-semibold text-text">
                이용약관 및 개인정보처리방침
              </h1>
              <p className="mt-2 text-sm leading-7 text-text-muted">
                AIDigestDesk 웹 서비스와 토스 미니앱에 적용되는 운영 약관과 개인정보 처리
                기준입니다. 시행일과 변경 내용을 확인한 뒤 서비스를 이용해 주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('portal')}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-muted transition hover:text-text"
            >
              <Home className="size-3.5" aria-hidden />
              포털로
            </button>
          </div>

          <div className="mt-5">
            <SegmentBar
              label="문서 선택"
              items={documentTabs}
              value={activeDocument}
              onChange={setActiveDocument}
            />
          </div>
        </section>

        {remoteEnabled ? (
          <RemoteTermsDocument
            key={activeDocument}
            document={activeDocument}
            onNavigate={onNavigate}
          />
        ) : (
          <StaticDocument document={activeDocument} onNavigate={onNavigate} />
        )}

        <p className="flex flex-wrap items-center gap-1.5 border-t border-border pt-5 text-xs text-text-subtle">
          {activeDocument === 'terms' ? (
            <FileText className="size-3.5" aria-hidden />
          ) : (
            <ShieldCheck className="size-3.5" aria-hidden />
          )}
          {activeDocument === 'terms' ? '이용약관' : '개인정보처리방침'} · 시행일 {EFFECTIVE_DATE} ·
          AIDigestDesk 운영 정책
        </p>
      </div>
    </main>
  )
}
