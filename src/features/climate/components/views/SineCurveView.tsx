import { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Select } from '../../../../components/ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SineCurveData } from '../../types';

interface SineCurveViewProps {
  value: SineCurveData;
  onChange: (data: SineCurveData) => void;
}

// Helper to convert date string like "Jun/03" to day of year
function dateToDayOfYear(dateStr: string): number {
  const [monthStr, dayStr] = dateStr.split('/');
  const monthMap: { [key: string]: number } = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const month = monthMap[monthStr] || 0;
  const day = parseInt(dayStr) || 1;

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = day;
  for (let i = 0; i < month; i++) {
    dayOfYear += daysInMonth[i];
  }
  return dayOfYear;
}

// Helper to convert day of year to date string
function dayOfYearToDate(day: number): string {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let remaining = day;
  let month = 0;

  while (remaining > daysInMonth[month] && month < 11) {
    remaining -= daysInMonth[month];
    month++;
  }

  return `${monthNames[month]}/${remaining.toString().padStart(2, '0')}`;
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
    const tempDayMax = dateToDayOfYear(sineCurve.temperature.dayOfMaximum);
    const humidityDayMax = dateToDayOfYear(sineCurve.humidity.dayOfMaximum);

    for (let day = 1; day <= 365; day += 7) { // Weekly points for performance
      // Phase shift is calculated from day of maximum (max occurs at phase = π/2)
      // So phase shift in radians = ((dayOfMax - day) / 365) * 2π
      const tempPhase = ((day - tempDayMax) / 365) * 2 * Math.PI + Math.PI / 2;
      const humidityPhase = ((day - humidityDayMax) / 365) * 2 * Math.PI + Math.PI / 2;

      const temperature = sineCurve.temperature.mean +
        sineCurve.temperature.amplitude * Math.sin(tempPhase);

      const humidity = sineCurve.humidity.mean +
        sineCurve.humidity.amplitude * Math.sin(humidityPhase);

      data.push({
        day,
        temperature: parseFloat(temperature.toFixed(1)),
        humidity: parseFloat(Math.max(0, Math.min(100, humidity)).toFixed(1)),
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
    <div className="space-y-lg max-w-5xl mx-auto">
      {/* Curve Selection */}
      <div className="space-y-md">
        <Select
          label="Curve Selection"
          value={sineCurve.curveSelection || 'Indoor Condition, Medium Moisture Load'}
          onChange={(value) => handleChange({ curveSelection: value })}
          options={[
            { value: 'Indoor Condition, Low Moisture Load', label: 'Indoor Condition, Low Moisture Load' },
            { value: 'Indoor Condition, Medium Moisture Load', label: 'Indoor Condition, Medium Moisture Load' },
            { value: 'Indoor Condition, High Moisture Load', label: 'Indoor Condition, High Moisture Load' },
            { value: 'Custom', label: 'Custom' },
          ]}
        />
      </div>

      {/* Temperature Settings */}
      <div className="space-y-md">
        <h3 className="text-sm font-semibold uppercase text-greydark">Temperature</h3>

        <div className="grid grid-cols-3 gap-md">
          <div>
            <Label htmlFor="temp-mean">Mean Value [°C]</Label>
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
            <Label htmlFor="temp-amplitude">Amplitude [K]</Label>
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
            <Label htmlFor="temp-day-max">Day of Maximum</Label>
            <Input
              id="temp-day-max"
              type="text"
              value={sineCurve.temperature.dayOfMaximum}
              onChange={(e) => handleChange({
                temperature: { ...sineCurve.temperature, dayOfMaximum: e.target.value }
              })}
              placeholder="Jun/03"
            />
            <p className="text-xs text-greydark mt-xs">
              Format: Mon/DD (e.g., Jun/03)
            </p>
          </div>
        </div>

        <div className="text-sm text-greydark bg-greylight/10 p-sm rounded">
          Range: {tempMin.toFixed(1)}°C to {tempMax.toFixed(1)}°C
        </div>
      </div>

      {/* Humidity Settings */}
      <div className="space-y-md">
        <h3 className="text-sm font-semibold uppercase text-greydark">Relative Humidity</h3>

        <div className="grid grid-cols-3 gap-md">
          <div>
            <Label htmlFor="humidity-mean">Mean Value [%]</Label>
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
            <Label htmlFor="humidity-amplitude">Amplitude [%]</Label>
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
            <Label htmlFor="humidity-day-max">Day of Maximum</Label>
            <Input
              id="humidity-day-max"
              type="text"
              value={sineCurve.humidity.dayOfMaximum}
              onChange={(e) => handleChange({
                humidity: { ...sineCurve.humidity, dayOfMaximum: e.target.value }
              })}
              placeholder="Aug/16"
            />
            <p className="text-xs text-greydark mt-xs">
              Format: Mon/DD (e.g., Aug/16)
            </p>
          </div>
        </div>

        <div className="text-sm text-greydark bg-greylight/10 p-sm rounded">
          Range: {humidityMin.toFixed(1)}% to {humidityMax.toFixed(1)}%
        </div>
      </div>

      {/* Live Preview Chart - Larger size */}
      <div className="space-y-sm mt-lg">
        <h3 className="text-sm font-semibold uppercase text-greydark">Live Preview</h3>
        <div className="border border-greylight rounded p-md bg-white">
          <ResponsiveContainer width="100%" height={400}>
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
