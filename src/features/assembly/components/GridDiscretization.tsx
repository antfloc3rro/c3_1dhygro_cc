import React from 'react'
import { Layer } from '@/types'

interface GridDiscretizationProps {
  layer: Layer
  onCellClick?: (cellIndex: number) => void
}

/**
 * GridDiscretization component - Shows zoomed-in grid cells for selected layer
 *
 * Displays a horizontal bar with individual grid cells that can be clicked
 * to place monitors at specific positions within the layer.
 */
export function GridDiscretization({ layer, onCellClick }: GridDiscretizationProps) {
  const gridCells = typeof layer.gridCells === 'number' ? layer.gridCells : 10

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
        {Array.from({ length: gridCells }).map((_, idx) => (
          <div
            key={idx}
            className="flex-1 cursor-pointer transition-colors duration-200 hover:bg-bluegreen/20 border-r border-greylight last:border-r-0"
            style={{
              backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
            }}
            title={`Cell ${idx + 1}/${gridCells} - Click to place monitor`}
            onClick={() => onCellClick?.(idx)}
          />
        ))}
      </div>

      {/* Helper Text */}
      <div className="text-[10px] mt-sm" style={{ color: '#5E5A58' }}>
        Click on a grid cell to place monitor at that position
      </div>

      {/* Grid Info */}
      <div className="mt-sm text-xs" style={{ color: '#5E5A58' }}>
        <span className="font-medium">Grid cells:</span> {gridCells} × <span className="font-medium">Cell width:</span>{' '}
        {((layer.thickness * 1000) / gridCells).toFixed(2)} mm
      </div>
    </div>
  )
}
