import { useState } from 'react';
import { Select } from '../../../../components/ui/Select';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StandardClimateData } from '../../types';

interface StandardConditionsViewProps {
  value: StandardClimateData;
  onChange: (data: StandardClimateData) => void;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function StandardConditionsView({ value, onChange }: StandardConditionsViewProps) {
  const [standardData, setStandardData] = useState<StandardClimateData>(value);

  const handleStandardChange = (standard: StandardClimateData['standard']) => {
    const newData: StandardClimateData = {
      standard,
      parameters: {},
    };
    setStandardData(newData);
    onChange(newData);
  };

  const handleParameterChange = (key: string, paramValue: any) => {
    const newData = {
      ...standardData,
      parameters: {
        ...standardData.parameters,
        [key]: paramValue,
      },
    };
    setStandardData(newData);
    onChange(newData);
  };

  // Generate preview data based on standard
  const generatePreviewData = () => {
    const data = [];

    for (let month = 0; month < 12; month++) {
      let temperature = 10;
      let humidity = 70;

      // Simplified typical patterns for each standard
      if (standardData.standard === 'ASHRAE-160') {
        const zone = standardData.parameters.climateZone || 4;
        const baseTemp = [25, 20, 15, 10, 5, 0, -5, -10][zone - 1] || 10;
        temperature = baseTemp + 10 * Math.sin((month / 12) * 2 * Math.PI);
        humidity = 70 - (standardData.parameters.moistureLoad === 'high' ? 10 :
                        standardData.parameters.moistureLoad === 'low' ? -10 : 0);
      } else if (standardData.standard === 'EN-15026') {
        temperature = (standardData.parameters.internalTemp || 20);
        humidity = 50 + (standardData.parameters.airChangeRate || 0.5) * 20;
      } else if (standardData.standard === 'ISO-13788') {
        temperature = standardData.parameters.internalTemp || 20;
        const humidityClass = standardData.parameters.humidityClass || 3;
        humidity = [35, 45, 55, 65, 75][humidityClass - 1] || 55;
      } else {
        // WTA 6-2 or default
        temperature = 10 + 10 * Math.sin((month / 12) * 2 * Math.PI);
        humidity = 70 - 15 * Math.sin((month / 12) * 2 * Math.PI);
      }

      data.push({
        month: MONTH_NAMES[month],
        temperature: parseFloat(temperature.toFixed(1)),
        humidity: parseFloat(humidity.toFixed(1)),
      });
    }

    return data;
  };

  const previewData = generatePreviewData();

  return (
    <div className="space-y-lg">
      {/* Standard Selection */}
      <div className="space-y-md">
        <Select
          label="Select Standard"
          value={standardData.standard}
          onChange={(value) => handleStandardChange(value as StandardClimateData['standard'])}
          options={[
            { value: 'ASHRAE-160', label: 'ASHRAE 160' },
            { value: 'EN-15026', label: 'EN 15026 / DIN 4108' },
            { value: 'ISO-13788', label: 'ISO 13788' },
            { value: 'WTA-6-2', label: 'WTA 6-2' },
          ]}
        />
      </div>

      {/* Standard Description */}
      <div className="bg-bluelight/20 border-l-4 border-blue p-md rounded text-sm">
        {standardData.standard === 'ASHRAE-160' && (
          <p>
            <strong>ASHRAE 160:</strong> Design Criteria for Moisture Control in Buildings. Provides climate
            zones and moisture load classifications for North American conditions.
          </p>
        )}
        {standardData.standard === 'EN-15026' && (
          <p>
            <strong>EN 15026:</strong> Hygrothermal performance of building components and building elements.
            European standard for building physics calculations.
          </p>
        )}
        {standardData.standard === 'ISO-13788' && (
          <p>
            <strong>ISO 13788:</strong> Hygrothermal performance of building components and building elements.
            International standard with humidity class classifications.
          </p>
        )}
        {standardData.standard === 'WTA-6-2' && (
          <p>
            <strong>WTA 6-2:</strong> Simulation of heat and moisture transfer. German guideline for
            hygrothermal simulations in heritage buildings.
          </p>
        )}
      </div>

      {/* Parameters based on selected standard */}
      <div className="space-y-md">
        <h3 className="text-sm font-semibold uppercase text-greydark">Parameters</h3>

        {/* ASHRAE 160 Parameters */}
        {standardData.standard === 'ASHRAE-160' && (
          <div className="space-y-md">
            <div>
              <Select
                label="Climate Zone"
                value={standardData.parameters.climateZone || 4}
                onChange={(value) => handleParameterChange('climateZone', value)}
                options={[
                  { value: 1, label: 'Zone 1 - Hot-Humid' },
                  { value: 2, label: 'Zone 2 - Hot-Dry' },
                  { value: 3, label: 'Zone 3 - Warm-Marine' },
                  { value: 4, label: 'Zone 4 - Mixed-Humid' },
                  { value: 5, label: 'Zone 5 - Cool-Humid' },
                  { value: 6, label: 'Zone 6 - Cold' },
                  { value: 7, label: 'Zone 7 - Very Cold' },
                  { value: 8, label: 'Zone 8 - Subarctic' },
                ]}
              />
            </div>

            <div>
              <Label>Moisture Load</Label>
              <div className="grid grid-cols-3 gap-xs mt-xs">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleParameterChange('moistureLoad', level)}
                    className={`px-md py-sm text-sm font-medium rounded transition-colors ${
                      standardData.parameters.moistureLoad === level
                        ? 'bg-bluegreen text-white'
                        : 'bg-white text-text border border-greylight hover:bg-greylight/10'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Temperature Level</Label>
              <div className="grid grid-cols-3 gap-xs mt-xs">
                {['low', 'normal', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleParameterChange('temperatureLevel', level)}
                    className={`px-md py-sm text-sm font-medium rounded transition-colors ${
                      standardData.parameters.temperatureLevel === level
                        ? 'bg-bluegreen text-white'
                        : 'bg-white text-text border border-greylight hover:bg-greylight/10'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EN 15026 Parameters */}
        {standardData.standard === 'EN-15026' && (
          <div className="space-y-md">
            <div>
              <Select
                label="Building Type"
                value={standardData.parameters.buildingType || 'residential'}
                onChange={(value) => handleParameterChange('buildingType', value)}
                options={[
                  { value: 'residential', label: 'Residential' },
                  { value: 'office', label: 'Office' },
                  { value: 'industrial', label: 'Industrial' },
                ]}
              />
            </div>

            <div>
              <Label htmlFor="moisture-gen-rate">Moisture Generation Rate [g/(m³·s)]</Label>
              <Input
                id="moisture-gen-rate"
                type="number"
                value={standardData.parameters.moistureGenRate || 0.002}
                onChange={(e) => handleParameterChange('moistureGenRate', parseFloat(e.target.value) || 0.002)}
                step="0.0001"
                min="0"
                max="0.01"
              />
              <p className="text-xs text-greydark mt-xs">
                Default: 0.002 g/(m³·s) for residential
              </p>
            </div>

            <div>
              <Label htmlFor="air-change-rate">Air Change Rate [1/h]</Label>
              <Input
                id="air-change-rate"
                type="number"
                value={standardData.parameters.airChangeRate || 0.5}
                onChange={(e) => handleParameterChange('airChangeRate', parseFloat(e.target.value) || 0.5)}
                step="0.1"
                min="0"
                max="5"
              />
              <p className="text-xs text-greydark mt-xs">
                Default: 0.5 1/h (typical residential)
              </p>
            </div>
          </div>
        )}

        {/* ISO 13788 Parameters */}
        {standardData.standard === 'ISO-13788' && (
          <div className="space-y-md">
            <div>
              <Label htmlFor="internal-temp">Internal Temperature [°C]</Label>
              <Input
                id="internal-temp"
                type="number"
                value={standardData.parameters.internalTemp || 20}
                onChange={(e) => handleParameterChange('internalTemp', parseFloat(e.target.value) || 20)}
                step="1"
                min="15"
                max="25"
              />
              <p className="text-xs text-greydark mt-xs">
                Typical range: 18-22°C
              </p>
            </div>

            <div>
              <Label>Humidity Class</Label>
              <div className="space-y-xs mt-xs">
                {[
                  { value: 1, label: 'Class 1 (Low)', range: '30-40% RH', desc: 'Storage facilities, unoccupied spaces' },
                  { value: 2, label: 'Class 2 (Medium)', range: '40-50% RH', desc: 'Offices, shops' },
                  { value: 3, label: 'Class 3 (Normal)', range: '50-60% RH', desc: 'Dwellings with normal occupancy' },
                  { value: 4, label: 'Class 4 (High)', range: '60-70% RH', desc: 'Restaurants, sports halls' },
                  { value: 5, label: 'Class 5 (Very High)', range: '70-80% RH', desc: 'Laundries, breweries, indoor pools' },
                ].map((cls) => (
                  <button
                    key={cls.value}
                    onClick={() => handleParameterChange('humidityClass', cls.value)}
                    className={`w-full text-left p-sm rounded border transition-colors ${
                      standardData.parameters.humidityClass === cls.value
                        ? 'bg-bluegreen/10 border-bluegreen'
                        : 'bg-white border-greylight hover:bg-greylight/5'
                    }`}
                  >
                    <div className="font-medium text-sm">{cls.label}</div>
                    <div className="text-xs text-greydark mt-xs">
                      {cls.range} - {cls.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WTA 6-2 Parameters */}
        {standardData.standard === 'WTA-6-2' && (
          <div className="bg-yellowlight/30 border border-yellow p-md rounded text-sm">
            <p className="font-medium mb-sm">WTA 6-2 Standard</p>
            <p className="text-greydark">
              This standard provides guidelines for hygrothermal simulations, particularly for heritage buildings.
              Default climate parameters are used based on German climate zones.
            </p>
            <p className="text-greydark mt-sm">
              Additional parameters will be available in future versions.
            </p>
          </div>
        )}
      </div>

      {/* Preview Chart */}
      <div className="space-y-sm">
        <h3 className="text-sm font-semibold uppercase text-greydark">Typical Annual Pattern</h3>
        <div className="border border-greylight rounded p-md bg-white">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9D8CD" />
              <XAxis
                dataKey="month"
                stroke="#5E5A58"
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                stroke="#C04343"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Relative Humidity (%)', angle: 90, position: 'insideRight' }}
                stroke="#4597BF"
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                stroke="#C04343"
                strokeWidth={2}
                name="Temperature (°C)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                stroke="#4597BF"
                strokeWidth={2}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-greydark text-center mt-sm italic">
            Preview shows typical pattern for selected standard and parameters
          </p>
        </div>
      </div>
    </div>
  );
}
