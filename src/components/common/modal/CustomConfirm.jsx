import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

import { useModal } from "@hooks/useModal";

import "@styles/components/common/modal/CustomConfirm.scss";

export default function CustomConfirm() {

    const { confirmOpen, confirmConfig, closeConfirm } = useModal();

    if (!confirmOpen || !confirmConfig) return null;

    const { type, title, message, confirmBtn, onConfirm, onClose } = confirmConfig;

    const handleConfirm = async () => {
        try {
            await onConfirm?.();
        } finally {
            closeConfirm();
            onClose?.();
        }
    };

    const handleClose = () => {
        closeConfirm();
        onClose?.();
    };

    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle2,
                    iconBgClass: 'confirm-icon-bg-success',
                    iconColorClass: 'confirm-icon-color-success',
                    confirmButtonClass: 'confirm-button-success',
                };

            case 'error':
                return {
                    icon: XCircle,
                    iconBgClass: 'confirm-icon-bg-error',
                    iconColorClass: 'confirm-icon-color-error',
                    confirmButtonClass: 'confirm-button-error',
                };

            case 'warning':
                return {
                    icon: AlertCircle,
                    iconBgClass: 'confirm-icon-bg-warning',
                    iconColorClass: 'confirm-icon-color-warning',
                    confirmButtonClass: 'confirm-button-warning',
                };

            case 'info':
                return {
                    icon: Info,
                    iconBgClass: 'confirm-icon-bg-info',
                    iconColorClass: 'confirm-icon-color-info',
                    confirmButtonClass: 'confirm-button-info',
                };

            default:
                return {
                    icon: Info,
                    iconBgClass: 'confirm-icon-bg-info',
                    iconColorClass: 'confirm-icon-color-info',
                    confirmButtonClass: 'confirm-button-info',
                };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <div className="confirm-overlay" role="presentation">
            <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
                <button
                    type="button"
                    onClick={handleClose}
                    className="confirm-close-button"
                    aria-label="확인 창 닫기"
                >
                    <X className="confirm-close-icon" aria-hidden="true" />
                </button>
                <div className="confirm-content">
                    <div className={`confirm-icon-wrapper ${config.iconBgClass}`}>
                        <Icon className={`confirm-icon ${config.iconColorClass}`} aria-hidden="true" />
                    </div>

                    <div className="confirm-text-content">
                        <h3 id="confirm-title" className="confirm-title">{title}</h3>
                        <p className="confirm-message">{message}</p>
                    </div>
                </div>

                <div className="confirm-footer">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="confirm-cancel-button"
                    >
                        취소
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className={`confirm-confirm-button ${config.confirmButtonClass}`}
                    >
                        {confirmBtn}
                    </button>
                </div>
            </section>
        </div>
    );
}
