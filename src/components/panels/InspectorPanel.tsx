import React from 'react'
import { Database, Settings, Target, Trash2, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NumberInput } from '@/components/ui/NumberInput'
import { useAppStore } from '@/store/index'

/**
 * InspectorPanel (Right Panel) component following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Features:
 * - Width: 320px
 * - Background: white
 * - Border-left: 1px solid greylight
 * - Context-sensitive content based on selection
 * - Quick Actions at top
 * - Properties Preview below
 *
 * Selection States:
 * - Layer selected: Show material database, edit properties buttons + layer properties
 * - Surface selected: Show edit surface coefficients button + surface properties
 * - Monitor selected: Show edit monitor, remove monitor buttons + monitor properties
 * - Nothing selected: Show instructional message
 */
export function InspectorPanel() {
  const selectedLayerId = useAppStore((state) => state.ui.selectedLayerId)
  const selectedSurfaceId = useAppStore((state) => state.ui.selectedSurfaceId)
  const selectedMonitorId = useAppStore((state) => state.ui.selectedMonitorId)
  const layers = useAppStore((state) => state.assembly.layers)
  const surfaces = useAppStore((state) => state.assembly.surfaces)
  const monitors = useAppStore((state) => state.assembly.monitors)
  const { openModal, updateLayer, deleteMonitor } = useAppStore((state) => state.actions)

  const selectedLayer = layers.find((l) => l.id === selectedLayerId)
  const selectedSurface =
    selectedSurfaceId === surfaces.exterior.id
      ? surfaces.exterior
      : selectedSurfaceId === surfaces.interior.id
      ? surfaces.interior
      : null
  const selectedMonitor = monitors.find((m) => m.id === selectedMonitorId)

  return (
    <div className="w-80 min-w-[280px] bg-white border-l border-neutral-200 overflow-y-auto p-4">
      {/* Priority order: Monitor > Surface > Layer > Nothing */}
      {/* When Monitor Selected (highest priority) */}
      {selectedMonitor ? (
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <Button
              variant="primary"
              icon={Target}
              className="w-full"
              onClick={() => openModal('monitor-config')}
            >
              Edit Monitor Settings
            </Button>
            <Button
              variant="secondary"
              icon={Trash2}
              className="w-full border-red text-red hover:bg-red-50"
              onClick={() => {
                if (confirm(`Remove monitor "${selectedMonitor.name}"?`)) {
                  deleteMonitor(selectedMonitor.id)
                }
              }}
            >
              Remove Monitor
            </Button>
          </div>

          {/* Properties Preview */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3">
            <p className="text-xs font-bold uppercase mb-2" style={{ color: '#5E5A58' }}>
              Monitor
            </p>
            <p className="text-sm font-bold mb-2" style={{ color: '#33302F' }}>
              {selectedMonitor.name}
            </p>
            <div className="space-y-1 text-xs font-mono" style={{ color: '#5E5A58' }}>
              <div className="flex justify-between">
                <span>Layer:</span>
                <span>{layers.find((l) => l.id === selectedMonitor.layerId)?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span>Position:</span>
                <span>{(selectedMonitor.position * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : selectedSurface ? (
        <div className="space-y-4">
          {/* Quick Actions */}
          <div>
            <Button
              variant="primary"
              icon={Settings}
              className="w-full"
              onClick={() => openModal('surface-coefficients')}
            >
              Edit Surface Coefficients
            </Button>
          </div>

          {/* Properties Preview */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3">
            <p className="text-xs font-bold uppercase mb-2" style={{ color: '#5E5A58' }}>
              Surface: {selectedSurface.type === 'exterior' ? 'Exterior' : 'Interior'}
            </p>
            <p className="text-sm font-bold mb-2" style={{ color: '#33302F' }}>
              {selectedSurface.name}
            </p>
            <div className="space-y-1 text-xs font-mono" style={{ color: '#5E5A58' }}>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="capitalize">{selectedSurface.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Transfer mode:</span>
                <span>{selectedSurface.coefficientMode || 'Standard'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : selectedLayer ? (
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <Button
              variant="primary"
              icon={Database}
              className="w-full"
              onClick={() => openModal('material-database')}
            >
              Select from Database
            </Button>
            <Button variant="secondary" icon={Settings} className="w-full" disabled>
              Edit Material Properties
            </Button>
          </div>

          {/* Properties Preview */}
          <div>
            {/* Material Info Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 mb-3">
              <p className="text-xs font-bold uppercase mb-2" style={{ color: '#5E5A58' }}>
                Material
              </p>
              <p className="text-sm font-bold mb-1" style={{ color: '#33302F' }}>
                {selectedLayer.material.name}
              </p>
              <div className="space-y-1 text-xs font-mono" style={{ color: '#5E5A58' }}>
                <div className="flex justify-between">
                  <span>λ (dry):</span>
                  <span>{selectedLayer.material.thermalConductivity.toFixed(3)} W/mK</span>
                </div>
                <div className="flex justify-between">
                  <span>ρ (bulk):</span>
                  <span>{selectedLayer.material.bulkDensity?.toFixed(0) || 'N/A'} kg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Thickness:</span>
                  <span>{(selectedLayer.thickness * 1000).toFixed(0)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Grid cells:</span>
                  <span>{selectedLayer.gridCells || 'Auto'}</span>
                </div>
              </div>
            </div>

            {/* Initial Conditions Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3">
              <p className="text-xs font-bold uppercase mb-2" style={{ color: '#5E5A58' }}>
                Initial Conditions
              </p>
              <div className="space-y-2">
                <NumberInput
                  label="Temperature"
                  value={selectedLayer.initialTemperature || 20}
                  onChange={(value) => {
                    if (value !== null) {
                      updateLayer(selectedLayer.id, { initialTemperature: value })
                    }
                  }}
                  min={-50}
                  max={80}
                  decimals={1}
                  unit="°C"
                />
                <NumberInput
                  label="Relative Humidity"
                  value={selectedLayer.initialHumidity || 80}
                  onChange={(value) => {
                    if (value !== null) {
                      updateLayer(selectedLayer.id, { initialHumidity: value })
                    }
                  }}
                  min={0}
                  max={100}
                  decimals={1}
                  unit="%"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-neutral-50 rounded-lg border border-neutral-200">
          <Info className="w-8 h-8 mb-3" style={{ color: '#4597BF' }} />
          <p className="text-sm" style={{ color: '#5E5A58' }}>
            Select a layer, surface, or monitor to view details
          </p>
        </div>
      )}
    </div>
  )
}
