import React, {useEffect, useState} from 'react';
import * as gateway from "@components/common/gateway/Gateway";
import * as format from "@components/utils/Format";

import MenuDropdown from "@pages/components/file/MenuDropdown";

import "@styles/pages/components/file/FileGridItem.scss"
import { MoreVertical } from 'lucide-react';

const thumbnailCache = new Map();

const FileGridItem = React.memo(({ folderInfo, file, showPreviewModal, fetchFileList }) => {
    const [showMenu, setShowMenu] = useState(false);

    const [thumbUrl, setThumbUrl] = useState(null);
    const [thumbError, setThumbError] = useState(false);

    useEffect(() => {
        if (file.type !== "image" && file.type !== "video") return;

        if (thumbnailCache.has(file.id)) {
            setThumbUrl(thumbnailCache.get(file.id));
            return;
        }

        const fetchThumbnail = async () => {
            try {
                const response = await gateway.getBlob( `/nas/api/v1/file/thumbnail/${file.id}`, {folderId: folderInfo.folderId} );

                const url = URL.createObjectURL(response.data);
                thumbnailCache.set(file.id, url);
                setThumbUrl(url);
            } catch (e) {
                setThumbError(true);
            }
        };

        fetchThumbnail();
    }, [file.id]);

    return (
        <div className="file-card-wrapper group">
            <div className="file-card" onDoubleClick={() => showPreviewModal(file)} >
                <div className="file-card-relative">
                    <div className={`file-card-icon-container ${format.getFileColor(file)}`}>
                        {(file.type === "image" || file.type === "video") && thumbUrl && !thumbError ? (
                            <img src={thumbUrl} alt={file.name} loading="lazy" />
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
                            folderInfo={folderInfo}
                            setShowMenu={setShowMenu}
                            fetchFileList={fetchFileList}
                        />
                    )}

                </div>
                <div className="file-card-info">
                    <h3 className="file-card-name">{file.name}</h3>
                    <div className="file-card-meta">
                        <span>{file.size}</span>
                        <span className="file-card-date">
                            {file.dateText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default FileGridItem;