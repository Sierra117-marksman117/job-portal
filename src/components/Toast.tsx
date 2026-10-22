'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  // Globally intercept native browser alerts and redirect to in-app toast notifications
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalAlert = window.alert;
      window.alert = (message?: unknown) => {
        showToast(String(message ?? ''), 'info');
      };
      return () => {
        window.alert = originalAlert;
      };
    }
  }, [showToast]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-[calc(100vw-2rem)]"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-slide pointer-events-auto bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 min-w-[280px] max-w-md animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <span className="font-medium text-slate-100 text-xs leading-snug break-words">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 -mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}