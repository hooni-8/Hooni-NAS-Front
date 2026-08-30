import { Home, Upload, FolderPlus, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFileUpload } from "@hooks/useFileUpload";
import { useModal } from "@hooks/useModal";

import "@styles/pages/layout/MobileNav.scss";

export default function MobileNav() {

    const { openModal } = useModal();
    const { uploadingFiles } = useFileUpload();
    const navigate = useNavigate();
    const hasUploading = uploadingFiles.length > 0;

    return (
        <nav className="mobile-nav" aria-label="빠른 메뉴">
            <div className="mobile-nav-content">
                <button type="button" className="mobile-nav-item active" onClick={() => navigate("/main")}>
                    <Home className="mobile-nav-icon" aria-hidden="true" />
                    <span className="mobile-nav-label">홈</span>
                </button>

                <button type="button" className="mobile-nav-item" onClick={() => openModal("createFolder")}>
                    <FolderPlus className="mobile-nav-icon" aria-hidden="true" />
                    <span className="mobile-nav-label">폴더</span>
                </button>

                <button type="button" onClick={() => openModal("uploadOpen")} className="mobile-nav-upload-button" aria-label="파일 업로드">
                    <div className="mobile-nav-upload-circle"><Upload className="mobile-nav-upload-icon" aria-hidden="true" /></div>
                </button>

                <button type="button" onClick={() => openModal("progressBarOpen")} className="mobile-nav-item">
                    <List className="mobile-nav-icon" aria-hidden="true" />
                    <span className="mobile-nav-label">업로드</span>
                    {hasUploading && (
                        <div className="upload-badge" aria-label="업로드 진행 중">
                            <div className="upload-badge-dot"><div className="upload-badge-ping" /></div>
                        </div>
                    )}
                </button>
            </div>
        </nav>
    );
}
