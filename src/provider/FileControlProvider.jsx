import React, { createContext } from "react";

import { useModal } from "@hooks/useModal";

/* Action */
import { deleteFileAction } from "@provider/file/DeleteFileAction";

export const FileControlContext = createContext(null);

export const FileControlProvider = ({ children }) => {

    const { openAlert, openConfirm } = useModal();

    const deleteFile = (file, callback) => {
        deleteFileAction(file, callback, openConfirm, openAlert);
    };

    const value = {
        deleteFile
    };

    return (
        <FileControlContext.Provider value={ value }>
            {children}
        </FileControlContext.Provider>
    );
};