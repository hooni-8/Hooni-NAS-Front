import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY,
    withCredentials: true,
});

// Refresh 요청에는 일반 응답 인터셉터를 적용하지 않아 재귀 호출을 방지한다.
const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY,
    withCredentials: true,
});

// Refresh Token 회전 시 동시 요청 중 하나만 기존 토큰을 사용할 수 있으므로
// 여러 401 응답은 하나의 Refresh 요청을 공유한다.
let refreshRequest = null;
let redirectingToLogin = false;

const PUBLIC_AUTH_PATHS = new Set([
    "/auth/login",
    "/auth/register",
    "/auth/register/exists",
    "/auth/session",
    "/auth/refresh",
    "/auth/logout",
]);

const requestPath = (config) => {
    try {
        return new URL(
            config.url,
            config.baseURL || window.location.origin,
        ).pathname;
    } catch {
        return config.url?.split(/[?#]/, 1)[0];
    }
};

const redirectToLogin = () => {
    if (redirectingToLogin || window.location.pathname === "/login") {
        return;
    }

    redirectingToLogin = true;
    window.location.replace("/login?reason=session-expired");
};

export const refreshSession = () => {
    if (!refreshRequest) {
        refreshRequest = refreshApi.post("/auth/refresh")
            .finally(() => {
                refreshRequest = null;
            });
    }
    return refreshRequest;
};

api.interceptors.response.use(
    response => response,
    async (error) => {
        const original = error.config;

        if (!error.response || !original || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // 공개 인증 API와 명시적으로 제외한 요청은 Refresh/리다이렉트를 수행하지 않는다.
        const isPublicAuthRequest = PUBLIC_AUTH_PATHS.has(requestPath(original));

        if (original.skipAuthRefresh || isPublicAuthRequest) {
            return Promise.reject(error);
        }

        if (!original._retry) {
            original._retry = true;
            try {
                await refreshSession();
                return api(original);
            } catch (refreshError) {
                // Refresh Token까지 유효하지 않을 때만 로그인 상태를 종료한다.
                // 네트워크 장애나 하위 API의 JWT 설정 오류는 현재 세션과 별개의 문제다.
                if ([401, 403].includes(refreshError.response?.status)) {
                    redirectToLogin();
                }
                return Promise.reject(refreshError);
            }
        }

        // 갱신 후 같은 API가 다시 401을 반환하면 현재 브라우저 세션으로는
        // 보호 API를 사용할 수 없으므로 멈춰 있는 화면 대신 로그인으로 이동한다.
        redirectToLogin();
        return Promise.reject(error);
    }
);

export default api;
