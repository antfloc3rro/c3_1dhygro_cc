import { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { NumberInput } from '../../../components/ui/NumberInput';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Collapsible } from '../../../components/ui/Collapsible';
import { Check, AlertCircle } from 'lucide-react';
import { Monitor, MonitorType, MonitorVariables, Layer } from '../../../types';
import { MonitorPreset } from '../types';

interface MonitorConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (monitor: Monitor) => void;
  monitor?: Monitor; // If provided, editing existing monitor
  layers: Layer[];
  totalThickness: number;
  presets: MonitorPreset[];
}

export function MonitorConfigurationModal({
  isOpen,
  onClose,
  onSave,
  monitor,
  layers,
  totalThickness,
  presets,
}: MonitorConfigurationModalProps) {
  const [name, setName] = useState(monitor?.name || 'Monitor 1');
  const [positionMm, setPositionMm] = useState(0); // Position in mm from exterior
  const [layerId, setLayerId] = useState<string>(layers.length > 0 ? layers[0].id : '');
  const [type, setType] = useState<MonitorType>(monitor?.type || 'point');
  const [variables, setVariables] = useState<MonitorVariables>(
    monitor?.variables || {
      temperature: true,
      relativeHumidity: true,
      waterContent: false,
      heatFlux: false,
      vaporFlux: false,
      liquidFlux: false,
    }
  );
  const [outputInterval, setOutputInterval] = useState<'hourly' | 'daily' | 'monthly'>(
    monitor?.outputInterval || 'hourly'
  );
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  // Reset when monitor changes or modal opens
  useEffect(() => {
    if (monitor && monitor.layerId) {
      // Editing existing monitor - convert from relative position to mm
      const layer = layers.find(l => l.id === monitor.layerId);
      if (layer) {
        // Calculate position in mm from relative position within layer
        const layerStartMm = layers.slice(0, layers.findIndex(l => l.id === monitor.layerId))
          .reduce((sum, l) => sum + l.thickness * 1000, 0);
        const positionInLayerMm = monitor.position * layer.thickness * 1000;
        setPositionMm(layerStartMm + positionInLayerMm);
        setLayerId(monitor.layerId);
      }
      setName(monitor.name);
      setType(monitor.type || 'point');
      setVariables(monitor.variables || {
        temperature: true,
        relativeHumidity: true,
        waterContent: false,
        heatFlux: false,
        vaporFlux: false,
        liquidFlux: false,
      });
      setOutputInterval(monitor.outputInterval || 'hourly');
    } else if (isOpen && layers.length > 0) {
      // New monitor - reset to defaults
      setName('Monitor 1');
      setPositionMm(0);
      setLayerId(layers[0].id);
      setType('point');
      setVariables({
        temperature: true,
        relativeHumidity: true,
        waterContent: false,
        heatFlux: false,
        vaporFlux: false,
        liquidFlux: false,
      });
      setOutputInterval('hourly');
    }
  }, [monitor, isOpen, layers]);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId !== 'custom') {
      const preset = presets.find((p) => p.id === presetId);
      if (preset) {
        setType(preset.type);
        setVariables(preset.variables);
        setOutputInterval(preset.outputInterval);
        setName(preset.name);
      }
    }
  };

  const handleSave = () => {
    // Find the layer that contains this position
    let cumulativeThickness = 0;
    let selectedLayer = layers[0];
    let relativePosition = 0;

    for (const layer of layers) {
      const layerThicknessMm = layer.thickness * 1000;
      if (positionMm >= cumulativeThickness && positionMm <= cumulativeThickness + layerThicknessMm) {
        selectedLayer = layer;
        // Calculate position within this layer (0-1)
        relativePosition = (positionMm - cumulativeThickness) / layerThicknessMm;
        break;
      }
      cumulativeThickness += layerThicknessMm;
    }

    // Clamp to 0-1 range
    relativePosition = Math.max(0, Math.min(1, relativePosition));

    // Generate random color for new monitors
    const colors = ['#E18E2A', '#4AB79F', '#C04343', '#7B68A6', '#F7C741'];
    const color = monitor?.color || colors[Math.floor(Math.random() * colors.length)];

    const monitorData: Monitor = {
      id: monitor?.id || `monitor-${Date.now()}`,
      name,
      position: relativePosition,
      layerId: selectedLayer.id,
      type,
      variables,
      outputInterval,
      color,
    };

    onSave(monitorData);
    onClose();
  };

  const toggleVariable = (key: keyof MonitorVariables) => {
    setVariables((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSelectedPreset('custom');
  };

  const presetOptions = [
    { value: 'custom', label: 'Custom' },
    ...presets.map((preset) => ({
      value: preset.id,
      label: preset.name,
      description: preset.description,
    })),
  ];

  const typeOptions = [
    { value: 'point', label: 'Point Monitor', description: 'Single point measurement' },
    { value: 'average', label: 'Average Monitor', description: 'Average over a region' },
    { value: 'profile', label: 'Profile Monitor', description: 'Full assembly profile' },
  ];

  const intervalOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const selectedVariableCount = Object.values(variables).filter(Boolean).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={monitor ? 'Edit Monitor' : 'Add Monitor'}
      size="lg"
    >
      <div className="space-y-md">
        {/* Preset Selection */}
        <Select
          label="Preset"
          value={selectedPreset}
          onChange={handlePresetChange}
          options={presetOptions}
        />

        {/* Monitor Name */}
        <Input
          label="Monitor Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSelectedPreset('custom');
          }}
          placeholder="e.g., Mid-layer Temperature"
        />

        {/* Monitor Type */}
        <Select
          label="Monitor Type"
          value={type}
          onChange={(val) => {
            setType(val as MonitorType);
            setSelectedPreset('custom');
          }}
          options={typeOptions}
        />

        {/* Position */}
        <div>
          <NumberInput
            label="Position from Exterior Surface"
            value={positionMm}
            onChange={(val) => {
              if (val !== null) {
                setPositionMm(val);
                setSelectedPreset('custom');
              }
            }}
            unit="mm"
            min={0}
            max={totalThickness * 1000}
            step={1}
            helperText={`Total assembly thickness: ${(totalThickness * 1000).toFixed(1)} mm`}
          />

          {/* Visual indicator of position */}
          <div className="mt-sm border border-greylight rounded p-sm bg-greylight/5">
            <div className="text-xs text-greydark mb-1">Monitor Position</div>
            <div className="relative h-8 bg-white border border-greylight rounded">
              {/* Layer boundaries */}
              {layers.map((layer, index) => {
                const startMm = layers.slice(0, index).reduce((sum, l) => sum + l.thickness * 1000, 0);
                const layerWidthPercent = (layer.thickness * 1000) / (totalThickness * 1000) * 100;
                return (
                  <div
                    key={layer.id}
                    className="absolute top-0 bottom-0 border-r border-greylight"
                    style={{
                      left: `${(startMm / (totalThickness * 1000)) * 100}%`,
                      width: `${layerWidthPercent}%`
                    }}
                  />
                );
              })}
              {/* Monitor position indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange z-10"
                style={{ left: `${(positionMm / (totalThickness * 1000)) * 100}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange rounded-full border-2 border-white" />
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-greydark px-1">
                Ext
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-greydark px-1">
                Int
              </div>
            </div>
          </div>
        </div>

        {/* Variables */}
        <Collapsible
          title="Output Variables"
          defaultExpanded={true}
          summary={`${selectedVariableCount} variable${selectedVariableCount !== 1 ? 's' : ''} selected`}
        >
          <div className="space-y-sm">
            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                checked={variables.temperature}
                onChange={() => toggleVariable('temperature')}
                className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">Temperature</div>
                <div className="text-xs text-greydark">Dry-bulb temperature [°C]</div>
              </div>
            </label>

            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                checked={variables.relativeHumidity}
                onChange={() => toggleVariable('relativeHumidity')}
                className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">Relative Humidity</div>
                <div className="text-xs text-greydark">RH [%]</div>
              </div>
            </label>

            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                checked={variables.waterContent}
                onChange={() => toggleVariable('waterContent')}
                className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">Water Content</div>
                <div className="text-xs text-greydark">Volumetric water content [kg/m³]</div>
              </div>
            </label>

            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                checked={variables.heatFlux}
                onChange={() => toggleVariable('heatFlux')}
                className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">Heat Flux</div>
                <div className="text-xs text-greydark">Heat flow density [W/m²]</div>
              </div>
            </label>

            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                checked={variables.vaporFlux}
                onChange={() => toggleVariable('vaporFlux')}
                className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">Vapor Flux</div>
                <div className="text-xs text-greydark">Water vapor flux [kg/(m²·s)]</div>
              </div>
            </label>

            <label className="flex items-center gap-sm">
              <input
                type="checkbox"
                checked={variables.liquidFlux}
                onChange={() => toggleVariable('liquidFlux')}
                className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-2 focus:ring-bluegreen focus:ring-offset-2"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">Liquid Flux</div>
                <div className="text-xs text-greydark">Liquid water flux [kg/(m²·s)]</div>
              </div>
            </label>
          </div>
        </Collapsible>

        {/* Output Interval */}
        <Select
          label="Output Interval"
          value={outputInterval}
          onChange={(val) => {
            setOutputInterval(val as 'hourly' | 'daily' | 'monthly');
            setSelectedPreset('custom');
          }}
          options={intervalOptions}
        />

        {/* Validation Warning */}
        {selectedVariableCount === 0 && (
          <div className="border border-orange rounded p-md bg-orange/10 flex items-start gap-sm">
            <AlertCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">No variables selected</div>
              <div className="text-greydark mt-1">
                Please select at least one output variable to monitor.
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
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={selectedVariableCount === 0 || !name.trim()}
          icon={Check}
        >
          {monitor ? 'Save Changes' : 'Add Monitor'}
        </Button>
      </div>
    </Modal>
  );
}
