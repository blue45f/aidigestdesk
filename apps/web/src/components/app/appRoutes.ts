export type AppRoute = "portal" | "resources" | "admin" | "sitemap";

export const routePath: Record<
  AppRoute,
  "/resources" | "/admin" | "/sitemap" | "/"
> = {
  portal: "/",
  resources: "/resources",
  admin: "/admin",
  sitemap: "/sitemap",
};

export const routeTitles: Record<AppRoute, string> = {
  portal: "포털 대시보드",
  resources: "AI 바이브 코딩 자료실",
  admin: "관리자 콘솔",
  sitemap: "사이트맵",
};

export function getCurrentRoute(): AppRoute {
  if (typeof window === "undefined") return "portal";
  if (window.location.pathname.startsWith("/resources")) return "resources";
  if (window.location.pathname.startsWith("/admin")) return "admin";
  if (window.location.pathname.startsWith("/sitemap")) return "sitemap";
  return "portal";
}
