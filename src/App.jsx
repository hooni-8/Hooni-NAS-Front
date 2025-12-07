import React from 'react';
import {BrowserRouter as Router } from 'react-router-dom';
import '@styles/index.scss'

import DashBoard from '@layout/DashBoard';

function App() {
    return (
        <Router>
            <DashBoard />
        </Router>
    );
}

export default App;