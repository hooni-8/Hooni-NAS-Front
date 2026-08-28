import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, File as FileIcon } from 'lucide-react';
import "@styles/pages/components/loding/UploadProgressBar.scss";

import { useFileUpload } from "@hooks/useFileUpload";
import { useModal } from "@hooks/useModal";

export default function UploadProgressBar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const { files, successFiles, errorFiles } = useFileUpload();
    const { closeModal } = useModal();

    if (!files || files.length === 0) return null;

    const visibleFiles = files.filter(file => file.status !== "PENDING");
    const allComplete = visibleFiles.length > 0
        && visibleFiles.every(file => file.status === 'SUCCESS' || file.status === 'ERROR');
    const title = allComplete
        ? errorFiles.length > 0
            ? `업로드 완료 · ${errorFiles.length}개 실패`
            : `업로드 완료 · ${successFiles.length}개`
        : `업로드 중 · ${successFiles.length}/${visibleFiles.length}개 완료`;

    return (
        <div className={`progress-bar-container ${allComplete ? "is-complete" : "is-uploading"}`}>
            <div className="progress-bar-header">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="progress-bar-toggle"
                    aria-expanded={isExpanded}
                >
                    {!allComplete && (
                        <div className="progress-indicator">
                            <div className="progress-indicator-ping" />
                            <div className="progress-indicator-dot" />
                        </div>
                    )}
                    <span className="progress-bar-title">{title}</span>
                    {isExpanded ? <ChevronDown className="chevron-icon" /> : <ChevronUp className="chevron-icon" />}
                </button>
                {allComplete && (
                    <button
                        type="button"
                        onClick={() => closeModal("progressBarOpen")}
                        className="close-progress-button"
                        aria-label="업로드 패널 닫기"
                    >
                        <X className="close-icon" />
                    </button>
                )}
            </div>

            {isExpanded && (
                <div className="progress-file-list">
                    {visibleFiles.map((file) => (
                        <div key={file.id} className="progress-file-item">
                            <div className="progress-file-content">
                                <div className="progress-file-icon">
                                    {file.status === 'SUCCESS' ? (
                                        <CheckCircle2 className="icon-success" />
                                    ) : file.status === 'ERROR' ? (
                                        <AlertCircle className="icon-error" />
                                    ) : (
                                        <FileIcon className="icon-default" />
                                    )}
                                </div>

                                <div className="progress-file-info">
                                    <div className="progress-file-header">
                                        <p className="progress-file-name">{file.name}</p>
                                    </div>

                                    {file.status === 'LOADING' && (
                                        <div className="progress-bar-wrapper">
                                            <div className="progress-bar-track">
                                                <div className="progress-bar-fill-animated" style={{ width: `${file.progress}%` }}>
                                                    <div className="progress-bar-shine" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="progress-file-meta">
                                        <span>{file.size}</span>
                                        {file.status === 'READY' && <span className="status-waiting">대기 중</span>}
                                        {file.status === 'LOADING' && <span className="status-uploading">{file.progress}%</span>}
                                        {file.status === 'ERROR' && <span className="status-error">{file.error || '업로드 실패'}</span>}
                                        {file.status === 'SUCCESS' && <span className="status-success">완료</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {allComplete && (
                <div className="progress-summary">
                    <span className="progress-summary-success">성공 {successFiles.length}개</span>
                    {errorFiles.length > 0 && <span className="progress-summary-error">실패 {errorFiles.length}개</span>}
                </div>
            )}
        </div>
    );
}
