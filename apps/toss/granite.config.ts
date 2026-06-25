import { defineConfig } from '@apps-in-toss/web-framework/config';

// AI 소식·도구 큐레이션 다이제스트. 비게임=partner.
export default defineConfig({
  appName: 'aidigestdesk',
  brand: { displayName: 'AI다이제스트', primaryColor: '#6EA8FE', icon: '' },
  web: { host: 'localhost', port: 5183, commands: { dev: 'vite', build: 'vite build' } },
  permissions: [
    { name: 'clipboard', access: 'read' },
    { name: 'clipboard', access: 'write' },
  ],
  outdir: 'dist',
  webViewProps: { type: 'partner' },
  // 비게임 내비게이션 바 테마(2026-06-22 패키지 업데이트) — 앱이 다크(theme.bg #0a0f1a)라
  // 네이티브 내비게이션 바도 dark 로 맞춰 상단 영역 이질감을 없앤다.
  navigationBar: { withBackButton: true, withHomeButton: true, theme: 'dark' },
});
