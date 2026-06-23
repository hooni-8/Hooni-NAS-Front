import { useContext } from 'react';

import { FileControlContext } from "@provider/FileControlProvider";

export const useFileControl = () => {
    const context = useContext(FileControlContext);

    if (!context) {
        throw new Error("useFileControl must be used within FileControlProvider");
    }

    return context;
};