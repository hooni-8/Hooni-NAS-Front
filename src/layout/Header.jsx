import React, {useEffect, useRef, useState} from 'react';
import { Search, Upload, Grid3x3, List, User, Menu, FolderPlus, ChevronDown } from 'lucide-react';

import "@styles/pages/layout/Header.scss"
import HeaderDropdown from "@layout/components/HeaderDropdown";

export default function Header({
                           searchQuery,
                           setSearchQuery,
                           viewMode,
                           setViewMode,
                           showUploadModal,
                           onMenuClick,
                           onCreateFolderClick
                       }) {

    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="header-search-input"
                        />
                    </div>
                </div>

                <div className="header-actions">

                    {/*---------------View Toggle---------------*/}
                    <div className="header-view-toggle mobile">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`header-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        >
                            <Grid3x3 className="header-view-icon-small"/>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`header-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        >
                            <List className="header-view-icon-small"/>
                        </button>
                    </div>

                    <div className="header-view-toggle desktop">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`header-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        >
                            <Grid3x3 className="header-view-icon"/>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`header-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        >
                            <List className="header-view-icon"/>
                        </button>
                    </div>
                    {/*---------------View Toggle---------------*/}

                    {/*---------------Create Folder Button---------------*/}
                    <button
                        onClick={onCreateFolderClick}
                        className="header-desktop-folder-btn"
                    >
                        <FolderPlus className="header-btn-icon"/>
                        <span>폴더 생성</span>
                    </button>

                    <button
                        onClick={onCreateFolderClick}
                        className="header-mobile-folder-btn"
                    >
                        <FolderPlus className="header-mobile-icon"/>
                    </button>
                    {/*---------------Create Folder Button---------------*/}

                    {/*---------------Upload Button---------------*/}
                    <button
                        onClick={showUploadModal}
                        className="header-desktop-upload-btn"
                    >
                        <Upload className="header-btn-icon"/>
                        <span>업로드</span>
                    </button>

                    <button
                        onClick={showUploadModal}
                        className="header-mobile-upload-btn"
                    >
                        <Upload className="header-mobile-icon"/>
                    </button>
                    {/*---------------Upload Button---------------*/}

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
                            <HeaderDropdown />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}