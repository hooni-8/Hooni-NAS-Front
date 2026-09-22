import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useFileControl } from "@hooks/useFileControl";
import { useFileDownload } from "@hooks/useFileDownload";

import {Download, Trash2, FilePen} from "lucide-react";

export default function MenuDropdown({ file, menuId, triggerRef, onClose, showReNameModal, fetchFileList }) {

    const { deleteFile } = useFileControl();
    const { singleDownload } = useFileDownload();
    const menuRef = useRef(null);
    const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 1023px)").matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1023px)");
        const handleChange = (event) => setIsMobile(event.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        const handleOutsideInteraction = (event) => {
            if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
                onClose();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", handleOutsideInteraction);
        document.addEventListener("focusin", handleOutsideInteraction);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideInteraction);
            document.removeEventListener("focusin", handleOutsideInteraction);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, triggerRef]);

    const handleDeleteFile = (file) => {
        deleteFile(file, fetchFileList);

        onClose();
    }

    const handleReNameModal = () => {
        showReNameModal(file)

        onClose();
    }

    const handleDownload = (file) => {
        singleDownload(file);

        onClose();
    }

    const menu = (
        <div
            ref={menuRef}
            id={menuId}
            className="file-card-menu-dropdown"
            role="menu"
            aria-label={`${file.itemName} 작업`}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
        >
            <div className="mobile-file-menu-handle" aria-hidden="true" />

                {file.itemType !== "FOLDER" &&
                    <button type="button" className="file-card-menu-item"
                            onClick={() => handleDownload(file)}
                            role="menuitem"
                    >
                        <Download className="file-card-menu-item-icon"/>
                        <span>다운로드</span>
                    </button>
                }

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
    );

    // 모바일 바텀 시트는 가상 스크롤 영역과 카드의 transform 밖에 있어야 한다.
    return isMobile ? createPortal(menu, document.body) : menu;
}
