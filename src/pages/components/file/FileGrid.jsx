import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import * as gateway from "@components/common/gateway/Gateway";
import * as format from "@components/utils/Format";

import { useUpload } from "@pages/components/loding/UploadProvider";
import { useAuth } from "@layout/auth/AuthContext";

import GridView from '@pages/components/file/view/grid/GridView';
import ListView from '@pages/components/file/view/list/ListView';
import PreviewModal from '@pages/components/modal/PreviewModal';

import "@styles/pages/components/file/FileGrid.scss"

export default function FileGrid({ selectedCategory, searchQuery, viewMode }) {

    const { folderId } = useParams();
    const navigate = useNavigate();

    const { uploadDoneAt, setUploadDoneAt } = useUpload();
    const { rootFolder } = useAuth();

    const [folderInfo, setFolderInfo] = useState('');
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [selectedFile, setSelectedFile] = useState({});

    // 미리보기 및 폴더 이동
    const showPreviewModal = (file) => {
        if (file.type === "FOLDER") {
            navigate(`/main/${file.itemId}`);
        } else {
            setSelectedFile(file);
            setPreviewOpen(true);
        }
    }

    // 미리보기 종료
    const closePreviewModal = () => {
        setSelectedFile({});
        setPreviewOpen(false);
    }

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
                const convertedFiles = response.data.file.map(file => ({
                    ...file,
                    id: file.itemId,
                    name: file.itemName,
                    size: file.itemType !== 'FOLDER' && format.formatBytes(file.itemSize),
                    type: file.itemType === 'FOLDER' ? 'FOLDER' : format.getFileType(file.extension),
                    dateText: new Date(file.lastModifiedAt).toLocaleDateString('ko-KR'),
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
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
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
                    fetchFileList={fetchFileList}
                    handleBackFolder={handleBackFolder}
                    folderInfo={folderInfo}
                />
            ) : (
                <GridView
                    folderId={folderId}
                    filteredFiles={filteredFiles}
                    showPreviewModal={showPreviewModal}
                    fetchFileList={fetchFileList}
                    handleBackFolder={handleBackFolder}
                    folderInfo={folderInfo}
                />
            )}

            {previewOpen && (
                <PreviewModal
                    closePreviewModal={closePreviewModal}
                    selectedFile={selectedFile}
                />
            )}
        </>
    );
}