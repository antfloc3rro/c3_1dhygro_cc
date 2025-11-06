import { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { NumberInput } from '../../../components/ui/NumberInput';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Collapsible } from '../../../components/ui/Collapsible';
import { Check, AlertCircle } from 'lucide-react';
import { Surface, SurfaceCoefficients, SurfacePreset } from '../types';

interface SurfaceCoefficientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (surface: Surface) => void;
  surface: Surface;
  presets: SurfacePreset[];
}

export function SurfaceCoefficientsModal({
  isOpen,
  onClose,
  onSave,
  surface,
  presets,
}: SurfaceCoefficientsModalProps) {
  const [coefficients, setCoefficients] = useState<SurfaceCoefficients>(surface.coefficients);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  // Reset coefficients when surface changes
  useEffect(() => {
    setCoefficients(surface.coefficients);
    setSelectedPreset('custom');
  }, [surface]);

  // Filter presets by surface type
  const filteredPresets = presets.filter((preset) => preset.type === surface.type);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId !== 'custom') {
      const preset = presets.find((p) => p.id === presetId);
      if (preset) {
        setCoefficients(preset.coefficients);
      }
    }
  };

  const handleSave = () => {
    onSave({
      ...surface,
      coefficients,
    });
    onClose();
  };

  const updateCoefficient = (key: keyof SurfaceCoefficients, value: number | boolean) => {
    setCoefficients((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSelectedPreset('custom'); // Mark as custom when manually edited
  };

  const presetOptions = [
    { value: 'custom', label: 'Custom' },
    ...filteredPresets.map((preset) => ({
      value: preset.id,
      label: preset.name,
      description: preset.description,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${surface.type === 'exterior' ? 'Exterior' : 'Interior'} Surface Coefficients`}
      size="lg"
    >
      <div className="space-y-md">
        {/* Surface Info */}
        <div className="border border-greylight rounded p-md bg-greylight/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{surface.name}</div>
              <div className="text-sm text-greydark">
                {surface.type === 'exterior' ? 'Exterior Surface' : 'Interior Surface'}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-greydark">Position:</span>
              <span className="ml-2 font-medium">
                {surface.type === 'exterior' ? 'Left (Exterior)' : 'Right (Interior)'}
              </span>
            </div>
          </div>
        </div>

        {/* Preset Selection */}
        <Select
          label="Preset"
          value={selectedPreset}
          onChange={handlePresetChange}
          options={presetOptions}
        />

        {/* Heat Transfer Coefficients */}
        <Collapsible
          title="Heat Transfer"
          defaultExpanded={true}
          summary={`α = ${coefficients.heatTransferCoefficient} W/(m²·K)`}
        >
          <div className="space-y-md">
            <NumberInput
              label="Heat Transfer Coefficient (α)"
              value={coefficients.heatTransferCoefficient}
              onChange={(val) => updateCoefficient('heatTransferCoefficient', val)}
              unit="W/(m²·K)"
              min={0.1}
              max={100}
              step={0.1}
              helperText={
                surface.type === 'exterior'
                  ? 'Typical range: 4-25 W/(m²·K)'
                  : 'Typical range: 2-10 W/(m²·K)'
              }
            />

            <NumberInput
              label="Short-Wave Radiation Absorptivity"
              value={coefficients.shortWaveRadiationAbsorptivity}
              onChange={(val) => updateCoefficient('shortWaveRadiationAbsorptivity', val)}
              unit="-"
              min={0}
              max={1}
              step={0.01}
              helperText="Solar radiation absorption (0 = white, 1 = black)"
            />

            <NumberInput
              label="Long-Wave Radiation Emissivity"
              value={coefficients.longWaveRadiationEmissivity}
              onChange={(val) => updateCoefficient('longWaveRadiationEmissivity', val)}
              unit="-"
              min={0}
              max={1}
              step={0.01}
              helperText="Thermal radiation emission (typical: 0.9)"
            />
          </div>
        </Collapsible>

        {/* Moisture Transfer Coefficients */}
        <Collapsible
          title="Moisture Transfer"
          defaultExpanded={false}
          summary={
            coefficients.sdValue
              ? `sd = ${coefficients.sdValue} m`
              : 'Not configured'
          }
        >
          <div className="space-y-md">
            <NumberInput
              label="sd-Value (Vapor Diffusion Resistance)"
              value={coefficients.sdValue || 0}
              onChange={(val) => updateCoefficient('sdValue', val)}
              unit="m"
              min={0}
              max={1000}
              step={0.01}
              helperText="Equivalent air layer thickness for vapor diffusion"
            />

            {surface.type === 'exterior' && (
              <>
                <NumberInput
                  label="Rain Absorption Factor"
                  value={coefficients.rainAbsorptionFactor || 0}
                  onChange={(val) => updateCoefficient('rainAbsorptionFactor', val)}
                  unit="-"
                  min={0}
                  max={1}
                  step={0.01}
                  helperText="Fraction of rain absorbed by surface (0 = no absorption)"
                />

                <NumberInput
                  label="Rain Deposition Factor"
                  value={coefficients.rainDepositionFactor || 0}
                  onChange={(val) => updateCoefficient('rainDepositionFactor', val)}
                  unit="-"
                  min={0}
                  max={10}
                  step={0.1}
                  helperText="Factor for rain deposition on surface"
                />
              </>
            )}
          </div>
        </Collapsible>

        {/* Advanced Options */}
        <Collapsible
          title="Advanced Options"
          defaultExpanded={false}
          summary="Additional calculation settings"
        >
          <div className="space-y-md">
            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                checked={coefficients.explicitRadiation || false}
                onChange={(e) => updateCoefficient('explicitRadiation', e.target.checked)}
                className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
              />
              <span className="text-sm">Explicit Radiation Calculation</span>
            </label>

            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                checked={coefficients.windDependentCoefficient || false}
                onChange={(e) => updateCoefficient('windDependentCoefficient', e.target.checked)}
                className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
              />
              <span className="text-sm">Wind-Dependent Heat Transfer Coefficient</span>
            </label>

            {surface.type === 'exterior' && (
              <label className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  checked={coefficients.adheredRainwater || false}
                  onChange={(e) => updateCoefficient('adheredRainwater', e.target.checked)}
                  className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
                />
                <span className="text-sm">Consider Adhered Rainwater Film</span>
              </label>
            )}
          </div>
        </Collapsible>

        {/* Validation Warning */}
        {(coefficients.heatTransferCoefficient < 1 ||
          coefficients.heatTransferCoefficient > 50) && (
          <div className="border border-orange rounded p-md bg-orange/10 flex items-start gap-sm">
            <AlertCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Unusual heat transfer coefficient</div>
              <div className="text-greydark mt-1">
                The heat transfer coefficient is outside the typical range. Please verify this
                value is correct for your application.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-sm mt-lg">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} icon={Check}>
          Save Changes
        </Button>
      </div>
    </Modal>
  );
}
