# WUFI Cloud MVP - Complete Production Architecture v1.0

**Document Version:** 1.0  
**Date:** 2025-10-20  
**Status:** Production-Ready  
**Target:** 1D Hygrothermal Component Simulation (MVP)

---

## 1. Executive Summary

### 1.1 Technology Stack

```typescript
// Core
- React 18.3+ (Concurrent features, Suspense, Transitions)
- TypeScript 5.3+ (Strict mode, path aliases)
- Vite 5.0+ (Fast dev, optimized builds)

// State Management
- Zustand 4.4+ (Lightweight, no boilerplate)
- Immer (Immutable updates)
- React Query (TanStack Query v5) (Server state)

// Forms & Validation
- React Hook Form 7.48+ (Performant forms)
- Zod 3.22+ (Runtime validation + TS types)

// UI & Styling
- Tailwind CSS 3.4+ (Utility-first, design tokens)
- Headless UI 1.7+ (Accessible primitives)
- Lucide React 0.294+ (Icons)
- Recharts 2.10+ (Charts)

// API & Network
- Axios 1.6+ (HTTP client with interceptors)
- React Query (Caching, optimistic updates, polling)

// Build & Dev Tools
- Vite (Module bundler)
- ESLint + Prettier (Code quality)
- Vitest (Unit tests)
- React Testing Library (Component tests)
- Playwright (E2E tests)
```

### 1.2 Architecture Principles

1. **Feature-First Organization** - Group by domain, not by technical layer
2. **Type Safety** - Generate types from JSON schema, strict TypeScript
3. **Separation of Concerns** - UI ↔ State ↔ API clearly separated
4. **Performance-Conscious** - Code splitting, lazy loading, memoization
5. **Testability** - Pure functions, dependency injection, mock-friendly
6. **Scalability** - Easy to add features without refactoring core

---

## 2. Folder Structure

