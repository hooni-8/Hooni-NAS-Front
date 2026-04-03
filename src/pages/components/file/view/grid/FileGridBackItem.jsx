import React from 'react';

import "@styles/pages/components/file/FileGridItem.scss"
import {Folder} from 'lucide-react';

export default function FileGridBackItem ({ handleBackFolder}) {

    return (
        <div className="file-card-wrapper group">
            <div className="file-card" onDoubleClick={handleBackFolder}>
                <div className="file-card-relative">
                    <div className="file-card-icon-container file-card-bg-folder">
                        <Folder className="card-icon folder-icon"/>
                    </div>
                </div>
                <div className="file-card-info">
                    <h3 className="file-card-name">뒤로가기</h3>
                    <div className="file-card-meta empty">
                        <span> hidden </span>
                        <span className="file-card-date empty"> hidden </span>
                    </div>
                </div>
            </div>

        </div>
    );
};
