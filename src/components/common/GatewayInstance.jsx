import axios from "axios";
import * as gateway from "@components/common/Gateway";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_GATEWAY,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // 리프레시 토큰으로 새 액세스 토큰 요청
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await gateway.post('/auth/refresh', { refreshToken });

                const accessToken = response.data.accessToken;
                // 신규 토큰 저장
                localStorage.setItem('accessToken', accessToken);

                // 헤더가 없으면 새로 생성
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${accessToken}`
                };
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // 원래 요청 재시도
                return api(originalRequest);

            } catch (refreshError) {
                // 리프레시 토큰도 만료된 경우 로그아웃 처리
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // 로그인 페이지로 리다이렉트
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default api;