```
wufi-cloud/
├── public/                          # Static assets
│   ├── favicon.ico
│   └── design-system/               # Design system assets
│
├── src/
│   ├── api/                         # API Integration Layer
│   │   ├── client.ts                # Axios instance with interceptors
│   │   ├── endpoints/               # API endpoint definitions
│   │   │   ├── simulations.ts      # POST /simulations, GET /simulations/:id
│   │   │   ├── assets.ts            # GET /data/assets (materials, climate)
│   │   │   ├── catalogues.ts       # GET /data/catalogues
│   │   │   └── schemas.ts           # GET /schemas/*
│   │   ├── hooks/                   # React Query hooks
│   │   │   ├── useSimulations.ts   # useSimulation, useCreateSimulation, useRunSimulation
│   │   │   ├── useMaterials.ts     # useMaterials, useMaterialSearch
│   │   │   ├── useClimate.ts       # useClimateAssets
│   │   │   └── usePolling.ts       # useSimulationStatus (1s polling)
│   │   ├── transformers/            # API ↔ UI data transformation
│   │   │   ├── toAPI.ts             # UI state → JSON schema format
│   │   │   └── fromAPI.ts           # JSON schema → UI state
│   │   └── types/                   # API types
│   │       ├── generated.ts         # Auto-generated from schema.json
│   │       └── api.ts               # API response wrappers
│   │
│   ├── features/                    # Feature-based modules
│   │   ├── assembly/                # Layer management & visual editor
│   │   │   ├── components/
│   │   │   │   ├── AssemblyVisual.tsx        # Visual assembly component
│   │   │   │   ├── LayerRow.tsx              # Data table row
│   │   │   │   ├── DataTable.tsx             # Drag-drop table
│   │   │   │   ├── GridDiscretization.tsx    # Grid viz when toggled
│   │   │   │   └── PerformanceSummary.tsx    # U-value, thickness
│   │   │   ├── hooks/
│   │   │   │   ├── useAssembly.ts            # Assembly CRUD operations
│   │   │   │   ├── useLayerDrag.ts           # Drag-drop logic
│   │   │   │   ├── useLayerValidation.ts     # Real-time validation
│   │   │   │   └── useUValueCalculation.ts   # U-value calculation
│   │   │   ├── store/
│   │   │   │   └── assemblySlice.ts          # Zustand slice
│   │   │   └── types.ts
│   │   │
│   │   ├── materials/               # Material database & selection
│   │   │   ├── components/
│   │   │   │   ├── MaterialDatabaseModal.tsx # Main modal (1200px)
│   │   │   │   ├── MaterialTree.tsx          # Category tree (col 1)
│   │   │   │   ├── MaterialList.tsx          # Material table (col 2)
│   │   │   │   ├── MaterialPreview.tsx       # Properties (col 3)
│   │   │   │   └── HygrothermalFunctionsTab.tsx # Functions tab
│   │   │   ├── hooks/
│   │   │   │   ├── useMaterialSearch.ts      # Search & filter
│   │   │   │   ├── useMaterialSelection.ts   # Selection state
│   │   │   │   └── useVirtualScroll.ts       # Performance for 1000+ items
│   │   │   ├── store/
│   │   │   │   └── materialSlice.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── climate/                 # Climate selection
│   │   │   ├── components/
│   │   │   │   ├── ClimateModal.tsx          # Main modal (1100px)
│   │   │   │   ├── WeatherStationView.tsx    # Map + location search
│   │   │   │   ├── StandardConditionsView.tsx
│   │   │   │   ├── SineCurvesView.tsx
│   │   │   │   ├── UploadFileView.tsx
│   │   │   │   └── ClimateStatistics.tsx     # Right panel stats
│   │   │   ├── hooks/
│   │   │   │   ├── useClimateSelection.ts
│   │   │   │   └── useClimateUpload.ts
│   │   │   ├── store/
│   │   │   │   └── climateSlice.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── monitors/                # Monitor configuration
│   │   │   ├── components/
│   │   │   │   ├── MonitorConfigModal.tsx    # 600px modal
│   │   │   │   ├── MonitorIcon.tsx           # Target icon on visual
│   │   │   │   └── PositionSlider.tsx        # 0-100% slider
│   │   │   ├── hooks/
│   │   │   │   ├── useMonitors.ts
│   │   │   │   └── useMonitorPosition.ts
│   │   │   ├── store/
│   │   │   │   └── monitorSlice.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── surfaces/                # Surface coefficients
│   │   │   ├── components/
│   │   │   │   ├── SurfaceCoefficientsModal.tsx  # 700px modal
│   │   │   │   ├── StandardModeView.tsx          # Component dropdown
│   │   │   │   └── CustomModeView.tsx            # Manual inputs
│   │   │   ├── hooks/
│   │   │   │   └── useSurfaceCoefficients.ts
│   │   │   ├── store/
│   │   │   │   └── surfaceSlice.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── simulation/              # Simulation execution & status
│   │   │   ├── components/
│   │   │   │   ├── StatusBar.tsx             # Expandable status
│   │   │   │   ├── RunButton.tsx             # Primary action
│   │   │   │   └── SimulationProgress.tsx    # Progress indicator
│   │   │   ├── hooks/
│   │   │   │   ├── useSimulationRun.ts       # POST /simulations/:id/run
│   │   │   │   ├── useSimulationStatus.ts    # Polling (1s interval)
│   │   │   │   └── useSimulationValidation.ts
│   │   │   ├── store/
│   │   │   │   └── simulationSlice.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── project/                 # Project & case management
│   │   │   ├── components/
│   │   │   │   ├── ProjectHeader.tsx         # Logo, name, case selector
│   │   │   │   ├── CaseSelector.tsx          # Dropdown with status
│   │   │   │   └── CaseMenu.tsx              # Case list + duplicate
│   │   │   ├── hooks/
│   │   │   │   ├── useProject.ts
│   │   │   │   ├── useCase.ts
│   │   │   │   └── useAutoSave.ts            # 1s debounce
│   │   │   ├── store/
│   │   │   │   └── projectSlice.ts
│   │   │   └── types.ts
│   │   │
│   │   └── undo/                    # Undo/Redo system
│   │       ├── hooks/
│   │       │   └── useUndoRedo.ts            # 20 steps history
│   │       ├── store/
│   │       │   └── historySlice.ts
│   │       └── types.ts
│   │
│   ├── components/                  # Shared/reusable UI components
│   │   ├── ui/                      # Design system primitives
│   │   │   ├── Button.tsx           # Primary, Secondary, Danger variants
│   │   │   ├── Input.tsx            # Text, Number inputs
│   │   │   ├── Select.tsx           # Dropdown
│   │   │   ├── Modal.tsx            # Base modal component
│   │   │   ├── Tabs.tsx             # Tab navigation
│   │   │   ├── Card.tsx             # Card container
│   │   │   ├── Badge.tsx            # Status badges
│   │   │   ├── Toast.tsx            # Notifications
│   │   │   ├── Tooltip.tsx          # Hover tooltips
│   │   │   └── Spinner.tsx          # Loading indicator
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx           # App header
│   │   │   ├── StatusBar.tsx        # Global status
│   │   │   ├── LeftPanel.tsx        # Collapsible left panel
│   │   │   ├── CenterPanel.tsx      # Main work area
│   │   │   ├── RightPanel.tsx       # Inspector panel
│   │   │   └── TabNavigation.tsx    # Setup/Results tabs
│   │   └── forms/                   # Form components
│   │       ├── FormField.tsx        # Label + Input + Error
│   │       ├── NumberInput.tsx      # Validated number input
│   │       └── ValidationMessage.tsx
│   │
│   ├── hooks/                       # Shared custom hooks
│   │   ├── useDebounce.ts           # Debounce hook (1s for auto-save)
│   │   ├── useLocalStorage.ts       # Persist UI state
│   │   ├── useMediaQuery.ts         # Responsive breakpoints
│   │   ├── useKeyboardShortcuts.ts  # Global keyboard shortcuts
│   │   └── useClickOutside.ts       # Close modals on outside click
│   │
│   ├── store/                       # Global Zustand store
│   │   ├── index.ts                 # Store setup with persist middleware
│   │   ├── slices/                  # Individual store slices (imported by features)
│   │   └── types.ts                 # Store types
│   │
│   ├── tokens/                      # Design tokens (from design system)
│   │   ├── colors.ts                # Color palette
│   │   ├── typography.ts            # Font families, sizes, weights
│   │   ├── spacing.ts               # Spacing scale (xs, sm, md, lg, xl)
│   │   ├── shadows.ts               # Box shadows
│   │   ├── radius.ts                # Border radius
│   │   └── index.ts                 # Export all tokens
│   │
│   ├── types/                       # TypeScript types
│   │   ├── generated/               # Auto-generated from schema.json
│   │   │   └── schema.ts            # Zod schemas + TS types
│   │   ├── api.ts                   # API response types
│   │   ├── app.ts                   # App-specific types
│   │   └── index.ts                 # Re-exports
│   │
│   ├── utils/                       # Utility functions
│   │   ├── validation.ts            # Validation helpers
│   │   ├── formatting.ts            # Number, date formatters
│   │   ├── calculations.ts          # U-value, grid calculations
│   │   ├── units.ts                 # Unit conversions (SI)
│   │   └── constants.ts             # App constants
│   │
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   ├── vite-env.d.ts                # Vite types
│   └── index.css                    # Global styles + Tailwind imports
│
├── scripts/                         # Build scripts
│   └── generate-types.ts            # Generate types from schema.json
│
├── tests/                           # Test files
│   ├── unit/                        # Unit tests (Vitest)
│   ├── integration/                 # Integration tests (RTL)
│   └── e2e/                         # E2E tests (Playwright)
│
├── .env.example                     # Environment variables template
├── .eslintrc.json                   # ESLint config
├── .prettierrc                      # Prettier config
├── tailwind.config.js               # Tailwind config (design tokens)
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config
├── vitest.config.ts                 # Vitest config
├── playwright.config.ts             # Playwright config
├── package.json                     # Dependencies
└── README.md                        # Setup instructions
```

