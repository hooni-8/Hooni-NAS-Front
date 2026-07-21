import React from 'react';
import '@styles/index.scss'
import {BrowserRouter} from 'react-router-dom';

/* Provider */
import { FileUploadProvider } from "@provider/FileUploadProvider";
import { AuthProvider } from "@provider/AuthProvider";
import { ModalProvider } from "@provider/ModalProvider";
import { FileControlProvider } from "@provider/FileControlProvider";
import { FileDownloadProvider } from "@provider/FileDownloadProvider";

import CustomAlert from "@components/common/modal/CustomAlert";
import CustomConfirm from "@components/common/modal/CustomConfirm";
import Router from "@nav/Router";

function App() {
    return (
        <BrowserRouter>
            <ModalProvider>
                <AuthProvider>
                    <FileUploadProvider>
                        <FileDownloadProvider>
                            <FileControlProvider>
                                <Router />
                                <CustomAlert />
                                <CustomConfirm />
                            </FileControlProvider>
                        </FileDownloadProvider>
                    </FileUploadProvider>
                </AuthProvider>
            </ModalProvider>
        </BrowserRouter>
    );
}

export default App;