import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as gateway from "@components/common/gateway/Gateway";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const res = await gateway.session();

            if (res.isLogin) {
                setIsAuthenticated(true);
                setUser(res.name);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const loginSuccess = () => {
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await gateway.post("/auth/logout");
        } catch (e) {
            console.error(e);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            navigate("/", { replace: true });
        }
    }

    const rootFolder = async () => {
        const response = await gateway.post("/nas/api/v1/folder/root");

        if (response.status === 200 && response.code === "0000") {
            loginSuccess();
            navigate(`/main/${response.data.folderId}`, { replace: true });
        }
    }

    useEffect(() => {
        checkSession();
    }, []);

    const value = {
        isAuthenticated,
        user,
        loading,
        loginSuccess,
        logout,
        rootFolder
    }

    return (
        <AuthContext.Provider value={ value }>
            {children}
        </AuthContext.Provider>
    );
};
