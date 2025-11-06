import React, { useState } from 'react'
import {
  Database,
  CornerUpLeft,
  CornerUpRight,
  Upload,
  Save,
  Play,
  ChevronDown,
  Check,
} from 'lucide-react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { cn } from '@/utils/index'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/store/index'

/**
 * Enhanced Header component for C3RRO Hygro 1D
 *
 * Components (left to right):
 * 1. C3RRO Logo + "Hygro 1D" (clickable, navigate to project list)
 * 2. Divider (vertical line)
 * 3. Project Name (inline editable)
 * 4. Case Selector (dropdown with case management)
 * 5. Spacer (flexible)
 * 6. Action Buttons:
 *    - Material Database (secondary, Database icon)
 *    - Undo (secondary, CornerUpLeft icon)
 *    - Redo (secondary, CornerUpRight icon, often disabled)
 *    - Import (secondary, Upload icon)
 *    - Save (secondary, Save icon)
 *    - Run Simulation (primary, Play icon)
 *
 * Specifications:
 * - Height: Auto (padding based)
 * - Padding: 12px horizontal
 * - Background: white
 * - Border-bottom: 1px solid greylight
 * - Action buttons: 36px height, 8px gap, icons 18px
 * - Font: Lato, 0.875rem, 600 (semibold)
 */
