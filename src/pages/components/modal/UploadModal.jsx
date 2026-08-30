import { useState } from 'react';
import { X, Upload, FileUp, CheckCircle2, Files } from 'lucide-react';

import "@styles/pages/components/modal/UploadModal.scss";
import * as format from "@components/utils/Format";
import { useFileUpload } from "@hooks/useFileUpload";
import { useModal } from "@hooks/useModal";

const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024 * 1024;

export default function UploadModal({ closeUploadModal, handleUpload, pendingFiles}) {
    const [isDragging, setIsDragging] = useState(false);

    const { addFiles } = useFileUpload();
    const { openAlert } = useModal();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }

        // 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 초기화한다.
        e.target.value = '';
    };

    const handleFiles = (fileList) => {
        const files = Array.from(fileList);
        const rejectedFiles = files.filter(file => file.size > MAX_UPLOAD_FILE_SIZE);
        const uploadableFiles = files.filter(file => file.size <= MAX_UPLOAD_FILE_SIZE);

        if (rejectedFiles.length > 0) {
            const fileNames = rejectedFiles.slice(0, 3).map(file => file.name).join(', ');
            const remainingCount = rejectedFiles.length - 3;

            openAlert({
                type: 'warning',
                title: '파일 크기 제한 초과',
                message: `${fileNames}${remainingCount > 0 ? ` 외 ${remainingCount}개` : ''} 파일은 업로드할 수 없습니다. 파일당 최대 크기는 5GB입니다.`
            });
        }

        const newFiles = uploadableFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            name: file.name,
            type: format.getFileType(file.name),
            size: format.formatBytes(file.size),
            date: new Date().toISOString().split('T')[0],
            status: "PENDING",
            progress: 0
        }));

        if (newFiles.length > 0) {
            addFiles(newFiles);
        }
    };

    return (
        <div className="upload-modal-overlay">
            <div className="upload-modal">
                <div className="upload-modal-header">
                    <div className="upload-modal-heading">
                        <div className="upload-modal-heading-icon"><FileUp aria-hidden="true" /></div>
                        <div>
                            <span className="upload-modal-eyebrow">NEW UPLOAD</span>
                            <h2 className="upload-modal-title">파일 업로드</h2>
                            <p className="upload-modal-description">파일을 선택하면 업로드 목록에 바로 추가됩니다.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => closeUploadModal("CANCEL")}
                        className="upload-modal-close-btn"
                        aria-label="업로드 창 닫기"
                    >
                        <X className="upload-modal-close-icon" aria-hidden="true" />
                    </button>
                </div>

                <div className="upload-modal-content">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`upload-drop-zone ${isDragging ? 'active' : ''}`}
                    >
                        <div className="upload-drop-content">
                            <div className={`upload-drop-icon-wrapper ${isDragging ? 'active' : ''}`}>
                                <Upload className={`upload-drop-icon ${isDragging ? 'active' : ''}`} />
                            </div>
                            <span className="upload-drop-eyebrow">DRAG & DROP</span>
                            <p className="upload-drop-title">
                                파일을 여기에 놓아주세요
                            </p>
                            <p className="upload-drop-subtitle">
                                또는 아래 버튼으로 기기에서 파일을 선택하세요
                            </p>
                            <label className="upload-file-select-btn">
                                <Files aria-hidden="true" />
                                파일 선택하기
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileInput}
                                    className="upload-file-input"
                                />
                            </label>
                        </div>
                    </div>

                    {pendingFiles.length > 0 && (
                        <div className="upload-file-list">
                            <h3 className="upload-file-list-title">
                                업로드 대기 파일 <span>{pendingFiles.length}</span>
                            </h3>
                            <div className="upload-files">
                                {pendingFiles.map(file => (
                                    <div key={file.id} className="upload-file-item">
                                        {format.getUploadFileIcon(file)}
                                        <div className="upload-file-item-info">
                                            <p className="upload-file-item-name">{file.name}</p>
                                            <p className="upload-file-item-size">{file.size}</p>
                                        </div>
                                        <CheckCircle2 className="upload-file-item-check" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="upload-modal-actions">
                    <p className="upload-modal-selection-summary">
                        {pendingFiles.length > 0 ? `${pendingFiles.length}개 파일 선택됨` : "선택된 파일이 없습니다"}
                    </p>
                    <button
                        type="button"
                        onClick={() => closeUploadModal("CANCEL")}
                        className="upload-modal-cancel-btn"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={pendingFiles.length === 0}
                        className="upload-modal-upload-btn"
                    >
                        <Upload className="upload-modal-upload-icon" />
                        <span>업로드</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
