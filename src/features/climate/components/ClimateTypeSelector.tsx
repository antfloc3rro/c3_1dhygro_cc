import { MapPin, Settings, Activity, Upload } from 'lucide-react';
import { ClimateType, ClimateApplication } from '../types';
import { cn } from '../../../lib/utils';

interface ClimateTypeSelectorProps {
  selectedType: ClimateType;
  onSelectType: (type: ClimateType) => void;
  application: ClimateApplication;
  onApplicationChange: (app: ClimateApplication) => void;
}

const CLIMATE_TYPES = [
  {
    id: 'weather-station' as ClimateType,
    icon: MapPin,
    label: 'Weather Station',
    description: 'Select from global climate database',
  },
  {
    id: 'standard' as ClimateType,
    icon: Settings,
    label: 'Standard Conditions',
    description: 'ASHRAE 160, EN 15026, ISO 13788',
  },
  {
    id: 'sine-curve' as ClimateType,
    icon: Activity,
    label: 'Sine Curves',
    description: 'Custom sine wave patterns',
  },
  {
    id: 'upload' as ClimateType,
    icon: Upload,
    label: 'Upload File',
    description: 'EPW or WAC climate file',
  },
];

export function ClimateTypeSelector({
  selectedType,
  onSelectType,
  application,
  onApplicationChange,
}: ClimateTypeSelectorProps) {
  return (
    <div className="w-[300px] border-r border-greylight bg-white p-md space-y-md">
      {/* Application Toggle */}
      <div className="space-y-xs">
        <div className="text-xs font-medium text-greydark uppercase mb-sm">Application</div>
        <div className="grid grid-cols-2 gap-xs">
          <button
            onClick={() => onApplicationChange('outdoor')}
            className={cn(
              'px-md py-sm text-sm font-medium rounded transition-colors',
              application === 'outdoor'
                ? 'bg-bluegreen text-white'
                : 'bg-white text-text border border-greylight hover:bg-greylight/10'
            )}
          >
            Outdoor
          </button>
          <button
            onClick={() => onApplicationChange('indoor')}
            className={cn(
              'px-md py-sm text-sm font-medium rounded transition-colors',
              application === 'indoor'
                ? 'bg-bluegreen text-white'
                : 'bg-white text-text border border-greylight hover:bg-greylight/10'
            )}
          >
            Indoor
          </button>
        </div>
        <p className="text-xs text-greydark">
          Selecting {application} climate
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-greylight" />

      {/* Climate Type Selection */}
      <div className="space-y-xs">
        <div className="text-xs font-medium text-greydark uppercase mb-sm">Climate Type</div>
        <div className="space-y-xs">
          {CLIMATE_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => onSelectType(type.id)}
                className={cn(
                  'w-full text-left p-md rounded transition-colors border',
                  isSelected
                    ? 'bg-bluegreen/10 border-bluegreen'
                    : 'bg-white border-transparent hover:bg-greylight/5'
                )}
              >
                <div className="flex items-start gap-sm">
                  <div className={cn(
                    'flex items-center justify-center w-5 h-5 rounded-full mt-xs',
                    isSelected ? 'bg-bluegreen' : 'bg-greylight'
                  )}>
                    <div className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      isSelected ? 'bg-white scale-100' : 'bg-transparent scale-0'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-xs mb-xs">
                      <Icon className={cn(
                        'w-4 h-4 flex-shrink-0',
                        isSelected ? 'text-bluegreen' : 'text-greydark'
                      )} />
                      <span className={cn(
                        'text-sm font-medium',
                        isSelected ? 'text-text' : 'text-text'
                      )}>
                        {type.label}
                      </span>
                    </div>
                    <p className="text-xs text-greydark leading-tight">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
