import React, { Fragment } from 'react'
import { Tab } from '@headlessui/react'
import { cn } from '@/utils/index'
import { LucideIcon } from 'lucide-react'

export interface TabItem {
  key: string
  label: string
  icon?: LucideIcon
  disabled?: boolean
  badge?: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  selectedIndex?: number
  onChange?: (index: number) => void
  children: React.ReactNode[]
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
 * - Keyboard navigation (Arrow keys, Enter)
 * - Screen reader support
 * - Optional icons
 * - Optional badges
 * - Disabled state support
 */
export function Tabs({ tabs, selectedIndex, onChange, children }: TabsProps) {
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={onChange}>
      <Tab.List className="flex border-b border-neutral-200">
        {tabs.map((tab) => (
          <Tab key={tab.key} disabled={tab.disabled} as={Fragment}>
            {({ selected }) => (
              <button
                className={cn(
                  'flex items-center gap-2 h-11 px-6 text-sm transition-all duration-200 ease-out',
                  'border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-bluegreen focus-visible:ring-offset-2',
                  selected
                    ? 'border-b-bluegreen font-semibold'
                    : 'border-b-transparent font-normal',
                  !selected && !tab.disabled && 'hover:border-b-grey',
                  tab.disabled && 'opacity-50 cursor-not-allowed'
                )}
                style={{
                  color: selected ? '#4AB79F' : '#5E5A58',
                }}
                disabled={tab.disabled}
              >
                {tab.icon && <tab.icon className="w-[18px] h-[18px]" />}
                <span>{tab.label}</span>
                {tab.badge && <span className="ml-1">{tab.badge}</span>}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels className="mt-4">
        {children.map((child, idx) => (
          <Tab.Panel
            key={idx}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-bluegreen focus-visible:ring-offset-2 rounded-md"
          >
            {child}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}
