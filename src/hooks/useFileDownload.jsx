import { useContext } from 'react';

import { FileDownloadContext } from "@provider/FileDownloadProvider";

export const useFileDownload = () => {
    const context = useContext(FileDownloadContext);

    if (!context) {
        throw new Error("useFileDownload must be used within FileDownloadProvider");
    }

    return context;
}