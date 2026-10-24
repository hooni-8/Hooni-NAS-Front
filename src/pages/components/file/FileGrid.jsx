import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import * as gateway from "@components/common/gateway/Gateway";
import * as format from "@components/utils/Format";

import { useFileUpload } from "@hooks/useFileUpload";
import { useAuth } from "@hooks/useAuth";
import { useFileControl } from "@hooks/useFileControl";
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
import { CheckSquare2, FolderOpen, Files, Trash2, X } from "lucide-react";

import "@styles/pages/components/file/FileGrid.scss"

export default function FileGrid({ selectedCategory, searchQuery, viewMode }) {

    const { folderId } = useParams();
    const navigate = useNavigate();

    const { rootFolderId } = useAuth();
    const { modal, openModal, closeModal } = useModal();
    const { deleteFiles } = useFileControl();
    const { setQueue, pendingToReadyUpdateFile, pendingFiles, readyFiles, deleteStatusFile, processQueue, uploadDoneAt, setUploadDoneAt } = useFileUpload();
    const selectAllRef = useRef(null);

    const [folderInfo, setFolderInfo] = useState('');
    const [fileList, setFileList] = useState([]);
    const [folderNotFound, setFolderNotFound] = useState(false);
    const [fileLoadError, setFileLoadError] = useState(false);

    const [selectedFile, setSelectedFile] = useState({});
    const [selectedFileIds, setSelectedFileIds] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        setOpenMenuId(null);
        setSelectedFileIds([]);
    }, [folderId, selectedCategory, searchQuery]);

    useEffect(() => {
        setOpenMenuId(null);
    }, [viewMode]);

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

            if (response.status === 200 && response.code === "0000") {
                const data = response.data;
                const folder = data.folderInfo;
                if (!folder) {
                    setFolderNotFound(true);
                    setFileLoadError(false);
                    setFolderInfo('');
                    setFileList([]);
                    return;
                }

                const convertedFiles = (data.file ?? []).map(item => ({
                    ...item,
                    itemSize: item.itemType !== 'FOLDER' && format.formatBytes(item.itemSize),
                    itemType: item.itemType === 'FOLDER' ? 'FOLDER' : format.getFileType(item.extension),
                    itemDate: format.formatDate(item.lastModifiedAt),
                }));

                setFolderNotFound(false);
                setFileLoadError(false);
                setFolderInfo(folder);
                setFileList(convertedFiles);
                setSelectedFileIds(current => current.filter(id => (
                    convertedFiles.some(file => file.itemId === id)
                )));
                return;
            }

            if (response?.status === 404) {
                setFolderNotFound(true);
                setFileLoadError(false);
                setFolderInfo('');
                setFileList([]);
                return;
            }

            setFolderNotFound(false);
            setFileLoadError(true);
            setFolderInfo('');
            setFileList([]);
        } catch (e) {
            console.error(e);

            if (e.response?.status === 404) {
                setFolderNotFound(true);
                setFileLoadError(false);
                setFolderInfo('');
                setFileList([]);
                return;
            }

            setFolderNotFound(false);
            setFileLoadError(true);
            setFolderInfo('');
            setFileList([]);
        }
    }, [folderId]);

    const retryLoad = useCallback(async () => {
        setFileLoadError(false);

        if (!folderId) {
            setFileLoadError(true);
            return;
        }

        await fetchFileList();
    }, [fetchFileList, folderId]);

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

    const selectedFiles = useMemo(() => (
        fileList.filter(file => selectedFileIds.includes(file.itemId))
    ), [fileList, selectedFileIds]);

    const allFilteredSelected = filteredFiles.length > 0 && filteredFiles.every(file => (
        selectedFileIds.includes(file.itemId)
    ));
    const someFilteredSelected = filteredFiles.some(file => selectedFileIds.includes(file.itemId));

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someFilteredSelected && !allFilteredSelected;
        }
    }, [allFilteredSelected, someFilteredSelected]);

    const toggleFileSelection = useCallback((fileId) => {
        setOpenMenuId(null);
        setSelectedFileIds(current => (
            current.includes(fileId)
                ? current.filter(id => id !== fileId)
                : [...current, fileId]
        ));
    }, []);

    const toggleSelectAll = () => {
        const filteredIds = filteredFiles.map(file => file.itemId);
        setOpenMenuId(null);
        setSelectedFileIds(current => {
            if (allFilteredSelected) {
                return current.filter(id => !filteredIds.includes(id));
            }
            return [...new Set([...current, ...filteredIds])];
        });
    };

    const handleDeleteSelected = () => {
        deleteFiles(selectedFiles, async () => {
            await fetchFileList();
            setSelectedFileIds([]);
        });
    };

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
                    <div className="nas-file-heading-actions">
                        {fileList.length > 0 && (
                            <label className="file-select-all file-select-all-compact">
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    checked={allFilteredSelected}
                                    disabled={filteredFiles.length === 0}
                                    onChange={toggleSelectAll}
                                />
                                <span>전체 선택</span>
                            </label>
                        )}
                        <div className="nas-file-count">
                            <Files aria-hidden="true" />
                            <strong>{fileList.length}</strong>개 항목
                        </div>
                    </div>
                </section>
            )}

            {!folderNotFound && !fileLoadError && selectedFiles.length > 0 && (
                <section className="file-selection-toolbar" aria-label="파일 다중 선택 작업" aria-live="polite">
                    <div className="file-selection-summary">
                        <span className="file-selection-icon"><CheckSquare2 aria-hidden="true" /></span>
                        <div>
                            <strong>{selectedFiles.length}개 선택됨</strong>
                            <span>선택한 항목을 한 번에 휴지통으로 이동할 수 있어요.</span>
                        </div>
                    </div>
                    <div className="file-selection-actions">
                        <button
                            type="button"
                            className="file-selection-clear"
                            onClick={() => setSelectedFileIds([])}
                        >
                            <X aria-hidden="true" />
                            선택 해제
                        </button>
                        <button
                            type="button"
                            className="file-selection-delete"
                            onClick={handleDeleteSelected}
                        >
                            <Trash2 aria-hidden="true" />
                            선택 항목 삭제
                        </button>
                    </div>
                </section>
            )}

            {fileLoadError ? (
                <FileLoadErrorView
                    onRetry={retryLoad}
                    onGoToRoot={() => rootFolderId && navigate(`/main/${rootFolderId}`, { replace: true })}
                />
            ) : folderNotFound ? (
                <FolderNotFoundView
                    onGoToRoot={() => rootFolderId && navigate(`/main/${rootFolderId}`, { replace: true })}
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
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    selectedFileIds={selectedFileIds}
                    toggleFileSelection={toggleFileSelection}
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
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    selectedFileIds={selectedFileIds}
                    toggleFileSelection={toggleFileSelection}
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
