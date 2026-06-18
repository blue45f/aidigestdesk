// AIDigestDesk 서비스 워커 — 최소 오프라인 셸 캐시(설치 가능 PWA).
// 정적 SPA이므로 네트워크 우선 + 셸 폴백 전략으로 단순하게 둔다.
// 캐시 버전을 올리면 이전 캐시는 activate에서 정리된다.

const CACHE = "aidigestdesk-shell-v1";
const SHELL = ["/", "/index.html", "/favicon.svg", "/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // 내비게이션 요청: 네트워크 우선, 실패 시 캐시된 셸로 폴백(SPA 라우팅 유지).
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() => caches.match("/index.html").then((cached) => cached ?? Response.error())),
    );
    return;
  }

  // 정적 자산: 캐시 우선, 없으면 네트워크 후 캐시.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
