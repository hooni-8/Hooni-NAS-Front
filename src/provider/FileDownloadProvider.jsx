import React, { createContext } from "react";

/* Action */
import { SingleDownloadFileAction } from "@provider/file/SingleDownloadFileAction";

export const FileDownloadContext = createContext(null);

export const FileDownloadProvider = ({ children }) => {

    // 단일 파일 다운로드
    const singleDownload = (file) => {
        SingleDownloadFileAction(file);
    }


    const value = {
        singleDownload
    };

    return (
        <FileDownloadContext.Provider value={ value }>
            { children }
        </FileDownloadContext.Provider>
    )
}