---

## 3. Data Flow Architecture

### 3.1 State Management Strategy

**Three-Layer State Model:**

```typescript
┌─────────────────────────────────────────────────────┐
│                   UI Components                     │
│  (React components, forms, modals, visualizations)  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              Application State (Zustand)            │
│  • Project state (current project, cases)           │
│  • Assembly state (layers, surfaces, monitors)      │
│  • UI state (selected element, modal visibility)    │
│  • History state (undo/redo stack - 20 steps)       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              Server State (React Query)             │
│  • Material database (cached, stale-while-revalidate)│
│  • Climate assets (cached)                          │
│  • Simulation status (polling every 1s)             │
│  • Project data (optimistic updates)                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│                   API Layer                         │
│  (Axios, transformers, error handling)              │
└─────────────────────────────────────────────────────┘
```

### 3.2 Zustand Store Structure

```typescript
// src/store/index.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  // Project slice
  project: ProjectState;
  
  // Assembly slice
  assembly: AssemblyState;
  
  // UI slice
  ui: UIState;
  
  // History slice (undo/redo)
  history: HistoryState;
  
  // Actions
  actions: {
    // Project actions
    setProject: (project: Project) => void;
    updateCase: (caseId: string, updates: Partial<Case>) => void;
    duplicateCase: (caseId: string) => void;
    
    // Assembly actions
    addLayer: (layer: Layer) => void;
    updateLayer: (layerId: string, updates: Partial<Layer>) => void;
    deleteLayer: (layerId: string) => void;
    reorderLayers: (fromIndex: number, toIndex: number) => void;
    
    // Monitor actions
    addMonitor: (monitor: Monitor) => void;
    updateMonitor: (monitorId: string, updates: Partial<Monitor>) => void;
    deleteMonitor: (monitorId: string) => void;
    
    // Surface actions
    updateSurface: (side: 'exterior' | 'interior', updates: Partial<Surface>) => void;
    
    // UI actions
    setSelectedElement: (element: SelectedElement | null) => void;
    openModal: (modalId: string) => void;
    closeModal: (modalId: string) => void;
    
    // History actions
    undo: () => void;
    redo: () => void;
    pushHistory: (state: HistorySnapshot) => void;
  };
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        project: initialProjectState,
        assembly: initialAssemblyState,
        ui: initialUIState,
        history: { past: [], future: [], maxSteps: 20 },
        
        // Actions implementation
        actions: {
          // ... (see detailed implementation below)
        }
      })),
      {
        name: 'wufi-cloud-storage',
        partialize: (state) => ({
          // Only persist UI preferences, not full project data
          ui: {
            leftPanelCollapsed: state.ui.leftPanelCollapsed,
            theme: state.ui.theme,
          }
        })
      }
    )
  )
);
```

### 3.3 React Query Configuration

```typescript
// src/api/client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys factory
export const queryKeys = {
  materials: {
    all: ['materials'] as const,
    list: (filters?: MaterialFilters) => ['materials', 'list', filters] as const,
    detail: (id: string) => ['materials', 'detail', id] as const,
    search: (query: string) => ['materials', 'search', query] as const,
  },
  climate: {
    all: ['climate'] as const,
    list: (filters?: ClimateFilters) => ['climate', 'list', filters] as const,
    detail: (id: string) => ['climate', 'detail', id] as const,
  },
  simulations: {
    all: ['simulations'] as const,
    detail: (id: string) => ['simulations', 'detail', id] as const,
    status: (id: string) => ['simulations', 'status', id] as const,
  },
};
```

---

## 4. Type System & Code Generation

### 4.1 Generate Types from JSON Schema

```typescript
// scripts/generate-types.ts
import { compile } from 'json-schema-to-typescript';
import fs from 'fs';
import path from 'path';

async function generateTypes() {
  const schemaPath = path.join(__dirname, '../schema.json');
  const outputPath = path.join(__dirname, '../src/types/generated/schema.ts');
  
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  
  const types = await compile(schema, 'SimulationSchema', {
    bannerComment: '/* Auto-generated from schema.json - DO NOT EDIT */',
    style: {
      semi: true,
      singleQuote: true,
    },
  });
  
  fs.writeFileSync(outputPath, types);
  console.log('✅ Types generated successfully');
}

generateTypes();
```

