import React, {memo, useState} from 'react';
import * as format from "@components/utils/Format";

import MenuDropdown from "@pages/components/file/MenuDropdown";

import "@styles/pages/components/file/FileListItem.scss";
import { MoreVertical } from 'lucide-react';

const FileListItem = memo(({ file }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="file-list-item group">
            <div className="file-item-content">
                <div className="file-item-name-section">
                    <div className="file-icon-wrapper">
                        {format.getListFileIcon(file)}
                    </div>
                    <div className="file-name-info">
                        <span className="file-name">{file.name}</span>
                        <div className="file-meta-mobile">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>
                                {file.dateText}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="file-item-size">
                    {file.size}
                </div>

                <div className="file-item-date">
                    {file.dateText}
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
                        <MenuDropdown setShowMenu={setShowMenu} />
                    )}
                </div>
            </div>
        </div>
    );
});

export default FileListItem;