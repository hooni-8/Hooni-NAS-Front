import React, { createContext, useState } from 'react';

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    /* ===== confirm ===== */
    const openConfirm = (config) => {
        setConfirmConfig(config);
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setConfirmConfig({});
    };

    /* ===== alert ===== */
    const openAlert = (config) => {
        setAlertConfig(config);
        setAlertOpen(true);
    };

    const closeAlert = () => {
        setAlertOpen(false);
        setAlertConfig({});
    };

    const value = {
        confirmOpen,
        confirmConfig,
        openConfirm,
        closeConfirm,

        alertOpen,
        alertConfig,
        openAlert,
        closeAlert
    }

    return (
        <ModalContext.Provider value={ value }>
            {children}
        </ModalContext.Provider>
    );
};