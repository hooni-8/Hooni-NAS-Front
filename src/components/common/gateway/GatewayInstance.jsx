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

        if (!error.response) return Promise.reject(error);

        if (error.response.status !== 401)
            return Promise.reject(error);

        // 1. retry 1회
        if (!original._retry) {
            original._retry = true;

            try {
                await refreshApi.post("/auth/refresh");
                return api(original);
            } catch (e) {
                window.location.replace("/");
                return Promise.reject(e);
            }
        }

        // 2. retry 실패 fallback
        window.location.replace("/");
        return Promise.reject(error);
    }
);

export default api;