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
  type: 'preset' | 'location' | 'uploaded' | 'custom';
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
}
