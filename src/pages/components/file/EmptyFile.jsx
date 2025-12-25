import React from "react";

export default function EmptyFile() {
    return (
        <div className="file-grid-empty">
            <div className="empty-content">
                <div className="empty-icon-wrapper">
                    <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                </div>
                <h3 className="empty-title">파일이 없습니다</h3>
                <p className="empty-description">파일을 업로드하거나 다른 카테고리를 선택해보세요</p>
            </div>
        </div>
    )
}