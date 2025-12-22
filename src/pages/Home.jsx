import React, {useEffect, useState} from 'react';
import {useOutletContext} from "react-router-dom";

import FileGrid from '@pages/components/file/FileGrid';
import MobileNav from '@layout/MobileNav';
import UploadModal from '@pages/components/modal/UploadModal';
import UploadProgressBar from "@pages/components/loding/UploadProgressBar";

import "@styles/pages/Home.scss"

import * as gateway from "@components/common/Gateway";
import * as format from "@components/utils/Format";

import { useUpload } from "@pages/components/loding/UploadProvider";

export default function Home() {

    const {
        selectedCategory,
        searchQuery,
        viewMode,
        isUploadModalOpen,
        setIsUploadModalOpen,
        showUploadModal,
    } = useOutletContext();

    const [progressBarOpen, setProgressBarOpen] = useState(false);
    const [rendering, setRendering] = useState(false);

    const { setQueue, uploadDoneAt, setUploadDoneAt, pendingToReadyUpdateFile, pendingFiles, readyFiles, uploadingFiles, processQueue} = useUpload();

    const [fileList, setFileList] = useState([]);

    const showProgressBar = () => {
        setProgressBarOpen(!progressBarOpen);
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
        getFileList()
    }, [uploadDoneAt]);

    const getFileList = async () => {
        try {
            const response = await gateway.post("/nas/api/v1/file/list");

            if (response.status === 200 && response.code === "0000") {
                const convertedFiles = response.data.map(file => ({
                    ...file,
                    id: file.fileId,
                    name: file.originName,
                    size: format.formatBytes(file.fileSize),
                    type: format.getFileType(file.extension),
                    date: file.lastModifiedAt
                }));

                setFileList(convertedFiles);

            } else {
                alert("목록을 불러오던 중 오류가 발생했습니다.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploadDoneAt('');
        }
    }

    const filteredFiles = fileList.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === 'all' ||
            (selectedCategory === 'folders' && file.type === 'folder') ||
            (selectedCategory === 'images' && file.type === 'image') ||
            (selectedCategory === 'documents' && file.type === 'document') ||
            (selectedCategory === 'videos' && file.type === 'video') ||
            (selectedCategory === 'audio' && file.type === 'audio');

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="storage-layout">
            <div className="storage-main-content">
                <FileGrid fileList={filteredFiles} viewMode={viewMode}/>

                <MobileNav
                    onUploadClick={() => setIsUploadModalOpen(true)}
                    progressBarOpen={showProgressBar}
                    uploadingCount={uploadingFiles.length}
                />
            </div>

            {isUploadModalOpen && (
                <UploadModal
                    showUploadModal={showUploadModal}
                    handleUpload={handleUpload}
                    pendingFiles={pendingFiles}
                />
            )}

            {progressBarOpen && (
                <UploadProgressBar
                    // files={uploadingFiles}
                    // onCancel={}
                    // onClose={}
                    // forceExpanded={}
                />
            )}
        </div>
    );
}