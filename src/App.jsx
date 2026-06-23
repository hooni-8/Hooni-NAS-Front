import React from 'react';
import '@styles/index.scss'
import {BrowserRouter} from 'react-router-dom';

/* Provider */
import { FileUploadProvider } from "@provider/FileUploadProvider";
import { AuthProvider } from "@provider/AuthProvider";
import { ModalProvider } from "@provider/ModalProvider";
import { FileControlProvider } from "@provider/FileControlProvider";

import CustomAlert from "@components/common/modal/CustomAlert";
import CustomConfirm from "@components/common/modal/CustomConfirm";
import Router from "@nav/Router";

function App() {
    return (
        <BrowserRouter>
            <ModalProvider>
                <AuthProvider>
                    <FileUploadProvider>
                        <FileControlProvider>
                            <Router />
                            <CustomAlert />
                            <CustomConfirm />
                        </FileControlProvider>
                    </FileUploadProvider>
                </AuthProvider>
            </ModalProvider>
        </BrowserRouter>
    );
}

export default App;