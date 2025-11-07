import React from 'react'
import { cn } from '@/utils/index'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  children: React.ReactNode
}

/**
 * Badge component for status indicators
 *
 * Variants:
 * - success: Green (#3E7263) - Completed, Ready
 * - warning: Orange (#E18E2A) - Warnings, Pending
 * - error: Red (#C04343) - Errors, Failed
 * - info: Blue (#4597BF) - Information, Running
 * - neutral: Gray - Default, Draft
 * - primary: Bluegreen (#4AB79F) - Primary emphasis
 *
 * Features:
 * - Optional dot indicator
 * - Multiple sizes
 * - Rounded pill shape
 * - 15% opacity background with full opacity text
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
  ...props
}: BadgeProps) {
  const variantStyles = {
    success: {
      backgroundColor: 'rgba(62, 114, 99, 0.15)',
      color: '#3E7263',
    },
    warning: {
      backgroundColor: 'rgba(225, 142, 42, 0.15)',
      color: '#E18E2A',
    },
    error: {
      backgroundColor: 'rgba(192, 67, 67, 0.15)',
      color: '#C04343',
    },
    info: {
      backgroundColor: 'rgba(69, 151, 191, 0.15)',
      color: '#4597BF',
    },
    neutral: {
      backgroundColor: 'rgba(189, 178, 170, 0.15)',
      color: '#5E5A58',
    },
    primary: {
      backgroundColor: 'rgba(74, 183, 159, 0.15)',
      color: '#4AB79F',
    },
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  const dotColors = {
    success: '#3E7263',
    warning: '#E18E2A',
    error: '#C04343',
    info: '#4597BF',
    neutral: '#5E5A58',
    primary: '#4AB79F',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        sizeClasses[size],
        className
      )}
      style={variantStyles[variant]}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColors[variant] }}
        />
      )}
      {children}
    </span>
  )
}
