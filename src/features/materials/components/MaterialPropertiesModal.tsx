import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { NumberInput } from '../../../components/ui/NumberInput'
import { Collapsible } from '../../../components/ui/Collapsible'
import { AlertCircle, Info } from 'lucide-react'
import { Material } from '../../../types'

interface MaterialPropertiesModalProps {
  isOpen: boolean
  onClose: () => void
  material: Material
  onSave: (updates: Partial<Material>) => void
}

/**
 * MaterialPropertiesModal - Advanced material property editor for power users
 *
 * Allows editing of thermal and hygrothermal properties of materials.
 * Auto-saves on close, consistent with app patterns.
 */
export function MaterialPropertiesModal({
  isOpen,
  onClose,
  material,
  onSave,
}: MaterialPropertiesModalProps) {
  // Local state for editable properties
  const [name, setName] = useState(material.name)
  const [manufacturer, setManufacturer] = useState(material.manufacturer || '')
  const [thermalConductivity, setThermalConductivity] = useState(material.thermalConductivity)
  const [bulkDensity, setBulkDensity] = useState(material.bulkDensity)
  const [heatCapacity, setHeatCapacity] = useState(material.heatCapacity)
  const [porosity, setPorosity] = useState(material.porosity)
  const [vaporResistanceFactor, setVaporResistanceFactor] = useState(material.vaporResistanceFactor)

  // Reset state when material changes
  useEffect(() => {
    if (isOpen && material) {
      setName(material.name)
      setManufacturer(material.manufacturer || '')
      setThermalConductivity(material.thermalConductivity)
      setBulkDensity(material.bulkDensity)
      setHeatCapacity(material.heatCapacity)
      setPorosity(material.porosity)
      setVaporResistanceFactor(material.vaporResistanceFactor)
    }
  }, [isOpen, material])

  // Validation
  const hasValidName = name.trim().length > 0
  const hasValidValues =
    thermalConductivity > 0 &&
    bulkDensity > 0 &&
    heatCapacity > 0 &&
    porosity >= 0 &&
    porosity <= 1 &&
    vaporResistanceFactor > 0

  const isValid = hasValidName && hasValidValues

  // Auto-save on close
  const handleClose = () => {
    if (isValid) {
      // Only save if something changed
      const hasChanges =
        name !== material.name ||
        manufacturer !== (material.manufacturer || '') ||
        thermalConductivity !== material.thermalConductivity ||
        bulkDensity !== material.bulkDensity ||
        heatCapacity !== material.heatCapacity ||
        porosity !== material.porosity ||
        vaporResistanceFactor !== material.vaporResistanceFactor

      if (hasChanges) {
        onSave({
          name: name.trim(),
          manufacturer: manufacturer.trim() || undefined,
          thermalConductivity,
          bulkDensity,
          heatCapacity,
          porosity,
          vaporResistanceFactor,
        })
      }
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Material Properties"
      size="lg"
    >
      <div className="space-y-md">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <div className="font-medium">Power User Feature</div>
            <div className="text-blue-700 mt-1">
              Editing material properties creates a custom material. For standard materials, use "Select from Database" instead.
            </div>
          </div>
        </div>

        {/* Material Identification */}
        <Collapsible title="Material Identification" defaultExpanded={true}>
          <div className="space-y-3">
            <Input
              label="Material Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Custom Concrete"
              required
            />
            <Input
              label="Manufacturer (Optional)"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="e.g., ACME Building Materials"
            />
          </div>
        </Collapsible>

        {/* Thermal Properties */}
        <Collapsible title="Thermal Properties" defaultExpanded={true}>
          <div className="space-y-3">
            <NumberInput
              label="Thermal Conductivity (λ)"
              value={thermalConductivity}
              onChange={(val) => val !== null && setThermalConductivity(val)}
              min={0.001}
              max={10}
              decimals={4}
              unit="W/(m·K)"
              helperText="Heat transfer through material. Typical: 0.04 (insulation) to 2.0 (concrete)"
            />
            <NumberInput
              label="Bulk Density (ρ)"
              value={bulkDensity}
              onChange={(val) => val !== null && setBulkDensity(val)}
              min={1}
              max={10000}
              decimals={0}
              unit="kg/m³"
              helperText="Mass per volume. Typical: 30 (insulation) to 2400 (concrete)"
            />
            <NumberInput
              label="Heat Capacity (c)"
              value={heatCapacity}
              onChange={(val) => val !== null && setHeatCapacity(val)}
              min={100}
              max={10000}
              decimals={0}
              unit="J/(kg·K)"
              helperText="Energy to raise temperature. Typical: 850 (mineral) to 2000 (organic)"
            />
          </div>
        </Collapsible>

        {/* Hygrothermal Properties */}
        <Collapsible title="Hygrothermal Properties" defaultExpanded={true}>
          <div className="space-y-3">
            <NumberInput
              label="Porosity"
              value={porosity}
              onChange={(val) => val !== null && setPorosity(val)}
              min={0}
              max={1}
              decimals={3}
              unit="m³/m³"
              helperText="Void space ratio (0-1). Typical: 0.05 (dense) to 0.95 (highly porous)"
            />
            <NumberInput
              label="Water Vapor Diffusion Resistance Factor (μ)"
              value={vaporResistanceFactor}
              onChange={(val) => val !== null && setVaporResistanceFactor(val)}
              min={1}
              max={100000}
              decimals={0}
              unit="[-]"
              helperText="Vapor permeability vs air. Typical: 5 (wood) to 50000 (vapor barrier)"
            />
          </div>
        </Collapsible>

        {/* Validation Warning */}
        {!isValid && (
          <div className="border border-orange rounded p-md bg-orange/10 flex items-start gap-sm">
            <AlertCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Invalid Properties</div>
              <div className="text-greydark mt-1">
                {!hasValidName && <div>• Material name is required</div>}
                {!hasValidValues && <div>• All property values must be within valid ranges</div>}
                <div className="mt-2">Close this modal without saving to discard changes.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
