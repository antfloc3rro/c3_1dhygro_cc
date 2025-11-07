import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { AppState, UIState, AssemblyState, MaterialState, ClimateState, SimulationState, ProjectState, HistoryState } from './types'
import { Layer, Monitor, Surface, Project } from '@/types/index'
import {
  DEFAULT_PROJECT_NAME,
  DEFAULT_CASE_NAME,
  DEFAULT_START_DATE,
  DEFAULT_DURATION,
  DEFAULT_TIME_STEP,
  DEFAULT_DIRECTION,
  DEFAULT_INCLINATION,
  DEFAULT_INCREASED_ACCURACY,
  DEFAULT_ADAPTIVE_TIME_STEP,
  DEFAULT_GRID_DISCRETIZATION,
  DEFAULT_UNIT_SYSTEM,
  DEFAULT_THEME,
} from '@/constants/defaults'

// Initial states
const initialUIState: UIState = {
  selectedCaseId: null,
  selectedLayerId: null,
  selectedSurfaceId: null,
  selectedMonitorId: null,
  openModal: null,
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  expandedSections: {
    component: true,
    assembly: true,
    orientation: true,
    surfaces: false,
    climate: false,
    control: false,
  },
  modalPreferences: {
    materialDatabase: {
      selectedCategory: null,
      selectedSubcategory: null,
      searchQuery: '',
    },
    climateSelection: {
      activeTab: 'presets',
      searchQuery: '',
      selectedLocation: null,
      uploadedFileName: null,
    },
  },
  mainLayoutSelectedTab: 0,
  statusBarExpanded: false,
  theme: DEFAULT_THEME,
}

const initialAssemblyState: AssemblyState = {
  layers: [],
  surfaces: {
    exterior: {
      id: 'surface_exterior',
      name: 'Exterior Surface',
      type: 'exterior',
      coefficientMode: 'standard',
      coefficients: {
        heatTransferCoefficient: 25.0, // Standard exterior
        shortWaveRadiationAbsorptivity: 0.6,
        longWaveRadiationEmissivity: 0.9,
        rainAbsorptionFactor: 0.7,
      },
    },
    interior: {
      id: 'surface_interior',
      name: 'Interior Surface',
      type: 'interior',
      coefficientMode: 'standard',
      coefficients: {
        heatTransferCoefficient: 8.0, // Standard interior
        shortWaveRadiationAbsorptivity: 0.6,
        longWaveRadiationEmissivity: 0.9,
      },
    },
  },
  monitors: [],
  totalThickness: 0,
  uValue: null,
}

const initialMaterialState: MaterialState = {
  searchQuery: '',
  selectedCategory: null,
  selectedManufacturer: null,
  sortBy: 'name',
  sortOrder: 'asc',
}

const initialClimateState: ClimateState = {
  selectedAssetId: null,
  selectedTab: 'weather-stations',
  uploadedFileName: null,
  activeSide: 'exterior',
  exterior: null,
  interior: null,
  climate: null, // Deprecated: keeping for backward compatibility
}

const initialSimulationState: SimulationState = {
  status: 'idle',
  progress: 0,
  simulationId: null,
  error: null,
  startTime: null,
  endTime: null,
}

