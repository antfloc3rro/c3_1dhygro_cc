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
 * Enhanced Header component following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Components (left to right):
 * 1. C3RRO Logo (clickable, navigate to project list)
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
  const [projectName, setProjectName] = useState('Untitled Project')

  const currentCaseId = useAppStore((state) => state.project.currentCaseId)
  const simulationStatus = useAppStore((state) => state.simulation.status)
  const simulationProgress = useAppStore((state) => state.simulation.progress)
  const { canUndo, canRedo, undo, redo, openModal, setSimulationStatus } = useAppStore(
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
          className="text-lg font-bold font-heading hover:opacity-80 transition-opacity"
          style={{ color: '#4AB79F' }}
          onClick={() => console.log('Navigate to project list')}
        >
          WUFI Cloud
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-greylight" />

        {/* Project Name (editable) */}
        <div className="min-w-[150px]">
          {isEditingProject ? (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
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
              {projectName}
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
