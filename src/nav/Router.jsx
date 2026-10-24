import { Navigate, Route, Routes } from "react-router-dom";

import Main from "@pages/Main";
import Trash from "@pages/components/trash/Trash";
import ProtectedLayout from "@layout/auth/ProtectedLayout";
import PublicOnlyLayout from "@layout/auth/PublicOnlyLayout";

import Login from "@pages/auth/Login";

import Page404 from "@pages/components/error/Page404";
import DashBoard from "@layout/DashBoard";

export default function Router(props) {
    return (
        <Routes>
            {/* 로그인하지 않은 사용자만 접근할 수 있는 화면 */}
            <Route element={<PublicOnlyLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
            </Route>

            {/* 로그인이 필요한 화면 */}
            <Route element={<ProtectedLayout />}>
                <Route element={<DashBoard />}>
                    <Route path="/main/:folderId" element={<Main {...props} />} />
                    <Route path="/trash" element={<Trash {...props} />} />
                </Route>
            </Route>
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}
