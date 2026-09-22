import { createContext, useCallback, useEffect, useState } from "react";

import * as gateway from "@components/common/gateway/Gateway";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [rootFolderId, setRootFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionError, setSessionError] = useState(null);

    const loadRootFolderId = useCallback(async () => {
        const response = await gateway.post("/nas/api/v1/folder/root");
        const rootFolder = response.data?.data ?? response.data;
        const folderId = rootFolder?.folderId;

        if (!folderId) {
            throw new Error("Root folder was not found");
        }

        return folderId;
    }, []);

    const checkSession = useCallback(async ({ throwOnError = false } = {}) => {
        setSessionError(null);
        try {
            let res = await gateway.session();

            // Access Token만 만료된 상태로 앱을 다시 열어도 유효한 Refresh Token으로 세션을 복구한다.
            // Refresh Token이 없는 401은 정상적인 비로그인 상태이므로 오류로 노출하지 않는다.
            if (!res.isLogin && res.canRefresh) {
                try {
                    await gateway.refresh();
                    res = await gateway.session();
                } catch (refreshError) {
                    if (refreshError.response?.status !== 401) {
                        throw refreshError;
                    }
                }
            }

            if (res.isLogin) {
                const folderId = await loadRootFolderId();

                setIsAuthenticated(true);
                setUser(res.userName);
                setRootFolderId(folderId);
                return folderId;
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setRootFolderId(null);
                return null;
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            setRootFolderId(null);
            setSessionError(error);
            if (throwOnError) throw error;
            return null;
        } finally {
            setLoading(false);
        }
    }, [loadRootFolderId]);

    const login = useCallback(async (credentials) => {
        const response = await gateway.post("/auth/login", credentials, {
            skipAuthRefresh: true,
        });

        if (response.status !== 200) {
            throw response;
        }

        // 로그인 쿠키가 설정된 뒤 보호된 NAS API를 바로 호출한다.
        // 이 호출이 성공하면 별도의 세션 재확인 없이 인증과 루트 폴더를 함께 확인할 수 있다.
        const folderId = await loadRootFolderId();
        const loginData = response.data?.data ?? response.data;

        setSessionError(null);
        setUser(loginData?.userName ?? loginData?.name ?? credentials.userId);
        setRootFolderId(folderId);
        setIsAuthenticated(true);

        return folderId;
    }, [loadRootFolderId]);

    const logout = useCallback(async () => {
        try {
            await gateway.post("/auth/logout", undefined, {
                skipAuthRefresh: true,
            });
        } catch {
            // 서버 로그아웃이 실패해도 클라이언트 인증 상태는 반드시 초기화한다.
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            setRootFolderId(null);

            // 전체 페이지를 다시 로드해 메모리에 남아 있는 인증 관련 상태까지 초기화한다.
            window.location.replace("/login");
        }
    }, []);

    useEffect(() => {
        // 공개 페이지로 바로 진입해도 쿠키 세션을 먼저 확인해야
        // 이미 로그인한 사용자를 메인 화면으로 보낼 수 있다.
        void checkSession();
    }, [checkSession]);

    const value = {
        isAuthenticated,
        user,
        rootFolderId,
        loading,
        sessionError,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
