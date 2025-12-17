import React from 'react';
import '@styles/index.scss'
import {BrowserRouter} from 'react-router-dom';

import { AuthProvider } from "@layout/auth/AuthContext";
import Router from "@nav/Router";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;