import React, { forwardRef, useState, useCallback } from 'react'
import { Input, InputProps } from './Input'

export interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  decimals?: number
  unit?: string
  validateOnBlur?: boolean
}

/**
 * NumberInput component for scientific/engineering values
 *
 * Features:
 * - Automatic validation on blur (as per spec: validate on blur, not keystroke)
 * - Min/max range validation
 * - Decimal precision control
 * - Optional unit display
 * - SI unit support
 * - Handles null/empty values
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 'any',
      decimals = 3,
      unit,
      validateOnBlur = true,
      error: externalError,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [internalError, setInternalError] = useState<string | undefined>()
    const [displayValue, setDisplayValue] = useState<string>(
      value !== undefined && value !== null ? value.toString() : ''
    )

    const validate = useCallback(
      (numValue: number | null): string | undefined => {
        if (numValue === null) {
          if (props.required) {
            return 'This field is required'
          }
          return undefined
        }

        if (isNaN(numValue)) {
          return 'Please enter a valid number'
        }

        if (min !== undefined && numValue < min) {
          return `Value must be at least ${min}${unit ? ` ${unit}` : ''}`
        }

        if (max !== undefined && numValue > max) {
          return `Value must be at most ${max}${unit ? ` ${unit}` : ''}`
        }

        return undefined
      },
      [min, max, unit, props.required]
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      setDisplayValue(rawValue)

      // Clear error on change
      if (internalError) {
        setInternalError(undefined)
      }

      // Parse number
      const numValue = rawValue === '' ? null : parseFloat(rawValue)

      // Call onChange immediately for controlled component
      if (onChange) {
        onChange(numValue)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Validate on blur (as per spec)
      if (validateOnBlur) {
        const rawValue = e.target.value
        const numValue = rawValue === '' ? null : parseFloat(rawValue)

        const validationError = validate(numValue)
        setInternalError(validationError)

        // Format display value if valid number
        if (numValue !== null && !isNaN(numValue) && !validationError) {
          setDisplayValue(numValue.toFixed(decimals))
        }
      }

      // Call external onBlur if provided
      if (onBlur) {
        onBlur(e)
      }
    }

    const error = externalError || internalError

    return (
      <Input
        ref={ref}
        type="number"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        min={min}
        max={max}
        step={step}
        rightIcon={
          unit ? (
            <span className="text-xs font-mono" style={{ color: '#5E5A58' }}>
              {unit}
            </span>
          ) : undefined
        }
        {...props}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'
