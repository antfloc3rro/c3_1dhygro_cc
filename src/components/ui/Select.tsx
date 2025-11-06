import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/index'

export interface SelectOption<T = string> {
  value: T
  label: string
  description?: string
  disabled?: boolean
}

export interface SelectProps<T = string> {
  label?: string
  value: T | null
  onChange: (value: T) => void
  options: SelectOption<T>[]
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Select component using Headless UI for full accessibility
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Screen reader support (ARIA labels)
 * - Focus management
 * - Disabled state support
 * - Error state with message
 * - Optional descriptions for each option
 * - Transition animations (200ms fade)
 */
export function Select<T = string>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  helperText,
  required,
  disabled,
  className,
}: SelectProps<T>) {
  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: '#33302F' }}>
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              className={cn(
                'relative w-full px-3 py-2 text-sm text-left rounded-md border transition-all duration-200 ease-out',
                'bg-white focus:outline-none',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50',
                error ? 'border-red' : 'border-neutral-300',
                !disabled && 'cursor-pointer hover:border-grey'
              )}
              style={{ color: '#33302F' }}
            >
              <span className="block truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    open && 'transform rotate-180'
                  )}
                  style={{ color: '#5E5A58' }}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg border border-neutral-200 focus:outline-none">
                {options.map((option, optionIdx) => (
                  <Listbox.Option
                    key={optionIdx}
                    value={option.value}
                    disabled={option.disabled}
                    className={({ active, disabled: optDisabled }) =>
                      cn(
                        'relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors duration-150',
                        active && 'bg-neutral-100',
                        optDisabled && 'opacity-50 cursor-not-allowed'
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              'block truncate',
                              selected ? 'font-semibold' : 'font-normal'
                            )}
                            style={{ color: '#33302F' }}
                          >
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="text-xs mt-0.5" style={{ color: '#5E5A58' }}>
                              {option.description}
                            </span>
                          )}
                        </div>

                        {selected && (
                          <span
                            className="absolute inset-y-0 left-0 flex items-center pl-3"
                            style={{ color: '#4AB79F' }}
                          >
                            <Check className="w-4 h-4" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#C04343' }}>
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-xs" style={{ color: '#5E5A58' }}>
          {helperText}
        </p>
      )}
    </div>
  )
}
