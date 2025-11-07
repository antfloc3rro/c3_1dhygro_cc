import React, { useMemo } from 'react'
import { Target } from 'lucide-react'
import { Layer, Monitor } from '@/types'

interface GridDiscretizationProps {
  layer: Layer
  monitors: Monitor[]
  onCellClick?: (cellIndex: number) => void
}

/**
 * GridDiscretization component - Shows zoomed-in grid cells for selected layer
 *
 * Displays a horizontal bar with individual grid cells that can be clicked
 * to place monitors at specific positions within the layer.
 * Monitors that are already placed in this layer are shown in their respective cells.
 */
export function GridDiscretization({ layer, monitors, onCellClick }: GridDiscretizationProps) {
  const gridCells = typeof layer.gridCells === 'number' ? layer.gridCells : 10

  // Find monitors in this layer and map them to grid cells
  const monitorsByCellIndex = useMemo(() => {
    const cellMap = new Map<number, Monitor[]>()

    monitors.forEach((monitor) => {
      if (monitor.layerId === layer.id) {
        // Monitor position is 0-1 within the layer
        // Calculate which cell it falls into
        const cellIndex = Math.floor(monitor.position * gridCells)
        // Clamp to valid range
        const validIndex = Math.max(0, Math.min(gridCells - 1, cellIndex))

        if (!cellMap.has(validIndex)) {
          cellMap.set(validIndex, [])
        }
        cellMap.get(validIndex)!.push(monitor)
      }
    })

    return cellMap
  }, [monitors, layer.id, gridCells])

  return (
    <div
      className="mt-4 border border-greylight rounded-lg p-md bg-neutral-50"
    >
      {/* Title */}
      <div className="text-xs font-semibold mb-sm" style={{ color: '#33302F' }}>
        Grid Discretization: {layer.name || layer.material.name}
      </div>

      {/* Grid Cells */}
      <div
        className="flex h-12 border border-greylight rounded-md overflow-hidden bg-white"
      >
        {Array.from({ length: gridCells }).map((_, idx) => {
          const cellMonitors = monitorsByCellIndex.get(idx) || []
          const hasMonitor = cellMonitors.length > 0
          const monitor = cellMonitors[0] // Show first monitor if multiple

          return (
            <div
              key={idx}
              className="flex-1 cursor-pointer transition-all duration-200 hover:bg-bluegreen/20 border-r border-greylight last:border-r-0 relative flex items-center justify-center"
              style={{
                backgroundColor: hasMonitor
                  ? `${monitor.color || '#E18E2A'}20` // 20% opacity of monitor color
                  : idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
              }}
              title={
                hasMonitor
                  ? `Cell ${idx + 1}/${gridCells} - Monitor: ${monitor.name}`
                  : `Cell ${idx + 1}/${gridCells} - Click to place monitor`
              }
              onClick={() => onCellClick?.(idx)}
            >
              {hasMonitor && (
                <Target
                  className="w-4 h-4"
                  style={{ color: monitor.color || '#E18E2A' }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Helper Text */}
      <div className="text-[10px] mt-sm" style={{ color: '#5E5A58' }}>
        {monitorsByCellIndex.size > 0
          ? `${monitorsByCellIndex.size} monitor${monitorsByCellIndex.size !== 1 ? 's' : ''} in this layer. Click a cell to place another monitor.`
          : 'Click on a grid cell to place monitor at that position'
        }
      </div>

      {/* Grid Info */}
      <div className="mt-sm text-xs" style={{ color: '#5E5A58' }}>
        <span className="font-medium">Grid cells:</span> {gridCells} × <span className="font-medium">Cell width:</span>{' '}
        {((layer.thickness * 1000) / gridCells).toFixed(2)} mm
      </div>
    </div>
  )
}
