import React from 'react';
import '@styles/index.scss'
import {BrowserRouter} from 'react-router-dom';

import { UploadProvider } from "@pages/components/loding/UploadProvider";
import { AuthProvider } from "@layout/auth/AuthContext";
import { ModalProvider } from "@components/common/modal/ModalProvider";
import CustomAlert from "@components/common/modal/CustomAlert";
import CustomConfirm from "@components/common/modal/CustomConfirm";
import Router from "@nav/Router";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UploadProvider>
                    <ModalProvider>
                        <Router />
                        <CustomAlert />
                        <CustomConfirm />
                    </ModalProvider>
                </UploadProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;