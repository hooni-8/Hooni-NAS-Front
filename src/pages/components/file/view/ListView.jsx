import React from "react";

import { Virtuoso } from "react-virtuoso";

import FileListItem from '@pages/components/file/FileListItem';

export default function ListView({ filteredFiles, showPreviewModal, fetchFileList }) {

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
                    style={{flex: 1}}
                    data={filteredFiles}
                    itemContent={(index, file) => (
                        <FileListItem
                            file={file}
                            showPreviewModal={showPreviewModal}
                            fetchFileList={fetchFileList}
                        />
                    )}
                />
            </div>
        </div>
    );
}