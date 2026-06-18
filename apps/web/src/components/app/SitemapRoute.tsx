import { Home } from "lucide-react";

type SitemapTarget = "portal" | "resources" | "admin";

const sitemapLinks: Array<{
  id: string;
  route: SitemapTarget;
  title: string;
  description: string;
  links: Array<{ href: string; label: string; note: string }>;
}> = [
  {
    id: "portal",
    route: "portal",
    title: "포털 메인",
    description:
      "브리핑, 웹진, 이벤트, 모델 비교, 벤치마크, 사용법, 강좌/도서 등 공개 핵심 화면입니다.",
    links: [
      {
        href: "#updates",
        label: "오늘의 브리핑",
        note: "최신 업데이트 + 핵심 영향",
      },
      {
        href: "#webzine",
        label: "AI 뉴스와 커뮤니티",
        note: "뉴스·이벤트·강좌형 콘텐츠",
      },
      {
        href: "#events",
        label: "이벤트와 프로모션",
        note: "크레딧/할인/초대 신호",
      },
      {
        href: "#comparison",
        label: "모델 비교",
        note: "제공사별 모델 카드",
      },
      {
        href: "#benchmarks",
        label: "벤치마크",
        note: "분야별 점수와 속도",
      },
      {
        href: "#learning",
        label: "강좌/도서",
        note: "언어/형식/난이도/태그 필터",
      },
      {
        href: "#ops",
        label: "편집실",
        note: "운영 모니터링/파이프라인",
      },
      {
        href: "#event-costs",
        label: "이벤트 비용 비교",
        note: "2배 크레딧/할인 시나리오",
      },
    ],
  },
  {
    id: "resources",
    route: "resources",
    title: "AI 바이브 코딩 자료실",
    description:
      "작업 추천, AI 도구, 바이브 코딩 명령어, 벤치마크를 세분화해 탐색하는 전용 라우트입니다.",
    links: [
      {
        href: "#task-recommendations",
        label: "작업 추천",
        note: "코딩, PPT, 비용, 보안 등",
      },
      {
        href: "#ai-tools",
        label: "AI 코딩 도구",
        note: "도구 유형/가격 혜택별",
      },
      {
        href: "#vibe-coding",
        label: "바이브 코딩 명령어",
        note: "CLI/API/IDE 실행형 비교",
      },
      {
        href: "#learning",
        label: "강좌/커뮤니티",
        note: "유튜브, 블로그, 도서, 원격교육",
      },
      {
        href: "#sources",
        label: "자료 출처",
        note: "공식, 벤치마크, 커뮤니티",
      },
    ],
  },
  {
    id: "admin",
    route: "admin",
    title: "관리자 콘솔",
    description:
      "로그인 후 접근하는 운영 페이지입니다. 공개 페이지와 분리된 콘텐츠 관리 공간입니다.",
    links: [
      {
        href: "#admin-overview",
        label: "콘솔 개요",
        note: "로그인 계정과 감사 상태",
      },
      {
        href: "#ops",
        label: "운영 편집실",
        note: "모니터링 큐, 파이프라인, 백로그",
      },
      {
        href: "#exports",
        label: "내보내기",
        note: "뉴스레터, CSV, JSON, Runbook",
      },
      {
        href: "#sources",
        label: "출처",
        note: "출처 성격/발행처 기반 검수",
      },
    ],
  },
];

export function SitemapRoute({
  onNavigate,
}: {
  onNavigate: (route: SitemapTarget) => void;
}) {
  const jumpTo = (route: SitemapTarget, href?: string) => {
    onNavigate(route);
    if (!href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setTimeout(() => {
      const targetId = href.startsWith("#") ? href.slice(1) : href;
      const node = document.getElementById(targetId);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="px-4 py-5 outline-none lg:px-6"
    >
      <div className="mx-auto max-w-[96rem] space-y-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-accent">사이트맵 라우트</p>
              <h1 className="mt-1 text-2xl font-semibold text-text">
                AI Digest Desk 전체 지도
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
                포털, 자료실, 관리자 콘솔을 페이지 단위와 섹션 단위로 분리해
                빠르게 이동할 수 있게 구성했습니다.
              </p>
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-muted transition hover:text-text"
            >
              <Home className="size-3.5" aria-hidden />
              포털 열기
            </a>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-3">
          {sitemapLinks.map((section) => (
            <article
              key={section.id}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h2 className="text-sm font-semibold text-text">{section.title}</h2>
              <p className="mt-2 text-xs leading-5 text-text-muted">
                {section.description}
              </p>
              <div className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => jumpTo(section.route, link.href)}
                    className="w-full rounded-md border border-border bg-bg p-3 text-left transition hover:border-border-strong"
                  >
                    <p className="text-sm font-semibold text-text">
                      {link.label}
                    </p>
                    <p className="mt-1 text-xs text-text-subtle">{link.note}</p>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
