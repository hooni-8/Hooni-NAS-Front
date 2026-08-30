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
        <div className="alert-overlay" role="presentation">
            <section className="alert-modal" role="alertdialog" aria-modal="true" aria-labelledby="alert-title">
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
                        <p className="alert-message">{message}</p>
                    </div>
                </div>

                <div className="alert-footer">
                    <button
                        type="button"
                        onClick={handleClose}
                        className={`alert-confirm-button ${config.confirmButtonClass}`}
                    >
                        확인
                    </button>
                </div>
            </section>
        </div>
    );
}
