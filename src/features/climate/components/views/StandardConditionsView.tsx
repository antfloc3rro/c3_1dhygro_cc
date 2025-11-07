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
    // Set default parameters for each standard
    let defaultParams: StandardClimateData['parameters'] = {};

    switch (standard) {
      case 'EN-15026':
        defaultParams = { moistureLoad: 'medium' };
        break;
      case 'ISO-13788':
        defaultParams = { meanTemperature: 20, humidityClass: 3 };
        break;
      case 'ASHRAE-160':
        defaultParams = {
          acType: 'ac-with-dehumidification',
          floatingTempShift: 2.8,
          heatingSetpoint: 21.1,
          coolingSetpoint: 23.9,
          rhSetpoint: 50,
          numBedrooms: 2,
          jettedTub: false,
          userDefinedMoistureGen: false,
          moistureGenRate: 0.000105,
          constructionAirtightness: 'standard',
          airExchangeRate: 0.2,
          buildingVolume: 500,
        };
        break;
      default:
        break;
    }

    const newData: StandardClimateData = { standard, parameters: defaultParams };
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
      let temperature = 20;
      let humidity = 50;

      // Simplified typical patterns
      if (standardData.standard === 'ASHRAE-160') {
        temperature = (standardData.parameters.heatingSetpoint || 21) +
                     5 * Math.sin((month / 12) * 2 * Math.PI);
        humidity = standardData.parameters.rhSetpoint || 50;
      } else if (standardData.standard === 'ISO-13788') {
        temperature = standardData.parameters.meanTemperature || 20;
        const humidityClass = standardData.parameters.humidityClass || 3;
        humidity = [35, 45, 55, 65, 75][humidityClass - 1] || 55;
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
    <div className="space-y-lg max-w-5xl mx-auto">
      {/* Standard Selection */}
      <div className="space-y-md">
        <Select
          label="Select Standard"
          value={standardData.standard}
          onChange={(value) => handleStandardChange(value as StandardClimateData['standard'])}
          options={[
            { value: 'EN-15026', label: 'EN 15026 / DIN 4108 / WTA 6-2' },
            { value: 'ISO-13788', label: 'ISO 13788' },
            { value: 'ASHRAE-160', label: 'ASHRAE 160' },
            { value: 'WTA-6-2', label: 'WTA 6-2' },
          ]}
        />
      </div>

      {/* Parameters Section */}
      <div className="space-y-lg">
        {/* EN 15026 Parameters - Just moisture load */}
        {standardData.standard === 'EN-15026' && (
          <div className="space-y-md">
            <h3 className="text-sm font-semibold uppercase text-greydark">Moisture Load</h3>
            <Select
              label="Moisture Load"
              value={standardData.parameters.moistureLoad || 'medium'}
              onChange={(value) => handleParameterChange('moistureLoad', value)}
              options={[
                { value: 'low', label: 'Low Moisture Load' },
                { value: 'medium', label: 'Medium Moisture Load' },
                { value: 'medium-high', label: 'Medium Moisture Load +5% (Design)' },
                { value: 'high', label: 'High Moisture Load' },
                { value: 'very-high', label: 'Very High Moisture Load' },
              ]}
            />
          </div>
        )}

        {/* ISO 13788 Parameters - Mean temperature and humidity class */}
        {standardData.standard === 'ISO-13788' && (
          <div className="space-y-md">
            <h3 className="text-sm font-semibold uppercase text-greydark">Temperature & Humidity</h3>

            <div className="grid grid-cols-2 gap-md">
              <div>
                <Label htmlFor="mean-temp">Mean Value [°C]</Label>
                <Input
                  id="mean-temp"
                  type="number"
                  value={standardData.parameters.meanTemperature || 20}
                  onChange={(e) => handleParameterChange('meanTemperature', parseFloat(e.target.value) || 20)}
                  step="0.1"
                  min="15"
                  max="25"
                />
              </div>

              <div>
                <Select
                  label="Humidity Class"
                  value={standardData.parameters.humidityClass || 3}
                  onChange={(value) => handleParameterChange('humidityClass', value)}
                  options={[
                    { value: 1, label: 'Humidity Class 1 (Low: 30-40% RH)' },
                    { value: 2, label: 'Humidity Class 2 (Medium: 40-50% RH)' },
                    { value: 3, label: 'Humidity Class 3 (Normal: 50-60% RH)' },
                    { value: 4, label: 'Humidity Class 4 (High: 60-70% RH)' },
                    { value: 5, label: 'Humidity Class 5 (Very High: 70-80% RH)' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* ASHRAE 160 Parameters - All detailed inputs */}
        {standardData.standard === 'ASHRAE-160' && (
          <div className="space-y-lg">
            {/* Air-conditioning system */}
            <div className="space-y-md">
              <h3 className="text-sm font-semibold uppercase text-greydark">Air-conditioning System</h3>

              <Select
                label="AC Type"
                value={standardData.parameters.acType || 'ac-with-dehumidification'}
                onChange={(value) => handleParameterChange('acType', value)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'ac-only', label: 'AC Only' },
                  { value: 'ac-with-dehumidification', label: 'AC with Dehumidification' },
                ]}
              />

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <Label htmlFor="floating-temp">floating indoor temperature shift [°C]</Label>
                  <Input
                    id="floating-temp"
                    type="number"
                    value={standardData.parameters.floatingTempShift || 2.8}
                    onChange={(e) => handleParameterChange('floatingTempShift', parseFloat(e.target.value) || 2.8)}
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="rh-setpoint">R.H. control setpoint [%]</Label>
                  <Input
                    id="rh-setpoint"
                    type="number"
                    value={standardData.parameters.rhSetpoint || 50}
                    onChange={(e) => handleParameterChange('rhSetpoint', parseFloat(e.target.value) || 50)}
                    step="1"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <Label htmlFor="heating-setpoint">set point for heating [°C]</Label>
                  <Input
                    id="heating-setpoint"
                    type="number"
                    value={standardData.parameters.heatingSetpoint || 21.1}
                    onChange={(e) => handleParameterChange('heatingSetpoint', parseFloat(e.target.value) || 21.1)}
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="cooling-setpoint">set point for cooling [°C]</Label>
                  <Input
                    id="cooling-setpoint"
                    type="number"
                    value={standardData.parameters.coolingSetpoint || 23.9}
                    onChange={(e) => handleParameterChange('coolingSetpoint', parseFloat(e.target.value) || 23.9)}
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Relative Humidity / Moisture Generation Rate */}
            <div className="space-y-md">
              <h3 className="text-sm font-semibold uppercase text-greydark">Relative Humidity</h3>
              <p className="text-xs text-greydark">Moisture Generation Rate</p>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <Label htmlFor="num-bedrooms">number of bedrooms:</Label>
                  <Input
                    id="num-bedrooms"
                    type="number"
                    value={standardData.parameters.numBedrooms || 2}
                    onChange={(e) => handleParameterChange('numBedrooms', parseInt(e.target.value) || 2)}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={standardData.parameters.jettedTub || false}
                      onChange={(e) => handleParameterChange('jettedTub', e.target.checked)}
                      className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-bluegreen"
                    />
                    <span className="text-sm">Jetted tub without exhaust fan</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="user-defined-moisture"
                  checked={standardData.parameters.userDefinedMoistureGen || false}
                  onChange={(e) => handleParameterChange('userDefinedMoistureGen', e.target.checked)}
                  className="w-4 h-4 text-bluegreen border-greylight rounded focus:ring-bluegreen"
                />
                <Label htmlFor="user-defined-moisture" className="mb-0">User-defined Moisture Generation Rate</Label>
              </div>

              {standardData.parameters.userDefinedMoistureGen && (
                <div>
                  <Label htmlFor="moisture-gen-rate">Moisture Generation Rate [kg/s]</Label>
                  <Input
                    id="moisture-gen-rate"
                    type="number"
                    value={standardData.parameters.moistureGenRate || 0.000105}
                    onChange={(e) => handleParameterChange('moistureGenRate', parseFloat(e.target.value) || 0.000105)}
                    step="0.000001"
                  />
                </div>
              )}
            </div>

            {/* Air Exchange Rate */}
            <div className="space-y-md">
              <h3 className="text-sm font-semibold uppercase text-greydark">Air Exchange Rate</h3>

              <Select
                label="Construction Airtightness"
                value={standardData.parameters.constructionAirtightness || 'standard'}
                onChange={(value) => handleParameterChange('constructionAirtightness', value)}
                options={[
                  { value: 'leaky', label: 'leaky construction' },
                  { value: 'standard', label: 'standard construction' },
                  { value: 'tight', label: 'tight construction' },
                ]}
              />

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <Label htmlFor="air-exchange">Air Exchange Rate [1/h]</Label>
                  <Input
                    id="air-exchange"
                    type="number"
                    value={standardData.parameters.airExchangeRate || 0.2}
                    onChange={(e) => handleParameterChange('airExchangeRate', parseFloat(e.target.value) || 0.2)}
                    step="0.1"
                    min="0"
                    max="10"
                  />
                </div>

                <div className="bg-yellowlight/20 border border-yellow rounded p-sm">
                  <Label htmlFor="building-volume">building volume [m³]</Label>
                  <Input
                    id="building-volume"
                    type="number"
                    value={standardData.parameters.buildingVolume || 500}
                    onChange={(e) => handleParameterChange('buildingVolume', parseFloat(e.target.value) || 500)}
                    step="10"
                    min="10"
                    className="font-semibold"
                  />
                  <p className="text-xs text-greydark mt-xs">Most commonly modified</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WTA 6-2 */}
        {standardData.standard === 'WTA-6-2' && (
          <div className="bg-bluelight/20 border-l-4 border-blue p-md rounded text-sm">
            <p className="font-medium mb-sm">WTA 6-2 Standard</p>
            <p className="text-greydark">
              German guideline for hygrothermal simulations in heritage buildings.
              Standard climate parameters are applied automatically.
            </p>
          </div>
        )}
      </div>

      {/* Preview Chart - Larger size */}
      {(standardData.standard === 'ASHRAE-160' || standardData.standard === 'ISO-13788') && (
        <div className="space-y-sm mt-lg">
          <h3 className="text-sm font-semibold uppercase text-greydark">Preview: Typical Annual Pattern</h3>
          <div className="border border-greylight rounded p-md bg-white">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={previewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9D8CD" />
                <XAxis dataKey="month" stroke="#5E5A58" />
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
          </div>
        </div>
      )}
    </div>
  );
}
