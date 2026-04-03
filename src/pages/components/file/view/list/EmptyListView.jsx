import React from "react";
import {Folder} from "lucide-react";

export default function EmptyListView({ backFolder, rootFolderFlag }) {

    const iconProps = {
        className: 'file-icon',
        style: { color: '#3b82f6' }
    };

    return (
        <div className="file-list-item group">
            <div className="file-item-content" onDoubleClick={backFolder}>
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
    )
}