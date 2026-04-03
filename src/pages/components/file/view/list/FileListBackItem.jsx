import React from 'react';

import "@styles/pages/components/file/FileListItem.scss";
import {Folder} from 'lucide-react';

export default function FileListBackItem ({ handleBackFolder })  {

    const iconProps = {
        className: 'file-icon',
        style: { color: '#3b82f6' }
    };

    return (
        <div className="file-list-item group">
            <div className="file-item-content" onDoubleClick={handleBackFolder}>
                <div className="file-item-name-section">
                    <div className="file-icon-wrapper">
                        <Folder {...iconProps} />
                    </div>
                    <div className="file-name-info">
                        ...
                    </div>
                </div>
            </div>
        </div>
    );
};