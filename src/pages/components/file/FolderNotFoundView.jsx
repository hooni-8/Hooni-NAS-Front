import React from "react";
import { ArrowLeft, FolderX, HardDrive } from "lucide-react";

export default function FolderNotFoundView({ onGoToRoot, onGoBack }) {
    return (
        <div className="folder-not-found">
            <div className="folder-not-found-card">
                <div className="folder-not-found-icon" aria-hidden="true">
                    <FolderX />
                </div>
                <span className="folder-not-found-code">FOLDER NOT FOUND</span>
                <h2>폴더를 찾을 수 없습니다</h2>
                <p>
                    주소가 잘못되었거나, 폴더가 삭제되었거나, 접근 권한이 없는 폴더입니다.
                </p>
                <div className="folder-not-found-actions">
                    <button type="button" className="folder-not-found-primary" onClick={onGoToRoot}>
                        <HardDrive size={17} />
                        내 파일로 이동
                    </button>
                    <button type="button" className="folder-not-found-secondary" onClick={onGoBack}>
                        <ArrowLeft size={17} />
                        이전 페이지
                    </button>
                </div>
            </div>
        </div>
    );
}
