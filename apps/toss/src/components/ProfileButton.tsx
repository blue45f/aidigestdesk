import { getProfile } from '@aidigestdesk/content/shared';

import { navigate } from '../router';
import { theme } from '../theme';

/**
 * 탭 페이지 공용 계정 진입 칩 — 웹 헤더의 계정 버튼 대응.
 * TDS Top 헤더 우측에 겹쳐 배치(absolute)해 모든 1차 화면에서 내 정보(/profile)로
 * 갈 수 있게 한다. 라우팅이 key=path 리마운트라 getProfile()은 항상 최신 스냅샷.
 */
export function ProfileButton() {
  const { avatar, nickname } = getProfile();
  return (
    <button type="button" onClick={() => navigate('/profile')} className="pressable"
      aria-label={`내 정보 — ${nickname}`}
      style={{ position: 'absolute', top: 18, right: 16, zIndex: 15, width: 40, height: 40,
        borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 20, cursor: 'pointer',
        background: theme.accentSoft, border: `1px solid ${theme.border}` }}>
      <span aria-hidden>{avatar}</span>
    </button>
  );
}
