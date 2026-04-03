import React, {useEffect, useState} from 'react';

import * as gateway from "@components/common/gateway/Gateway";
import * as format from "@components/utils/Format";

import { useUpload } from "@pages/components/loding/UploadProvider";

import GridView from '@pages/components/file/view/grid/GridView';
import ListView from '@pages/components/file/view/list/ListView';

import "@styles/pages/components/file/FileGrid.scss"

export default function FileGrid({ selectedCategory, searchQuery, viewMode, activeFolderId, setActiveFolderId, showPreviewModal, rootFolderFlag }) {

    const { uploadDoneAt, setUploadDoneAt } = useUpload();

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (activeFolderId) {
            fetchFileList();
        }
    }, [uploadDoneAt, activeFolderId]);

    const fetchFileList = async () => {

        const payload = {
            activeFolderId: activeFolderId
        }

        try {
            const response = await gateway.post("/nas/api/v1/file/list", payload);

            if (response.status === 200 && response.code === "0000") {
                const convertedFiles = response.data.map(file => ({
                    ...file,
                    id: file.itemId,
                    name: file.itemName,
                    size: file.itemType !== 'folder' && format.formatBytes(file.itemSize),
                    type: file.itemType === 'folder' ? 'folder' : format.getFileType(file.extension),
                    dateText: new Date(file.lastModifiedAt).toLocaleDateString('ko-KR'),
                }));

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
        const _rf = sessionStorage.getItem("_rf");

        sessionStorage.setItem("_af", _rf);
        setActiveFolderId(_rf);
    };

    return (
        <>
            {viewMode === 'list' ? (
                <ListView
                    filteredFiles={filteredFiles}
                    showPreviewModal={showPreviewModal}
                    fetchFileList={fetchFileList}
                    handleBackFolder={handleBackFolder}
                    rootFolderFlag={rootFolderFlag}
                />
            ) : (
                <GridView
                    activeFolderId={activeFolderId}
                    filteredFiles={filteredFiles}
                    showPreviewModal={showPreviewModal}
                    fetchFileList={fetchFileList}
                    handleBackFolder={handleBackFolder}
                    rootFolderFlag={rootFolderFlag}
                />
            )}
        </>
    );
}