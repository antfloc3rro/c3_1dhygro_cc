import React, { useMemo } from 'react'
import { Target } from 'lucide-react'
import { cn } from '@/utils/index'
import { Layer, Surface, Monitor } from '@/types/index'
import { useAppStore } from '@/store/index'

export interface AssemblyVisualProps {
  layers: Layer[]
  surfaces: {
    exterior: Surface
    interior: Surface
  }
  monitors: Monitor[]
  totalThickness: number
}

/**
 * AssemblyVisual component following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Features:
 * - Horizontal layout (exterior left → interior right)
 * - Width proportional to layer thickness
 * - Fixed height: 200px
 * - Material color with 10% opacity crosshatch pattern
 * - Click to select layer/surface/monitor
 * - Hover effects
 * - Thickness labels above each layer
 * - Material name labels below
 * - Surface bars: 4px wide, blue (#4597BF)
 * - Monitor target icons: 20px, orange/teal
 */
export function AssemblyVisual({
  layers,
  surfaces,
  monitors,
  totalThickness,
}: AssemblyVisualProps) {
  const selectedLayerId = useAppStore((state) => state.ui.selectedLayerId)
  const selectedSurfaceId = useAppStore((state) => state.ui.selectedSurfaceId)
  const selectedMonitorId = useAppStore((state) => state.ui.selectedMonitorId)
  const { selectLayer, selectSurface, selectMonitor } = useAppStore((state) => state.actions)

  // Calculate layer positions for proportional widths
  const layerPositions = useMemo(() => {
    let currentPosition = 0
    return layers.map((layer) => {
      const start = currentPosition
      const width = totalThickness > 0 ? (layer.thickness / totalThickness) * 100 : 100 / layers.length
      currentPosition += width
      return {
        layerId: layer.id,
        start,
        width,
        thickness: layer.thickness,
      }
    })
  }, [layers, totalThickness])

  // Calculate monitor positions
  const monitorPositions = useMemo(() => {
    return monitors.map((monitor) => {
      const layerIndex = layers.findIndex((l) => l.id === monitor.layerId)
      if (layerIndex === -1) return null

      const layer = layers[layerIndex]
      const layerPos = layerPositions[layerIndex]

      // Position within layer (0-1 converted to percentage)
      const positionInLayer = layerPos.start + layerPos.width * monitor.position

      return {
        monitorId: monitor.id,
        position: positionInLayer,
        layerId: layer.id,
        name: monitor.name,
      }
    }).filter(Boolean)
  }, [monitors, layers, layerPositions])

  // Material colors (using a simple hash for demo, would come from material database)
  const getMaterialColor = (materialId: string) => {
    // Default colors based on hash of material ID
    const colors = ['#D4A574', '#8B7355', '#C4A57B', '#9C8D7B', '#B8A88E']
    const hash = materialId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-lg p-4">
      {/* Container for visual assembly */}
      <div className="relative" style={{ minHeight: '300px' }}>
        {/* Surface labels */}
        <div className="flex justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: '#5E5A58' }}>
            Exterior (Left Side)
          </span>
          <span className="text-xs font-medium" style={{ color: '#5E5A58' }}>
            Interior (Right Side)
          </span>
        </div>

        {/* Main assembly visualization */}
        <div className="relative flex items-stretch" style={{ height: '200px' }}>
          {/* Exterior Surface */}
          <div
            className={cn(
              'cursor-pointer transition-all duration-200',
              selectedSurfaceId === surfaces.exterior.id && 'ring-2 ring-bluegreen'
            )}
            style={{
              width: '4px',
              backgroundColor: '#4597BF',
              marginRight: '2px',
            }}
            onClick={() => selectSurface(surfaces.exterior.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)'
            }}
            title="Exterior Surface"
          />

          {/* Layers */}
          <div className="flex-1 flex relative">
            {layers.map((layer, index) => {
              const position = layerPositions[index]
              const isSelected = selectedLayerId === layer.id
              const color = getMaterialColor(layer.material.id)

              return (
                <div
                  key={layer.id}
                  className={cn(
                    'relative cursor-pointer transition-all duration-200',
                    'hover:brightness-110',
                    isSelected && 'ring-[3px] ring-inset ring-bluegreen'
                  )}
                  style={{
                    width: `${position.width}%`,
                    backgroundColor: color,
                    border: '1px solid #D9D8CD',
                    marginRight: index < layers.length - 1 ? '2px' : '0',
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 5px,
                      rgba(0, 0, 0, 0.05) 5px,
                      rgba(0, 0, 0, 0.05) 10px
                    )`,
                  }}
                  onClick={() => selectLayer(layer.id)}
                >
                  {/* Thickness label above */}
                  <div
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono px-1 rounded whitespace-nowrap"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#33302F',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {(layer.thickness * 1000).toFixed(0)} mm
                  </div>
                </div>
              )
            })}

            {/* Monitors overlay */}
            {monitorPositions.map((monPos) => {
              if (!monPos) return null
              const isSelected = selectedMonitorId === monPos.monitorId

              return (
                <div
                  key={monPos.monitorId}
                  className={cn(
                    'absolute top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-200',
                    'hover:scale-125'
                  )}
                  style={{
                    left: `${monPos.position}%`,
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectMonitor(monPos.monitorId)
                  }}
                  title={monPos.name}
                >
                  <Target
                    className="w-5 h-5"
                    style={{
                      color: isSelected ? '#4AB79F' : '#E18E2A',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Interior Surface */}
          <div
            className={cn(
              'cursor-pointer transition-all duration-200',
              selectedSurfaceId === surfaces.interior.id && 'ring-2 ring-bluegreen'
            )}
            style={{
              width: '4px',
              backgroundColor: '#4597BF',
              marginLeft: '2px',
            }}
            onClick={() => selectSurface(surfaces.interior.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)'
            }}
            title="Interior Surface"
          />
        </div>

        {/* Material names below */}
        <div className="flex mt-4">
          <div style={{ width: '4px', marginRight: '2px' }} /> {/* Spacer for exterior surface */}
          <div className="flex-1 flex">
            {layers.map((layer, index) => {
              const position = layerPositions[index]

              return (
                <div
                  key={layer.id}
                  className="text-center"
                  style={{
                    width: `${position.width}%`,
                    marginRight: index < layers.length - 1 ? '2px' : '0',
                  }}
                >
                  <div className="text-xs font-bold truncate px-1" style={{ color: '#33302F' }}>
                    {layer.name || layer.material.name}
                  </div>
                  <div className="text-xs font-mono" style={{ color: '#5E5A58' }}>
                    λ: {layer.material.thermalConductivity.toFixed(3)} W/mK
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ width: '4px', marginLeft: '2px' }} /> {/* Spacer for interior surface */}
        </div>
      </div>
    </div>
  )
}
