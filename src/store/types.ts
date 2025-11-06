import { Layer, Surface, Monitor, Case, Project, Assembly } from '@/types/index'

// UI State
export interface UIState {
  // Selected elements
  selectedCaseId: string | null
  selectedLayerId: string | null
  selectedSurfaceId: string | null
  selectedMonitorId: string | null

  // Modal visibility
  openModal: string | null

  // Panel state
  leftPanelCollapsed: boolean
  rightPanelCollapsed: boolean

  // Expanded sections
  expandedSections: {
    component: boolean
    assembly: boolean
    orientation: boolean
    surfaces: boolean
    climate: boolean
    control: boolean
  }

  // Theme (future)
  theme: 'light' | 'dark'
}

// Assembly State
export interface AssemblyState {
  layers: Layer[]
  surfaces: {
    exterior: Surface
    interior: Surface
  }
  monitors: Monitor[]
  totalThickness: number // calculated
  uValue: number | null // calculated
}

// Material State (for material database modal)
export interface MaterialState {
  searchQuery: string
  selectedCategory: string | null
  selectedManufacturer: string | null
  sortBy: 'name' | 'category' | 'manufacturer'
  sortOrder: 'asc' | 'desc'
}

// Climate State
export interface ClimateState {
  selectedAssetId: string | null
  selectedTab: 'weather-stations' | 'standard-conditions' | 'sine-curves' | 'upload-file'
  uploadedFileName: string | null
  climate: {
    type: string
    name: string
    source: string
  } | null
}

// Simulation State
export interface SimulationState {
  status: 'idle' | 'validating' | 'queued' | 'running' | 'completed' | 'error'
  progress: number
  simulationId: string | null
  error: string | null
  startTime: Date | null
  endTime: Date | null
}

// Project State
export interface ProjectState {
  currentProject: Project | null
  currentCaseId: string | null
}

// History State (Undo/Redo)
export interface HistorySnapshot {
  type: string
  data: any
  timestamp: number
}

export interface HistoryState {
  past: HistorySnapshot[]
  future: HistorySnapshot[]
  maxSteps: number
}

// Root Store State
export interface AppState {
  // State slices
  ui: UIState
  assembly: AssemblyState
  material: MaterialState
  climate: ClimateState
  simulation: SimulationState
  project: ProjectState
  history: HistoryState

  // Actions
  actions: AppActions
}

// Actions interface
export interface AppActions {
  // UI actions
  selectCase: (caseId: string | null) => void
  selectLayer: (layerId: string | null) => void
  selectSurface: (surfaceId: string | null) => void
  selectMonitor: (monitorId: string | null) => void
  openModal: (modalId: string | null) => void
  closeModal: () => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  toggleSection: (section: keyof UIState['expandedSections']) => void

  // Assembly actions
  addLayer: (layer: Layer) => void
  updateLayer: (layerId: string, updates: Partial<Layer>) => void
  deleteLayer: (layerId: string) => void
  reorderLayers: (fromIndex: number, toIndex: number) => void
  duplicateLayer: (layerId: string) => void

  // Surface actions
  updateSurface: (side: 'exterior' | 'interior', updates: Partial<Surface>) => void

  // Monitor actions
  addMonitor: (monitor: Monitor) => void
  updateMonitor: (monitorId: string, updates: Partial<Monitor>) => void
  deleteMonitor: (monitorId: string) => void

  // Material actions
  setMaterialSearch: (query: string) => void
  setMaterialCategory: (category: string | null) => void
  setMaterialManufacturer: (manufacturer: string | null) => void
  setMaterialSort: (sortBy: MaterialState['sortBy'], sortOrder: MaterialState['sortOrder']) => void

  // Climate actions
  setClimateAsset: (assetId: string | null) => void
  setClimateTab: (tab: ClimateState['selectedTab']) => void
  setClimateUploadedFile: (fileName: string | null) => void

  // Simulation actions
  setSimulationStatus: (status: SimulationState['status']) => void
  setSimulationProgress: (progress: number) => void
  setSimulationId: (id: string | null) => void
  setSimulationError: (error: string | null) => void

  // Project actions
  setProject: (project: Project) => void
  setCase: (caseId: string) => void
  duplicateCase: (caseId: string) => void

  // History actions
  undo: () => void
  redo: () => void
  pushHistory: (snapshot: HistorySnapshot) => void
  canUndo: () => boolean
  canRedo: () => boolean
}
