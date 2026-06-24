import React from 'react';
import { useOutletContext } from "react-router-dom";
import { useFileUpload } from "@hooks/useFileUpload";

import FileGrid from '@pages/components/file/FileGrid';
import MobileNav from '@layout/MobileNav';

import "@styles/pages/Home.scss"

export default function Main() {

    const { selectedCategory, searchQuery, viewMode, setIsUploadModalOpen } = useOutletContext();
    const { uploadingFiles } = useFileUpload();


    return (
        <div className="storage-layout">
            <div className="storage-main-content">
                <FileGrid
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    viewMode={viewMode}
                />

                <MobileNav
                    onUploadClick={() => setIsUploadModalOpen(true)}
                    uploadingCount={uploadingFiles.length}
                />
            </div>
        </div>
    );
}