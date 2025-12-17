import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_GATEWAY,
    withCredentials: true,
});

// 1) 요청 시 accessToken 헤더 삽입
api.interceptors.request.use((config) => {

    return config;
});

// 2) 응답 401 → 자동 refresh
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 재시도하지 않은 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh Token으로 새 Access Token 발급
                // 쿠키에 있는 refreshToken이 자동으로 전송됨
                await api.post("/auth/refresh");

                // 새 토큰은 서버에서 쿠키로 다시 설정됨
                // 원래 요청 재시도
                return api(originalRequest);
            } catch (err) {
                // Refresh Token도 만료됨 - 로그인 페이지로
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
