# Hooni Template Front

React 프로젝트를 빠르게 시작하기 위한 인증 화면 기반 프런트엔드 템플릿입니다.

로그인, 회원가입, 인증 라우팅, Axios Gateway, Access Token 갱신, Alert/Confirm 모달과 간단한 Welcome 페이지가 포함되어 있습니다. 프로젝트에 복사한 뒤 API 규격과 서비스 디자인에 맞게 수정해서 사용하세요.

## 기술 구성

- React 19
- React Router 7
- Vite 6
- Axios
- SCSS
- Lucide React
- Nginx 및 Docker 실행 설정

## 요구사항

- Node.js 20 이상
- npm
- 인증 기능을 사용할 경우 API Gateway 또는 Auth API

## 빠른 시작

```bash
npm ci
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

의존성을 추가하거나 버전을 변경해야 할 때는 `npm install`을 사용하고, 기존 `package-lock.json` 그대로 설치할 때는 `npm ci` 사용을 권장합니다.

## 환경 변수

`.env.example`을 복사해 `.env`를 만들고 API Gateway 주소를 설정합니다.

```env
VITE_API_GATEWAY=http://localhost:9090
```

주의할 점:

- `VITE_`로 시작하는 환경 변수는 브라우저 번들에 포함됩니다. 비밀번호, API Secret, JWT 같은 민감정보를 넣으면 안 됩니다.
- 운영 환경에서는 `VITE_API_GATEWAY`를 실제 HTTPS Gateway 주소로 변경해야 합니다.
- 환경 변수를 변경한 뒤에는 개발 서버를 다시 시작하거나 운영 빌드를 다시 생성해야 합니다.

## 명령어

```bash
npm run dev       # 개발 서버 실행
npm run build     # build 디렉터리에 운영 번들 생성
npm run preview   # 운영 번들 로컬 미리보기
npm run start     # 0.0.0.0:3000으로 개발 서버 실행
```

현재 템플릿에는 ESLint와 자동화 테스트가 포함되어 있지 않습니다. 실제 프로젝트에서는 팀 규칙에 맞는 ESLint, Prettier, Vitest 또는 React Testing Library 구성을 추가하는 것을 권장합니다.

## 디렉터리 구조

```text
src/
├─ components/common/
│  ├─ gateway/             # Axios 인스턴스와 공통 API 함수
│  └─ modal/               # Alert 및 Confirm 컴포넌트
├─ hooks/                  # Provider 및 공통 동작 접근용 Hooks
├─ layout/auth/            # 공개/인증 라우트 접근 제어
├─ nav/                    # Router 설정
├─ pages/
│  ├─ auth/                # 로그인 및 회원가입
│  └─ components/error/    # 오류 페이지
├─ provider/               # Auth 및 Modal Context Provider
└─ styles/                 # 전역, 페이지, 공통 컴포넌트 SCSS
```

경로 별칭은 `vite.config.mjs`에서 관리합니다. 디렉터리를 추가하거나 이름을 바꾸면 해당 별칭도 함께 수정하세요.

## 기본 라우트

| 경로 | 접근 조건 | 화면 |
| --- | --- | --- |
| `/` | 비로그인 | `/login`으로 이동 |
| `/login` | 비로그인 | 로그인 |
| `/register` | 비로그인 | 회원가입 |
| `/main` | 로그인 | Welcome 메인 |
| 그 외 | 전체 | 404 페이지 |

- `PublicOnlyLayout`은 이미 로그인한 사용자가 로그인 또는 회원가입 화면에 접근하면 `/main`으로 이동시킵니다.
- `ProtectedLayout`은 로그인하지 않은 사용자가 보호된 화면에 접근하면 `/login`으로 이동시킵니다.
- 앱 최초 진입 시 `/auth/session`으로 로그인 상태를 확인합니다. Access Token만 만료된 경우
  `/auth/refresh`를 한 번 호출한 뒤 세션을 다시 확인하며, 확인이 끝나기 전에는 라우트 화면이 렌더링되지 않습니다.

새 보호 페이지는 `Router.jsx`의 `ProtectedLayout` 내부에 추가합니다.

```jsx
<Route element={<ProtectedLayout />}>
    <Route path="/main" element={<Main />} />
    <Route path="/settings" element={<Settings />} />
