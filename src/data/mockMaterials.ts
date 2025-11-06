import { Material, MaterialCategory, MaterialSubcategory } from '@/features/materials/types';

export const mockMaterialCategories: MaterialCategory[] = [
  { id: 'insulation', name: 'Insulation Materials', count: 45 },
  { id: 'masonry', name: 'Masonry', count: 32 },
  { id: 'wood', name: 'Wood & Wood Products', count: 28 },
  { id: 'concrete', name: 'Concrete', count: 18 },
  { id: 'metal', name: 'Metals', count: 12 },
  { id: 'membrane', name: 'Membranes & Barriers', count: 24 },
  { id: 'finish', name: 'Finishing Materials', count: 35 },
];

export const mockMaterialSubcategories: MaterialSubcategory[] = [
  // Insulation
  { id: 'ins-mineral', categoryId: 'insulation', name: 'Mineral Wool', count: 12 },
  { id: 'ins-foam', categoryId: 'insulation', name: 'Foam Insulation', count: 15 },
  { id: 'ins-natural', categoryId: 'insulation', name: 'Natural Insulation', count: 10 },
  { id: 'ins-other', categoryId: 'insulation', name: 'Other Insulation', count: 8 },

  // Masonry
  { id: 'mas-brick', categoryId: 'masonry', name: 'Brick', count: 15 },
  { id: 'mas-block', categoryId: 'masonry', name: 'Concrete Blocks', count: 10 },
  { id: 'mas-stone', categoryId: 'masonry', name: 'Natural Stone', count: 7 },

  // Wood
  { id: 'wood-solid', categoryId: 'wood', name: 'Solid Wood', count: 12 },
  { id: 'wood-panel', categoryId: 'wood', name: 'Wood Panels', count: 10 },
  { id: 'wood-fiber', categoryId: 'wood', name: 'Wood Fiber Boards', count: 6 },

  // Concrete
  { id: 'con-standard', categoryId: 'concrete', name: 'Standard Concrete', count: 10 },
  { id: 'con-lightweight', categoryId: 'concrete', name: 'Lightweight Concrete', count: 8 },

  // Metal
  { id: 'metal-steel', categoryId: 'metal', name: 'Steel', count: 6 },
  { id: 'metal-aluminum', categoryId: 'metal', name: 'Aluminum', count: 6 },

  // Membrane
  { id: 'mem-vapor', categoryId: 'membrane', name: 'Vapor Barriers', count: 10 },
  { id: 'mem-air', categoryId: 'membrane', name: 'Air Barriers', count: 8 },
  { id: 'mem-weather', categoryId: 'membrane', name: 'Weather Barriers', count: 6 },

  // Finish
  { id: 'fin-plaster', categoryId: 'finish', name: 'Plaster & Stucco', count: 12 },
  { id: 'fin-gypsum', categoryId: 'finish', name: 'Gypsum Board', count: 8 },
  { id: 'fin-paint', categoryId: 'finish', name: 'Paint & Coatings', count: 15 },
];

