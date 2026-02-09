import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

import { useModal } from "@components/common/modal/useModal";

import "@styles/components/common/modal/CustomConfirm.scss";

export default function CustomConfirm() {

    const { confirmOpen, confirmConfig, closeConfirm } = useModal();

    if (!confirmOpen) return null;

    const {type, title, message, confirmBtn, onConfirm} = confirmConfig;

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
        <div className="confirm-overlay">
            <div className="confirm-modal">
                <div className="confirm-content">
                    <div className="confirm-header">
                        <div className={`confirm-icon-wrapper ${config.iconBgClass}`}>
                            <Icon className={`confirm-icon ${config.iconColorClass}`} />
                        </div>
                        <div className="confirm-text-content">
                            <h3 className="confirm-title">{title}</h3>
                            <p className="confirm-message">{message}</p>
                        </div>
                        <button onClick={closeConfirm} className="confirm-close-button">
                            <X className="confirm-close-icon" />
                        </button>
                    </div>
                </div>

                <div className="confirm-footer">
                    <button onClick={closeConfirm} className="confirm-cancel-button">
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`confirm-confirm-button ${config.confirmButtonClass}`}
                    >
                        {confirmBtn}
                    </button>
                </div>
            </div>
        </div>
    );
}