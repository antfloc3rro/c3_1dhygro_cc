/**
 * Default values and constants for C3RRO Hygro 1D
 *
 * Centralized configuration for initial values, defaults, and magic numbers.
 * Makes it easier to maintain and update default settings.
 */

// Project Defaults
export const DEFAULT_PROJECT_NAME = 'Untitled Project'
export const DEFAULT_CASE_NAME = 'Base Case'

// Calculation Defaults
export const DEFAULT_START_DATE = () => new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD
export const DEFAULT_DURATION = '1year'
export const DEFAULT_TIME_STEP = 'auto'

// Orientation Defaults
export const DEFAULT_DIRECTION = 'north'
export const DEFAULT_INCLINATION = 90 // degrees (vertical wall)

// Advanced Settings Defaults
export const DEFAULT_INCREASED_ACCURACY = false
export const DEFAULT_ADAPTIVE_TIME_STEP = true
export const DEFAULT_GRID_DISCRETIZATION = 'auto2'

// Layer/Material Defaults
export const DEFAULT_INITIAL_TEMPERATURE = 20 // °C
export const DEFAULT_INITIAL_HUMIDITY = 80 // % RH

// Monitor Defaults
export const DEFAULT_MONITOR_NAME_PREFIX = 'Monitor'
export const DEFAULT_MONITOR_POSITION = 0 // Interface position (0-1)
export const DEFAULT_OUTPUT_INTERVAL = 'hourly' as const

// UI Defaults
export const DEFAULT_UNIT_SYSTEM = 'si' as const
export const DEFAULT_THEME = 'light' as const

// Duration Options
export const DURATION_OPTIONS = [
  { value: '1year', label: '1 year' },
  { value: '3years', label: '3 years' },
  { value: '5years', label: '5 years' },
  { value: '10years', label: '10 years' },
  { value: 'custom', label: 'Custom' },
]

// Time Step Options
export const TIME_STEP_OPTIONS = [
  { value: 'auto', label: 'Automatic' },
  { value: '1hour', label: '1 hour' },
  { value: '6hours', label: '6 hours' },
  { value: '1day', label: '1 day' },
  { value: 'custom', label: 'Custom' },
]

// Direction Options
export const DIRECTION_OPTIONS = [
  { value: 'north', label: 'North' },
  { value: 'ne', label: 'Northeast' },
  { value: 'east', label: 'East' },
  { value: 'se', label: 'Southeast' },
  { value: 'south', label: 'South' },
  { value: 'sw', label: 'Southwest' },
  { value: 'west', label: 'West' },
  { value: 'nw', label: 'Northwest' },
]

// Grid Discretization Options
export const GRID_DISCRETIZATION_OPTIONS = [
  { value: 'auto1', label: 'Automatic (Fine)' },
  { value: 'auto2', label: 'Automatic (Standard)' },
  { value: 'auto3', label: 'Automatic (Coarse)' },
  { value: 'custom', label: 'Custom' },
]

// Panel Dimensions (for responsive design)
export const PANEL_DIMENSIONS = {
  LEFT_PANEL_WIDTH: 288, // px (w-72)
  LEFT_PANEL_MIN_WIDTH: 240, // px
  RIGHT_PANEL_WIDTH: 320, // px (w-80)
  RIGHT_PANEL_MIN_WIDTH: 280, // px
  HEADER_HEIGHT: 60, // px (approximate)
  STATUS_BAR_HEIGHT: 48, // px
}

// Modal Dimensions
export const MODAL_SIZES = {
  sm: 384, // px
  md: 600, // px
  lg: 800, // px
  xl: 1000, // px
  '2xl': 1200, // px
}

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
}

// Validation Limits
export const VALIDATION_LIMITS = {
  MAX_LAYERS: 50,
  MIN_LAYER_THICKNESS: 0.001, // m
  MAX_LAYER_THICKNESS: 2, // m
  MIN_MONITOR_POSITION: 0,
  MAX_MONITOR_POSITION: 1,
  MAX_PROJECT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
}

// Color Constants (C3RRO Design System)
export const COLORS = {
  BLUEGREEN: '#4AB79F',
  DARKGREEN: '#3E7263',
  BLUELIGHT: '#4597BF',
  RED: '#C04343',
  ORANGE: '#E18E2A',
  TEXT: '#33302F',
  GREY_DARK: '#5E5A58',
  GREY_LIGHT: '#BDB2AA',
  WHITE: '#FFFFFF',
}
