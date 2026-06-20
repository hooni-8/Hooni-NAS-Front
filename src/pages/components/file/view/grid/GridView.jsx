import React from "react";

import {VirtuosoGrid} from "react-virtuoso";
import { GridComponents } from "@pages/components/file/GridComponents";

import FileGridItem from '@pages/components/file/view/grid/FileGridItem';
import EmptyGridView from "@pages/components/file/view/grid/EmptyGridView";
import FileGridBackItem from '@pages/components/file/view/grid/FileGridBackItem';

export default function GridView({ folderId, filteredFiles, showPreviewModal, fetchFileList, handleBackFolder, folderInfo }) {

    const data = folderInfo && folderInfo.folderId !== folderInfo.parentFolderId ? [{ type: "back" }, ...filteredFiles] : filteredFiles;

    return (
        <div className="file-grid-container grid-view">
            { filteredFiles.length === 0 ? (
                <EmptyGridView
                    handleBackFolder={handleBackFolder}
                />
            ) : (
                <VirtuosoGrid
                    data={data}
                    components={GridComponents}
                    itemContent={(index, file) => {
                        if (file.type === "back") {
                            return (
                                <FileGridBackItem
                                    handleBackFolder={handleBackFolder}
                                />
                            )
                        }
                        return (
                            <FileGridItem
                                file={file}
                                folderId={folderId}
                                showPreviewModal={showPreviewModal}
                                fetchFileList={fetchFileList}
                            />
                        )
                    }}
                />
            )}
        </div>
    );
}