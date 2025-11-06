import React from 'react'
import { cn } from '@/utils/index'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'blue' | 'current'
  className?: string
}

/**
 * Spinner loading indicator
 *
 * Features:
 * - Rotating circle animation
 * - Multiple sizes
 * - Color variants
 * - Smooth animation
 */
export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const colorStyles = {
    primary: '#4AB79F',
    white: '#FFFFFF',
    blue: '#4597BF',
    current: 'currentColor',
  }

  return (
    <svg
      className={cn('animate-spin', sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={colorStyles[color]}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={colorStyles[color]}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * FullPageSpinner for loading states that block the entire page
 */
export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="xl" color="primary" />
        <p className="text-sm font-medium" style={{ color: '#5E5A58' }}>
          Loading...
        </p>
      </div>
    </div>
  )
}
