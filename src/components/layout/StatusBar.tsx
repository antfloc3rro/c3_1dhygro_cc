import React from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/index'
import { Spinner } from '@/components/ui/Spinner'
import { useAppStore } from '@/store/index'

interface Issue {
  id: string
  severity: 'error' | 'warning' | 'info'
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export interface StatusBarProps {
  status: 'ready' | 'warning' | 'error' | 'running' | 'completed'
  message: string
  stats?: {
    label: string
    value: string | number
  }[]
  issues?: Issue[]
  progress?: number
}

/**
 * StatusBar component following WUFI Cloud UI/UX v2.1 Part 2 specification
 *
 * Features:
 * - Always-visible simulation readiness indicator
 * - Shows overall state, issues, and quick statistics
 * - Expandable to show issues list (click to toggle)
 * - Smooth slide-down animation (300ms ease-out)
 *
 * Status States:
 * - Ready: Green background, check icon
 * - Warning: Orange background, alert triangle icon
 * - Error: Red background, alert circle icon
 * - Running: Blue background, spinner animation
 * - Completed: Green background, check icon with background
 *
 * Specifications:
 * - Height: 48px (expandable to ~200px)
 * - Padding: 12px 24px
 * - Border-bottom: 1px solid greylight
 * - Font: Lato, 0.875rem for message, 0.75rem for stats
 * - Animation: 300ms ease-out when expanding
 * - Issue list: Max-height 200px, scrollable
 */
export function StatusBar({
  status,
  message,
  stats = [],
  issues = [],
  progress,
}: StatusBarProps) {
  // Use store for persistent expanded state
  const isExpanded = useAppStore((state) => state.ui.statusBarExpanded)
  const setIsExpanded = useAppStore((state) => state.actions.setStatusBarExpanded)

  const statusConfig = {
    ready: {
      icon: CheckCircle,
      iconColor: '#3E7263',
      backgroundColor: 'rgba(62, 114, 99, 0.15)',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: '#E18E2A',
      backgroundColor: 'rgba(225, 142, 42, 0.15)',
    },
    error: {
      icon: AlertCircle,
      iconColor: '#C04343',
      backgroundColor: 'rgba(192, 67, 67, 0.15)',
    },
    running: {
      icon: Spinner,
      iconColor: '#4597BF',
      backgroundColor: 'rgba(69, 151, 191, 0.15)',
    },
    completed: {
      icon: CheckCircle,
      iconColor: '#3E7263',
      backgroundColor: 'rgba(62, 114, 99, 0.15)',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon
  const hasIssues = issues.length > 0

  return (
    <div
      className="border-b border-neutral-200 transition-all duration-300 ease-out"
      style={{ backgroundColor: config.backgroundColor }}
    >
      {/* Main status bar (always visible) */}
      <button
        className="w-full flex items-center justify-between px-6 py-3 cursor-pointer hover:brightness-95 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Left side: Icon + Message */}
        <div className="flex items-center gap-3">
          {status === 'running' ? (
            <Spinner size="sm" color="blue" />
          ) : (
            <Icon className="w-5 h-5 flex-shrink-0" style={{ color: config.iconColor }} />
          )}
          <span className="text-sm font-medium" style={{ color: '#33302F' }}>
            {message}
            {status === 'running' && progress !== undefined && ` (${progress}%)`}
          </span>
        </div>

        {/* Right side: Stats + Expand arrow */}
        <div className="flex items-center gap-4">
          {stats.length > 0 && (
            <div className="flex items-center gap-3 text-xs" style={{ color: '#5E5A58' }}>
              {stats.map((stat, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>•</span>}
                  <span>
                    {stat.label}: <span className="font-semibold">{stat.value}</span>
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}

          {hasIssues && (
            <ChevronDown
              className={cn(
                'w-4 h-4 flex-shrink-0 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
              style={{ color: '#BDB2AA' }}
            />
          )}
        </div>
      </button>

      {/* Expanded issues list */}
      {isExpanded && hasIssues && (
        <div className="px-6 pb-3 animate-slide-in-down">
          <div
            className="border-t border-neutral-300 pt-3 max-h-[200px] overflow-y-auto space-y-2"
          >
            {issues.map((issue) => (
              <IssueItem key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Individual issue item
 */
function IssueItem({ issue }: { issue: Issue }) {
  const severityConfig = {
    error: {
      icon: AlertCircle,
      iconColor: '#C04343',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: '#E18E2A',
    },
    info: {
      icon: AlertCircle,
      iconColor: '#4597BF',
    },
  }

  const config = severityConfig[issue.severity]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-2 py-2 px-3 bg-white rounded border border-neutral-200">
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: config.iconColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ color: '#33302F' }}>
          {issue.message}
        </p>
      </div>
      {issue.action && (
        <button
          className="text-xs font-medium whitespace-nowrap hover:underline"
          style={{ color: '#4AB79F' }}
          onClick={issue.action.onClick}
        >
          {issue.action.label}
        </button>
      )}
    </div>
  )
}
