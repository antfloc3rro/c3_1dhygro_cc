import { useState, useCallback } from 'react'
import { UIState, PanelSection } from '@types/index'

const initialUIState: UIState = {
  selectedCaseId: null,
  selectedLayerId: null,
  selectedSurfaceId: null,
  selectedMonitorId: null,
  openModal: null,
  expandedPanelSections: {
    component: true,
    assembly: true,
    orientation: true,
    surfaces: false,
    climate: false,
    control: false,
  },
}

/**
 * Global UI state hook
 * Manages selected items and modal visibility
 */
export function useUIState() {
  const [state, setState] = useState<UIState>(initialUIState)

  const selectCase = useCallback((caseId: string | null) => {
    setState((prev) => ({ ...prev, selectedCaseId: caseId }))
  }, [])

  const selectLayer = useCallback((layerId: string | null) => {
    setState((prev) => ({ ...prev, selectedLayerId: layerId }))
  }, [])

  const selectSurface = useCallback((surfaceId: string | null) => {
    setState((prev) => ({ ...prev, selectedSurfaceId: surfaceId }))
  }, [])

  const selectMonitor = useCallback((monitorId: string | null) => {
    setState((prev) => ({ ...prev, selectedMonitorId: monitorId }))
  }, [])

  const openModal = useCallback((modalName: string | null) => {
    setState((prev) => ({ ...prev, openModal: modalName }))
  }, [])

  const togglePanelSection = useCallback((section: PanelSection) => {
    setState((prev) => ({
      ...prev,
      expandedPanelSections: {
        ...prev.expandedPanelSections,
        [section]: !prev.expandedPanelSections[section],
      },
    }))
  }, [])

  const expandPanelSection = useCallback((section: PanelSection) => {
    setState((prev) => ({
      ...prev,
      expandedPanelSections: {
        ...prev.expandedPanelSections,
        [section]: true,
      },
    }))
  }, [])

  const collapsePanelSection = useCallback((section: PanelSection) => {
    setState((prev) => ({
      ...prev,
      expandedPanelSections: {
        ...prev.expandedPanelSections,
        [section]: false,
      },
    }))
  }, [])

  return {
    state,
    selectCase,
    selectLayer,
    selectSurface,
    selectMonitor,
    openModal,
    togglePanelSection,
    expandPanelSection,
    collapsePanelSection,
  }
}

/**
 * Hook for managing local form state
 */
export function useFormState<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  const updateField = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }))
      setIsDirty(true)
      // Clear error for this field
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[String(key)]
        return newErrors
      })
    },
    []
  )

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsDirty(false)
  }, [initialValues])

  return {
    values,
    errors,
    isDirty,
    updateField,
    setFieldError,
    reset,
  }
}

/**
 * Hook for managing async operations (loading, error, data)
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      setStatus('error')
      throw error
    }
  }, [asyncFunction])

  // Execute immediately if requested
  if (immediate && status === 'idle') {
    execute()
  }

  return { status, data, error, execute }
}
