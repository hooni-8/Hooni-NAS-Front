import { useContext } from 'react';

import { FileUploadContext } from "@provider/FileUploadProvider";

export const useFileUpload = () => {
    const context = useContext(FileUploadContext);

    if (!context) {
        throw new Error("useFileUpload must be used within FileUploadProvider");
    }

    return context;
};