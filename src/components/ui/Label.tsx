import * as React from 'react';
import { cn } from '../../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-greydark block mb-xs',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
