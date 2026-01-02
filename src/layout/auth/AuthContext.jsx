import { createContext, useContext, useEffect, useState } from "react";
import * as gateway from "@components/common/Gateway";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext(null);

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
            sessionStorage.removeItem("_af");
            sessionStorage.removeItem("_rf");
            setIsAuthenticated(false);
            setUser(null);
            navigate("/", { replace: true });
        }
    }

    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, loginSuccess, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
