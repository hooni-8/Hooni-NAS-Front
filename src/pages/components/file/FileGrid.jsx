import React, {useEffect, useState} from 'react';
import { VirtuosoGrid, Virtuoso } from "react-virtuoso";

import * as gateway from "@components/common/Gateway";
import * as format from "@components/utils/Format";
import { useUpload } from "@pages/components/loding/UploadProvider";
import { GridComponents } from "@pages/components/file/GridComponents";

import EmptyFile from "@pages/components/file/EmptyFile";
import FileCard from '@pages/components/file/FileCard';
import FileListItem from '@pages/components/file/FileListItem';

import "@styles/pages/components/file/FileGrid.scss"

export default function FileGrid({ selectedCategory, searchQuery, viewMode, activeFolderId }) {
    const [fileList, setFileList] = useState([]);
    const { uploadDoneAt, setUploadDoneAt } = useUpload();

    useEffect(() => {
        if (activeFolderId) {
            fetchFileList();
        }
    }, [uploadDoneAt, activeFolderId]);

    const fetchFileList = async () => {

        const payload = {
            activeFolderId: sessionStorage.getItem("_af")
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

    if (filteredFiles.length === 0) {
        return (
            <EmptyFile />
        );
    }

    if (viewMode === 'list') {
        return (
            <div className="file-grid-container list-view">
                <div className="list-wrapper">
                    <div className="list-header">
                        <div>이름</div>
                        <div>크기</div>
                        <div>수정일</div>
                        <div className="list-header-action"></div>
                    </div>

                    <Virtuoso
                        style={{ flex: 1 }}
                        data={filteredFiles}
                        itemContent={(index, file) => (
                            <FileListItem file={file} />
                        )}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="file-grid-container grid-view">
                <VirtuosoGrid
                    data={filteredFiles}
                    components={GridComponents}
                    itemContent={(index, file) => (
                        <FileCard file={file} />
                    )}
                />
        </div>
    );
}