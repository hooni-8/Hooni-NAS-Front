import React, {memo, useState} from 'react';
import * as format from "@components/utils/Format";

import MenuDropdown from "@pages/components/file/MenuDropdown";

import "@styles/pages/components/file/FileListItem.scss";
import { MoreVertical } from 'lucide-react';

const FileListItem = memo(({
                               file,
                               fetchFileList,

                               showPreviewModal,
                               showReNameModal
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleOpenFile = () => {
        showPreviewModal(file);
    };

    const handleItemKeyDown = (event) => {
        if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) {
            return;
        }

        event.preventDefault();
        handleOpenFile();
    };

    return (
        <div className="file-list-item group">
            <div
                className="file-item-content"
                role="button"
                tabIndex={0}
                aria-label={`${file.itemName} 열기`}
                onClick={handleOpenFile}
                onKeyDown={handleItemKeyDown}
            >
                <div className="file-item-name-section">
                    <div className="file-icon-wrapper">
                        {format.getListFileIcon(file)}
                    </div>
                    <div className="file-name-info">
                        <span className="file-name">{file.itemName}</span>
                        <div className="file-meta-mobile">
                            {file.itemSize && (
                                <>
                                    <span>{file.itemSize}</span>
                                    <span>•</span>
                                </>
                                )}
                            <span>
                                {file.itemDate}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="file-item-size">
                    {file.itemSize}
                </div>

                <div className="file-item-date">
                    {file.itemDate}
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
                        <MenuDropdown
                            file={file}
                            setShowMenu={setShowMenu}
                            showReNameModal={showReNameModal}
                            fetchFileList={fetchFileList}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});

export default FileListItem;
