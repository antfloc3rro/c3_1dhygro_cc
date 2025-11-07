import React from 'react'
import { Layers, CheckCircle, AlertCircle, Eye, EyeOff, Target } from 'lucide-react'
import { cn } from '@/utils/index'
import { Card } from '@/components/ui/Card'

interface PerformanceSummaryProps {
  totalThickness: number
  uValue: number | null
  gridVisible: boolean
  onToggleGrid: () => void
  onAddMonitor?: () => void
}

/**
 * PerformanceSummary component following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Shows key calculated metrics at a glance:
 * - Total Thickness (sum of all layers)
 * - U-Value (calculated thermal transmittance)
 * - Grid Toggle button
 *
 * Specifications from Part 2:
 * - Height: 80px per card
 * - Background: White
 * - Border: 1px solid greylight
 * - Border-radius: 8px
 * - Padding: 12px
 * - Shadow: sm
 * - Font: Jost, 1.25rem for value
 * - Layout: Horizontal cards, spaced 12px apart
 */
export function PerformanceSummary({
  totalThickness,
  uValue,
  gridVisible,
  onToggleGrid,
  onAddMonitor,
}: PerformanceSummaryProps) {
  // U-Value validation (typical range: 0.1 - 3.0 W/(m²·K))
  const uValueStatus =
    uValue !== null
      ? uValue >= 0.1 && uValue <= 3.0
        ? 'normal'
        : 'unusual'
      : 'unknown'

  return (
    <div className="flex gap-3 mb-4">
      {/* Card 1: Total Thickness */}
      <Card padding="md" className="flex-1 h-20">
        <div className="flex items-center gap-3">
          <Layers className="w-[18px] h-[18px]" style={{ color: '#5E5A58' }} />
          <div>
            <div className="text-xs font-medium" style={{ color: '#5E5A58' }}>
              Total Thickness
            </div>
            <div className="text-xl font-semibold font-heading" style={{ color: '#33302F' }}>
              {(totalThickness * 1000).toFixed(0)} mm
            </div>
          </div>
        </div>
      </Card>

      {/* Card 2: U-Value */}
      <Card padding="md" className="flex-1 h-20">
        <div className="flex items-center gap-3">
          {uValue !== null ? (
            uValueStatus === 'normal' ? (
              <CheckCircle className="w-[18px] h-[18px]" style={{ color: '#3E7263' }} />
            ) : (
              <AlertCircle className="w-[18px] h-[18px]" style={{ color: '#E18E2A' }} />
            )
          ) : (
            <AlertCircle className="w-[18px] h-[18px]" style={{ color: '#BDB2AA' }} />
          )}
          <div>
            <div className="text-xs font-medium" style={{ color: '#5E5A58' }}>
              U-Value
            </div>
            <div className="text-xl font-semibold font-heading" style={{ color: '#33302F' }}>
              {uValue !== null ? `${uValue.toFixed(3)} W/(m²·K)` : 'Calculating...'}
            </div>
          </div>
        </div>
      </Card>

      {/* Card 3: Grid Toggle */}
      <Card
        padding="md"
        className={cn(
          'h-20 cursor-pointer transition-all duration-200',
          gridVisible ? 'ring-2 ring-bluegreen' : 'hover:shadow-md'
        )}
        style={{
          backgroundColor: gridVisible ? 'rgba(74, 183, 159, 0.1)' : '#FFFFFF',
        }}
        onClick={onToggleGrid}
      >
        <div className="flex items-center gap-3 h-full">
          {gridVisible ? (
            <EyeOff className="w-[18px] h-[18px]" style={{ color: '#4AB79F' }} />
          ) : (
            <Eye className="w-[18px] h-[18px]" style={{ color: '#5E5A58' }} />
          )}
          <div>
            <div className="text-xs font-medium" style={{ color: '#5E5A58' }}>
              Grid
            </div>
            <div className="text-sm font-semibold" style={{ color: gridVisible ? '#4AB79F' : '#33302F' }}>
              {gridVisible ? 'Hide Grid' : 'Show Grid'}
            </div>
          </div>
        </div>
      </Card>

      {/* Card 4: Add Monitor */}
      {onAddMonitor && (
        <Card
          padding="md"
          className="h-20 cursor-pointer transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-orange/50"
          onClick={onAddMonitor}
        >
          <div className="flex items-center gap-3 h-full">
            <Target className="w-[18px] h-[18px]" style={{ color: '#E18E2A' }} />
            <div>
              <div className="text-xs font-medium" style={{ color: '#5E5A58' }}>
                Monitors
              </div>
              <div className="text-sm font-semibold" style={{ color: '#33302F' }}>
                + Add Monitor
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
