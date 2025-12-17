import { Navigate, Outlet  } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedLayout() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div />; // 또는 스피너

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}