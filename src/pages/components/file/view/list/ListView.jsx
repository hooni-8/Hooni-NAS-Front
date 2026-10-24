import React from "react";

import { Virtuoso } from "react-virtuoso";

import FileListItem from '@pages/components/file/view/list/FileListItem';
import EmptyListView from "@pages/components/file/view/list/EmptyListView";
import FileListBackItem from '@pages/components/file/view/list/FileListBackItem';

export default function ListView({
                                     folderInfo,
                                     filteredFiles,
                                     showPreviewModal,
                                     showReNameModal,
                                     fetchFileList,
                                     handleBackFolder,
                                     hasFiles,
                                     onUpload,
                                     onCreateFolder,
                                     openMenuId,
                                     setOpenMenuId,
                                     selectedFileIds,
                                     toggleFileSelection
}) {

    const data = folderInfo && folderInfo.folderId !== folderInfo.parentFolderId ? [{ type: "back" }, ...filteredFiles] : filteredFiles;

    return (
        <div className="file-grid-container list-view">
            <div className="list-wrapper">
                <div className="list-header">
                    <div className="list-header-select" aria-hidden="true"></div>
                    <div>이름</div>
                    <div>크기</div>
                    <div>수정일</div>
                    <div className="list-header-action"></div>
                </div>

                {filteredFiles.length === 0 ? (
                    <EmptyListView
                        handleBackFolder={handleBackFolder}
                        canGoBack={folderInfo && folderInfo.folderId !== folderInfo.parentFolderId}
                        isFiltered={hasFiles}
                        onUpload={onUpload}
                        onCreateFolder={onCreateFolder}
                    />
                ) : (
                    <Virtuoso
                        style={{flex: 1}}
                        data={data}
                        itemContent={(index, file) => {
                            if (file.type === "back") {
                                return (
                                    <FileListBackItem
                                        handleBackFolder={handleBackFolder}
                                    />
                                )
                            }
                            return (
                                <FileListItem
                                    key={file.itemId}
                                    file={file}
                                    fetchFileList={fetchFileList}

                                    showPreviewModal={showPreviewModal}
                                    showReNameModal={showReNameModal}
                                    openMenuId={openMenuId}
                                    setOpenMenuId={setOpenMenuId}
                                    selected={selectedFileIds.includes(file.itemId)}
                                    toggleFileSelection={toggleFileSelection}
                                />
                            )
                        }}
                    />
                )}
            </div>
        </div>
    );
}
