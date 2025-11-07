export interface Monitor {
  id: string;
  name: string;
  position: number; // Position in mm from exterior surface
  layerId?: string; // Layer it belongs to (if within a layer)
  type: MonitorType;
  variables: MonitorVariables;
  outputInterval: 'hourly' | 'daily' | 'monthly';
  color: string; // For visual representation
}

export type MonitorType = 'point' | 'average' | 'profile';

export interface MonitorVariables {
  temperature: boolean;
  relativeHumidity: boolean;
  waterContent: boolean;
  heatFlux: boolean;
  vaporFlux: boolean;
  liquidFlux: boolean;
}

export interface MonitorPreset {
  id: string;
  name: string;
  description: string;
  type: MonitorType;
  variables: MonitorVariables;
  outputInterval: 'hourly' | 'daily' | 'monthly';
}
