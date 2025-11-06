import { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { NumberInput } from '../../../components/ui/NumberInput';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Collapsible } from '../../../components/ui/Collapsible';
import { Check, AlertCircle } from 'lucide-react';
import { Monitor, MonitorType, MonitorVariables, MonitorPreset } from '../types';
import { Layer } from '../../../store/types';

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
  const [position, setPosition] = useState(monitor?.position || 0);
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

  // Reset when monitor changes
  useEffect(() => {
    if (monitor) {
      setName(monitor.name);
      setPosition(monitor.position);
      setType(monitor.type);
      setVariables(monitor.variables);
      setOutputInterval(monitor.outputInterval);
    }
  }, [monitor]);

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
    // Generate random color for new monitors
    const colors = ['#E18E2A', '#4AB79F', '#C04343', '#7B68A6', '#F7C741'];
    const color = monitor?.color || colors[Math.floor(Math.random() * colors.length)];

    const monitorData: Monitor = {
      id: monitor?.id || `monitor-${Date.now()}`,
      name,
      position,
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
            value={position}
            onChange={(val) => {
              setPosition(val);
              setSelectedPreset('custom');
            }}
            unit="mm"
            min={0}
            max={totalThickness}
            step={1}
            helperText={`Total assembly thickness: ${totalThickness.toFixed(1)} mm`}
          />

          {/* Visual indicator of position */}
          <div className="mt-sm border border-greylight rounded p-sm bg-greylight/5">
            <div className="text-xs text-greydark mb-1">Monitor Position</div>
            <div className="relative h-8 bg-white border border-greylight rounded">
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange"
                style={{ left: `${(position / totalThickness) * 100}%` }}
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
