import React from 'react'
import { cn } from '@utils/index'
import { Header } from './Header'
import { LeftPanel } from '../panels/LeftPanel'
import { CenterPanel } from '../panels/CenterPanel'
import { RightPanel } from '../panels/RightPanel'
import { UIState } from '@types/index'

interface MainLayoutProps {
  ui: ReturnType<import('@hooks/index')['useUIState']>
}

export function MainLayout({ ui }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-50">
      {/* Header */}
      <Header />

      {/* Main content area - three columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Project/Case/Assembly navigation */}
        <LeftPanel ui={ui} />

        {/* Center Panel: Visual assembly + data table */}
        <CenterPanel ui={ui} />

        {/* Right Panel: Inspector/Properties */}
        <RightPanel ui={ui} />
      </div>
    </div>
  )
}
