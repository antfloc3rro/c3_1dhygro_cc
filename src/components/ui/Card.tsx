import React from 'react'
import { cn } from '@/utils/index'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Card component following WUFI Cloud UI/UX v2.1 specification
 *
 * Features:
 * - White background with border
 * - Shadow: sm (0 1px 2px rgba(0,0,0,0.05))
 * - Border radius: lg (8px)
 * - Interactive variant with hover effect
 * - Flexible padding options
 */
export function Card({
  children,
  interactive = false,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-neutral-200 shadow-sm',
        interactive &&
          'cursor-pointer hover:shadow-md hover:border-neutral-300 transition-all duration-200',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardHeader component for consistent card title/description
 */
export interface CardHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-base font-semibold font-heading" style={{ color: '#33302F' }}>
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm" style={{ color: '#5E5A58' }}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  )
}

/**
 * CardFooter component for consistent card actions
 */
export interface CardFooterProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export function CardFooter({ children, align = 'right' }: CardFooterProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <div className={cn('flex items-center gap-3 mt-4', alignClasses[align])}>
      {children}
    </div>
  )
}