</Route>
```

## 인증 API 계약

현재 화면은 아래 API 규격을 기준으로 작성되어 있습니다. 실제 API 응답이 다르면 `AuthProvider.jsx`, `Gateway.jsx`, `Login.jsx`, `Register.jsx`를 함께 수정해야 합니다.

### 로그인

```http
POST /auth/login
```

```json
{
  "userId": "user01",
  "password": "password123"
}
```

- 성공 상태 코드: `200`
- 로그인 성공 직후 `/auth/session`을 호출해 쿠키 저장과 세션 생성을 다시 확인합니다.

### 세션 확인

```http
POST /auth/session
```

현재 기대하는 공통 응답 본문:

```json
{
  "code": "0000",
  "message": "SUCCESS",
  "data": {
    "status": true,
    "refreshable": false,
    "name": "사용자 이름",
    "userCode": "USER_CODE",
    "role": "USER"
  }
}
```

- `status`는 로그인 여부를 나타내는 Boolean 값이어야 합니다.
- `refreshable`은 JWT와 Redis에 저장된 Refresh 세션의 유효 여부만 나타내며 토큰 값은 포함하지 않습니다.
- `status`가 `false`이고 `refreshable`이 `true`일 때만 갱신을 시도한 뒤 세션을 한 번 더 확인합니다.
- `401`은 정상적인 비로그인 상태로 변환됩니다.
- 네트워크 오류나 `5xx` 응답은 비로그인과 구분되며 `useAuth()`의 `sessionError`에서 확인할 수 있습니다.
- 비로그인 시 API가 `401`을 반환하면 브라우저 Network/Console에 401이 표시될 수 있습니다. 이를 원하지 않으면 API에서 `200`과 `{ "status": false }`를 반환하도록 계약을 변경할 수 있습니다.

### 아이디 중복 확인

```http
POST /auth/register/exists
```

```json
{
  "userId": "user01"
}
```

응답의 `exists`가 `true`이면 이미 사용 중인 아이디입니다. 현재 화면은 다음 두 응답 형태를 모두 지원합니다.

```json
{ "exists": false }
```

```json
{ "data": { "exists": false } }
```

### 회원가입

```http
POST /auth/register
```

```json
{
  "userName": "사용자 이름",
  "userId": "user01",
  "userPassword": "password123"
}
```

- 성공 상태 코드: `201`
- 로그인에서는 비밀번호 필드가 `password`, 회원가입에서는 `userPassword`입니다. 실제 API가 동일한 필드명을 사용한다면 둘 중 하나를 반드시 맞춰야 합니다.

### 토큰 갱신과 로그아웃

```http
POST /auth/refresh
POST /auth/logout
```

- 일반 인증 요청이 `401`을 반환하면 `/auth/refresh`를 한 번 호출한 후 기존 요청을 재시도합니다.
- 한 브라우저 탭에서 동시에 여러 요청이 실패해도 하나의 Refresh 요청을 공유합니다.
- 로그인, 회원가입, 세션, Refresh, 로그아웃 요청은 자동 Refresh 대상에서 제외됩니다.
- 로그아웃은 서버 요청 성공 여부와 관계없이 클라이언트 인증 상태를 초기화한 후 `/login`을 새로 불러옵니다.

## Access Token과 Refresh Token

이 템플릿은 토큰을 JavaScript 상태나 `localStorage`에 직접 저장하지 않고 서버가 설정한 HttpOnly 쿠키를 사용하는 구조입니다. Axios의 `withCredentials: true`가 설정되어 있습니다.

백엔드 및 Gateway에서 다음 항목을 반드시 확인하세요.

- Access Token과 Refresh Token 쿠키 이름 및 만료 시간
- `HttpOnly`, `Secure`, `SameSite`, `Path`, `Domain` 정책
- Front Origin을 정확히 지정한 CORS `Access-Control-Allow-Origin`
- CORS `Access-Control-Allow-Credentials: true`
- Refresh Token 회전 및 재사용 탐지 정책
- 로그아웃 시 두 쿠키가 모두 만료되는지 여부

Front와 Gateway가 서로 다른 사이트에 배포된다면 일반적으로 `SameSite=None; Secure`와 HTTPS가 필요합니다. 로컬 HTTP 환경과 운영 HTTPS 환경의 쿠키 설정을 분리하세요.

현재 Refresh 중복 방지는 브라우저 탭 하나의 메모리 안에서만 동작합니다. 여러 탭을 동시에 사용하는 서비스라면 서버 측 Refresh Token 회전 유예 정책 또는 `BroadcastChannel`을 이용한 탭 간 동기화를 추가로 검토해야 합니다.

또한 Gateway 인터셉터는 일반 요청의 모든 `401`을 토큰 만료로 판단합니다. API가 권한 부족이나 다른 오류에도 `401`을 사용한다면 오류 코드까지 확인하도록 조건을 수정하세요. 권한 부족은 가능하면 `403`으로 구분하는 것이 좋습니다.

자동 Refresh가 필요 없는 요청은 다음처럼 제외할 수 있습니다.

```jsx
gateway.post('/public/example', payload, {
    skipAuthRefresh: true,
});
```

## Auth Provider 사용법

`AuthProvider`는 다음 값을 제공합니다.

```jsx
const {
    isAuthenticated,
    user,
    loading,
    sessionError,
    login,
    logout,
} = useAuth();
```

- `loading`: 최초 세션 확인 중인지 여부
- `isAuthenticated`: 로그인 여부
- `user`: 세션 응답의 `name`
- `sessionError`: 401을 제외한 세션 확인 오류
- `login(credentials)`: 로그인 후 세션 검증까지 수행
- `logout()`: 서버 로그아웃 요청 후 인증 상태 초기화

`useAuth()`는 반드시 `AuthProvider` 내부에서 호출해야 합니다. `App.jsx`의 Provider 순서를 변경할 때는 사용하는 컴포넌트가 각 Provider 내부에 남아 있는지 확인하세요.

## Gateway 사용법

```jsx
import * as gateway from '@components/common/gateway/Gateway';

