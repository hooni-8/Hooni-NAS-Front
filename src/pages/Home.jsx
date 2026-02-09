import React, {useEffect, useState} from 'react';
import * as gateway from "@components/common/gateway/Gateway";
import { useOutletContext } from "react-router-dom";
import { useUpload } from "@pages/components/loding/UploadProvider";

import FileGrid from '@pages/components/file/FileGrid';
import MobileNav from '@layout/MobileNav';
import UploadModal from '@pages/components/modal/UploadModal';
import UploadProgressBar from "@pages/components/loding/UploadProgressBar";
import PreviewModal from '@pages/components/modal/PreviewModal';

import "@styles/pages/Home.scss"

export default function Home() {

    const { selectedCategory, searchQuery, viewMode, isUploadModalOpen, setIsUploadModalOpen, showUploadModal } = useOutletContext();
    const { setQueue, pendingToReadyUpdateFile, pendingFiles, readyFiles, uploadingFiles, processQueue } = useUpload();

    const [progressBarOpen, setProgressBarOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [rendering, setRendering] = useState(false);
    const [activeFolderId, setActiveFolderId] = useState(null);

    const [selectedFile, setSelectedFile] = useState({});

    const showProgressBar = () => {
        setProgressBarOpen(!progressBarOpen);
    }

    const showPreviewModal = (file) => {
        if (file.type === "folder") return;

        setSelectedFile(file);
        setPreviewOpen(true);
    }

    const closePreviewModal = () => {
        setSelectedFile({});
        setPreviewOpen(false);
    }

    const handleUpload = () => {
        showUploadModal();
        if (!progressBarOpen) showProgressBar();

        pendingToReadyUpdateFile();
        setQueue(prev => [...prev, ...pendingFiles])

        setRendering(true);
    };

    // readyFiles 변경 감지
    useEffect(() => {
        if (rendering && readyFiles.length > 0) {
            processQueue();
            setRendering(false);
        }
    }, [readyFiles, rendering]);

    useEffect(() => {
        const fetchRootFolder = async () => {
            const response = await gateway.post("/nas/api/v1/folder/root");

            if (response.status === 200 && response.code === "0000") {
                sessionStorage.setItem("_rf", response.data.folderId);
                sessionStorage.setItem("_af", response.data.folderId);
                setActiveFolderId(response.data.folderId);
            }
        }

        fetchRootFolder();
    }, []);

    return (
        <div className="storage-layout">
            <div className="storage-main-content">
                <FileGrid
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    viewMode={viewMode}
                    activeFolderId={activeFolderId}
                    showPreviewModal={showPreviewModal}
                />

                <MobileNav
                    onUploadClick={() => setIsUploadModalOpen(true)}
                    progressBarOpen={showProgressBar}
                    uploadingCount={uploadingFiles.length}
                />
            </div>

            {previewOpen && (
                <PreviewModal
                    closePreviewModal={closePreviewModal}
                    activeFolderId={activeFolderId}
                    selectedFile={selectedFile}
                />
            )}

            {isUploadModalOpen && (
                <UploadModal
                    showUploadModal={showUploadModal}
                    handleUpload={handleUpload}
                    pendingFiles={pendingFiles}
                />
            )}

            {progressBarOpen && (
                <UploadProgressBar />
            )}
        </div>
    );
}