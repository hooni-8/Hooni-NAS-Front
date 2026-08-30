import React from "react";

import { useFileControl } from "@hooks/useFileControl";
import { useFileDownload } from "@hooks/useFileDownload";

import {Download, Trash2, FilePen} from "lucide-react";

export default function MenuDropdown({ file, setShowMenu, showReNameModal, fetchFileList }) {

    const { deleteFile } = useFileControl();
    const { singleDownload } = useFileDownload();

    const handleDeleteFile = (file) => {
        deleteFile(file, fetchFileList);

        setShowMenu(false);
    }

    const handleReNameModal = () => {
        showReNameModal(file)

        setShowMenu(false);
    }

    const handleDownload = (file) => {
        singleDownload(file);

        setShowMenu(false);
    }

    return (
        <>
            <div
                className="menu-backdrop"
                onClick={() => setShowMenu(false)}
            />
            <div className="file-card-menu-dropdown" role="menu" aria-label={`${file.itemName} 작업`}>
                <div className="mobile-file-menu-handle" aria-hidden="true" />

                <button type="button" className="file-card-menu-item"
                        onClick={() => handleDownload(file)}
                        role="menuitem"
                >
                    <Download className="file-card-menu-item-icon"/>
                    <span>다운로드</span>
                </button>

                <button type="button" className="file-card-menu-item"
                        onClick={handleReNameModal}
                        role="menuitem"
                >
                    <FilePen className="file-card-menu-item-icon"/>
                    <span>이름 바꾸기</span>
                </button>

                <div className="file-card-menu-divider"/>

                <button type="button" className="file-card-menu-item file-card-menu-item-delete"
                        onClick={() => handleDeleteFile(file)}
                        role="menuitem"
                >
                    <Trash2 className="file-card-menu-item-icon"/>
                    <span>삭제</span>
                </button>

            </div>
        </>
    )
}
