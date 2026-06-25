import { Home, Search, Upload, User, List } from 'lucide-react';

import { useFileUpload } from "@hooks/useFileUpload";
import { useModal } from "@hooks/useModal";

import "@styles/pages/layout/MobileNav.scss";

export default function MobileNav({ onUploadClick, progressBarOpen, uploadingCount }) {

    const { openModal } = useModal();
    const { uploadingFiles } = useFileUpload();

    const hasUploading = uploadingFiles.length > 0;

    return (
        <nav className="mobile-nav">
            <div className="mobile-nav-content">
                <button className="mobile-nav-item active">
                    <Home className="mobile-nav-icon"/>
                    <span className="mobile-nav-label">홈</span>
                </button>

                <button className="mobile-nav-item">
                    <Search className="mobile-nav-icon"/>
                    <span className="mobile-nav-label">검색</span>
                </button>

                <button
                    onClick={() => openModal("uploadOpen")}
                    className="mobile-nav-upload-button"
                >
                    <div className="mobile-nav-upload-circle">
                        <Upload className="mobile-nav-upload-icon"/>
                    </div>
                </button>

                <button className="mobile-nav-item">
                    <User className="mobile-nav-icon"/>
                    <span className="mobile-nav-label">프로필</span>
                </button>

                <button
                    onClick={() => openModal("progressBarOpen")}
                    className="mobile-nav-item"
                >
                    <List className="mobile-nav-icon"/>
                    <span className="mobile-nav-label">목록</span>
                    {/* 업로드 진행 중일 때 뱃지 */}
                    {hasUploading && (
                        <div className="upload-badge">
                            <div className="upload-badge-dot">
                                <div className="upload-badge-ping"/>
                            </div>
                        </div>
                    )}
                </button>
            </div>
        </nav>
    );
}