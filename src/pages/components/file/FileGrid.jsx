import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import * as gateway from "@components/common/gateway/Gateway";
import * as format from "@components/utils/Format";

import { useFileUpload } from "@hooks/useFileUpload";
import { useAuth } from "@hooks/useAuth";
import { useModal } from "@hooks/useModal";

import GridView from '@pages/components/file/view/grid/GridView';
import ListView from '@pages/components/file/view/list/ListView';
import FolderNotFoundView from '@pages/components/file/FolderNotFoundView';

import PreviewModal from '@pages/components/modal/PreviewModal';
import ReNameModal from '@pages/components/modal/ReNameModal';
import CreateFolderModal from "@pages/components/modal/CreateFolderModal";
import UploadModal from '@pages/components/modal/UploadModal';
import UploadProgressBar from "@pages/components/loding/UploadProgressBar";
import FileLoadErrorView from "@pages/components/file/FileLoadErrorView";
import { FolderOpen, Files } from "lucide-react";

import "@styles/pages/components/file/FileGrid.scss"

export default function FileGrid({ selectedCategory, searchQuery, viewMode }) {

    const { folderId } = useParams();
    const navigate = useNavigate();

    const { rootFolder } = useAuth();
    const { modal, openModal, closeModal } = useModal();
    const { setQueue, pendingToReadyUpdateFile, pendingFiles, readyFiles, deleteStatusFile, processQueue, uploadDoneAt, setUploadDoneAt } = useFileUpload();

    const [folderInfo, setFolderInfo] = useState('');
    const [fileList, setFileList] = useState([]);
    const [folderNotFound, setFolderNotFound] = useState(false);
    const [fileLoadError, setFileLoadError] = useState(false);

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
    }, [closeModal, folderId, modal.rendering, processQueue, readyFiles]);

    const fetchFileList = useCallback(async () => {

        try {
            const response = await gateway.post("/nas/api/v1/file/list", { folderId: folderId });

            if (response.status === 404) {
                setFolderNotFound(true);
                setFileLoadError(false);
                setFolderInfo('');
                setFileList([]);
                return;
            }

            if (response.status === 200 && response.code === "0000") {
                const folder = response.data?.folderInfo;
                if (!folder) {
                    setFolderNotFound(true);
                    setFileLoadError(false);
                    setFolderInfo('');
                    setFileList([]);
                    return;
                }

                const convertedFiles = (response.data.file ?? []).map(item => ({
                    ...item,
                    itemSize: item.itemType !== 'FOLDER' && format.formatBytes(item.itemSize),
                    itemType: item.itemType === 'FOLDER' ? 'FOLDER' : format.getFileType(item.extension),
                    itemDate: format.formatDate(item.lastModifiedAt),
                }));

                setFolderNotFound(false);
                setFileLoadError(false);
                setFolderInfo(folder);
                setFileList(convertedFiles);
                return;
            }

            setFolderNotFound(false);
            setFileLoadError(true);
            setFolderInfo('');
            setFileList([]);
        } catch (e) {
            console.error(e);
            setFolderNotFound(false);
            setFileLoadError(true);
            setFolderInfo('');
            setFileList([]);
        }
    }, [folderId]);

    const retryLoad = useCallback(async () => {
        setFileLoadError(false);

        if (folderId) {
            await fetchFileList();
            return;
        }

        const hasRootFolder = await rootFolder();
        if (!hasRootFolder) {
            setFileLoadError(true);
        }
    }, [fetchFileList, folderId, rootFolder]);

    useEffect(() => {
        retryLoad();
    }, [retryLoad]);

    useEffect(() => {
        if (!uploadDoneAt) {
            return;
        }

        fetchFileList();
        setUploadDoneAt("");
    }, [fetchFileList, setUploadDoneAt, uploadDoneAt]);

    const filteredFiles = fileList.filter(file => {
        const matchesSearch = file.itemName.toLowerCase().includes(searchQuery.toLowerCase());
        return format.matchesCategory(matchesSearch, selectedCategory, file);
    });

    const isRootFolder = !folderInfo || folderInfo.folderId === folderInfo.parentFolderId;

    const handleBackFolder = () => {
        navigate(`/main/${folderInfo.parentFolderId}`);
    };

    return (
        <>
            {!folderNotFound && !fileLoadError && (
                <section className="nas-file-heading" aria-label="현재 폴더 정보">
                    <div className="nas-file-heading-copy">
                        <span className="nas-file-heading-eyebrow">MY STORAGE</span>
                        <h1>
                            <FolderOpen aria-hidden="true" />
                            {isRootFolder ? "내 파일" : folderInfo.folderName}
                        </h1>
                        <p>파일을 정리하고 필요한 순간에 빠르게 꺼내보세요.</p>
                    </div>
                    <div className="nas-file-count">
                        <Files aria-hidden="true" />
                        <strong>{fileList.length}</strong>개 항목
                    </div>
                </section>
            )}

            {fileLoadError ? (
                <FileLoadErrorView
                    onRetry={retryLoad}
                    onGoToRoot={() => navigate("/main", { replace: true })}
                />
            ) : folderNotFound ? (
                <FolderNotFoundView
                    onGoToRoot={() => navigate("/main", { replace: true })}
                    onGoBack={() => navigate(-1)}
                />
            ) : viewMode === 'list' ? (
                <ListView
                    filteredFiles={filteredFiles}
                    hasFiles={fileList.length > 0}
                    showPreviewModal={showPreviewModal}
                    showReNameModal={showReNameModal}
                    fetchFileList={fetchFileList}
                    handleBackFolder={handleBackFolder}
                    folderInfo={folderInfo}
                    onUpload={() => openModal("uploadOpen")}
                    onCreateFolder={() => openModal("createFolder")}
                />
            ) : (
                <GridView
                    filteredFiles={filteredFiles}
                    hasFiles={fileList.length > 0}
                    showPreviewModal={showPreviewModal}
                    showReNameModal={showReNameModal}
                    fetchFileList={fetchFileList}
                    handleBackFolder={handleBackFolder}
                    folderInfo={folderInfo}
                    onUpload={() => openModal("uploadOpen")}
                    onCreateFolder={() => openModal("createFolder")}
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
