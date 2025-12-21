import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@layout/auth/AuthContext";

import "@styles/pages/layout/components/HeaderDropdown.scss";
import {Bell, LogOut, User} from "lucide-react";


export default function HeaderDropdown() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/", {replace: true});
    }

    return (
        <div className="header-dropdown-menu">
            <div className="header-dropdown-header">
                <p className="header-dropdown-title">사용자</p>
                <p className="header-dropdown-email">user@example.com</p>
            </div>
            <button className="header-dropdown-item">
                <User className="header-dropdown-icon"/>
                <span>내 프로필</span>
            </button>
            <button className="header-dropdown-item">
                <Bell className="header-dropdown-icon"/>
                <span>알림 설정</span>
            </button>
            <div className="header-dropdown-divider"></div>
            <button
                onClick={handleLogout}
                className="header-dropdown-item logout"
            >
                <LogOut className="header-dropdown-icon"/>
                <span>로그아웃</span>
            </button>
        </div>
    )
}