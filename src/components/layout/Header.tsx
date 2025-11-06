import React from 'react'
import { FileText } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-2 rounded-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">WUFI Cloud MVP</h1>
            <p className="text-xs text-neutral-500">1D Hygrothermal Component Simulation</p>
          </div>
        </div>

        {/* Status indicators (placeholder) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-neutral-600">Ready</span>
          </div>
        </div>
      </div>
    </header>
  )
}