### 4.2 Zod Schemas for Runtime Validation

```typescript
// src/types/generated/schema.ts (example)
import { z } from 'zod';

// Layer validation
export const layerSchema = z.object({
  materialId: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  thickness: z.number().positive().max(10),
});

// Assembly validation
export const assemblySchema = z.object({
  assemblyId: z.string(),
  area: z.number().positive().max(10000),
  orientation: z.object({
    azimuth: z.number().min(0).max(360),
    tilt: z.number().min(0).max(180).default(90),
  }).optional(),
  boundaryConditions: z.object({
    exterior: z.object({
      type: z.enum(['climate', 'ground', 'adjacent-zone']),
      // ...
    }),
    interior: z.object({
      type: z.enum(['zone', 'standardIndoorAir', 'fixed-temperature', 'fixed-humidity']),
      // ...
    }),
  }),
});

// Top-level simulation configuration
export const simulationConfigSchema = z.object({
  simulationType: z.literal('dynamic/component/1d-hygrothermal'),
  configuration: z.object({
    projectData: z.object({
      materials: z.array(/* material schema */),
      assemblies: z.array(/* assembly schema */),
    }),
    assembly: assemblySchema,
    climate: z.object({
      assetId: z.string().regex(/^asset_[a-zA-Z0-9_-]+$/),
    }).or(z.object({
      definition: /* climate definition schema */,
    })),
    simulationSettings: /* simulation settings schema */,
  }),
});

// Type inference
export type Layer = z.infer<typeof layerSchema>;
export type Assembly = z.infer<typeof assemblySchema>;
export type SimulationConfig = z.infer<typeof simulationConfigSchema>;
```

---

## 5. API Integration Layer

### 5.1 Axios Client Setup

```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAppStore } from '@/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.wufi.cloud/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = useAppStore.getState().auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - redirect to login
        useAppStore.getState().actions.logout();
        window.location.href = '/login';
      } else if (status === 429) {
        // Rate limited
        console.error('Rate limit exceeded');
      }
    } else if (error.request) {
      // No response from server
      console.error('Network error - no response');
    }
    
    return Promise.reject(error);
  }
);
```

### 5.2 API Endpoints

```typescript
// src/api/endpoints/simulations.ts
import { apiClient } from '../client';
import { SimulationConfig, SimulationResponse, SimulationStatus } from '@/types';

export const simulationsAPI = {
  // Create simulation
  create: async (config: SimulationConfig): Promise<SimulationResponse> => {
    const response = await apiClient.post('/simulations', {
      data: {
        type: 'simulation',
        attributes: config,
      },
    });
    return response.data;
  },
  
  // Get simulation by ID
  get: async (id: string): Promise<SimulationResponse> => {
    const response = await apiClient.get(`/simulations/${id}`);
    return response.data;
  },
  
  // Run simulation
  run: async (id: string): Promise<void> => {
    await apiClient.post(`/simulations/${id}/run`);
  },
  
  // Get simulation status (for polling)
  getStatus: async (id: string): Promise<SimulationStatus> => {
    const response = await apiClient.get(`/simulations/${id}/status`);
    return response.data;
  },
  
  // Update simulation
  update: async (id: string, config: Partial<SimulationConfig>): Promise<SimulationResponse> => {
    const response = await apiClient.patch(`/simulations/${id}`, {
      data: {
        type: 'simulation',
        attributes: config,
      },
    });
    return response.data;
  },
};
```

### 5.3 React Query Hooks

```typescript
// src/api/hooks/useSimulations.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { simulationsAPI } from '../endpoints/simulations';
import { queryKeys } from '../client';
import { SimulationConfig } from '@/types';
import { toAPIFormat } from '../transformers/toAPI';
import { fromAPIFormat } from '../transformers/fromAPI';

// Create simulation
export function useCreateSimulation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (config: SimulationConfig) => {
      // Transform UI state to API format
      const apiConfig = toAPIFormat(config);
      return await simulationsAPI.create(apiConfig);
    },
    onSuccess: (data) => {
      // Invalidate simulations list
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations.all });
      
      // Transform API response to UI format and update store
      const uiData = fromAPIFormat(data);
      // ... update Zustand store
    },
  });
}

// Run simulation
export function useRunSimulation() {
  return useMutation({
    mutationFn: async (simulationId: string) => {
      return await simulationsAPI.run(simulationId);
    },
  });
}

// Poll simulation status (1 second interval)
export function useSimulationStatus(simulationId: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.simulations.status(simulationId!),
    queryFn: () => simulationsAPI.getStatus(simulationId!),
    enabled: enabled && !!simulationId,
    refetchInterval: 1000, // Poll every 1 second
    refetchIntervalInBackground: true,
  });
}
```

### 5.4 Data Transformers

