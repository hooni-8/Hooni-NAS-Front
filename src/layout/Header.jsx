import React, {useEffect, useRef, useState} from 'react';
import { Search, Upload, Grid3x3, List, Bell, User, Menu, FolderPlus, LogOut, ChevronDown } from 'lucide-react';

import "@styles/pages/layout/Header.scss"
import { useAuth } from "@layout/auth/AuthContext";
import {useNavigate} from "react-router-dom";

export default function Header({
                           searchQuery,
                           onSearchChange,
                           viewMode,
                           onViewModeChange,
                           onUploadClick,
                           onMenuClick,
                           onCreateFolderClick
                       }) {

    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/", {replace: true});
    }
    return (
        <header className="header">
            <div className="header-container">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="header-mobile-menu-btn"
                >
                    <Menu className="header-menu-icon"/>
                </button>

                <div className="header-search-section">
                    <div className="header-search-wrapper">
                        <Search className="header-search-icon"/>
                        <input
                            type="text"
                            placeholder="파일 검색..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="header-search-input"
                        />
                    </div>
                </div>

                <div className="header-actions">
                    {/* Mobile View Toggle */}
                    <div className="header-view-toggle mobile">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`header-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        >
                            <Grid3x3 className="header-view-icon-small"/>
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`header-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        >
                            <List className="header-view-icon-small"/>
                        </button>
                    </div>

                    {/* Desktop View Toggle */}
                    <div className="header-view-toggle desktop">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`header-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        >
                            <Grid3x3 className="header-view-icon"/>
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`header-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        >
                            <List className="header-view-icon"/>
                        </button>
                    </div>

                    {/* Desktop Create Folder Button */}
                    <button
                        onClick={onCreateFolderClick}
                        className="header-desktop-folder-btn"
                    >
                        <FolderPlus className="header-btn-icon"/>
                        <span>폴더 생성</span>
                    </button>

                    {/* Desktop Upload Button */}
                    <button
                        onClick={onUploadClick}
                        className="header-desktop-upload-btn"
                    >
                        <Upload className="header-btn-icon"/>
                        <span>업로드</span>
                    </button>

                    {/* Mobile Create Folder Button */}
                    <button
                        onClick={onCreateFolderClick}
                        className="header-mobile-folder-btn"
                    >
                        <FolderPlus className="header-mobile-icon"/>
                    </button>

                    {/* Mobile Upload Button */}
                    <button
                        onClick={onUploadClick}
                        className="header-mobile-upload-btn"
                    >
                        <Upload className="header-mobile-icon"/>
                    </button>

                    {/* Desktop Icons */}
                    <button className="header-notification-btn">
                        <Bell className="header-icon"/>
                    </button>

                    {/* Desktop User Menu */}
                    <div className="header-user-menu" ref={menuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="header-user-menu-btn"
                        >
                            <div className="header-profile-avatar">
                                <User className="header-profile-icon"/>
                            </div>
                            <ChevronDown className={`header-chevron-icon ${showUserMenu ? 'rotated' : ''}`}/>
                        </button>

                        {/* User Dropdown Menu */}
                        {showUserMenu && (
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
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}