import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

export const useDialogAccessibility = (open, onClose) => {
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!open) return undefined;

        const dialog = dialogRef.current;
        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;

        const getFocusableElements = () => (
            dialog ? Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)) : []
        );

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCloseRef.current?.();
                return;
            }

            if (event.key !== 'Tab') return;

            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0) {
                event.preventDefault();
                dialog?.focus();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        // 모달이 열린 동안 키보드 포커스를 내부에 유지하고 배경 스크롤을 막는다.
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        const focusFrame = window.requestAnimationFrame(() => {
            const preferredElement = dialog?.querySelector('[data-autofocus]');
            (preferredElement || getFocusableElements()[0] || dialog)?.focus();
        });

        return () => {
            window.cancelAnimationFrame(focusFrame);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, [open]);

    return dialogRef;
};
