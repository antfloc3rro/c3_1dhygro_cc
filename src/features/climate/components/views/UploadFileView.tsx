import { useState, useCallback, useRef } from 'react';
import { Upload, File, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Button } from '../../../../components/ui/Button';
import { EPWData, WACData, AnnualStatistics } from '../../types';

interface UploadFileViewProps {
  onFileUpload?: (data: EPWData | WACData) => void;
  onViewData?: (data: EPWData | WACData) => void;
}

export function UploadFileView({ onFileUpload, onViewData }: UploadFileViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<(EPWData | WACData) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const parseEPWFile = async (file: File): Promise<EPWData> => {
    const text = await file.text();
    const lines = text.split('\n');

    // Parse header (first 8 lines)
    const locationLine = lines[0].split(',');
    const header = {
      location: locationLine[1]?.trim() || 'Unknown',
      latitude: parseFloat(locationLine[6]) || 0,
      longitude: parseFloat(locationLine[7]) || 0,
      timezone: parseFloat(locationLine[8]) || 0,
      altitude: parseFloat(locationLine[9]) || 0,
    };

    // Parse data (skip first 8 header lines)
    const data = [];
    let tempSum = 0, tempMin = Infinity, tempMax = -Infinity;
    let rhSum = 0, rhMin = Infinity, rhMax = -Infinity;
    let radiationSum = 0, rainSum = 0, windSum = 0;

    for (let i = 8; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',');
      if (values.length < 10) continue;

      const year = parseInt(values[0]);
      const month = parseInt(values[1]);
      const day = parseInt(values[2]);
      const hour = parseInt(values[3]);
      const temperature = parseFloat(values[6]) || 0;
      const humidity = parseFloat(values[8]) || 0;
      const radiation = parseFloat(values[13]) || 0;
      const rain = parseFloat(values[33]) || 0;
      const windSpeed = parseFloat(values[21]) || 0;
      const windDirection = parseFloat(values[20]) || 0;

      data.push({
        timestamp: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00`,
        temperature,
        humidity,
        radiation,
        rain,
        windSpeed,
        windDirection,
      });

      tempSum += temperature;
      tempMin = Math.min(tempMin, temperature);
      tempMax = Math.max(tempMax, temperature);
      rhSum += humidity;
      rhMin = Math.min(rhMin, humidity);
      rhMax = Math.max(rhMax, humidity);
      radiationSum += radiation;
      rainSum += rain;
      windSum += windSpeed;
    }

    const count = data.length;
    const statistics: AnnualStatistics = {
      temperature: {
        mean: tempSum / count,
        min: tempMin,
        max: tempMax,
      },
      humidity: {
        mean: rhSum / count,
        min: rhMin,
        max: rhMax,
      },
      radiation: {
        annual: radiationSum / 1000, // Convert to kWh/m²
      },
      rain: {
        annual: rainSum,
      },
      wind: {
        meanSpeed: windSum / count,
      },
    };

    return {
      fileName: file.name,
      fileSize: file.size,
      header,
      data,
      statistics,
    };
  };

  const parseWACFile = async (file: File): Promise<WACData> => {
    const text = await file.text();
    const lines = text.split('\n');

    // WAC format: Simple tab/space-delimited format
    // Header lines start with #
    let headerParsed = false;
    const header = {
      location: 'Unknown',
      latitude: 0,
      longitude: 0,
      altitude: 0,
      timezone: 0,
    };

    const data = [];
    let tempSum = 0, tempMin = Infinity, tempMax = -Infinity;
    let rhSum = 0, rhMin = Infinity, rhMax = -Infinity;
    let radiationSum = 0, rainSum = 0, windSum = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Parse header comments
      if (trimmed.startsWith('#')) {
        if (trimmed.includes('Location:')) {
          header.location = trimmed.split('Location:')[1]?.trim() || 'Unknown';
        } else if (trimmed.includes('Latitude:')) {
          header.latitude = parseFloat(trimmed.split('Latitude:')[1]) || 0;
        } else if (trimmed.includes('Longitude:')) {
          header.longitude = parseFloat(trimmed.split('Longitude:')[1]) || 0;
        } else if (trimmed.includes('Altitude:')) {
          header.altitude = parseFloat(trimmed.split('Altitude:')[1]) || 0;
        }
        continue;
      }

      // Parse data line
      const values = trimmed.split(/[\t\s]+/);
      if (values.length < 6) continue;

      const temperature = parseFloat(values[1]) || 0;
      const humidity = parseFloat(values[2]) || 0;
      const radiation = parseFloat(values[3]) || 0;
      const rain = parseFloat(values[4]) || 0;
      const windSpeed = parseFloat(values[5]) || 0;
      const windDirection = parseFloat(values[6]) || 0;

      data.push({
        timestamp: values[0],
        temperature,
        humidity,
        radiation,
        rain,
        windSpeed,
        windDirection,
      });

      tempSum += temperature;
      tempMin = Math.min(tempMin, temperature);
      tempMax = Math.max(tempMax, temperature);
      rhSum += humidity;
      rhMin = Math.min(rhMin, humidity);
      rhMax = Math.max(rhMax, humidity);
      radiationSum += radiation;
      rainSum += rain;
      windSum += windSpeed;
    }

    const count = data.length;
    const statistics: AnnualStatistics = {
      temperature: {
        mean: tempSum / count,
        min: tempMin,
        max: tempMax,
      },
      humidity: {
        mean: rhSum / count,
        min: rhMin,
        max: rhMax,
      },
      radiation: {
        annual: radiationSum / 1000,
      },
      rain: {
        annual: rainSum,
      },
      wind: {
        meanSpeed: windSum / count,
      },
    };

    return {
      fileName: file.name,
      fileSize: file.size,
      header,
      data,
      statistics,
    };
  };

  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension !== 'epw' && extension !== 'wac') {
        throw new Error('Invalid file format. Please upload an EPW or WAC file.');
      }

      let parsedData: EPWData | WACData;

      if (extension === 'epw') {
        parsedData = await parseEPWFile(file);
      } else {
        parsedData = await parseWACFile(file);
      }

      setUploadedFile(parsedData);
      onFileUpload?.(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-lg space-y-lg">
      {/* Upload Area */}
      {!uploadedFile && (
        <div
          className={cn(
            'w-full max-w-2xl border-2 border-dashed rounded-lg p-xl transition-colors',
            isDragging
              ? 'border-bluegreen bg-bluegreen/5'
              : 'border-greylight bg-white hover:border-greydark'
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center text-center space-y-md">
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
              isDragging ? 'bg-bluegreen' : 'bg-greylight'
            )}>
              <Upload className={cn(
                'w-8 h-8',
                isDragging ? 'text-white' : 'text-greydark'
              )} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-xs">
                {isDragging ? 'Drop file here' : 'Upload Climate File'}
              </h3>
              <p className="text-sm text-greydark">
                Drag and drop your EPW or WAC file here, or click to browse
              </p>
            </div>

            <Button
              onClick={handleBrowseClick}
              disabled={isProcessing}
              variant="secondary"
            >
              Browse Files
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".epw,.wac"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="text-xs text-greydark space-y-xs">
              <p>Supported formats: EPW (EnergyPlus Weather), WAC (WUFI ASCII Climate)</p>
              <p>Maximum file size: 50 MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="w-full max-w-2xl bg-bluegreen/10 border border-bluegreen rounded-lg p-lg">
          <div className="flex items-center gap-md">
            <div className="animate-spin w-6 h-6 border-2 border-bluegreen border-t-transparent rounded-full" />
            <div>
              <p className="font-medium">Processing file...</p>
              <p className="text-sm text-greydark">Parsing climate data and calculating statistics</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full max-w-2xl bg-red/10 border border-red rounded-lg p-lg">
          <div className="flex items-start gap-md">
            <AlertCircle className="w-6 h-6 text-red flex-shrink-0 mt-xs" />
            <div className="flex-1">
              <p className="font-medium text-red mb-xs">Upload Failed</p>
              <p className="text-sm text-greydark">{error}</p>
              <Button
                onClick={() => setError(null)}
                variant="secondary"
                className="mt-md"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {uploadedFile && !isProcessing && (
        <div className="w-full max-w-2xl space-y-md">
          <div className="bg-green/10 border border-green rounded-lg p-lg">
            <div className="flex items-start gap-md">
              <CheckCircle2 className="w-6 h-6 text-green flex-shrink-0 mt-xs" />
              <div className="flex-1">
                <p className="font-medium text-green mb-xs">File Uploaded Successfully</p>
                <p className="text-sm text-greydark">
                  Climate data has been parsed and is ready for analysis
                </p>
              </div>
            </div>
          </div>

          {/* File Info */}
          <div className="bg-white border border-greylight rounded-lg p-lg space-y-md">
            <div className="flex items-start gap-md">
              <File className="w-6 h-6 text-bluegreen flex-shrink-0 mt-xs" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-xs truncate">{uploadedFile.fileName}</h3>
                <div className="grid grid-cols-2 gap-md text-sm">
                  <div>
                    <span className="text-greydark">File Size:</span>
                    <span className="ml-xs font-medium">
                      {(uploadedFile.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div>
                    <span className="text-greydark">Data Points:</span>
                    <span className="ml-xs font-medium">{uploadedFile.data.length}</span>
                  </div>
                  <div>
                    <span className="text-greydark">Location:</span>
                    <span className="ml-xs font-medium">{uploadedFile.header.location}</span>
                  </div>
                  <div>
                    <span className="text-greydark">Coordinates:</span>
                    <span className="ml-xs font-medium">
                      {uploadedFile.header.latitude.toFixed(2)}°, {uploadedFile.header.longitude.toFixed(2)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Preview */}
            {uploadedFile.statistics && (
              <div className="border-t border-greylight pt-md">
                <h4 className="text-xs font-semibold uppercase text-greydark mb-sm">Quick Statistics</h4>
                <div className="grid grid-cols-2 gap-sm text-sm">
                  <div className="bg-greylight/10 p-sm rounded">
                    <div className="text-greydark text-xs">Mean Temperature</div>
                    <div className="font-mono font-medium">
                      {uploadedFile.statistics.temperature.mean.toFixed(1)}°C
                    </div>
                  </div>
                  <div className="bg-greylight/10 p-sm rounded">
                    <div className="text-greydark text-xs">Mean Humidity</div>
                    <div className="font-mono font-medium">
                      {uploadedFile.statistics.humidity.mean.toFixed(1)}%
                    </div>
                  </div>
                  {uploadedFile.statistics.radiation && (
                    <div className="bg-greylight/10 p-sm rounded">
                      <div className="text-greydark text-xs">Annual Radiation</div>
                      <div className="font-mono font-medium">
                        {uploadedFile.statistics.radiation.annual.toFixed(0)} kWh/m²
                      </div>
                    </div>
                  )}
                  {uploadedFile.statistics.rain && (
                    <div className="bg-greylight/10 p-sm rounded">
                      <div className="text-greydark text-xs">Annual Precipitation</div>
                      <div className="font-mono font-medium">
                        {uploadedFile.statistics.rain.annual.toFixed(0)} mm
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-md">
            <Button
              onClick={() => onViewData?.(uploadedFile)}
              variant="primary"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-xs" />
              Visualize Climate Data
            </Button>
            <Button
              onClick={() => {
                setUploadedFile(null);
                setError(null);
              }}
              variant="secondary"
            >
              Upload Different File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
