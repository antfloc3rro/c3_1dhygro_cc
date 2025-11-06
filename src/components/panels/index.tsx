import React from 'react'
import { ChevronDown } from 'lucide-react'

interface PanelProps {
  ui: ReturnType<import('@hooks/index')['useUIState']>
}

export function LeftPanel({ ui }: PanelProps) {
  return (
    <div className="w-72 bg-white border-r border-neutral-200 flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-base font-semibold text-neutral-900">Project</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="space-y-2">
          <div className="text-sm text-neutral-500">No project loaded</div>
        </div>
      </div>
    </div>
  )
}

export function CenterPanel({ ui }: PanelProps) {
  return (
    <div className="flex-1 bg-neutral-50 flex flex-col overflow-hidden border-r border-neutral-200">
      {/* Visual assembly area */}
      <div className="h-48 bg-white border-b border-neutral-200 p-4 shadow-sm">
        <div className="text-sm text-neutral-500">Visual Assembly (Placeholder)</div>
      </div>

      {/* Data table area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="text-sm text-neutral-500">Data Table (Placeholder)</div>
      </div>
    </div>
  )
}

export function RightPanel({ ui }: PanelProps) {
  return (
    <div className="w-80 bg-white border-l border-neutral-200 flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-base font-semibold text-neutral-900">Inspector</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="text-sm text-neutral-500">Select an item to inspect</div>
      </div>
    </div>
  )
}
