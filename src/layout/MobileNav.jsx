import { Home, Search, Upload, User } from 'lucide-react';

import "@styles/pages/layout/MobileNav.scss";

export default function MobileNav({ onUploadClick }) {
    return (
        <nav className="mobile-nav">
            <div className="mobile-nav-content">
                <button className="mobile-nav-item active">
                    <Home className="mobile-nav-icon" />
                    <span className="mobile-nav-label">홈</span>
                </button>
                <button className="mobile-nav-item">
                    <Search className="mobile-nav-icon" />
                    <span className="mobile-nav-label">검색</span>
                </button>
                <button
                    onClick={onUploadClick}
                    className="mobile-nav-upload-button"
                >
                    <div className="mobile-nav-upload-circle">
                        <Upload className="mobile-nav-upload-icon" />
                    </div>
                </button>
                <button className="mobile-nav-item">
                    <User className="mobile-nav-icon" />
                    <span className="mobile-nav-label">프로필</span>
                </button>
                <div className="mobile-nav-spacer"></div>
            </div>
        </nav>
    );
}