const initialProjectState: ProjectState = {
  currentProject: null,
  currentCaseId: 'case1',
  cases: [
    {
      id: 'case1',
      name: DEFAULT_CASE_NAME,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  projectInfo: {
    name: DEFAULT_PROJECT_NAME,
    clientName: '',
    projectNumber: '',
    description: '',
    createdDate: new Date().toISOString(),
  },
  orientation: {
    direction: DEFAULT_DIRECTION,
    inclination: DEFAULT_INCLINATION,
  },
  calculationPeriod: {
    startDate: DEFAULT_START_DATE(),
    duration: DEFAULT_DURATION,
    timeStep: DEFAULT_TIME_STEP,
  },
  advancedSettings: {
    increasedAccuracy: DEFAULT_INCREASED_ACCURACY,
    adaptiveTimeStep: DEFAULT_ADAPTIVE_TIME_STEP,
    gridDiscretization: DEFAULT_GRID_DISCRETIZATION,
  },
  displaySettings: {
    unitSystem: DEFAULT_UNIT_SYSTEM,
  },
}

const initialHistoryState: HistoryState = {
  past: [],
  future: [],
  maxSteps: 20,
}

// Create the store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        ui: initialUIState,
        assembly: initialAssemblyState,
        material: initialMaterialState,
        climate: initialClimateState,
        simulation: initialSimulationState,
        project: initialProjectState,
        history: initialHistoryState,

        // Actions
        actions: {
          // UI actions
          selectCase: (caseId) => set((state) => { state.ui.selectedCaseId = caseId }),
          selectLayer: (layerId) => set((state) => { state.ui.selectedLayerId = layerId }),
          selectSurface: (surfaceId) => set((state) => { state.ui.selectedSurfaceId = surfaceId }),
          selectMonitor: (monitorId) => set((state) => { state.ui.selectedMonitorId = monitorId }),
          openModal: (modalId) => set((state) => { state.ui.openModal = modalId }),
          closeModal: () => set((state) => { state.ui.openModal = null }),
          toggleLeftPanel: () => set((state) => { state.ui.leftPanelCollapsed = !state.ui.leftPanelCollapsed }),
          toggleRightPanel: () => set((state) => { state.ui.rightPanelCollapsed = !state.ui.rightPanelCollapsed }),
          toggleSection: (section) => set((state) => {
            state.ui.expandedSections[section] = !state.ui.expandedSections[section]
          }),

          // Modal preference actions
          setMaterialDatabasePreferences: (updates) => set((state) => {
            Object.assign(state.ui.modalPreferences.materialDatabase, updates)
          }),
          setClimateSelectionPreferences: (updates) => set((state) => {
            Object.assign(state.ui.modalPreferences.climateSelection, updates)
          }),

          // Layout preference actions
          setMainLayoutTab: (tabIndex) => set((state) => {
            state.ui.mainLayoutSelectedTab = tabIndex
          }),
          setStatusBarExpanded: (expanded) => set((state) => {
            state.ui.statusBarExpanded = expanded
          }),

          // Assembly actions
          addLayer: (layer) => set((state) => {
            state.assembly.layers.push(layer)
            // Recalculate total thickness
            state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
            // Push to history
            state.history.past.push({
              type: 'addLayer',
              data: { layer },
              timestamp: Date.now(),
            })
            if (state.history.past.length > state.history.maxSteps) {
              state.history.past.shift()
            }
            state.history.future = []
          }),

          updateLayer: (layerId, updates) => set((state) => {
            const index = state.assembly.layers.findIndex(l => l.id === layerId)
            if (index !== -1) {
              const oldLayer = { ...state.assembly.layers[index] }
              Object.assign(state.assembly.layers[index], updates)
              // Recalculate total thickness if thickness changed
              if (updates.thickness !== undefined) {
                state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
              }
              // Push to history
              state.history.past.push({
                type: 'updateLayer',
                data: { layerId, oldLayer, updates },
                timestamp: Date.now(),
              })
              if (state.history.past.length > state.history.maxSteps) {
                state.history.past.shift()
              }
              state.history.future = []
            }
          }),

          deleteLayer: (layerId) => set((state) => {
            const index = state.assembly.layers.findIndex(l => l.id === layerId)
            if (index !== -1) {
              const layer = state.assembly.layers[index]
              state.assembly.layers.splice(index, 1)
              // Recalculate total thickness
              state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
              // Push to history
              state.history.past.push({
                type: 'deleteLayer',
                data: { layer, index },
                timestamp: Date.now(),
              })
              if (state.history.past.length > state.history.maxSteps) {
                state.history.past.shift()
              }
              state.history.future = []
            }
          }),

          reorderLayers: (fromIndex, toIndex) => set((state) => {
            const [movedLayer] = state.assembly.layers.splice(fromIndex, 1)
            state.assembly.layers.splice(toIndex, 0, movedLayer)
            // Push to history
            state.history.past.push({
              type: 'reorderLayers',
              data: { fromIndex, toIndex },
              timestamp: Date.now(),
            })
            if (state.history.past.length > state.history.maxSteps) {
              state.history.past.shift()
            }
            state.history.future = []
          }),

          duplicateLayer: (layerId) => set((state) => {
            const layer = state.assembly.layers.find(l => l.id === layerId)
            if (layer) {
              const newLayer: Layer = {
                ...layer,
                id: `layer_${Date.now()}`,
                name: `${layer.name} (Copy)`,
              }
              state.assembly.layers.push(newLayer)
              // Recalculate total thickness
              state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
              // Push to history
              state.history.past.push({
                type: 'duplicateLayer',
                data: { layerId, newLayer },
                timestamp: Date.now(),
              })
              if (state.history.past.length > state.history.maxSteps) {
                state.history.past.shift()
              }
              state.history.future = []
            }
          }),

          // Surface actions
          updateSurface: (side, updates) => set((state) => {
            Object.assign(state.assembly.surfaces[side], updates)
          }),

          // Monitor actions
          addMonitor: (monitor) => set((state) => {
            state.assembly.monitors.push(monitor)
            // Push to history
            state.history.past.push({
              type: 'addMonitor',
              data: { monitor },
              timestamp: Date.now(),
            })
            if (state.history.past.length > state.history.maxSteps) {
              state.history.past.shift()
            }
            state.history.future = []
          }),

          updateMonitor: (monitorId, updates) => set((state) => {
            const index = state.assembly.monitors.findIndex(m => m.id === monitorId)
            if (index !== -1) {
              Object.assign(state.assembly.monitors[index], updates)
            }
          }),

          deleteMonitor: (monitorId) => set((state) => {
            const index = state.assembly.monitors.findIndex(m => m.id === monitorId)
            if (index !== -1) {
              const monitor = state.assembly.monitors[index]
              state.assembly.monitors.splice(index, 1)
              // Push to history
              state.history.past.push({
                type: 'deleteMonitor',
                data: { monitor, index },
                timestamp: Date.now(),
              })
              if (state.history.past.length > state.history.maxSteps) {
                state.history.past.shift()
              }
              state.history.future = []
            }
          }),

          // Material actions
          setMaterialSearch: (query) => set((state) => { state.material.searchQuery = query }),
          setMaterialCategory: (category) => set((state) => { state.material.selectedCategory = category }),
          setMaterialManufacturer: (manufacturer) => set((state) => { state.material.selectedManufacturer = manufacturer }),
          setMaterialSort: (sortBy, sortOrder) => set((state) => {
            state.material.sortBy = sortBy
            state.material.sortOrder = sortOrder
          }),

          // Climate actions
          setClimateAsset: (assetId) => set((state) => { state.climate.selectedAssetId = assetId }),
          setClimateTab: (tab) => set((state) => { state.climate.selectedTab = tab }),
          setClimateUploadedFile: (fileName) => set((state) => { state.climate.uploadedFileName = fileName }),
          setClimate: (climate) => set((state) => {
            state.climate.climate = climate
            // Also set as exterior for backward compatibility
            state.climate.exterior = climate
          }),
          setClimateActiveSide: (side) => set((state) => { state.climate.activeSide = side }),
          setExteriorClimate: (climate) => set((state) => {
            state.climate.exterior = climate
            state.climate.climate = climate // Keep deprecated field in sync
          }),
          setInteriorClimate: (climate) => set((state) => { state.climate.interior = climate }),

          // Simulation actions
          setSimulationStatus: (status) => set((state) => { state.simulation.status = status }),
          setSimulationProgress: (progress) => set((state) => { state.simulation.progress = progress }),
          setSimulationId: (id) => set((state) => { state.simulation.simulationId = id }),
          setSimulationError: (error) => set((state) => { state.simulation.error = error }),

          // Project actions
          setProject: (project) => set((state) => { state.project.currentProject = project }),
          setCase: (caseId) => set((state) => { state.project.currentCaseId = caseId }),
          addCase: (caseData) => set((state) => {
            const newCase = {
              id: `case_${Date.now()}`,
              name: caseData.name,
              status: caseData.status || 'draft' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            state.project.cases.push(newCase)
            state.project.currentCaseId = newCase.id
          }),
          updateCase: (caseId, updates) => set((state) => {
            const caseIndex = state.project.cases.findIndex(c => c.id === caseId)
            if (caseIndex !== -1) {
              Object.assign(state.project.cases[caseIndex], updates)
              state.project.cases[caseIndex].updatedAt = new Date().toISOString()
            }
          }),
          duplicateCase: (caseId) => set((state) => {
            const originalCase = state.project.cases.find(c => c.id === caseId)
            if (originalCase) {
              const newCase = {
                ...originalCase,
                id: `case_${Date.now()}`,
                name: `${originalCase.name} (Copy)`,
                status: 'draft' as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
              state.project.cases.push(newCase)
              state.project.currentCaseId = newCase.id
            }
          }),

          // Project settings actions
          updateProjectInfo: (updates) => set((state) => {
            Object.assign(state.project.projectInfo, updates)
          }),
          updateOrientation: (updates) => set((state) => {
            Object.assign(state.project.orientation, updates)
          }),
          updateCalculationPeriod: (updates) => set((state) => {
            Object.assign(state.project.calculationPeriod, updates)
          }),
          updateAdvancedSettings: (updates) => set((state) => {
            Object.assign(state.project.advancedSettings, updates)
          }),
          updateDisplaySettings: (updates) => set((state) => {
            Object.assign(state.project.displaySettings, updates)
          }),

          // History actions
          undo: () => set((state) => {
            if (state.history.past.length === 0) return

            const snapshot = state.history.past.pop()!
            state.history.future.unshift(snapshot)

            // Apply undo logic based on snapshot type
            switch (snapshot.type) {
              case 'addLayer':
                {
                  const { layer } = snapshot.data
                  const index = state.assembly.layers.findIndex(l => l.id === layer.id)
                  if (index !== -1) {
                    state.assembly.layers.splice(index, 1)
                    state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
                  }
                }
                break
              case 'deleteLayer':
                {
                  const { layer, index } = snapshot.data
                  state.assembly.layers.splice(index, 0, layer)
                  state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
                }
                break
              case 'updateLayer':
                {
                  const { layerId, oldLayer } = snapshot.data
                  const index = state.assembly.layers.findIndex(l => l.id === layerId)
                  if (index !== -1) {
                    state.assembly.layers[index] = oldLayer
                    state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
                  }
                }
                break
              case 'reorderLayers':
                {
                  const { fromIndex, toIndex } = snapshot.data
                  const [movedLayer] = state.assembly.layers.splice(toIndex, 1)
                  state.assembly.layers.splice(fromIndex, 0, movedLayer)
                }
                break
              case 'addMonitor':
                {
                  const { monitor } = snapshot.data
                  const index = state.assembly.monitors.findIndex(m => m.id === monitor.id)
                  if (index !== -1) {
                    state.assembly.monitors.splice(index, 1)
                  }
                }
                break
              case 'deleteMonitor':
                {
                  const { monitor, index } = snapshot.data
                  state.assembly.monitors.splice(index, 0, monitor)
                }
                break
            }
          }),

          redo: () => set((state) => {
            if (state.history.future.length === 0) return

            const snapshot = state.history.future.shift()!
            state.history.past.push(snapshot)

            // Apply redo logic
            switch (snapshot.type) {
              case 'addLayer':
                {
                  const { layer } = snapshot.data
                  state.assembly.layers.push(layer)
                  state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
                }
                break
              case 'deleteLayer':
                {
                  const { layer } = snapshot.data
                  const index = state.assembly.layers.findIndex(l => l.id === layer.id)
                  if (index !== -1) {
                    state.assembly.layers.splice(index, 1)
                    state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
                  }
                }
                break
              case 'updateLayer':
                {
                  const { layerId, updates } = snapshot.data
                  const index = state.assembly.layers.findIndex(l => l.id === layerId)
                  if (index !== -1) {
                    Object.assign(state.assembly.layers[index], updates)
                    state.assembly.totalThickness = state.assembly.layers.reduce((sum, l) => sum + l.thickness, 0)
                  }
                }
                break
              case 'reorderLayers':
                {
                  const { fromIndex, toIndex } = snapshot.data
                  const [movedLayer] = state.assembly.layers.splice(fromIndex, 1)
                  state.assembly.layers.splice(toIndex, 0, movedLayer)
                }
                break
              case 'addMonitor':
                {
                  const { monitor } = snapshot.data
                  state.assembly.monitors.push(monitor)
                }
                break
              case 'deleteMonitor':
                {
                  const { monitor } = snapshot.data
                  const index = state.assembly.monitors.findIndex(m => m.id === monitor.id)
                  if (index !== -1) {
                    state.assembly.monitors.splice(index, 1)
                  }
                }
                break
            }
          }),

          pushHistory: (snapshot) => set((state) => {
            state.history.past.push(snapshot)
            if (state.history.past.length > state.history.maxSteps) {
              state.history.past.shift()
            }
            state.history.future = []
          }),

          canUndo: () => get().history.past.length > 0,
          canRedo: () => get().history.future.length > 0,
        },
      })),
      {
        name: 'wufi-cloud-storage',
        partialize: (state) => ({
          // Only persist UI preferences, not full project data
          ui: {
            leftPanelCollapsed: state.ui.leftPanelCollapsed,
            rightPanelCollapsed: state.ui.rightPanelCollapsed,
            expandedSections: state.ui.expandedSections,
            modalPreferences: state.ui.modalPreferences,
            mainLayoutSelectedTab: state.ui.mainLayoutSelectedTab,
            statusBarExpanded: state.ui.statusBarExpanded,
            theme: state.ui.theme,
          },
        }),
        merge: (persistedState: any, currentState: AppState) => {
          // Deep merge persisted state with initial state to handle new fields
          return {
            ...currentState,
            ui: {
              ...currentState.ui,
              ...(persistedState?.ui || {}),
              // Ensure modalPreferences always exists
              modalPreferences: {
                materialDatabase: {
                  ...currentState.ui.modalPreferences.materialDatabase,
                  ...(persistedState?.ui?.modalPreferences?.materialDatabase || {}),
                },
                climateSelection: {
                  ...currentState.ui.modalPreferences.climateSelection,
                  ...(persistedState?.ui?.modalPreferences?.climateSelection || {}),
                },
              },
              // Ensure expandedSections always exists
              expandedSections: {
                ...currentState.ui.expandedSections,
                ...(persistedState?.ui?.expandedSections || {}),
              },
            },
          }
        },
      }
    )
  )
)
