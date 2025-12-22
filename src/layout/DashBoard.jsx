import React, {useState} from 'react';
import { Outlet } from "react-router-dom";

import Header from "@layout/Header";
import Sidebar from "@layout/Sidebar";

import CreateFolderModal from "@pages/components/modal/CreateFolderModal";

import { useUpload } from "@pages/components/loding/UploadProvider";

export default function DashBoard() {

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

    const { deleteStatusFile } = useUpload();

    const showUploadModal = (type) => {
        setIsUploadModalOpen(!isUploadModalOpen);
        if (type === "CANCEL") {
            deleteStatusFile("PENDING");
        }
    }

    return (
        <>
            <div className="flex h-screen bg-gray-50">

                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                    <Sidebar
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </div>

                {/* Mobile Sidebar */}
                {isMobileMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <div className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-xl">
                            <Sidebar
                                selectedCategory={selectedCategory}
                                onCategoryChange={(c) => {
                                    setSelectedCategory(c);
                                    setIsMobileMenuOpen(false);
                                }}
                                onClose={() => setIsMobileMenuOpen(false)}
                            />
                        </div>
                    </>
                )}

                <div className="flex-1 flex flex-col overflow-hidden">

                    <Header
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        showUploadModal={showUploadModal}
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                        onCreateFolderClick={() => setIsCreateFolderModalOpen(true)}
                    />

                    <Outlet
                        context={{
                            selectedCategory,
                            searchQuery,
                            viewMode,
                            isUploadModalOpen,
                            setIsUploadModalOpen,
                            showUploadModal,
                        }}
                    />

                    {isCreateFolderModalOpen && (
                        <CreateFolderModal
                            onClose={() => setIsCreateFolderModalOpen(false)}
                            // onCreateFolder={handleCreateFolder}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
