/* =====================================================
   Loading Spinner Component
   مكون التحميل
===================================================== */

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    fullScreen?: boolean;
}

export function LoadingSpinner({
    size = "md",
    text,
    fullScreen = false
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-brand-start`} />
            {text && <p className="text-gray-500 text-sm">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}

/* =====================================================
   Empty State Component
   مكون الحالة الفارغة
===================================================== */

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            {icon && (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && <p className="text-gray-500 mb-4">{description}</p>}
            {action && (
                <button onClick={action.onClick} className="btn-gradient">
                    {action.label}
                </button>
            )}
        </div>
    );
}

/* =====================================================
   Confirmation Modal Component
   مكون تأكيد الإجراء
===================================================== */

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "تأكيد",
    cancelText = "إلغاء",
    variant = "danger",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const variantClasses = {
        danger: "bg-red-500 hover:bg-red-600",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        info: "bg-blue-500 hover:bg-blue-600",
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-gray-500 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="btn-glass flex-1">
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`text-white px-6 py-3 rounded-xl flex-1 transition-colors ${variantClasses[variant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =====================================================
   Toast Notification Component
   مكون الإشعارات
===================================================== */

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info" | "warning";
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, type = "info", isVisible, onClose }: ToastProps) {
    if (!isVisible) return null;

    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500",
    };

    const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ",
        warning: "⚠",
    };

    // إخفاء تلقائي بعد 3 ثوان
    setTimeout(onClose, 3000);

    return (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fadeIn`}>
            <div className={`${typeClasses[type]} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
                <span className="text-lg">{icons[type]}</span>
                <span>{message}</span>
                <button onClick={onClose} className="mr-2 opacity-70 hover:opacity-100">
                    ✕
                </button>
            </div>
        </div>
    );
}
