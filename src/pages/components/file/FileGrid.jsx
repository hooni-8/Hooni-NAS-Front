import React from 'react';
import FileCard from '@pages/components/file/FileCard';
import FileListItem from '@pages/components/file/FileListItem';

import "@styles/pages/components/file/FileGrid.scss"

export default function FileGrid({ fileList, viewMode }) {
    if (fileList.length === 0) {
        return (
            <div className="file-grid-empty">
                <div className="empty-content">
                    <div className="empty-icon-wrapper">
                        <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="empty-title">파일이 없습니다</h3>
                    <p className="empty-description">파일을 업로드하거나 다른 카테고리를 선택해보세요</p>
                </div>
            </div>
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
                    {fileList.map(file => (
                        <FileListItem key={file.id} file={file} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="file-grid-container grid-view">
            <div className="grid-wrapper">
                {fileList.map(file => (
                    <FileCard key={file.id} file={file} />
                ))}
            </div>
        </div>
    );
}