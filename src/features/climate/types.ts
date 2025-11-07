export type ClimateType = 'weather-station' | 'standard' | 'sine-curve' | 'upload';
export type ClimateApplication = 'outdoor' | 'indoor';

export interface ClimateData {
  id: string;
  name: string;
  location?: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
  };
  type: 'preset' | 'location' | 'uploaded' | 'custom' | 'standard' | 'sine-curve';
  source: string;
  dataQuality?: 'measured' | 'synthetic' | 'interpolated';
  period?: {
    start: string;
    end: string;
  };
  variables: {
    temperature: boolean;
    relativeHumidity: boolean;
    precipitation: boolean;
    solarRadiation: boolean;
    windSpeed: boolean;
    windDirection: boolean;
    pressure: boolean;
  };
  // For standard climate types
  standard?: StandardClimateData;
  // For sine curve climate
  sineCurve?: SineCurveData;
  // For uploaded files
  fileData?: EPWData | WACData;
  // Surface parameters (outdoor only)
  surfaceParameters?: {
    heatTransferResistance: number; // (m²·K)/W
    rainCoefficient: number; // 0-1
  };
}

export interface StandardClimateData {
  standard: 'ASHRAE-160' | 'EN-15026' | 'ISO-13788' | 'WTA-6-2';
  parameters: {
    // EN 15026 - Just moisture load
    moistureLoad?: 'low' | 'medium' | 'medium-high' | 'high' | 'very-high';

    // ISO 13788 - Mean temperature and humidity class
    meanTemperature?: number; // °C
    humidityClass?: 1 | 2 | 3 | 4 | 5;

    // ASHRAE 160 - All detailed parameters
    acType?: 'none' | 'ac-only' | 'ac-with-dehumidification';
    floatingTempShift?: number; // °C
    heatingSetpoint?: number; // °C
    coolingSetpoint?: number; // °C
    rhSetpoint?: number; // %
    numBedrooms?: number;
    jettedTub?: boolean;
    userDefinedMoistureGen?: boolean;
    moistureGenRate?: number; // kg/s
    constructionAirtightness?: 'leaky' | 'standard' | 'tight';
    airExchangeRate?: number; // 1/h
    buildingVolume?: number; // m³
  };
}

export interface SineCurveData {
  curveSelection?: string; // e.g., "Indoor Condition, Medium Moisture Load"
  temperature: {
    mean: number; // °C
    amplitude: number; // K
    dayOfMaximum: string; // Date string (e.g., "Jun/03")
  };
  humidity: {
    mean: number; // %
    amplitude: number; // %
    dayOfMaximum: string; // Date string (e.g., "Aug/16")
  };
}

export interface AnnualStatistics {
  temperature: {
    mean: number;
    max: number;
    min: number;
  };
  humidity: {
    mean: number;
    max: number;
    min: number;
  };
  radiation?: {
    annual: number; // kWh/m²
  };
  rain?: {
    annual: number; // mm
  };
  wind?: {
    meanSpeed: number; // m/s
  };
}

export interface ClimatePreset {
  id: string;
  name: string;
  region: string;
  description: string;
  climate: ClimateData;
}

export interface LocationSearchResult {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  availableDatasets: Array<{
    id: string;
    source: string;
    period: { start: string; end: string };
    dataQuality: string;
  }>;
}

export interface EPWData {
  fileName: string;
  fileSize: number;
  location: {
    city: string;
    stateProvince: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: number;
    elevation: number;
  };
  designConditions?: unknown;
  typicalExtremePeriods?: unknown;
  groundTemperatures?: unknown;
  holidaysDaylightSavings?: unknown;
  comments?: string[];
  dataRecords: Array<{
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    dataSource: string;
    dryBulbTemperature: number;
    dewPointTemperature: number;
    relativeHumidity: number;
    atmosphericPressure: number;
    extraterrestrialRadiation: number;
    globalHorizontalRadiation: number;
    directNormalRadiation: number;
    diffuseHorizontalRadiation: number;
    windDirection: number;
    windSpeed: number;
    totalSkyCover: number;
    opaqueSkyCover: number;
    visibility: number;
    ceilingHeight: number;
    presentWeatherObservation: number;
    presentWeatherCodes: string;
    precipitableWater: number;
    aerosolOpticalDepth: number;
    snowDepth: number;
    daysSinceLastSnowfall: number;
    albedo: number;
    liquidPrecipitationDepth: number;
    liquidPrecipitationQuantity: number;
  }>;
  statistics?: AnnualStatistics;
}

export interface WACData {
  fileName: string;
  fileSize: number;
  header: {
    location: string;
    latitude: number;
    longitude: number;
    altitude: number;
    timezone: number;
  };
  data: Array<{
    timestamp: string;
    temperature: number; // °C
    humidity: number; // %
    rain: number; // mm
    radiation: number; // W/m²
    windSpeed: number; // m/s
    windDirection: number; // degrees
  }>;
  statistics?: AnnualStatistics;
}
