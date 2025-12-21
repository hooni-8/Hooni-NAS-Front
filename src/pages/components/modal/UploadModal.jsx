import { useState } from 'react';
import {X, Upload, File as FileIcon, CheckCircle2, ImageIcon, VideoIcon, FileAudioIcon} from 'lucide-react';

import "@styles/pages/components/modal/UploadModal.scss";
import * as format from "@components/utils/Format";
import { useUpload } from "@pages/components/loding/UploadProvider";

export default function UploadModal({ showUploadModal, handleUpload, pendingFiles}) {
    const [isDragging, setIsDragging] = useState(false);

    const { addFiles } = useUpload();

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
    };

    const handleFiles = (fileList) => {
        const files = Array.from(fileList);
        const newFiles = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            name: file.name,
            type: format.getFileType(file.name),
            size: format.formatBytes(file.size),
            date: new Date().toISOString().split('T')[0],
            status: "PENDING",
            progress: 0
        }));

        addFiles(newFiles);
    };

    return (
        <div className="upload-modal-overlay">
            <div className="upload-modal">
                <div className="upload-modal-header">
                    <h2 className="upload-modal-title">파일 업로드</h2>
                    <button
                        onClick={showUploadModal}
                        className="upload-modal-close-btn"
                    >
                        <X className="upload-modal-close-icon" />
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
                            <p className="upload-drop-title">
                                파일을 여기에 드래그하거나 클릭하여 선택하세요
                            </p>
                            <p className="upload-drop-subtitle">
                                모든 파일 형식 지원
                            </p>
                            <label className="upload-file-select-btn">
                                파일 선택
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
                                업로드할 파일 ({pendingFiles.length})
                            </h3>
                            <div className="upload-files">
                                {pendingFiles.map(file => (
                                    <div key={file.id} className="upload-file-item">
                                        <FileIcon className="upload-file-item-icon" />
                                        <ImageIcon className="upload-file-item-icon" />
                                        <VideoIcon className="upload-file-item-icon" />
                                        <FileAudioIcon className="upload-file-item-icon" />
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
                    <button
                        onClick={showUploadModal}
                        className="upload-modal-cancel-btn"
                    >
                        취소
                    </button>
                    <button
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