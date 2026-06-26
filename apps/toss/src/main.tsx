import { configureCommunityRemote } from '@aidigestdesk/content/shared';
import { PlatformContext } from '@heejun/platform-bridge';
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import config from '../apps-in-toss.config.ts';

import { App } from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { tossPlatformBridge } from './platform/tossBridge.ts';
import './index.css';

// 커뮤니티(채팅·게시판·댓글)를 desk-platform 실 DB와 동기화 — 웹과 같은 appId 라 기기·플랫폼 공유.
configureCommunityRemote({
  baseUrl: import.meta.env.VITE_DESK_PLATFORM_URL ?? 'https://desk-platform.vercel.app',
  appId: 'aidigestdesk',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TDSMobileAITProvider brandPrimaryColor={config.brand.primaryColor}>
      <PlatformContext.Provider value={tossPlatformBridge}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </PlatformContext.Provider>
    </TDSMobileAITProvider>
  </StrictMode>,
);
