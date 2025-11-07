import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { ClimateType, ClimateApplication, AnnualStatistics, SineCurveData, LocationSearchResult } from '../types';
import { MapPin, Database } from 'lucide-react';

interface ClimateStatisticsPanelProps {
  climateType: ClimateType;
  application: ClimateApplication;
  statistics?: AnnualStatistics;
  sineCurveData?: SineCurveData;
  selectedLocation?: LocationSearchResult | null;
  uploadedFileName?: string;
  heatTransferResistance?: number;
  rainCoefficient?: number;
  onHeatTransferResistanceChange?: (value: number) => void;
  onRainCoefficientChange?: (value: number) => void;
}

export function ClimateStatisticsPanel({
  climateType,
  application,
  statistics,
  sineCurveData,
  selectedLocation,
  uploadedFileName,
  heatTransferResistance = 0.0588,
  rainCoefficient = 0.7,
  onHeatTransferResistanceChange,
  onRainCoefficientChange,
}: ClimateStatisticsPanelProps) {
  const [localHTR, setLocalHTR] = useState(heatTransferResistance);
  const [localRC, setLocalRC] = useState(rainCoefficient);

  // Calculate statistics from sine curve if provided
  const calculatedStats: AnnualStatistics | undefined = sineCurveData ? {
    temperature: {
      mean: sineCurveData.temperature.mean,
      max: sineCurveData.temperature.mean + sineCurveData.temperature.amplitude,
      min: sineCurveData.temperature.mean - sineCurveData.temperature.amplitude,
    },
    humidity: {
      mean: sineCurveData.humidity.mean,
      max: Math.min(100, sineCurveData.humidity.mean + sineCurveData.humidity.amplitude),
      min: Math.max(0, sineCurveData.humidity.mean - sineCurveData.humidity.amplitude),
    },
  } : statistics;

  const handleHTRChange = (value: number) => {
    setLocalHTR(value);
    onHeatTransferResistanceChange?.(value);
  };

  const handleRCChange = (value: number) => {
    setLocalRC(value);
    onRainCoefficientChange?.(value);
  };

  return (
    <div className="w-[320px] border-l border-greylight bg-white p-md space-y-lg overflow-y-auto">
      {/* Weather Station Info */}
      {climateType === 'weather-station' && selectedLocation && (
        <div className="space-y-md">
          <h3 className="text-xs font-semibold uppercase text-greydark">Selected Location</h3>

          <div className="bg-bluegreen/10 border border-bluegreen/30 rounded-lg p-md space-y-sm">
            <div className="flex items-start gap-sm">
              <MapPin className="w-4 h-4 text-bluegreen flex-shrink-0 mt-xs" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{selectedLocation.city}</div>
                <div className="text-xs text-greydark">{selectedLocation.country}</div>
              </div>
            </div>

            <div className="text-xs space-y-xs">
              <div className="grid grid-cols-2 gap-xs">
                <div>
                  <span className="text-greydark">Latitude:</span>
                  <span className="ml-xs font-mono">{selectedLocation.latitude.toFixed(2)}°</span>
                </div>
                <div>
                  <span className="text-greydark">Longitude:</span>
                  <span className="ml-xs font-mono">{selectedLocation.longitude.toFixed(2)}°</span>
                </div>
              </div>
              <div>
                <span className="text-greydark">Elevation:</span>
                <span className="ml-xs font-mono">{selectedLocation.elevation} m</span>
              </div>
            </div>

            {selectedLocation.availableDatasets && selectedLocation.availableDatasets.length > 0 && (
              <div className="pt-sm border-t border-bluegreen/20">
                <div className="flex items-center gap-xs mb-xs">
                  <Database className="w-3 h-3 text-bluegreen" />
                  <span className="text-xs font-medium text-greydark">Available Dataset</span>
                </div>
                <div className="text-xs">
                  <div className="font-medium">{selectedLocation.availableDatasets[0].source}</div>
                  <div className="text-greydark">{selectedLocation.availableDatasets[0].period}</div>
                </div>
              </div>
            )}
          </div>

          {selectedLocation.comment && (
            <div className="text-xs text-greydark italic bg-greylight/10 p-sm rounded">
              {selectedLocation.comment}
            </div>
          )}
        </div>
      )}

      {/* Upload File Info */}
      {climateType === 'upload' && uploadedFileName && (
        <div className="space-y-md">
          <h3 className="text-xs font-semibold uppercase text-greydark">Uploaded File</h3>

          <div className="bg-green/10 border border-green/30 rounded-lg p-md">
            <div className="text-xs">
              <div className="font-medium text-sm mb-xs truncate">{uploadedFileName}</div>
              <div className="text-greydark">Climate data successfully loaded</div>
            </div>
          </div>
        </div>
      )}

      {/* Annual Statistics */}
      {calculatedStats && (
        <div className="space-y-md">
          <h3 className="text-xs font-semibold uppercase text-greydark">Annual Statistics</h3>

          <div className="space-y-sm">
            {/* Temperature Stats */}
            <div className="bg-greylight/10 p-sm rounded">
              <div className="text-xs font-medium text-greydark mb-xs">Temperature</div>
              <div className="grid grid-cols-3 gap-xs text-xs">
                <div>
                  <div className="text-greydark">Mean</div>
                  <div className="font-mono font-medium">{calculatedStats.temperature.mean.toFixed(1)}°C</div>
                </div>
                <div>
                  <div className="text-greydark">Max</div>
                  <div className="font-mono font-medium">{calculatedStats.temperature.max.toFixed(1)}°C</div>
                </div>
                <div>
                  <div className="text-greydark">Min</div>
                  <div className="font-mono font-medium">{calculatedStats.temperature.min.toFixed(1)}°C</div>
                </div>
              </div>
            </div>

            {/* Humidity Stats */}
            <div className="bg-greylight/10 p-sm rounded">
              <div className="text-xs font-medium text-greydark mb-xs">Relative Humidity</div>
              <div className="grid grid-cols-3 gap-xs text-xs">
                <div>
                  <div className="text-greydark">Mean</div>
                  <div className="font-mono font-medium">{calculatedStats.humidity.mean.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-greydark">Max</div>
                  <div className="font-mono font-medium">{calculatedStats.humidity.max.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-greydark">Min</div>
                  <div className="font-mono font-medium">{calculatedStats.humidity.min.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Radiation Stats (if available) */}
            {calculatedStats.radiation && (
              <div className="bg-greylight/10 p-sm rounded">
                <div className="text-xs font-medium text-greydark mb-xs">Solar Radiation</div>
                <div className="text-xs">
                  <div className="text-greydark">Annual</div>
                  <div className="font-mono font-medium">{calculatedStats.radiation.annual.toFixed(0)} kWh/m²</div>
                </div>
              </div>
            )}

            {/* Rain Stats (if available) */}
            {calculatedStats.rain && (
              <div className="bg-greylight/10 p-sm rounded">
                <div className="text-xs font-medium text-greydark mb-xs">Precipitation</div>
                <div className="text-xs">
                  <div className="text-greydark">Annual</div>
                  <div className="font-mono font-medium">{calculatedStats.rain.annual.toFixed(0)} mm</div>
                </div>
              </div>
            )}

            {/* Wind Stats (if available) */}
            {calculatedStats.wind && (
              <div className="bg-greylight/10 p-sm rounded">
                <div className="text-xs font-medium text-greydark mb-xs">Wind</div>
                <div className="text-xs">
                  <div className="text-greydark">Mean Speed</div>
                  <div className="font-mono font-medium">{calculatedStats.wind.meanSpeed.toFixed(1)} m/s</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Surface Parameters (Outdoor Only) */}
      {application === 'outdoor' && (
        <div className="space-y-md">
          <h3 className="text-xs font-semibold uppercase text-greydark">Surface Parameters</h3>

          <div className="space-y-sm">
            <div>
              <Label htmlFor="heat-resistance">
                Heat Transfer Resistance [(m²·K)/W]
              </Label>
              <Input
                id="heat-resistance"
                type="number"
                value={localHTR}
                onChange={(e) => handleHTRChange(parseFloat(e.target.value) || 0.0588)}
                step="0.001"
                min="0.01"
                max="0.5"
              />
              <p className="text-xs text-greydark mt-xs">
                Default: 0.0588 (exterior standard)
              </p>
            </div>

            <div>
              <Label htmlFor="rain-coefficient">
                Rain Coefficient [-]
              </Label>
              <Input
                id="rain-coefficient"
                type="number"
                value={localRC}
                onChange={(e) => handleRCChange(parseFloat(e.target.value) || 0.7)}
                step="0.1"
                min="0"
                max="1"
              />
              <div className="mt-xs">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localRC}
                  onChange={(e) => handleRCChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-greylight rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <p className="text-xs text-greydark mt-xs">
                0 = Sheltered, 0.7 = Normal, 1.0 = Very wet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Derived Parameters (Indoor) */}
      {application === 'indoor' && (
        <div className="space-y-md">
          <h3 className="text-xs font-semibold uppercase text-greydark">Derived Parameters</h3>

          <div className="bg-greylight/10 p-sm rounded text-xs space-y-sm">
            <div>
              <div className="text-greydark">Based on</div>
              <div className="font-medium">Exterior climate conditions</div>
            </div>
            <div>
              <div className="text-greydark">Method</div>
              <div className="font-medium">EN 15026 standard</div>
            </div>
            {calculatedStats && (
              <>
                <div>
                  <div className="text-greydark">Mean Interior Temp</div>
                  <div className="font-mono font-medium">{(calculatedStats.temperature.mean + 10).toFixed(1)}°C</div>
                </div>
                <div>
                  <div className="text-greydark">Mean Interior RH</div>
                  <div className="font-mono font-medium">{Math.min(70, calculatedStats.humidity.mean + 10).toFixed(1)}%</div>
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-greydark italic">
            Indoor conditions are automatically derived from outdoor climate using standard assumptions.
          </p>
        </div>
      )}

      {/* Empty State - Only show if nothing else is displayed */}
      {!calculatedStats && !selectedLocation && !uploadedFileName && (
        <div className="flex items-center justify-center h-48 text-center">
          <div className="text-sm text-greydark">
            {climateType === 'weather-station' && 'Select a location on the map'}
            {climateType === 'upload' && 'Upload a climate file to continue'}
          </div>
        </div>
      )}
    </div>
  );
}