export const mockMaterials: Material[] = [
  // Mineral Wool Insulation
  {
    id: 'mat-mw-01',
    name: 'Mineral Wool Insulation (Standard)',
    category: 'insulation',
    subcategory: 'ins-mineral',
    properties: {
      thermalConductivity: 0.040,
      bulkDensity: 50,
      porosity: 0.95,
      heatCapacity: 1030,
      moistureDependent: true,
      temperatureDependent: false,
    },
    hygrothermal: {
      waterVaporDiffusionResistance: 1.3,
      moistureStorageFunction: 'Standard mineral wool curve',
      liquidTransportCoefficient: 'Very low',
    },
    source: 'WUFI Database',
    notes: 'General purpose mineral wool insulation, suitable for most applications.',
  },
  {
    id: 'mat-mw-02',
    name: 'Mineral Wool Insulation (High Density)',
    category: 'insulation',
    subcategory: 'ins-mineral',
    properties: {
      thermalConductivity: 0.035,
      bulkDensity: 120,
      porosity: 0.90,
      heatCapacity: 1030,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },

  // Foam Insulation
  {
    id: 'mat-foam-01',
    name: 'Expanded Polystyrene (EPS)',
    category: 'insulation',
    subcategory: 'ins-foam',
    properties: {
      thermalConductivity: 0.038,
      bulkDensity: 15,
      porosity: 0.95,
      heatCapacity: 1500,
      moistureDependent: false,
      temperatureDependent: false,
    },
    hygrothermal: {
      waterVaporDiffusionResistance: 30,
      moistureStorageFunction: 'Minimal',
      liquidTransportCoefficient: 'Negligible',
    },
    source: 'WUFI Database',
    notes: 'Commonly used foam insulation with good thermal properties.',
  },
  {
    id: 'mat-foam-02',
    name: 'Extruded Polystyrene (XPS)',
    category: 'insulation',
    subcategory: 'ins-foam',
    properties: {
      thermalConductivity: 0.034,
      bulkDensity: 35,
      porosity: 0.90,
      heatCapacity: 1500,
      moistureDependent: false,
      temperatureDependent: false,
    },
    hygrothermal: {
      waterVaporDiffusionResistance: 80,
      moistureStorageFunction: 'Minimal',
      liquidTransportCoefficient: 'Negligible',
    },
    source: 'WUFI Database',
  },
  {
    id: 'mat-foam-03',
    name: 'Polyurethane Foam (PUR)',
    category: 'insulation',
    subcategory: 'ins-foam',
    properties: {
      thermalConductivity: 0.025,
      bulkDensity: 30,
      porosity: 0.95,
      heatCapacity: 1500,
      moistureDependent: false,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
    notes: 'High-performance insulation with very low thermal conductivity.',
  },

  // Natural Insulation
  {
    id: 'mat-nat-01',
    name: 'Cellulose Insulation',
    category: 'insulation',
    subcategory: 'ins-natural',
    properties: {
      thermalConductivity: 0.042,
      bulkDensity: 60,
      porosity: 0.93,
      heatCapacity: 2000,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
    notes: 'Eco-friendly insulation made from recycled paper.',
  },
  {
    id: 'mat-nat-02',
    name: 'Wood Fiber Insulation Board',
    category: 'insulation',
    subcategory: 'ins-natural',
    properties: {
      thermalConductivity: 0.045,
      bulkDensity: 160,
      porosity: 0.85,
      heatCapacity: 2100,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },

  // Brick
  {
    id: 'mat-brick-01',
    name: 'Common Brick',
    category: 'masonry',
    subcategory: 'mas-brick',
    properties: {
      thermalConductivity: 0.700,
      bulkDensity: 1800,
      porosity: 0.30,
      heatCapacity: 840,
      moistureDependent: true,
      temperatureDependent: false,
    },
    hygrothermal: {
      waterVaporDiffusionResistance: 10,
      moistureStorageFunction: 'Standard brick curve',
      liquidTransportCoefficient: 'Moderate',
    },
    source: 'WUFI Database',
  },
  {
    id: 'mat-brick-02',
    name: 'Facing Brick (Dense)',
    category: 'masonry',
    subcategory: 'mas-brick',
    properties: {
      thermalConductivity: 0.900,
      bulkDensity: 2000,
      porosity: 0.25,
      heatCapacity: 840,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },

  // Concrete Blocks
  {
    id: 'mat-block-01',
    name: 'Concrete Block (Hollow)',
    category: 'masonry',
    subcategory: 'mas-block',
    properties: {
      thermalConductivity: 0.510,
      bulkDensity: 1400,
      porosity: 0.35,
      heatCapacity: 850,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },

  // Wood
  {
    id: 'mat-wood-01',
    name: 'Spruce/Pine (Softwood)',
    category: 'wood',
    subcategory: 'wood-solid',
    properties: {
      thermalConductivity: 0.130,
      bulkDensity: 450,
      porosity: 0.70,
      heatCapacity: 1600,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },
  {
    id: 'mat-wood-02',
    name: 'Oak (Hardwood)',
    category: 'wood',
    subcategory: 'wood-solid',
    properties: {
      thermalConductivity: 0.180,
      bulkDensity: 700,
      porosity: 0.60,
      heatCapacity: 1600,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },
  {
    id: 'mat-wood-03',
    name: 'Plywood',
    category: 'wood',
    subcategory: 'wood-panel',
    properties: {
      thermalConductivity: 0.140,
      bulkDensity: 500,
      porosity: 0.65,
      heatCapacity: 1600,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },
  {
    id: 'mat-wood-04',
    name: 'Oriented Strand Board (OSB)',
    category: 'wood',
    subcategory: 'wood-panel',
    properties: {
      thermalConductivity: 0.130,
      bulkDensity: 650,
      porosity: 0.55,
      heatCapacity: 1700,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },

  // Concrete
  {
    id: 'mat-con-01',
    name: 'Concrete (Standard)',
    category: 'concrete',
    subcategory: 'con-standard',
    properties: {
      thermalConductivity: 2.000,
      bulkDensity: 2400,
      porosity: 0.15,
      heatCapacity: 850,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },
  {
    id: 'mat-con-02',
    name: 'Lightweight Concrete',
    category: 'concrete',
    subcategory: 'con-lightweight',
    properties: {
      thermalConductivity: 0.800,
      bulkDensity: 1200,
      porosity: 0.40,
      heatCapacity: 850,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },

  // Membranes
  {
    id: 'mat-mem-01',
    name: 'Polyethylene Vapor Barrier',
    category: 'membrane',
    subcategory: 'mem-vapor',
    properties: {
      thermalConductivity: 2.300,
      bulkDensity: 130,
      porosity: 0.001,
      heatCapacity: 2300,
      moistureDependent: false,
      temperatureDependent: false,
    },
    hygrothermal: {
      waterVaporDiffusionResistance: 50000,
      moistureStorageFunction: 'None',
      liquidTransportCoefficient: 'None',
    },
    source: 'WUFI Database',
    notes: 'Very high vapor resistance, suitable as vapor barrier.',
  },
  {
    id: 'mat-mem-02',
    name: 'Weather Resistive Barrier (WRB)',
    category: 'membrane',
    subcategory: 'mem-weather',
    properties: {
      thermalConductivity: 2.300,
      bulkDensity: 130,
      porosity: 0.001,
      heatCapacity: 2300,
      moistureDependent: false,
      temperatureDependent: false,
    },
    hygrothermal: {
      waterVaporDiffusionResistance: 5,
      moistureStorageFunction: 'None',
      liquidTransportCoefficient: 'None',
    },
    source: 'WUFI Database',
    notes: 'Breathable membrane for weather protection.',
  },

  // Finishing
  {
    id: 'mat-fin-01',
    name: 'Gypsum Board (Standard)',
    category: 'finish',
    subcategory: 'fin-gypsum',
    properties: {
      thermalConductivity: 0.250,
      bulkDensity: 850,
      porosity: 0.65,
      heatCapacity: 870,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },
  {
    id: 'mat-fin-02',
    name: 'Cement Plaster',
    category: 'finish',
    subcategory: 'fin-plaster',
    properties: {
      thermalConductivity: 0.800,
      bulkDensity: 1800,
      porosity: 0.30,
      heatCapacity: 850,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },
  {
    id: 'mat-fin-03',
    name: 'Lime Plaster',
    category: 'finish',
    subcategory: 'fin-plaster',
    properties: {
      thermalConductivity: 0.700,
      bulkDensity: 1600,
      porosity: 0.35,
      heatCapacity: 850,
      moistureDependent: true,
      temperatureDependent: false,
    },
    source: 'WUFI Database',
  },
];