```typescript
// src/api/transformers/toAPI.ts
import { SimulationConfig } from '@/types/generated/schema';
import { AssemblyState } from '@/features/assembly/types';

/**
 * Transform UI state to API-compliant JSON schema format
 */
export function toAPIFormat(uiState: AssemblyState): SimulationConfig {
  return {
    data: {
      type: 'simulation',
      attributes: {
        name: uiState.project.name,
        description: uiState.project.description,
        simulationType: 'dynamic/component/1d-hygrothermal',
        configuration: {
          projectData: {
            materials: uiState.materials.map(material => ({
              localId: material.id,
              assetId: material.assetId || undefined,
              definition: material.assetId ? undefined : {
                name: material.name,
                thermal: {
                  conductivityDry: material.conductivityDry,
                  densityBulk: material.densityBulk,
                  specificHeatCapacity: material.specificHeatCapacity,
                },
                hygric: material.hygric ? {
                  porosity: material.hygric.porosity,
                  vaporDiffusionResistanceFactor: material.hygric.vaporDiffusionResistanceFactor,
                } : undefined,
              },
            })),
            assemblies: [{
              localId: 'assembly_main',
              definition: {
                name: uiState.assembly.name,
                layers: uiState.assembly.layers.map(layer => ({
                  materialId: layer.materialId,
                  thickness: layer.thickness,
                })),
              },
            }],
          },
          assembly: {
            assemblyId: 'assembly_main',
            area: uiState.assembly.area || 10, // Default 10 m²
            orientation: {
              azimuth: uiState.assembly.orientation?.azimuth || 180, // South
              tilt: uiState.assembly.orientation?.tilt || 90, // Vertical
            },
            surfaceProperties: {
              exterior: {
                solarAbsorptance: uiState.surfaces.exterior.solarAbsorptance || 0.6,
                thermalEmissivity: uiState.surfaces.exterior.thermalEmissivity || 0.9,
              },
              interior: {
                solarAbsorptance: uiState.surfaces.interior.solarAbsorptance || 0.3,
                thermalEmissivity: uiState.surfaces.interior.thermalEmissivity || 0.9,
              },
            },
            boundaryConditions: {
              exterior: {
                type: 'climate',
                convectionCoefficientExterior: uiState.surfaces.exterior.heatResistance 
                  ? 1 / uiState.surfaces.exterior.heatResistance 
                  : 25,
              },
              interior: {
                type: 'standardIndoorAir',
                convectionCoefficientInterior: uiState.surfaces.interior.heatResistance 
                  ? 1 / uiState.surfaces.interior.heatResistance 
                  : 8,
              },
            },
            initialConditions: {
              temperature: uiState.assembly.initialConditions?.temperature || 20,
              relativeHumidity: uiState.assembly.initialConditions?.relativeHumidity || 50,
            },
          },
          climate: {
            assetId: uiState.climate.assetId,
          },
          simulationSettings: {
            calculationMode: 'Hygrothermal',
            calculationStart: uiState.simulationSettings.startDate,
            calculationEnd: uiState.simulationSettings.endDate,
            calculationAccuracy: uiState.simulationSettings.accuracy || 'Medium',
            maximumTimeStep: uiState.simulationSettings.maxTimeStep || 3600,
            minimumTimeStep: uiState.simulationSettings.minTimeStep || 1,
          },
        },
      },
    },
  };
}

// src/api/transformers/fromAPI.ts
import { SimulationResponse } from '@/types/api';
import { AssemblyState } from '@/features/assembly/types';

/**
 * Transform API response to UI state format
 */
export function fromAPIFormat(apiResponse: SimulationResponse): AssemblyState {
  const config = apiResponse.data.attributes.configuration;
  
  return {
    project: {
      id: apiResponse.data.id,
      name: apiResponse.data.attributes.name,
      description: apiResponse.data.attributes.description || '',
    },
    materials: config.projectData.materials.map(m => ({
      id: m.localId,
      assetId: m.assetId,
      name: m.definition?.name || 'Unknown Material',
      conductivityDry: m.definition?.thermal.conductivityDry || 0,
      densityBulk: m.definition?.thermal.densityBulk || 0,
      specificHeatCapacity: m.definition?.thermal.specificHeatCapacity || 0,
      hygric: m.definition?.hygric,
    })),
    assembly: {
      name: config.projectData.assemblies[0].definition?.name || 'Main Assembly',
      layers: config.projectData.assemblies[0].definition?.layers.map((layer, index) => ({
        id: `layer_${index}`,
        materialId: layer.materialId,
        thickness: layer.thickness,
        name: `Layer ${index + 1}`,
        initialTemp: config.assembly.initialConditions?.temperature || 20,
        initialRH: config.assembly.initialConditions?.relativeHumidity || 50,
      })) || [],
      area: config.assembly.area,
      orientation: config.assembly.orientation,
      initialConditions: config.assembly.initialConditions,
    },
    surfaces: {
      exterior: {
        solarAbsorptance: config.assembly.surfaceProperties?.exterior?.solarAbsorptance,
        thermalEmissivity: config.assembly.surfaceProperties?.exterior?.thermalEmissivity,
        heatResistance: config.assembly.boundaryConditions.exterior.convectionCoefficientExterior 
          ? 1 / config.assembly.boundaryConditions.exterior.convectionCoefficientExterior 
          : 0.0588,
      },
      interior: {
        solarAbsorptance: config.assembly.surfaceProperties?.interior?.solarAbsorptance,
        thermalEmissivity: config.assembly.surfaceProperties?.interior?.thermalEmissivity,
        heatResistance: config.assembly.boundaryConditions.interior.convectionCoefficientInterior 
          ? 1 / config.assembly.boundaryConditions.interior.convectionCoefficientInterior 
          : 0.125,
      },
    },
    climate: {
      assetId: config.climate.assetId,
    },
    simulationSettings: {
      startDate: config.simulationSettings.calculationStart,
      endDate: config.simulationSettings.calculationEnd,
      accuracy: config.simulationSettings.calculationAccuracy,
      maxTimeStep: config.simulationSettings.maximumTimeStep,
      minTimeStep: config.simulationSettings.minimumTimeStep,
    },
    monitors: [], // Monitors not in schema yet, handle separately
  };
}
```

