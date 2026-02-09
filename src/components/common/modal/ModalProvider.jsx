import React, { createContext, useState } from 'react';

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    /* ===== confirm ===== */
    const openConfirm = ({ type, title, message, confirmBtn, onConfirm }) => {
        setConfirmConfig({ type, title, message, confirmBtn, onConfirm });
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setConfirmConfig({});
    };

    /* ===== alert ===== */
    const openAlert = ({ type, title, message }) => {
        setAlertConfig({ type, title, message });
        setAlertOpen(true);
    };

    const closeAlert = () => {
        setAlertOpen(false);
        setAlertConfig({});
    };

    return (
        <ModalContext.Provider
            value={{
                confirmOpen,
                confirmConfig,
                openConfirm,
                closeConfirm,

                alertOpen,
                alertConfig,
                openAlert,
                closeAlert
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}