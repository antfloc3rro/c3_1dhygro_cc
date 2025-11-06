// Assembly and Component Types
export interface Material {
  id: string;
  name: string;
  manufacturer?: string;
  bulkDensity: number; // kg/m³
  porosity: number; // m³/m³
  heatCapacity: number; // J/kgK
  thermalConductivity: number; // W/mK
  vaporResistanceFactor: number; // [-]
}

export interface Layer {
  id: string;
  material: Material;
  thickness: number; // m (stored in SI units)
  name?: string;
}

export interface Surface {
  id: string;
  name: string;
  type: 'exterior' | 'interior' | 'interface';
}

export interface Monitor {
  id: string;
  position: number; // 0-1 (relative position in layer)
  layerId: string;
  name: string;
}

export interface Assembly {
  id: string;
  name: string;
  layers: Layer[];
  surfaces: Surface[];
  monitors: Monitor[];
  totalThickness: number; // m
}

export interface Case {
  id: string;
  name: string;
  projectId: string;
  assembly: Assembly;
  status: 'draft' | 'ready' | 'running' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  client?: string;
  projectNumber?: string;
  description?: string;
  cases: Case[];
  createdAt: string;
  updatedAt: string;
}

// UI State Types
export type PanelSection = 'component' | 'assembly' | 'orientation' | 'surfaces' | 'climate' | 'control';

export interface UIState {
  selectedCaseId: string | null;
  selectedLayerId: string | null;
  selectedSurfaceId: string | null;
  selectedMonitorId: string | null;
  openModal: string | null;
  expandedPanelSections: Record<PanelSection, boolean>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface SimulationStatus {
  id: string;
  status: 'validating' | 'queued' | 'running' | 'completed' | 'error';
  progress?: number;
  error?: string;
}

export interface MaterialCatalogueItem {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  properties: Material;
}

// Form Types
export interface AssemblyFormData {
  name: string;
  layers: Array<{
    materialId: string;
    thickness: number;
    name?: string;
  }>;
}
