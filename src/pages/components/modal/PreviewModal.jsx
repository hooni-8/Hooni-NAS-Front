import {useEffect, useRef, useState} from "react";
import { useParams } from "react-router-dom";

import * as gateway from "@components/common/gateway/Gateway";

/* Hooks */
import { useFileControl } from "@hooks/useFileControl"
import { useFileDownload } from "@hooks/useFileDownload";

import "@styles/pages/components/modal/PreviewModal.scss"
import { X, Download, Trash2, ChevronLeft, ChevronRight, FileWarning, LoaderCircle, Image as ImageIcon, Video } from 'lucide-react';

const baseUrl = import.meta.env.VITE_API_GATEWAY;
// Auth API의 Access Token 유효기간(15분)보다 먼저 갱신한다.
const VIDEO_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const VIDEO_REFRESH_RETRY_MS = 30 * 1000;
const VIDEO_ERROR_RETRY_COOLDOWN_MS = 60 * 1000;

export default function PreviewModal({ closePreviewModal, selectedFile, fetchFileList, onPrevious, onNext, hasPrevious = true, hasNext = true }) {

    const { folderId } = useParams();

    const { deleteFile } = useFileControl();
    const { singleDownload } = useFileDownload();

    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewError, setPreviewError] = useState(null);
    const [videoReload, setVideoReload] = useState(0);
    const videoRef = useRef(null);
    const resumeAtRef = useRef(null);
    const videoRetryRef = useRef(false);
    const lastVideoRetryAtRef = useRef(0);
    const videoSessionRef = useRef(0);

    useEffect(() => {
        const session = ++videoSessionRef.current;
        let refreshTimer;
        let disposed = false;

        setPreviewUrl(null);
        setPreviewError(false);
        setVideoReload(0);
        resumeAtRef.current = null;
        videoRetryRef.current = false;
        lastVideoRetryAtRef.current = 0;

        const renewVideoAccess = async () => {
            try {
                // <video> 요청은 Axios 인터셉터를 거치지 않으므로 쿠키를 미리 갱신한다.
                await gateway.refresh();
                if (!disposed) {
                    clearTimeout(refreshTimer);
                    refreshTimer = setTimeout(renewVideoAccess, VIDEO_REFRESH_INTERVAL_MS);
                }
            } catch (error) {
                // 일시적인 네트워크 오류는 만료 전에 재시도한다. Refresh Token 만료는 재시도하지 않는다.
                if (!disposed && error.response?.status !== 401) {
                    clearTimeout(refreshTimer);
                    refreshTimer = setTimeout(renewVideoAccess, VIDEO_REFRESH_RETRY_MS);
                }
            }
        };

        const fetchPreview = async () => {
            try {
                const isVideo = selectedFile.itemType === 'video';
                if (isVideo) {
                    await renewVideoAccess();
                }
                if (disposed || videoSessionRef.current !== session) return;

                const kind = isVideo ? 'video' : 'preview';
                const url = new URL(`/nas/api/v1/file/${kind}/${encodeURIComponent(selectedFile.itemId)}`, baseUrl);
                url.searchParams.set('folderId', folderId);
                setPreviewUrl(url.toString());
            } catch {
                if (!disposed) setPreviewError(true);
            }
        };

        void fetchPreview();

        const refreshAfterTabResume = () => {
            if (document.visibilityState === 'visible') void renewVideoAccess();
        };
        if (selectedFile.itemType === 'video') {
            document.addEventListener('visibilitychange', refreshAfterTabResume);
        }

        return () => {
            disposed = true;
            clearTimeout(refreshTimer);
            document.removeEventListener('visibilitychange', refreshAfterTabResume);
            if (videoSessionRef.current === session) videoSessionRef.current++;
        };
    }, [selectedFile.itemId, selectedFile.itemType, folderId]);

    const handleVideoError = async () => {
        // 재생이 잠깐 성공한 뒤 다시 실패하는 경우에도 갱신/재시도 루프를 만들지 않는다.
        if (videoRetryRef.current || Date.now() - lastVideoRetryAtRef.current < VIDEO_ERROR_RETRY_COOLDOWN_MS) {
            setPreviewError(true);
            return;
        }

        videoRetryRef.current = true;
        lastVideoRetryAtRef.current = Date.now();
        resumeAtRef.current = videoRef.current?.currentTime ?? 0;
        const session = videoSessionRef.current;
        try {
            // 백그라운드 타이머 지연 등으로 Range 요청이 실패하면 갱신 후 같은 위치에서 다시 연다.
            await gateway.refresh();
            if (videoSessionRef.current === session) setVideoReload(value => value + 1);
        } catch {
            if (videoSessionRef.current === session) setPreviewError(true);
        }
    };

    const restoreVideoPosition = () => {
        if (resumeAtRef.current === null || !videoRef.current) return;
        videoRef.current.currentTime = resumeAtRef.current;
        resumeAtRef.current = null;
    };

    const handleDeleteFile = () => {
        deleteFile(selectedFile, () => {
            closePreviewModal();
            fetchFileList();
        });
    }

    const handleDownloadFile = () => {
        singleDownload(selectedFile);
    }

    const renderPreview = () => {
        if (previewError) {
            return (
                <div className="file-preview-state">
                    <FileWarning aria-hidden="true" />
                    <strong>미리보기를 불러오지 못했습니다</strong>
                    <span>파일을 다운로드해서 확인해보세요.</span>
                </div>
            );
        }

        if (!previewUrl) {
            return (
                <div className="file-preview-state file-preview-loading">
                    <LoaderCircle aria-hidden="true" />
                    <span>미리보기를 불러오는 중입니다</span>
                </div>
            );
        }

        switch (selectedFile.itemType) {
            case 'image':
                return (
                    <div className="file-preview-container">
                        <img
                            src={previewUrl}
                            alt={selectedFile.itemName}
                            className="file-preview"
                            onError={() => setPreviewError(true)}
                        />
                    </div>
                );
            case 'video':
                return (
                    <div className="file-preview-container">
                        <video
                            ref={videoRef}
                            src={videoReload ? `${previewUrl}&retry=${videoReload}` : previewUrl}
                            controls
                            autoPlay
                            className="file-preview"
                            onLoadedMetadata={restoreVideoPosition}
                            onPlaying={() => { videoRetryRef.current = false; }}
                            onError={handleVideoError}
                        />
                    </div>
                );
            default:
                return (
                    <div className="file-preview-state">
                        <FileWarning aria-hidden="true" />
                        <strong>미리보기를 지원하지 않는 파일입니다</strong>
                        <span>파일을 다운로드해서 확인해보세요.</span>
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
        <div className="file-preview-modal-overlay" role="presentation">
            {/* Header */}
            <header className="file-preview-modal-header" role="dialog" aria-modal="true" aria-labelledby="file-preview-title">
                <div className="file-preview-modal-info">
                    <div className="file-preview-title-row">
                        <span className="file-preview-type-badge">
                            {selectedFile.itemType === "video" ? <Video aria-hidden="true" /> : <ImageIcon aria-hidden="true" />}
                            {selectedFile.itemType === "video" ? "VIDEO" : "IMAGE"}
                        </span>
                        <h3 id="file-preview-title" className="file-preview-modal-title">{selectedFile.itemName}</h3>
                    </div>
                    {selectedFile.itemSize && selectedFile.itemDate && (
                        <p className="file-preview-modal-meta">
                            {selectedFile.itemSize} · {selectedFile.itemDate}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={closePreviewModal}
                    className="file-preview-modal-close-btn"
                    aria-label="미리보기 닫기"
                >
                    <X className="file-preview-modal-close-icon" aria-hidden="true" />
                </button>
            </header>

            {/* Navigation Arrows */}
            {hasPrevious && onPrevious && (
                <button
                    type="button"
                    onClick={onPrevious}
                    className="file-preview-nav-btn file-preview-nav-btn-left"
                    aria-label="이전 파일"
                >
                    <ChevronLeft className="file-preview-nav-icon" />
                </button>
            )}

            {hasNext && onNext && (
                <button
                    type="button"
                    onClick={onNext}
                    className="file-preview-nav-btn file-preview-nav-btn-right"
                    aria-label="다음 파일"
                >
                    <ChevronRight className="file-preview-nav-icon" />
                </button>
            )}

            {/* Main Content */}
            <div className="file-preview-modal-content">
                {renderPreview()}
            </div>

            {/* Footer Actions */}
            <footer className="file-preview-modal-footer">
                <button type="button" className="file-preview-action-btn" onClick={handleDownloadFile}>
                    <Download className="file-preview-action-icon" />
                    <span className="file-preview-action-text">다운로드</span>
                </button>
                {/*<button className="file-preview-action-btn">*/}
                {/*    <Share2 className="file-preview-action-icon" />*/}
                {/*    <span className="file-preview-action-text">공유</span>*/}
                {/*</button>*/}
                <button type="button" className="file-preview-action-btn file-preview-action-btn-delete" onClick={handleDeleteFile}>
                    <Trash2 className="file-preview-action-icon" />
                    <span className="file-preview-action-text">삭제</span>
                </button>
            </footer>
        </div>
    );
}