const listResponse = await gateway.get('/items', { page: 1 });
const createResponse = await gateway.post('/items', { name: 'item' });
const fileResponse = await gateway.getBlob('/files/example.pdf');
```

Gateway 함수는 가공된 본문이 아니라 Axios Response 전체를 반환합니다. 데이터는 `response.data`, 상태 코드는 `response.status`로 접근하세요. Axios는 일반적으로 `2xx`가 아닌 응답을 예외로 처리하므로 호출부에서는 `try/catch`를 사용해야 합니다.

로그인 후 메인 화면의 `Template API 호출 테스트` 버튼은 Gateway를 통해
`GET /api/v1/example/me`를 호출합니다. 성공하면 Auth API가 발급한 토큰이 Gateway를
거쳐 Template API에서 검증된 것이며, 응답 사용자와 HTTP 상태가 Alert에 표시됩니다.

PUT, PATCH, DELETE가 필요하면 `Gateway.jsx`에 같은 방식으로 공통 함수를 추가하세요.

## Alert와 Confirm 사용법

`useModal()`은 반드시 `ModalProvider` 내부에서 사용해야 합니다.

### Alert

```jsx
const { openAlert } = useModal();

openAlert({
    type: 'success', // success | error | warning | info
    title: '저장 완료',
    message: '변경사항이 저장되었습니다.',
    onClose: () => {
        // Alert가 닫힌 뒤 필요한 처리
    },
});
```

### Confirm

```jsx
const { openConfirm } = useModal();

