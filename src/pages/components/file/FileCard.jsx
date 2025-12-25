import React, {useEffect, useState} from 'react';
import * as gateway from "@components/common/Gateway";
import * as format from "@components/utils/Format";

import MenuDropdown from "@pages/components/file/MenuDropdown";

import "@styles/pages/components/file/FileCard.scss"
import { MoreVertical } from 'lucide-react';

const thumbnailCache = new Map();

const FileCard = React.memo(({ file }) => {
    const [showMenu, setShowMenu] = useState(false);

    const [thumbUrl, setThumbUrl] = useState(null);
    const [thumbError, setThumbError] = useState(false);

    useEffect(() => {
        if (file.type !== "image") return;

        if (thumbnailCache.has(file.id)) {
            setThumbUrl(thumbnailCache.get(file.id));
            return;
        }

        const fetchThumbnail = async () => {
            try {
                const response = await gateway.getBlob( `/nas/api/v1/file/thumbnail/${file.id}` );

                const url = URL.createObjectURL(response.data);
                thumbnailCache.set(file.id, url);
                setThumbUrl(url);
            } catch {
                setThumbError(true);
            }
        };

        fetchThumbnail();
    }, [file.id]);

    return (
        <div className="file-card-wrapper group">
            <div className="file-card">
                <div className="file-card-relative">
                    <div className={`file-card-icon-container ${format.getFileColor(file)}`}>
                        {file.type === "image" && thumbUrl && !thumbError ? (
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
                        <MenuDropdown setShowMenu={setShowMenu} />
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

export default FileCard;