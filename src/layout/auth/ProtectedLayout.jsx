import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

export default function ProtectedLayout() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div aria-live="polite" aria-label="로그인 상태 확인 중" />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
