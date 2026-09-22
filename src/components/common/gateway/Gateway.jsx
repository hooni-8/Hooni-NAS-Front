import api, { refreshSession } from "@components/common/gateway/GatewayInstance";

export const get = (path, opts) => api.get(path, { params: opts });

export const getBlob = (path, opts) => (
    api.get(path, {
        responseType: 'blob',
        params: opts,
    })
);

// export const post = (path, payload, config) => api.post(path, payload, config);

export const post = async (path, payload, config) => {
    let result = {};

    await api.post(path, payload, config)
        .then((response) => {
            if (response.status === 200) {
                if (response?.data) {
                    result = response.data;
                }
                result.status = response.status;
            }
        })
        .catch((error) => {
            result = error.response;
        })
    return result;
}

// 인터셉터와 앱 초기 세션 복구가 같은 Refresh 요청을 공유한다.
export const refresh = () => refreshSession();

export const session = async () => {
    try {
        const response = await api.post("/auth/session", undefined, {
            skipAuthRefresh: true,
        });
        const data = response.data?.data ?? response.data;
        return {
            isLogin: data.status,
            canRefresh: data.refreshable === true,
            userName: data.name,
            userCode: data.userCode,
            role: data.role,
        };
    } catch (error) {
        // 인증되지 않은 상태와 서버/네트워크 장애를 구분해 호출부가 알맞게 처리하도록 한다.
        if (error.response?.status === 401) {
            return { isLogin: false, canRefresh: false, userName: '', userCode: '', role: '' };
        }
        throw error;
    }
};
