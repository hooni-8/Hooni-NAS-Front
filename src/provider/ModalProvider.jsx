import React, { createContext, useState } from 'react';

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    const [modal, setModal] = useState({
        createFolder: false,
        previewOpen: false,
        reNameOpen: false,
        uploadOpen: false,
        progressBarOpen: false,
        rendering: false,
    })

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

    const openModal = (name) => {
        setModal(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const closeModal = (name) => {
        setModal(prev => ({
            ...prev,
            [name]: false
        }));
    };

    const value = {
        confirmOpen,
        confirmConfig,
        openConfirm,
        closeConfirm,

        alertOpen,
        alertConfig,
        openAlert,
        closeAlert,

        modal,
        openModal,
        closeModal,
    }

    return (
        <ModalContext.Provider value={ value }>
            {children}
        </ModalContext.Provider>
    );
};