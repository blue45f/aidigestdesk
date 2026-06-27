/**
 * JWT 서명/검증 시크릿.
 * 공개 레포에 시크릿을 하드코딩하면 누구나 토큰을 위조해 가드(AuthGuard)를 우회할 수 있다.
 * 프로덕션은 반드시 `JWT_SECRET` 환경변수로 강한 랜덤 값을 주입한다. 미설정 시 로컬 개발용 폴백만 사용.
 */
export const JWT_SECRET = process.env.JWT_SECRET?.trim() || 'aidigest-dev-secret-change-me'
