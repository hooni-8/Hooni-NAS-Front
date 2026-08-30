import axios from "axios";

/**
 * 메인 API 인스턴스
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_GATEWAY,
    withCredentials: true,
});

/**
 * refresh 전용 API (인터셉터 없음 → 무한루프 방지 핵심)
 */
const refreshApi = axios.create({
    baseURL: process.env.REACT_APP_API_GATEWAY,
    withCredentials: true,
});

// 여러 요청이 동시에 401을 받아도 Refresh 요청은 한 번만 수행한다.
// Refresh Token 회전 방식에서 중복 요청이 실패하며 로그아웃되는 것을 막는다.
let refreshRequest = null;

const refreshSession = () => {
    if (!refreshRequest) {
        refreshRequest = refreshApi.post("/auth/refresh")
            .finally(() => {
                refreshRequest = null;
            });
    }

    return refreshRequest;
};

/**
 * request interceptor
 * (쿠키 방식이라 사실 필요 없지만 확장 대비용)
 */
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * response interceptor (핵심 로직)
 */
api.interceptors.response.use(
    res => res,
    async (error) => {

        const original = error.config;

        const redirectToLogin = () => {
            // 로그인 화면에서 다시 replace하면 AuthProvider의 세션 확인이 반복되어
            // refresh token이 없는 경우 무한 새로고침이 발생한다.
            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        };

        if (!error.response || !original) return Promise.reject(error);

        if (error.response.status !== 401)
            return Promise.reject(error);

        // 로그인 실패는 세션 만료가 아니므로 Refresh/재시도를 수행하지 않는다.
        if (original.url?.includes("/auth/login")) {
            return Promise.reject(error);
        }

        // 1. retry 1회
        if (!original._retry) {
            original._retry = true;

            try {
                await refreshSession();
                return api(original);
            } catch (e) {
                redirectToLogin();
                return Promise.reject(e);
            }
        }

        // 2. retry 실패 fallback
        redirectToLogin();
        return Promise.reject(error);
    }
);

export default api;
