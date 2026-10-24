import React, { createContext } from "react";

import { useModal } from "@hooks/useModal";

/* Action */
import { deleteFileAction, deleteFilesAction } from "@provider/file/DeleteFileAction";
import { reNameFileAction } from "@provider/file/ReNameFileAction";

export const FileControlContext = createContext(null);

export const FileControlProvider = ({ children }) => {

    const { openAlert, openConfirm } = useModal();

    const deleteFile = (file, callback) => {
        deleteFileAction(file, callback, openConfirm, openAlert);
    };

    const deleteFiles = (files, callback) => {
        deleteFilesAction(files, callback, openConfirm, openAlert);
    };

    const reNameFile = async (file, changeName, callback) => {
        return reNameFileAction(file, changeName, callback, openAlert);
    };

    const value = {
        deleteFile,
        deleteFiles,
        reNameFile
    };

    return (
        <FileControlContext.Provider value={ value }>
            { children }
        </FileControlContext.Provider>
    );
};