export function EnhancedHeader() {
  const [isEditingProject, setIsEditingProject] = useState(false)

  const projectInfo = useAppStore((state) => state.project.projectInfo)
  const currentCaseId = useAppStore((state) => state.project.currentCaseId)
  const simulationStatus = useAppStore((state) => state.simulation.status)
  const simulationProgress = useAppStore((state) => state.simulation.progress)
  const { canUndo, canRedo, undo, redo, openModal, setSimulationStatus, updateProjectInfo } = useAppStore(
    (state) => state.actions
  )

  // Mock cases data (would come from store in real app)
  const cases = [
    { id: 'case1', name: 'Base Case', status: 'ready' as const },
    { id: 'case2', name: 'With Insulation', status: 'draft' as const },
    { id: 'case3', name: 'Optimized', status: 'completed' as const },
  ]

  const selectedCase = cases.find((c) => c.id === currentCaseId) || cases[0]

  const handleRunSimulation = () => {
    if (simulationStatus === 'idle' || simulationStatus === 'completed') {
      setSimulationStatus('running')
      // Trigger simulation via API (would be handled by React Query mutation)
    }
  }

  const getSimulationButtonProps = () => {
    switch (simulationStatus) {
      case 'running':
        return {
          text: `Running... ${simulationProgress}%`,
          variant: 'primary' as const,
          icon: Play,
          loading: true,
          disabled: true,
        }
      case 'completed':
        return {
          text: 'View Results',
          variant: 'primary' as const,
          icon: Check,
          loading: false,
          disabled: false,
        }
      case 'error':
        return {
          text: 'Fix Errors to Run',
          variant: 'danger' as const,
          icon: Play,
          loading: false,
          disabled: true,
        }
      default:
        return {
          text: 'Run Simulation',
          variant: 'primary' as const,
          icon: Play,
          loading: false,
          disabled: false,
        }
    }
  }

  const simButtonProps = getSimulationButtonProps()

  return (
    <header className="bg-white border-b border-neutral-200 px-3 py-3">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <button
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={() => console.log('Navigate to project list')}
          title="C3RRO Hygro 1D"
        >
          <svg width="120" height="30" viewBox="0 0 285.4 70.48" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(0.13333333,0,0,-0.13333333,0,70.48)">
              <path fill="rgb(74, 183, 159)" d="m 488.145,238.398 c 23.867,-29.531 28.347,-67.644 12.011,-101.953 -13.73,-28.816 -38.789,-47.8786 -68.945,-53.3669 l -88.84,-0.207 -49.629,-0.1172 -36.258,-73.58202 c 55.332,0.11718 97.45,0.23437 156.844,0.35937 8.969,0.01172 17.676,0.70315 26.106,1.98435 135.769,6.2969 209.168,165.3714 122.343,272.8204 -16.621,20.566 -33.066,41.137 -49.218,61.703 l 84.199,172.066 h -17.617 -71.887 l -92.352,-187.421 23.243,-29.598 c 15.273,-19.449 31.628,-39.953 50,-62.688"/>
              <path fill="rgb(69, 151, 191)" d="m 160.703,27.0703 35.809,72.6875 c -19.746,9.1992 -37.957,21.8442 -53.653,37.9762 -34.5,35.469 -52.7613,82.305 -51.4059,131.903 2.6758,97.379 86.5549,176.609 186.9849,176.609 h 88.808 l 35.41,71.859 H 278.438 259.766 C 121.102,518.105 3.89453,409.395 0.0976563,270.785 -2.92969,160.305 64.5,65.2344 160.703,27.0703"/>
              <path fill="rgb(51, 48, 47)" d="m 1538.58,75.9766 C 1562.33,51.9922 1590.2,33.3203 1622.19,20 c 32,-13.32812 67.14,-20 105.43,-20 38.27,0 73.54,6.67188 105.77,20 32.23,13.3203 60.23,31.9922 83.98,55.9766 23.74,23.9961 42.17,52.1014 55.27,84.3364 13.07,32.238 19.62,67.257 19.62,105.058 0,37.813 -6.55,72.828 -19.62,105.07 -13.1,32.219 -31.64,60.098 -55.63,83.606 -8.18,8.008 -16.87,15.371 -26,22.176 l -39.34,-80.125 c 0.31,-0.332 0.67,-0.61 0.99,-0.942 15.5,-16.246 27.38,-35.386 35.63,-57.433 8.24,-22.063 12.35,-46.168 12.35,-72.352 0,-26.172 -4.24,-50.281 -12.71,-72.332 -8.49,-22.062 -20.49,-41.211 -36,-57.441 -15.5,-16.25 -33.8,-28.848 -54.88,-37.805 -21.08,-8.9727 -44.24,-13.4571 -69.43,-13.4571 -25.22,0 -48.35,4.4844 -69.44,13.4571 -21.08,8.957 -39.38,21.555 -54.89,37.805 -15.52,16.23 -27.52,35.379 -36,57.441 -8.48,22.051 -12.72,46.16 -12.72,72.332 0,26.184 4.24,50.289 12.72,72.352 8.48,22.047 20.48,41.187 36,57.433 15.51,16.231 33.81,28.832 54.89,37.809 21.09,8.965 44.47,13.445 70.16,13.445 14.53,0 28.29,-1.668 41.45,-4.648 l 37.44,75.965 c -25,7.218 -51.53,10.847 -79.61,10.847 -37.82,0 -72.71,-6.547 -104.71,-19.633 -31.98,-13.086 -59.97,-31.386 -83.97,-54.894 -23.98,-23.508 -42.52,-51.387 -55.62,-83.606 -13.08,-32.242 -19.64,-67.257 -19.64,-105.07 0,-37.801 6.56,-72.82 19.64,-105.058 13.1,-32.235 31.5,-60.3403 55.26,-84.3364"/>
              <path fill="rgb(51, 48, 47)" d="m 753.418,444.957 h 67.617 c 19.883,0 37.09,-3.266 51.633,-9.816 14.527,-6.536 25.926,-16.118 34.168,-28.715 8.23,-12.613 12.363,-28.117 12.363,-46.528 0,-17.937 -4.133,-33.332 -12.363,-46.168 -8.242,-12.855 -19.641,-22.539 -34.168,-29.085 -14.543,-6.54 -31.75,-9.821 -51.633,-9.821 h -67.617 z m 0,-241.383 h 52.977 L 934.465,10.9102 H 1038.44 L 894.48,212.91 c 9.551,2.824 18.684,6.203 27.266,10.305 27.375,13.086 48.574,31.492 63.613,55.254 15.011,23.734 22.531,51.367 22.531,82.879 0,31.992 -7.52,59.859 -22.531,83.609 -15.039,23.746 -36.238,42.172 -63.613,55.258 -27.402,13.086 -59.742,19.633 -97.058,19.633 h -71.27 -34.895 -50.886 V 10.9102 h 85.781 V 203.574"/>
              <path fill="rgb(51, 48, 47)" d="m 1165.15,444.957 h 67.61 c 19.89,0 37.09,-3.266 51.63,-9.816 14.54,-6.536 25.93,-16.118 34.17,-28.715 8.24,-12.613 12.37,-28.117 12.37,-46.528 0,-17.937 -4.13,-33.332 -12.37,-46.168 -8.24,-12.855 -19.63,-22.539 -34.17,-29.085 -14.54,-6.54 -31.74,-9.821 -51.63,-9.821 h -67.61 z m 0,-241.383 h 52.97 L 1346.18,10.9102 h 103.99 L 1306.21,212.91 c 9.55,2.824 18.68,6.203 27.27,10.305 27.37,13.086 48.57,31.492 63.61,55.254 15.01,23.734 22.53,51.367 22.53,82.879 0,31.992 -7.52,59.859 -22.53,83.609 -15.04,23.746 -36.24,42.172 -63.61,55.258 -27.41,13.086 -59.75,19.633 -97.06,19.633 h -71.27 -34.9 -50.89 V 10.9102 h 85.79 V 203.574"/>
            </g>
          </svg>
          <span className="text-sm font-semibold" style={{ color: '#33302F' }}>Hygro 1D</span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-greylight" />

        {/* Project Name (editable) */}
        <div className="min-w-[150px]">
          {isEditingProject ? (
            <input
              type="text"
              value={projectInfo.name}
              onChange={(e) => updateProjectInfo({ name: e.target.value })}
              onBlur={() => setIsEditingProject(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingProject(false)
              }}
              className="px-2 py-1 text-base font-semibold font-heading border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-bluegreen"
              style={{ color: '#33302F' }}
              autoFocus
            />
          ) : (
            <button
              className="px-2 py-1 text-base font-semibold font-heading hover:bg-neutral-100 rounded transition-colors"
              style={{ color: '#33302F' }}
              onClick={() => setIsEditingProject(true)}
            >
              {projectInfo.name}
            </button>
          )}
        </div>

        {/* Case Selector */}
        <Menu as="div" className="relative">
          <Menu.Button
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded border transition-all duration-200 hover:brightness-95"
            style={{
              backgroundColor: 'rgba(74, 183, 159, 0.15)',
              borderColor: '#4AB79F',
              color: '#33302F',
            }}
          >
            <span>Case: {selectedCase.name}</span>
            <ChevronDown className="w-4 h-4" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-neutral-200 focus:outline-none z-50">
              <div className="py-1 max-h-80 overflow-auto">
                {cases.map((caseItem) => (
                  <Menu.Item key={caseItem.id}>
                    {({ active }) => (
                      <button
                        className={cn(
                          'w-full px-4 py-3 text-left transition-colors',
                          active && 'bg-neutral-100'
                        )}
                        onClick={() => console.log('Select case:', caseItem.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-sm font-semibold font-heading"
                                style={{ color: '#33302F' }}
                              >
                                {caseItem.name}
                              </span>
                              {caseItem.id === selectedCase.id && (
                                <Check className="w-4 h-4" style={{ color: '#4AB79F' }} />
                              )}
                            </div>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  caseItem.status === 'completed'
                                    ? 'success'
                                    : caseItem.status === 'ready'
                                    ? 'primary'
                                    : 'neutral'
                                }
                                size="sm"
                              >
                                {caseItem.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
              <div className="border-t border-neutral-200 p-2">
                <Button
                  variant="primary"
                  size="small"
                  className="w-full"
                  onClick={() => console.log('Duplicate case')}
                >
                  + Duplicate Current Case
                </Button>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="default"
            icon={Database}
            onClick={() => openModal('material-database')}
          >
            Materials
          </Button>

          <Button
            variant="secondary"
            size="default"
            icon={CornerUpLeft}
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Cmd/Ctrl+Z)"
          />

          <Button
            variant="secondary"
            size="default"
            icon={CornerUpRight}
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Cmd/Ctrl+Shift+Z)"
          />

          <Button
            variant="secondary"
            size="default"
            icon={Upload}
            onClick={() => console.log('Import project')}
          >
            Import
          </Button>

          <Button
            variant="secondary"
            size="default"
            icon={Save}
            onClick={() => console.log('Manual save')}
            title="Save (Cmd/Ctrl+S)"
          >
            Save
          </Button>

          <Button
            variant={simButtonProps.variant}
            size="default"
            icon={simButtonProps.icon}
            onClick={handleRunSimulation}
            disabled={simButtonProps.disabled}
            loading={simButtonProps.loading}
          >
            {simButtonProps.text}
          </Button>
        </div>
      </div>
    </header>
  )
}
