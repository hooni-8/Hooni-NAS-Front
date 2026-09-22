import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

import { useDialogAccessibility } from '@hooks/useDialogAccessibility';
import { useModal } from "@hooks/useModal";

import "@styles/components/common/modal/Modal.scss";

export default function CustomConfirm() {

    const { confirmOpen, confirmConfig, closeConfirm } = useModal();
    const [confirming, setConfirming] = useState(false);

    const { type, title, message, confirmBtn = '확인', onConfirm, onClose, onError } = confirmConfig;

    const handleClose = useCallback(() => {
        if (confirming) return;
        closeConfirm();
        onClose?.();
    }, [closeConfirm, confirming, onClose]);

    const dialogRef = useDialogAccessibility(confirmOpen, handleClose);

    useEffect(() => {
        if (confirmOpen) setConfirming(false);
    }, [confirmOpen]);

    const handleConfirm = async () => {
        if (confirming) return;

        setConfirming(true);
        try {
            await onConfirm?.();
            closeConfirm();
            onClose?.();
        } catch (error) {
            // 실패 시 모달을 유지해 사용자가 다시 시도할 수 있도록 한다.
            onError?.(error);
        } finally {
            setConfirming(false);
        }
    };

    if (!confirmOpen) return null;

    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle2,
                    iconBgClass: 'confirm-icon-bg-success',
                    iconColorClass: 'confirm-icon-color-success',
                };

            case 'error':
                return {
                    icon: XCircle,
                    iconBgClass: 'confirm-icon-bg-error',
                    iconColorClass: 'confirm-icon-color-error',
                };

            case 'warning':
                return {
                    icon: AlertCircle,
                    iconBgClass: 'confirm-icon-bg-warning',
                    iconColorClass: 'confirm-icon-color-warning',
                };

            case 'info':
                return {
                    icon: Info,
                    iconBgClass: 'confirm-icon-bg-info',
                    iconColorClass: 'confirm-icon-color-info',
                };

            default:
                return {
                    icon: Info,
                    iconBgClass: 'confirm-icon-bg-info',
                    iconColorClass: 'confirm-icon-color-info',
                };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <div className="confirm-overlay" role="presentation">
            <section
                ref={dialogRef}
                className="confirm-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
                aria-busy={confirming}
                tabIndex="-1"
            >
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={confirming}
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
                        <p id="confirm-message" className="confirm-message">{message}</p>
                    </div>
                </div>

                <div className="confirm-footer">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={confirming}
                        className="confirm-cancel-button"
                    >
                        취소
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        data-autofocus
                        disabled={confirming}
                        className="confirm-confirm-button"
                    >
                        {confirmBtn}
                    </button>
                </div>
            </section>
        </div>
    );
}
