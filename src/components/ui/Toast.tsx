import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/utils/index'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

/**
 * Toast Provider component - wrap your app with this
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const newToast: Toast = { id, type, title, message, duration }

      setToasts((prev) => [...prev, newToast])

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id)
        }, duration)
      }
    },
    []
  )

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  )
}

/**
 * Hook to access toast functions
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

/**
 * Toast Container - renders all active toasts
 */
function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: Toast[]
  onClose: (id: string) => void
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  )
}

/**
 * Individual Toast Item
 */
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const styles = {
    success: {
      backgroundColor: 'rgba(62, 114, 99, 0.95)',
      iconColor: '#FFFFFF',
    },
    error: {
      backgroundColor: 'rgba(192, 67, 67, 0.95)',
      iconColor: '#FFFFFF',
    },
    warning: {
      backgroundColor: 'rgba(225, 142, 42, 0.95)',
      iconColor: '#FFFFFF',
    },
    info: {
      backgroundColor: 'rgba(69, 151, 191, 0.95)',
      iconColor: '#FFFFFF',
    },
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg',
        'animate-slide-in-right',
        'border-l-4'
      )}
      style={{
        backgroundColor: styles[toast.type].backgroundColor,
        borderColor: styles[toast.type].iconColor,
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: styles[toast.type].iconColor }} />

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
        {toast.message && (
          <p className="mt-1 text-sm text-white text-opacity-90">{toast.message}</p>
        )}
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors duration-150"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}

/**
 * Convenience functions for showing toasts
 */
export const toast = {
  success: (title: string, message?: string) => {
    // This will be implemented via useToast hook
    console.log('Toast success:', title, message)
  },
  error: (title: string, message?: string) => {
    console.log('Toast error:', title, message)
  },
  warning: (title: string, message?: string) => {
    console.log('Toast warning:', title, message)
  },
  info: (title: string, message?: string) => {
    console.log('Toast info:', title, message)
  },
}
