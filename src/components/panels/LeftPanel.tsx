import React from 'react'
import { Folder, Compass, Cloud, Calendar, Settings, Eye } from 'lucide-react'
import { Collapsible } from '@/components/ui/Collapsible'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { NumberInput } from '@/components/ui/NumberInput'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/index'

/**
 * LeftPanel component following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Features:
 * - Width: 288px
 * - Background: white
 * - Border-right: 1px solid greylight
 * - All sections collapsible with localStorage persistence
 * - Overflow-y: auto
 *
 * Sections:
 * 1. Project Info (default collapsed)
 * 2. Orientation & Geometry (default collapsed)
 * 3. Climate (default EXPANDED - fundamental)
 * 4. Calculation Period (default collapsed)
 * 5. Advanced Settings (default collapsed)
 * 6. User Settings (default collapsed)
 */
export function LeftPanel() {
  const expandedSections = useAppStore((state) => state.ui.expandedSections)
  const { toggleSection } = useAppStore((state) => state.actions)

  return (
    <div className="w-72 bg-white border-r border-neutral-200 overflow-y-auto">
      {/* Section 1: Project Info */}
      <Collapsible
        title="Project"
        icon={Folder}
        summary="Untitled Project"
        expanded={expandedSections.component}
        onToggle={() => toggleSection('component')}
      >
        <div className="space-y-3">
          <Input
            label="Project Name"
            placeholder="Enter project name"
            defaultValue="Untitled Project"
          />
          <Input label="Client Name" placeholder="Client name (optional)" />
          <Input label="Project Number" placeholder="Project # (optional)" />
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#5E5A58' }}>
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-bluegreen"
              rows={3}
              placeholder="Project description (optional)"
              style={{ color: '#33302F' }}
            />
          </div>
          <p className="text-xs" style={{ color: '#5E5A58' }}>
            Created: {new Date().toLocaleDateString()}
          </p>
        </div>
      </Collapsible>

      {/* Section 2: Orientation & Geometry */}
      <Collapsible
        title="Orientation"
        icon={Compass}
        summary="North, 90°"
        expanded={expandedSections.orientation}
        onToggle={() => toggleSection('orientation')}
      >
        <div className="space-y-3">
          <Select
            label="Direction"
            value="north"
            onChange={(value) => console.log('Direction:', value)}
            options={directionOptions}
          />

          {/* Compass visualization placeholder */}
          <div className="flex justify-center py-2">
            <div
              className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: '#4AB79F', color: '#4AB79F' }}
            >
              <Compass className="w-8 h-8" />
            </div>
          </div>

          <NumberInput
            label="Inclination [°]"
            value={90}
            onChange={(value) => console.log('Inclination:', value)}
            min={0}
            max={180}
            decimals={1}
            unit="°"
            helperText="0° = horizontal (roof), 90° = vertical (wall)"
          />
        </div>
      </Collapsible>

      {/* Section 3: Climate (DEFAULT EXPANDED) */}
      <Collapsible
        title="Climate"
        icon={Cloud}
        summary="Nashville, TN | Indoor Standard"
        expanded={expandedSections.climate}
        onToggle={() => toggleSection('climate')}
      >
        <div className="space-y-3">
          {/* Exterior Climate Card */}
          <div className="border border-neutral-200 rounded-md p-3 bg-white">
            <p className="text-xs font-medium mb-2" style={{ color: '#5E5A58' }}>
              Exterior Climate
            </p>
            <div className="mb-2">
              <p className="text-sm font-bold" style={{ color: '#33302F' }}>
                No climate selected
              </p>
              <p className="text-xs" style={{ color: '#5E5A58' }}>
                Select an exterior climate
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => console.log('Open climate modal - exterior')}
            >
              Select Climate
            </Button>
          </div>

          {/* Interior Climate Card */}
          <div className="border border-neutral-200 rounded-md p-3 bg-white">
            <p className="text-xs font-medium mb-2" style={{ color: '#5E5A58' }}>
              Interior Climate
            </p>
            <div className="mb-2">
              <p className="text-sm font-bold" style={{ color: '#33302F' }}>
                No climate selected
              </p>
              <p className="text-xs" style={{ color: '#5E5A58' }}>
                Select an interior climate
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => console.log('Open climate modal - interior')}
            >
              Select Climate
            </Button>
          </div>
        </div>
      </Collapsible>

      {/* Section 4: Calculation Period */}
      <Collapsible
        title="Calculation Period"
        icon={Calendar}
        summary="Jan 1, 2024 - 1 year"
        expanded={expandedSections.control}
        onToggle={() => toggleSection('control')}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#5E5A58' }}>
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bluegreen"
              defaultValue="2024-01-01"
              style={{ color: '#33302F' }}
            />
          </div>

          <Select
            label="Duration"
            value="1year"
            onChange={(value) => console.log('Duration:', value)}
            options={durationOptions}
          />

          <Select
            label="Time Step"
            value="auto"
            onChange={(value) => console.log('Time Step:', value)}
            options={timeStepOptions}
            helperText="Smaller time steps increase accuracy but slow simulation"
          />
        </div>
      </Collapsible>

      {/* Section 5: Advanced Settings */}
      <Collapsible
        title="Advanced"
        icon={Settings}
        summary="Standard accuracy"
        expanded={expandedSections.surfaces}
        onToggle={() => toggleSection('surfaces')}
      >
        <div className="space-y-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-[18px] h-[18px] rounded border-neutral-300 text-bluegreen focus:ring-2 focus:ring-bluegreen"
              style={{ accentColor: '#4AB79F' }}
            />
            <div className="flex-1">
              <span className="text-sm font-medium" style={{ color: '#33302F' }}>
                Increased Accuracy
              </span>
              <p className="text-xs" style={{ color: '#5E5A58' }}>
                Use finer grid and stricter convergence
              </p>
              <p className="text-xs mt-1" style={{ color: '#E18E2A' }}>
                ⚠️ Increases simulation time by ~2-3x
              </p>
            </div>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="mt-0.5 w-[18px] h-[18px] rounded border-neutral-300 text-bluegreen focus:ring-2 focus:ring-bluegreen"
              style={{ accentColor: '#4AB79F' }}
            />
            <div className="flex-1">
              <span className="text-sm font-medium" style={{ color: '#33302F' }}>
                Adaptive Time Step
              </span>
              <p className="text-xs" style={{ color: '#5E5A58' }}>
                Automatically adjust time step for convergence
              </p>
            </div>
          </label>

          <Select
            label="Grid Discretization"
            value="auto2"
            onChange={(value) => console.log('Grid:', value)}
            options={gridDiscretizationOptions}
          />
        </div>
      </Collapsible>

      {/* Section 6: User Settings */}
      <Collapsible
        title="Display"
        icon={Eye}
        summary="SI units, Light theme"
        defaultExpanded={false}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5E5A58' }}>
              Unit System
            </label>
            <div className="space-y-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="units"
                  value="si"
                  defaultChecked
                  className="w-4 h-4 text-bluegreen focus:ring-2 focus:ring-bluegreen"
                  style={{ accentColor: '#4AB79F' }}
                />
                <span className="text-sm" style={{ color: '#33302F' }}>
                  SI (m, °C, W/m²K)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="units"
                  value="imperial"
                  className="w-4 h-4 text-bluegreen focus:ring-2 focus:ring-bluegreen"
                  style={{ accentColor: '#4AB79F' }}
                />
                <span className="text-sm" style={{ color: '#33302F' }}>
                  Imperial (ft, °F, Btu/ft²·h·°F)
                </span>
              </label>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  )
}

// Options for dropdowns
const directionOptions: SelectOption[] = [
  { value: 'north', label: 'North' },
  { value: 'ne', label: 'Northeast' },
  { value: 'east', label: 'East' },
  { value: 'se', label: 'Southeast' },
  { value: 'south', label: 'South' },
  { value: 'sw', label: 'Southwest' },
  { value: 'west', label: 'West' },
  { value: 'nw', label: 'Northwest' },
]

const durationOptions: SelectOption[] = [
  { value: '1year', label: '1 year' },
  { value: '3years', label: '3 years' },
  { value: '5years', label: '5 years' },
  { value: 'custom', label: 'Custom' },
]

const timeStepOptions: SelectOption[] = [
  { value: 'auto', label: 'Auto' },
  { value: '1hour', label: '1 hour' },
  { value: '30min', label: '30 minutes' },
  { value: '15min', label: '15 minutes' },
]

const gridDiscretizationOptions: SelectOption[] = [
  { value: 'auto2', label: 'Auto II (Recommended)' },
  { value: 'auto1', label: 'Auto I' },
  { value: 'user', label: 'User-defined' },
]
