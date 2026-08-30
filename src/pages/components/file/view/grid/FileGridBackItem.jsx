import React from 'react';

import "@styles/pages/components/file/FileGridItem.scss"
import { ArrowLeft, FolderUp } from 'lucide-react';

export default function FileGridBackItem ({ handleBackFolder}) {

    return (
        <div className="file-card-wrapper file-back-card-wrapper group">
            <button type="button" className="file-card file-back-card" onClick={handleBackFolder}>
                <div className="file-card-relative">
                    <div className="file-card-icon-container file-back-card-icon-container">
                        <FolderUp className="card-icon file-back-folder-icon" aria-hidden="true" />
                        <span className="file-back-arrow"><ArrowLeft aria-hidden="true" /></span>
                    </div>
                </div>
                <div className="file-card-info file-back-card-info">
                    <h3 className="file-card-name">상위 폴더</h3>
                    <div className="file-card-meta file-back-card-meta">
                        <span>한 단계 위로 이동</span>
                    </div>
                </div>
            </button>

        </div>
    );
};
