import { useState } from 'react';
import { Folder, FileText, Image, Video, Music, MoreVertical, Download, Share2, Star, Trash2 } from 'lucide-react';

import "@styles/pages/components/file/FileListItem.scss";

export default function FileListItem({ file }) {
    const [showMenu, setShowMenu] = useState(false);

    const getFileIcon = () => {
        const getColorClass = () => {
            switch (file.type) {
                case 'folder':
                    return { color: '#3b82f6' };
                case 'document':
                    return { color: '#f97316' };
                case 'image':
                    return { color: '#22c55e' };
                case 'video':
                    return { color: '#a855f7' };
                case 'audio':
                    return { color: '#ec4899' };
                default:
                    return { color: '#6b7280' };
            }
        };

        const iconProps = {
            className: 'file-icon',
            style: getColorClass()
        };

        switch (file.type) {
            case 'folder':
                return <Folder {...iconProps} />;
            case 'document':
                return <FileText {...iconProps} />;
            case 'image':
                return <Image {...iconProps} />;
            case 'video':
                return <Video {...iconProps} />;
            case 'audio':
                return <Music {...iconProps} />;
            default:
                return <FileText {...iconProps} />;
        }
    };

    return (
        <div className="file-list-item group">
            <div className="file-item-content">
                <div className="file-item-name-section">
                    <div className="file-icon-wrapper">
                        {getFileIcon()}
                    </div>
                    <div className="file-name-info">
                        <span className="file-name">{file.name}</span>
                        <div className="file-meta-mobile">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>
                {new Date(file.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
              </span>
                        </div>
                    </div>
                </div>

                <div className="file-item-size">
                    {file.size}
                </div>

                <div className="file-item-date">
                    {new Date(file.date).toLocaleDateString('ko-KR')}
                </div>

                <div className="file-item-action">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="menu-button"
                    >
                        <MoreVertical className="menu-icon" />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="menu-backdrop"
                                onClick={() => setShowMenu(false)}
                            ></div>
                            <div className="menu-dropdown">
                                <button className="menu-item">
                                    <Download className="menu-item-icon" />
                                    <span>다운로드</span>
                                </button>
                                <button className="menu-item">
                                    <Share2 className="menu-item-icon" />
                                    <span>공유</span>
                                </button>
                                <button className="menu-item">
                                    <Star className="menu-item-icon" />
                                    <span>즐겨찾기</span>
                                </button>
                                <div className="menu-divider"></div>
                                <button className="menu-item delete-item">
                                    <Trash2 className="menu-item-icon" />
                                    <span>삭제</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}