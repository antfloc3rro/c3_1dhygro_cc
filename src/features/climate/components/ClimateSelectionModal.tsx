import { useState, useMemo } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Search, MapPin, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { ClimateData, ClimatePreset, LocationSearchResult, EPWData } from '../types';
import { cn } from '../../../lib/utils';
import { useAppStore } from '../../../store/index';

interface ClimateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (climate: ClimateData) => void;
  presets: ClimatePreset[];
}

export function ClimateSelectionModal({
  isOpen,
  onClose,
  onSelect,
  presets,
}: ClimateSelectionModalProps) {
  // Use store for persistent modal state
  const modalPrefs = useAppStore((state) => state.ui.modalPreferences.climateSelection);
  const setModalPrefs = useAppStore((state) => state.actions.setClimateSelectionPreferences);

  const activeTab = modalPrefs.activeTab;
  const searchQuery = modalPrefs.searchQuery;

  const setActiveTab = (tab: string) => setModalPrefs({ activeTab: tab });
  const setSearchQuery = (query: string) => setModalPrefs({ searchQuery: query });

  // Local state for current selection (not persisted)
  const [selectedPreset, setSelectedPreset] = useState<ClimatePreset | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [epwData, setEPWData] = useState<EPWData | null>(null);

  // Filter presets by search query
  const filteredPresets = useMemo(() => {
    if (!searchQuery) return presets;
    const query = searchQuery.toLowerCase();
    return presets.filter(
      (preset) =>
        preset.name.toLowerCase().includes(query) ||
        preset.region.toLowerCase().includes(query) ||
        preset.description.toLowerCase().includes(query)
    );
  }, [searchQuery, presets]);

  const handleSelect = () => {
    if (activeTab === 'presets' && selectedPreset) {
      onSelect(selectedPreset.climate);
      onClose();
    } else if (activeTab === 'location' && selectedLocation) {
      // Create climate data from location
      const climateData: ClimateData = {
        id: selectedLocation.id,
        name: `${selectedLocation.city}, ${selectedLocation.country}`,
        location: {
          city: selectedLocation.city,
          country: selectedLocation.country,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          elevation: selectedLocation.elevation,
          timezone: 'UTC',
        },
        type: 'location',
        source: 'Weather Station',
        variables: {
          temperature: true,
          relativeHumidity: true,
          precipitation: true,
          solarRadiation: true,
          windSpeed: true,
          windDirection: true,
          pressure: true,
        },
      };
      onSelect(climateData);
      onClose();
    } else if (activeTab === 'upload' && epwData) {
      // Create climate data from EPW
      const climateData: ClimateData = {
        id: `epw-${Date.now()}`,
        name: `${epwData.location.city}, ${epwData.location.country}`,
        location: {
          city: epwData.location.city,
          country: epwData.location.country,
          latitude: epwData.location.latitude,
          longitude: epwData.location.longitude,
          elevation: epwData.location.elevation,
          timezone: `UTC${epwData.location.timezone >= 0 ? '+' : ''}${epwData.location.timezone}`,
        },
        type: 'uploaded',
        source: 'EPW File',
        variables: {
          temperature: true,
          relativeHumidity: true,
          precipitation: true,
          solarRadiation: true,
          windSpeed: true,
          windDirection: true,
          pressure: true,
        },
      };
      onSelect(climateData);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.epw')) {
      setUploadedFile(file);
      // Parse EPW file (simplified - in production this would be more robust)
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const lines = content.split('\n');

        // Parse location header (first line)
        const locationLine = lines[0].split(',');
        const mockEPWData: EPWData = {
          location: {
            city: locationLine[1]?.trim() || 'Unknown',
            stateProvince: locationLine[2]?.trim() || '',
            country: locationLine[3]?.trim() || 'Unknown',
            latitude: parseFloat(locationLine[6]) || 0,
            longitude: parseFloat(locationLine[7]) || 0,
            timezone: parseFloat(locationLine[8]) || 0,
            elevation: parseFloat(locationLine[9]) || 0,
          },
          dataRecords: [], // Simplified - would parse all 8760 hours
        };
        setEPWData(mockEPWData);
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'presets', label: 'Presets' },
    { id: 'location', label: 'Location Search' },
    { id: 'upload', label: 'Upload EPW' },
    { id: 'editor', label: 'EPW Editor' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Climate Data" size="xl">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-md space-y-md">
        {/* Presets Tab */}
        {activeTab === 'presets' && (
          <div className="space-y-md">
            <Input
              placeholder="Search presets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={Search}
            />

            <div className="border border-greylight rounded max-h-[400px] overflow-auto">
              {filteredPresets.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-greydark text-sm">
                  No presets found
                </div>
              ) : (
                <div className="divide-y divide-greylight">
                  {filteredPresets.map((preset) => {
                    const isSelected = selectedPreset?.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset)}
                        className={cn(
                          'w-full px-md py-sm text-left transition-colors duration-200',
                          'hover:bg-greylight/10',
                          isSelected && 'bg-bluegreen/10 border-l-4 border-bluegreen'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-sm text-greydark mt-1">
                              {preset.description}
                            </div>
                            <div className="flex gap-xs mt-sm">
                              <Badge variant="default">{preset.region}</Badge>
                              <Badge variant="default">
                                {preset.climate.dataQuality || 'Standard'}
                              </Badge>
                            </div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-bluegreen flex-shrink-0 ml-sm" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Search Tab */}
        {activeTab === 'location' && (
          <div className="space-y-md">
            <div className="grid grid-cols-2 gap-md">
              <Input
                label="City or Location"
                placeholder="e.g., Munich, Germany"
                leftIcon={MapPin}
              />
              <Button variant="primary" icon={Search}>
                Search
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-md">
              <Input
                label="Latitude"
                type="number"
                placeholder="48.1351"
                step="0.0001"
              />
              <Input
                label="Longitude"
                type="number"
                placeholder="11.5820"
                step="0.0001"
              />
              <Input
                label="Elevation (m)"
                type="number"
                placeholder="519"
              />
            </div>

            <div className="border border-greylight rounded p-md bg-greylight/5">
              <div className="flex items-center gap-sm text-sm text-greydark">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Search for a location to view available weather datasets. Climate data will be
                  fetched from the nearest weather station.
                </span>
              </div>
            </div>

            {/* Mock location results */}
            <div className="border border-greylight rounded max-h-[300px] overflow-auto">
              <div className="flex items-center justify-center h-32 text-greydark text-sm">
                Enter a location to search
              </div>
            </div>
          </div>
        )}

        {/* Upload EPW Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-md">
            <div className="border-2 border-dashed border-greylight rounded-lg p-xl text-center">
              <Upload className="w-12 h-12 text-greydark mx-auto mb-md" />
              <p className="text-sm text-greydark mb-md">
                Drag and drop an EPW file here, or click to browse
              </p>
              <input
                type="file"
                accept=".epw"
                onChange={handleFileUpload}
                className="hidden"
                id="epw-upload"
              />
              <label htmlFor="epw-upload">
                <Button variant="secondary" icon={Upload} as="span">
                  Choose File
                </Button>
              </label>
            </div>

            {uploadedFile && (
              <div className="border border-greylight rounded p-md bg-greylight/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    <FileText className="w-5 h-5 text-bluegreen" />
                    <div>
                      <div className="font-medium text-sm">{uploadedFile.name}</div>
                      <div className="text-xs text-greydark">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-green" />
                </div>
              </div>
            )}

            {epwData && (
              <div className="border border-greylight rounded p-md">
                <h4 className="font-medium mb-sm">EPW File Information</h4>
                <div className="grid grid-cols-2 gap-sm text-sm">
                  <div>
                    <span className="text-greydark">Location:</span>
                    <span className="ml-2 font-medium">
                      {epwData.location.city}, {epwData.location.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-greydark">Latitude:</span>
                    <span className="ml-2 font-medium">
                      {epwData.location.latitude.toFixed(4)}°
                    </span>
                  </div>
                  <div>
                    <span className="text-greydark">Longitude:</span>
                    <span className="ml-2 font-medium">
                      {epwData.location.longitude.toFixed(4)}°
                    </span>
                  </div>
                  <div>
                    <span className="text-greydark">Elevation:</span>
                    <span className="ml-2 font-medium">{epwData.location.elevation} m</span>
                  </div>
                  <div>
                    <span className="text-greydark">Timezone:</span>
                    <span className="ml-2 font-medium">
                      UTC{epwData.location.timezone >= 0 ? '+' : ''}
                      {epwData.location.timezone}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EPW Editor Tab */}
        {activeTab === 'editor' && (
          <div className="space-y-md">
            <div className="border border-greylight rounded p-md bg-greylight/5">
              <div className="flex items-center gap-sm text-sm text-greydark">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Upload an EPW file first to view and edit climate data. The editor allows you to
                  modify individual hourly values and validate data quality.
                </span>
              </div>
            </div>

            {epwData ? (
              <div className="border border-greylight rounded">
                <div className="px-md py-sm border-b border-greylight bg-greylight/5 font-medium text-sm">
                  Climate Data Editor
                </div>
                <div className="p-md">
                  <p className="text-sm text-greydark">
                    EPW data editor will be implemented here. This would include a table view of all
                    8760 hourly records with inline editing capabilities, data validation, and
                    visualization of climate variables.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-greydark text-sm border border-greylight rounded">
                No EPW file loaded. Switch to the Upload tab to load a file.
              </div>
            )}
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
          onClick={handleSelect}
          disabled={
            (activeTab === 'presets' && !selectedPreset) ||
            (activeTab === 'location' && !selectedLocation) ||
            (activeTab === 'upload' && !epwData) ||
            activeTab === 'editor'
          }
          icon={Check}
        >
          Select Climate
        </Button>
      </div>
    </Modal>
  );
}
