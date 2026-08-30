import React from 'react';

import "@styles/pages/components/file/FileListItem.scss";
import {Folder} from 'lucide-react';

export default function FileListBackItem ({ handleBackFolder })  {

    const iconProps = {
        className: 'file-icon',
        style: { color: '#3b82f6' }
    };

    const handleKeyDown = (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        handleBackFolder();
    };

    return (
        <div className="file-list-item group">
            <div
                className="file-item-content"
                role="button"
                tabIndex={0}
                aria-label="상위 폴더로 이동"
                onClick={handleBackFolder}
                onKeyDown={handleKeyDown}
            >
                <div className="file-item-name-section">
                    <div className="file-icon-wrapper">
                        <Folder {...iconProps} />
                    </div>
                    <div className="file-name-info">
                        <span className="file-list-back-label">상위 폴더</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
