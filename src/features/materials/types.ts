export interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  properties: {
    thermalConductivity: number; // λ [W/(m·K)]
    bulkDensity: number; // ρ [kg/m³]
    porosity: number; // [m³/m³]
    heatCapacity: number; // c [J/(kg·K)]
    moistureDependent: boolean;
    temperatureDependent: boolean;
  };
  hygrothermal?: {
    waterVaporDiffusionResistance: number; // μ [-]
    moistureStorageFunction: string;
    liquidTransportCoefficient: string;
  };
  source: string;
  reference?: string;
  notes?: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

export interface MaterialSubcategory {
  id: string;
  categoryId: string;
  name: string;
  count: number;
}
