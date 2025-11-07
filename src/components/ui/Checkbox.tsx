import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/index';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

/**
 * Checkbox component following WUFI Cloud UI/UX v2.1 specification
 *
 * States: unchecked, checked, disabled
 * Transition: 200ms ease-out
 */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ id, checked = false, onCheckedChange, disabled = false, className, label }, ref) => {
    return (
      <div className={cn('flex items-center gap-xs', className)}>
        <button
          ref={ref}
          id={id}
          type="button"
          role="checkbox"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onCheckedChange?.(!checked)}
          className={cn(
            'w-5 h-5 rounded border-2 transition-all duration-200 ease-out',
            'flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bluegreen',
            checked
              ? 'bg-bluegreen border-bluegreen'
              : 'bg-white border-greylight hover:border-greydark',
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer'
          )}
        >
          {checked && (
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          )}
        </button>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'text-sm select-none',
              disabled ? 'text-greydark cursor-not-allowed' : 'text-text cursor-pointer'
            )}
            onClick={() => !disabled && onCheckedChange?.(!checked)}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