openConfirm({
    type: 'warning',
    title: '삭제하시겠습니까?',
    message: '삭제한 데이터는 복구할 수 없습니다.',
    confirmBtn: '삭제',
    onConfirm: async () => {
        await deleteItem();
    },
    onError: (error) => {
        // onConfirm 실패 처리
    },
    onClose: () => {
        // 취소, 닫기 또는 성공적으로 확인된 후 실행
    },
});
```

Confirm의 `onConfirm` 실행 중에는 버튼이 비활성화되어 중복 요청을 막습니다. `onConfirm`이 실패하면 모달은 열린 상태로 유지되고 `onError`가 호출됩니다.

Alert와 Confirm에는 다음 공통 동작이 적용되어 있습니다.

- ESC 키로 닫기
- 모달 내부 포커스 유지
- 닫은 후 이전 포커스 복원
- 모달이 열린 동안 배경 스크롤 차단

메인 화면의 `COMPONENT PREVIEW` 영역에서 모든 Alert 유형과 Confirm을 확인할 수 있습니다. 실제 서비스 화면을 만들 때 필요하지 않다면 해당 데모 영역과 `ALERT_PREVIEWS`를 제거하세요.

## 새 프로젝트에서 반드시 수정할 부분

1. `.env`의 API Gateway 주소
2. 로그인, 세션, 회원가입 API URL과 요청/응답 필드
3. 성공 HTTP 상태 코드와 서비스 오류 코드
4. 아이디 및 비밀번호 유효성 정책
5. 서비스명, 로고, 안내 문구와 색상
6. `/main` 화면과 `COMPONENT PREVIEW` 데모 영역
7. Router의 실제 공개/보호 페이지 구성
8. 운영 도메인의 CORS 및 쿠키 정책
9. 역할별 접근 제어가 필요하면 `role` 기반 라우트 검사

현재 화면에서 사용하는 오류 코드는 다음과 같습니다.

| 코드 | 현재 의미 |
| --- | --- |
| `1001` | 아이디 또는 비밀번호 오류 |
| `1002` | 아이디 중복 |
| `1003` | 로그인 후 세션 확인 실패 |
| `1004` | 요청 횟수 제한 |

백엔드 오류 코드가 다르면 로그인 및 회원가입 화면의 분기문을 수정하세요.

## 스타일 수정

- 전역 스타일과 외부 폰트: `src/styles/index.scss`
- 로그인: `src/styles/pages/auth/Login.scss`
- 회원가입: `src/styles/pages/auth/Register.scss`
- 메인: `src/styles/pages/Home.scss`
- Alert/Confirm 공통 스타일: `src/styles/components/common/modal/Modal.scss`

현재 Google Fonts를 외부 URL에서 불러옵니다. 폐쇄망이나 엄격한 CSP 환경에서는 폰트가 로드되지 않을 수 있으므로 로컬 폰트 또는 시스템 폰트로 교체하세요.

## 빌드 및 Docker

운영 번들을 생성합니다.

```bash
npm run build
```

현재 Dockerfile은 로컬의 `build` 디렉터리를 Nginx 이미지에 복사합니다. Docker 이미지를 만들기 전에 반드시 최신 빌드를 생성하세요.

```bash
npm run build
docker build -t hooni-template-front .
docker run --rm -p 80:80 hooni-template-front
```

빌드 누락이나 오래된 파일 배포를 방지하려면 실제 프로젝트에서 Node 빌드와 Nginx 실행을 한 Dockerfile에 구성하는 멀티 스테이지 빌드로 변경하는 것을 권장합니다.

Nginx에는 React Router 새로고침을 위한 SPA fallback이 설정되어 있습니다. 다른 웹 서버나 CDN을 사용한다면 존재하지 않는 정적 경로를 `index.html`로 전달하도록 별도 설정해야 합니다.

## 운영 전 확인사항

- `npm run build`가 오류 없이 완료되는지 확인
- 로그인, 로그아웃, 세션 만료와 Refresh 재시도 확인
- 새로고침 및 URL 직접 진입 시 라우팅 확인
- 모바일 화면과 키보드 탐색 확인
- 중복 회원가입 요청과 로그인 횟수 제한 확인
- 운영 환경에서 쿠키가 실제 요청에 포함되는지 확인
- API 장애와 비로그인 상태가 구분되어 표시되는지 확인
- 보안 헤더와 CSP를 운영 인프라 정책에 맞게 추가
- Source Map, 로그 수집 및 오류 추적 정책 결정

## 주석 작성 기준

코드만 보아도 알 수 있는 설명은 주석으로 반복하지 않고, 다음과 같이 구현 이유가 필요한 부분에만 주석을 남기는 것을 권장합니다.

- 인증 또는 보안 정책 때문에 필요한 예외 처리
- 동시 요청과 토큰 회전처럼 재현하기 어려운 흐름
- API 계약상 일반적이지 않은 상태 코드나 필드명
- 디자인을 유지하기 위해 의도적으로 선택한 동작

API 계약이나 구현을 변경하면 관련 주석과 이 README도 함께 갱신하세요.
