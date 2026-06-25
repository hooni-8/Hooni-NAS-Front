import React from 'react';
import { useOutletContext } from "react-router-dom";

import FileGrid from '@pages/components/file/FileGrid';
import MobileNav from '@layout/MobileNav';

import "@styles/pages/Home.scss"

export default function Main() {

    const { selectedCategory, searchQuery, viewMode } = useOutletContext();


    return (
        <div className="storage-layout">
            <div className="storage-main-content">
                <FileGrid
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    viewMode={viewMode}
                />

                <MobileNav />
            </div>
        </div>
    );
}