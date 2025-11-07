import { useState, useMemo } from 'react';
import { X, BarChart3, Calendar, Table as TableIcon, List } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EPWData, WACData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Checkbox } from '../../../components/ui/Checkbox';

interface ClimateDataViewerProps {
  isOpen: boolean;
  onClose: () => void;
  data: EPWData | WACData;
}

type TabType = 'annual-chart' | 'monthly-stats' | 'data-table' | 'variables';

interface VariableConfig {
  key: keyof (EPWData['data'][0] | WACData['data'][0]);
  label: string;
  unit: string;
  color: string;
  visible: boolean;
}

export function ClimateDataViewer({ isOpen, onClose, data }: ClimateDataViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('annual-chart');
  const [variables, setVariables] = useState<VariableConfig[]>([
    { key: 'temperature', label: 'Temperature', unit: '°C', color: '#E63946', visible: true },
    { key: 'humidity', label: 'Relative Humidity', unit: '%', color: '#457B9D', visible: true },
    { key: 'radiation', label: 'Solar Radiation', unit: 'W/m²', color: '#F77F00', visible: false },
    { key: 'rain', label: 'Precipitation', unit: 'mm', color: '#06AED5', visible: false },
    { key: 'windSpeed', label: 'Wind Speed', unit: 'm/s', color: '#2A9D8F', visible: false },
  ]);

  const tabs = [
    { id: 'annual-chart' as TabType, label: 'Annual Chart', icon: BarChart3 },
    { id: 'monthly-stats' as TabType, label: 'Monthly Stats', icon: Calendar },
    { id: 'data-table' as TabType, label: 'Data Table', icon: TableIcon },
    { id: 'variables' as TabType, label: 'Variables', icon: List },
  ];

  // Prepare chart data (sample every 24 hours for performance)
  const chartData = useMemo(() => {
    const sampledData = data.data.filter((_, index) => index % 24 === 0);
    return sampledData.map((point, index) => ({
      index,
      day: Math.floor(index / 1),
      temperature: point.temperature,
      humidity: point.humidity,
      radiation: point.radiation,
      rain: point.rain,
      windSpeed: point.windSpeed,
    }));
  }, [data]);

  // Calculate monthly statistics
  const monthlyStats = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      name: new Date(2000, i, 1).toLocaleDateString('en', { month: 'short' }),
      temperature: { sum: 0, count: 0, min: Infinity, max: -Infinity },
      humidity: { sum: 0, count: 0, min: Infinity, max: -Infinity },
      radiation: { sum: 0, count: 0 },
      rain: { sum: 0, count: 0 },
    }));

    data.data.forEach((point) => {
      const date = new Date(point.timestamp);
      const monthIndex = date.getMonth();
      const month = months[monthIndex];

      month.temperature.sum += point.temperature;
      month.temperature.min = Math.min(month.temperature.min, point.temperature);
      month.temperature.max = Math.max(month.temperature.max, point.temperature);
      month.temperature.count++;

      month.humidity.sum += point.humidity;
      month.humidity.min = Math.min(month.humidity.min, point.humidity);
      month.humidity.max = Math.max(month.humidity.max, point.humidity);
      month.humidity.count++;

      month.radiation.sum += point.radiation;
      month.radiation.count++;

      month.rain.sum += point.rain;
      month.rain.count++;
    });

    return months.map(month => ({
      month: month.month,
      name: month.name,
      temperature: {
        mean: month.temperature.sum / month.temperature.count,
        min: month.temperature.min,
        max: month.temperature.max,
      },
      humidity: {
        mean: month.humidity.sum / month.humidity.count,
        min: month.humidity.min,
        max: month.humidity.max,
      },
      radiation: {
        total: month.radiation.sum / 1000, // kWh/m²
      },
      rain: {
        total: month.rain.sum,
      },
    }));
  }, [data]);

  const toggleVariable = (key: string) => {
    setVariables(prev =>
      prev.map(v => v.key === key ? { ...v, visible: !v.visible } : v)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-lg">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-[calc(100vw-64px)] max-h-[calc(100vh-64px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-lg border-b border-greylight">
          <div>
            <h2 className="text-xl font-semibold">{data.fileName}</h2>
            <p className="text-sm text-greydark">
              {data.header.location} • {data.data.length} hourly data points
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-sm rounded hover:bg-greylight/20 transition-colors"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6 text-greydark" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-greylight">
          <div className="flex px-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-xs px-lg py-md border-b-2 transition-colors',
                    isActive
                      ? 'border-bluegreen text-bluegreen font-medium'
                      : 'border-transparent text-greydark hover:text-text'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-lg">
          {/* Annual Chart Tab */}
          {activeTab === 'annual-chart' && (
            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Annual Climate Data</h3>
                <p className="text-sm text-greydark">
                  Showing daily averages (365 data points from {data.data.length} hourly values)
                </p>
              </div>

              <div className="bg-white border border-greylight rounded-lg p-md">
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis
                      dataKey="day"
                      label={{ value: 'Day of Year', position: 'insideBottom', offset: -5 }}
                      stroke="#5E5A58"
                    />
                    <YAxis
                      yAxisId="left"
                      label={{ value: 'Temperature (°C) / Humidity (%)', angle: -90, position: 'insideLeft' }}
                      stroke="#5E5A58"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{ value: 'Radiation (W/m²) / Wind (m/s)', angle: 90, position: 'insideRight' }}
                      stroke="#5E5A58"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E5E5',
                        borderRadius: '4px',
                      }}
                    />
                    <Legend />
                    {variables.find(v => v.key === 'temperature')?.visible && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="temperature"
                        stroke={variables.find(v => v.key === 'temperature')?.color}
                        dot={false}
                        strokeWidth={2}
                        name="Temperature (°C)"
                      />
                    )}
                    {variables.find(v => v.key === 'humidity')?.visible && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="humidity"
                        stroke={variables.find(v => v.key === 'humidity')?.color}
                        dot={false}
                        strokeWidth={2}
                        name="Humidity (%)"
                      />
                    )}
                    {variables.find(v => v.key === 'radiation')?.visible && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="radiation"
                        stroke={variables.find(v => v.key === 'radiation')?.color}
                        dot={false}
                        strokeWidth={2}
                        name="Radiation (W/m²)"
                      />
                    )}
                    {variables.find(v => v.key === 'windSpeed')?.visible && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="windSpeed"
                        stroke={variables.find(v => v.key === 'windSpeed')?.color}
                        dot={false}
                        strokeWidth={2}
                        name="Wind Speed (m/s)"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Monthly Stats Tab */}
          {activeTab === 'monthly-stats' && (
            <div className="space-y-md">
              <h3 className="text-lg font-semibold">Monthly Statistics</h3>
              <div className="grid grid-cols-4 gap-md">
                {monthlyStats.map((month) => (
                  <div
                    key={month.month}
                    className="bg-white border border-greylight rounded-lg p-md space-y-sm"
                  >
                    <h4 className="font-semibold text-center border-b border-greylight pb-xs">
                      {month.name}
                    </h4>

                    <div className="space-y-xs text-xs">
                      <div className="bg-greylight/10 p-xs rounded">
                        <div className="text-greydark">Temperature</div>
                        <div className="font-mono">
                          <div>Mean: {month.temperature.mean.toFixed(1)}°C</div>
                          <div>Min: {month.temperature.min.toFixed(1)}°C</div>
                          <div>Max: {month.temperature.max.toFixed(1)}°C</div>
                        </div>
                      </div>

                      <div className="bg-greylight/10 p-xs rounded">
                        <div className="text-greydark">Humidity</div>
                        <div className="font-mono">
                          <div>Mean: {month.humidity.mean.toFixed(1)}%</div>
                          <div>Min: {month.humidity.min.toFixed(1)}%</div>
                          <div>Max: {month.humidity.max.toFixed(1)}%</div>
                        </div>
                      </div>

                      <div className="bg-greylight/10 p-xs rounded">
                        <div className="text-greydark">Radiation</div>
                        <div className="font-mono">{month.radiation.total.toFixed(0)} kWh/m²</div>
                      </div>

                      <div className="bg-greylight/10 p-xs rounded">
                        <div className="text-greydark">Precipitation</div>
                        <div className="font-mono">{month.rain.total.toFixed(1)} mm</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Table Tab */}
          {activeTab === 'data-table' && (
            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Hourly Data Table</h3>
                <p className="text-sm text-greydark">
                  Showing first 100 rows of {data.data.length} total
                </p>
              </div>

              <div className="border border-greylight rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-greylight/20 border-b border-greylight">
                      <tr>
                        <th className="px-md py-sm text-left font-semibold sticky left-0 bg-greylight/20">
                          Timestamp
                        </th>
                        <th className="px-md py-sm text-right font-semibold">Temp (°C)</th>
                        <th className="px-md py-sm text-right font-semibold">RH (%)</th>
                        <th className="px-md py-sm text-right font-semibold">Radiation (W/m²)</th>
                        <th className="px-md py-sm text-right font-semibold">Rain (mm)</th>
                        <th className="px-md py-sm text-right font-semibold">Wind (m/s)</th>
                        <th className="px-md py-sm text-right font-semibold">Wind Dir (°)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.slice(0, 100).map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-greylight hover:bg-greylight/5"
                        >
                          <td className="px-md py-sm font-mono text-xs sticky left-0 bg-white">
                            {new Date(row.timestamp).toLocaleString('en', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-md py-sm text-right font-mono">
                            {row.temperature.toFixed(1)}
                          </td>
                          <td className="px-md py-sm text-right font-mono">
                            {row.humidity.toFixed(1)}
                          </td>
                          <td className="px-md py-sm text-right font-mono">
                            {row.radiation.toFixed(0)}
                          </td>
                          <td className="px-md py-sm text-right font-mono">
                            {row.rain.toFixed(2)}
                          </td>
                          <td className="px-md py-sm text-right font-mono">
                            {row.windSpeed.toFixed(1)}
                          </td>
                          <td className="px-md py-sm text-right font-mono">
                            {row.windDirection.toFixed(0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-greydark text-center italic">
                Showing first 100 rows. Full dataset contains {data.data.length} hourly records.
              </p>
            </div>
          )}

          {/* Variables Tab */}
          {activeTab === 'variables' && (
            <div className="space-y-md max-w-2xl">
              <div>
                <h3 className="text-lg font-semibold mb-xs">Variable Visibility</h3>
                <p className="text-sm text-greydark">
                  Toggle which variables are displayed in the Annual Chart
                </p>
              </div>

              <div className="space-y-sm">
                {variables.map((variable) => (
                  <div
                    key={variable.key}
                    className="bg-white border border-greylight rounded-lg p-md"
                  >
                    <div className="flex items-center gap-md">
                      <Checkbox
                        id={`var-${variable.key}`}
                        checked={variable.visible}
                        onCheckedChange={() => toggleVariable(variable.key)}
                      />
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: variable.color }}
                      />
                      <label
                        htmlFor={`var-${variable.key}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{variable.label}</div>
                        <div className="text-sm text-greydark">Unit: {variable.unit}</div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellowlight/20 border border-yellowlight rounded-lg p-md">
                <p className="text-sm">
                  <strong>Tip:</strong> Temperature and humidity use the left Y-axis, while radiation
                  and wind speed use the right Y-axis for better visualization.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
