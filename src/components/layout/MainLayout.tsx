import React, { useState } from 'react'
import { Settings, BarChart2 } from 'lucide-react'
import { Tabs, TabItem } from '@/components/ui/Tabs'
import { EnhancedHeader } from './EnhancedHeader'
import { StatusBar } from './StatusBar'
import { LeftPanel } from '@/components/panels/LeftPanel'
import { InspectorPanel } from '@/components/panels/InspectorPanel'
import { AssemblyVisual, DataTable, PerformanceSummary, GridDiscretization } from '@/features/assembly/components'
import { useAppStore } from '@/store/index'
import { useAutoSave, useRestoreAutoSave } from '@/hooks/useAutoSave'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

/**
 * MainLayout component - integrates all panels and main content area
 * Following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Layout Structure:
 * - Header: Logo, project name, case selector, actions
 * - Status Bar: Simulation readiness indicator
 * - Tabs: [Setup] [Results]
 * - Three-panel layout:
 *   - Left Panel (288px): Collapsible settings
 *   - Center Panel (flexible): Visual assembly + data table
 *   - Right Panel (320px): Context-sensitive inspector
 */
export function MainLayout() {
  const [gridVisible, setGridVisible] = useState(false)

  // Use store for persistent tab selection
  const selectedTab = useAppStore((state) => state.ui.mainLayoutSelectedTab)
  const setSelectedTab = useAppStore((state) => state.actions.setMainLayoutTab)

  // Auto-save functionality with 1-second debounce
  const { saveNow } = useAutoSave(true, 1000)

  // Restore from auto-save on mount
  useRestoreAutoSave()

  // Keyboard shortcuts (Cmd+Z undo, Cmd+S save, etc.)
  useKeyboardShortcuts(saveNow)

  const layers = useAppStore((state) => state.assembly.layers)
  const surfaces = useAppStore((state) => state.assembly.surfaces)
  const monitors = useAppStore((state) => state.assembly.monitors)
  const totalThickness = useAppStore((state) => state.assembly.totalThickness)
  const uValue = useAppStore((state) => state.assembly.uValue)
  const simulationStatus = useAppStore((state) => state.simulation.status)
  const selectedLayerId = useAppStore((state) => state.ui.selectedLayerId)
  const { openModal, selectLayer } = useAppStore((state) => state.actions)

  // Get the selected layer for grid discretization
  const selectedLayer = layers.find((l) => l.id === selectedLayerId)

  // Handle grid cell click - opens monitor modal with position set to that cell
  const handleGridCellClick = (cellIndex: number) => {
    if (!selectedLayer) return

    // Calculate position in mm: cell position from exterior surface
    // Each cell represents a fraction of the layer thickness
    const gridCells = typeof selectedLayer.gridCells === 'number' ? selectedLayer.gridCells : 10
    const cellFraction = (cellIndex + 0.5) / gridCells // Center of the cell (0-1 within layer)

    // Calculate position from exterior surface of entire assembly
    const layerIndex = layers.findIndex((l) => l.id === selectedLayerId)
    const positionBeforeLayerMm = layers.slice(0, layerIndex).reduce((sum, l) => sum + l.thickness * 1000, 0)
    const positionInLayerMm = cellFraction * selectedLayer.thickness * 1000
    const totalPositionMm = positionBeforeLayerMm + positionInLayerMm

    // TODO: Pass this position to the monitor modal
    // For now, just open the modal
    openModal('monitor-config')
  }

  const tabs: TabItem[] = [
    {
      key: 'setup',
      label: 'Setup',
      icon: Settings,
    },
    {
      key: 'results',
      label: 'Results',
      icon: BarChart2,
      disabled: simulationStatus !== 'completed',
    },
  ]

  // Status bar configuration
  const getStatusBarProps = () => {
    const layerCount = layers.length
    const monitorCount = monitors.length
    const gridCells = layers.reduce((sum, layer) => sum + (layer.gridCells || 10), 0)

    if (simulationStatus === 'running') {
      return {
        status: 'running' as const,
        message: 'Simulation in progress...',
        progress: 45,
        stats: [
          { label: 'Layers', value: layerCount },
          { label: 'Monitors', value: monitorCount },
        ],
      }
    }

    if (simulationStatus === 'completed') {
      return {
        status: 'completed' as const,
        message: 'Simulation completed successfully',
        stats: [
          { label: 'Layers', value: layerCount },
          { label: 'Monitors', value: monitorCount },
          { label: 'Grid cells', value: gridCells },
        ],
      }
    }

    if (layerCount === 0) {
      return {
        status: 'error' as const,
        message: 'Fix errors before running',
        issues: [
          {
            id: 'no-layers',
            severity: 'error' as const,
            message: 'No layers defined. Add at least one layer to the assembly.',
            action: {
              label: 'Add Layer',
              onClick: () => openModal('material-database'),
            },
          },
        ],
      }
    }

    if (monitorCount === 0) {
      return {
        status: 'warning' as const,
        message: 'Review warnings before running',
        stats: [
          { label: 'Layers', value: layerCount },
          { label: 'Grid cells', value: gridCells },
        ],
        issues: [
          {
            id: 'no-monitors',
            severity: 'warning' as const,
            message: 'No monitors defined. Results will be limited without monitors.',
            action: {
              label: 'Learn more',
              onClick: () => console.log('Show monitor help'),
            },
          },
        ],
      }
    }

    return {
      status: 'ready' as const,
      message: 'Ready to run simulation',
      stats: [
        { label: 'Layers', value: layerCount },
        { label: 'Monitors', value: monitorCount },
        { label: 'Grid cells', value: gridCells },
      ],
    }
  }

  const statusBarProps = getStatusBarProps()

  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Header */}
      <EnhancedHeader />

      {/* Status Bar */}
      <StatusBar {...statusBarProps} />

      {/* Tabs */}
      <Tabs tabs={tabs} selectedIndex={selectedTab} onChange={setSelectedTab}>
        {/* Setup Tab */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <LeftPanel />

          {/* Center Panel */}
          <div className="flex-1 overflow-y-auto p-4 bg-neutral-50">
            <div className="max-w-[1400px] mx-auto space-y-4">
              {/* Performance Summary */}
              <PerformanceSummary
                totalThickness={totalThickness}
                uValue={uValue}
                gridVisible={gridVisible}
                onToggleGrid={() => setGridVisible(!gridVisible)}
                onAddMonitor={() => openModal('monitor-config')}
              />

              {/* Visual Assembly */}
              {layers.length > 0 ? (
                <>
                  <AssemblyVisual
                    layers={layers}
                    surfaces={surfaces}
                    monitors={monitors}
                    totalThickness={totalThickness}
                  />

                  {/* Grid Discretization - shows when grid is visible and layer is selected */}
                  {gridVisible && selectedLayer && (
                    <GridDiscretization
                      layer={selectedLayer}
                      monitors={monitors}
                      onCellClick={handleGridCellClick}
                    />
                  )}
                </>
              ) : (
                <div className="bg-white border border-dashed border-neutral-300 rounded-lg p-12 text-center">
                  <p className="text-sm mb-4" style={{ color: '#5E5A58' }}>
                    No layers defined. Add a layer to start building your assembly.
                  </p>
                  <button
                    className="px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200"
                    style={{
                      backgroundColor: '#4AB79F',
                      color: '#FFFFFF',
                    }}
                    onClick={() => {
                      selectLayer(null)
                      openModal('material-database')
                    }}
                  >
                    + Add First Layer
                  </button>
                </div>
              )}

              {/* Data Table */}
              {layers.length > 0 && (
                <DataTable
                  layers={layers}
                  onAddLayer={() => {
                    selectLayer(null)
                    openModal('material-database')
                  }}
                />
              )}
            </div>
          </div>

          {/* Right Panel (Inspector) */}
          <InspectorPanel />
        </div>

        {/* Results Tab (Placeholder) */}
        <div className="flex items-center justify-center h-full bg-neutral-50">
          <div className="text-center">
            <BarChart2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#BDB2AA' }} />
            <p className="text-lg font-semibold mb-2" style={{ color: '#33302F' }}>
              Results Visualization
            </p>
            <p className="text-sm" style={{ color: '#5E5A58' }}>
              Run a simulation to view results
            </p>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
