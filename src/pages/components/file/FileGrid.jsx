import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import * as gateway from "@components/common/gateway/Gateway";
import * as format from "@components/utils/Format";

import { useFileUpload } from "@hooks/useFileUpload";
import { useAuth } from "@hooks/useAuth";
import { useModal } from "@hooks/useModal";

import GridView from '@pages/components/file/view/grid/GridView';
import ListView from '@pages/components/file/view/list/ListView';

import PreviewModal from '@pages/components/modal/PreviewModal';
import ReNameModal from '@pages/components/modal/ReNameModal';
import CreateFolderModal from "@pages/components/modal/CreateFolderModal";
import UploadModal from '@pages/components/modal/UploadModal';
import UploadProgressBar from "@pages/components/loding/UploadProgressBar";

import "@styles/pages/components/file/FileGrid.scss"

export default function FileGrid({ selectedCategory, searchQuery, viewMode }) {

    const { folderId } = useParams();
    const navigate = useNavigate();

    const { rootFolder } = useAuth();
    const { modal, openModal, closeModal } = useModal();
    const { setQueue, pendingToReadyUpdateFile, pendingFiles, readyFiles, deleteStatusFile, processQueue, uploadDoneAt, setUploadDoneAt } = useFileUpload();

    const [folderInfo, setFolderInfo] = useState('');
    const [fileList, setFileList] = useState([]);

    const [selectedFile, setSelectedFile] = useState({});

    // 미리보기 및 폴더 이동
    const showPreviewModal = (file) => {
        if (file.itemType === "FOLDER") {
            navigate(`/main/${file.itemId}`);
        } else {
            setSelectedFile(file);
            openModal("previewOpen");
        }
    }

    // 미리보기 종료
    const closePreviewModal = () => {
        setSelectedFile({});
        closeModal("previewOpen");
    }

    // 이름 바꾸기 모달 열기
    const showReNameModal = (file) => {
        setSelectedFile(file);
        openModal("reNameOpen");
    }

    // 이름 바꾸기 모달 닫기
    const closeReNameModal = () => {
        setSelectedFile({});
        closeModal("reNameOpen");
    }

    // 이름 바꾸기 성공 후
    const handleRenameAfter = (fileId, changeName) => {
        setFileList(prev =>
            prev.map(item =>
                item.itemId === fileId ? { ...item, itemName: changeName } : item
            )
        );
    };

    const closeUploadModal = (type) => {
        closeModal("uploadOpen");
        if (type === "CANCEL") {
            deleteStatusFile("PENDING");
        }
    }

    const handleUpload = () => {
        closeUploadModal();
        if (!modal.progressBarOpen) openModal("progressBarOpen");

        pendingToReadyUpdateFile();
        setQueue(prev => [...prev, ...pendingFiles])

        openModal("rendering");
    };

    // readyFiles 변경 감지
    useEffect(() => {
        if (modal.rendering && readyFiles.length > 0) {
            processQueue(folderId);
            closeModal("rendering");
        }
    }, [readyFiles, modal.rendering]);


    useEffect(() => {
        if (folderId) {
            fetchFileList();
        } else {
            rootFolder();
        }
    }, [uploadDoneAt, folderId]);

    const fetchFileList = async () => {

        try {
            const response = await gateway.post("/nas/api/v1/file/list", { folderId: folderId });

            if (response.status === 200 && response.code === "0000") {
                const convertedFiles = response.data.file.map(item => ({
                    ...item,
                    itemSize: item.itemType !== 'FOLDER' && format.formatBytes(item.itemSize),
                    itemType: item.itemType === 'FOLDER' ? 'FOLDER' : format.getFileType(item.extension),
                    itemDate: format.formatDate(item.lastModifiedAt),
                }));

                setFolderInfo(response.data.folderInfo);
                setFileList(convertedFiles);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploadDoneAt("");
        }
    };

    const filteredFiles = fileList.filter(file => {
        const matchesSearch = file.itemName.toLowerCase().includes(searchQuery.toLowerCase());
        return format.matchesCategory(matchesSearch, selectedCategory, file);
    });

    const handleBackFolder = () => {
        navigate(`/main/${folderInfo.parentFolderId}`);
    };

    return (
        <>
            {viewMode === 'list' ? (
                <ListView
                    filteredFiles={filteredFiles}
                    showPreviewModal={showPreviewModal}
                    showReNameModal={showReNameModal}
                    fetchFileList={fetchFileList}
                    handleBackFolder={handleBackFolder}
                    folderInfo={folderInfo}
                />
            ) : (
                <GridView
                    filteredFiles={filteredFiles}
                    showPreviewModal={showPreviewModal}
                    showReNameModal={showReNameModal}
                    fetchFileList={fetchFileList}
                    handleBackFolder={handleBackFolder}
                    folderInfo={folderInfo}
                />
            )}

            {modal.previewOpen && (
                <PreviewModal
                    closePreviewModal={closePreviewModal}
                    selectedFile={selectedFile}
                    fetchFileList={fetchFileList}
                />
            )}

            {modal.reNameOpen && (
                <ReNameModal
                    selectedFile={selectedFile}

                    handleRenameAfter={handleRenameAfter}
                    closeReNameModal={closeReNameModal}
                />
            )}

            {modal.createFolder && (
                <CreateFolderModal
                    fetchFileList={fetchFileList}
                />
            )}

            {modal.uploadOpen &&
                <UploadModal
                    closeUploadModal={closeUploadModal}
                    handleUpload={handleUpload}
                    pendingFiles={pendingFiles}
                />
            }

            {modal.progressBarOpen && (
                <UploadProgressBar />
            )}

        </>
    );
}