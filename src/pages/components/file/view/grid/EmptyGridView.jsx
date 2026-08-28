import React from "react";
import { ArrowLeft, FileSearch, FolderOpen, FolderPlus, Upload } from "lucide-react";

export default function EmptyGridView({ handleBackFolder, canGoBack, isFiltered, onUpload, onCreateFolder }) {

    const title = isFiltered ? "조건에 맞는 항목이 없어요" : "이 폴더는 비어 있어요";
    const description = isFiltered
        ? "검색어를 바꾸거나 다른 카테고리를 선택해보세요."
        : "파일을 올리거나 새 폴더를 만들어 정리해보세요.";

    return (
        <div className="file-grid-empty">
            <div className="empty-content">
                <div className="empty-illustration" aria-hidden="true">
                    <span className="empty-orbit empty-orbit-left"></span>
                    <span className="empty-orbit empty-orbit-right"></span>
                    <div className="empty-icon-wrapper">
                        {isFiltered ? <FileSearch className="empty-icon" /> : <FolderOpen className="empty-icon" />}
                    </div>
                </div>
                <span className="empty-eyebrow">MY STORAGE</span>
                <h3 className="empty-title">{title}</h3>
                <p className="empty-description">{description}</p>

                <div className="empty-actions">
                    {!isFiltered && (
                        <>
                            <button type="button" className="empty-primary-button" onClick={onUpload}>
                                <Upload size={17} />
                                파일 업로드
                            </button>
                            <button type="button" className="empty-secondary-button" onClick={onCreateFolder}>
                                <FolderPlus size={17} />
                                폴더 만들기
                            </button>
                        </>
                    )}

                    {canGoBack && (
                        <button type="button" className="empty-back-button" onClick={handleBackFolder}>
                            <ArrowLeft size={16} />
                            상위 폴더로
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
