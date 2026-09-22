import { useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

import { useDialogAccessibility } from '@hooks/useDialogAccessibility';
import { useModal } from "@hooks/useModal";

import "@styles/components/common/modal/Modal.scss";

export default function CustomAlert() {

    const { alertOpen, alertConfig, closeAlert } = useModal();

    const { type, title, message, onClose } = alertConfig;

    const handleClose = useCallback(() => {
        onClose?.();
        closeAlert();
    }, [closeAlert, onClose]);

    const dialogRef = useDialogAccessibility(alertOpen, handleClose);

    if (!alertOpen) return null;

    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle2,
                    iconBgClass: 'alert-icon-bg-success',
                    iconColorClass: 'alert-icon-color-success',
                };

            case 'error':
                return {
                    icon: XCircle,
                    iconBgClass: 'alert-icon-bg-error',
                    iconColorClass: 'alert-icon-color-error',
                };

            case 'warning':
                return {
                    icon: AlertCircle,
                    iconBgClass: 'alert-icon-bg-warning',
                    iconColorClass: 'alert-icon-color-warning',
                };

            case 'info':
                return {
                    icon: Info,
                    iconBgClass: 'alert-icon-bg-info',
                    iconColorClass: 'alert-icon-color-info',
                };

            default:
                return {
                    icon: Info,
                    iconBgClass: 'alert-icon-bg-info',
                    iconColorClass: 'alert-icon-color-info',
                };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <div className="alert-overlay" role="presentation">
            <section
                ref={dialogRef}
                className="alert-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="alert-title"
                aria-describedby="alert-message"
                tabIndex="-1"
            >
                <button
                    type="button"
                    onClick={handleClose}
                    className="alert-close-button"
                    aria-label="알림 닫기"
                >
                    <X className="alert-close-icon" aria-hidden="true" />
                </button>
                <div className="alert-content">
                    <div className={`alert-icon-wrapper ${config.iconBgClass}`}>
                        <Icon className={`alert-icon ${config.iconColorClass}`} aria-hidden="true" />
                    </div>

                    <div className="alert-text-content">
                        <h3 id="alert-title" className="alert-title">{title}</h3>
                        <p id="alert-message" className="alert-message">{message}</p>
                    </div>
                </div>

                <div className="alert-footer">
                    <button
                        type="button"
                        data-autofocus
                        onClick={handleClose}
                        className="alert-confirm-button"
                    >
                        확인
                    </button>
                </div>
            </section>
        </div>
    );
}
