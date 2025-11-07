export interface Surface {
  id: string;
  position: number; // Position in assembly (0 = exterior, layers.length = interior)
  type: 'exterior' | 'interior';
  name: string;
  coefficients: SurfaceCoefficients;
}

export interface SurfaceCoefficients {
  // Heat transfer
  heatTransferCoefficient: number; // α [W/(m²·K)]
  shortWaveRadiationAbsorptivity: number; // [-] 0-1
  longWaveRadiationEmissivity: number; // [-] 0-1

  // Moisture transfer
  sdValue?: number; // sd-value [m] for vapor diffusion resistance
  rainAbsorptionFactor?: number; // [-] 0-1 (exterior only)
  rainDepositionFactor?: number; // [-] (exterior only)

  // Advanced
  explicitRadiation?: boolean;
  windDependentCoefficient?: boolean;
  adheredRainwater?: boolean;
}

export interface SurfacePreset {
  id: string;
  name: string;
  type: 'exterior' | 'interior';
  description: string;
  coefficients: SurfaceCoefficients;
}
