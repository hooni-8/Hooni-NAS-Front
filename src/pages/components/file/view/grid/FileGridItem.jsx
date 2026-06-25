import React, {useEffect, useState} from 'react';
import * as gateway from "@components/common/gateway/Gateway";
import * as format from "@components/utils/Format";

import MenuDropdown from "@pages/components/file/MenuDropdown";

import "@styles/pages/components/file/FileGridItem.scss"
import { MoreVertical } from 'lucide-react';

const thumbnailCache = new Map();

const FileGridItem = React.memo(({
                                     file,
                                     folderInfo,
                                     fetchFileList,

                                     showPreviewModal,
                                     showReNameModal
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const [thumbUrl, setThumbUrl] = useState(null);
    const [thumbError, setThumbError] = useState(false);

    useEffect(() => {
        if (file.itemType !== "image" && file.itemType !== "video") return;

        if (thumbnailCache.has(file.itemId)) {
            setThumbUrl(thumbnailCache.get(file.itemId));
            return;
        }

        const fetchThumbnail = async () => {
            try {
                const response = await gateway.getBlob( `/nas/api/v1/file/thumbnail/${file.itemId}`, {folderId: folderInfo.folderId} );

                const url = URL.createObjectURL(response.data);
                thumbnailCache.set(file.itemId, url);
                setThumbUrl(url);
            } catch (e) {
                setThumbError(true);
            }
        };

        fetchThumbnail();
    }, [file.itemId]);

    return (
        <div className="file-card-wrapper group">
            <div className="file-card" onDoubleClick={() => showPreviewModal(file)} >
                <div className="file-card-relative">
                    <div className={`file-card-icon-container ${format.getFileColor(file)}`}>
                        {(file.itemType === "image" || file.itemType === "video") && thumbUrl && !thumbError ? (
                            <img src={thumbUrl} alt={file.itemName} loading="lazy" />
                        ) : (
                            format.getFileIcon(file)
                        )}
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
                        <MenuDropdown
                            file={file}
                            setShowMenu={setShowMenu}
                            showReNameModal={showReNameModal}
                            fetchFileList={fetchFileList}
                        />
                    )}

                </div>
                <div className="file-card-info">
                    <h3 className="file-card-name">{file.itemName}</h3>
                    <div className="file-card-meta">
                        <span>{file.itemSize}</span>
                        <span>{file.itemDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default FileGridItem;