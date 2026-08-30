import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

import "@styles/pages/layout/components/HeaderDropdown.scss";
import { LogOut, User } from "lucide-react";

export default function HeaderDropdown() {

    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/", {replace: true});
    };

    return (
        <div className="header-dropdown-menu">
            <div className="header-dropdown-header">
                <div className="header-dropdown-avatar"><User aria-hidden="true" /></div>
                <div>
                    <p className="header-dropdown-title">{user || "내 저장소"}</p>
                    <p className="header-dropdown-email">개인 NAS</p>
                </div>
            </div>
            <div className="header-dropdown-divider" />
            <button type="button" onClick={handleLogout} className="header-dropdown-item logout">
                <LogOut className="header-dropdown-icon" aria-hidden="true" />
                <span>로그아웃</span>
            </button>
        </div>
    );
}
