import React, { useState } from 'react'
import { ChevronDown, LucideIcon } from 'lucide-react'
import { cn } from '@/utils/index'

export interface CollapsibleProps {
  title: string
  icon?: LucideIcon
  summary?: React.ReactNode
  defaultExpanded?: boolean
  expanded?: boolean
  onToggle?: (expanded: boolean) => void
  children: React.ReactNode
}

/**
 * Collapsible component for Left Panel sections
 * Following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Features:
 * - Clickable header toggles expand/collapse
 * - Arrow rotates 180° (animated, 200ms)
 * - When collapsed: Shows icon + title + summary (1-2 items max), subtle bg change
 * - When expanded: Shows icon + title + full content
 * - Header hover: Background lightens slightly
 * - Persistent state via localStorage (when storageKey provided)
 *
 * Header Specifications:
 * - Padding (collapsed): 8px 16px
 * - Padding (expanded): 16px
 * - Border-bottom: 1px solid greylight
 * - Background (collapsed): greylight at 5% opacity
 * - Transition: 200ms ease-out
 */
export function Collapsible({
  title,
  icon: Icon,
  summary,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onToggle,
  children,
}: CollapsibleProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  // Use controlled state if provided, otherwise use internal state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    const newExpanded = !isExpanded
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded)
    }
    onToggle?.(newExpanded)
  }

  return (
    <div className="border-b border-neutral-200">
      {/* Header (clickable) */}
      <button
        className={cn(
          'w-full flex items-center justify-between transition-all duration-200 ease-out hover:bg-neutral-50',
          isExpanded ? 'p-4' : 'py-2 px-4 bg-opacity-5',
          !isExpanded && 'bg-greylight'
        )}
        onClick={handleToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon
              className={cn('flex-shrink-0', isExpanded ? 'w-5 h-5' : 'w-4 h-4')}
              style={{ color: '#5E5A58' }}
            />
          )}
          <div className="flex flex-col items-start">
            <span
              className={cn('font-medium', isExpanded ? 'text-sm' : 'text-sm')}
              style={{ color: '#33302F' }}
            >
              {title}
            </span>
            {!isExpanded && summary && (
              <span className="text-xs mt-0.5" style={{ color: '#5E5A58' }}>
                {summary}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={cn('w-4 h-4 flex-shrink-0 transition-transform duration-200', isExpanded && 'rotate-180')}
          style={{ color: '#BDB2AA' }}
        />
      </button>

      {/* Content (shown when expanded) */}
      {isExpanded && <div className="p-4">{children}</div>}
    </div>
  )
}
