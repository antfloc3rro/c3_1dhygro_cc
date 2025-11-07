import { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Slider } from '../../../../components/ui/Slider';
import { Switch } from '../../../../components/ui/Switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SineCurveData } from '../../types';

interface SineCurveViewProps {
  value: SineCurveData;
  onChange: (data: SineCurveData) => void;
}

export function SineCurveView({ value, onChange }: SineCurveViewProps) {
  const [sineCurve, setSineCurve] = useState<SineCurveData>(value);

  const handleChange = (updates: Partial<SineCurveData>) => {
    const newData = { ...sineCurve, ...updates };
    setSineCurve(newData);
    onChange(newData);
  };

  // Generate preview data for the chart (365 days)
  const generateChartData = () => {
    const data = [];
    for (let day = 0; day < 365; day += 7) { // Weekly points for performance
      const tempRadians = ((day + sineCurve.temperature.phaseShift) / 365) * 2 * Math.PI;
      const humidityRadians = sineCurve.inverseCorrelation
        ? ((day + sineCurve.humidity.phaseShift + 182.5) / 365) * 2 * Math.PI // 180° phase shift
        : ((day + sineCurve.humidity.phaseShift) / 365) * 2 * Math.PI;

      const temperature = sineCurve.temperature.mean +
        sineCurve.temperature.amplitude * Math.sin(tempRadians);

      const humidity = sineCurve.humidity.mean +
        sineCurve.humidity.amplitude * Math.sin(humidityRadians);

      data.push({
        day,
        temperature: parseFloat(temperature.toFixed(1)),
        humidity: parseFloat(humidity.toFixed(1)),
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const tempMin = sineCurve.temperature.mean - sineCurve.temperature.amplitude;
  const tempMax = sineCurve.temperature.mean + sineCurve.temperature.amplitude;
  const humidityMin = Math.max(0, sineCurve.humidity.mean - sineCurve.humidity.amplitude);
  const humidityMax = Math.min(100, sineCurve.humidity.mean + sineCurve.humidity.amplitude);

  return (
    <div className="space-y-lg">
      {/* Temperature Settings */}
      <div className="space-y-md">
        <h3 className="text-sm font-semibold uppercase text-greydark">Temperature Settings</h3>

        <div className="grid grid-cols-3 gap-md">
          <div>
            <Label htmlFor="temp-mean">Mean Temperature (°C)</Label>
            <Input
              id="temp-mean"
              type="number"
              value={sineCurve.temperature.mean}
              onChange={(e) => handleChange({
                temperature: { ...sineCurve.temperature, mean: parseFloat(e.target.value) || 0 }
              })}
              step="0.1"
              min="-30"
              max="40"
            />
          </div>

          <div>
            <Label htmlFor="temp-amplitude">Amplitude (°C)</Label>
            <Input
              id="temp-amplitude"
              type="number"
              value={sineCurve.temperature.amplitude}
              onChange={(e) => handleChange({
                temperature: { ...sineCurve.temperature, amplitude: parseFloat(e.target.value) || 0 }
              })}
              step="0.1"
              min="0"
              max="30"
            />
          </div>

          <div>
            <Label htmlFor="temp-phase">Phase Shift (days)</Label>
            <Input
              id="temp-phase"
              type="number"
              value={sineCurve.temperature.phaseShift}
              onChange={(e) => handleChange({
                temperature: { ...sineCurve.temperature, phaseShift: parseInt(e.target.value) || 0 }
              })}
              min="0"
              max="365"
            />
          </div>
        </div>

        <div className="text-sm text-greydark bg-greylight/10 p-sm rounded">
          Range: {tempMin.toFixed(1)}°C to {tempMax.toFixed(1)}°C
        </div>
      </div>

      {/* Humidity Settings */}
      <div className="space-y-md">
        <h3 className="text-sm font-semibold uppercase text-greydark">Humidity Settings</h3>

        <div className="grid grid-cols-3 gap-md">
          <div>
            <Label htmlFor="humidity-mean">Mean Relative Humidity (%)</Label>
            <Input
              id="humidity-mean"
              type="number"
              value={sineCurve.humidity.mean}
              onChange={(e) => handleChange({
                humidity: { ...sineCurve.humidity, mean: parseFloat(e.target.value) || 0 }
              })}
              step="1"
              min="0"
              max="100"
            />
          </div>

          <div>
            <Label htmlFor="humidity-amplitude">Amplitude (%)</Label>
            <Input
              id="humidity-amplitude"
              type="number"
              value={sineCurve.humidity.amplitude}
              onChange={(e) => handleChange({
                humidity: { ...sineCurve.humidity, amplitude: parseFloat(e.target.value) || 0 }
              })}
              step="1"
              min="0"
              max="50"
            />
          </div>

          <div>
            <Label htmlFor="humidity-phase">Phase Shift (days)</Label>
            <Input
              id="humidity-phase"
              type="number"
              value={sineCurve.humidity.phaseShift}
              onChange={(e) => handleChange({
                humidity: { ...sineCurve.humidity, phaseShift: parseInt(e.target.value) || 0 }
              })}
              min="0"
              max="365"
            />
          </div>
        </div>

        <div className="text-sm text-greydark bg-greylight/10 p-sm rounded">
          Range: {humidityMin.toFixed(1)}% to {humidityMax.toFixed(1)}%
        </div>
      </div>

      {/* Correlation */}
      <div className="flex items-center gap-sm p-md border border-greylight rounded">
        <Switch
          id="inverse-correlation"
          checked={sineCurve.inverseCorrelation}
          onCheckedChange={(checked) => handleChange({ inverseCorrelation: checked })}
        />
        <Label htmlFor="inverse-correlation" className="cursor-pointer">
          Inverse correlation between temperature and humidity
        </Label>
      </div>
      <p className="text-xs text-greydark -mt-sm">
        When enabled, high temperatures correspond to low humidity (typical for seasonal climates)
      </p>

      {/* Live Preview Chart */}
      <div className="space-y-sm">
        <h3 className="text-sm font-semibold uppercase text-greydark">Live Preview</h3>
        <div className="border border-greylight rounded p-md bg-white">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9D8CD" />
              <XAxis
                dataKey="day"
                label={{ value: 'Day of Year', position: 'insideBottom', offset: -5 }}
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
                dot={false}
                name="Temperature (°C)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                stroke="#4597BF"
                strokeWidth={2}
                dot={false}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
