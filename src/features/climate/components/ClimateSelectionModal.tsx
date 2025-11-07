import { useState, useMemo } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Check, X } from 'lucide-react';
import { ClimateData, ClimateType, ClimateApplication, SineCurveData, StandardClimateData, EPWData, WACData } from '../types';
import { ClimateTypeSelector } from './ClimateTypeSelector';
import { ClimateStatisticsPanel } from './ClimateStatisticsPanel';
import { SineCurveView } from './views/SineCurveView';
import { StandardConditionsView } from './views/StandardConditionsView';
import { cn } from '../../../lib/utils';

interface ClimateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (climate: ClimateData) => void;
  initialApplication?: ClimateApplication;
  presets?: any[]; // For backward compatibility with old modal interface
}

type ModalView = 'selection' | 'viewer';

export function ClimateSelectionModal({
  isOpen,
  onClose,
  onSelect,
  initialApplication = 'outdoor',
}: ClimateSelectionModalProps) {
  // Modal state
  const [view, setView] = useState<ModalView>('selection');
  const [climateType, setClimateType] = useState<ClimateType>('sine-curve');
  const [application, setApplication] = useState<ClimateApplication>(initialApplication);

  // Data for each climate type
  const [sineCurveData, setSineCurveData] = useState<SineCurveData>({
    temperature: {
      mean: 10,
      amplitude: 10,
      phaseShift: 0,
    },
    humidity: {
      mean: 70,
      amplitude: 15,
      phaseShift: 0,
    },
    inverseCorrelation: false,
  });

  const [standardData, setStandardData] = useState<StandardClimateData>({
    standard: 'ASHRAE-160',
    parameters: {
      climateZone: 4,
      moistureLoad: 'medium',
      temperatureLevel: 'normal',
    },
  });

  const [heatTransferResistance, setHeatTransferResistance] = useState(0.0588);
  const [rainCoefficient, setRainCoefficient] = useState(0.7);

  const [uploadedFile, setUploadedFile] = useState<EPWData | WACData | null>(null);

  // Determine if we can apply the current selection
  const canApply = useMemo(() => {
    switch (climateType) {
      case 'sine-curve':
        return true; // Always valid
      case 'standard':
        return true; // Always valid once standard selected
      case 'weather-station':
        return false; // TODO: implement
      case 'upload':
        return uploadedFile !== null;
      default:
        return false;
    }
  }, [climateType, uploadedFile]);

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

      // TODO: Implement other climate types
      default:
        return;
    }

    onSelect(climateData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={view === 'selection' ? 'Select Climate Data' : 'Climate Data Viewer'}
      size="2xl"
    >
      {view === 'selection' ? (
        /* Selection View - Three Column Layout */
        <div className="flex h-[calc(85vh-120px)]">
          {/* Left Column: Climate Type Selector */}
          <ClimateTypeSelector
            selectedType={climateType}
            onSelectType={setClimateType}
            application={application}
            onApplicationChange={setApplication}
          />

          {/* Center Column: Input Area */}
          <div className="flex-1 p-lg overflow-y-auto bg-greylight/5">
            {climateType === 'sine-curve' && (
              <SineCurveView value={sineCurveData} onChange={setSineCurveData} />
            )}

            {climateType === 'weather-station' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-greydark">
                  <p className="text-sm">Weather Station view coming soon</p>
                  <p className="text-xs mt-sm">Will include map and location search</p>
                </div>
              </div>
            )}

            {climateType === 'standard' && (
              <StandardConditionsView value={standardData} onChange={setStandardData} />
            )}

            {climateType === 'upload' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-greydark">
                  <p className="text-sm">Upload File view coming soon</p>
                  <p className="text-xs mt-sm">EPW and WAC file support</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Statistics Panel */}
          <ClimateStatisticsPanel
            climateType={climateType}
            application={application}
            sineCurveData={climateType === 'sine-curve' ? sineCurveData : undefined}
            heatTransferResistance={heatTransferResistance}
            rainCoefficient={rainCoefficient}
            onHeatTransferResistanceChange={setHeatTransferResistance}
            onRainCoefficientChange={setRainCoefficient}
          />
        </div>
      ) : (
        /* Viewer View - Full Width Climate Data Visualization */
        <div className="h-[calc(85vh-120px)]">
          <div className="flex items-center justify-center h-full text-greydark">
            <div className="text-center">
              <p className="text-sm">Climate Data Viewer coming soon</p>
              <p className="text-xs mt-sm">Full-screen visualization for uploaded files</p>
              <Button
                variant="secondary"
                onClick={() => setView('selection')}
                className="mt-md"
              >
                ← Back to Selection
              </Button>
            </div>
          </div>
        </div>
      )}

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
  );
}
