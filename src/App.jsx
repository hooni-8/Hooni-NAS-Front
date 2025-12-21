import React from 'react';
import '@styles/index.scss'
import {BrowserRouter} from 'react-router-dom';

import { UploadProvider } from "@pages/components/loding/UploadProvider";
import { AuthProvider } from "@layout/auth/AuthContext";
import Router from "@nav/Router";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UploadProvider>
                    <Router />
                </UploadProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;