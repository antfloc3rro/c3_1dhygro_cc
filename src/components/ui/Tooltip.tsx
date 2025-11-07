import React, { useState } from 'react'
import { cn } from '@/utils/index'

export interface TooltipProps {
  content: string
  children: React.ReactElement
  position?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
}

/**
 * Tooltip component for hover hints
 *
 * Features:
 * - Appears on hover with delay
 * - Multiple position options
 * - Smooth fade animation
 * - Accessible (uses aria-label)
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 300,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const newTimer = setTimeout(() => setVisible(true), delay)
    setTimer(newTimer)
  }

  const handleMouseLeave = () => {
    if (timer) {
      clearTimeout(timer)
    }
    setVisible(false)
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {React.cloneElement(children, {
        'aria-label': content,
      })}

      {visible && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap',
            'animate-fade-in pointer-events-none',
            positionClasses[position]
          )}
          style={{ backgroundColor: '#33302F' }}
          role="tooltip"
        >
          {content}

          {/* Arrow */}
          <div
            className={cn(
              'absolute w-2 h-2 transform rotate-45',
              position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
              position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
              position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
              position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2'
            )}
            style={{ backgroundColor: '#33302F' }}
          />
        </div>
      )}
    </div>
  )
}
