import React from 'react'
import { cn } from '@/utils/index'
import { LucideIcon } from 'lucide-react'

export interface TabItem {
  id: string
  label: string
  icon?: LucideIcon
  disabled?: boolean
  badge?: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
}

/**
 * Tabs component following WUFI Cloud UI/UX v2.1 specification
 *
 * Specifications from Part 2:
 * - Height: 44px
 * - Padding: 12px 24px
 * - Font: Lato, 0.875rem (14px), 600 (bold when active)
 * - Border-bottom: 2px solid transparent
 * - Active tab: Border-bottom color = bluegreen (#4AB79F), text bold
 * - Inactive tab: Border-bottom greylight, text greydark
 * - Transition: 200ms ease-out
 * - Hover (inactive): Border-bottom color = grey
 * - Disabled: No hover, opacity 50%, cursor not-allowed
 *
 * Features:
 * - Optional icons
 * - Optional badges
 * - Disabled state support
 */
export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-neutral-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 h-11 px-6 text-sm transition-all duration-200 ease-out',
              'border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-bluegreen focus-visible:ring-offset-2',
              isActive
                ? 'border-b-bluegreen font-semibold'
                : 'border-b-transparent font-normal',
              !isActive && !tab.disabled && 'hover:border-b-grey',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
            style={{
              color: isActive ? '#4AB79F' : '#5E5A58',
            }}
            disabled={tab.disabled}
          >
            {Icon && <Icon className="w-[18px] h-[18px]" />}
            <span>{tab.label}</span>
            {tab.badge && <span className="ml-1">{tab.badge}</span>}
          </button>
        )
      })}
    </div>
  )
}
