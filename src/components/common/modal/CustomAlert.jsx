import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

import { useModal } from "@hooks/useModal";

import "@styles/components/common/modal/CustomAlert.scss";

export default function CustomAlert() {

    const { alertOpen, alertConfig, closeAlert } = useModal();

    if (!alertOpen || !alertConfig) return null;

    const { type, title, message, onClose } = alertConfig;

    const handleClose = () => {
        onClose?.();
        closeAlert();
    };

    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle2,
                    iconBgClass: 'alert-icon-bg-success',
                    iconColorClass: 'alert-icon-color-success',
                    confirmButtonClass: 'alert-button-success',
                };

            case 'error':
                return {
                    icon: XCircle,
                    iconBgClass: 'alert-icon-bg-error',
                    iconColorClass: 'alert-icon-color-error',
                    confirmButtonClass: 'alert-button-error',
                };

            case 'warning':
                return {
                    icon: AlertCircle,
                    iconBgClass: 'alert-icon-bg-warning',
                    iconColorClass: 'alert-icon-color-warning',
                    confirmButtonClass: 'alert-button-warning',
                };

            case 'info':
                return {
                    icon: Info,
                    iconBgClass: 'alert-icon-bg-info',
                    iconColorClass: 'alert-icon-color-info',
                    confirmButtonClass: 'alert-button-info',
                };

            default:
                return {
                    icon: Info,
                    iconBgClass: 'alert-icon-bg-info',
                    iconColorClass: 'alert-icon-color-info',
                    confirmButtonClass: 'alert-button-info',
                };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <div className="alert-overlay">
            <div className="alert-modal">
                <div className="alert-content">
                    <div className="alert-header">
                        <div className={`alert-icon-wrapper ${config.iconBgClass}`}>
                            <Icon className={`alert-icon ${config.iconColorClass}`} />
                        </div>

                        <div className="alert-text-content">
                            <h3 className="alert-title">{title}</h3>
                            <p className="alert-message">{message}</p>
                        </div>

                        <button
                            onClick={handleClose}
                            className="alert-close-button"
                        >
                            <X className="alert-close-icon" />
                        </button>
                    </div>
                </div>

                <div className="alert-footer">
                    <button
                        onClick={handleClose}
                        className={`alert-confirm-button ${config.confirmButtonClass}`}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}