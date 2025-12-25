import React from "react";

import {Download, Share2, Star, Trash2} from "lucide-react";

export default function MenuDropdown({ setShowMenu }) {
    return (
        <>
            <div
                className="menu-backdrop"
                onClick={() => setShowMenu(false)}
            ></div>
            <div className="file-card-menu-dropdown">
                <button className="file-card-menu-item">
                    <Download className="file-card-menu-item-icon"/>
                    <span>다운로드</span>
                </button>
                <button className="file-card-menu-item">
                    <Share2 className="file-card-menu-item-icon"/>
                    <span>공유</span>
                </button>
                <button className="file-card-menu-item">
                    <Star className="file-card-menu-item-icon"/>
                    <span>즐겨찾기</span>
                </button>
                <div className="file-card-menu-divider"></div>
                <button className="file-card-menu-item file-card-menu-item-delete">
                    <Trash2 className="file-card-menu-item-icon"/>
                    <span>삭제</span>
                </button>
            </div>
        </>
    )
}