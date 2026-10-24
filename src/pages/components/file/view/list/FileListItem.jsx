import React, {memo, useId, useRef} from 'react';
import * as format from "@components/utils/Format";

import MenuDropdown from "@pages/components/file/MenuDropdown";

import "@styles/pages/components/file/FileListItem.scss";
import { MoreVertical } from 'lucide-react';

const FileListItem = memo(({
                               file,
                               fetchFileList,

                               showPreviewModal,
                               showReNameModal,
                               openMenuId,
                               setOpenMenuId,
                               selected,
                               toggleFileSelection
}) => {
    const showMenu = openMenuId === file.itemId;
    const menuButtonRef = useRef(null);
    const menuId = useId();

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
        <div className={`file-list-item group${selected ? " is-selected" : ""}`}>
            <div
                className={`file-item-content${selected ? " is-selected" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`${file.itemName} 열기`}
                onClick={handleOpenFile}
                onKeyDown={handleItemKeyDown}
            >
                <label
                    className="file-list-select"
                    aria-label={`${file.itemName} 선택`}
                    onClick={(event) => event.stopPropagation()}
                >
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleFileSelection(file.itemId)}
                    />
                </label>
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
                        ref={menuButtonRef}
                        type="button"
                        aria-label={`${file.itemName} 작업 메뉴`}
                        aria-haspopup="menu"
                        aria-expanded={showMenu}
                        aria-controls={showMenu ? menuId : undefined}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId((current) => current === file.itemId ? null : file.itemId);
                        }}
                        className="menu-button"
                    >
                        <MoreVertical className="menu-icon" />
                    </button>

                    {showMenu && (
                        <MenuDropdown
                            file={file}
                            menuId={menuId}
                            triggerRef={menuButtonRef}
                            onClose={() => setOpenMenuId(null)}
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
