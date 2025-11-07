import { useState, useMemo, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Check, X } from 'lucide-react';
import { ClimateData, ClimateType, ClimateApplication, SineCurveData, StandardClimateData, EPWData, WACData, LocationSearchResult } from '../types';
import { ClimateTypeSelector } from './ClimateTypeSelector';
import { ClimateStatisticsPanel } from './ClimateStatisticsPanel';
import { SineCurveView } from './views/SineCurveView';
import { StandardConditionsView } from './views/StandardConditionsView';
import { WeatherStationView } from './views/WeatherStationView';
import { UploadFileView } from './views/UploadFileView';
import { ClimateDataViewer } from './ClimateDataViewer';
import { cn } from '../../../lib/utils';

interface ClimateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (climate: ClimateData) => void;
  initialApplication?: ClimateApplication;
  initialClimateType?: ClimateType;
  presets?: any[]; // For backward compatibility with old modal interface
}

type ModalView = 'selection' | 'viewer';

export function ClimateSelectionModal({
  isOpen,
  onClose,
  onSelect,
  initialApplication = 'outdoor',
  initialClimateType = 'weather-station',
}: ClimateSelectionModalProps) {
  // Modal state
  const [view, setView] = useState<ModalView>('selection');
  const [climateType, setClimateType] = useState<ClimateType>(initialClimateType);
  const [application, setApplication] = useState<ClimateApplication>(initialApplication);

  // Data for each climate type
  const [sineCurveData, setSineCurveData] = useState<SineCurveData>({
    curveSelection: 'Indoor Condition, Medium Moisture Load',
    temperature: {
      mean: 21,
      amplitude: 1,
      dayOfMaximum: 'Jun/03',
    },
    humidity: {
      mean: 50,
      amplitude: 10,
      dayOfMaximum: 'Aug/16',
    },
  });

  const [standardData, setStandardData] = useState<StandardClimateData>({
    standard: 'EN-15026',
    parameters: {
      moistureLoad: 'medium',
    },
  });

  const [heatTransferResistance, setHeatTransferResistance] = useState(0.0588);
  const [rainCoefficient, setRainCoefficient] = useState(0.7);

  const [uploadedFile, setUploadedFile] = useState<EPWData | WACData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const [viewerData, setViewerData] = useState<EPWData | WACData | null>(null);

  // Reset state when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      setApplication(initialApplication);
      setClimateType(initialClimateType);
      setView('selection');
      // Reset selections when switching contexts
      setSelectedLocation(null);
      setViewerData(null);
    }
  }, [isOpen, initialApplication, initialClimateType]);

  // Determine if we can apply the current selection
  const canApply = useMemo(() => {
    switch (climateType) {
      case 'sine-curve':
        return true; // Always valid
      case 'standard':
        return true; // Always valid once standard selected
      case 'weather-station':
        return selectedLocation !== null;
      case 'upload':
        return uploadedFile !== null;
      default:
        return false;
    }
  }, [climateType, uploadedFile, selectedLocation]);

  const handleApply = () => {
    // Create ClimateData based on selected type
    let climateData: ClimateData;

    switch (climateType) {
      case 'sine-curve':
        climateData = {
          id: `sine-${Date.now()}`,
          name: `Sine Curve Climate (${sineCurveData.temperature.mean}°C ± ${sineCurveData.temperature.amplitude}°C)`,
          type: 'sine-curve',
          source: 'Sine Curve Generator',
          sineCurve: sineCurveData,
          variables: {
            temperature: true,
            relativeHumidity: true,
            precipitation: false,
            solarRadiation: false,
            windSpeed: false,
            windDirection: false,
            pressure: false,
          },
          surfaceParameters: application === 'outdoor' ? {
            heatTransferResistance,
            rainCoefficient,
          } : undefined,
        };
        break;

      case 'standard':
        climateData = {
          id: `standard-${Date.now()}`,
          name: `${standardData.standard} Climate`,
          type: 'standard',
          source: standardData.standard,
          standard: standardData,
          variables: {
            temperature: true,
            relativeHumidity: true,
            precipitation: false,
            solarRadiation: false,
            windSpeed: false,
            windDirection: false,
            pressure: false,
          },
          surfaceParameters: application === 'outdoor' ? {
            heatTransferResistance,
            rainCoefficient,
          } : undefined,
        };
        break;

      case 'weather-station':
        if (!selectedLocation) return;
        climateData = {
          id: `location-${Date.now()}`,
          name: `${selectedLocation.city}, ${selectedLocation.country}`,
          type: 'location',
          source: selectedLocation.availableDatasets[0]?.source || 'Weather Station',
          location: {
            city: selectedLocation.city,
            country: selectedLocation.country,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            elevation: selectedLocation.elevation,
            timezone: 'UTC',
          },
          variables: {
            temperature: true,
            relativeHumidity: true,
            precipitation: true,
            solarRadiation: true,
            windSpeed: true,
            windDirection: true,
            pressure: true,
          },
          surfaceParameters: application === 'outdoor' ? {
            heatTransferResistance,
            rainCoefficient,
          } : undefined,
        };
        break;

      case 'upload':
        if (!uploadedFile) return;
        climateData = {
          id: `upload-${Date.now()}`,
          name: uploadedFile.fileName,
          type: 'upload',
          source: 'User Upload',
          uploadedData: uploadedFile,
          variables: {
            temperature: true,
            relativeHumidity: true,
            precipitation: true,
            solarRadiation: true,
            windSpeed: true,
            windDirection: true,
            pressure: false,
          },
          surfaceParameters: application === 'outdoor' ? {
            heatTransferResistance,
            rainCoefficient,
          } : undefined,
        };
        break;

      default:
        return;
    }

    onSelect(climateData);
    onClose();
  };

  // Determine if right panel should be shown
  const showRightPanel = climateType === 'weather-station' || climateType === 'upload';

  return (
    <>
      {/* Climate Data Viewer - Full Screen Overlay */}
      {viewerData && (
        <ClimateDataViewer
          isOpen={!!viewerData}
          onClose={() => setViewerData(null)}
          data={viewerData}
        />
      )}
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={view === 'selection' ? 'Select Climate Data' : 'Climate Data Viewer'}
      size="full"
    >
      {view === 'selection' ? (
        /* Selection View - Three Column Layout (or Two Column if no right panel) */
        <div className="flex h-[calc(85vh-120px)]">
          {/* Left Column: Climate Type Selector */}
          <ClimateTypeSelector
            selectedType={climateType}
            onSelectType={setClimateType}
            application={application}
            onApplicationChange={setApplication}
          />

          {/* Center Column: Input Area */}
          <div className={cn(
            "flex-1",
            climateType === 'weather-station' ? '' : 'p-lg overflow-y-auto bg-greylight/5'
          )}>
            {climateType === 'sine-curve' && (
              <SineCurveView value={sineCurveData} onChange={setSineCurveData} />
            )}

            {climateType === 'weather-station' && (
              <WeatherStationView onSelect={setSelectedLocation} />
            )}

            {climateType === 'standard' && (
              <StandardConditionsView value={standardData} onChange={setStandardData} />
            )}

            {climateType === 'upload' && (
              <UploadFileView
                onFileUpload={setUploadedFile}
                onViewData={setViewerData}
              />
            )}
          </div>

          {/* Right Column: Statistics Panel - Only show for weather-station and upload */}
          {showRightPanel && (
            <ClimateStatisticsPanel
              climateType={climateType}
              application={application}
              statistics={uploadedFile?.statistics}
              sineCurveData={climateType === 'sine-curve' ? sineCurveData : undefined}
              selectedLocation={selectedLocation}
              uploadedFileName={uploadedFile?.fileName}
              heatTransferResistance={heatTransferResistance}
              rainCoefficient={rainCoefficient}
              onHeatTransferResistanceChange={setHeatTransferResistance}
              onRainCoefficientChange={setRainCoefficient}
            />
          )}
        </div>
      ) : null}

      {/* Footer */}
      <div className="flex justify-between items-center pt-lg border-t border-greylight mt-lg">
        <div className="text-sm text-greydark">
          {view === 'selection' && (
            <>
              {climateType === 'sine-curve' && 'Custom sine wave climate pattern'}
              {climateType === 'weather-station' && 'Select location to continue'}
              {climateType === 'standard' && `${standardData.standard} - ${application} conditions`}
              {climateType === 'upload' && 'Upload file to continue'}
            </>
          )}
        </div>
        <div className="flex gap-sm">
          <Button variant="secondary" onClick={onClose} icon={X}>
            Cancel
          </Button>
          {view === 'selection' && (
            <Button
              variant="primary"
              onClick={handleApply}
              disabled={!canApply}
              icon={Check}
            >
              Apply Climate
            </Button>
          )}
        </div>
      </div>
    </Modal>
    </>
  );
}
