# @aidigestdesk/api

AIDigestDesk 자체 호스팅 회원/계정 백엔드. 형제 앱 `picky` API 를 본떠 만든 NestJS 11 + Drizzle(PostgreSQL) 서버로, 계정 · JWT · 서버 동기화 프로필(닉네임/아바타) · 앱인토스 로그인 두 경로를 제공한다.

웹(`@aidigestdesk/web`) · 토스(`@aidigestdesk/toss`) 프론트와 분리된 독립 앱이며, 두 앱을 빌드/배포에서 건드리지 않는다.

## 실행

```bash
# 개발(워치)
pnpm --filter @aidigestdesk/api dev

# 빌드 → dist/
pnpm --filter @aidigestdesk/api build

# 프로덕션 실행
pnpm --filter @aidigestdesk/api start

# 타입 체크
pnpm --filter @aidigestdesk/api typecheck
```

기본 포트는 `4350`, 모든 라우트는 전역 프리픽스 `/api` 아래에 있다.

- 로컬: `DATABASE_URL` 이 없으면 JSON 파일 폴백으로 DB 없이도 그대로 뜬다(`AIDIGEST_DB_PATH` 또는 `./.data/db.json`).
- 프로덕션: `DATABASE_URL`(PostgreSQL/Neon)을 주입하면 부팅 시 `users` 테이블과 `email <> ''` 부분 유니크 인덱스를 멱등하게 보장한다.

## 환경변수

| 변수                                                         | 필수              | 설명                                                                                               |
| ------------------------------------------------------------ | ----------------- | -------------------------------------------------------------------------------------------------- |
| `PORT`                                                       | 아니오            | 리슨 포트(기본 `4350`).                                                                            |
| `DATABASE_URL`                                               | 프로덕션 권장     | PostgreSQL 연결 문자열. 미설정 시 JSON 파일 폴백. 비로컬 호스트는 SSL(`rejectUnauthorized:false`). |
| `AIDIGEST_DB_PATH`                                           | 아니오            | JSON 폴백 DB 파일 경로(기본 `./.data/db.json`). `DATABASE_URL` 설정 시 무시.                       |
| `JWT_SECRET`                                                 | 프로덕션 **필수** | JWT 서명/검증 시크릿. 미설정 시 로컬 개발용 폴백만 사용(프로덕션에서 반드시 강한 랜덤 값 주입).    |
| `ADMIN_EMAILS`                                               | 아니오            | 운영자 이메일(콤마 구분). 미설정 시 기본 `blue45f@gmail.com`. `isAdmin` 판정에 사용.               |
| `APPS_IN_TOSS_MTLS_CERT` / `APPS_IN_TOSS_MTLS_KEY`           | 토스 로그인 시    | mTLS 인증서/키 PEM **본문**(`\n` 리터럴은 개행으로 변환됨).                                        |
| `APPS_IN_TOSS_MTLS_CERT_PATH` / `APPS_IN_TOSS_MTLS_KEY_PATH` | 토스 로그인 시    | mTLS 인증서/키 **파일 경로**(PEM 본문 env 미설정 시 폴백).                                         |

mTLS 인증서가 없으면 `POST /api/auth/toss/login` 은 `503` 으로 안내하며, 승인 전에는 `POST /api/auth/toss`(getAnonymousKey 식별 로그인)를 쓰면 된다.

## 엔드포인트

모든 경로 앞에 `/api` 프리픽스가 붙는다.

| 메서드 | 경로                   | 인증   | 바디                                      | 응답                    |
| ------ | ---------------------- | ------ | ----------------------------------------- | ----------------------- |
| GET    | `/api/health`          | -      | -                                         | `{ ok, service, ts }`   |
| POST   | `/api/auth/register`   | -      | `{ email, password(≥6), nickname(2~20) }` | `{ accessToken, user }` |
| POST   | `/api/auth/login`      | -      | `{ email, password }`                     | `{ accessToken, user }` |
| POST   | `/api/auth/guest`      | -      | `{ nickname(2~20) }`                      | `{ accessToken, user }` |
| POST   | `/api/auth/toss`       | -      | `{ anonymousKey(8~256), nickname? }`      | `{ accessToken, user }` |
| POST   | `/api/auth/toss/login` | -      | `{ authorizationCode, referrer? }`        | `{ accessToken, user }` |
| GET    | `/api/auth/me`         | Bearer | -                                         | `user`(최신 프로필)     |
| PUT    | `/api/auth/profile`    | Bearer | `{ nickname?, avatar? }`                  | `user`(갱신된 프로필)   |

### 인증/계정 동작

- **비밀번호 해시**: PBKDF2-SHA512, 1000 iters, 64 bytes(hex) + 16 bytes 랜덤 salt. 로그인 비교는 `crypto.timingSafeEqual`(상수 시간).
- **JWT**: `{ sub, email, nickname, isGuest }`, 만료 7일(`JWT_SECRET` 서명). 가드는 서명/만료 검증 **+ DB 존재 재확인**(탈퇴/삭제 계정 토큰 차단). `OptionalAuthGuard` 는 유효하면 `req.user` 세팅, 아니면 익명으로 통과.
- **게스트**: id `guest-<uuid>`, `isGuest: true`.
- **토스 식별 로그인(`/auth/toss`)**: `toss-<sha256(anonymousKey)[:32]>` 결정적 id 로 멱등 get-or-create. 서버 mTLS·동의 불필요(앱 승인 전에도 동작).
- **토스 로그인(`/auth/toss/login`)**: 인가 코드 → 서버 mTLS 토큰 교환(`apps-in-toss-api.toss.im`) → `userKey` → id `toss-user-<userKey>`.
- **프로필 동기화(`/auth/profile`)**: 서버에 닉네임/아바타를 저장. `email`(빈 문자열 제외)만 부분 유니크라 익명/게스트/토스 계정은 다중 공존 가능.

### `UserProfile` 응답 형태

```jsonc
{
  "id": "string",
  "email": "string", // 익명/게스트/토스는 ""
  "nickname": "string",
  "avatar": "string", // URL 또는 data URI, 미설정 시 ""
  "createdAt": "ISO-8601",
  "isGuest": false,
  "isAdmin": false, // ADMIN_EMAILS 매칭 시 true
}
```

비밀 필드(`passwordHash`, `salt`)는 응답에 절대 포함되지 않는다.

## 데이터베이스

`src/db/schema.ts` 의 Drizzle `users` 테이블. 런타임 보장은 `DatabaseService.onModuleInit` 의 멱등 raw SQL(테이블 생성 · `avatar` 비파괴 ALTER · 레거시 `email` UNIQUE 제거 · `email <> ''` 부분 유니크 인덱스)이 담당한다.

선택적 마이그레이션 도구:

```bash
pnpm --filter @aidigestdesk/api db:generate   # drizzle-kit generate
pnpm --filter @aidigestdesk/api db:push       # drizzle-kit push
```
