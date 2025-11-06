import React from 'react'
import { cn } from '@/utils/index'
import { LucideIcon } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning'
  size?: 'default' | 'small' | 'large'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  children?: React.ReactNode
}

/**
 * Button component following WUFI Cloud UI/UX v2.1 specification
 *
 * Variants:
 * - primary: Bluegreen (#4AB79F) - Primary action
 * - secondary: White with border - Less important action
 * - ghost: Transparent - Tertiary action
 * - danger: Red (#C04343) - Destructive action
 * - warning: Orange (#E18E2A) - Warning action
 *
 * States: hover (brightness), active (brightness), disabled (50% opacity), focus (2px ring)
 * Transition: 200ms ease-out
 */
export function Button({
  variant = 'primary',
  size = 'default',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'text-white focus-visible:ring-bluegreen',
    secondary: 'bg-white border border-greylight text-text hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-bluegreen',
    ghost: 'bg-transparent text-text hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-bluegreen',
    danger: 'text-white focus-visible:ring-red',
    warning: 'text-white focus-visible:ring-orange',
  }

  const sizes = {
    small: 'h-8 px-3 py-1 text-xs',        // 32px height, 12px font
    default: 'h-9 px-4 py-2 text-sm',      // 36px height, 14px font (0.875rem)
    large: 'h-11 px-6 py-3 text-base',     // 44px height, 16px font
  }

  // Apply brightness on hover/active for primary, danger, warning
  const brightnessDynamicStyles = (variant === 'primary' || variant === 'danger' || variant === 'warning')
    ? 'hover:brightness-110 active:brightness-95'
    : ''

  // Background colors for primary, danger, warning (inline styles for specific colors)
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: '#4AB79F' }
      case 'danger':
        return { backgroundColor: '#C04343' }
      case 'warning':
        return { backgroundColor: '#E18E2A' }
      default:
        return {}
    }
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        brightnessDynamicStyles,
        className
      )}
      style={getBackgroundColor()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-[18px] w-[18px]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-[18px] h-[18px]" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-[18px] h-[18px]" />}
    </button>
  )
}
