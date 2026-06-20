import React from 'react';
import {Route, Routes} from "react-router-dom";

import Main from "@pages/Main";
import ProtectedLayout from "@layout/auth/ProtectedLayout";
import DashBoard from "@layout/DashBoard";

import Login from "@pages/auth/Login";

import Page404 from "@pages/components/error/Page404"

export default function Router(props) {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />

            {/* Protected */}
            <Route element={<ProtectedLayout />}>
                <Route element={<DashBoard />}>
                    <Route path="/main" element={<Main {...props} />} />
                    <Route path="/main/:folderId" element={<Main {...props} />} />
                </Route>

                <Route path="*" element={<Page404 />} />
            </Route>

        </Routes>
    )
}