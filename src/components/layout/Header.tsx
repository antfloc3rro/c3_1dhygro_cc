import React from 'react'
import { FileText } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md" style={{ backgroundColor: '#4AB79F' }}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-heading" style={{ color: '#33302F' }}>WUFI Cloud MVP</h1>
            <p className="text-xs" style={{ color: '#5E5A58' }}>1D Hygrothermal Component Simulation</p>
          </div>
        </div>

        {/* Status indicators (placeholder) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3E7263' }}></div>
            <span className="text-sm" style={{ color: '#5E5A58' }}>Ready</span>
          </div>
        </div>
      </div>
    </header>
  )
}
