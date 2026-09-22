import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@hooks/useAuth';

export default function PublicOnlyLayout() {
    const { isAuthenticated, loading, rootFolderId } = useAuth();

    if (loading) {
        return <div aria-live="polite" aria-label="로그인 상태 확인 중" />;
    }

    if (isAuthenticated && rootFolderId) {
        return <Navigate to={`/main/${rootFolderId}`} replace />;
    }

    return <Outlet />;
}
