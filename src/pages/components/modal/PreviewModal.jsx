import {useEffect, useState} from "react";
import * as gateway from "@components/common/Gateway";

import "@styles/pages/components/modal/PreviewModal.scss"
import { X, Download, Share2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const previewCache = new Map();

export default function PreviewModal({ closePreviewModal, activeFolderId, selectedFile, file, onClose, onPrevious, onNext, hasPrevious = true, hasNext = true }) {

    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewError, setPreviewError] = useState(null);

    // 여기에서 미리보기 가져오기
    useEffect(() => {
        if (selectedFile.type !== "image") return;

        if (previewCache.has(selectedFile.id)) {
            setPreviewUrl(previewCache.get(selectedFile.id));
            return;
        }

        const payload = {
            activeFolderId
        }

        const fetchPreview = async () => {
            try {
                const response = await gateway.getBlob( `/nas/api/v1/file/preview/${selectedFile.id}`, payload );

                const url = URL.createObjectURL(response.data);
                previewCache.set(selectedFile.id, url);
                setPreviewUrl(url);
            } catch {
                setPreviewError(true);
            }
        };

        fetchPreview();
    }, [selectedFile]);

    const renderPreview = () => {
        switch (selectedFile.type) {
            case 'image':
                return (
                    <div className="file-preview-image-container">
                        <img
                            src={previewUrl}
                            alt={selectedFile.name}
                            className="file-preview-image"
                        />
                    </div>
                );
            case 'video':
                return (
                    <div className="file-preview-video-container">
                        <video
                            src={previewUrl}
                            alt={selectedFile.name}
                            controls
                            className="file-preview-video"
                        >
                            브라우저가 비디오를 지원하지 않습니다.
                        </video>
                    </div>
                );
            // case 'audio':
            //     return (
            //         <div className="file-preview-audio-container">
            //             <div className="file-preview-audio-icon-wrapper">
            //                 <svg className="file-preview-audio-icon" fill="currentColor" viewBox="0 0 24 24">
            //                     <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            //                 </svg>
            //             </div>
            //             <audio src={file.url} controls className="file-preview-audio-player">
            //                 브라우저가 오디오를 지원하지 않습니다.
            //             </audio>
            //         </div>
            //     );
            // case 'document':
            //     return (
            //         <div className="file-preview-document-container">
            //             <div className="file-preview-document-icon-wrapper">
            //                 <svg className="file-preview-document-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            //                 </svg>
            //             </div>
            //             {/*<h3 className="file-preview-document-title">{file.name}</h3>*/}
            //             <p className="file-preview-document-message">미리보기를 사용할 수 없습니다</p>
            //             <button className="file-preview-document-download-btn">
            //                 <Download className="file-preview-action-icon" />
            //                 다운로드
            //             </button>
            //         </div>
            //     );
        }
    };

    return (
        <div className="file-preview-modal-overlay">
            {/* Header */}
            <div className="file-preview-modal-header">
                <div className="file-preview-modal-info">
                    <h3 className="file-preview-modal-title">{selectedFile.name}</h3>
                    {selectedFile.size && selectedFile.lastModifiedAt && (
                        <p className="file-preview-modal-meta">
                            {selectedFile.size} • {selectedFile.lastModifiedAt}
                        </p>
                    )}
                </div>
                <button
                    onClick={closePreviewModal}
                    className="file-preview-modal-close-btn"
                >
                    <X className="file-preview-modal-close-icon" />
                </button>
            </div>

            {/* Navigation Arrows */}
            {hasPrevious && onPrevious && (
                <button
                    onClick={onPrevious}
                    className="file-preview-nav-btn file-preview-nav-btn-left"
                >
                    <ChevronLeft className="file-preview-nav-icon" />
                </button>
            )}

            {hasNext && onNext && (
                <button
                    onClick={onNext}
                    className="file-preview-nav-btn file-preview-nav-btn-right"
                >
                    <ChevronRight className="file-preview-nav-icon" />
                </button>
            )}

            {/* Main Content */}
            <div className="file-preview-modal-content">
                {renderPreview()}
            </div>

            {/* Footer Actions */}
            <div className="file-preview-modal-footer">
                <button className="file-preview-action-btn">
                    <Download className="file-preview-action-icon" />
                    <span className="file-preview-action-text">다운로드</span>
                </button>
                {/*<button className="file-preview-action-btn">*/}
                {/*    <Share2 className="file-preview-action-icon" />*/}
                {/*    <span className="file-preview-action-text">공유</span>*/}
                {/*</button>*/}
                <button className="file-preview-action-btn file-preview-action-btn-delete">
                    <Trash2 className="file-preview-action-icon" />
                    <span className="file-preview-action-text">삭제</span>
                </button>
            </div>
        </div>
    );
}