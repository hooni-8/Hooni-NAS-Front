import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, File as FileIcon } from 'lucide-react';
import "@styles/pages/components/loding/UploadProgressBar.scss";

import { useFileUpload } from "@hooks/useFileUpload";
import { useModal } from "@hooks/useModal";

export default function UploadProgressBar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const { files, successFiles } = useFileUpload();
    const { closeModal } = useModal();

    if (!files || files.length === 0) return null;

    const allComplete = files.filter(f => f.status !== "PENDING")
                             .every(f => f.status === 'SUCCESS' || f.status === 'ERROR');

    return (
        <div className="progress-bar-container">
            {/* 헤더 - 클릭 가능 */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="progress-bar-header"
            >
                <div className="progress-bar-header-left">
                    {!allComplete && (
                        <div className="progress-indicator">
                            <div className="progress-indicator-ping" />
                            <div className="progress-indicator-dot" />
                        </div>
                    )}
                    <span className="progress-bar-title">
            {allComplete
                ? `업로드 완료 (${successFiles.length}개)`
                : `업로드 중... (${successFiles.length}/${files.length})`
            }
          </span>
                </div>
                <div className="progress-bar-header-right">
                    {isExpanded ? (
                        <ChevronDown className="chevron-icon" />
                    ) : (
                        <ChevronUp className="chevron-icon" />
                    )}
                    {allComplete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className="close-progress-button"
                        >
                            <X className="close-icon" onClick={() => closeModal("progressBarOpen")} />
                        </button>
                    )}
                </div>
            </div>

            {/* 파일 목록 - 접었다 펼칠 수 있음 */}
            {isExpanded && (
                <div className="progress-file-list">
                    {files
                        .filter(file => file.status !== "PENDING")
                        .map((file) => (
                        <div key={file.id} className="progress-file-item">
                            <div className="progress-file-content">
                                {/* 파일 아이콘 */}
                                <div className="progress-file-icon">
                                    {file.status === 'SUCCESS' ? (
                                        <CheckCircle2 className="icon-success" />
                                    ) : file.status === 'ERROR' ? (
                                        <AlertCircle className="icon-error" />
                                    ) : (
                                        <FileIcon className="icon-default" />
                                    )}
                                </div>

                                {/* 파일 정보 */}
                                <div className="progress-file-info">
                                    <div className="progress-file-header">
                                        <p className="progress-file-name">{file.name}</p>
                                        {file.status === 'UPLOADING' && (
                                            <button
                                                className="cancel-upload-button"
                                            >
                                                <X className="cancel-icon" />
                                            </button>
                                        )}
                                    </div>

                                    {/* 진행률 바 */}
                                    {file.status === 'LOADING' && (
                                        <div className="progress-bar-wrapper">
                                            <div className="progress-bar-track">
                                                <div
                                                    className="progress-bar-fill-animated"
                                                    style={{ width: `${file.progress}%` }}
                                                >
                                                    <div className="progress-bar-shine" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 상태 텍스트 */}
                                    <div className="progress-file-meta">
                                        <span>{file.size}</span>
                                        {file.status === 'READY' && (
                                            <span className="status-with">대기</span>
                                        )}
                                        {file.status === 'LOADING' && (
                                            <span className="status-uploading">{file.progress}%</span>
                                        )}
                                        {file.status === 'ERROR' && (
                                            <span className="status-error">{file.error || '업로드 실패'}</span>
                                        )}
                                        {file.status === 'SUCCESS' && (
                                            <span className="status-success">완료</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}