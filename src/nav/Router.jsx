import React from 'react';
import {Route, Routes} from "react-router-dom";

import Home from "@pages/Home";

import Login from "@pages/auth/Login";

export default function Router(props) {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/home" element={<Home {...props} />} />

        </Routes>
    )
}