import React from "react";

import { useFileControl } from "@hooks/useFileControl";
import { useFileDownload } from "@hooks/useFileDownload";

import {Download, Share2, Star, Trash2, FilePen} from "lucide-react";

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

    const handleShare = (file) => {

        setShowMenu(false);
    }

    const handleStar = (file) => {

        setShowMenu(false);
    }

    return (
        <>
            <div
                className="menu-backdrop"
                onClick={() => setShowMenu(false)}
            />
            <div className="file-card-menu-dropdown">

                <button className="file-card-menu-item"
                        onClick={() => handleDownload(file)}
                >
                    <Download className="file-card-menu-item-icon"/>
                    <span>다운로드</span>
                </button>

                <button className="file-card-menu-item"
                        onClick={handleReNameModal}
                >
                    <FilePen className="file-card-menu-item-icon"/>
                    <span>이름 바꾸기</span>
                </button>

                <button className="file-card-menu-item"
                        onClick={() => handleShare(file)}
                >
                    <Share2 className="file-card-menu-item-icon"/>
                    <span>공유</span>
                </button>

                <button className="file-card-menu-item"
                        onClick={() => handleStar(file)}
                >
                    <Star className="file-card-menu-item-icon"/>
                    <span>즐겨찾기</span>
                </button>

                <div className="file-card-menu-divider"/>

                <button className="file-card-menu-item file-card-menu-item-delete"
                        onClick={() => handleDeleteFile(file)}
                >
                    <Trash2 className="file-card-menu-item-icon"/>
                    <span>삭제</span>
                </button>

            </div>
        </>
    )
}