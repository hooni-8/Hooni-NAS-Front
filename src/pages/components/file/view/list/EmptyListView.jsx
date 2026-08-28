import React from "react";
import { ArrowLeft, FileSearch, FolderOpen, FolderPlus, Upload } from "lucide-react";

export default function EmptyListView({ handleBackFolder, canGoBack, isFiltered, onUpload, onCreateFolder }) {

    const title = isFiltered ? "표시할 항목이 없어요" : "이 폴더는 비어 있어요";
    const description = isFiltered
        ? "검색어 또는 카테고리를 바꿔 다시 확인해보세요."
        : "파일을 업로드하거나 새 폴더를 만들어 시작할 수 있어요.";

    return (
        <div className="file-list-empty">
            <div className="file-list-empty-icon" aria-hidden="true">
                {isFiltered ? <FileSearch /> : <FolderOpen />}
            </div>
            <div className="file-list-empty-copy">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className="file-list-empty-actions">
                {!isFiltered && (
                    <>
                        <button type="button" className="file-list-empty-primary" onClick={onUpload}>
                            <Upload size={16} />
                            파일 업로드
                        </button>
                        <button type="button" className="file-list-empty-secondary" onClick={onCreateFolder}>
                            <FolderPlus size={16} />
                            폴더 만들기
                        </button>
                    </>
                )}
                {canGoBack && (
                    <button type="button" className="file-list-empty-back" onClick={handleBackFolder}>
                        <ArrowLeft size={16} />
                        상위 폴더
                    </button>
                )}
            </div>
        </div>
    );
}
