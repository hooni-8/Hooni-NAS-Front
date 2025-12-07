import React, { useState } from 'react';
import {
    Folder,
    FileText,
    Image,
    Video,
    Music,
    MoreVertical,
    Download,
    Share2,
    Star,
    Trash2
} from 'lucide-react';

import "@styles/pages/components/file/FileCard.scss"

export default function FileCard ({file}) {
    const [showMenu, setShowMenu] = useState(false);

    const getFileIcon = () => {
        switch (file.type) {
            case 'folder':
                return <Folder className="card-icon folder-icon" />;
            case 'document':
                return <FileText className="card-icon document-icon" />;
            case 'image':
                return <Image className="card-icon image-icon" />;
            case 'video':
                return <Video className="card-icon video-icon" />;
            case 'audio':
                return <Music className="card-icon audio-icon" />;
            default:
                return <FileText className="card-icon default-icon" />;
        }
    };

    const getFileColor = () => {
        switch (file.type) {
            case 'folder':
                return 'file-card-bg-folder';
            case 'document':
                return 'file-card-bg-document';
            case 'image':
                return 'file-card-bg-image';
            case 'video':
                return 'file-card-bg-video';
            case 'audio':
                return 'file-card-bg-audio';
            default:
                return 'file-card-bg-default';
        }
    };

    return (
        <div className="file-card-wrapper group">
            <div className="file-card">
                <div className="file-card-relative">
                    <div className={`file-card-icon-container ${getFileColor()}`}>
                        {getFileIcon()}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="file-card-menu-button"
                    >
                        <MoreVertical className="file-card-menu-icon" />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="menu-backdrop"
                                onClick={() => setShowMenu(false)}
                            ></div>
                            <div className="file-card-menu-dropdown">
                                <button className="file-card-menu-item">
                                    <Download className="file-card-menu-item-icon" />
                                    <span>다운로드</span>
                                </button>
                                <button className="file-card-menu-item">
                                    <Share2 className="file-card-menu-item-icon" />
                                    <span>공유</span>
                                </button>
                                <button className="file-card-menu-item">
                                    <Star className="file-card-menu-item-icon" />
                                    <span>즐겨찾기</span>
                                </button>
                                <div className="file-card-menu-divider"></div>
                                <button className="file-card-menu-item file-card-menu-item-delete">
                                    <Trash2 className="file-card-menu-item-icon" />
                                    <span>삭제</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <div className="file-card-info">
                    <h3 className="file-card-name">{file.name}</h3>
                    <div className="file-card-meta">
                        <span>{file.size}</span>
                        <span className="file-card-date">
              {new Date(file.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}