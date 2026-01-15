import React from "react";

import {VirtuosoGrid} from "react-virtuoso";
import { GridComponents } from "@pages/components/file/GridComponents";

import FileCard from '@pages/components/file/FileCard';

export default function GridView({ activeFolderId, filteredFiles, showPreviewModal }) {

    return (
        <div className="file-grid-container grid-view">
            <VirtuosoGrid
                data={filteredFiles}
                components={GridComponents}
                itemContent={(index, file) => (
                    <FileCard
                        activeFolderId={activeFolderId}
                        file={file}
                        showPreviewModal={showPreviewModal}
                    />
                )}
            />
        </div>
    );
}