import React from 'react';
import {Route, Routes} from "react-router-dom";

import Home from "@pages/Home";
import ProtectedLayout from "@layout/auth/ProtectedLayout";
import DashBoard from "@layout/DashBoard";

import Login from "@pages/auth/Login";

export default function Router(props) {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />

            {/* Protected */}
            <Route element={<ProtectedLayout />}>
                <Route element={<DashBoard />}>
                    <Route path="/home" element={<Home {...props} />} />
                </Route>
            </Route>

        </Routes>
    )
}