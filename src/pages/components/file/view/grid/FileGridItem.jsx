import React, {useEffect, useState} from 'react';
import * as gateway from "@components/common/gateway/Gateway";
import * as format from "@components/utils/Format";

import MenuDropdown from "@pages/components/file/MenuDropdown";

import "@styles/pages/components/file/FileGridItem.scss"
import { MoreVertical } from 'lucide-react';

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
        if (file.itemType !== "image" && file.itemType !== "video") {
            setThumbUrl(null);
            setThumbError(false);
            return undefined;
        }

        let objectUrl = null;
        let disposed = false;
        setThumbUrl(null);
        setThumbError(false);

        const fetchThumbnail = async () => {
            try {
                const response = await gateway.getBlob( `/nas/api/v1/file/thumbnail/${file.itemId}`, {folderId: folderInfo.folderId} );
                if (!response?.data) {
                    throw new Error("Thumbnail response is empty");
                }

                objectUrl = URL.createObjectURL(response.data);
                if (disposed) {
                    URL.revokeObjectURL(objectUrl);
                    return;
                }

                setThumbUrl(objectUrl);
            } catch (e) {
                if (!disposed) {
                    setThumbError(true);
                }
            }
        };

        fetchThumbnail();

        return () => {
            disposed = true;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [file.itemId, file.itemType, folderInfo.folderId]);

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
