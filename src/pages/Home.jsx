import React, {useEffect, useState} from 'react';

import FileGrid from '@pages/components/file/FileGrid';
import MobileNav from '@layout/MobileNav';
import UploadModal from '@pages/components/modal/UploadModal';

import "@styles/pages/Home.scss"

import * as gateway from "@components/common/Gateway";
import {useOutletContext} from "react-router-dom";

export default function Home() {

    const {
        selectedCategory,
        searchQuery,
        viewMode,
        isUploadModalOpen,
        setIsUploadModalOpen
    } = useOutletContext();

    const mockFiles = [
        { id: '1', name: '여름 휴가 사진', type: 'folder', size: '1.2 GB', date: '2025-08-15' },
        { id: '2', name: '프로젝트 문서', type: 'folder', size: '245 MB', date: '2025-11-20' },
        { id: '3', name: '프레젠테이션.pdf', type: 'document', size: '4.2 MB', date: '2025-12-01' },
        { id: '4', name: '배경음악.mp3', type: 'audio', size: '3.8 MB', date: '2025-11-28' },
        { id: '5', name: '튜토리얼.mp4', type: 'video', size: '125 MB', date: '2025-11-15' },
        { id: '6', name: '스크린샷.png', type: 'image', size: '2.1 MB', date: '2025-12-03' },
        { id: '7', name: '보고서.docx', type: 'document', size: '1.5 MB', date: '2025-11-30' },
        { id: '8', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '9', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '10', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '11', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '12', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '13', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '14', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '15', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '16', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '17', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '18', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '19', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '20', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '21', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '22', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '23', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
        { id: '24', name: '디자인 파일', type: 'folder', size: '850 MB', date: '2025-10-12' },
    ];

    const [files, setFiles] = useState(mockFiles);

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === 'all' ||
            (selectedCategory === 'folders' && file.type === 'folder') ||
            (selectedCategory === 'images' && file.type === 'image') ||
            (selectedCategory === 'documents' && file.type === 'document') ||
            (selectedCategory === 'videos' && file.type === 'video') ||
            (selectedCategory === 'audio' && file.type === 'audio');

        return matchesSearch && matchesCategory;
    });

    const handleUpload = (uploadedFiles) => {
        setFiles(prev => [...uploadedFiles, ...prev]);
    };

    return (
        <div className="storage-layout">
            <div className="storage-main-content">
                <FileGrid files={filteredFiles} viewMode={viewMode}/>

                <MobileNav onUploadClick={() => setIsUploadModalOpen(true)}/>
            </div>

            {isUploadModalOpen && (
                <UploadModal
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleUpload}
                />
            )}
        </div>
    );
}