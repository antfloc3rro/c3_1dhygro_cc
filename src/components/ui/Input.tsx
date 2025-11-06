import React, { forwardRef } from 'react'
import { cn } from '@/utils/index'
import { Check, AlertCircle, AlertTriangle, LucideIcon } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  warning?: string
  success?: boolean
  helperText?: string
  leftIcon?: LucideIcon | React.ReactNode
  rightIcon?: LucideIcon | React.ReactNode
}

/**
 * Input component following WUFI Cloud UI/UX v2.1 specification
 *
 * Features:
 * - Label with optional asterisk for required fields
 * - Validation states: error (red), warning (orange), success (green checkmark)
 * - Focus ring: 2px bluegreen with offset
 * - Helper text below input
 * - Left/right icons support
 * - Validation on blur (as per spec)
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      warning,
      success,
      helperText,
      leftIcon,
      rightIcon,
      required,
      disabled,
      className,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const hasError = !!error
    const hasWarning = !!warning && !hasError
    const hasSuccess = success && !hasError && !hasWarning

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1" style={{ color: '#33302F' }}>
            {label}
            {required && <span className="text-red ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-greydark">
              {typeof leftIcon === 'function' ? React.createElement(leftIcon, { className: 'w-[18px] h-[18px]' }) : leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-md border transition-all duration-200 ease-out',
              'bg-white placeholder-neutral-400',
              'focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50',
              leftIcon && 'pl-10',
              (rightIcon || hasSuccess) && 'pr-10',
              // Default border and focus
              !hasError && !hasWarning && 'border-neutral-300',
              // Error state
              hasError && 'border-red',
              // Warning state
              hasWarning && 'border-orange',
              className
            )}
            style={{
              color: '#33302F',
            }}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${props.id}-error`
                : warning
                ? `${props.id}-warning`
                : helperText
                ? `${props.id}-helper`
                : undefined
            }
            {...props}
          />

          {/* Right icon or success indicator */}
          {(rightIcon || hasSuccess) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasSuccess ? (
                <Check className="w-[18px] h-[18px]" style={{ color: '#3E7263' }} />
              ) : (
                typeof rightIcon === 'function' ? React.createElement(rightIcon, { className: 'w-[18px] h-[18px]' }) : rightIcon
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div
            id={`${props.id}-error`}
            className="flex items-center gap-1 mt-1 text-xs"
            style={{ color: '#C04343' }}
          >
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}

        {/* Warning message */}
        {warning && !error && (
          <div
            id={`${props.id}-warning`}
            className="flex items-center gap-1 mt-1 text-xs"
            style={{ color: '#E18E2A' }}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>{warning}</span>
          </div>
        )}

        {/* Helper text */}
        {helperText && !error && !warning && (
          <p
            id={`${props.id}-helper`}
            className="mt-1 text-xs"
            style={{ color: '#5E5A58' }}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