---

## 6. Feature Implementation Examples

### 6.1 Assembly Feature - Complete Implementation

```typescript
// src/features/assembly/store/assemblySlice.ts
import { StateCreator } from 'zustand';
import { Layer, Surface, Monitor } from '../types';

export interface AssemblySlice {
  layers: Layer[];
  surfaces: {
    exterior: Surface;
    interior: Surface;
  };
  monitors: Monitor[];
  selectedElement: SelectedElement | null;
  
  // Actions
  addLayer: (layer: Layer) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  deleteLayer: (layerId: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  
  updateSurface: (side: 'exterior' | 'interior', updates: Partial<Surface>) => void;
  
  addMonitor: (monitor: Monitor) => void;
  updateMonitor: (monitorId: string, updates: Partial<Monitor>) => void;
  deleteMonitor: (monitorId: string) => void;
  
  setSelectedElement: (element: SelectedElement | null) => void;
}

export const createAssemblySlice: StateCreator<AssemblySlice> = (set) => ({
  layers: [],
  surfaces: {
    exterior: {
      heatResistance: 0.0588,
      sdValue: 0,
      absorptivity: 0.6,
      rainCoeff: 0.7,
    },
    interior: {
      heatResistance: 0.125,
      sdValue: 0,
      absorptivity: 0.3,
    },
  },
  monitors: [],
  selectedElement: null,
  
  // Add layer with undo/redo tracking
  addLayer: (layer) => set((state) => {
    const newLayers = [...state.layers, layer];
    
    // Push to history
    state.pushHistory({
      type: 'addLayer',
      data: { layer },
      timestamp: Date.now(),
    });
    
    return { layers: newLayers };
  }),
  
  // Update layer with undo/redo tracking
  updateLayer: (layerId, updates) => set((state) => {
    const index = state.layers.findIndex(l => l.id === layerId);
    if (index === -1) return state;
    
    const oldLayer = state.layers[index];
    const newLayers = [...state.layers];
    newLayers[index] = { ...oldLayer, ...updates };
    
    // Push to history
    state.pushHistory({
      type: 'updateLayer',
      data: { layerId, oldValues: oldLayer, newValues: updates },
      timestamp: Date.now(),
    });
    
    return { layers: newLayers };
  }),
  
  // Delete layer with undo/redo tracking
  deleteLayer: (layerId) => set((state) => {
    const layer = state.layers.find(l => l.id === layerId);
    if (!layer) return state;
    
    const newLayers = state.layers.filter(l => l.id !== layerId);
    
    // Push to history
    state.pushHistory({
      type: 'deleteLayer',
      data: { layer },
      timestamp: Date.now(),
    });
    
    return { layers: newLayers };
  }),
  
  // Reorder layers (drag-drop)
  reorderLayers: (fromIndex, toIndex) => set((state) => {
    const newLayers = [...state.layers];
    const [movedLayer] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, movedLayer);
    
    // Push to history
    state.pushHistory({
      type: 'reorderLayers',
      data: { fromIndex, toIndex },
      timestamp: Date.now(),
    });
    
    return { layers: newLayers };
  }),
  
  updateSurface: (side, updates) => set((state) => ({
    surfaces: {
      ...state.surfaces,
      [side]: { ...state.surfaces[side], ...updates },
    },
  })),
  
  addMonitor: (monitor) => set((state) => ({
    monitors: [...state.monitors, monitor],
  })),
  
  updateMonitor: (monitorId, updates) => set((state) => {
    const index = state.monitors.findIndex(m => m.id === monitorId);
    if (index === -1) return state;
    
    const newMonitors = [...state.monitors];
    newMonitors[index] = { ...newMonitors[index], ...updates };
    return { monitors: newMonitors };
  }),
  
  deleteMonitor: (monitorId) => set((state) => ({
    monitors: state.monitors.filter(m => m.id !== monitorId),
  })),
  
  setSelectedElement: (element) => set({ selectedElement: element }),
});

// src/features/assembly/hooks/useAssembly.ts
import { useAppStore } from '@/store';
import { shallow } from 'zustand/shallow';

export function useAssembly() {
  const {
    layers,
    surfaces,
    monitors,
    selectedElement,
    addLayer,
    updateLayer,
    deleteLayer,
    reorderLayers,
    updateSurface,
    addMonitor,
    updateMonitor,
    deleteMonitor,
    setSelectedElement,
  } = useAppStore(
    (state) => ({
      layers: state.assembly.layers,
      surfaces: state.assembly.surfaces,
      monitors: state.assembly.monitors,
      selectedElement: state.assembly.selectedElement,
      addLayer: state.actions.addLayer,
      updateLayer: state.actions.updateLayer,
      deleteLayer: state.actions.deleteLayer,
      reorderLayers: state.actions.reorderLayers,
      updateSurface: state.actions.updateSurface,
      addMonitor: state.actions.addMonitor,
      updateMonitor: state.actions.updateMonitor,
      deleteMonitor: state.actions.deleteMonitor,
      setSelectedElement: state.actions.setSelectedElement,
    }),
    shallow
  );
  
  return {
    layers,
    surfaces,
    monitors,
    selectedElement,
    addLayer,
    updateLayer,
    deleteLayer,
    reorderLayers,
    updateSurface,
    addMonitor,
    updateMonitor,
    deleteMonitor,
    setSelectedElement,
  };
}

// src/features/assembly/hooks/useLayerValidation.ts
import { useMemo } from 'react';
import { Layer } from '../types';

export function useLayerValidation(layer: Layer) {
  const errors = useMemo(() => {
    const errs: string[] = [];
    
    // Thickness validation
    if (layer.thickness <= 0.001) {
      errs.push('Thickness must be greater than 0.001 m');
    }
    if (layer.thickness > 10) {
      errs.push('Thickness must be less than 10 m');
    }
    
    // Initial conditions validation
    if (layer.initialTemp < -50 || layer.initialTemp > 80) {
      errs.push('Initial temperature must be between -50 and 80 °C');
    }
    if (layer.initialRH < 0 || layer.initialRH > 100) {
      errs.push('Initial RH must be between 0 and 100 %');
    }
    
    return errs;
  }, [layer]);
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// src/features/assembly/components/DataTable.tsx
import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { LayerRow } from './LayerRow';
import { useAssembly } from '../hooks/useAssembly';
import { Button } from '@/components/ui/Button';

export function DataTable() {
  const { layers, reorderLayers } = useAssembly();
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const fromIndex = layers.findIndex(l => l.id === active.id);
    const toIndex = layers.findIndex(l => l.id === over.id);
    
    reorderLayers(fromIndex, toIndex);
  };
  
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[40px_40px_1fr_200px_120px_80px_80px] gap-4 px-4 py-3 bg-gray-100 font-semibold text-sm border-b">
        <div></div> {/* Drag handle */}
        <div className="text-center">#</div>
        <div>Layer Name</div>
        <div>Material</div>
        <div className="text-right">Thickness [m]</div>
        <div className="text-right">λ [W/mK]</div>
        <div className="text-center">Actions</div>
      </div>
      
      {/* Table Body */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layers.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {layers.map((layer, index) => (
            <LayerRow key={layer.id} layer={layer} index={index} />
          ))}
        </SortableContext>
      </DndContext>
      
      {/* Table Footer */}
      <div className="px-4 py-3 border-t">
        <Button
          variant="secondary"
          onClick={() => {
            // Open material database modal to add new layer
          }}
        >
          + Add Layer
        </Button>
      </div>
    </div>
  );
}
```

