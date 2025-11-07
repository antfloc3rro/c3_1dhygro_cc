import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Trash2, Info } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { NumberInput } from '../../../components/ui/NumberInput'
import { MaterialFunction, MaterialFunctionDataPoint } from '../../../types'

interface MaterialFunctionEditorProps {
  functionData: MaterialFunction | undefined
  onChange: (functionData: MaterialFunction) => void
  functionType: 'moistureStorage' | 'liquidTransport' | 'vaporDiffusion' | 'moistureDependentThermalConductivity'
}

const FUNCTION_CONFIGS = {
  moistureStorage: {
    name: 'Moisture Storage Function',
    description: 'Describes how much moisture can be stored in the material at different relative humidity levels.',
    xLabel: 'Relative Humidity',
    yLabel: 'Water Content',
    xUnit: '%',
    yUnit: 'kg/m³',
    defaultPoints: [
      { x: 0, y: 0 },
      { x: 50, y: 10 },
      { x: 80, y: 50 },
      { x: 95, y: 150 },
    ],
  },
  liquidTransport: {
    name: 'Liquid Transport Coefficient',
    description: 'Describes how fast liquid water moves through the material at different moisture contents.',
    xLabel: 'Water Content',
    yLabel: 'Liquid Diffusivity',
    xUnit: 'kg/m³',
    yUnit: 'm²/s',
    defaultPoints: [
      { x: 0, y: 0 },
      { x: 50, y: 1e-10 },
      { x: 100, y: 1e-9 },
      { x: 150, y: 1e-8 },
    ],
  },
  vaporDiffusion: {
    name: 'Water Vapor Diffusion Resistance Factor',
    description: 'Describes how the vapor resistance changes with relative humidity.',
    xLabel: 'Relative Humidity',
    yLabel: 'μ-value',
    xUnit: '%',
    yUnit: '[-]',
    defaultPoints: [
      { x: 0, y: 10 },
      { x: 50, y: 8 },
      { x: 80, y: 6 },
      { x: 100, y: 5 },
    ],
  },
  moistureDependentThermalConductivity: {
    name: 'Moisture-Dependent Thermal Conductivity',
    description: 'Describes how thermal conductivity changes with moisture content.',
    xLabel: 'Water Content',
    yLabel: 'Thermal Conductivity',
    xUnit: 'kg/m³',
    yUnit: 'W/(m·K)',
    defaultPoints: [
      { x: 0, y: 0.04 },
      { x: 50, y: 0.06 },
      { x: 100, y: 0.10 },
      { x: 150, y: 0.15 },
    ],
  },
}

export function MaterialFunctionEditor({
  functionData,
  onChange,
  functionType,
}: MaterialFunctionEditorProps) {
  const config = FUNCTION_CONFIGS[functionType]

  // Initialize with default data if not provided
  const currentFunction: MaterialFunction = functionData || {
    dataPoints: config.defaultPoints,
    xLabel: config.xLabel,
    yLabel: config.yLabel,
    xUnit: config.xUnit,
    yUnit: config.yUnit,
    description: config.description,
  }

  const [dataPoints, setDataPoints] = useState<MaterialFunctionDataPoint[]>(
    currentFunction.dataPoints
  )

  const handleAddPoint = () => {
    const newPoints = [...dataPoints, { x: 0, y: 0 }].sort((a, b) => a.x - b.x)
    setDataPoints(newPoints)
    onChange({
      ...currentFunction,
      dataPoints: newPoints,
    })
  }

  const handleRemovePoint = (index: number) => {
    if (dataPoints.length <= 2) {
      // Need at least 2 points for a function
      return
    }
    const newPoints = dataPoints.filter((_, i) => i !== index)
    setDataPoints(newPoints)
    onChange({
      ...currentFunction,
      dataPoints: newPoints,
    })
  }

  const handleUpdatePoint = (index: number, field: 'x' | 'y', value: number) => {
    const newPoints = [...dataPoints]
    newPoints[index] = { ...newPoints[index], [field]: value }

    // Sort by x value after update
    newPoints.sort((a, b) => a.x - b.x)

    setDataPoints(newPoints)
    onChange({
      ...currentFunction,
      dataPoints: newPoints,
    })
  }

  return (
    <div className="space-y-4">
      {/* Function Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <div className="font-semibold text-blue-900">{config.name}</div>
          <div className="text-blue-700 mt-1">{config.description}</div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-white border border-neutral-200 rounded-md p-4">
        <div className="text-sm font-semibold mb-3" style={{ color: '#33302F' }}>
          Function Graph
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataPoints}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis
              dataKey="x"
              label={{
                value: `${config.xLabel} [${config.xUnit}]`,
                position: 'insideBottom',
                offset: -5,
                style: { fontSize: '12px', fill: '#5E5A58' },
              }}
              tick={{ fontSize: 11, fill: '#5E5A58' }}
            />
            <YAxis
              label={{
                value: `${config.yLabel} [${config.yUnit}]`,
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '12px', fill: '#5E5A58' },
              }}
              tick={{ fontSize: 11, fill: '#5E5A58' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #D9D8CD',
                borderRadius: '4px',
                fontSize: '12px',
              }}
              labelFormatter={(value) => `${config.xLabel}: ${value} ${config.xUnit}`}
              formatter={(value: any) => [`${Number(value).toExponential(3)} ${config.yUnit}`, config.yLabel]}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#4AB79F"
              strokeWidth={2}
              dot={{ fill: '#4AB79F', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-neutral-200 rounded-md p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-semibold" style={{ color: '#33302F' }}>
            Data Points
          </div>
          <Button
            variant="secondary"
            icon={Plus}
            onClick={handleAddPoint}
            className="text-xs h-8"
          >
            Add Point
          </Button>
        </div>

        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-neutral-200">
            <div className="col-span-1 text-xs font-semibold" style={{ color: '#5E5A58' }}>
              #
            </div>
            <div className="col-span-5 text-xs font-semibold" style={{ color: '#5E5A58' }}>
              {config.xLabel} [{config.xUnit}]
            </div>
            <div className="col-span-5 text-xs font-semibold" style={{ color: '#5E5A58' }}>
              {config.yLabel} [{config.yUnit}]
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Data Rows */}
          {dataPoints.map((point, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 text-xs font-mono" style={{ color: '#5E5A58' }}>
                {index + 1}
              </div>
              <div className="col-span-5">
                <NumberInput
                  value={point.x}
                  onChange={(val) => val !== null && handleUpdatePoint(index, 'x', val)}
                  decimals={2}
                  className="text-xs"
                />
              </div>
              <div className="col-span-5">
                <NumberInput
                  value={point.y}
                  onChange={(val) => val !== null && handleUpdatePoint(index, 'y', val)}
                  decimals={6}
                  className="text-xs"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => handleRemovePoint(index)}
                  disabled={dataPoints.length <= 2}
                  className="p-1 rounded hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove point"
                >
                  <Trash2 className="w-4 h-4 text-red" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs" style={{ color: '#5E5A58' }}>
          {dataPoints.length} data points • Minimum 2 points required
        </div>
      </div>
    </div>
  )
}