### 6.2 Auto-Save Implementation

```typescript
// src/features/project/hooks/useAutoSave.ts
import { useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppStore } from '@/store';
import { useUpdateSimulation } from '@/api/hooks/useSimulations';

export function useAutoSave() {
  const assembly = useAppStore((state) => state.assembly);
  const simulationId = useAppStore((state) => state.project.simulationId);
  
  const { mutate: updateSimulation } = useUpdateSimulation();
  
  // Debounce assembly state changes (1 second)
  const debouncedAssembly = useDebounce(assembly, 1000);
  
  // Track if this is the first render
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    // Skip auto-save on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Skip if no simulation ID
    if (!simulationId) return;
    
    // Trigger auto-save
    updateSimulation({
      id: simulationId,
      updates: debouncedAssembly,
    });
  }, [debouncedAssembly, simulationId, updateSimulation]);
}

// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

### 6.3 Undo/Redo Implementation

```typescript
// src/features/undo/store/historySlice.ts
import { StateCreator } from 'zustand';

export interface HistorySnapshot {
  type: string;
  data: any;
  timestamp: number;
}

export interface HistorySlice {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  maxSteps: number;
  
  pushHistory: (snapshot: HistorySnapshot) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const createHistorySlice: StateCreator<HistorySlice> = (set, get) => ({
  past: [],
  future: [],
  maxSteps: 20, // Store last 20 actions
  
  pushHistory: (snapshot) => set((state) => {
    const newPast = [...state.past, snapshot];
    
    // Limit history to maxSteps
    if (newPast.length > state.maxSteps) {
      newPast.shift(); // Remove oldest
    }
    
    return {
      past: newPast,
      future: [], // Clear redo stack on new action
    };
  }),
  
  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    
    const newPast = [...state.past];
    const snapshot = newPast.pop()!;
    
    // Apply undo logic based on snapshot type
    switch (snapshot.type) {
      case 'addLayer':
        // Remove the added layer
        state.deleteLayer(snapshot.data.layer.id);
        break;
      case 'deleteLayer':
        // Re-add the deleted layer
        state.addLayer(snapshot.data.layer);
        break;
      case 'updateLayer':
        // Restore old values
        state.updateLayer(snapshot.data.layerId, snapshot.data.oldValues);
        break;
      case 'reorderLayers':
        // Reverse the reorder
        state.reorderLayers(snapshot.data.toIndex, snapshot.data.fromIndex);
        break;
    }
    
    return {
      past: newPast,
      future: [snapshot, ...state.future],
    };
  }),
  
  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    
    const newFuture = [...state.future];
    const snapshot = newFuture.shift()!;
    
    // Apply redo logic (reverse of undo)
    switch (snapshot.type) {
      case 'addLayer':
        state.addLayer(snapshot.data.layer);
        break;
      case 'deleteLayer':
        state.deleteLayer(snapshot.data.layer.id);
        break;
      case 'updateLayer':
        state.updateLayer(snapshot.data.layerId, snapshot.data.newValues);
        break;
      case 'reorderLayers':
        state.reorderLayers(snapshot.data.fromIndex, snapshot.data.toIndex);
        break;
    }
    
    return {
      past: [...state.past, snapshot],
      future: newFuture,
    };
  }),
  
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
});

// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';
import { useAppStore } from '@/store';

export function useKeyboardShortcuts() {
  const { undo, redo, canUndo, canRedo } = useAppStore((state) => ({
    undo: state.actions.undo,
    redo: state.actions.redo,
    canUndo: state.actions.canUndo(),
    canRedo: state.actions.canRedo(),
  }));
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      
      if (!modifier) return;
      
      // Cmd/Ctrl + Z = Undo
      if (e.key === 'z' && !e.shiftKey && canUndo) {
        e.preventDefault();
        undo();
      }
      
      // Cmd/Ctrl + Shift + Z = Redo
      if (e.key === 'z' && e.shiftKey && canRedo) {
        e.preventDefault();
        redo();
      }
      
      // Cmd/Ctrl + S = Manual save
      if (e.key === 's') {
        e.preventDefault();
        // Trigger manual save (bypass debounce)
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
}
```

---

## 7. Performance Optimization

### 7.1 Code Splitting Strategy

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';

// Lazy load heavy features
const MaterialDatabaseModal = lazy(() => 
  import('@/features/materials/components/MaterialDatabaseModal')
);
const ClimateModal = lazy(() => 
  import('@/features/climate/components/ClimateModal')
);
const ResultsView = lazy(() => 
  import('@/features/results/components/ResultsView')
);

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<SetupView />} />
          <Route path="results" element={<ResultsView />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
```

### 7.2 Virtual Scrolling for Material List (1000+ items)

```typescript
// src/features/materials/components/MaterialList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function MaterialList({ materials }: { materials: Material[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: materials.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36, // Row height in pixels
    overscan: 10, // Render 10 extra rows above/below viewport
  });
  
  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const material = materials[virtualRow.index];
          
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <MaterialRow material={material} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 7.3 Memoization Strategy

```typescript
// src/features/assembly/components/AssemblyVisual.tsx
import React, { useMemo } from 'react';
import { Layer } from '../types';

interface AssemblyVisualProps {
  layers: Layer[];
  monitors: Monitor[];
  selectedElement: SelectedElement | null;
}

export const AssemblyVisual = React.memo(({ 
  layers, 
  monitors, 
  selectedElement 
}: AssemblyVisualProps) => {
  // Calculate total thickness once
  const totalThickness = useMemo(() => 
    layers.reduce((sum, layer) => sum + layer.thickness, 0),
    [layers]
  );
  
  // Calculate layer positions once
  const layerPositions = useMemo(() => {
    let position = 0;
    return layers.map(layer => {
      const start = position;
      position += layer.thickness;
      return {
        layerId: layer.id,
        start,
        end: position,
        width: (layer.thickness / totalThickness) * 100, // Percentage
      };
    });
  }, [layers, totalThickness]);
  
  return (
    <div className="assembly-visual">
      {/* Render layers */}
      {layerPositions.map((pos, index) => {
        const layer = layers[index];
        const isSelected = selectedElement?.type === 'layer' && 
                          selectedElement.id === layer.id;
        
        return (
          <LayerBlock
            key={layer.id}
            layer={layer}
            position={pos}
            isSelected={isSelected}
          />
        );
      })}
      
      {/* Render monitors */}
      {monitors.map(monitor => (
        <MonitorIcon
          key={monitor.id}
          monitor={monitor}
          layerPositions={layerPositions}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.layers === nextProps.layers &&
    prevProps.monitors === nextProps.monitors &&
    prevProps.selectedElement === nextProps.selectedElement
  );
});
```

---

## 8. Testing Strategy

### 8.1 Unit Tests (Vitest)

```typescript
// src/features/assembly/hooks/__tests__/useLayerValidation.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLayerValidation } from '../useLayerValidation';
import { Layer } from '../../types';

describe('useLayerValidation', () => {
  it('should validate thickness correctly', () => {
    const layer: Layer = {
      id: 'layer1',
      materialId: 'mat1',
      thickness: 0.0005, // Too small
      name: 'Test Layer',
      initialTemp: 20,
      initialRH: 50,
    };
    
    const { result } = renderHook(() => useLayerValidation(layer));
    
    expect(result.current.isValid).toBe(false);
    expect(result.current.errors).toContain('Thickness must be greater than 0.001 m');
  });
  
  it('should validate initial temperature correctly', () => {
    const layer: Layer = {
      id: 'layer1',
      materialId: 'mat1',
      thickness: 0.1,
      name: 'Test Layer',
      initialTemp: 100, // Too high
      initialRH: 50,
    };
    
    const { result } = renderHook(() => useLayerValidation(layer));
    
    expect(result.current.isValid).toBe(false);
    expect(result.current.errors).toContain('Initial temperature must be between -50 and 80 °C');
  });
  
  it('should pass validation for valid layer', () => {
    const layer: Layer = {
      id: 'layer1',
      materialId: 'mat1',
      thickness: 0.1,
      name: 'Test Layer',
      initialTemp: 20,
      initialRH: 50,
    };
    
    const { result } = renderHook(() => useLayerValidation(layer));
    
    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toHaveLength(0);
  });
});
```

### 8.2 Integration Tests (React Testing Library)

```typescript
// src/features/assembly/components/__tests__/DataTable.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../DataTable';
import { TestWrapper } from '@/tests/utils/TestWrapper';

describe('DataTable', () => {
  it('should render all layers', () => {
    render(
      <TestWrapper>
        <DataTable />
      </TestWrapper>
    );
    
    expect(screen.getByText('Layer